# Stack Consulting AI — Demos + Portal + Apply Tracker

Master task list. Picked up by Cursor or Claude Code in any session.
Last sync: 2026-04-29.

Goal: ship `/demos` page (3 live AI demos) + client phone portal at
`portal.stackconsultingai.com`, then apply to OpenAI AI Support Engineer
with live URLs as proof.

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked

---

## Phase 1 — `/demos` portfolio page (stackconsultingai.com)

- [x] **Task 1 — Scaffold `/demos` page + 3 component shells + mock APIs**
  - Files created:
    - `app/demos/page.tsx` (server, metadata, asymmetric layout)
    - `components/demos/CallMeDemo.tsx`
    - `components/demos/LeadAgentDemo.tsx`
    - `components/demos/KbDemo.tsx`
    - `app/api/demos/call/route.ts` (mock SSE)
    - `app/api/demos/notify/route.ts` (mock SSE)
    - `app/api/demos/kb/route.ts` (mock SSE)
  - Edited: `components/Navbar.tsx` (Live Demos link), `app/sitemap.ts`
  - Build verified: `/demos` 7.42 kB / 119 kB First Load JS, prerendered.
  - Uncommitted on `main`. Push when ready.

- [x] **Task 2 — Wire Demo 3: Lead → Claude Haiku → Discord + Resend** (2026-05-04)
  - `app/api/demos/notify/route.ts` — real Claude Haiku 4.5 with tool-use
    `classify_lead` schema (intent/urgency/reasoning/summary/recommended_action).
    Streams thought → fields → summary → notify events as JSONL-over-SSE.
  - Discord webhook POST → color-coded embed (red/amber/blue by urgency)
    with name/business/email/phone/next-action/reasoning/verbatim fields.
    Server: Stack Ops, channel: `#leads-demo`.
  - Resend email → branded HTML, replyTo set to lead's email so Chad can
    hit reply directly. Resend domain verification required (chad did this).
  - Rate-limited via existing `enforceRateLimit("demo-lead")` (24h ledger).
  - Env-guarded: missing keys → notify shows "skipped — reason" not crash.
  - `LeadAgentDemo.tsx` — added Email (required) + Phone (optional) inputs.
    Replaced Slack icon with MessageSquare. Sample prompts include emails.
  - `app/demos/page.tsx` — copy updated: "Discord · Email" not "Slack · CRM".
  - Tested live end-to-end: Discord embed posted + email landed.

- [ ] **Task 3 — Wire Demo 1: Call Me (real FreeSWITCH outbound)**
  - PBX 107.175.53.217, FsPBX webhook port 8089, ext 5002 (OpenAI Realtime).
  - Validate phone (E.164), rate-limit 1/IP/hr, hCaptcha gate.
  - Originate via FsPBX webhook. Persist as lead in Supabase.
  - Stream stage updates from FreeSWITCH webhook callback.
  - Replace mock STAGES in `app/api/demos/call/route.ts`.
  - Existing `app/api/call-me/route.ts` is theatrical — do NOT reuse.

- [x] **Task 4 — Wire Demo 2: KB RAG Q&A** (2026-07-05)
  - Implemented with `lib/portfolio/kb` in-memory corpus (10 service-doc topics) +
    `/api/demos/kb` SSE: `text-embedding-3-small` retrieval → `gpt-4o-mini` stream
    with citations. Rate-limited via `demo-kb`.
  - Supabase pgvector migration remains optional future work if corpus grows beyond
    in-process embeddings.

