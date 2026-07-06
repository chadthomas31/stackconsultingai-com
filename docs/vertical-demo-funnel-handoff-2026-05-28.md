# Vertical Demo Funnel — Live-up Checklist

> **Canonical phone state:** [`docs/phone-system-handoff.md`](./phone-system-handoff.md) — start there for DIDs, env vars, and demo paths.

**Last reconciled:** 2026-07-06  
**Branch:** `main` (Turnstile fix merged in `0328c81`)
**Spec:** `docs/superpowers/specs/2026-05-28-vertical-demo-funnel-design.md`
**Plan:** `docs/superpowers/plans/2026-05-28-vertical-demo-funnel.md`

What shipped in commit `16ce6e6`:
- 4 vertical landing pages (`/demos/hvac`, `/demos/plumbing`, `/demos/auto`, `/demos/medspa`)
- Questionnaire → SMS verify → DID reveal funnel
- `demo_leads` table migration
- 4 vertical FreeSWITCH agent system prompts (TypeScript modules)
- `/api/call-ended` extended to branch on demo leads → Claude-summarized report email
- Sitemap updated

Build green at commit time. Production deploys from `main` via Vercel.

---

## Current live PBX state (verified 2026-06-05)

The PBX has moved past the original May 28 handoff. Do not route HVAC to
`5003`; that extension is the live Stacks Assessment agent.

| E.164 | Vertical | Live route |
|---|---|---|
| `+19492397923` | HVAC | `5007 XML stackconsultingai.com` |
| `+19492397924` | Plumbing | `5004 XML stackconsultingai.com` |
| `+19492397925` | Auto | `5005 XML stackconsultingai.com` |
| `+19492397926` | Medspa | `5006 XML stackconsultingai.com` |

FusionPBX has enabled public DID routes for all four demo numbers and tenant
routes for `5004`, `5005`, `5006`, and `5007`. The tenant routes run
`/usr/share/freeswitch/scripts/ai_assistant_demo.lua` and set
`execute_on_answer=sched_hangup +180 normal_clearing`.

The runtime report path currently uses the local OpenAI tool-call handler,
not the website `/api/call-ended` webhook. Function calls go through
`/usr/share/freeswitch/scripts/ai_function_handler.lua` to
`http://127.0.0.1:8089/`, served by
`/usr/share/freeswitch/scripts/ai_webhook_server.py`, which writes summaries
under `/var/lib/freeswitch/ai_leads` and sends Postfix emails. The website
`/api/call-ended` demo-lead report pipeline still exists, but the live demo
Lua script does not POST transcripts to it.

## Human-required steps (in order)

### 1. Apply the migration in Supabase

Open the Supabase SQL Editor for the project, paste the contents of
`migrations/20260528_demo_leads.sql`, and run. Verify:

```sql
select count(*) from demo_leads;   -- expect 0
```

### 2. Telnyx DIDs — PURCHASED 2026-05-28

5 Newport Beach (949) numbers, sequential, $5/mo total, SMS + Voice + HD Voice enabled:

| E.164 | Role |
|---|---|
| `+19492397922` | SMS sender (outbound codes + DID-reveal texts) |
| `+19492397923` | HVAC inbound (ext 5007; `5003` is Stacks Assessment) |
| `+19492397924` | Plumbing inbound (ext 5004) |
| `+19492397925` | Auto inbound (ext 5005) |
| `+19492397926` | Medspa inbound (ext 5006) |

Set in **Vercel → Environment Variables** AND `.env.local`:

```
DEMO_DID_HVAC=+19492397923
DEMO_DID_PLUMBING=+19492397924
DEMO_DID_AUTO=+19492397925
DEMO_DID_MEDSPA=+19492397926
```

Until these are set the verify endpoint returns `503 — Demo line for this
vertical is not provisioned yet`.

### 3. Telnyx Messaging (SMS verify codes)

```
TELNYX_API_KEY=<paste from Telnyx portal — Messaging API key>
TELNYX_SENDER_NUMBER=+19492397922
```

**10DLC — MNO_PROVISIONED (2026-06-09).** Campaign is live on carriers:

| Field | Value |
|---|---|
| Brand | Stack Consulting AI |
| TCR ID | `C70VRIQ` |
| Telnyx campaign ID | `4b30019e-9b92-3d7b-8055-906cc08a4b56` |
| Status | `MNO_PROVISIONED` (provisioned 2026-06-09) |

