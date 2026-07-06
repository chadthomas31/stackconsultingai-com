# Slice 1 — Auto AI Receptionist Demo, End-to-End Loop

**Date:** 2026-07-06
**Status:** Approved (design). Implementation plan pending.
**Owner:** Chad McCluskey / Stack Consulting AI

---

## 1. Background & grounded discovery

The `/demos` funnel is **~80% built** but fragmented. Four read-only discovery passes established the real state:

**Website — three overlapping funnels:**
- **Real funnel (works):** `/demos/[vertical]` → `components/demos/VerticalDemoFunnel.tsx` → `POST /api/demos/start` (Telnyx SMS 6-digit code) → `POST /api/demos/verify` (resolves `DEMO_DID_{VERTICAL}` env → returns dial string). SMS-gated, rate-limited (1/email, 1/mobile, 5/IP per 24h), writes Supabase `demo_leads`.
- **Stub front door:** `/demos` `#demo-call` → `components/demos/InboundDemoReveal.tsx` → `POST /api/demos/reveal`, which **always returns a hardcoded number** `(949) 749-0001` regardless of input, writes to the wrong table (`tool_leads`). Decorative, not a real demo.
- **Duplicate:** `/try` (`components/DemoRegister.tsx` → `POST /api/try`) — a second hardcoded number `(949) 239-7925`, real vertical `<select>`, **no verification**. Redundant.
- **Dead code:** `components/demos/CallMeDemo.tsx` + `POST /api/demos/call` — fully built server-side, zero UI importers.
- Homepage `/api/call-me` = **fake SSE theater**, places no real call (contradicts root CLAUDE.md — out of scope here, noted for later cleanup).

**Phone — migrated, CLAUDE.md stale:**
- `fspbx` = FusionPBX + FreeSWITCH, **migrated RackNerd→Vultr**. Prod is now `fspbx-2` (public `66.135.8.6`, Tailscale `100.117.67.62`); old `107.175.53.217` = failover, pending decommission. New box serves **static XML dialplans** (`/etc/freeswitch/dialplan/stackconsultingai.xml` + `public.xml`), not the FusionPBX DB path.
- AI voice = custom module `mod_openai_audio_stream.so` → **OpenAI Realtime (gpt-realtime, voice sage)**. Demo Lua = `ai_assistant_demo.lua`. Tool side-channel = `ai_function_handler.lua` → `ai-webhook.service` (Python, `127.0.0.1:8089`).
- Trunk = **Telnyx** (primary `66.135.8.6:5080`, connection `pbx.2105.io`).
- Ext→vertical: 5002 SCA main (749-0001), 5003 assessment, 5004 plumbing, 5005 auto, 5006 medspa, 5007 hvac, 5008 Dr Woods psychiatry.
- DID status: **auto 949-239-7925 LIVE**, medspa 7923 LIVE, Woods-demo 7924 LIVE. HVAC 7926 still on **Retell cloud**, plumbing 7922 still on **LiveKit cloud** (not migrated).
- **Broken return-leg:** demo calls write `/var/lib/freeswitch/ai_leads` + Postfix email only. They **do NOT POST transcripts to `/api/call-ended`**, so `demo_leads` rows never receive the call summary/report. This is the core gap.

**Compliance (engineering guidance, not legal advice):**
- OpenAI API = no-training by default, 30-day abuse retention. **ZDR + BAA (`baa@openai.com`) required before any real PHI**; healthcare addendum demands ZDR-only endpoints. Woods *production* correctly blocked on this.
- CIPA (all-party consent) — in-call disclosure already compliant (`lib/voice-agents/_shared.ts`, `CA_RECORDING_DISCLOSURE`). **Website consent copy is weak** (`components/DemoRegister.tsx:145` "recorded for quality"). Ambriz capability test → ZDR mitigates.
- Auto vertical = **no PHI** → safe to ship first without the BAA/ZDR gate.

**Engine decision (locked):** Keep FreeSWITCH + OpenAI Realtime (not Retell). The research reports recommended Retell but predate the built stack; their "own your control plane" thesis endorses what already exists.

---

## 2. Goal

A prospect selects **Auto** on the demo site, accepts a CIPA-safe consent notice, receives the live number **949-239-7925**, calls it, talks to the OpenAI Realtime auto-shop receptionist, and hangs up — after which the **call summary is captured in `demo_leads` and a lead report is emailed to Chad.** All other verticals capture the lead as "coming soon."

This proves the **full loop** for one vertical. Cloning to other verticals then becomes config + prompt work, not new architecture.

## 3. Non-goals (explicit — later slices)

