import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function normPhone(raw: string): string | null {
  const d = (raw || "").replace(/\D/g, "");
  if (d.length === 10) return "+1" + d;
  if (d.length === 11 && d.startsWith("1")) return "+" + d;
  return null;
}

const VERTICALS = ["hvac", "plumbing", "auto", "medspa"] as const;
const VOICES = ["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse", "marin", "cedar"];

// POST /api/try  { business_name, mobile, email, vertical }
// Registers an owner so that when they call the demo line, the agent greets as their business.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const biz = String(body.business_name || "").trim().slice(0, 80);
    const phone = normPhone(String(body.mobile || ""));
    const email = String(body.email || "").trim().slice(0, 120);
    const vertical = VERTICALS.includes(body.vertical) ? body.vertical : "auto";
    const voice = VOICES.includes(body.voice) ? body.voice : "cedar";

    if (!biz || !phone || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Business name, a valid US mobile number, and a valid email are required." },
        { status: 400 }
      );
    }
    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({ ok: false, error: "Service temporarily unavailable." }, { status: 503 });
    }

    const { error } = await supabaseAdmin.from("demo_leads").insert({
      vertical,
      biz_name: biz,
      voice,
      email,
      mobile_e164: phone,
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
      user_agent: req.headers.get("user-agent") || null,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: "Could not save. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, demo_number: "(949) 239-7925" });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
}
