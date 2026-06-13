# Vertical AI Voice Demo Funnel — Design Spec

**Date:** 2026-05-28
**Owner:** Chad McCluskey (Stack Consulting AI)
**Status:** Approved — ready for implementation
**Repo:** `~/stackconsultingai-com/` · branch `feat/vertical-demo-funnel`

## Purpose

Turn every cold call, walk-in, or paid-ad click into a live voice-AI demo prospect funnel. Each prospect lands on a vertical-specific page (HVAC / plumbing / auto / medspa), fills a 5-field qualifier, verifies their mobile via SMS, dials a vertical-specific Telnyx number, and receives an auto-generated "call report" email summarizing what the agent did. This is the kill shot of the GTM motion: the prospect literally hears (and sees, in the report) the product working for their business.

Sales follow-up runs off the captured lead + the recorded demo conversation.

## Positioning (locked)

> **Dial this number. Hear your industry's AI receptionist answer. Get a report in your inbox showing exactly what it captured and booked.**

- The questionnaire-gate is mandatory: no number revealed without verified mobile + email.
- The fake-busy calendar slot is the persuasion moment — prospect hears the agent intelligently negotiate an alternate time.
- The post-call report email is the sales letter, written from the prospect's own demo call.

## Verticals (Phase 1)

| Vertical | Demo path | DID (pending) | Why |
|---|---|---|---|
| HVAC | `/demos/hvac` | TBD | Summer call surge, $500–$15K tickets |
| Plumbing | `/demos/plumbing` | TBD | 24/7 emergency, biggest after-hours miss story |
| Auto repair | `/demos/auto` | TBD | Existing proof: Fix It SC 40%, Tito's, SoCal Mobile |
| Medspa / aesthetics | `/demos/medspa` | TBD | OC density, $300–$5K tickets, owner busy treating |

Each vertical has its own:
- Telnyx DID (4 numbers, ~$4/mo total)
- FusionPBX dialplan row (Postgres + `/var/cache/fusionpbx/` cache invalidate)
- FreeSWITCH agent extension running OpenAI Realtime with vertical system prompt
  (live map verified 2026-06-05: HVAC `5007`, plumbing `5004`, auto `5005`,
  medspa `5006`; `5003` is Stacks Assessment)
- Landing page on the site
- Vertical-tuned intake schema for the post-call report

## Funnel flow

```
/demos/<vertical>  →  questionnaire modal  →  POST /api/demos/start
                                                ↓
                                          insert demo_leads
                                                ↓
                                       Telnyx SMS code → mobile
                                                ↓
                                user enters code → POST /api/demos/verify
                                                ↓
                              reveal vertical DID on-screen + SMS
                                                ↓
                                 user dials DID → FreeSWITCH routes
                                                ↓
                            vertical agent runs (3-min cap, CA disclosure)
                                                ↓
                            hangup → POST /api/call-ended (existing)
                                                ↓
                          extended: branches on demo lead → Claude
                          summarizes + Resend sends demo-report email
                                                ↓
                                       day +1 / +3 / +7 follow-up
```

## Data model

New table `demo_leads`:

```sql
create table demo_leads (
  id uuid primary key default gen_random_uuid(),
  vertical text not null,                     -- 'hvac' | 'plumbing' | 'auto' | 'medspa'
  first_name text,
  biz_name text,
  email text not null,
  mobile_e164 text not null,                  -- normalized +1XXXXXXXXXX
  sms_code text,                              -- 6-digit, cleared after verify
  sms_code_expires_at timestamptz,
  sms_verified_at timestamptz,
  did_dialed text,                            -- which vertical DID we revealed
  ip inet,
  user_agent text,
  turnstile_token text,
  consent_recording_at timestamptz,           -- CA two-party — set at verify time
  demo_called_at timestamptz,
  call_uuid text,                             -- FreeSWITCH UUID
  call_duration_s int,
  call_summary text,                          -- Claude one-paragraph
  call_actions jsonb,                         -- structured what-the-agent-did
  transcript text,
  report_emailed_at timestamptz,
  followup_state text default 'new',          -- 'new' | 'd1_sent' | 'd3_sent' | 'd7_sent' | 'closed'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index demo_leads_email_idx on demo_leads (email);
create index demo_leads_mobile_idx on demo_leads (mobile_e164);
create index demo_leads_vertical_idx on demo_leads (vertical);
create index demo_leads_followup_idx on demo_leads (followup_state, created_at);

alter table demo_leads enable row level security;
-- Public can insert (rate-limited at API layer); read restricted to service role.
create policy "demo_leads_insert" on demo_leads for insert with check (true);
```

## Cost & abuse guardrails (NON-NEGOTIABLE)

- **3-min call cap** (system prompt: "After ~150s, thank the caller, summarize what you captured, and end the call.")
- **1 demo per email/24h**
- **1 demo per mobile/24h**
- **5 demos per IP/24h**
- **Daily $ ceiling per vertical** (env `DEMO_DAILY_DOLLAR_CAP=50` → autosuspend DID via FusionPBX rule swap)
- **Cloudflare Turnstile** on questionnaire submit (server-verified)
- **SMS verify** must succeed before DID is revealed (kills bot/throwaway numbers)
- **CA two-party consent**: agent's first sentence is the recording disclosure. Non-negotiable.

## What the agent does (per vertical)

