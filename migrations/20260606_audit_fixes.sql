-- 2026-06-06 database audit fixes — APPLIED LIVE via Supabase MCP on 2026-06-06.
-- This file is the audit trail (see ~/Desktop/sca-supabase-audit.md for the full report).
-- All blocks idempotent. Ledger entries: create_assessments_table, create_tool_runs_table,
-- harden_trigger_search_path_and_grants, tighten_insert_policies_and_hygiene,
-- drop_unused_demo_leads_insert_policy.

-- ============================================================
-- 1) assessments table (migration 20260419_assessments.sql was never applied;
--    this supersedes it and adds the RLS that file omitted)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  caller_name TEXT,
  caller_email TEXT,
  caller_phone TEXT,
  business_name TEXT,
  industry_id TEXT,
  industry_label TEXT,
  assessment_json JSONB NOT NULL,
  raw_transcript TEXT,
  call_duration_seconds INT,
  model_used TEXT,
  email_sent_at TIMESTAMPTZ,
  email_resend_id TEXT
);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at   ON public.assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_caller_email ON public.assessments(caller_email) WHERE caller_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_assessments_industry_id  ON public.assessments(industry_id);
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.assessments FROM anon, authenticated; -- service-role access only

-- ============================================================
-- 2) tool_runs table (migration 20260428_tool_runs.sql was never applied;
--    rate limiting in lib/rate-limit.ts was failing open until this existed)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tool_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash TEXT NOT NULL,
  tool_slug TEXT NOT NULL,
  ran_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email_captured BOOLEAN NOT NULL DEFAULT FALSE,
  user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_tool_runs_ip_tool_time ON public.tool_runs (ip_hash, tool_slug, ran_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_runs_ran_at       ON public.tool_runs (ran_at);
ALTER TABLE public.tool_runs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.tool_runs FROM anon, authenticated; -- service-role access only

-- ============================================================
-- 3) P0: pin trigger function search_path (Supabase advisor 0011)
-- ============================================================
ALTER FUNCTION public.demo_leads_touch_updated_at() SET search_path = '';

-- ============================================================
-- 4) Explicit lead-PII grant lockdown (defense in depth).
--    Anon was previously blocked only by the ABSENCE of SELECT policies
--    while holding full table grants. Now grants match actual usage:
--    - tool_leads / tool_analytics: anon INSERT only (public forms use anon client)
--    - demo_leads / assessments / tool_runs: service role only
--    - newsletter_issues: public SELECT only
--    NOTE: requires SUPABASE_SERVICE_ROLE_KEY in every deploy env —
--    lib/supabase.ts now throws in production if it's missing.
-- ============================================================
REVOKE ALL    ON public.tool_leads      FROM anon, authenticated;
REVOKE ALL    ON public.tool_analytics  FROM anon, authenticated;
GRANT  INSERT ON public.tool_leads      TO anon;
GRANT  INSERT ON public.tool_analytics  TO anon;
REVOKE ALL ON public.demo_leads FROM anon, authenticated;
REVOKE ALL   ON public.newsletter_issues FROM anon, authenticated;
GRANT  SELECT ON public.newsletter_issues TO anon, authenticated;

-- ============================================================
-- 5) Replace blanket WITH CHECK (true) insert policies with shape guards
--    (also reconciles drift: RLS + these policies existed live with no file)
-- ============================================================
ALTER TABLE public.tool_leads     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.tool_leads;
DROP POLICY IF EXISTS "tool_leads_anon_insert"  ON public.tool_leads;
CREATE POLICY "tool_leads_anon_insert" ON public.tool_leads
  FOR INSERT TO anon
  WITH CHECK (tool_name IS NOT NULL AND length(tool_name) <= 64);

DROP POLICY IF EXISTS "Allow anonymous inserts"     ON public.tool_analytics;
DROP POLICY IF EXISTS "tool_analytics_anon_insert"  ON public.tool_analytics;
CREATE POLICY "tool_analytics_anon_insert" ON public.tool_analytics
  FOR INSERT TO anon
  WITH CHECK (tool_name IS NOT NULL AND action IS NOT NULL);

-- demo_leads inserts are server-side via service role; anon grants revoked,
-- so the old permissive policy was unreachable dead weight.
DROP POLICY IF EXISTS "demo_leads_public_insert" ON public.demo_leads;

-- ============================================================
-- 6) Timestamp hygiene + updated_at touch trigger on tool_leads
-- ============================================================
UPDATE public.tool_leads SET created_at = NOW() WHERE created_at IS NULL;
UPDATE public.tool_leads SET updated_at = NOW() WHERE updated_at IS NULL;
ALTER TABLE public.tool_leads
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN updated_at SET NOT NULL;
ALTER TABLE public.tool_analytics ALTER COLUMN created_at SET NOT NULL;

DROP TRIGGER IF EXISTS tool_leads_updated_at ON public.tool_leads;
CREATE TRIGGER tool_leads_updated_at
  BEFORE UPDATE ON public.tool_leads
  FOR EACH ROW EXECUTE FUNCTION public.demo_leads_touch_updated_at();

-- ============================================================
-- 7) Constrain newsletter_issues.content_type to the values the code uses
-- ============================================================
ALTER TABLE public.newsletter_issues
  DROP CONSTRAINT IF EXISTS newsletter_issues_content_type_chk;
ALTER TABLE public.newsletter_issues
  ADD CONSTRAINT newsletter_issues_content_type_chk
  CHECK (content_type IN ('digest','article'));
