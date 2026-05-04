# fs-pbx operations

Host: `fspbx` (107.175.53.217 / Tailscale 100.78.119.28). Runs FreeSWITCH + FusionPBX.

## The one gotcha that burns hours

**Editing `/etc/freeswitch/dialplan/*.xml` does NOTHING.** FusionPBX serves dialplans from PostgreSQL via a Lua `xml_handler`. `reloadxml` returns `+OK` while the file changes are never consulted.

Two cache layers:

1. **Postgres `v_dialplans` table** — source of truth for every extension/route.
2. **`/var/cache/fusionpbx/dialplan.<context>.<destination>`** — per-lookup file cache written by the Lua handler. Stale entries here will serve you yesterday's XML forever.

## Adding a new extension end-to-end

```bash
# 1. Insert the row
ssh fspbx 'sudo -u postgres psql -d fusionpbx' <<'SQL'
INSERT INTO v_dialplans (
  dialplan_uuid, domain_uuid, hostname, dialplan_context,
  dialplan_name, dialplan_number, dialplan_continue,
  dialplan_xml, dialplan_order, dialplan_enabled, dialplan_description
) VALUES (
  gen_random_uuid(),
  (SELECT domain_uuid FROM v_domains WHERE domain_name='stackconsultingai.com'),
  NULL,
  'stackconsultingai.com',
  'Example Extension',
  '5010',
  'false',
  '<extension name="example">
    <condition field="destination_number" expression="^5010$">
      <action application="lua" data="example.lua"/>
    </condition>
  </extension>',
  260,  -- pick a gap between existing orders
  'true',
  'Description'
);
SQL

# 2. If it's a public-context route (DID or internal-dial route), domain_uuid=NULL.

# 3. Nuke stale caches
ssh fspbx 'sudo rm -f /var/cache/fusionpbx/dialplan.public.5010 /var/cache/fusionpbx/dialplan.stackconsultingai.com'

# 4. Reload
ssh fspbx 'sudo fs_cli -x "reloadxml"'

# 5. Test — watch the live cascade
ssh fspbx 'sudo tail -f /var/log/freeswitch/freeswitch.log | grep -E "destination_number|Regex"'
```

## Internal dial of a tenant extension (the "why did 5003 busy out?" trap)

When ext 101 (softphone) dials **5003**, FS evaluates the **`public`** context first — not `stackconsultingai.com`. You need **two** rules:

- **Public route** (domain_uuid NULL): matches `^5003$`, runs `set domain_name=stackconsultingai.com` then `transfer 5003 XML stackconsultingai.com`.
- **Tenant extension** (domain_uuid = stackconsultingai.com's uuid): matches `^5003$` again, runs the Lua app.

Mirror how `ai-assistant-route` (public) + `ai-assistant` (tenant) work for 5002.

## Useful queries

```sql
-- all enabled dialplans by order
SELECT dialplan_order, dialplan_name, dialplan_context, dialplan_enabled
FROM v_dialplans WHERE dialplan_enabled='true'
ORDER BY dialplan_context, dialplan_order;

-- show one extension's XML
SELECT dialplan_xml FROM v_dialplans WHERE dialplan_uuid='<uuid>';

-- find a domain's uuid
SELECT domain_uuid FROM v_domains WHERE domain_name='stackconsultingai.com';
```

## Lua script conventions

- Location: `/usr/share/freeswitch/scripts/*.lua`
- Ownership: `www-data:www-data`, mode 644 (FS runs as `www-data`)
- Any config/data files Lua reads must also be readable by `www-data`. `/home/chad/` is **not** — use `/var/lib/freeswitch/<subdir>/` instead.

## Current deployed extensions (2026-04-19)

| Ext | Name                | Lua                       | Voice stack                              |
| --- | ------------------- | ------------------------- | ---------------------------------------- |
| 5002 | ai-assistant       | `ai_assistant.lua`        | OpenAI Realtime, `gpt-realtime`, `sage`  |
| 5003 | stacks-assessment  | `stacks_assessment.lua`   | OpenAI Realtime, `gpt-realtime`, `sage`  |

Init JSON for 5003 at `/var/lib/freeswitch/stacks_init/*.b64` (session.update + response.create + VAD re-enable, base64-encoded).

## DID routing

| DID            | Routes to             | Notes                                           |
| -------------- | --------------------- | ----------------------------------------------- |
| 949-749-0001  | `sca_inbound` IVR     | Main Stack Consulting line                       |
| 949-998-2424  | Ext 5000 (@strategicsync.com) | Strategic Sync line                      |
| 442-212-1616  | Ext 5003 directly     | Palm Springs AI Tools Assessment (bypasses IVR) |

## Alternative: FusionPBX web UI

If you'd rather avoid SQL, the FusionPBX admin UI on port 80 of fs-pbx provides equivalent CRUD for dialplans. Slower but harder to foot-gun. The cache-invalidation problem still bites either way — always nuke `/var/cache/fusionpbx/dialplan.*` after any change.

## 2026-04-29 — Outbound recovery + DNS watchdog

Fanvil X7A both 7001 lines red, outbound = busy.

**Cause chain:**
1. pfSense Unbound stuck reloading (kea2unbound sync hang). Port 53 timing out.
2. Fanvil resolved `stackconsultingai.com` → `76.76.21.21` (Vercel CDN) instead of `10.6.0.2`. REGISTERs went to public internet, never reached PBX.
3. After DNS fix → registered. Outbound 403 from Telnyx: "Caller Origination Number is Invalid D35".
4. From URI sent as `sip:7001@sip.telnyx.com` (extension, not DID). Telnyx rejects.

**Fixes:**
- Killed stuck unbound (`kill -9`) + restart `/usr/local/sbin/unbound -c /var/unbound/unbound.conf`.
- Watchdog `/usr/local/bin/dns-watchdog.sh` cron every 5 min, restarts unbound if `dig stackconsultingai.com` ≠ `10.6.0.2`. Persisted in `/cf/conf/config.xml` `<cron>` block.
- Global outbound dialplan `d1e2f3a4-5678-9abc-def0-123456789012` hardcodes `caller_id_number=19499982424` + `sip_from_user=19499982424`. Variable `${outbound_caller_id_number}` from FusionPBX directory expands EMPTY in dialplan context — channel var doesn't propagate despite `<variable>` in cache file. Hardcode required.

**Outstanding:**
- Stack DID `19497490001` not authorized on Telnyx as outbound CID. All outbound shows SS number even from Stack line.
- To split: Telnyx Mission Control → Voice → Outbound Profiles → Allowed Origination Numbers (add 19497490001). Then patch dialplan with `<condition field="${domain_name}" expression="^stackconsultingai\.com$">` branch setting Stack CID.
