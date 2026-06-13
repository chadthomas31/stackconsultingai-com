# Vertical Demo Funnel — Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Ship a working 4-vertical AI voice demo funnel: vertical landing pages, questionnaire-gated SMS-verified DID reveal, vertical-tuned FreeSWITCH agents, post-call Claude-summarized report email.

**Architecture:** Next.js 15 App Router pages + API routes. Supabase `demo_leads` table. Telnyx for DIDs + SMS. FreeSWITCH (existing) handles the actual voice agent runtime; this repo provides the prompts as TypeScript modules and the webhook target for hangup events.

**Tech Stack:** Next.js 15 · React 19 · Tailwind v3 · TypeScript · Supabase · Resend · Telnyx (SMS) · OpenAI Realtime (via FreeSWITCH, out of repo) · Claude Haiku 4.5 (post-call summarization).

---

## Phase 1A — Foundation (ship this turn)

### Task 1: Spec + plan committed
- [x] **Step 1:** Write spec → `docs/superpowers/specs/2026-05-28-vertical-demo-funnel-design.md`
- [x] **Step 2:** Write plan → `docs/superpowers/plans/2026-05-28-vertical-demo-funnel.md`
- [x] **Step 3:** Commit on `feat/vertical-demo-funnel`

### Task 2: Supabase migration
- [x] **Step 1:** Create `migrations/20260528_demo_leads.sql` with the schema from the spec (table + indexes + RLS + insert policy)
- [ ] **Step 2 (HUMAN):** Paste SQL into Supabase SQL Editor → run → confirm table appears in `list_tables`

### Task 3: Vertical agent prompt registry
- [x] **Step 1:** Create `lib/voice-agents/_shared.ts` — CA disclosure preamble, 3-min wrap instruction, calendar-tool contract, end-call helper, common refusal/redirect rules
- [x] **Step 2:** Create `lib/voice-agents/hvac.ts` — extends shared, adds HVAC intake fields + emergency triage
- [x] **Step 3:** Create `lib/voice-agents/plumbing.ts` — extends shared, emergency-first triage
- [x] **Step 4:** Create `lib/voice-agents/auto.ts` — extends shared, vehicle YMM + drop-off vs mobile
- [x] **Step 5:** Create `lib/voice-agents/medspa.ts` — extends shared, treatment + new/existing client
- [x] **Step 6:** Create `lib/voice-agents/index.ts` — registry: `vertical → { systemPrompt, intakeSchema, extension, displayName }`

### Task 4: SMS lib (Telnyx)
- [x] **Step 1:** Create `lib/sms.ts` — `sendVerificationCode(mobile, code)` + `isTelnyxConfigured()`. Uses Telnyx Messaging API. Env: `TELNYX_API_KEY`, `TELNYX_SENDER_NUMBER`. Stub-mode when unconfigured (logs to console, returns success in dev).

### Task 5: DB layer
- [x] **Step 1:** Create `lib/demo-leads-db.ts` — `createDemoLead`, `findByMobile`, `verifyCode`, `markCalled`, `markReportSent`, plus rate-limit lookups (`countLeadsByEmail24h`, `countLeadsByIp24h`)

---

## Phase 1B — Funnel UI + API (next turn)

### Task 6: Vertical dynamic route
- [ ] **Step 1:** Create `app/demos/[vertical]/copy.ts` — per-vertical headline/subhead/proof/intake-field labels
- [ ] **Step 2:** Create `app/demos/[vertical]/page.tsx` — dynamic landing page consuming `copy.ts`, renders `<VerticalDemoFunnel vertical={...} />`. Metadata + JSON-LD Service schema per vertical.
- [ ] **Step 3:** `generateStaticParams` returns the 4 verticals → static at build, fast LCP.

### Task 7: Funnel component
- [ ] **Step 1:** Create `components/demos/VerticalDemoFunnel.tsx` — `"use client"`, 3-state machine: `form` → `verify` → `revealed`. Form: 5 fields. Verify: 6-digit code input. Revealed: DID + "tap to call" link + recording disclosure + script suggestion.

### Task 8: Start API
- [ ] **Step 1:** Create `app/api/demos/start/route.ts` — POST handler: Turnstile verify (skip if unconfigured), normalize phone, rate-limit (1/email/24h, 1/mobile/24h, 5/ip/24h), insert lead, generate 6-digit code, send SMS, return `{ leadId }`.

### Task 9: Verify API
- [ ] **Step 1:** Create `app/api/demos/verify/route.ts` — POST handler: validate code + not expired, mark verified, set `consent_recording_at`, return `{ did, dialString }`.

### Task 10: Demo report email
- [ ] **Step 1:** Create `lib/demo-report-email.ts` — `sendDemoReportEmail({ lead, summary, actions, transcript })` Resend wrapper with brand HTML matching `lib/email.ts` style.

