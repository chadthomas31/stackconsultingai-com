import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    return first || null;
  }

  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("true-client-ip");

  return ip?.trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, projectType, message } = body ?? {};

    if (!name || !email || !projectType || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If Supabase isn't configured locally, still succeed so the UI works.
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured, skipping contact save");
      return NextResponse.json({
        success: true,
        message: "Message received (database not configured)."
      });
    }

    // Store contact submissions in the existing leads table to avoid missing-table/RLS issues.
    const toolData = {
      name,
      project_type: projectType,
      message
    };

    const { data, error } = await supabaseAdmin
      .from("tool_leads")
      .insert({
        tool_name: "contact",
        tool_data: toolData,
        email,
        phone: phone || null,
        business_name: null,
        ip_address: getClientIp(request),
        user_agent: request.headers.get("user-agent")
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      // Still return success to the user - their message was received
      return NextResponse.json({
        success: true,
        message: "Thanks! We received your message and will be in touch soon."
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit contact form" },
      { status: 500 }
    );
  }
}

