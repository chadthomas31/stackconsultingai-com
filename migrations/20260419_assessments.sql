-- AI Tools Assessments — stores completed Claude-extracted assessments
-- Populated by /api/call-ended after a Stacks phone interview ends
-- Rendered by /assessment/[uuid]

CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  caller_name TEXT,
  caller_email TEXT,
  caller_phone TEXT,
  business_name TEXT,
  industry_id TEXT,
  industry_label TEXT,

  -- Full structured assessment (matches Assessment type in lib/assessment-schema.ts)
  assessment_json JSONB NOT NULL,

  -- Raw audit trail
  raw_transcript TEXT,
  call_duration_seconds INT,
  model_used TEXT,

  -- Ops metadata
  email_sent_at TIMESTAMPTZ,
  email_resend_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_caller_email ON assessments(caller_email) WHERE caller_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_assessments_industry_id ON assessments(industry_id);

COMMENT ON TABLE assessments IS 'Completed AI Tools Assessments — Claude-extracted from Stacks phone interviews, rendered at /assessment/[uuid]';