- [x] **Task 5.5 — Rewrite audit results: consulting diagnosis flow** (2026-04-29)
  - New `lib/site-audit-diagnose.ts` — Claude Haiku 4.5 with structured tool-use
    output. Industry classifier + executive summary + top fixes + business
    impact bullets + 2-phase Stack action plan + CTA copy.
  - `app/api/site-audit/route.ts` — fetches HTML for title/meta, calls
    `diagnoseAudit` after Lighthouse, ships `diagnosis` in `done` SSE event.
    Stores diagnosis in Supabase `tool_leads.tool_data.diagnosis`.
  - `components/SiteAudit.tsx` — replaced gauge wall with 5-section consulting
    report (executive summary + scorecard + top fixes + business impact +
    Stack action plan + raw findings collapsible + dark navy CTA bar). Light
    mode, navy + brand blue. Dropped emerald-400/amber-400 dark palette.
  - Build verified: `/tools/site-audit` 8.04 kB / 113 kB First Load JS.
  - Open: ANTHROPIC_API_KEY already in Vercel (used by newsletter-gen).

- [x] **Task 5.6 — Audit v2: orange scorecard + category info + keyword audit** (2026-04-29)
  - NEW `lib/keyword-audit.ts` — Claude Haiku audits HTML for keyword usage,
    density, missing local keywords, headline alignment, NAP/schema/geo signals.
    Industry-aware (dental/legal/plumber/etc).
  - `app/api/site-audit/route.ts` — fetches full HTML once, runs diagnose +
    keyword audit (keyword stage uses diagnose's industry_label). Streams both
    in `done` event. Persisted to Supabase.
  - `components/SiteAudit.tsx`:
    - Mobile/Desktop columns now ORANGE (`text-orange-600`)
    - Each scorecard row clickable — expands to show "what it measures" +
      "why it matters" (Performance, SEO, Accessibility, Best Practices)
    - New "Keyword & Local SEO" section (between Top Fixes and Business Impact):
      keywords-found list + keywords-missing list (orange-highlighted, with
      monthly search volume estimates) + headline alignment + local SEO
      checklist (NAP/schema/geo/city-in-title) + 3-5 Monday actions
  - Build: `/tools/site-audit` 9.68 kB / 115 kB
  - **Open: CTA color standardization** — recommended sitewide swap to orange
    (`btn-cta-call`) for primary actions, brand blue for secondary. Awaiting
    Chad's go.

- [x] **Task 5.7 — Sitewide CTA color swap + business-impact finding copy** (2026-04-29)
  - Globally swapped `btn-accent` → `btn-cta-call` (orange) in 17 files:
    Navbar, FinalCTA, Newsletter, Hero/CityAi/Receptionist/Readiness pages,
    PricingTier, Newsletter/Generator/Quota tools, all demo + portfolio
    components, FoundingClientSpecial, FreeAssessmentOffer, etc.
  - Brand blue retained for kickers, accents, "biggest gap" callouts.
  - Reworded all 12 `FINDING_DESCRIPTIONS` in SiteAudit.tsx to lead with
    business consequence (revenue, conversion, bounce, CA Unruh exposure)
    instead of technical jargon.
  - Build clean.

- [x] **Task 5.8 — Stack Report nav fix + multi-channel meeting chooser** (2026-04-29)
  - **Stack Report nav** — `/stack-report` and `/stack-report/[slug]` now mount
    `<Navbar />` + `<Footer />`. Visitors can navigate back to homepage via
    logo or any nav link. Added `pt-24` for fixed-nav offset.
  - **NEW** `components/CallOptions.tsx` — popover button replacing single
    `tel:` CTAs. Visitor picks: Call now (tel:) · Text (sms:) · Schedule
    Google Meet (mailto with prefilled subject/body) · Schedule Zoom
    (mailto with prefilled subject/body) · Email. Closes on outside-click
    + Escape. Three style variants: primary / ghost / navy.
  - Wired into Hero secondary CTA (replaces "Talk to an AI expert" ghost
    button) + final CTAs on ai-receptionist, ai-readiness-audit, CityAi
    (powers all 6 city pages), services/ai-consulting-orange-county.
  - Mailto fallback for Meet/Zoom — when Cal.com or Calendly is set up,
    swap `mailto:` hrefs in CallOptions.tsx for direct booking URLs.
  - Build clean.

- [~] **Task 5 — Polish + ship `/demos`** (nearly complete — pending live URL confirm)
  - [x] Homepage card (`DemosCTA`) between Portfolio and Testimonials (2026-07-05).
  - [x] Copy pass + a11y polish on `/demos` page and `components/demos/*` (2026-07-05):
    truthful stack labels, KB input aria-label/maxLength, aria-live transcript,
    reduced-motion live-dot rule in `globals.css`.
  - [ ] Motion budget audit + perf check (no LCP regression).
  - [ ] Push to GitHub → Vercel auto-deploys → confirm live URL.
  - Blocks Task 14.

---

## Phase 2 — Client phone portal (`~/projects/sca-client-portal/`)

Stack: Next 16, React 19, Tailwind v4, Prisma + SQLite, NextAuth v5 beta.

- [ ] **Task 6 — Prisma schema**
  - Models: `Client`, `User` (tenant-scoped), `Extension`, `Call`,
    `Lead`, `Recording`, `Setting`.
  - `npx prisma migrate dev` + seed Fix It SC as first tenant.

- [ ] **Task 7 — FsPBX → Portal ingest webhook**
  - HMAC-auth endpoint receives call-end events from FreeSWITCH.
  - Pulls recording + transcript, runs Claude Haiku summary, writes Call row.
  - Depends on Task 6.

- [ ] **Task 8 — NextAuth magic-link + tenant scoping**
  - Magic link via Resend. All queries scoped by `clientId` from session.
  - Depends on Task 6.

- [ ] **Task 9 — Dashboard view**
  - Weekly stats: total calls, AI-resolved %, leads captured, after-hours saves.
  - Sparkline of call volume by hour. Recent 10 calls table.
  - Depends on Task 7.

- [ ] **Task 10 — Call detail page**
  - Audio player + transcript + AI summary + tags.
  - J/K keyboard shortcuts to navigate prev/next.
  - Depends on Task 9.

- [ ] **Task 11 — Lead inbox + CSV export**
  - Filterable list of leads (intent, urgency, age). Bulk CSV download.
  - Depends on Task 9.

- [ ] **Task 12 — Settings**
  - Business hours, greeting upload, forward-to number, on-hold music.
  - Pushes config to FreeSWITCH via FsPBX API.
  - Depends on Task 8.

- [ ] **Task 13 — Deploy + onboard Fix It SC**
  - Vercel project `portal.stackconsultingai.com`.
  - Migrate SQLite → Supabase Postgres for prod.
  - First pilot: Fix It San Clemente. Validate end-to-end with real calls.
  - Depends on Tasks 9, 10, 11, 12.
  - Blocks Task 14.

---

## Phase 3 — Apply

- [ ] **Task 14 — Apply: OpenAI AI Support Engineer (US Remote / SF)**
  - Pitch: "Hands-on IT problem solver who understands real customer envs."
  - Proof links: `/demos` (3 live AI demos) + `portal.stackconsultingai.com` (real client production tool).
  - Then apply: AI Success Engineer → Solutions Engineer (reach).
  - Depends on Tasks 5 + 13.

---

## Dependency graph

```
1 ──┬── 2 ──┐
    ├── 3 ──┼── 5 ──┐
    └── 4 ──┘       │
                    ├── 14
6 ──┬── 7 ── 9 ─┬── 10 ──┐
    └── 8 ──────┴── 11 ──┼── 13 ──┘
            └── 12 ──────┘
```

## Open questions

1. ~~Slack webhook~~ → resolved 2026-05-04: Discord (free) + Resend
2. KB corpus source — write fresh or pull existing site copy?
3. Portal domain confirmation: `portal.stackconsultingai.com` ok?
4. First pilot tenant — Fix It SC confirmed, or pick another?

## Reference paths

- Demos repo: `~/stackconsultingai-com/`
- Portal repo: `~/projects/sca-client-portal/`
- PBX: 107.175.53.217 (Tailscale `fspbx` @ 100.78.119.28)
- FusionPBX dialplan: Postgres + `/var/cache/fusionpbx/` — NOT XML files
- Voice agent: ext 5002, webhook port 8089
- Brand canon: `~/stackconsultingai-com/CLAUDE.md`