- Migrating HVAC/Plumbing DIDs off Retell/LiveKit to FreeSWITCH.
- Building a Dental line or a dedicated General line.
- OpenAI BAA/ZDR execution for medspa/dental/Woods production.
- CRM (ServiceTitan/Jobber/etc.) and calendar write integration.
- Reporting dashboard, follow-up cron, retention automation.
- Fixing the homepage `/api/call-me` theater endpoint.

---

## 4. Architecture — the loop

```
Prospect on /demos
  → one funnel: pick vertical + accept CIPA consent
  → [Auto]  POST /api/demos/start  → Telnyx SMS 6-digit code
            POST /api/demos/verify → resolve DEMO_DID_AUTO → reveal 949-239-7925
  → [other verticals] capture lead only → "coming soon" → notify Chad
  → lead row in Supabase demo_leads  (+ Resend email + Discord to Chad)

Prospect dials 949-239-7925
  → Telnyx → FreeSWITCH fspbx-2 (66.135.8.6:5080)
  → public.xml matches DID → tenant context ext 5005
  → ai_assistant_demo.lua [AUTO prompt] → mod_openai_audio_stream.so → OpenAI Realtime
  → in-call CIPA disclosure (already compliant)

On hangup  ← THE NEW WIRING
  → PBX handler POSTs {caller, transcript, summary, actions, duration, vertical, call_uuid}
      to https://stackconsultingai.com/api/call-ended  (HMAC via CALL_WEBHOOK_SECRET)
  → /api/call-ended matches lead by caller mobile (findRecentLeadByMobile, 48h)
  → handleDemoCallEnded → Claude Haiku summarize → markCallFinished(demo_leads)
  → sendDemoReportEmail → Chad gets the lead + call report
  (local /var/lib/freeswitch/ai_leads + Postfix retained as fallback, not removed)
```

---

## 5. Website changes (Next.js / Vercel — no production PBX risk)

**Consolidate to one funnel.** Reuse `VerticalDemoFunnel` as the single component; add a **vertical picker** (6 options) and a **consent gate** ahead of reveal.

Branch by vertical availability:
- **Auto (live):** full path — SMS verify → reveal `DEMO_DID_AUTO` (949-239-7925).
- **Med Spa, HVAC, Plumbing, Dental, General (not live for slice 1):** **skip SMS/reveal**; capture the lead (name, work email, business, phone, vertical) → show "coming soon — we'll reach out to set up your line" → notify Chad. No number revealed.

**Consent copy** shown before the reveal/submit, drafted from the compliance pass:
> *This is a live AI demo — you'll be talking to an automated voice assistant, not a person. The call is recorded and processed by AI to run the demo. Please don't share medical, financial, payment, or other sensitive information — this is a demo line only.*

**Retire / stop linking:**
- Demo 01 stub: `components/demos/InboundDemoReveal.tsx` + `app/api/demos/reveal/route.ts`.
- Duplicate `/try`: `app/try/page.tsx`, `components/DemoRegister.tsx`, `app/api/try/route.ts` (redirect `/try` → `/demos`).
- Dead code: `components/demos/CallMeDemo.tsx` + `app/api/demos/call/route.ts` (remove).

**Notify Chad** on every lead (Auto + coming-soon): reuse the `/api/demos/notify` pattern (Resend email to `LEAD_NOTIFY_EMAIL` + Discord `DISCORD_WEBHOOK_URL`).

**Files likely touched:** `app/demos/page.tsx`, `components/demos/VerticalDemoFunnel.tsx`, `app/demos/[vertical]/*` (fold into single funnel or keep as deep-link entry), `lib/voice-agents/index.ts` (vertical registry + `getVerticalDid`), `app/api/demos/start/route.ts` + `verify/route.ts` (accept the consolidated flow), `app/api/demos/notify/route.ts`.

## 6. PBX changes (`fspbx-2` — production, executed only after plan approval)

- Modify the demo post-call handler (`ai-webhook.service` Python at `127.0.0.1:8089`, and/or the `ai_assistant_demo.lua` hangup hook) so that on a **completed Auto call** it POSTs the transcript/summary payload to `https://stackconsultingai.com/api/call-ended`, **HMAC-signed** with `CALL_WEBHOOK_SECRET`.
- **Keep** the existing `/var/lib/freeswitch/ai_leads` local write + Postfix email as a fallback — do not remove during this slice.
- Scope the change to the **Auto path only** first (single-vertical blast radius).
- Follow the `provision-phone` discipline: validate on the Auto extension before any broader rollout; `fs_cli -x reloadxml` deliberately; prefer a low-traffic window.

## 7. Configuration / secrets

