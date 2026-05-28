# Vertical Demo Funnel — Live-up Checklist

**Branch:** `feat/vertical-demo-funnel`
**Spec:** `docs/superpowers/specs/2026-05-28-vertical-demo-funnel-design.md`
**Plan:** `docs/superpowers/plans/2026-05-28-vertical-demo-funnel.md`

What shipped in commit `16ce6e6`:
- 4 vertical landing pages (`/demos/hvac`, `/demos/plumbing`, `/demos/auto`, `/demos/medspa`)
- Questionnaire → SMS verify → DID reveal funnel
- `demo_leads` table migration
- 4 vertical FreeSWITCH agent system prompts (TypeScript modules)
- `/api/call-ended` extended to branch on demo leads → Claude-summarized report email
- Sitemap updated

Build green at commit time. Vercel preview deploys automatically off this branch.

---

## Human-required steps (in order)

### 1. Apply the migration in Supabase

Open the Supabase SQL Editor for the project, paste the contents of
`migrations/20260528_demo_leads.sql`, and run. Verify:

```sql
select count(*) from demo_leads;   -- expect 0
```

### 2. Buy 4 Telnyx DIDs (paid — ~$4/month total)

In the Telnyx portal:
- Buy 4 numbers (preferably 949 or 714 area codes)
- Assign each to the existing `fspbx` IP-auth connection

Then set the 4 numbers in **Vercel → Environment Variables** AND `.env.local`:

```
DEMO_DID_HVAC=+1949XXXXXXX
DEMO_DID_PLUMBING=+1949XXXXXXX
DEMO_DID_AUTO=+1949XXXXXXX
DEMO_DID_MEDSPA=+1949XXXXXXX
```

Until these are set the verify endpoint returns `503 — Demo line for this
vertical is not provisioned yet`.

### 3. Telnyx Messaging (SMS verify codes)

```
TELNYX_API_KEY=<paste from Telnyx portal>
TELNYX_SENDER_NUMBER=+1XXXXXXXXXX    # the messaging-enabled sender DID
```

When these are unset, `lib/sms.ts` logs the code to the server console
and returns success — useful for dev, but production must have both.

### 4. Cloudflare Turnstile (optional but recommended)

Create a Turnstile site in the Cloudflare dashboard. Then set:

```
TURNSTILE_SECRET_KEY=<from Cloudflare>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<from Cloudflare>   # if/when widget is added to the form
```

When `TURNSTILE_SECRET_KEY` is unset, the start route skips Turnstile
verification (dev mode).

### 5. Internal-bridge secret (for FreeSWITCH lookups)

```
DEMO_INTERNAL_SECRET=<generate any long random string>
```

Used by `/api/demos/verify` GET (the FreeSWITCH bridge calls this with
`X-Internal-Secret: <secret>` to confirm an incoming caller is a known
demo lead before routing to a vertical agent).

### 6. FusionPBX dialplans (next session — needs SSH to `fspbx`)

For each of the 4 DIDs, insert a dialplan row routing the DID → vertical
extension. Per memory `phone/fusionpbx_dialplan`: dialplans live in
**Postgres + `/var/cache/fusionpbx/`**, not the XML files. After insert,
clear the cache:

```bash
ssh fspbx
sudo -u postgres psql fusionpbx -c "\copy ..."   # one row per DID
sudo rm -rf /var/cache/fusionpbx/dialplan.*
sudo systemctl reload freeswitch
```

### 7. FreeSWITCH vertical agents (next session)

Clone the existing voice-agent extension (`5002`) four times into `5003`
through `5006`. Each loads the corresponding prompt from
`lib/voice-agents/<vertical>.ts`. Configure:
- 3-minute hard cap (`sched_hangup` or per-leg timeout)
- Hangup webhook → `POST https://stackconsultingai.com/api/call-ended`
  with `industryId=<vertical>`, `callerPhoneNumber=<caller E.164>`,
  `transcript=<from OpenAI Realtime output>`, `uuid=<call uuid>`,
  `durationSeconds=<int>`
- HMAC: `X-Signature: sha256=<hex>` of body using `CALL_WEBHOOK_SECRET`

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
- Adding the Turnstile widget render to the form (server-verify is wired; widget rendering is a Phase 1B follow-up)

See the plan doc Tasks 17, 18, 19 for the queued work.
