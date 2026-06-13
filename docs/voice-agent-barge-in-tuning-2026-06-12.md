# Voice Agent Barge-In / Interruption Tuning (FreeSWITCH + OpenAI Realtime)

**Date:** 2026-06-12
**Symptom:** Agent stops mid-sentence, especially when the caller is on a cell phone / speakerphone.
**Diagnosis (confirmed, matches HANDOFF §5):** This is a **turn-detection / barge-in failure in the voice pipeline, not an LLM problem.** Swapping the model will not fix it. The agent's VAD is treating cell-network noise, echo, and backchannel ("uh-huh", "okay") as the caller interrupting, so it cuts its own speech.

### FIRST: confirm WHICH agent the cell-phone call is hitting

As of 2026-06-06 there are **three** voice stacks coexisting on fspbx. The barge-in knobs live in a different place for each — edit the wrong one and nothing changes:

| Stack | What it is | Where turn-taking config lives |
|---|---|---|
| **OpenAI Realtime** (ext 5002, booking agent) | `ai_assistant.lua` → `wss://api.openai.com/v1/realtime?model=gpt-realtime` | base64 `session.update` strings **inside** `/usr/share/freeswitch/scripts/ai_assistant.lua` (ext 5003 variant uses `/var/lib/freeswitch/stacks_init/*.b64`) |
| **elevenlabs-bridge** (RUNNING, "SCA Receptionist") | `~/elevenlabs-bridge/bridge.js` → ElevenLabs ConvAI agent `agent_2001knwsqcn2f118s852t8hm03mj` | **ElevenLabs agent config** (dashboard or API PATCH) — NOT on the server. Knobs: turn-timeout / interruption sensitivity |
| **stacks-bridge** (Deepgram, INACTIVE) | 15-min assessment interviewer | `~/stacks-bridge/` (skip unless revived) |

Find which one answers the demo line: `ssh fspbx 'sudo grep -RIn "5002\|5003\|demo" /usr/share/freeswitch/scripts/ /var/lib/freeswitch/ 2>/dev/null | head'` and check `systemctl is-active elevenlabs-bridge`.

**This doc covers the OpenAI Realtime path** (current VAD confirmed in memory: `server_vad`, threshold 0.5, prefix_padding 300ms, silence_duration 500ms — the exact stock defaults Option B fixes). If the cell-phone demo is the **ElevenLabs Receptionist**, the fix is the same *concept* (raise interruption threshold, lengthen end-of-turn timeout) but applied in the ElevenLabs agent config — see the note at the bottom.

The OpenAI fix is to change `turn_detection` and add `input_audio_noise_reduction` in the base64 `session.update`. Note `gpt-realtime` (the deployed model) **does** support `semantic_vad` and `input_audio_noise_reduction`.

---

## Root-cause → OpenAI Realtime knob mapping

| HANDOFF §5 recommendation | OpenAI Realtime API setting |
|---|---|
| 1. Semantic turn detection (not raw energy VAD) | `turn_detection.type: "semantic_vad"` |
| 2. Require words before interrupting / tolerate pauses | `eagerness: "low"` (semantic) — waits for a *complete* thought |
| 3. Noise suppression + echo cancel on inbound leg | `input_audio_noise_reduction.type: "far_field"` |
| 4. Endpointing delay ~700–800ms for cell jitter | `silence_duration_ms: 750` (server_vad path) |
| 5. Backchannel filtering ("okay/yeah/mm-hm") | semantic_vad handles inherently; server_vad → raise `threshold` |
| 6. Always test from a real cell on a real network | manual — never a LAN softphone |

`far_field` is the single most important change for the cell-phone case: it's OpenAI's noise-reduction profile tuned for speakerphone / distant-mic audio, and it kills the self-echo loop where the agent hears its own voice and barges in on itself.

---

## Option A — RECOMMENDED: semantic VAD (best for noisy cell callers)

Patch the `session` object inside the init JSON with:

```json
{
  "type": "session.update",
  "session": {
    "turn_detection": {
      "type": "semantic_vad",
      "eagerness": "low",
      "create_response": true,
      "interrupt_response": true
    },
    "input_audio_noise_reduction": {
      "type": "far_field"
    }
  }
}
```

- `semantic_vad` uses a model to decide when the caller has actually *finished a thought*, instead of firing on any energy spike. This is the fix for "stops mid-sentence."
- `eagerness: "low"` makes it wait longest before assuming the caller is done — best tolerance for cell jitter and mid-sentence pauses. If responses feel sluggish, step up to `"medium"`.
- Keep `interrupt_response: true` so a genuine, sustained interruption still works — we're filtering noise, not disabling barge-in.

