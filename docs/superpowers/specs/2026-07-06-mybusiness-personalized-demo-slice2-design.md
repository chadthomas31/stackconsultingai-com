# Slice 2 — "My Business" Personalized Demo (AI-drafted receptionist)

**Date:** 2026-07-06
**Status:** Draft for approval.
**Depends on:** Slice 1 (merged) — consolidated `/demos` funnel, `demo_leads`, `/api/demos/start`+`verify`, and the `ai_assistant_demo.lua` business-name personalization (greeting reads the registered business).

---

## 1. Background (grounded)

Slice 1 shipped the funnel + prebuilt vertical demos. The box (`ai_assistant_demo.lua` on `fspbx-2`) already:
- Has a per-vertical registry (5004 plumbing, 5005 auto, 5006 medspa, 5007 hvac, 5008 psychiatry), each with `id`, `agent`, `default_biz`, and a `persona(BIZ, AGENT)` function carrying trade-specific behavior + safety rules.
- Resolves the caller's business via `lookup_business_by_caller` → `GET /api/demo-business?phone=` (returns `{ business_name }` mapped from `demo_leads.biz_name`), else a file fallback, else `default_biz`. (Wired 2026-07-06.)
- Builds `instructions = V.persona(BIZ, AGENT) .. <shared rules>`, greets `"Thanks for calling {BIZ}, this is {AGENT}."`, and emails a summary via the `send_call_summary` tool.

The repo has the Anthropic SDK + a Zod structured-output extraction pattern (`lib/claude-extract.ts`, Claude Haiku).

**What's missing:** the prospect can't describe *their own* business and have the agent script itself for it. Today the agent only knows the business *name* + the static vertical persona.

## 2. Goal

Add a **"My Business"** path to `/demos`: the prospect enters their company name, closest industry, a short description, and city; **Claude drafts a receptionist config** (services, greeting, intake focus, tone) they can review/edit; on confirm they get the demo number, call it, and the AI answers **as their business** — using the vertical's polished intake logic *plus* their specifics.

"AI builds your AI receptionist," then they call it and hear it. That is the demo that closes.

## 3. Scope (MVP) & non-goals

**"My Business" runs on its OWN dedicated demo line** — one new Telnyx DID → a new extension (proposed **5009**) with a **dynamic persona**. The prebuilt vertical lines (5004–5008) stay **pure canned demos**, untouched. Because the custom line builds its persona at call time from the lead's chosen **base industry**, it can serve **all four base personas that already exist on the box (auto/plumbing/hvac/medspa)** from day one — the base vertical's own DID migration status doesn't matter, since the caller dials the custom line, not the vertical line.

**Non-goals (this slice):**
- A brand-new "General" persona for businesses outside the existing 4 verticals (note as future — requires authoring a general persona).
- Changing the prebuilt vertical lines' behavior.
- Persisting the generated config as a reusable/production client config (this is a demo artifact).

## 4. UX flow

1. `/demos` picker gains a **"My Business"** option (alongside the 6 verticals).
2. Selecting it reveals a form: **company name**, **closest industry** (auto / plumbing / hvac / medspa — picks the base persona), **short description** (1–2 sentences), **city / service area**.
3. **"Generate my receptionist"** button → `POST /api/demos/generate-receptionist` → Claude Haiku returns a **draft config** rendered as editable fields/checkboxes:
   - refined one-line business summary
   - **services** (checkbox list they can prune/add)
   - suggested **greeting** line
   - **intake focus** (what the receptionist should prioritize asking)
   - **tone** (e.g. "warm, efficient")
   - 1–2 **FAQ** the agent should be ready for
4. Prospect edits → **"Use this"** → the existing SMS path (`/api/demos/start` → `verify`) runs, storing the config (incl. base industry) on the lead, and reveals the **dedicated My-Business DID** (`DEMO_DID_MYBUSINESS`, → ext 5009) — NOT the base vertical's line.
5. Prospect calls the custom line → the Lua resolves their lead → builds `<base industry persona> + <their business block>` → personalized receptionist.

Generation is optional polish: if they skip it and just give a name + industry, the custom line still greets by name and uses the base persona.

## 5. Architecture — the 4 pieces

### 5.1 Website (funnel)
- `components/demos/VerticalDemoFunnel.tsx` (or a dedicated `MyBusinessFunnel` if the branch grows too large): "My Business" mode → the fields above → generate/review step → hand off to the existing start/verify flow with the config in the body.
- `lib/voice-agents/index.ts`: add a `"mybusiness"` picker entry (not a `Vertical`; it maps to a chosen base vertical).

### 5.2 LLM endpoint
- `POST /api/demos/generate-receptionist` — input `{ companyName, industry, description, city }`; runs Claude Haiku (`claude-haiku-4-5-20251001`) with a **Zod-validated** structured output (`lib/receptionist-config-schema.ts`) returning `{ summary, services[], greeting, intakeFocus[], tone, faqs[] }`. Reuse the `lib/claude-extract.ts` client + prompt-caching pattern. Rate-limited (reuse the IP/email counters). Cost ~1–2¢/call.

### 5.3 Data model (migration — manual apply in Supabase)
- `migrations/2026XXXX_demo_leads_biz_config.sql`: `ALTER TABLE demo_leads ADD COLUMN biz_description text, ADD COLUMN biz_config jsonb;`
- No CHECK-constraint change needed: `vertical` still stores the chosen **base** vertical (auto/plumbing/hvac/medspa). A row is "custom" when `biz_config IS NOT NULL`.
- `lib/demo-leads-db.ts`: `createDemoLead` accepts optional `bizDescription` + `bizConfig`; persist them.
- `app/api/demos/verify/route.ts`: when the lead is custom (`biz_config` present), reveal **`DEMO_DID_MYBUSINESS`** instead of `getVerticalDid(vertical)`. The base vertical is still stored (the Lua uses it to pick the persona).

