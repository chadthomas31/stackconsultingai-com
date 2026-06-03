# FusionPBX / FreeSWITCH — Vertical Demo Agent Setup

**Goal:** route each of the 4 vertical Telnyx DIDs to a dedicated FreeSWITCH extension that runs the OpenAI Realtime agent with the matching vertical system prompt.

**Companion to:** `docs/vertical-demo-funnel-handoff-2026-05-28.md`
**Memory ref:** `phone/fusionpbx_dialplan` (dialplan lives in Postgres + `/var/cache/fusionpbx/`, NOT XML)
**Existing agent ext:** `5002` (voice assistant, FreeSWITCH + OpenAI Realtime, webhook 8089)

---

## 0. Re-auth Tailscale to `fspbx`

If `ssh fspbx` times out with the "Tailscale SSH requires an additional check" message, visit the URL Tailscale prints and approve. Then:

```bash
ssh fspbx 'hostname && sudo systemctl is-active freeswitch postgresql'
```

Expect: `fspbx` + `active` + `active`.

---

## 1. Number → DID assignment (already in the handoff doc)

| E.164 | Vertical | Ext | Webhook industryId |
|---|---|---|---|
| `+19492397923` | HVAC | `5003` | `hvac` |
| `+19492397924` | Plumbing | `5004` | `plumbing` |
| `+19492397925` | Auto | `5005` | `auto` |
| `+19492397926` | Medspa | `5006` | `medspa` |
| `+19492397922` | (SMS sender — NOT an inbound voice route) | n/a | n/a |

---

## 2. Telnyx → fspbx SIP routing

For each of the 4 inbound DIDs in the Telnyx portal:

1. **Voice → SIP Connections** → open your existing `fspbx` connection
2. Confirm the IP-auth allow-list still includes `107.175.53.217` (the PBX public IP)
3. **Voice → My Numbers** → click each new DID → set:
   - **Connection** = `fspbx`
   - **Routing** = "Use connection's settings" (or whatever the existing main line uses)
   - **Translated number** = leave blank (let the dialplan handle it)

Verify a single DID works first before doing all 4: dial `+19492397923` from your cell — expect the PBX to answer (default behavior at this point — anything that proves the SIP route lands).

---

## 3. FusionPBX inbound routes — the WEB UI path (recommended)

Easier and less error-prone than direct Postgres inserts. Repeat 4 times.

1. Open FusionPBX web UI → **Dialplan → Inbound Routes** → **+**
2. Fill:
   - **Domain**: your primary domain (the one ext 5002 lives under)
   - **Destination Number**: the DID with no `+`, e.g. `19492397923`
   - **Action**: `Transfer extension` → `5003 XML <domain>`
   - **Description**: `Vertical demo · HVAC · 7923`
3. Save.
4. Repeat for `5004 / plumbing / 7924`, `5005 / auto / 7925`, `5006 / medspa / 7926`.

**Then clear the dialplan cache** (per memory `fusionpbx_dialplan` — required, the UI does not):

```bash
ssh fspbx
sudo rm -rf /var/cache/fusionpbx/dialplan.*
sudo systemctl reload freeswitch
```

