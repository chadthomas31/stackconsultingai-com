# Stack AI OS — Offering Design Spec

**Date:** 2026-05-25
**Owner:** Chad McCluskey (Stack Consulting AI)
**Status:** Approved positioning + tiers — ready for implementation plan
**Repo:** `~/stackconsultingai-com/`

## Purpose

Productize SCA's value (curation + setup + ongoing operation of a business's AI) into one tangible, repeatable, sellable thing: the **Stack AI OS**. Replace open-ended hourly consulting with a packaged appliance + recurring care plan. Give a non-technical SMB owner one thing to buy instead of 12 AI subscriptions they don't understand.

Deliverable in this milestone is **website content + lead-gen pages**, not e-commerce or hardware-procurement automation. The pages sell the offering and drive a fit call.

## Positioning (locked)

> **Managed agentic AI workstation. We run your business's AI — you never touch the tools.**

- The box anchors the sale; the **recurring Care plan is the product** (the durable revenue + moat).
- **Platform (Mac / Windows / Linux) = the body. Tier = the brain.** Orthogonal axes.
- **Local/private models = the top compliance tier, not the floor.** General SMBs run frontier cloud AI (better, cheaper, zero upkeep). Local only pays off under privilege/compliance (law, medical, finance).
- Automation is **agent-authored** (Claude Code / Codex) and runs as code on a lights-out runtime + monitoring on the box. **No n8n / no-code workflow builder** as a pillar — that authoring value is gone; only the execution/connector/observability layer remains, solved with code + MCP.

### The moat (drives all messaging)

If agents build automations, "we build automations" is not defensible — anyone with Claude Code can. SCA's moat is **operator + maintainer + the supported, monitored environment**. Therefore marketing leads with the Care plan ("we keep your AI running"), box is the entry fee. A one-time box sale with no recurring attachment is explicitly an anti-goal.

## Tiers

Capability tiers, platform-agnostic. Buyer picks a tier and a body separately.

| Tier | What runs | Buyer | Setup (one-time) | Care (monthly) |
|---|---|---|---|---|
| **Foundation** | Cloud frontier AI (Claude/GPT) configured; agentic toolchain (Claude Code/Codex) installed; automation runtime + monitoring; 2 starter automations; email support | solo / micro biz | $1,500 + body | $199 |
| **Operator** (flagship) | Everything in Foundation + SCA builds & maintains custom automations; integrations via MCP (Google, QuickBooks, CRM); voice receptionist tie-in; priority support; monthly tune-up | growing SMB | $3,500 + body | $499 |
| **Sovereign** | Everything in Operator + local models on-box (data never leaves the building); encryption; audit logging; HIPAA-friendly posture | law / medical / finance | $7,500 + body | $999 |

**Bodies (one-time, hardware pass-through + margin):**
- Linux mini — $700
- Windows mini — $1,000
- Mac Mini — $1,400 (high-memory build for Sovereign local models — $2,400)

Pricing values are launch starting points; copy must make the **same brain, cheaper body** framing explicit so Linux never reads as "the worse one."

### Add-on — Office Rebuild

Rebuild/refresh existing office PCs into AI-ready endpoints that connect to the AI OS. **$350/seat** one-time, or bundle into Care. Positioned as a trust-building, recurring-friendly attach — not a standalone product.

## What's actually inside an AI OS (the concrete substance, builder-voice)

Named, specific — no "enterprise-grade solutions":
- **Agentic toolchain:** Claude Code + Codex installed and configured to the business.
- **Automation runtime:** agent-written scripts on a scheduler, with failure alerting + a run log. (This is the ops-dashboard `worker_runs` pattern, generalized.)
- **Connectors:** MCP servers for Google Workspace, QuickBooks, the client's CRM.
- **Voice:** optional tie-in to the existing FreeSWITCH + OpenAI Realtime receptionist.
- **Sovereign only:** Ollama + local models, on-box, encrypted, audit-logged.
- **The Care plan:** monitoring, model/tool updates, automation maintenance, support.

## Deliverables (website)

### 1. Flagship offering page — `/ai-os`

Mirror the proven `app/ai-receptionist/page.tsx` section rhythm:

1. **Hero** — H1 stating the positioning; subhead; primary CTA "Book a fit call", secondary "See the tiers". Builder-voice kicker.
2. **The reality** (soft bg) — the SMB pain: drowning in AI tools/subscriptions, nothing connected, no one maintaining it.
3. **What an AI OS is** (navy section) — the simple 3-step explainer (set up → build → keep running). This is the conceptual anchor; reused on homepage.
4. **What's inside** — the concrete substance list above, named tools.
5. **Tiers** (`#tiers`) — 3-tier pricing cards (Foundation / Operator / Sovereign), Operator highlighted as flagship. Body selector shown as a separate one-time line.
6. **Office Rebuild** — add-on callout.
7. **Who it's for / Sovereign for compliance** — name the verticals (law, medical — reference the Dr. Woods relationship as proof of privacy-sensitive work).
8. **Proof** — metric callouts from existing clients (reuse real numbers already on the site).
9. **CTA** — fit call booking.

### 2. Homepage section — "What is an AI Operating System?"

Inserted into `app/page.tsx`. Dead-simple, analogy-led, 5-second grasp:

> **Your business runs on people and software. An AI OS adds a third layer — AI that does the work.**
> It answers calls, kills busywork, drafts, researches, and runs your automations — on one machine we set up and maintain. Like a tireless employee who lives in a box on your desk and never quits.

Three blocks: **1.** We set up the machine → **2.** AI tools + automations built for your business → **3.** We keep it running — you never touch the tech. CTA → `/ai-os`.

### 3. Navigation + SEO

- Add "AI OS" to `Navbar.tsx` (and footer where offerings are listed).
- Page metadata, OpenGraph, JSON-LD `Product`/`Service` schema with the three tiers as offers.
- Add `/ai-os` to `app/sitemap.ts`.

## Design system (must follow SCA brand — see repo `CLAUDE.md`)

- Light mode, white bg, navy `#00122e` headings, blue `#3e6aef` accents, soft `#f5f5fa` alternating sections, 6px radius.
- Space Grotesk headings / Inter body; tight tracking on large headlines.
- Flat white cards, 1px border, hover darken + soft shadow. **No orbs, no glassmorphism, no gradient-animated H1.**
- Builder voice. Banned words: leverage, synergize, unlock, transform, empower, solutions provider, cutting-edge, next-generation, "in today's world."
- Respect `prefers-reduced-motion`. LCP < 2.0s, minimal hero JS, zero layout shift.
- No stock/AI hero imagery; real screenshots/photos only.

## Success criteria

- A non-technical SMB owner reads the homepage section and can explain "what an AI OS is" in one sentence.
- `/ai-os` clearly separates **tier (brain)** from **body (platform)** and leads with the Care plan.
- Sovereign tier reads as a deliberate compliance product, not an upsell.
- Page passes the brand "smell test": no banned words, concrete numbers, names real clients/tools.
- Builds clean (`npm run build`), Lighthouse performance ≥ 90, no CLS.

## Non-goals (explicit)

- No e-commerce checkout / payment flow on the page — CTA is a fit call.
- No automated hardware procurement / inventory.
- No actual provisioning tooling built in this milestone (that's a future internal project, possibly an ops-dashboard panel).
- No dark mode, no n8n integration, no live configurator.

## Open follow-ups (post-launch, not in scope)

- A real "AI OS provisioning" runbook/tooling (how SCA actually images a box) — internal, separate spec.
- Tie automation-runtime monitoring into ops-dashboard.
- Case study once the first AI OS ships to a client.
