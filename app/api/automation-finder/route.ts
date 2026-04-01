import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

interface AutomationFinderRequest {
  businessName: string;
  industry: string;
  teamSize: string;
  revenueRange: string;
  painPoints: string[];
  otherPainPoint?: string;
  currentTools: string[];
  name: string;
  email: string;
  phone?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    return first || null;
  }
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    null
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: AutomationFinderRequest = await request.json();
    const {
      businessName,
      industry,
      teamSize,
      revenueRange,
      painPoints,
      otherPainPoint,
      currentTools,
      name,
      email,
      phone,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Await Supabase save to avoid dropping leads on serverless
    if (isSupabaseConfigured()) {
      const { error: dbError } = await supabaseAdmin
        .from("tool_leads")
        .insert({
          tool_name: "automation-finder",
          tool_data: {
            industry,
            team_size: teamSize,
            revenue_range: revenueRange,
            pain_points: painPoints,
            other_pain_point: otherPainPoint || null,
            current_tools: currentTools,
            contact_name: name,
          },
          email,
          phone: phone || null,
          business_name: businessName || name,
          ip_address: getClientIp(request),
          user_agent: request.headers.get("user-agent"),
        });

      if (dbError) {
        console.error("Supabase insert error:", dbError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Automation finder error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
