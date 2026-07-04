# SCA AI Receptionist — Session Resume / Handoff

**Last worked:** 2026-06-28 (late). **Pick up here in Cursor.**
**Code repo:** `~/projects/sca-voice-agent/` (NOT this repo — this doc is just the pointer/handoff).
**Spec + plan:** `~/projects/sca-voice-agent/docs/2026-06-28-sca-ai-receptionist-spec.md` and `…-sca-receptionist-phase0-plan.md`.

---

## What this is

Multi-tenant AI **receptionist** phone system. **Stack Consulting AI is tenant #1** (dogfood).
Caller dials a client's DID → Telnyx → LiveKit agent → resolves the tenant **by the dialed DID** from Supabase → runs that business's script: greet → qualify → **transfer to a human / take a routed voicemail / answer + email a summary**. New client = buy a DID + insert one DB row. No FusionPBX in the call path.

**SCA's live number:** **949-749-0001** (`+19497490001`).

## Status: BUILT + UNIT-TESTED. Telephony validation in progress on a TEST DID.

### Live-state reconcile (2026-06-28 late, docs-verified)
- `lk` authed → project `stackconsultingai` (`p_2xcfliji23w`).
- **NOT deployed to Cloud yet.** `livekit.toml` has agent id `CA_5q6faLkrtETy` but `lk agent status` = "no agents found" (stub only). Serving off **local `python agent.py dev`** worker (`AW_GzwoKuUQXayE`, US West B).
- **No trunk for the live number yet.** LiveKit inbound trunks exist for TEST DIDs only: `+19492397922` (`ST_CJAP2KZv42Tm`, rule `SDR_FPBFchik9kEN`) and `+19492397926` (`ST_xjn44gnhi9h3`, rule `SDR_u6E6ZsHNkgAn`). Nothing for `+19497490001`.
- Agent registers with **no `agent_name`** → **automatic dispatch** (why test rules work with empty Agents col). Docs flag auto-dispatch "not recommended" + prefer explicit for SIP inbound — but single-agent/DID-resolves-tenant design = auto is fine. **Do NOT add `agent_name` now**; it would silently break the test rules. Switch to explicit only when a 2nd agent type exists.
- **Step 1 (validate on test DID) underway:** cloned SCA config onto `+19492397922` via `seed/clone_test_did.py`. Dial that number to validate the whole path without touching the live line.

✅ Done (7 commits in `sca-voice-agent`, 6 unit tests green):
- Supabase schema `tenants` / `tenant_configs` / `call_logs` applied to project **`iygtsyuftivmkbpfpdpe`** (RLS on — agent uses service key, anon blocked).
- SCA seeded as tenant #1 on DID `+19497490001`, consulting persona, voice `cedar`, tightened greeting.
- `tenant_store.py` (DID→config resolve + call logging + directory match), `notify.py` (Resend email — **proven**, test email sent to chad.mccluskey@gmail.com), consulting persona in `prompts.py`.
- `agent.py`: resolves tenant by dialed DID (`sip.trunkPhoneNumber`), persona/voice/greeting from config, **`transfer`** tool (LiveKit SIP REFER), **`take_message`** tool (routed voicemail → email + call_log), `send_call_summary` → email + call_log. `TENANT_DID` env lets the playground resolve a tenant without a real call.
- All keys wired into `~/projects/sca-voice-agent/.env` (gitignored) + validated: **LiveKit, Supabase, Resend, OpenAI (from PBX), Telnyx** — all HTTP 200.
- A local dev worker was running (`python agent.py dev`, registered to LiveKit Cloud project `stackconsultingai-4zfzi5o5`, US West B). May have been stopped since.

## IVR REDESIGN SPEC (2026-06-29, locked with Chad)

