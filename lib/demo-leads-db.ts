/**
 * demo_leads — Supabase access layer.
 *
 * All reads/writes use the service-role client (RLS bypassed). API routes are
 * the only callers; they enforce rate limits + Turnstile + SMS verify themselves
 * before invoking these helpers.
 */

import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import type { Vertical } from "./voice-agents";

export interface DemoLeadRow {
  id: string;
  vertical: Vertical;
  first_name: string | null;
  biz_name: string | null;
  email: string;
  mobile_e164: string;
  sms_code: string | null;
  sms_code_expires_at: string | null;
  sms_verified_at: string | null;
  did_dialed: string | null;
  ip: string | null;
  user_agent: string | null;
  turnstile_token: string | null;
  consent_recording_at: string | null;
  demo_called_at: string | null;
  call_uuid: string | null;
  call_duration_s: number | null;
  call_summary: string | null;
  call_actions: Record<string, unknown> | null;
  transcript: string | null;
  report_emailed_at: string | null;
  followup_state: string;
  created_at: string;
  updated_at: string;
}

const SMS_CODE_TTL_MS = 10 * 60 * 1000; // 10 min

export async function createDemoLead(input: {
  vertical: Vertical;
  firstName?: string;
  bizName?: string;
  email: string;
  mobileE164: string;
  smsCode: string;
  ip?: string | null;
  userAgent?: string | null;
  turnstileToken?: string | null;
}): Promise<{ id: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    console.warn("[demo-leads] Supabase not configured — skipping insert");
    return { id: "stub", error: null };
  }
  const expiresAt = new Date(Date.now() + SMS_CODE_TTL_MS).toISOString();
  const { data, error } = await supabaseAdmin
    .from("demo_leads")
    .insert({
      vertical: input.vertical,
      first_name: input.firstName ?? null,
      biz_name: input.bizName ?? null,
      email: input.email.toLowerCase().trim(),
      mobile_e164: input.mobileE164,
      sms_code: input.smsCode,
      sms_code_expires_at: expiresAt,
      ip: input.ip ?? null,
      user_agent: input.userAgent ?? null,
      turnstile_token: input.turnstileToken ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[demo-leads] insert error", error);
    return { id: null, error: error.message };
  }
  return { id: data?.id ?? null, error: null };
}

export async function verifySmsCode(input: {
  leadId: string;
  code: string;
  didDialed: string;
}): Promise<{ ok: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) return { ok: true, error: null };
  const now = new Date();

  const { data: lead, error: readErr } = await supabaseAdmin
    .from("demo_leads")
    .select("id, sms_code, sms_code_expires_at, sms_verified_at")
    .eq("id", input.leadId)
    .maybeSingle();

  if (readErr || !lead) {
    return { ok: false, error: "Lead not found" };
  }
  if (lead.sms_verified_at) {
    // Idempotent — already verified, still allow reveal.
    return { ok: true, error: null };
  }
  if (!lead.sms_code || lead.sms_code !== input.code) {
    return { ok: false, error: "Invalid code" };
  }
  if (
    lead.sms_code_expires_at &&
    new Date(lead.sms_code_expires_at).getTime() < now.getTime()
  ) {
    return { ok: false, error: "Code expired" };
  }

  const { error: updateErr } = await supabaseAdmin
    .from("demo_leads")
    .update({
      sms_verified_at: now.toISOString(),
      consent_recording_at: now.toISOString(),
      did_dialed: input.didDialed,
      sms_code: null,
    })
    .eq("id", input.leadId);

  if (updateErr) {
    console.error("[demo-leads] verify update error", updateErr);
    return { ok: false, error: updateErr.message };
  }
  return { ok: true, error: null };
}

/** Find the most recent verified lead by mobile — used by /api/call-ended to attach the demo call. */
export async function findRecentLeadByMobile(
  mobileE164: string,
  maxAgeHours = 48,
): Promise<DemoLeadRow | null> {
  if (!isSupabaseConfigured()) return null;
  const since = new Date(
    Date.now() - maxAgeHours * 60 * 60 * 1000,
  ).toISOString();
  const { data, error } = await supabaseAdmin
    .from("demo_leads")
    .select("*")
    .eq("mobile_e164", mobileE164)
    .gte("sms_verified_at", since)
    .order("sms_verified_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[demo-leads] findRecentLeadByMobile error", error);
    return null;
  }
  return (data as DemoLeadRow) ?? null;
}

/** Did-scoped variant of findRecentLeadByMobile — used by /api/call-ended when the payload names the DID dialed. */
export async function findRecentLeadByMobileAndDid(
  mobile: string,
  didDialed: string,
): Promise<DemoLeadRow | null> {
  if (!isSupabaseConfigured()) return null;
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data } = await supabaseAdmin
    .from("demo_leads")
    .select("*")
    .eq("mobile_e164", mobile)
    .eq("did_dialed", didDialed)
    .not("sms_verified_at", "is", null)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as DemoLeadRow) ?? null;
}

export async function markCallFinished(input: {
  leadId: string;
  callUuid?: string;
  durationS?: number;
  summary: string;
  actions: Record<string, unknown>;
  transcript: string;
}): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabaseAdmin
    .from("demo_leads")
    .update({
      demo_called_at: new Date().toISOString(),
      call_uuid: input.callUuid ?? null,
      call_duration_s: input.durationS ?? null,
      call_summary: input.summary,
      call_actions: input.actions,
      transcript: input.transcript,
    })
    .eq("id", input.leadId);
  if (error) console.error("[demo-leads] markCallFinished error", error);
}

export async function markReportEmailed(leadId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabaseAdmin
    .from("demo_leads")
    .update({ report_emailed_at: new Date().toISOString() })
    .eq("id", leadId);
  if (error) console.error("[demo-leads] markReportEmailed error", error);
}

/** Rate-limit lookups — return count of leads created in trailing 24h. */
export async function countLeadsByEmail24h(email: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabaseAdmin
    .from("demo_leads")
    .select("id", { count: "exact", head: true })
    .eq("email", email.toLowerCase().trim())
    .gte("created_at", since);
  if (error) {
    console.error("[demo-leads] countLeadsByEmail24h error", error);
    return 0;
  }
  return count ?? 0;
}

export async function countLeadsByMobile24h(
  mobileE164: string,
): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabaseAdmin
    .from("demo_leads")
    .select("id", { count: "exact", head: true })
    .eq("mobile_e164", mobileE164)
    .gte("created_at", since);
  if (error) {
    console.error("[demo-leads] countLeadsByMobile24h error", error);
    return 0;
  }
  return count ?? 0;
}

export async function countLeadsByIp24h(ip: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabaseAdmin
    .from("demo_leads")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", since);
  if (error) {
    console.error("[demo-leads] countLeadsByIp24h error", error);
    return 0;
  }
  return count ?? 0;
}
