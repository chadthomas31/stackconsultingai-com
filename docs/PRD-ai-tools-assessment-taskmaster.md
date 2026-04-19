# Product Requirements Document

## 1. Overview
- **Product Name:** AI Tools Assessment (Stacks Voice Agent + Report Pipeline)
- **Owner:** Chad McCluskey (Stack Consulting AI)
- **Last Updated:** 2026-04-18
- **Version:** 1.0

A free lead-magnet service for stackconsultingai.com. A prospect calls a public Palm Springs (760) DID, our OpenAI Realtime voice agent **Stacks** (sage voice, ext 5002) conducts a 10–20 minute structured business interview, and a Claude-generated Gamma-style assessment report is emailed to them within 24 hours and hosted at `/assessment/[uuid]`.

Solves the friction in Corey Ganim's 45-min-Zoom playbook by replacing the Zoom with an inbound phone call. Serves SMB owners in 14 target industries, with Palm Springs boutique hotels as the initial push.

## 2. Objectives
- **Primary objective:** Generate qualified upsell leads ($3–5K process optimization, $1–3K Zapier/Make builds, $200/mo Speed-to-Lead, $150/mo + setup FreeSWITCH IVR) by delivering a high-value free deliverable that demonstrates capability.
- **Secondary objective:** Prove an inbound-call-to-report agentic pipeline end-to-end so it can be productized for other Stack Consulting clients.
- **Out-of-scope:**
  - Outbound/cold-call variants (inbound only)
  - Payments or gating the report behind a paywall
  - CRM sync beyond Supabase writes
  - Non-English interviews
  - Live human handoff during the call

## 3. User Stories
- As a **small business owner**, I want to call one number and get a personalized AI roadmap, so that I know where to start without hiring a consultant first.
- As a **Palm Springs boutique hotelier**, I want a specific assessment for my industry, so that the recommendations actually apply to my OTA commissions and concierge workload.
- As **Chad**, I want every inbound call to produce a structured assessment row in Supabase, so that I can follow up with qualified leads the same day.
- As **Chad**, I want the report rendered as a branded web page I can share on a card, so that prospects get a "wow" artifact instead of a PDF.
- As a **developer on the team (Conner or future Claude session)**, I want a test endpoint that runs the full pipeline against a sample transcript, so that I can iterate on extraction and rendering without waiting for real calls.

## 4. Functional Requirements

### Core Requirements
- **Supabase schema** — `assessments` table with UUID primary key, columns matching the `Assessment` TypeScript type, RLS disabled (service-role writes only), created/updated timestamps.
- **Data access layer** — `lib/assessments-db.ts` with `insertAssessment(assessment)`, `getAssessment(uuid)`, `listAssessments(limit)` using existing service-role Supabase client.
- **Production webhook** — `POST /api/call-ended` receives `{uuid, industryId, transcript, recordingUrl?, callerPhoneNumber, durationSeconds}` from FreeSWITCH `hangup_complete`. HMAC-verified via `CALL_WEBHOOK_SECRET`. Calls `extractAssessment()`, writes to Supabase, triggers email. Returns 200 within 30s; defers extraction to a background task if needed.
- **Test endpoint** — `POST /api/call-ended/test` protected by `TEST_ENDPOINT_SECRET`. Runs `extractAssessment(SAMPLE_BOUTIQUE_HOTEL_TRANSCRIPT, "boutique-hotel")`, inserts row, returns `{uuid, url}`.
- **Report renderer** — `app/assessment/[uuid]/page.tsx` dynamic route. Fetches assessment from Supabase; renders hero → executive summary → opportunity snapshot (hrs/$/wins) → impact-effort matrix (4 quadrants) → 4 recommended tools → 4-day plan → financial impact table → major projects → final CTA. Uses retellai-light design tokens (navy + brand blue, Space Grotesk + Inter).
- **Email dispatch** — `lib/email.ts` Resend integration. Branded HTML template with assessment highlights + link to `/assessment/[uuid]`. Respects `ASSESSMENT_EMAIL_REDIRECT` env var in dev.
- **Homepage phone-first CTA** — After DID is live, update `components/FreeAssessmentOffer.tsx` to show the phone number as primary CTA ("Call Stacks now: (760) xxx-xxxx"). Form demotes to secondary "Request a callback".
- **FreeSWITCH agent deployment** — Deploy `buildInboundSystemPrompt()` output to the existing OpenAI Realtime agent on ext 5002. Configure FusionPBX dialplan to post hangup webhook.
- **Palm Springs DID** — Purchase `(760)` area code number on Telnyx, attach to existing SIP trunk, route inbound to ext 5002.

### Edge Cases
- Caller hangs up in under 3 minutes → store partial transcript, mark assessment `incomplete`, do not email.
- Claude extraction fails (invalid JSON, API error) → log to Supabase error column, alert Chad, retain raw transcript for manual run.
- Duplicate webhook (same uuid posted twice) → idempotent insert (`ON CONFLICT DO NOTHING`).
- Invalid HMAC signature → return 401, log source IP.
- Caller refuses to give email → still generate report at `/assessment/[uuid]`, SMS link instead if phone number is available.
- Industry not detected by Stacks → fall back to `other` generic script.
- Webhook receives transcript over 100KB → truncate for prompt cache, preserve full in `rawTranscript` column.
- Report page visited with unknown UUID → 404 with branded page, CTA to book a new call.