| Var | Where | Note |
|---|---|---|
| `CALL_WEBHOOK_SECRET` | Vercel **and** `fspbx-2` | Currently unset → `/api/call-ended` accepts unsigned. Set both sides to the same value to enable HMAC. |
| `DEMO_INTERNAL_SECRET` | Vercel **and** `fspbx-2` | Gates the internal GET on `/api/demos/verify` used by the PBX to confirm a verified caller. |
| `DEMO_DID_AUTO` | Vercel | Already set = 949-239-7925. Verify. |
| Turnstile keys | Vercel | Optional; currently unset (bot-gate off). Out of scope to enable this slice; note the gap. |

## 8. Data model

**No migration needed.** `demo_leads` (migrations `20260528_demo_leads.sql`, `20260601_demo_leads_add_voice.sql`) already has: `vertical`, `first_name`, `biz_name`, `email`, `mobile_e164`, `sms_verified_at`, `consent_recording_at`, `did_dialed`, `demo_called_at`, `call_uuid`, `call_duration_s`, `call_summary`, `call_actions` (jsonb), `transcript`, `report_emailed_at`, `followup_state`, `voice`.

## 9. Compliance & security for this slice

- Website consent gate (copy above) before reveal/submit; write `consent_recording_at` on Auto submissions.
- In-call disclosure already compliant — no change.
- Auto = no PHI → no BAA/ZDR blocker.
- Enable HMAC on `/api/call-ended` via `CALL_WEBHOOK_SECRET` (closes the unsigned-webhook gap).
- Do not encourage callers to share sensitive data (consent copy handles this).
- Transcript retention hardening (short fixed window) deferred to a later slice — noted, not built here.

## 10. Error & success states

- **Start/verify errors:** invalid input → 400 with field message; missing `DEMO_DID_AUTO` → 503 "line temporarily unavailable"; rate-limit hit → friendly "try again later."
- **Coming-soon verticals:** always succeed to lead-capture + "we'll reach out" — never a dead end.
- **Return-leg:** if the PBX POST fails, the local `ai_leads` file + Postfix email still fire (fallback), and the failure is logged; `demo_leads` simply lacks the summary until reconciled.
- **Success:** Auto lead saved → number revealed → call completes → `demo_leads` updated with summary → Chad emailed.

## 11. Testing checklist

1. Submit an **Auto** lead → receive SMS code → verify → reveal shows **949-239-7925**.
2. **Call 949-239-7925 from a real cellular phone** (not a landline/softphone — cellular audio is the true test per project rule) → confirm the OpenAI Realtime auto receptionist answers and the CIPA disclosure plays.
3. Hang up → within ~1 min confirm: `demo_leads` row updated with `call_summary`/`call_duration_s`/`transcript`, and **Chad receives the lead-report email**.
4. Submit a **non-Auto** vertical (e.g. HVAC) → confirm "coming soon" + lead saved + Chad notified, **no number revealed**.
5. Rate-limit: second Auto submit with same email/mobile within 24h → blocked gracefully.
6. Tamper test: POST to `/api/call-ended` with a bad/missing HMAC → rejected (once `CALL_WEBHOOK_SECRET` is set).
7. `npm run build` green; deploy to Vercel; smoke-test live.

## 12. Definition of done

- `/demos` presents one consolidated funnel with a 6-vertical picker and a consent gate.
- Auto reveals the live number and routes to the working AI receptionist.
- A completed Auto call produces a `demo_leads` summary **and** a lead-report email to Chad (return-leg closed).
- Non-Auto verticals capture leads as "coming soon" + notify Chad.
- Old stub/duplicate/dead paths retired.
- `CALL_WEBHOOK_SECRET` HMAC enabled on both sides.
- Build green, deployed, verified with a real cell-phone test call.

## 13. Risks & mitigations

- **PBX edit disrupts live calls.** → Scope to Auto path only; keep local-file/Postfix fallback; `reloadxml` deliberately; validate per `provision-phone`; low-traffic window.
- **Secret mismatch** between Vercel and box → HMAC rejects all posts. → Set and verify both sides together; test #6.
- **Cellular one-way-audio / NAT** on the new box (flagged in handoff docs, unverified). → Mandatory cell-phone test (#2) before calling it done.
- **Turnstile off** → abuse bounded only by rate limits this slice. Accepted; enabling Turnstile is a later hardening item.

## 14. Locked decisions

1. Engine: **keep FreeSWITCH + OpenAI Realtime** (not Retell).
2. First slice: **one full vertical, end-to-end** (not web-only shell).
3. Vertical: **Auto** (live DID, no PHI).
4. SCA main line **949-749-0001 stays Stack-Consulting-only** — no prospect routing to it.
5. Keep the **SMS-verify** step (verified callback number = the lead).
6. Non-Auto verticals = **coming-soon lead capture** (don't reveal cloud numbers yet).
7. Notify = **email + Discord**.
