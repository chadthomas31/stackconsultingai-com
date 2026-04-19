# PRD — AI Tools Assessment Pipeline (Phase B)

**Status**: Phase B implementation (foundation shipped; pipeline wiring pending)
**Owner**: Chad McCluskey (Stack Consulting AI)
**Last updated**: 2026-04-18
**Audience**: TaskMaster (for task generation) → Conner (for execution)

---

## 1. Summary

stackconsultingai.com needs a production pipeline that turns an inbound phone call into a personalized AI Tools Assessment report, emailed to the caller within 24 hours. The flow:

1. Prospect calls a public Palm Springs DID (`(760) xxx-xxxx`)
2. **Stacks** — our FreeSWITCH + OpenAI Realtime voice agent (sage voice) on ext 5002 — answers and conducts a 10–20 minute structured business interview
3. On hangup, FreeSWITCH POSTs the transcript + metadata to `POST /api/call-ended`
4. A Next.js edge route invokes `extractAssessment()` (Claude Sonnet 4.6 + Zod structured outputs) to produce a structured `Assessment` JSON
5. The assessment is written to Supabase
6. An email is dispatched via Resend with a link to `https://stackconsultingai.com/assessment/{uuid}` — a Next.js page that renders the Gamma-style report

**Foundation already shipped (do not rebuild):**
- Homepage UI with 14-industry dropdown (`components/FreeAssessmentOffer.tsx`)
- Interview scripts for 14 industries (`lib/interview-scripts.ts`)
- Tool catalog with 20 recommendable tools (`lib/tool-catalog.ts`)
- Assessment TypeScript types (`lib/assessment-schema.ts`)
- Claude extraction service (`lib/claude-extract.ts`) + sample boutique-hotel transcript
- Retellai-light design system (light mode, navy + blue, locked in `CLAUDE.md`)

**This PRD covers only the pipeline wiring needed to make it end-to-end operational.**

---

## 2. User Journey

### 2.1 Prospect (SMB owner)
1. Sees phone number on homepage or business card
2. Calls `(760) xxx-xxxx`
3. Stacks answers, greets, asks for name + business + team size + industry
4. Branches into the industry-specific 8-question script
5. Asks closer questions (biggest pain, budget, email)
6. Says goodbye and confirms report delivery
7. Within 24 hours, receives a branded email with a link to their report
8. Clicks link → sees a polished Gamma-style report with 4 quick-win tools, a 4-day implementation plan, and ROI math
9. Optional: clicks "Book a 20-minute review call" at the bottom of the report

### 2.2 Chad (internal ops)
1. New assessment lands in Supabase — row count increments
2. Email notification (or Slack, TBD) that a call was completed
3. Can review transcript + generated report at `stackconsultingai.com/assessment/{uuid}` (or an internal `/admin/assessments` dashboard — out of scope for Phase B)

---

## 3. Technical Architecture

```
 Caller's phone
      │
      ▼
 (760) xxx-xxxx ─── Telnyx DID ───▶ fspbx FreeSWITCH (107.175.53.217)
                                          │
                                          ▼
                                   ext 5002 — Stacks (OpenAI Realtime, sage voice)
                                          │
                                          │  conducts interview per
                                          │  buildInboundSystemPrompt()
                                          ▼
                                   hangup_complete hook
                                          │
                                          ▼
                        POST /api/call-ended (HMAC signed)
                                          │
                                          ▼
                              extractAssessment(transcript, industryId)
                                          │  (Claude Sonnet 4.6 + Zod)
                                          ▼
                                   Supabase `assessments` table
                                          │
                                          ▼
                               Resend email to caller
                                          │
                                          ▼
                        https://stackconsultingai.com/assessment/{uuid}
                                 (Next.js dynamic route)
```

---

## 4. Components to Build

Each item below is a discrete task with explicit file paths, responsibilities, and acceptance criteria. Files marked `(new)` do not exist yet; files marked `(edit)` already exist.