## 5. Non-Functional Requirements
- **Performance:** Webhook responds < 30s. Report page LCP < 2s, CLS < 0.1. Hero JS < 60KB.
- **Security:** HMAC-verified webhook. Service-role Supabase key server-side only. No PII in client bundles. Anthropic/Resend keys in Vercel env, never committed.
- **Reliability:** Extraction has retry with exponential backoff (3 attempts). Email dispatch is idempotent. Assessment row is always created before email send; email failure does not fail the webhook.
- **Accessibility:** Report page WCAG AA — semantic headings, alt text on icons, keyboard-navigable, respects `prefers-reduced-motion`.
- **Observability:** Every webhook logs `{uuid, industryId, durationSeconds, extractionMs, emailStatus}` to Vercel logs. Errors surface via email alert to Chad.

## 6. Success Metrics
- **Metric 1 (pipeline health):** 95%+ of inbound calls over 5 minutes produce a valid assessment row in Supabase.
- **Metric 2 (report quality):** Chad rates 80%+ of generated reports as "ship-quality" without manual edits during first 20 real calls.
- **Metric 3 (conversion):** 20%+ of completed assessments book a follow-up discovery call within 14 days.
- **Metric 4 (latency):** Median time from hangup to email sent < 3 minutes.
- **Metric 5 (volume):** 10 Palm Springs boutique hotel calls in first 30 days post-launch.

## 7. Technical Notes
- **Architecture constraints:**
  - Next.js 15 App Router on Vercel (auto-deploy from `main`).
  - FreeSWITCH + FusionPBX on `fspbx @ 100.78.119.28` (Tailscale). OpenAI Realtime agent on ext 5002.
  - Supabase for persistence (service-role client only; no RLS on `assessments`).
  - Claude Sonnet 4.6 for extraction with adaptive thinking, Zod structured outputs, prompt caching on stable prefix.
  - Resend for transactional email.
  - Telnyx for SIP DID.
- **Dependencies:**
  - `@anthropic-ai/sdk` (installed)
  - `resend` (installed)
  - `zod` (installed)
  - `@supabase/supabase-js` (existing)
  - Chad's Telnyx API key + SIP connection ID
- **Integration points:**
  - FusionPBX `hangup_complete` dialplan → `POST /api/call-ended`
  - OpenAI Realtime session → captures transcript during call, returned in webhook payload
  - Resend → branded email with `/assessment/[uuid]` deeplink
  - Supabase → primary source of truth for reports

## 8. Release Plan

### Milestone 1 — Test harness works
- **Scope:** Supabase migration, `lib/assessments-db.ts`, `/api/call-ended/test` endpoint, `/assessment/[uuid]` report page. `ANTHROPIC_API_KEY` in Vercel.
- **Exit criteria:** Calling the test endpoint produces a Supabase row and a rendered report page that Chad rates as ship-quality.

### Milestone 2 — Real calls work
- **Scope:** Production `/api/call-ended` webhook with HMAC, `lib/email.ts` Resend integration, Telnyx DID purchase, Stacks prompt deployed to ext 5002, FusionPBX hangup hook configured.
- **Exit criteria:** A live call to the Palm Springs DID produces an emailed report within 5 minutes.

### Milestone 3 — End-to-end live
- **Scope:** Homepage phone-first CTA update, email template polish, first 5 real prospect calls completed.
- **Exit criteria:** Homepage leads with the phone number; 5 real prospects have received reports without manual intervention.

### Milestone 4 — Operations
- **Scope:** `/admin/assessments` list view, error alerting to Chad's email, daily summary digest.
- **Exit criteria:** Chad can see all assessments in one place and gets alerted on any pipeline failure within 10 minutes.

## 9. Risks and Mitigations
- **Risk: Claude extraction returns malformed JSON despite Zod schema**
  - Impact: High — blocks report generation
  - Mitigation: Retry with backoff, fall back to simpler prompt without caching, surface raw transcript in admin view for manual extraction.
- **Risk: FreeSWITCH hangup webhook fires before transcript is fully captured**
  - Impact: High — incomplete reports
  - Mitigation: Add 2s grace delay in FusionPBX dialplan; capture transcript from OpenAI Realtime session close event.
- **Risk: Telnyx DID abuse (robocalls, prank volume)**
  - Impact: Medium — Anthropic API cost spike
  - Mitigation: Rate-limit per caller phone number at the dialplan level (3 calls/day); enforce min duration (3 min) before triggering extraction.
- **Risk: Stacks mis-classifies industry, selects wrong script branch**
  - Impact: Medium — irrelevant questions, weak report
  - Mitigation: Stacks confirms industry verbally before branching; `other` generic script handles unknowns gracefully.
- **Risk: PII in transcripts stored unencrypted**
  - Impact: Medium — compliance risk
  - Mitigation: Supabase at-rest encryption; redact caller PII from `rawTranscript` before storing (strip SSN/CC patterns); document retention policy.
- **Risk: Email deliverability (spam folder)**
  - Impact: Medium — reports not read
  - Mitigation: Resend with verified domain + SPF/DKIM/DMARC; plain-text alternative; SMS deeplink as backup.
- **Risk: Anthropic API cost runaway**
  - Impact: Low–Medium
  - Mitigation: Prompt caching on stable prefix; Sonnet not Opus for extraction; cap transcript length at 100KB.

## 10. Open Questions
- Should we store audio recordings or only transcripts? (Recording URL vs full audio file in Supabase Storage)
- Retention policy for transcripts and reports — indefinite, or auto-delete after 180 days?
- Who owns the `(760)` DID after launch — Stack Consulting LLC or Chad personally?
- Do we want SMS follow-up sequences tied to the assessment, or leave that to manual CRM work?
- Should the report page be indexed by Google (public SEO boost) or `noindex` (privacy)?
- When a caller requests a hard copy, do we generate PDF server-side or link to a print-stylesheet view?
- Is HIPAA relevant for healthcare industry responses? If so, restrict healthcare reports from being emailed, only hosted at `/assessment/[uuid]` with short TTL.
