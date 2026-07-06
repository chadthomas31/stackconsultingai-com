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

## Current deployed extensions (2026-07-06)

| Ext | Name                | Lua                       | Voice stack                              |
| --- | ------------------- | ------------------------- | ---------------------------------------- |
| 5002 | ai-assistant       | `ai_assistant.lua`        | OpenAI Realtime, `gpt-realtime`, `sage`  |
| 5003 | stacks-assessment  | `stacks_assessment.lua`   | OpenAI Realtime, `gpt-realtime`, `sage`  |
| 5004 | demo-plumbing      | `ai_assistant_demo.lua`   | OpenAI Realtime vertical demo            |
| 5005 | demo-auto          | `ai_assistant_demo.lua`   | OpenAI Realtime vertical demo            |
| 5006 | demo-medspa        | `ai_assistant_demo.lua`   | OpenAI Realtime vertical demo            |
| 5007 | demo-hvac          | `ai_assistant_demo.lua`   | OpenAI Realtime vertical demo            |

**Note:** ext **5003** is the live **Stacks Assessment** agent (AI Tools Assessment product). It is **NOT** the HVAC vertical demo — HVAC is **5007** (`+19492397923`).

Init JSON for 5003 at `/var/lib/freeswitch/stacks_init/*.b64` (session.update + response.create + VAD re-enable, base64-encoded).

## Vertical demo extensions (2026-06-05)

Verified on fspbx: public DID routes + tenant extensions for vertical demos. Scripts at `/usr/share/freeswitch/scripts/ai_assistant_demo.lua`; reports via local webhook `127.0.0.1:8089` (`ai_webhook_server.py`), not website `/api/call-ended`.

| Ext | Vertical | Telnyx DID (E.164) | Telnyx display |
| --- | -------- | ------------------ | -------------- |
| 5007 | HVAC | `+19492397923` | 949-239-7923 |
| 5004 | Plumbing | `+19492397924` | 949-239-7924 |
| 5005 | Auto | `+19492397925` | 949-239-7925 |
| 5006 | Medspa | `+19492397926` | 949-239-7926 |

SMS sender for vertical funnel verification: `+19492397922` (949-239-7922). Website env vars `DEMO_DID_*` must match these DIDs. Full handoff: `docs/phone-system-handoff.md`.

## DID routing

| DID            | Routes to             | Notes                                           |
| -------------- | --------------------- | ----------------------------------------------- |
| 949-749-0001  | `sca_inbound` IVR     | Main Stack Consulting line                       |
| 949-239-7922  | Telnyx SMS only       | Vertical funnel verification sender (not voice)  |
| 949-239-7923  | Ext 5007              | HVAC vertical demo                               |
| 949-239-7924  | Ext 5004              | Plumbing vertical demo                           |
| 949-239-7925  | Ext 5005              | Auto vertical demo                               |
| 949-239-7926  | Ext 5006              | Medspa vertical demo                             |
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

## 2026-05-25 — Phones dead: WireGuard tunnel went one-way

All phones dead, `sofia status profile internal reg` = 0 registrations. FreeSWITCH up, services active.

**Cause:** WireGuard tunnel (pfSense ↔ PBX) went **asymmetric**. pfSense→PBX (10.6.0.2) worked; PBX→pfSense (10.6.0.1) + PBX→phone (172.16.40.11) = 100% loss. PBX `wg show` handshake stale 9h despite 25s keepalive. A **stale pf state on pfSense** (`70.191.32.41:51820 <- 107.175.53.217:46884`) blocked the PBX return path.

**Fix (on pfSense):**
```sh
pfctl -k 107.175.53.217    # flush stale state for PBX endpoint
```
Phone re-registered within seconds once the data path restored. No tunnel restart needed.

**Diagnostic trap:** `ping 10.6.0.1` from PBX stays 100% loss EVEN WHEN tunnel is healthy — pfSense firewalls ICMP to its own tunnel IP. Use `ping 172.16.40.11` (a phone) as the real tunnel-health signal, not the WG peer IP.

## 2026-05-25 — VoIP QoS on pfSense (HFSC) + the WireGuard classification trap

Goal: protect voice on the client WAN **upload** bottleneck. WAN measured ~566↓ / **98↑ Mbps** (ix3, friendly name `wan`). All phone↔PBX voice rides the WG tunnel.