### 4.1 Supabase schema
- **File**: `migrations/20260418_assessments.sql` (new)
- **Responsibility**: Create `assessments` table storing all fields in the `Assessment` TypeScript type.
- **Columns**:
  - `id uuid primary key`
  - `created_at timestamptz default now()`
  - `business jsonb not null` (AssessmentBusinessProfile)
  - `executive_summary jsonb not null`
  - `pain_points jsonb not null` (array)
  - `quick_wins jsonb not null` (array)
  - `four_day_plan jsonb not null` (array)
  - `financial_impact jsonb not null`
  - `major_projects jsonb not null` (array)
  - `raw_transcript text`
  - `call_duration_seconds int`
  - `caller_phone_number text`
  - `model_used text`
  - `email_sent_at timestamptz`
- **Indexes**: `created_at DESC`, `(business->>'email')`, `caller_phone_number`
- **RLS**: disabled initially (server-only writes/reads via service-role key)
- **Acceptance**: migration runs cleanly on the existing Supabase instance; `npx supabase db push` works.

### 4.2 Data access layer for assessments
- **File**: `lib/assessments-db.ts` (new)
- **Responsibility**: Thin wrapper around Supabase for CRUD on assessments.
- **Exports**:
  - `saveAssessment(assessment: Assessment): Promise<void>`
  - `getAssessmentById(id: string): Promise<Assessment | null>`
  - `markEmailSent(id: string): Promise<void>`
- **Acceptance**: Uses the existing `lib/supabase.ts` service-role client. Unit-testable with a mocked client.

### 4.3 Webhook receiver `/api/call-ended`
- **File**: `app/api/call-ended/route.ts` (new)
- **Responsibility**: Receive FreeSWITCH `hangup_complete` webhook. Validate HMAC. Invoke extraction. Save to DB. Trigger email.
- **Method**: `POST`
- **Runtime**: `nodejs` (not edge — needs full Anthropic SDK + Resend)
- **Request body** (JSON):
  ```ts
  {
    uuid: string;             // FreeSWITCH-generated UUID at call start
    industryId: string;       // matches INDUSTRY_SCRIPTS keys
    transcript: string;       // full OpenAI Realtime session transcript
    recordingUrl?: string;
    callerPhoneNumber: string;
    durationSeconds: number;
    timestamp: string;
  }
  ```
- **Headers**:
  - `x-scai-signature: sha256=<hex>` — HMAC of the request body using `CALL_WEBHOOK_SECRET`
- **Response**: `{ assessmentId, url }` on success, typed errors on failure
- **Error handling**:
  - `401` on bad signature
  - `400` on invalid industryId or empty transcript
  - `500` on extraction failure — log to Vercel logs AND write a partial record so we don't lose the transcript
- **Acceptance**: A `curl` POST with a valid signed payload produces a new row in Supabase and triggers an email.