## Option B — Fallback: tuned server VAD (if semantic_vad unavailable on the deployed model)

```json
{
  "type": "session.update",
  "session": {
    "turn_detection": {
      "type": "server_vad",
      "threshold": 0.62,
      "prefix_padding_ms": 300,
      "silence_duration_ms": 750,
      "create_response": true,
      "interrupt_response": true
    },
    "input_audio_noise_reduction": {
      "type": "far_field"
    }
  }
}
```

- `threshold` 0.5 → **0.62**: needs louder/clearer speech to count as an interruption → ignores road noise, coughs, echo.
- `silence_duration_ms` 500 → **750**: the agent waits longer before deciding the caller stopped → tolerates cell-network gaps (HANDOFF rec #4).
- `prefix_padding_ms` 300: keeps the leading audio so the first word isn't clipped.

---

## Apply procedure on the PBX (`ssh fspbx`) — OpenAI Realtime / ext 5002

> Note 2026-06-12: SSH to fspbx over Tailscale was stalling mid-session (MTU black-hole — TCP + key-exchange OK, data stream times out). If it hangs, try `ssh fspbx-pub` (107.175.53.217 direct). MTU workaround `sudo tailscale set --mtu 1280` is a LAST resort — it touches the same Tailscale link the phones' S2S tunnel rides, so flip it back after.

The 5002 config is base64 **inside the Lua script**, not a standalone file. There may be 2–3 base64 blobs (session.update, response.create, the +10s VAD re-enable session.update). The `turn_detection` lives in the session.update blob(s).

```bash
# 1. Back up the script first
sudo cp -a /usr/share/freeswitch/scripts/ai_assistant.lua \
           /usr/share/freeswitch/scripts/ai_assistant.lua.bak-2026-06-12

# 2. Pull each base64 blob out and decode to see which holds turn_detection
sudo grep -oE '"[A-Za-z0-9+/=]{80,}"' /usr/share/freeswitch/scripts/ai_assistant.lua \
  | tr -d '"' | while read b; do echo "=== blob ==="; echo "$b" | base64 -d 2>/dev/null | python3 -m json.tool 2>/dev/null; done

# 3. For the blob(s) containing "turn_detection": decode, edit the JSON to Option A
#    (semantic_vad + input_audio_noise_reduction far_field), re-encode with `base64 -w0`,
#    and replace that exact string in the Lua script. The +10s "VAD re-enable"
#    session.update MUST get the SAME turn_detection block or it overwrites your change.
#      echo "$OLD_B64" | base64 -d > /tmp/su.json
#      # edit /tmp/su.json  → set session.turn_detection + session.input_audio_noise_reduction
#      NEW_B64=$(base64 -w0 /tmp/su.json)
#      sudo sed -i "s|$OLD_B64|$NEW_B64|" /usr/share/freeswitch/scripts/ai_assistant.lua

# 4. No service restart needed — the Lua script loads fresh each call (per memory).
#    But clear the dialplan cache so routing is clean:
sudo rm -rf /var/cache/fusionpbx/dialplan.*

# 5. TEST FROM A REAL CELL PHONE on cell data (NOT a LAN softphone). Call the line,
#    talk over the agent mid-sentence, go quiet mid-sentence, add background noise.
```

## If the demo is the ElevenLabs Receptionist instead

No server edit. In the ElevenLabs agent config (`agent_2001knwsqcn2f118s852t8hm03mj`), raise the **interruption sensitivity threshold** (less eager to be interrupted) and lengthen the **end-of-turn / turn timeout** so it tolerates cell pauses. Same root cause, ElevenLabs's own turn-taking knobs. API: `PATCH https://api.elevenlabs.io/v1/convai/agents/{agent_id}` with the `conversation_config.turn` settings.

## Verification checklist (what "fixed" looks like)
- [ ] Agent finishes its sentences when you pause to think — no self-cutoff.
- [ ] Saying "uh-huh"/"okay" while it talks does NOT stop it.
- [ ] A deliberate, sustained interruption ("stop — actually...") DOES stop it within ~1s.
- [ ] No echo-loop where the agent talks over itself on speakerphone.
- [ ] Tested on a real cell network, both earpiece and speakerphone.

## Notes
- Model on the call path stays fast/cheap (latency is everything live) — this change is orthogonal to model choice.
- If after Option A it's still rough, the next lever is the inbound telephony codec/jitter buffer in FreeSWITCH, not the LLM. But tune VAD first — it's 90% of the problem.
