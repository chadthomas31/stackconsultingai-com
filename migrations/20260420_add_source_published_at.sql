-- Add source-video publish date to newsletter issues so the displayed
-- date matches when the original YouTube video was released, not when
-- Chad scraped it.
-- Run in Supabase → SQL Editor

ALTER TABLE newsletter_issues
  ADD COLUMN IF NOT EXISTS source_published_at TIMESTAMPTZ;

-- Backfill Issue #1 with the Hacker News Show #4 upload date so the
-- date on the site reflects the original video release.
UPDATE newsletter_issues
SET source_published_at = '2026-04-18T00:00:00Z'
WHERE issue_number = 1
  AND source_published_at IS NULL;