### 4.4 Test endpoint
- **File**: `app/api/call-ended/test/route.ts` (new)
- **Responsibility**: Runs the full pipeline (extraction + DB write + email optional) with the hardcoded `SAMPLE_BOUTIQUE_HOTEL_TRANSCRIPT` so we can iterate on the report page before FreeSWITCH is wired.
- **Auth**: requires `?secret=` query parameter matching `CALL_WEBHOOK_SECRET`, OR set a separate `TEST_ENDPOINT_SECRET`.
- **Response**: `{ assessmentId, url, assessment }` — includes the full JSON for inspection.
- **Method**: `GET` (so it's easy to hit from the browser during dev)
- **Acceptance**: Visiting `https://stackconsultingai.com/api/call-ended/test?secret=X` produces a real assessment and returns its URL.

### 4.5 Report renderer page
- **File**: `app/assessment/[uuid]/page.tsx` (new)
- **Responsibility**: Fetch assessment from Supabase by UUID, render Gamma-style report.
- **Sections** (in order, matching `gamma.app/docs/AI-Tools-Assessment-nrbxse43ik6bu7p`):
  1. **Hero** — caller name + business name + "Assessment Date: {date}" + one-paragraph executive summary
  2. **Opportunity Snapshot** — 3-tile grid: `weeklyHoursReclaimed`, `monthlyToolCost`, number of quick wins
  3. **Impact-Effort Matrix** — visual 2×2 grid of the pain points, colored by quadrant
  4. **Pain Points List** — each pain with area/currentState/hours-lost
  5. **Recommended Solutions** — 4 quick-win tool cards with name, tagline, cost, setup time, weekly hours saved, tailored "why this tool for you" copy
  6. **4-Day Quick Wins Plan** — day-by-day checklist
  7. **Financial Impact** — big-number block (hours/week, monthly cost, net ROI)
  8. **What Comes After Quick Wins** — major-project upsells
  9. **Next Steps** — "Book a 20-minute review call" CTA pointing to `/#contact`, and "Implement all four quick wins" CTA with pricing ($500 implementation fee, TBD)
- **Routing**: dynamic segment `[uuid]`, use `generateMetadata()` to set Open Graph image + title dynamically
- **Design**: Follow `CLAUDE.md` — navy primary, blue accent, Space Grotesk headings, no floating orbs, no animated H1 gradient. Match the visual tone of the existing homepage.
- **Edge cases**:
  - UUID not found → 404 (`notFound()`)
  - Caller gave no email → show report but hide "request was emailed" text
- **Acceptance**: Visiting the URL returned by the test endpoint renders a complete, branded, printable report with all 9 sections populated from real Claude-extracted data.

### 4.6 Email delivery
- **File**: `lib/email.ts` (new)
- **Responsibility**: Send branded assessment-ready email via Resend.
- **Export**: `sendAssessmentEmail(assessment: Assessment): Promise<void>`
- **Template** (HTML + plaintext):
  - From: `Stack Consulting AI <hello@stackconsultingai.com>` (verify sender in Resend)
  - Subject: `Your AI Tools Assessment is ready — {businessName}`
  - Body: short intro (≤ 3 paragraphs), prominent CTA button linking to `/assessment/{uuid}`, Chad's signature
  - Tone: per CLAUDE.md — builder voice, no marketing-speak
- **Acceptance**: Hitting the test endpoint triggers a real email to the address in the sample transcript (`maria@thedesertflower.com` — Chad must redirect during testing to his own address via env var override).

### 4.7 FreeSWITCH agent deployment (ops, not code)
- **Responsibility**: Deploy `buildInboundSystemPrompt()` output to the OpenAI Realtime agent on ext 5002.
- **Action**: SSH to `fspbx @ 100.78.119.28`, update the realtime agent config file (see `reference_voice_assistant.md` memory for exact location).
  - Voice: `sage`
  - Agent name: `Stacks`
  - Max session duration: 30 minutes
  - Transcript capture: enabled, stored alongside the session
- **Webhook hook**: FusionPBX dialplan condition on `hangup_complete` → `curl POST` to `https://stackconsultingai.com/api/call-ended` with JSON payload matching §4.3.
- **Acceptance**: A real call to the DID → AI answers as Stacks, runs the interview, on hangup a row lands in Supabase AND an email arrives at the caller's address.

### 4.8 Palm Springs DID purchase
- **Action**: via Telnyx API (Chad provides API key + connection ID).
- **Steps**:
  1. `GET /v2/available_phone_numbers?filter[phone_number][starts_with]=760`
  2. `POST /v2/number_orders` with chosen phone number
  3. Assign to existing Telnyx SIP connection
  4. Confirm inbound route in FusionPBX points to ext 5002
- **Acceptance**: Call the DID from a mobile phone; Stacks answers.

### 4.9 Homepage phone-first CTA update
- **File**: `components/FreeAssessmentOffer.tsx` (edit)
- **Responsibility**: Once the DID is live, make the phone number the primary CTA.
- **Changes**:
  - Add a big, click-to-call (`tel:+17607XXXXXX`) phone number display near the top of the section
  - Primary button becomes "Call Stacks now — (760) xxx-xxxx"
  - Form becomes secondary "Or request a callback"
  - Add microcopy: "Stacks answers 24/7. 10–20 minutes. You'll get your personalized report within 24 hours."
- **Acceptance**: Mobile visitors can tap the number to dial immediately; desktop visitors see the number clearly above the form.

### 4.10 Admin dashboard (stretch — out of scope for MVP but a good next task)
- **File**: `app/admin/assessments/page.tsx` (new, protected)
- **Responsibility**: List recent assessments with caller name, business, industry, date, and a link to each report.
- **Auth**: Basic auth or a simple cookie-gated route (consult Chad on auth posture).
- **Acceptance**: Chad can view all assessments at `/admin/assessments`.

---

## 5. Data contracts (already defined)

Do NOT redefine these types. Import them:

- **`lib/assessment-schema.ts`** — `Assessment`, `AssessmentPainPoint`, `AssessmentToolRecommendation`, `AssessmentFourDayStep`, `AssessmentFinancialImpact`, `AssessmentMajorProject`
- **`lib/tool-catalog.ts`** — `Tool`, `Tier`, `TOOLS`, `getToolById(id)`, `compactCatalogForPrompt()`
- **`lib/interview-scripts.ts`** — `INDUSTRY_SCRIPTS`, `INDUSTRY_OPTIONS`, `buildInboundSystemPrompt()`, `buildFullScript(industryId)`
- **`lib/claude-extract.ts`** — `extractAssessment({ transcript, industryId, callerPhoneNumber?, callDurationSeconds? })`, `SAMPLE_BOUTIQUE_HOTEL_TRANSCRIPT`

---

## 6. Environment variables

Add to Vercel (production + preview):

```
ANTHROPIC_API_KEY=sk-ant-...         # for claude-extract
RESEND_API_KEY=re_...                # for email
RESEND_FROM_EMAIL=hello@stackconsultingai.com
CALL_WEBHOOK_SECRET=<32-byte hex>    # HMAC for FreeSWITCH→Vercel
TEST_ENDPOINT_SECRET=<same or diff>  # for /api/call-ended/test
ASSESSMENT_EMAIL_REDIRECT=           # during dev, redirect all emails here
```

Already present (do not change):
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 7. Testing requirements

### 7.1 Unit
- `lib/claude-extract.ts` — mock the Anthropic client, verify the prompt includes the tool catalog + industry questions; verify Zod parse succeeds on a sample response
- `lib/assessments-db.ts` — mock Supabase client, verify round-trip of an `Assessment` object
- `lib/email.ts` — mock Resend client, verify template includes correct variables

### 7.2 Integration
- Test endpoint (`/api/call-ended/test`) — run once end-to-end in dev, inspect the resulting row, click through to the rendered report.
- Webhook (`/api/call-ended`) — POST a synthetic payload with a valid HMAC; expect 200 + a new Supabase row.
- Report page — snapshot test with the sample assessment; assert all 9 sections render.

### 7.3 Manual
- Call the DID from Chad's phone, run through a real interview, verify the generated report is accurate and well-formatted.

---

## 8. Out of scope (explicit non-goals for Phase B)

- Admin dashboard beyond what §4.10 describes
- Multi-language support
- A/B testing of report variants
- Automated follow-up sequences (one email per call, no drip)
- Internal metrics dashboard
- Caller identity verification beyond phone number
- Handling of multiple calls from the same caller within a short window (treat each call as a fresh assessment)
- Outbound callback feature (deferred until conversion data justifies it)
- SMS delivery of the report (email only for MVP)

---

## 9. Milestones

### M1 — Test harness works (no FreeSWITCH yet)
- [ ] Supabase migration applied (§4.1)
- [ ] `lib/assessments-db.ts` shipped (§4.2)
- [ ] `app/api/call-ended/test/route.ts` shipped (§4.4)
- [ ] `app/assessment/[uuid]/page.tsx` renders a real extracted report (§4.5)
- [ ] `ANTHROPIC_API_KEY` set in Vercel
- **Definition of done**: Visiting `/api/call-ended/test?secret=X` produces a fully-rendered report Chad can share as a demo.

### M2 — Real calls work (no email yet)
- [ ] `lib/email.ts` shipped with Resend wired (§4.6)
- [ ] `app/api/call-ended/route.ts` shipped with HMAC validation (§4.3)
- [ ] DID purchased on Telnyx (§4.8)
- [ ] FreeSWITCH agent deployed on ext 5002 (§4.7)
- [ ] FusionPBX hangup hook POSTing to Vercel
- **Definition of done**: Chad calls the DID from his cell, gets a real interview, row lands in Supabase within 60 seconds of hangup.

### M3 — End-to-end live
- [ ] Email delivery wired into webhook (§4.6)
- [ ] Homepage phone-first CTA shipped (§4.9)
- [ ] Test call from a second phone (not Chad's) produces a report in their inbox
- [ ] `RESEND_FROM_EMAIL` verified in Resend console
- **Definition of done**: Palm Springs prospect can call the DID, complete the interview, and receive a polished report by email. Shareable on LinkedIn.

### M4 — Operations
- [ ] Basic error alerting (Vercel log alert or Slack notification on webhook 500)
- [ ] Admin list view (§4.10, optional)
- **Definition of done**: Chad can monitor the pipeline without SSH'ing into anything.

---

## 10. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Claude extraction returns malformed JSON | Low | High | Zod parse throws → webhook logs the raw response; send Chad an alert; manual review |
| OpenAI Realtime agent drifts from script (improvises too much) | Medium | Medium | System prompt is strict; monitor first 10 calls; tune prompt as needed |
| FreeSWITCH → Vercel webhook loses transcript on network hiccup | Low | High | FusionPBX should retry on non-2xx; write partial record on extraction failure so transcript isn't lost |
| Caller refuses to give email | Medium | Low | Report is still saved and accessible at `/assessment/{uuid}`; email is nice-to-have, not blocking |
| Prospects weaponize the free offer (wasted calls, prank calls) | Medium | Low | Per-phone rate limit (1/hr, 5/day); if abuse continues, add voicemail-first screen before Stacks |
| Report quality is bad on edge-case industries | Medium | Medium | Start with the 4 industries Chad knows best; review each report before M3 |
| Telnyx DID gets flagged as spam | Low | Medium | Inbound-only means low spam risk; don't make outbound calls from this DID |

---

## 11. References

- Existing design system: `CLAUDE.md`
- Handoff context for this session: `docs/HANDOFF.md`
- Interview script source: `lib/interview-scripts.ts`
- Tool catalog: `lib/tool-catalog.ts`
- Corey Ganim's template origin: [audittemplate.ai](https://audittemplate.ai)
- Gamma sample deck: [gamma.app/docs/AI-Tools-Assessment-nrbxse43ik6bu7p](https://gamma.app/docs/AI-Tools-Assessment-nrbxse43ik6bu7p)
- Chris Koerner interview (framework context): [youtube.com/watch?v=03DjE7j0Suw](https://youtube.com/watch?v=03DjE7j0Suw)

---

## 12. Taskmaster hints (how to chunk this)

Suggested task breakdown for TaskMaster:

1. Create `assessments` Supabase migration (§4.1)
2. Build `lib/assessments-db.ts` data access layer (§4.2)
3. Build `/api/call-ended/test` endpoint with sample transcript (§4.4)
4. Build `/assessment/[uuid]/page.tsx` report renderer (§4.5) — split into: a) data fetch + layout scaffolding, b) each section block
5. Build `lib/email.ts` Resend wrapper + HTML template (§4.6)
6. Build `/api/call-ended` production webhook with HMAC (§4.3)
7. Update `components/FreeAssessmentOffer.tsx` for phone-first CTA (§4.9)
8. Write unit tests for extract + db + email (§7.1)
9. Document FreeSWITCH agent deployment steps in `docs/freeswitch-setup.md` (§4.7) — ops, not code, but should land as a tracked runbook
10. Telnyx DID purchase script `scripts/buy-did.ts` (§4.8)
11. Stretch: admin list at `app/admin/assessments/page.tsx` (§4.10)

Dependencies: 1 blocks 2 blocks 3 blocks 4. 5 blocks 6. 3 unblocks parallel work on 4 and 5. 7 is independent. 9 and 10 are ops-track and independent of the codebase.