Test: dial `+19492397923` → expect ext `5003` to ring. (Ext doesn't exist yet — it'll fail. That's fine. Confirms the route works.)

---

## 4. FusionPBX inbound routes — the SQL path (alternative)

If the web UI is slow or you want to script it. Run on `fspbx` as `postgres`:

```bash
ssh fspbx
sudo -u postgres psql fusionpbx
```

Get the domain UUID (use the same domain ext 5002 lives under):

```sql
select domain_uuid, domain_name from v_domains;
-- copy the domain_uuid for the demo domain
```

Get a dialplan UUID for the template (clone an existing inbound route):

```sql
select dialplan_uuid, dialplan_name, dialplan_number, dialplan_context
from v_dialplans
where domain_uuid = '<paste>' and dialplan_context = 'public'
order by dialplan_order;
```

For each DID, insert a new dialplan row + its conditions + action. The exact
column set depends on your FusionPBX version, but the canonical pattern is:

```sql
-- One row per DID. Repeat 4 times.
insert into v_dialplans
  (dialplan_uuid, domain_uuid, dialplan_name, dialplan_number, dialplan_context,
   dialplan_continue, dialplan_order, dialplan_enabled, dialplan_description)
values
  (gen_random_uuid(), '<domain_uuid>', 'Vertical demo · HVAC · 7923',
   '19492397923', 'public', 'false', '100', 'true', 'Routes Telnyx DID to ext 5003');
```

Then the matching `v_dialplan_details` rows (condition: `destination_number ^19492397923$`, action: `transfer 5003 XML <domain>`). It's easier to add via the UI and let FusionPBX populate the details table.

**ALWAYS clear the cache after** (XML files in cache out-of-sync with Postgres = silent failure):

```bash
sudo rm -rf /var/cache/fusionpbx/dialplan.*
sudo systemctl reload freeswitch
```

---

## 5. Cloning ext 5002 → 5003, 5004, 5005, 5006

The agent extensions need to:
1. Answer the call
2. Hand off to the FreeSWITCH ↔ OpenAI Realtime bridge with the vertical's system prompt
3. POST the transcript to `/api/call-ended` on hangup with the correct `industryId`

### 5a. Locate the ext 5002 config first

```bash
ssh fspbx
sudo find /etc/freeswitch /var/lib/freeswitch -name '*5002*' 2>/dev/null
sudo grep -RIn "industryId" /etc/freeswitch /var/lib/freeswitch 2>/dev/null | head
sudo grep -RIn "OPENAI" /etc/freeswitch 2>/dev/null | head
```

Note where the extension config lives (likely `/etc/freeswitch/directory/<domain>/5002.xml` or `/var/lib/freeswitch/.../5002.xml`) and where the agent runtime config lives (likely a Node/Python service with its own systemd unit — check `systemctl list-units --type=service | grep -i 'voice\|agent\|realtime'`).

### 5b. Clone the extension in FusionPBX UI

Easier and safer than file copies:

1. FusionPBX → **Accounts → Extensions** → click `5002` → top-right **Copy** (or use the Copy button on the list)
2. Set new extension number `5003`. Description: `Vertical demo agent · HVAC`.
3. Save.
4. Repeat for `5004`, `5005`, `5006`.

### 5c. Differentiate each clone

Per-extension differences:
- **System prompt**: each ext loads `lib/voice-agents/<vertical>.ts` (HVAC_SYSTEM_PROMPT, etc.). The agent runtime needs an env var or file pointer per ext.
- **Hangup webhook**: same URL, different `industryId` param.

If the existing agent runtime is a single service serving multiple extensions, give it a way to look up the vertical by the dialed extension. Quick path:

In the agent runtime config (wherever the prompt is loaded), branch on the destination extension:

```ts
const verticalByExt: Record<string, Vertical> = {
  "5003": "hvac",
  "5004": "plumbing",
  "5005": "auto",
  "5006": "medspa",
};
const vertical = verticalByExt[dialedExt] ?? "other";
const prompt = vertical === "other"
  ? GENERIC_PROMPT
  : VERTICAL_AGENTS[vertical].systemPrompt;
const industryId = vertical;
```

Then the hangup webhook POSTs:

```json
{
  "uuid": "<call uuid>",
  "industryId": "<vertical>",
  "callerPhoneNumber": "+1XXXXXXXXXX",
  "transcript": "<full transcript from Realtime>",
  "durationSeconds": 123
}
```

with header `X-Signature: sha256=<HMAC of body using CALL_WEBHOOK_SECRET>`.

### 5d. 3-minute hard cap

Add to each extension's dialplan or to the agent runtime: `sched_hangup +180 normal_clearing` (FreeSWITCH variable, applied right after answer). Pads the agent's own wrap-up window.

In FusionPBX UI: **Dialplan → Extensions → 5003 → Conditions → Add Action**:
- Application: `set`
- Data: `execute_on_answer=sched_hangup +180 normal_clearing`

Repeat for 5004, 5005, 5006.

---

## 6. Smoke test the full path

After 1–5 are done + the migration is applied + env vars set + Vercel preview is up:

```bash
# 1. Open https://stackconsultingai-com-git-feat-vertical-demo-funnel.vercel.app/demos/hvac
# 2. Submit the form with a real email + real mobile
# 3. Receive SMS code on the mobile, enter it
# 4. Tap to dial +19492397923
# 5. Agent answers, hits CA disclosure, runs the HVAC flow
# 6. Hang up after ~90 seconds
# 7. Check email — branded report should arrive in 60–90 seconds
# 8. Verify the lead row updated:
psql -h <supabase> -U postgres -c "
select id, vertical, sms_verified_at, demo_called_at, call_summary, report_emailed_at
from demo_leads order by created_at desc limit 1;
"
```

Repeat for plumbing/auto/medspa. If any vertical's email is missing fields, tune the prompt in `lib/voice-agents/<vertical>.ts` and redeploy.

---

## 7. Rollback

If anything goes sideways:

```bash
# Disable inbound routes (UI: Dialplan → Inbound Routes → toggle Enabled = false)
# OR delete the rows:
ssh fspbx
sudo -u postgres psql fusionpbx -c "
update v_dialplans set dialplan_enabled = 'false'
where dialplan_name like 'Vertical demo%';
"
sudo rm -rf /var/cache/fusionpbx/dialplan.*
sudo systemctl reload freeswitch
```

Telnyx side: leave numbers on the SIP connection — they'll just hit dead routes (no charge for an answered-then-hangup call, but Chad gets charged for the inbound minute either way until the route is removed at Telnyx).

To fully decommission: Telnyx → My Numbers → release the 5 DIDs ($1 release fee each is common — check current Telnyx terms).