All verticals share the same scaffold:
1. CA recording disclosure (first sentence, always)
2. Greet + ask why caller is calling
3. Capture caller name + ZIP + service type
4. Detect emergency (where relevant)
5. Check the demo calendar (Cal.com or stub) — **always show first slot busy, suggest +1 hour**
6. Confirm appointment
7. Send SMS confirmation (mocked in demo — actual SMS in production)
8. Wrap + thank + end

Vertical-specific intake fields:
- **HVAC**: AC vs heat, brand, age of unit, residential vs commercial
- **Plumbing**: emergency Y/N, leak vs clog vs water heater vs install, ZIP
- **Auto**: vehicle year/make/model, drop-off vs mobile, service category
- **Medspa**: treatment interest, new vs existing client, preferred provider

## Post-call report email

Triggered by FreeSWITCH `/api/call-ended` webhook (existing). Extended to:
1. Look up `demo_leads` by `caller_phone_number` (E.164 match)
2. If hit: Claude summarizes + extracts `call_actions` (booked slot, captured fields, emergency flag, alternate slot suggested)
3. Persist `call_summary`, `call_actions`, `transcript`, `report_emailed_at`
4. Resend → branded HTML email with:
   - Header: "Here's the 90-second call your business just received"
   - Transcript block
   - "What the agent did" checklist (booked appt, captured ZIP, identified service, detected emergency, suggested alternate slot when first was busy)
   - Lead-card mockup (what would have hit their inbox)
   - Calendar mockup (the booked slot)
   - CTA: "Want one trained on YOUR services, calendar, and pricing? → /ai-os"

## Calendar fake-busy logic (Phase 1: simple)

- Demo calendar: a single Google Cal / Cal.com calendar reserved for demos
- Hardcoded busy block: **two hours from now, 1-hour duration**, refreshed nightly via cron (or on-the-fly in the agent's tool call)
- Agent's `check_availability(when)` tool returns busy for that window → agent automatically proposes `+1h`
- Phase 2: caller-time-zone-aware via DID area code lookup → bake fake-busy to "2hrs after agent answered"

## Sequencing & follow-up

Daily cron job (`/api/cron/demo-followup` — to be built):
- `d1_sent`: 24h after `demo_called_at` if no fit call booked → SMS + email "Ready to talk? Here's a 15-min slot."
- `d3_sent`: 72h after → case-study email (Fix It San Clemente 40%)
- `d7_sent`: 7d after → SMS "Last check-in — want me to spin one up for your shop?"
- `closed`: when a fit call is booked OR prospect marks unsubscribe

## Non-goals (Phase 1)

- No payment / Stripe — fit call is the conversion
- No multi-language (English only; Spanish in Phase 2 for HVAC/plumbing/auto)
- No SMS-driven appointment confirmation to the demo caller (mock only — too easy to spam)
- No real CRM integration (Supabase IS the CRM)
- No A/B test framework — ship one version of each page

## Files (created in this milestone)

```
docs/superpowers/specs/2026-05-28-vertical-demo-funnel-design.md   ← this file
docs/superpowers/plans/2026-05-28-vertical-demo-funnel.md          ← implementation plan
migrations/20260528_demo_leads.sql                                  ← Supabase schema
lib/voice-agents/index.ts                                           ← registry
lib/voice-agents/hvac.ts
lib/voice-agents/plumbing.ts
lib/voice-agents/auto.ts
lib/voice-agents/medspa.ts
lib/voice-agents/_shared.ts                                         ← CA disclosure, calendar tool, end-call helpers
lib/sms.ts                                                          ← Telnyx send + verify
lib/demo-leads-db.ts                                                ← Supabase access
lib/demo-report-email.ts                                            ← report HTML template
app/demos/[vertical]/page.tsx                                       ← dynamic vertical landing
app/demos/[vertical]/copy.ts                                        ← vertical-specific copy
components/demos/VerticalDemoFunnel.tsx                             ← questionnaire + SMS verify + DID reveal
app/api/demos/start/route.ts                                        ← create lead + send SMS
app/api/demos/verify/route.ts                                       ← confirm SMS, return DID
```

Modified:
```
app/api/call-ended/route.ts                                         ← branch: demo-lead path → demo report
app/demos/page.tsx                                                  ← link out to vertical demos
app/sitemap.ts                                                      ← add /demos/<vertical>
```

## Success criteria

- A non-technical prospect lands on `/demos/hvac` from a cold call, completes the form in <30s, dials the number from their phone, hears a vertical-tuned agent handle their call, hangs up, and receives a branded report email within 90s.
- Call cost per demo: **< $0.75 average** (3 min × $0.25/min).
- Daily $ cap holds: never exceed `DEMO_DAILY_DOLLAR_CAP`.
- SMS verify success rate: > 90% (prospects don't give up on the code step).
- Build passes (`npm run build`), no PageSpeed regression on existing pages.

## Open follow-ups (Phase 2, NOT in this milestone)

- Tz-aware fake-busy calendar
- Spanish-language agents (HVAC, plumbing, auto)
- Real Cal.com / Google Cal write integration (book actual slots, send actual SMS conf)
- Admin UI (`/admin/demos`) to browse lead funnel, replay transcripts, mark closed
- Follow-up cron (`/api/cron/demo-followup`)
- Per-vertical landing-page conversion A/B (after 50+ leads per vertical)
- Vertical 5 & 6 (roofing, dental) once first 4 prove
