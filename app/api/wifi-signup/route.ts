import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BEEHIIV_API_BASE = "https://api.beehiiv.com/v2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  let body: {
    email?: string;
    mac?: string;
    ap?: string;
    ssid?: string;
    site?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.error("[wifi-signup] Beehiiv env not configured");
    return NextResponse.json(
      { success: true, queued: false, message: "Connected." },
      { status: 200, headers: CORS_HEADERS },
    );
  }

  try {
    const res = await fetch(
      `${BEEHIIV_API_BASE}/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "wifi_captive_portal",
          utm_medium: "guest_wifi",
          utm_campaign: body.site || "stack_office",
          referring_site: body.ssid || "Stack Consulting Guest",
          custom_fields: [
            { name: "signup_source", value: "wifi_portal" },
            { name: "ap_mac", value: body.ap || "" },
            { name: "client_mac", value: body.mac || "" },
          ],
        }),
        signal: AbortSignal.timeout(15000),
      },
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("[wifi-signup] Beehiiv error:", res.status, data);
      return NextResponse.json(
        { success: true, queued: false, message: "Connected." },
        { status: 200, headers: CORS_HEADERS },
      );
    }

    return NextResponse.json(
      { success: true, queued: true, message: "Subscribed and connected." },
      { status: 200, headers: CORS_HEADERS },
    );
  } catch (err) {
    console.error("[wifi-signup] request failed:", err);
    return NextResponse.json(
      { success: true, queued: false, message: "Connected." },
      { status: 200, headers: CORS_HEADERS },
    );
  }
}
