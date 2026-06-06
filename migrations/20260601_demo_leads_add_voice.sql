-- Reconciliation file: this change was applied live on 2026-06-01
-- (ledger entry 20260601_demo_leads_add_voice) but the file was never
-- committed. Captured from live schema 2026-06-06. Idempotent.

ALTER TABLE public.demo_leads
  ADD COLUMN IF NOT EXISTS voice TEXT NOT NULL DEFAULT 'cedar';

DO $$ BEGIN
  ALTER TABLE public.demo_leads
    ADD CONSTRAINT demo_leads_voice_check
    CHECK (voice = ANY (ARRAY['alloy','ash','ballad','coral','echo','sage','shimmer','verse','marin','cedar']));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
