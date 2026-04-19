# AI Tools Assessment — Build Handoff

> For the next agent (Conner, or a fresh Claude session on holyclaude) picking up this work.
> Last updated: 2026-04-18

## TL;DR

Chad is building a **free AI Tools Assessment** as the signature homepage lead magnet at stackconsultingai.com. The mechanic:

1. Prospect dials in to a public phone number (Palm Springs DID, not yet purchased — Telnyx account needed)
2. **Stacks** — our FreeSWITCH + OpenAI Realtime voice agent (sage voice, ext 5002) — answers, conducts a 10–20 minute structured business interview
3. Post-call: transcript → Claude Sonnet 4.6 → structured JSON assessment
4. Rendered at `/assessment/[uuid]` as a Gamma-style report
5. Emailed to the caller via Resend within 24 hours

Based on Corey Ganim's playbook (Chris Koerner interview: youtube.com/watch?v=03DjE7j0Suw). Chad's differentiator vs Corey: inbound phone call instead of 45-min Zoom. Lower friction, faster completion.

## Current state (commits in order)

| Commit | What |
|---|---|
| `ad676e4` | Full retellai-light redesign of homepage (light theme, navy + blue, 14 sections per CLAUDE.md canon) |
| `f918271` | 14-industry interview script catalog (`lib/interview-scripts.ts`) |
| `c769c1b` | Homepage `FreeAssessmentOffer` component with industry dropdown |
| `b2b105c` | Tool catalog, assessment schema, Claude extraction pipeline |

Production: https://stackconsultingai.com — deployed on Vercel via auto-deploy from `main`.

## What's DONE

- Retellai-light theme (palette, hero, logo strip, comparison, FAQ, final CTA)
- Homepage `FreeAssessmentOffer` with 14-industry dropdown (including Boutique hotel for Palm Springs push)
- Interview scripts — 13 industries + 1 generic fallback, ~15 questions each
- `buildSystemPrompt(industryId)` — for outbound (pre-selected industry)
- `buildInboundSystemPrompt()` — for inbound (Stacks asks industry and branches)
- Tool catalog — 20 tools with tier/category/cost/compliance metadata
- Assessment schema (TypeScript types matching Gamma deck)
- Claude extraction: `extractAssessment(transcript, industryId)` using Sonnet 4.6 + adaptive thinking + Zod structured outputs + prompt caching
- Sample boutique-hotel transcript for testing (`SAMPLE_BOUTIQUE_HOTEL_TRANSCRIPT`)
- `@anthropic-ai/sdk`, `resend`, `zod` installed

## What's PENDING

| Task | File(s) | Notes |
|---|---|---|
| Report renderer | `app/assessment/[uuid]/page.tsx` | Dynamic Next.js page that fetches from Supabase and renders the Assessment JSON as a Gamma-style branded page. Sections: hero → exec summary → opportunity snapshot (hrs/$/wins) → impact-effort matrix → 4 recommended tools → 4-day plan → financial impact → major projects → final CTA. |
| Webhook receiver | `app/api/call-ended/route.ts` | POST handler for FreeSWITCH `hangup_complete` hook. Receives `{uuid, industryId, transcript, recordingUrl, callerPhoneNumber, durationSeconds}`. Calls `extractAssessment()`, writes to Supabase, triggers email. |
| Supabase schema | `migrations/20260418_assessments.sql` | `assessments` table with columns mirroring `Assessment` type. UUID primary key. |
| Email dispatch | `lib/email.ts` + template | Resend integration. Branded HTML template with link to `/assessment/[uuid]`. Called from webhook after extraction. |
| Test endpoint | `app/api/call-ended/test/route.ts` | Runs full pipeline with `SAMPLE_BOUTIQUE_HOTEL_TRANSCRIPT` so we can see a rendered report before FreeSWITCH is wired. |
| Homepage phone-first CTA | `components/FreeAssessmentOffer.tsx` | Change: make the phone number the primary CTA once a DID is purchased. "Call Stacks now: (760) xxx-xxxx". Form becomes secondary "Request a callback". |
| FreeSWITCH agent prompt | (on fspbx host) | Deploy `buildInboundSystemPrompt()` output to OpenAI Realtime agent on ext 5002. Agent name: Stacks. Voice: sage. Config lives in `/home/chad/...` on `fspbx @ 100.78.119.28` — see `reference_voice_assistant.md` memory. |
| FreeSWITCH hangup webhook | (on fspbx host) | FusionPBX dialplan condition on `hangup_complete` → POST to `https://stackconsultingai.com/api/call-ended` with JSON payload. Include uuid generated at call start, transcript (from Realtime session), recording URL. |
| Palm Springs DID | Telnyx | Search `(760)` area code, buy, attach to existing SIP connection, route inbound to ext 5002. Needs Chad's Telnyx API key. |

