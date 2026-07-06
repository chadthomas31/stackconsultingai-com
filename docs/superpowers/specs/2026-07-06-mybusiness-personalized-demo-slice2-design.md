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

**MVP is callable on the Auto line only** (5005 / 949-239-7925 — the proven end-to-end vertical). The architecture generalizes to medspa/hvac/plumbing as their DIDs finish migrating; the custom overlay is vertical-agnostic, only the *callable DID* is the limit.

**Non-goals (this slice):**
- A brand-new "General" persona / DID for businesses outside the existing verticals (note as future — requires a new agent + DID).
- Making non-live verticals callable.
- Persisting the generated config as a reusable/production client config (this is a demo artifact).

## 4. UX flow

1. `/demos` picker gains a **"My Business"** option (alongside the 6 verticals).
2. Selecting it reveals a form: **company name**, **closest industry** (the live verticals; MVP = Auto), **short description** (1–2 sentences), **city / service area**.
3. **"Generate my receptionist"** button → `POST /api/demos/generate-receptionist` → Claude Haiku returns a **draft config** rendered as editable fields/checkboxes:
   - refined one-line business summary
   - **services** (checkbox list they can prune/add)
   - suggested **greeting** line
   - **intake focus** (what the receptionist should prioritize asking)
   - **tone** (e.g. "warm, efficient")
   - 1–2 **FAQ** the agent should be ready for
4. Prospect edits → **"Use this"** → the existing SMS path (`/api/demos/start` → `verify`) runs, storing the config on the lead, and reveals the Auto DID.
5. Prospect calls → the Auto persona + their config → personalized receptionist.

If the prospect skips generation and just types a name, they still get the name-personalized prebuilt Auto demo (Slice 1 behavior) — generation is optional polish.

## 5. Architecture — the 4 pieces

### 5.1 Website (funnel)
- `components/demos/VerticalDemoFunnel.tsx` (or a dedicated `MyBusinessFunnel` if the branch grows too large): "My Business" mode → the fields above → generate/review step → hand off to the existing start/verify flow with the config in the body.
- `lib/voice-agents/index.ts`: add a `"mybusiness"` picker entry (not a `Vertical`; it maps to a chosen base vertical).

### 5.2 LLM endpoint
- `POST /api/demos/generate-receptionist` — input `{ companyName, industry, description, city }`; runs Claude Haiku (`claude-haiku-4-5-20251001`) with a **Zod-validated** structured output (`lib/receptionist-config-schema.ts`) returning `{ summary, services[], greeting, intakeFocus[], tone, faqs[] }`. Reuse the `lib/claude-extract.ts` client + prompt-caching pattern. Rate-limited (reuse the IP/email counters). Cost ~1–2¢/call.

### 5.3 Data model (migration — manual apply in Supabase)
- `migrations/2026XXXX_demo_leads_biz_config.sql`: `ALTER TABLE demo_leads ADD COLUMN biz_description text, ADD COLUMN biz_config jsonb;`
- No CHECK-constraint change needed: `vertical` still stores the chosen base vertical (auto for MVP). A row is "custom" when `biz_config IS NOT NULL`.
- `lib/demo-leads-db.ts`: `createDemoLead` accepts optional `bizDescription` + `bizConfig`; persist them.

### 5.4 PBX injection (production `fspbx-2` — approval-gated)
- `GET /api/demo-business` (`app/api/demo-business/route.ts`): also return `biz_description` + `biz_config` for the matched lead.
- `ai_assistant_demo.lua`: after resolving `BIZ`, if the API returned a config, **append a business block** to the persona *before* the shared rules:
  `"About {BIZ}: {summary}. Key services: {services}. Serving {city}. "` — and optionally use the generated `greeting`. The vertical `persona()` (intake logic + safety) stays intact; the config only adds specifics.
- Backup Lua first; per-call interpreted (no reloadxml); test on Auto (5005).

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

1. Pick **My Business** → fill company/industry(Auto)/description/city → **Generate** → a sensible editable config renders (services match the description).
2. Edit a service, change the greeting → **Use this** → SMS code → reveal 949-239-7925.
3. `demo_leads` row has `biz_description` + `biz_config` populated.
4. **Call from the registered cell** → agent greets with the company name and references the generated services/context; auto intake logic still works (asks year/make/model).
5. Skip generation (name only) → still get the name-personalized prebuilt Auto demo.
6. Generate endpoint rate-limits; malformed LLM output is rejected by Zod (retry) not surfaced raw.

## 9. Definition of done

A prospect can describe their business, get an AI-drafted receptionist config they edit, receive the Auto demo number, call it, and hear the AI answer as **their** business with **their** services — while keeping the auto vertical's intake quality. Config persisted on the lead.

## 10. Risks

- **Only Auto is callable** — set expectations in the UI (other industries "coming soon" for the live call, or generate-only preview). → MVP limits industry pick to live verticals.
- **PBX Lua change again** — provision-phone discipline, Auto-only, backup + per-call revert.
- **Migration must be applied in Supabase before deploying** dependent code (repo has no runner) — same trap as always.
- **LLM cost/abuse** — rate-limit the generate endpoint.
- **`VerticalDemoFunnel` growth** — if the My-Business branch bloats the component, split into `MyBusinessFunnel`.

## 11. Locked decisions

1. "My Business" is a **picker option + closest-industry** sub-pick (keeps vertical intake quality) — not a generic-only receptionist, not a per-vertical toggle.
2. Fields: **company name, short description, main services, city** — plus an **LLM generation step** that drafts services/greeting/intake/tone/FAQ from the description for the prospect to edit.
3. MVP **callable on Auto only**; generalizes as other DIDs go live.
4. Store config in **`demo_leads.biz_config` (jsonb) + `biz_description`** (migration); "custom" = `biz_config IS NOT NULL`.
5. Agent = **vertical persona + injected business block** (name/summary/services/city); vertical intake + safety logic preserved.