**Stack now (deployed `CA_KWdbN4njVzgN`, us-east, LiveKit Cloud, no Vultr):** STT-LLM-TTS pipeline via **LiveKit Inference** — STT `deepgram/nova-2-phonecall`, LLM `openai/gpt-4o-mini`, TTS `elevenlabs/eleven_flash_v2_5` (voice **Chris** `iP95p4xoKVk53GoZ742B`, env-swappable via `lk agent update-secrets`). Turn detector (local MultilingualModel) + preemptive_generation + BVCTelephony. All docs-verified as LiveKit's recommended telephony default.

**Hours-aware IVR, press OR speak (DTMF via `room.on("sip_dtmf_received")` + LLM speech routing). Hours = Mon–Fri 9–5 PT.**

Business-hours menu: 1) AI assessment 2) discovery w/ Chad or Robert 3) existing-client project update 4) other / leave message (callback ≤2 business hrs) 9) repeat.
After-hours menu: 1) AI assessment (24/7) 2) leave message / stay on line.

- **Press 1 — assessment:** offer choice → (a) **email** the `/ai-readiness-audit` link, or (b) **AI runs it live** (~5 Qs). After live run: business hrs → **connect to a live person** (warm transfer); after hrs → take message / promise callback.
- **Press 2 (biz hrs) — discovery:** capture name+business+callback, **warm-transfer to Chad/Robert's Fanvil**; busy(486)/no-answer → take message. (after hrs press 2 = leave message)
- **Press 3 (biz hrs):** transfer to Chad, else message. **Press 4:** take message. **Press 9:** repeat.
- Always confirm callback # against caller ID ("I see you're calling from 949-…").

### UPDATE 2026-06-29 — prebuilt LiveKit components + warm-transfer outbound path

Adopted LiveKit's **prebuilt tools/tasks** (deterministic, replace prompt-only capture):
- **`EndCallTool`** (`livekit.agents.beta.tools.end_call`) — real hangup + drain; kills the "you too / take care" goodbye loop. Registered in `AutoReceptionist.__init__` via `tools=[EndCallTool()]`.
- **`GetEmailTask`** + **`GetPhoneNumberTask`** (`livekit.agents.beta.workflows`) — wrapped as `capture_email` / `capture_callback_number` function tools. Deterministic spoken-email/digit normalization + read-back confirmation. **Fixes the two prod data-integrity bugs** Chad caught: email `messing`→`messaging`, dropped phone digit. Prompt now instructs the LLM to CALL these tools, not transcribe.
- **`WarmTransferTask`** (`livekit.agents.beta.workflows`) — now powers the `transfer` tool. Dials the human over SIP, **plays hold music while ringing** (fixes 45-sec dead air), hands off conversation context, merges calls; on no-answer/decline returns control → fall back to `take_message`.

**Outbound SIP path BUILT (2026-06-29):**
- Telnyx **credential connection `livekit-outbound-cred`** (id `2993163152432039640`, user `lkoutb792a97d`) with outbound voice profile **`livekit-outbound`** (`2984867140496000449`). Password in scratchpad `telnyx-out.env` (NOT committed).
- LiveKit **outbound trunk `telnyx-outbound`** = **`ST_NPjCJ2L3c6JJ`** → `sip.telnyx.com`, caller-ID `+19492397922`.
- Secrets (Cloud agent, out-of-band): `LIVEKIT_SIP_OUTBOUND_TRUNK=ST_NPjCJ2L3c6JJ`, `FALLBACK_TRANSFER_NUMBER=<Chad cell, E.164>`.
- **Default transfer target = Chad's cell** (works now, no Fanvil dependency). Rings the cell via Telnyx outbound.

**STILL PENDING — Fanvil desk option (optional upgrade over cell):** Fanvil registers to `sip.telnyx.com` as its OWN Telnyx credential connection (user/pass in Fanvil web UI); assign a spare DID to that connection so calling it rings the desk; then set `FALLBACK_TRANSFER_NUMBER` to that DID. The existing **"Forward Only"** credential connection (`2897015468504122451`) is unused/leftover — could be repurposed or replaced. Chad's manual step: enter SIP creds into the Fanvil web UI + pick which DID rings the desk.

## The greeting (in the DB, change anytime — it's config)

