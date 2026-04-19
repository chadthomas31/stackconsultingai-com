import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import type { Assessment } from "./assessment-schema";

/** Persist a fully-extracted assessment. Returns the DB-generated UUID. */
export async function saveAssessment(opts: {
  assessment: Assessment;
  rawTranscript?: string;
  modelUsed?: string;
}): Promise<{ id: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { id: null, error: "Supabase not configured" };
  }
  const { business } = opts.assessment;
  const { data, error } = await supabaseAdmin
    .from("assessments")
    .insert({
      caller_name: business.callerName || null,
      caller_email: business.email || null,
      caller_phone: opts.assessment.callerPhoneNumber || null,
      business_name: business.businessName || null,
      industry_id: business.industryId || null,
      industry_label: business.industryLabel || null,
      assessment_json: opts.assessment,
      raw_transcript: opts.rawTranscript || null,
      call_duration_seconds: opts.assessment.callDurationSeconds ?? null,
      model_used: opts.modelUsed || null,
    })
    .select("id")
    .single();

  if (error) {
    return { id: null, error: error.message };
  }
  return { id: data?.id ?? null, error: null };
}

/** Fetch an assessment by UUID for rendering the public report. */
export async function getAssessmentById(
  id: string
): Promise<Assessment | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabaseAdmin
    .from("assessments")
    .select("id, created_at, assessment_json")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  // The stored JSON is the Assessment shape; re-stamp id and createdAt from the
  // row so the report page always shows the authoritative values.
  const assessment = data.assessment_json as Assessment;
  return {
    ...assessment,
    id: data.id,
    createdAt: data.created_at ?? assessment.createdAt,
  };
}

/** Mark an assessment as emailed (audit trail). */
export async function markEmailSent(
  id: string,
  resendId: string | null
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  await supabaseAdmin
    .from("assessments")
    .update({
      email_sent_at: new Date().toISOString(),
      email_resend_id: resendId,
    })
    .eq("id", id);
}