**Post-provision checklist:**
1. Telnyx → Messaging → 10DLC → assign **`+19492397922`** to this campaign
2. Set `TELNYX_API_KEY` + `TELNYX_SENDER_NUMBER` in Vercel (Production)
3. Redeploy after env changes

When these are unset, `lib/sms.ts` logs the code to the server console
and returns success — useful for dev, but production must have both.

### 4. Cloudflare Turnstile (vertical demo bot check)

Create a Turnstile site in the Cloudflare dashboard (hostname must include
`stackconsultingai.com` and `*.vercel.app` for previews). Then set **both**:

```
TURNSTILE_SECRET_KEY=<from Cloudflare>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<from Cloudflare — same widget as secret>
```

**Enforcement rule (shipped on `main`, commit `0328c81`):**
- Turnstile is enforced only when **both** keys are set
- `VerticalDemoFunnel` renders the widget when `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  is present at **build** time — **redeploy Vercel after adding the public key**
- If only `TURNSTILE_SECRET_KEY` is set (no public key), the API skips bot
  check so the funnel still works

**"Bot check failed" root cause (fixed on main):** old code required a token
when only the secret was set, but the form had no widget. Fixed in `0328c81` —
ensure Vercel prod has deployed this commit.

When both keys are unset, the start route skips Turnstile (dev mode).

### 5. Internal-bridge secret (for FreeSWITCH lookups)

```
DEMO_INTERNAL_SECRET=<generate any long random string>
```

Used by `/api/demos/verify` GET (the FreeSWITCH bridge calls this with
`X-Internal-Secret: <secret>` to confirm an incoming caller is a known
demo lead before routing to a vertical agent).

### 6. FusionPBX dialplans — DONE as of 2026-06-05

Verified via Postgres on `fspbx-pub`: all four public DID routes exist and
route to live tenant demo extensions. If changed later, remember FusionPBX
dialplans live in **Postgres + `/var/cache/fusionpbx/`**, not static XML.
Always clear `/var/cache/fusionpbx/dialplan.*` and reload FreeSWITCH after
dialplan edits.

### 7. FreeSWITCH vertical agents — DONE as of 2026-06-05

Verified via Postgres and script inspection: `5004`, `5005`, `5006`, and
`5007` run `ai_assistant_demo.lua`; the script maps destination extension to
vertical internally:

- `5007` = HVAC
- `5004` = Plumbing
- `5005` = Auto
- `5006` = Medspa

Open follow-up: decide whether to keep the current local webhook-report path
or wire the demo script into website `/api/call-ended` so Supabase
`demo_leads` rows get call summaries and branded Resend reports.

### 8. Demo calendar (fake-busy)

Create a Google Calendar (or Cal.com calendar) reserved for demos. Add a
nightly cron to insert a "Stack Demo Hold" block 2 hours out, 1-hour
duration. Wire the agent's `check_availability` tool to consult this
calendar. (Phase 1C in the plan.)

---

## Smoke test (after steps 1–7 are done)

1. Open https://stackconsultingai.com/demos/hvac (or preview URL)
2. Fill the form with a real email + real mobile
3. Receive SMS code on the mobile, enter it on the page
4. DID reveals — tap to dial
5. Call connects, agent disclosure plays, walk through the script
6. Hang up
7. Check the email in 60–90 seconds — branded report should arrive
8. Verify the lead row appears in Supabase:
   ```sql
   select id, vertical, sms_verified_at, demo_called_at, report_emailed_at
   from demo_leads order by created_at desc limit 5;
   ```

---

## Cost ceiling (planned, not yet wired — Phase 1C task 17)

Per spec: env `DEMO_DAILY_DOLLAR_CAP=50`. When breached, flip the
FusionPBX dialplan rule for the affected DID(s) to play a "cap reached"
prompt. **Not implemented yet** — guard manually by checking Supabase
demo call volume daily until task 17 ships.

---

## What's deliberately not yet built

- Follow-up cron (d+1 / d+3 / d+7)
- Admin viewer (`/admin/demos`)
- Real Cal.com / Google Cal write integration (currently mocked in agent prompt)
- Spanish-language agents
- Cost ceiling autosuspend

**Done on main (`0328c81`):** Turnstile widget render on `VerticalDemoFunnel` via `components/TurnstileWidget.tsx`.

See the plan doc Tasks 17, 18, 19 for the queued work.