### Task 11: Hangup webhook extension
- [ ] **Step 1:** Modify `app/api/call-ended/route.ts` — at start of POST handler, look up `findByMobile(callerPhoneNumber)`. If hit: route through `lib/voice-agents/<vertical>.ts` extractor + `sendDemoReportEmail` instead of generic assessment. Existing assessment path unchanged.

### Task 12: Sitemap + nav
- [ ] **Step 1:** Update `app/sitemap.ts` — add 4 vertical entries
- [ ] **Step 2:** Update `app/demos/page.tsx` — add a "Vertical Demos" band linking to all 4

---

## Phase 1C — Runtime (next session, requires SSH to fspbx)

### Task 13: Telnyx DIDs (HUMAN, paid)
- [ ] **Step 1 (HUMAN):** Telnyx portal → buy 4 DIDs (949 or 714). Assign IP-auth connection to fspbx (existing IP profile)
- [ ] **Step 2 (HUMAN):** Add the 4 numbers to `.env.local` + Vercel: `DEMO_DID_HVAC`, `DEMO_DID_PLUMBING`, `DEMO_DID_AUTO`, `DEMO_DID_MEDSPA`

### Task 14: FusionPBX dialplan rows
- [x] **Step 1:** SSH `fspbx` → for each DID, insert dialplan row routing DID → `<extension>@<domain>`. Live map verified 2026-06-05: HVAC 5007, plumbing 5004, auto 5005, medspa 5006. `5003` remains Stacks Assessment.
- [x] **Step 2:** `rm -rf /var/cache/fusionpbx/dialplan.*` and reload.
- [ ] **Step 3:** Test inbound: call each DID from cell, confirm extension picks up.

### Task 15: Per-vertical FreeSWITCH agent extensions
- [x] **Step 1:** Clone/configure vertical demo extensions → `5007`, `5004`, `5005`, `5006`.
- [x] **Step 2:** `ai_assistant_demo.lua` branches on destination extension and injects vertical prompt text at runtime.
- [x] **Step 3:** Configure 3-min hard cap (FreeSWITCH `sched_hangup` or per-leg timeout)
- [ ] **Step 4:** Decide report architecture. Live PBX currently handles `send_call_summary` through local `ai_webhook_server.py` on `127.0.0.1:8089`, writing `/var/lib/freeswitch/ai_leads` and sending Postfix emails. It does not POST the full transcript to website `/api/call-ended`.

### Task 16: Calendar fake-busy
- [ ] **Step 1:** Create a Google Calendar / Cal.com calendar dedicated to demos
- [ ] **Step 2:** Cron nightly OR per-agent-call: insert a "Stack Demo Hold" block 2 hours from current time, 1-hour duration
- [ ] **Step 3:** Agent's `check_availability` tool consults this calendar; on busy, returns `next available = +1h`

### Task 17: Cost guardrails
- [ ] **Step 1:** Build `lib/cost-guard.ts` — counts demo-tagged calls/day, sums est cost (calls × avg duration × $0.25/min). Exposed via `/api/cron/cost-check` (5-min interval).
- [ ] **Step 2:** When cap breached, flip FusionPBX dialplan rule for affected DID(s) → busy tone + "cap reached, try again tomorrow" prompt.

---

## Phase 1D — Follow-up + GTM enablement (after demos prove)

### Task 18: Follow-up cron
- [ ] **Step 1:** `/api/cron/demo-followup` — Vercel cron daily at 09:00 PT. Scans `demo_leads` where `followup_state=new` and `demo_called_at` between 22h-26h ago → d1 SMS + email. Same pattern for d3, d7.

### Task 19: Admin viewer
- [ ] **Step 1:** `/admin/demos` — table view of leads, transcript replay, mark closed. Auth-gated (existing `(admin)` group).

---

## Phase 2 (deferred) — not in this milestone

- Spanish-language agents
- Real Cal.com write integration
- Tz-aware fake-busy
- Vertical landing-page A/B testing
- 5th + 6th vertical

---

## Verification gates

After each phase:
- `npm run build` exits 0
- `npm run lint` exits 0
- No regression on `/demos`, `/ai-os`, homepage (manual smoke)
- New table queryable via Supabase: `select count(*) from demo_leads`
- One end-to-end smoke: form → SMS → reveal → call → hangup → email received

## Paid action gates (require Chad's explicit auth)

1. **Telnyx DIDs** (~$4/mo total) — buy in portal
2. **Telnyx Messaging** sender number provisioning (~$1/mo + ~$0.01/SMS) — confirm sender
3. **Cloudflare Turnstile** site/secret keys — free, you create in CF dashboard
4. **Google/Cal.com demo calendar** — free, you create

All other work runs without paid action.