> "Thanks for calling Stack Consulting AI — the future of local business. We build AI-driven websites and streamline the work that eats your day, so you save time and make money. How can we help you today?"

## NEXT STEPS (in order)

1. **`lk cloud auth`** — DONE BY CHAD interactively (the CLI was alias-shadowed by `ls`; fixed — `lk` now = LiveKit CLI, size-sort moved to `lsz`). If not yet authed: run `lk cloud auth` in a terminal, approve in browser.
2. **Deploy to LiveKit Cloud Agents:** `cd ~/projects/sca-voice-agent && lk agent create`. Repo has `Dockerfile` + `livekit.toml`. **Must upload secrets** as Cloud Agent secrets (not from local .env): `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`, `NOTIFY_FROM`, `STT_PROVIDER=openai`. Colocated compute = the choppiness fix (no Vultr).
3. **Telephony wiring (LiveKit dashboard or `lk sip`):** inbound SIP trunk + dispatch rule that matches `+19497490001` (auto-dispatch to the agent).
4. **Flip the number (Telnyx) — IRREVERSIBLE-ish, confirm first:** `+19497490001` currently routes to `connection_id 2899570832932079605` = **`pbx.2105.io` (FreeSWITCH)**. PATCH it to the LiveKit SIP connection **`livekit-sip` (id 2984850083519923950)**. Verify the FQDN trunk **anchorsite = `Chicago, IL`** (US) — this is the dominant choppiness fix; "Latency" auto-picks an EU anchor.
5. **Dial 949-749-0001 from a clean line** (Google Voice — a T-Mobile cell adds its own choppiness). Confirm: greets as Stack Consulting AI → transfer rings Chad → voicemail for Rob emails → summary email.

## OPEN ITEMS (needed for transfer + voicemail to actually route)

- **Chad's cell (E.164)** → `tenant_configs.transfer_default` + directory.
- **Robert Crabbe's cell + email** → directory (Rob = Chad's business partner). Currently null, so voicemail-for-Rob logs but emails nowhere.
- Apply out-of-band (do NOT commit real values):
  ```sql
  update tenant_configs set transfer_default='+1XXXXXXXXXX',
    directory='[{"name":"Chad","email":"chad.mccluskey@gmail.com","cell":"+1..."},
                {"name":"Rob","email":"...","cell":"+1..."}]'::jsonb
  where did='+19497490001';
  ```

## Key facts / gotchas (don't relearn these)

- **Engine = pipeline, NOT realtime.** `agent.py` defaults to Deepgram/OpenAI STT → `gpt-4o-mini` → OpenAI TTS. `gpt-realtime` was choppy on cellular. (Corrects the older `livekit_phone_live` memory.) We set `STT_PROVIDER=openai` so only the OpenAI key is needed (no Deepgram key).
- **OpenAI key** lives on the PBX, not in the SCA repo: `ssh fspbx-pub 'sudo -n cat /etc/freeswitch/openai.env'`. (`.env.local` here has a placeholder.)
- **Resend key** is at `~/.config/Resend/RESEND_API_KEY` (valid). The Vercel `RESEND_API_KEY` is "Sensitive" = unpullable. Sender domain `stackconsultingai.com` is Resend-verified → `receptionist@stackconsultingai.com` works.
- **Service-role Supabase key** = Vercel `stackconsultingai-com` env `SUPABASE_SERVICE_ROLE_KEY` (pulled into agent `.env` as `SUPABASE_SERVICE_KEY`).
- **LiveKit Cloud SIP host ≠ project web subdomain** — get the SIP URI from dashboard Telephony → SIP trunks.
- **Scaling ceiling = concurrent calls, not client count.** Thousands of tenants is fine.

## Commands cheat-sheet

```bash
cd ~/projects/sca-voice-agent && source .venv/bin/activate
pytest -q                                  # 6 tests green
TENANT_DID=+19497490001 python agent.py dev  # local worker; test in agents-playground.livekit.io
lk cloud auth                              # interactive login (Chad)
lk agent create                            # deploy to LiveKit Cloud Agents
```