## Env vars needed (Vercel)

```
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=... (already set, uses existing)
CALL_WEBHOOK_SECRET=... (HMAC for FreeSWITCH→Vercel auth)
```

## Key file map

```
~/stackconsultingai-com/
├── CLAUDE.md                         ← design system, section canon, banned words
├── lib/
│   ├── interview-scripts.ts          ← 14 industry scripts + buildSystemPrompt()
│   ├── tool-catalog.ts               ← 20 recommendable tools
│   ├── assessment-schema.ts          ← Assessment TypeScript types
│   ├── claude-extract.ts             ← extractAssessment() + sample transcript
│   └── supabase.ts                   ← existing Supabase client
├── components/
│   ├── Hero.tsx                      ← "better stack." hero (light theme)
│   ├── FreeAssessmentOffer.tsx       ← 14-industry dropdown + phone form
│   ├── ClientLogoStrip.tsx
│   ├── StackComparison.tsx
│   ├── FAQ.tsx
│   ├── FinalCTA.tsx
│   └── ... (existing: Portfolio, Testimonials, Services, Newsletter, etc.)
└── app/
    ├── page.tsx                      ← homepage with section canon order
    └── (api/call-ended and assessment/[uuid] not yet created)
```

## Relevant infra (from CLAUDE.md + memories)

- **FreeSWITCH PBX**: `fspbx @ 107.175.53.217` (Tailscale `100.78.119.28`)
- **Existing OpenAI Realtime voice assistant**: ext 5002 (see memory `reference_voice_assistant.md`)
- **LuxVPS/OpenClaw**: `45.11.229.187` (Tailscale `100.70.232.22`) — available for proxy if needed
- **Supabase**: already wired in `lib/supabase.ts`; service-role key configured server-side
- **Existing chat widget**: GoHighLevel (loaded in `app/layout.tsx`). ElevenLabs was removed.

## Design system (locked in CLAUDE.md)

- Light mode, navy `#00122e` primary, bright blue `#3e6aef` accent
- No animated gradients on H1, no floating orbs, no pulse-glow buttons
- Space Grotesk (`font-heading`) + Inter (`font-body`)
- Section kicker → H2 → subhead pattern
- Banned words: leverage, synergize, unlock, transform, empower, cutting-edge

## How to pick up

1. `git pull origin main` on this repo
2. `npm install`
3. Read `CLAUDE.md` (design system) and this file (state of work)
4. `npm run dev` — see homepage at localhost:3001
5. Next task is probably the **test endpoint** — fastest way to prove the pipeline: create `app/api/call-ended/test/route.ts` that runs `extractAssessment(SAMPLE_BOUTIQUE_HOTEL_TRANSCRIPT, "boutique-hotel")` and returns JSON. Then build the `/assessment/[uuid]` page that renders it. Then wire the real webhook + DB + email last.

## Decisions already made (don't re-litigate)

- Inbound call only (not outbound). Reason: no bridge proxy, no abuse vector, more viral (business card pitch).
- Bot name: **Stacks**.
- Voice: OpenAI Realtime `sage`.
- Report format: Gamma-style (pain → matrix → quick wins → 4-day plan → ROI). Template origin: Corey Ganim's audittemplate.ai.
- Pricing: free forever. Monetization is upsells listed in `majorProjects` ($3–5K process optimization, $1–3K Zapier/Make, $200/mo Speed-to-Lead, $150/mo + setup for FreeSWITCH IVR).
- DID strategy: buy `(760)` Palm Springs area code on Telnyx. Chad's API key needed.
