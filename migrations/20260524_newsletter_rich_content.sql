-- Adds rich-content columns to newsletter_issues so /stack-report can host
-- both AI-generated digests AND hand-written long-form SEO articles with
-- full schema markup (BlogPosting + FAQPage + BreadcrumbList JSON-LD).
--
-- Run in Supabase → SQL Editor BEFORE deploying dependent code.
-- Idempotent: safe to re-run.

ALTER TABLE newsletter_issues
  ADD COLUMN IF NOT EXISTS hero_image TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_alt TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS keywords TEXT[],
  ADD COLUMN IF NOT EXISTS reading_time TEXT,
  ADD COLUMN IF NOT EXISTS author_name TEXT,
  ADD COLUMN IF NOT EXISTS author_role TEXT,
  ADD COLUMN IF NOT EXISTS faqs JSONB,
  ADD COLUMN IF NOT EXISTS date_modified TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'digest';

-- content_type:
--   'digest'  = AI-generated bi-weekly roundup (existing format)
--   'article' = hand-written long-form SEO article (new format, FAQ schema, hero image)

CREATE INDEX IF NOT EXISTS idx_newsletter_issues_content_type
  ON newsletter_issues(content_type);
