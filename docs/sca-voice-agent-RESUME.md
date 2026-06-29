# SCA AI Receptionist — Session Resume / Handoff

**Last worked:** 2026-06-28 (late). **Pick up here in Cursor.**
**Code repo:** `~/projects/sca-voice-agent/` (NOT this repo — this doc is just the pointer/handoff).
**Spec + plan:** `~/projects/sca-voice-agent/docs/2026-06-28-sca-ai-receptionist-spec.md` and `…-sca-receptionist-phase0-plan.md`.

---

## What this is

Multi-tenant AI **receptionist** phone system. **Stack Consulting AI is tenant #1** (dogfood).
Caller dials a client's DID → Telnyx → LiveKit agent → resolves the tenant **by the dialed DID** from Supabase → runs that business's script: greet → qualify → **transfer to a human / take a routed voicemail / answer + email a summary**. New client = buy a DID + insert one DB row. No FusionPBX in the call path.

**SCA's live number:** **949-749-0001** (`+19497490001`).

## Status: BUILT + UNIT-TESTED. Not yet live on the phone.

✅ Done (7 commits in `sca-voice-agent`, 6 unit tests green):
- Supabase schema `tenants` / `tenant_configs` / `call_logs` applied to project **`iygtsyuftivmkbpfpdpe`** (RLS on — agent uses service key, anon blocked).
- SCA seeded as tenant #1 on DID `+19497490001`, consulting persona, voice `cedar`, tightened greeting.
- `tenant_store.py` (DID→config resolve + call logging + directory match), `notify.py` (Resend email — **proven**, test email sent to chad.mccluskey@gmail.com), consulting persona in `prompts.py`.
- `agent.py`: resolves tenant by dialed DID (`sip.trunkPhoneNumber`), persona/voice/greeting from config, **`transfer`** tool (LiveKit SIP REFER), **`take_message`** tool (routed voicemail → email + call_log), `send_call_summary` → email + call_log. `TENANT_DID` env lets the playground resolve a tenant without a real call.
- All keys wired into `~/projects/sca-voice-agent/.env` (gitignored) + validated: **LiveKit, Supabase, Resend, OpenAI (from PBX), Telnyx** — all HTTP 200.
- A local dev worker was running (`python agent.py dev`, registered to LiveKit Cloud project `stackconsultingai-4zfzi5o5`, US West B). May have been stopped since.

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
