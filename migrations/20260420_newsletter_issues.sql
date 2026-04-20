-- Newsletter issues published to /stack-report
-- Run in Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS newsletter_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_number INTEGER NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  preheader TEXT NOT NULL,
  markdown_body TEXT NOT NULL,
  source_video_id TEXT,
  source_video_url TEXT,
  source_video_title TEXT,
  source_channel TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_issues_published_at
  ON newsletter_issues(published_at DESC);

-- RLS: public can read, only service role can write
ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Newsletter issues are publicly readable" ON newsletter_issues;
CREATE POLICY "Newsletter issues are publicly readable"
  ON newsletter_issues FOR SELECT
  USING (true);
