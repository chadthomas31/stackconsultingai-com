# My Business (Slice 2) — Track B handoff

**As of 2026-07-06 late.** Track A is code-complete + opus-reviewed MERGE-ready on branch `feat/demo-slice2-mybusiness` (NOT merged — would 503 without the DID). Migration already applied to Supabase. This note is the exact remaining Track B work.

## Facts
- **My Business DID:** 949-868-5225 → `DEMO_DID_MYBUSINESS=+19498685225`. Active in Telnyx, Connection = `pbx.2105.io`. **No PBX dialplan route yet.**
- Dedicated ext for it: **5009** (per spec — dynamic persona).
- Box: `fspbx-2`. Tenant dialplan `/etc/freeswitch/dialplan/stackconsultingai.xml`, inbound `/etc/freeswitch/dialplan/public.xml`, agent `/usr/share/freeswitch/scripts/ai_assistant_demo.lua`.
- **Dependency:** the 5009 Lua fetches config from PROD `https://stackconsultingai.com/api/demo-business` — which only returns `industry/summary/services/greeting` **after Slice 2 Track A merges** (Task A6). So MERGE Slice 2 as part of this.

## Remaining steps (in order)
1. **Set `DEMO_DID_MYBUSINESS=+19498685225`** in Vercel (Production, `stackconsultingai-com`). Redeploy.
2. **Dialplan (safe additive; use minidom-validate-before-swap + backup + reloadxml):**
   - Tenant `stackconsultingai.xml`: add ext 5009 by copying the 5005 block (currently line 167):
     ```xml
     <extension name="demo-mybusiness-5009">
       <condition field="destination_number" expression="^5009$">
         <action application="set" data="execute_on_answer=sched_hangup +180 normal_clearing"/>
         <action application="lua" data="ai_assistant_demo.lua"/>
       </condition>
     </extension>
     ```
   - `public.xml`: add DID route (copy the `did-demo-*` pattern, insert before `  </context>`):
     ```xml
     <extension name="did-mybusiness">
       <condition field="destination_number" expression="^(\+?1?9498685225)$">
         <action application="set"      data="domain_name=stackconsultingai.com"/>
         <action application="transfer" data="5009 XML stackconsultingai.com"/>
       </condition>
     </extension>
     ```
3. **Lua 5009 dynamic branch** (`ai_assistant_demo.lua`):
   - Extend `lookup_business_by_caller` (line 116) → also capture `industry/summary/services/greeting` from the `/api/demo-business` JSON via the same string-match style as `business_name`; return a table.
   - Before line 113 `local V = VERTICALS[destination] or VERTICALS["5005"]`, add: if `destination == "5009"`, resolve the caller's config; pick base persona `VERTICALS[({hvac="5007",plumbing="5004",auto="5005",medspa="5006"})[cfg.industry] or "5005"]`; set `V = { id="mybusiness:"..industry, agent=BASE.agent, default_biz=cfg.business_name, persona=function(BIZ,AGENT) return BASE.persona(BIZ,AGENT).."About "..BIZ..": "..(cfg.summary or "")..(cfg.services and (" Key services: "..cfg.services..".") or "").." " end }`. If no config (unregistered caller) → generic "please register at stackconsultingai.com/demos, choose My Business" persona (do NOT leak another business). Full sketch: Slice 2 plan Task B2.
   - NOTE: `local BIZ = V.default_biz` (line 133) already resolves to `cfg.business_name` for 5009 via default_biz. Greeting/instructions below work unchanged.
4. **Hardening (punch list, do before/at merge):** server-validate `body.bizConfig` against `ReceptionistConfigSchema` in `app/api/demos/start/route.ts` before storing (raw client jsonb feeds this Lua persona). Also prevent client emptying services; fix schema `.describe()` counts.
5. **Merge Slice 2** `feat/demo-slice2-mybusiness` → main (deploys funnel + generate endpoint + demo-business config fields + DEMO_DID reveal). Only after step 1.
6. **E2E test** from a registered cell: /demos → My Business → generate/edit → SMS → reveal 949-868-5225 → call → agent answers as their business w/ base intake. Confirm prebuilt lines unchanged.

## Backups made today (revert points)
`ai_assistant_demo.lua.bak.{before-biz-lookup-fix, vad-biz-fix, far-field, hours-consent}` · `public.xml.bak.hvac-plumbing-migrate`

## Also queued (independent)
- Chad: cancel Retell + LiveKit subs (7926/7922 now on pbx.2105.io).
- Once trade demos verified good: flip `hvac/plumbing/medspa` `live:true` in `lib/voice-agents/index.ts` `DEMO_PICKER` (one word each) so the funnel reveals their numbers.
