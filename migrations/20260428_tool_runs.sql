-- tool_runs: rate-limit ledger for free-tool API calls.
--
-- IP is hashed (SHA-256 + RATE_LIMIT_SALT) before insert — never store raw IP
-- (privacy + GDPR + simpler if salt rotates to invalidate old buckets).
--
-- Window query: count rows for (ip_hash, tool_slug) in last 24h.
-- Limit-tier (5 anonymous / 25 with email cookie) is enforced in app code,
-- not in the schema, so we can change limits without a migration.

CREATE TABLE IF NOT EXISTS tool_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_hash TEXT NOT NULL,
  tool_slug TEXT NOT NULL,
  ran_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email_captured BOOLEAN NOT NULL DEFAULT FALSE,
  user_agent TEXT
);

-- Hot path: count last 24h for (ip_hash, tool_slug). Composite index
-- with ran_at descending so the window scan stops fast.
CREATE INDEX IF NOT EXISTS idx_tool_runs_ip_tool_time
  ON tool_runs (ip_hash, tool_slug, ran_at DESC);

-- Periodic cleanup index: drop rows older than 30 days via cron.
CREATE INDEX IF NOT EXISTS idx_tool_runs_ran_at
  ON tool_runs (ran_at);

COMMENT ON TABLE tool_runs IS 'Rate-limit ledger for free-tool API calls. ip_hash = SHA-256(ip + RATE_LIMIT_SALT).';
COMMENT ON COLUMN tool_runs.email_captured IS 'TRUE if request came from a session with the email-capture cookie set, raising the per-day limit.';
