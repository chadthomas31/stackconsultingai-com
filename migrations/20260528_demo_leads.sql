-- Vertical demo funnel — captures every prospect who tries a vertical voice demo.
-- Apply manually in Supabase SQL Editor before pushing dependent code.
-- See spec: docs/superpowers/specs/2026-05-28-vertical-demo-funnel-design.md

create table if not exists demo_leads (
  id uuid primary key default gen_random_uuid(),

  -- Routing + identity
  vertical text not null check (vertical in ('hvac', 'plumbing', 'auto', 'medspa')),
  first_name text,
  biz_name text,
  email text not null,
  mobile_e164 text not null,                  -- normalized +1XXXXXXXXXX

  -- SMS verification
  sms_code text,
  sms_code_expires_at timestamptz,
  sms_verified_at timestamptz,

  -- DID reveal
  did_dialed text,

  -- Abuse + provenance
  ip inet,
  user_agent text,
  turnstile_token text,

  -- CA two-party consent (set when DID is revealed)
  consent_recording_at timestamptz,

  -- Call tracking (filled by /api/call-ended)
  demo_called_at timestamptz,
  call_uuid text,
  call_duration_s int,
  call_summary text,
  call_actions jsonb,
  transcript text,
  report_emailed_at timestamptz,

  -- Sales pipeline
  followup_state text not null default 'new'
    check (followup_state in ('new', 'd1_sent', 'd3_sent', 'd7_sent', 'closed', 'unsubscribed')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists demo_leads_email_idx     on demo_leads (email);
create index if not exists demo_leads_mobile_idx    on demo_leads (mobile_e164);
create index if not exists demo_leads_vertical_idx  on demo_leads (vertical);
create index if not exists demo_leads_followup_idx  on demo_leads (followup_state, created_at);
create index if not exists demo_leads_ip_idx        on demo_leads (ip);

-- updated_at autotouch
create or replace function demo_leads_touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists demo_leads_updated_at on demo_leads;
create trigger demo_leads_updated_at
  before update on demo_leads
  for each row execute function demo_leads_touch_updated_at();

-- RLS
alter table demo_leads enable row level security;

-- Public can insert (API layer enforces rate limit + Turnstile)
drop policy if exists "demo_leads_public_insert" on demo_leads;
create policy "demo_leads_public_insert" on demo_leads
  for insert to anon, authenticated with check (true);

-- Reads restricted to service role (used server-side only)
-- No SELECT policy = no rows visible via anon. Service role bypasses RLS.

-- Smoke check (run separately to confirm):
--   select count(*) from demo_leads;          -- expect 0
--   insert into demo_leads (vertical, email, mobile_e164) values ('hvac', 't@t.com', '+19495550000');
--   select id, vertical from demo_leads;      -- expect 1 row
--   delete from demo_leads where email = 't@t.com';
