/**
 * Free-tool rate limiting.
 *
 * Anonymous: 5 runs per IP per tool per 24h.
 * Email-captured (cookie present): 25 runs per IP per tool per 24h.
 *
 * Fail-open: if Supabase is unreachable, requests are allowed. Better to
 * over-serve than to wrongly block legit users on infra hiccup.
 *
 * IPs are SHA-256(ip + RATE_LIMIT_SALT) before storage. Never log raw IP.
 */

import { createHash } from "crypto";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

const ANON_LIMIT_PER_DAY = 5;
const EMAIL_LIMIT_PER_DAY = 25;
const WINDOW_MS = 24 * 60 * 60 * 1000;

const SALT =
  process.env.RATE_LIMIT_SALT ?? "stackconsultingai-default-salt-rotate-me";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
  retry_at_ms: number | null;
  /** True if Supabase was unreachable and we failed open. */
  fail_open: boolean;
};

/** Pull the client IP out of a Next.js Request, considering Vercel headers. */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "0.0.0.0";
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(`${ip}:${SALT}`).digest("hex");
}

/** Cookie name set by tool UIs after a successful newsletter signup. */
export const EMAIL_GATE_COOKIE = "tool_email_captured";

/** True if the request includes the email-capture cookie. */
export function hasEmailCookie(req: Request): boolean {
  const cookie = req.headers.get("cookie") ?? "";
  return cookie.split(";").some((c) => c.trim().startsWith(`${EMAIL_GATE_COOKIE}=1`));
}

export async function checkRateLimit(opts: {
  ipHash: string;
  toolSlug: string;
  emailCaptured: boolean;
}): Promise<RateLimitResult> {
  const limit = opts.emailCaptured ? EMAIL_LIMIT_PER_DAY : ANON_LIMIT_PER_DAY;

  if (!isSupabaseConfigured()) {
    return {
      allowed: true,
      remaining: limit,
      limit,
      retry_at_ms: null,
      fail_open: true,
    };
  }

  const sinceIso = new Date(Date.now() - WINDOW_MS).toISOString();

  try {
    const { data, error } = await supabaseAdmin
      .from("tool_runs")
      .select("ran_at", { count: "exact", head: false })
      .eq("ip_hash", opts.ipHash)
      .eq("tool_slug", opts.toolSlug)
      .gte("ran_at", sinceIso)
      .order("ran_at", { ascending: true })
      .limit(limit);

    if (error) {
      // Table likely missing or transient DB error — fail open, log later.
      return {
        allowed: true,
        remaining: limit,
        limit,
        retry_at_ms: null,
        fail_open: true,
      };
    }

    const used = data?.length ?? 0;
    const remaining = Math.max(0, limit - used);

    if (used < limit) {
      return {
        allowed: true,
        remaining: remaining - 1, // about to consume one
        limit,
        retry_at_ms: null,
        fail_open: false,
      };
    }

    // Over limit — compute when the OLDEST run in the window will fall out.
    const oldest = data?.[0]?.ran_at;
    const retry_at_ms = oldest
      ? new Date(oldest).getTime() + WINDOW_MS
      : Date.now() + WINDOW_MS;

    return {
      allowed: false,
      remaining: 0,
      limit,
      retry_at_ms,
      fail_open: false,
    };
  } catch {
    return {
      allowed: true,
      remaining: limit,
      limit,
      retry_at_ms: null,
      fail_open: true,
    };
  }
}

export async function recordRun(opts: {
  ipHash: string;
  toolSlug: string;
  emailCaptured: boolean;
  userAgent?: string | null;
}): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabaseAdmin.from("tool_runs").insert({
      ip_hash: opts.ipHash,
      tool_slug: opts.toolSlug,
      email_captured: opts.emailCaptured,
      user_agent: opts.userAgent ?? null,
    });
  } catch {
    // Swallow — rate-limit tracking shouldn't break the user's request.
  }
}

/** One-shot helper: gather request context, check, and (on allow) record. */
export async function enforceRateLimit(
  req: Request,
  toolSlug: string,
): Promise<RateLimitResult> {
  const ip = getClientIp(req);
  const ipHash = hashIp(ip);
  const emailCaptured = hasEmailCookie(req);

  const result = await checkRateLimit({ ipHash, toolSlug, emailCaptured });

  if (result.allowed && !result.fail_open) {
    await recordRun({
      ipHash,
      toolSlug,
      emailCaptured,
      userAgent: req.headers.get("user-agent"),
    });
  }

  return result;
}

export function rateLimitErrorPayload(result: RateLimitResult, toolSlug: string) {
  return {
    error: "Daily limit reached for this free tool.",
    rate_limited: true,
    tool: toolSlug,
    limit: result.limit,
    retry_at: result.retry_at_ms
      ? new Date(result.retry_at_ms).toISOString()
      : null,
    suggest: {
      message:
        "Subscribe to The Stack Report newsletter to unlock more daily runs.",
      url: "/stack-report",
    },
  };
}
