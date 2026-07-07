-- Slice 2: My Business personalized demo config.
-- biz_description = the prospect's raw 1-2 sentence description.
-- biz_config = the AI-drafted + user-edited receptionist config (see receptionist-config-schema.ts).
ALTER TABLE demo_leads
  ADD COLUMN IF NOT EXISTS biz_description text,
  ADD COLUMN IF NOT EXISTS biz_config jsonb;
