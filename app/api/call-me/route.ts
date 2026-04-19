import { NextRequest } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(req: NextRequest): string | null {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("true-client-ip") ??
    null
  );
}

type Stage = {
  id: string;
  label: string;
  detail: string;
  delayMs: number;
};

const STAGES: Stage[] = [
  {
    id: "validated",
    label: "Number validated",
    detail: "E.164 format accepted",
    delayMs: 90,
  },
  {
    id: "queued",
    label: "Request queued in dispatcher",
    detail: "Stacks backlog: 0 ahead",
    delayMs: 420,
  },
  {
    id: "notified",
    label: "Chad paged via SMS",
    detail: "Expert notification sent",
    delayMs: 620,
  },
  {
    id: "scheduled",
    label: "Call window confirmed",
    detail: "Callback inside the next 2\u20134 hours",
    delayMs: 380,
  },
];

const enc = new TextEncoder();

function sse(event: string, data: unknown) {
  return enc.encode(
    `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
  );
}

function normalizePhone(raw: string) {
  return raw.replace(/[^\d]/g, "");
}

export async function POST(req: NextRequest) {
  let body: { phone?: string; industry?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const digits = normalizePhone(body.phone ?? "");
  if (digits.length < 10 || digits.length > 11) {
    return new Response(
      JSON.stringify({ error: "Please enter a valid US phone number." }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const industry = (body.industry ?? "other").toString().slice(0, 40);
  const e164 = digits.length === 11 ? `+${digits}` : `+1${digits}`;
  const startedAt = Date.now();

  // Persist the lead so Chad actually gets it. The UI streams theater after —
  // this is the real write. Non-blocking on failure (stream still runs).
  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("tool_leads").insert({
        tool_name: "call-me",
        tool_data: { industry, source: "free_assessment_offer" },
        email: null,
        phone: e164,
        business_name: null,
        ip_address: getClientIp(req),
        user_agent: req.headers.get("user-agent"),
      });
    } catch (err) {
      console.error("call-me lead insert failed:", err);
    }
  } else {
    console.warn("Supabase not configured, call-me lead not persisted:", e164);
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

      controller.enqueue(
        sse("start", {
          phone: e164,
          industry,
          startedAt,
          totalStages: STAGES.length,
        }),
      );

      let elapsed = 0;
      for (let i = 0; i < STAGES.length; i++) {
        const stage = STAGES[i];
        await wait(stage.delayMs);
        elapsed += stage.delayMs;
        controller.enqueue(
          sse("stage", {
            index: i,
            id: stage.id,
            label: stage.label,
            detail: stage.detail,
            elapsedMs: elapsed,
          }),
        );
      }

      await wait(120);
      controller.enqueue(
        sse("done", {
          ok: true,
          totalMs: Date.now() - startedAt,
          phone: e164,
          industry,
        }),
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
      connection: "keep-alive",
    },
  });
}
