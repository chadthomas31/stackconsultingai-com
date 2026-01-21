-- Tools leads table
CREATE TABLE IF NOT EXISTS tool_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  business_name TEXT,
  phone TEXT,
  tool_name TEXT NOT NULL,
  tool_data JSONB NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_tool_leads_tool_name ON tool_leads(tool_name);
CREATE INDEX IF NOT EXISTS idx_tool_leads_created_at ON tool_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_tool_leads_email ON tool_leads(email) WHERE email IS NOT NULL;

-- Tool usage analytics
CREATE TABLE IF NOT EXISTS tool_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_name TEXT NOT NULL,
  action TEXT NOT NULL, -- 'view', 'calculate', 'email_submit'
  session_id TEXT,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tool_analytics_tool_name ON tool_analytics(tool_name);
CREATE INDEX IF NOT EXISTS idx_tool_analytics_created_at ON tool_analytics(created_at);

-- Comments for documentation
COMMENT ON TABLE tool_leads IS 'Stores lead information captured from free tools';
COMMENT ON TABLE tool_analytics IS 'Tracks tool usage and analytics';
COMMENT ON COLUMN tool_analytics.action IS 'Actions: view, calculate, email_submit, complete';