import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { Resend } from "resend";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Inbound SMS/MMS webhook for Telnyx messaging profiles.
 * Telnyx POSTs every message event here. For `message.received` we:
 *   1. log the text as a `tool_leads` row (tool_name = "sms_inbound"),
 *   2. forward it as a text to SMS_FORWARD_TO (Chad's cell), sent from the DID that received it,
 *   3. email a copy to LEAD_NOTIFY_EMAIL via Resend.
 * Auth: `?key=` must equal TELNYX_INBOUND_SECRET. If TELNYX_PUBLIC_KEY is set we also verify
 * Telnyx's Ed25519 signature (telnyx-signature-ed25519 + telnyx-timestamp over "ts|body").
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface TelnyxEvent {
  data?: {
    event_type?: string;
    id?: string;
    payload?: {
      id?: string;
      direction?: string;
      from?: { phone_number?: string; carrier?: string };
      to?: { phone_number?: string }[];
      text?: string;
      media?: { url?: string; content_type?: string }[];
      received_at?: string;
    };
  };
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

function verifyEd25519(req: NextRequest, rawBody: string, pubB64: string) {
  const sig = req.headers.get("telnyx-signature-ed25519");
  const ts = req.headers.get("telnyx-timestamp");
  if (!sig || !ts) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  try {
    // Telnyx publishes a raw 32-byte Ed25519 key; wrap it in SPKI DER for node:crypto.
    const der = Buffer.concat([
      Buffer.from("302a300506032b6570032100", "hex"),
      Buffer.from(pubB64, "base64"),
    ]);
    const key = crypto.createPublicKey({ key: der, format: "der", type: "spki" });
    return crypto.verify(null, Buffer.from(`${ts}|${rawBody}`), key, Buffer.from(sig, "base64"));
  } catch {
    return false;
  }
}

function authorized(req: NextRequest, rawBody: string) {
  const secret = process.env.TELNYX_INBOUND_SECRET;
  const pub = process.env.TELNYX_PUBLIC_KEY;
  if (!secret && !pub) return process.env.NODE_ENV !== "production"; // dev only
  if (secret) {
    const key = req.nextUrl.searchParams.get("key") ?? "";
    if (!safeEqual(key, secret)) return false;
  }
  if (pub && !verifyEd25519(req, rawBody, pub)) return false;
  return true;
}

function pretty(e164: string | undefined) {
  if (!e164) return "unknown";
  const d = e164.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return e164;
}

async function sendTelnyx(from: string, to: string, text: string) {
  if (!process.env.TELNYX_API_KEY) return { ok: false, error: "TELNYX_API_KEY missing" };
  const res = await fetch("https://api.telnyx.com/v2/messages", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.TELNYX_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, text }),
  });
  return { ok: res.ok, error: res.ok ? null : `Telnyx ${res.status}` };
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  if (!authorized(req, rawBody)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let evt: TelnyxEvent;
  try {
    evt = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const type = evt.data?.event_type ?? "";
  const p = evt.data?.payload;
  // Delivery receipts for our own outbound texts also land here. Acknowledge and move on.
  if (type !== "message.received" || !p || p.direction !== "inbound") {
    return NextResponse.json({ ok: true, ignored: type || "no-event" });
  }

  const from = p.from?.phone_number ?? "";
  const to = p.to?.[0]?.phone_number ?? "";
  const text = (p.text ?? "").trim();
  const media = (p.media ?? []).filter((m) => m.url);
  const summary = text || (media.length ? `[${media.length} attachment${media.length > 1 ? "s" : ""}]` : "[empty]");
  const isShortCode = from.replace(/\D/g, "").length <= 6;

  const results: Record<string, unknown> = { logged: false, forwarded: false, emailed: false };

  // 1. Log to Supabase (tool_leads, tool_name = sms_inbound).
  if (isSupabaseConfigured()) {
    const { error } = await supabaseAdmin.from("tool_leads").insert({
      phone: from,
      tool_name: "sms_inbound",
      tool_data: {
        to,
        text,
        media: media.map((m) => ({ url: m.url, content_type: m.content_type })),
        telnyx_message_id: p.id ?? evt.data?.id ?? null,
        carrier: p.from?.carrier ?? null,
        received_at: p.received_at ?? new Date().toISOString(),
        short_code: isShortCode,
      },
    });
    results.logged = !error;
    if (error) console.error("[sms-inbound] supabase insert failed:", error.message);
  }

  // 2. Forward to Chad's cell. Skip short-code senders (carrier/verification spam).
  // Send from a 10DLC-registered number (SMS_FORWARD_FROM / TELNYX_SENDER_NUMBER); carriers reject
  // unregistered senders (Telnyx 40010), so the receiving DID is only a last resort.
  const forwardTo = process.env.SMS_FORWARD_TO;
  const forwardFrom = process.env.SMS_FORWARD_FROM || process.env.TELNYX_SENDER_NUMBER || to;
  if (forwardTo && forwardFrom && !isShortCode && from !== forwardTo) {
    const body = `Text to ${pretty(to)} from ${pretty(from)}:\n${summary}`;
    const r = await sendTelnyx(forwardFrom, forwardTo, body.slice(0, 1500));
    results.forwarded = r.ok;
    if (!r.ok) console.error("[sms-inbound] forward failed:", r.error);
  }

  // 3. Email a copy.
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const notifyTo = process.env.LEAD_NOTIFY_EMAIL ?? "chad@stackconsultingai.com";
    const mediaLines = media.map((m) => `Attachment: ${m.url}`).join("\n");
    const { error } = await resend.emails.send({
      from: "Stack Consulting AI <stacks@stackconsultingai.com>",
      to: [notifyTo],
      subject: `${isShortCode ? "[short code] " : ""}Text to ${pretty(to)} from ${pretty(from)}`,
      text: `From: ${from}\nTo: ${to}\nReceived: ${p.received_at ?? new Date().toISOString()}\n\n${summary}${mediaLines ? "\n\n" + mediaLines : ""}\n\nReply from the Telnyx portal or the PBX; replying to this email does not text them back.`,
    });
    results.emailed = !error;
    if (error) console.error("[sms-inbound] resend failed:", error.message);
  }

  return NextResponse.json({ ok: true, ...results });
}