**The trap that cost hours:** you CANNOT tag the WG tunnel into a priority queue. pfSense encrypts the tunnel itself → the egress is **firewall-originated**, and pf floating `match out` rules evaluate it but match **0 packets** (self-originated traffic isn't matched on the out hook). The encrypted voice always lands in the ALTQ **default** queue. (Also: outbound WG goes to the PBX's listen port `46884`, not pfSense's `51820`.)

**The fix — invert the queues.** Make the default queue the protected one (host-origin voice lands there) and push *forwarded client bulk* (which DOES match pf rules) into a separate queue. HFSC on `wan`/ix3, root 90 Mb:
- `qVoice` = `hfsc ( default, realtime 2Mb )` — voice + firewall-origin traffic, low-latency guarantee.
- `qBulk` = 90% linkshare, no realtime — bulk.
- Floating rule: `match out on ix3 from 172.16.0.0/12 to any → queue qBulk`.

Verified: tunnel pings climb `qVoice` counter; forwarded client traffic → `qBulk`.

**pfSense apply gotchas (Plus 26.03):**
- Root ALTQ queue `<name>` MUST equal the interface friendly name (`wan`), not a label — else `get_real_interface()` returns blank → `altq on  hfsc` (no iface) → "No queue in use".
- `filter_configure_sync()` from bare `php -r` throws. Reliable apply: edit `$config` → `write_config()` → `/etc/rc.filter_configure` → `pfctl -f /tmp/rules.debug` (last step actually loads pf).
- `/etc/rc.filter_configure` returns before ALTQ loads — poll `pfctl -sq`.
- Counters: `pfctl -vsq | grep "queue  qVoice"` (two spaces).
- Backup before changes: `/conf/config.xml.pre-qos-*`. Rollback: restore → `/etc/rc.filter_configure` → `pfctl -f /tmp/rules.debug`.

Skipped FreeSWITCH RTP DSCP marking — inner DSCP dies in the WG tunnel and the VPS network likely ignores it; WAN HFSC is the real win. Full detail in memory `networking/reference_pfsense_qos.md`.

## 2026-05-29 — Phones down: stale pf state on pfSense killed S2S WG tunnel
**Symptom:** 0 internal SIP registrations. WG handshake dead 4h20m on both ends despite 25s keepalive. PBX `10.6.0.2` ↔ homelab pfSense `10.6.0.1` (WAN 70.191.32.41).
**Root cause:** pfSense WAN gateway flapped (~04:30 PT; NTP reach also dropped to 0). The WAN pass rule for UDP/51820 uses `reply-to (ix3 70.191.32.1) keep state`. WG responses are firewall-originated and matched the **stale reply-to state** pinned to the pre-flap gateway → black-holed. pfSense RECEIVED PBX handshake inits (rx counter climbed) but its responses never egressed WAN. ICMP/DNS/Tailscale worked (fresh states), masking it.
**What did NOT fix it:** `wireguardd restart`, `pfctl` interface destroy+rebuild of `tun_wg0`, WG restart on PBX. States survive all of these.
**Fix (1 cmd):** on pfSense — `pfctl -k 107.175.53.217` (kill states for the PBX host). Handshake completed in <20s; 7001 + 8001 re-registered, Ping-Status Reachable.
**Diagnostic path:** `wg show` both ends (handshake age) → tcpdump on PBX `eth0` (saw PBX→pfSense only) → tcpdump pfSense `ix3` (confirmed 0 WG egress while DNS/ICMP egress fine) → `pfctl -ss | grep <pbx_ip>` (stale reply-to state).
**Note:** SSH pfSense via LAN `172.16.23.1` when the Tailscale alias (`pfsense`/100.116.74.40) hangs on reauth. `wg show` on PBX needs `sudo`. NOT a phone/provisioning issue — no template push.

## 2026-05-31 — "Phones not ringing" = Fanvil DND (NOT server/tunnel)
**Symptom:** Both 7001 + 8001 register + OPTIONS-ping Reachable, WG tunnel healthy, but every INVITE → `480 Temporarily not available` / FS `NO_USER_RESPONSE`. Survives a check-sync reboot (so it's persisted config, not a wedge).
**Root cause:** Phone-wide DND enabled on the Fanvil X7A. Web UI: Phone settings → Features → `DND Option = Phone (val=1)`, `DND Response Code = 480` (exact match). Timer unchecked = manual/always-on.
**Fix (remote, no handset trip):** Fanvil web UI is reachable from the **homelab LAN** (NOT over the WG tunnel — http://172.16.40.11 = 200 from a 172.16.23.x host; tunnel only routes SIP/RTP so PBX-side curl gets 000). Login admin/admin (frameset, Rapid Logic server). Phone settings → Features → set **DND Option = Off**, Apply (`save()`). Verify originate flips from `-ERR NO_USER_RESPONSE` to `+OK`.
**Key:** server-side reboot/migration does NOTHING for phone DND. Always ring-test (originate to the contact) — registration + OPTIONS Reachable do NOT prove calls work. If DND recurs, someone's pressing the DND softkey.