### 5.4 PBX — dedicated My-Business line (production `fspbx-2` + Telnyx — approval-gated)
- **Provision one new Telnyx DID** → route it (via `public.xml` / dialplan) to a **new extension 5009** ("mybusiness"). Set `DEMO_DID_MYBUSINESS` in Vercel; `verify` reveals it for My-Business leads.
- `GET /api/demo-business` (`app/api/demo-business/route.ts`): also return `biz_description` + `biz_config` (incl. base industry) for the matched lead.
- `ai_assistant_demo.lua`: add a **custom `5009` path** that is *dynamic*, not a static persona:
  1. Resolve the caller's lead → get `biz_config` (base industry, summary, services, city, greeting) + `BIZ` name.
  2. Select the base persona: `VERTICALS[<industry→ext>].persona(BIZ, AGENT)` (reuse the existing per-vertical persona for intake + safety).
  3. **Append the business block** before the shared rules: `"About {BIZ}: {summary}. Key services: {services}. Serving {city}. "`; optionally use the generated `greeting`.
  4. If no lead/config is found on the custom line (unregistered caller), greet generically and ask them to register on the site — do NOT expose another business's data.
- **Prebuilt vertical lines (5004–5008) are NOT touched.**
- Backup Lua first; per-call interpreted (no reloadxml); test on 5009 only.

## 6. LLM output schema (`receptionist-config-schema.ts`)

```
{
  summary: string,            // one-line business summary
  services: string[],         // 3–7 concrete services
  greeting: string,           // suggested opening line, names the business
  intakeFocus: string[],      // 2–4 things the receptionist should prioritize
  tone: string,               // e.g. "warm, efficient, local"
  faqs: { q: string, a: string }[]  // 1–2
}
```
Prompt: constrain to demo scope, builder voice, no medical/legal/price claims, no invented specifics beyond the description (say "the team will confirm" for unknowns).

## 7. Compliance / product-risk

- The prospect's **description is sent to the Anthropic API** — business data, not PHI (they're describing their own company). No BAA needed. Note it in the UI microcopy ("we use AI to draft your demo script").
- Do not let the generated config assert medical/legal/pricing claims (prompt-constrained) — matters for medspa/dental base verticals later.
- The in-call CIPA disclosure is unchanged (still fires).
- Reuse existing rate limits; the generate endpoint must be rate-limited to avoid LLM-cost abuse.

## 8. Testing checklist

1. Pick **My Business** → fill company / base industry / description / city → **Generate** → a sensible editable config renders (services match the description).
2. Edit a service, change the greeting → **Use this** → SMS code → reveal the **My-Business DID** (`DEMO_DID_MYBUSINESS`).
3. `demo_leads` row has `biz_description` + `biz_config` (with base industry) populated; `vertical` = chosen base.
4. **Call the My-Business line from the registered cell** → agent greets with the company name, references the generated services/context, and runs the **base industry's intake** (e.g. auto → year/make/model).
5. **Prebuilt lines unaffected:** call 949-239-7925 → still the pure Summit Auto Care demo.
6. **Isolation:** call the My-Business line from an unregistered number → generic register-prompt, no other business's data.
6. Generate endpoint rate-limits; malformed LLM output is rejected by Zod (retry) not surfaced raw.

## 9. Definition of done

A prospect can describe their business, get an AI-drafted receptionist config they edit, receive the **dedicated My-Business demo number**, call it, and hear the AI answer as **their** business with **their** services — while keeping the chosen base vertical's intake quality. The prebuilt vertical lines are unchanged. Config persisted on the lead.

## 10. Risks

- **New Telnyx DID + dialplan routing** — provisioning a DID, routing it to ext 5009, and setting `DEMO_DID_MYBUSINESS` is the critical path; the whole slice is un-callable until that's live. Cost: one more DID (~$1/mo).
- **PBX Lua change again** — provision-phone discipline, dedicated 5009 path only, prebuilt lines untouched, backup + per-call revert.
- **Custom line data isolation** — an unregistered caller on 5009 must NOT get another business's config; the Lua falls back to a generic register-prompt.
- **Migration must be applied in Supabase before deploying** dependent code (repo has no runner) — same trap as always.
- **LLM cost/abuse** — rate-limit the generate endpoint.
- **`VerticalDemoFunnel` growth** — if the My-Business branch bloats the component, split into `MyBusinessFunnel`.

## 11. Locked decisions

1. "My Business" is a **picker option + closest-industry** sub-pick (keeps vertical intake quality) — not a generic-only receptionist, not a per-vertical toggle.
2. Fields: **company name, short description, main services, city** — plus an **LLM generation step** that drafts services/greeting/intake/tone/FAQ from the description for the prospect to edit.
3. **My Business = its own dedicated line** (new Telnyx DID → ext 5009, dynamic persona). Prebuilt vertical lines (5004–5008) stay pure and untouched. Because the persona is built at call time, the custom line serves **all four base personas (auto/plumbing/hvac/medspa)** immediately.
4. Store config in **`demo_leads.biz_config` (jsonb) + `biz_description`** (migration); "custom" = `biz_config IS NOT NULL`. `verify` reveals `DEMO_DID_MYBUSINESS` for custom leads.
5. Custom-line agent = **base-vertical persona + injected business block** (name/summary/services/city); the vertical's intake + safety logic is preserved. Unregistered caller on 5009 → generic register-prompt (no data leak).
