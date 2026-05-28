/**
 * SMS lib — Telnyx Messaging API wrapper.
 *
 * In dev mode (no TELNYX_API_KEY or no TELNYX_SENDER_NUMBER), this is a stub
 * that logs to console and returns success — so local development works without
 * burning real SMS. Production must have both env vars set.
 */

const TELNYX_MESSAGES_URL = "https://api.telnyx.com/v2/messages";

export function isTelnyxConfigured(): boolean {
  return Boolean(
    process.env.TELNYX_API_KEY && process.env.TELNYX_SENDER_NUMBER,
  );
}

/** Generate a 6-digit numeric code. */
export function generateSmsCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Normalize a user-supplied phone string to E.164 (US-default). Returns null when invalid. */
export function normalizeToE164(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (raw.startsWith("+") && digits.length >= 11 && digits.length <= 15) {
    return `+${digits}`;
  }
  return null;
}

export interface SmsResult {
  ok: boolean;
  id: string | null;
  error: string | null;
}

/** Send the 6-digit verification code via Telnyx. Dev mode: logs + returns ok. */
export async function sendVerificationCode(
  toE164: string,
  code: string,
): Promise<SmsResult> {
  if (!isTelnyxConfigured()) {
    console.warn(
      `[sms] Telnyx not configured. STUB SMS → ${toE164}: code ${code}`,
    );
    return { ok: true, id: "stub", error: null };
  }

  const body = {
    from: process.env.TELNYX_SENDER_NUMBER,
    to: toE164,
    text: `Your Stack Consulting AI demo code: ${code}. Expires in 10 minutes.`,
  };

  try {
    const res = await fetch(TELNYX_MESSAGES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TELNYX_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[sms] Telnyx error ${res.status}: ${text}`);
      return { ok: false, id: null, error: `Telnyx ${res.status}` };
    }

    const json = (await res.json().catch(() => ({}))) as {
      data?: { id?: string };
    };
    return { ok: true, id: json.data?.id ?? null, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[sms] Telnyx fetch failed: ${msg}`);
    return { ok: false, id: null, error: msg };
  }
}

/** Reveal-message after verify: tell the prospect the demo number to call. */
export async function sendDidReveal(
  toE164: string,
  did: string,
  vertical: string,
): Promise<SmsResult> {
  if (!isTelnyxConfigured()) {
    console.warn(
      `[sms] Telnyx not configured. STUB DID-REVEAL → ${toE164}: ${vertical} demo at ${did}`,
    );
    return { ok: true, id: "stub", error: null };
  }
  const body = {
    from: process.env.TELNYX_SENDER_NUMBER,
    to: toE164,
    text:
      `Stack Consulting AI ${vertical} demo: call ${did} now. ` +
      `Your call-report email will arrive ~90 seconds after you hang up.`,
  };

  try {
    const res = await fetch(TELNYX_MESSAGES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TELNYX_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return { ok: false, id: null, error: `Telnyx ${res.status}` };
    }
    const json = (await res.json().catch(() => ({}))) as {
      data?: { id?: string };
    };
    return { ok: true, id: json.data?.id ?? null, error: null };
  } catch (err) {
    return {
      ok: false,
      id: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
