import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Normalize a US phone to E.164 (+1XXXXXXXXXX). Returns null if not parseable.
function normPhone(raw: string): string | null {
  const d = (raw || "").replace(/\D/g, "");
  if (d.length === 10) return "+1" + d;
  if (d.length === 11 && d.startsWith("1")) return "+" + d;
  return null;
}

// GET /api/demo-business?phone=+19498048225
// Called by the FreeSWITCH demo agent (ai_assistant_demo.lua) at call start to
// resolve the caller's pre-registered business name so it can greet as their business.
export async function GET(req: NextRequest) {
  const phone = normPhone(req.nextUrl.searchParams.get("phone") || "");
  if (!phone || !isSupabaseConfigured() || !supabaseAdmin) {
    return NextResponse.json({ business_name: null });
  }
  const { data } = await supabaseAdmin
    .from("demo_leads")
    .select("biz_name, voice, biz_config, vertical")
    .eq("mobile_e164", phone)
    .not("biz_name", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const cfg = (data?.biz_config ?? null) as null | {
    summary?: string; services?: string[]; greeting?: string;
  };
  return NextResponse.json({
    business_name: data?.biz_name || null,
    voice: data?.voice || null,
    industry: data?.vertical || null,
    summary: cfg?.summary || null,
    services: cfg?.services?.join(", ") || null,
    greeting: cfg?.greeting || null,
  });
}
