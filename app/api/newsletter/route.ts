import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BEEHIIV_API_BASE = "https://api.beehiiv.com/v2";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: { email?: string; utm_source?: string; utm_medium?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    // Dev/un-configured fallback — tell the client to open the Beehiiv
    // subscribe page directly so no signup is lost. Beehiiv reads the
    // address from `primary_email`; using `email` silently drops it.
    const fallbackBase =
      process.env.NEXT_PUBLIC_BEEHIIV_SUBSCRIBE_URL ||
      "https://stackconsultingai.beehiiv.com/subscribe";
    return NextResponse.json(
      {
        success: false,
        error: "Newsletter is temporarily unavailable. Please try again.",
        fallbackUrl: `${fallbackBase}?primary_email=${encodeURIComponent(email)}`,
      },
      { status: 503 },
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
          utm_source: body.utm_source || "website",
          utm_medium: body.utm_medium || "newsletter_section",
          utm_campaign: "organic",
        }),
        signal: AbortSignal.timeout(15000),
      },
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("[newsletter] Beehiiv error:", res.status, data);
      return NextResponse.json(
        {
          success: false,
          error:
            typeof data?.errors?.[0]?.message === "string"
              ? data.errors[0].message
              : "Subscription failed. Please try again.",
        },
        { status: res.status >= 500 ? 502 : 400 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[newsletter] request failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Network error. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
