import { NextRequest, NextResponse } from "next/server";

import { notifyChadOfLead } from "@/lib/lead-notify";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { DEMO_PICKER } from "@/lib/voice-agents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface InterestBody {
  vertical?: string;
  firstName?: string;
  bizName?: string;
  email?: string;
  mobile?: string;
  consent?: boolean;
}

export async function POST(req: NextRequest) {
  let body: InterestBody = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Finding 4 — validate + rate-limit before emailing Chad (spam guard).
  const vertical = String(body.vertical ?? "");
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!DEMO_PICKER.some((v) => v.id === vertical)) {
    return NextResponse.json({ error: "Unknown vertical" }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json({ error: "Consent required" }, { status: 400 });
  }

  // Rate limit: max 3 coming-soon submissions per email per 24h.
  if (isSupabaseConfigured()) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("tool_leads")
      .select("id", { count: "exact", head: true })
      .eq("tool_name", "demo-comingsoon")
      .eq("email", email)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      return NextResponse.json(
        { error: "Too many requests — try again later." },
        { status: 429 },
      );
    }
  }

  // Store coming-soon interest in tool_leads (demo_leads.vertical CHECK excludes dental/general).
  // Schema (migrations/001_create_tools_tables.sql): tool_leads has top-level
  // `email`, `business_name`, `phone` columns plus a required `tool_data` jsonb blob.
  // We use the normalized `vertical`/`email` locals (not raw body.*) throughout.
  if (isSupabaseConfigured()) {
    const { error } = await supabaseAdmin.from("tool_leads").insert({
      tool_name: "demo-comingsoon",
      email,
      business_name: body.bizName ?? null,
      phone: body.mobile ?? null,
      tool_data: {
        vertical,
        first_name: body.firstName ?? null,
        biz_name: body.bizName ?? null,
        email,
        mobile: body.mobile ?? null,
      },
    });
    if (error) {
      console.error("[demos/interest] insert failed:", error.message);
      return NextResponse.json({ error: "Could not save lead" }, { status: 500 });
    }
  }

  await notifyChadOfLead({
    vertical,
    firstName: body.firstName,
    bizName: body.bizName,
    email,
    mobile: body.mobile,
    comingSoon: true,
  });

  return NextResponse.json({ ok: true, comingSoon: true });
}
