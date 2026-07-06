import { NextRequest, NextResponse } from "next/server";

import { isVertical } from "@/lib/voice-agents";
import {
  countLeadsByEmail24h,
  countLeadsByIp24h,
  countLeadsByMobile24h,
  createDemoLead,
} from "@/lib/demo-leads-db";
import {
  generateSmsCode,
  normalizeToE164,
  sendVerificationCode,
} from "@/lib/sms";
import { notifyChadOfLead } from "@/lib/lead-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RATE_LIMIT = 1;
const MOBILE_RATE_LIMIT = 1;
const IP_RATE_LIMIT = 5;

function getClientIp(req: NextRequest): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    null
  );
}

function isTurnstileEnforced(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  );
}

type TurnstileVerifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

/** Verify a Cloudflare Turnstile token against the siteverify endpoint. */
async function verifyTurnstile(
  token: string,
  remoteIp: string | null,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          response: token,
          ...(remoteIp ? { remoteip: remoteIp } : {}),
        }),
      },
    );
    const json = (await res.json().catch(() => ({}))) as TurnstileVerifyResponse;
    if (!json.success) {
      console.warn(
        "[demos/start] Turnstile verify failed:",
        json["error-codes"]?.join(", ") ?? "unknown",
      );
    }
    return Boolean(json.success);
  } catch (err) {
    console.warn(
      "[demos/start] Turnstile verify error:",
      err instanceof Error ? err.message : String(err),
    );
    return false;
  }
}

interface StartBody {
  vertical?: string;
  firstName?: string;
  bizName?: string;
  email?: string;
  mobile?: string;
  turnstileToken?: string;
}

export async function POST(req: NextRequest) {
  let body: StartBody = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isVertical(body.vertical)) {
    return NextResponse.json({ error: "Unknown vertical" }, { status: 400 });
  }
  if (!body.email || !body.mobile) {
    return NextResponse.json(
      { error: "Email and mobile required" },
      { status: 400 },
    );
  }

  const mobileE164 = normalizeToE164(body.mobile);
  if (!mobileE164) {
    return NextResponse.json(
      { error: "Mobile number invalid — US 10-digit format expected" },
      { status: 400 },
    );
  }

  const ip = getClientIp(req);

  if (isTurnstileEnforced()) {
    if (!body.turnstileToken) {
      return NextResponse.json(
        { error: "Complete the security check below the form" },
        { status: 400 },
      );
    }
    const turnstileOk = await verifyTurnstile(body.turnstileToken, ip);
    if (!turnstileOk) {
      return NextResponse.json(
        { error: "Bot check failed — refresh and try again" },
        { status: 400 },
      );
    }
  }

  // Rate limits — count first, refuse before we ever generate a code or burn an SMS.
  const [byEmail, byMobile, byIp] = await Promise.all([
    countLeadsByEmail24h(body.email),
    countLeadsByMobile24h(mobileE164),
    ip ? countLeadsByIp24h(ip) : Promise.resolve(0),
  ]);
  if (byEmail >= EMAIL_RATE_LIMIT) {
    return NextResponse.json(
      { error: "You&rsquo;ve already requested a demo with this email today." },
      { status: 429 },
    );
  }
  if (byMobile >= MOBILE_RATE_LIMIT) {
    return NextResponse.json(
      { error: "This phone already has a demo in the last 24h." },
      { status: 429 },
    );
  }
  if (byIp >= IP_RATE_LIMIT) {
    return NextResponse.json(
      { error: "Too many demo requests from this network today." },
      { status: 429 },
    );
  }

  const smsCode = generateSmsCode();

  const inserted = await createDemoLead({
    vertical: body.vertical,
    firstName: body.firstName,
    bizName: body.bizName,
    email: body.email,
    mobileE164,
    smsCode,
    ip,
    userAgent: req.headers.get("user-agent"),
    turnstileToken: body.turnstileToken ?? null,
  });
  if (!inserted.id) {
    return NextResponse.json(
      { error: inserted.error ?? "Could not save lead" },
      { status: 500 },
    );
  }

  await notifyChadOfLead({
    vertical: body.vertical,
    firstName: body.firstName,
    bizName: body.bizName,
    email: body.email,
    mobile: mobileE164,
    comingSoon: false,
  });

  const sms = await sendVerificationCode(mobileE164, smsCode);
  if (!sms.ok) {
    // We saved the lead, but couldn't text the code. Surface a recoverable error;
    // the lead is still in DB so a manual follow-up can happen.
    return NextResponse.json(
      { error: "Could not send SMS code — please try again in a moment." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    leadId: inserted.id,
    sentTo: mobileE164,
  });
}
