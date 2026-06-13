import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Gated behind contact capture — the number is returned ONLY after a valid
// submission, so it never ships in client JS. This is the live SCA line; its
// FusionPBX IVR routes callers to the OpenAI Realtime agent (ext 5002).
const DEMO_NUMBER_DISPLAY = "(949) 749-0001";
const DEMO_NUMBER_TEL = "+19497490001";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";
  const businessName = typeof body.businessName === "string" ? body.businessName.trim() : "";

  if (name.length < 2) {
    return NextResponse.json({ success: false, error: "Please enter your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (phone && phone.length !== 10) {
    return NextResponse.json(
      { success: false, error: "Enter a 10-digit US phone number, or leave it blank." },
      { status: 400 },
    );
  }

  // Best-effort lead capture — never block the reveal on a DB hiccup.
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabaseAdmin.from("tool_leads").insert({
        tool_name: "demo-reveal",
        tool_data: { contact_name: name, demo: "voice-inbound" },
        email,
        phone: phone || null,
        business_name: businessName || name,
        ip_address: getClientIp(req),
        user_agent: req.headers.get("user-agent"),
      });
      if (error) console.error("demo-reveal insert error:", error);
    } catch (e) {
      console.error("demo-reveal insert threw:", e);
    }
  }

  return NextResponse.json({
    success: true,
    number: DEMO_NUMBER_DISPLAY,
    tel: DEMO_NUMBER_TEL,
  });
}
