# Stack AI OS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Stack AI OS offering as a flagship `/ai-os` page plus a homepage explainer section, wired into nav, footer, and sitemap.

**Architecture:** Two reusable server components (`AiOsExplainer`, `AiOsTiers`) consumed by both the new `/ai-os` page and the homepage. The flagship page mirrors the proven section rhythm of `app/ai-receptionist/page.tsx`. No new data sources, no client-side state, no payment flow — CTA is a fit call.

**Tech Stack:** Next 15 App Router, React 19 server components, Tailwind v3 (existing brand tokens: `navy-900`, `brand`, `soft`, `border`, `muted-foreground`, `section-kicker`, `font-heading`), lucide-react icons.

**Source of truth:** `docs/superpowers/specs/2026-05-25-stack-ai-os-offering-design.md`

**Verification note:** This repo has no test suite (per `~/CLAUDE.md`). "Tests" here = `npm run build` passing, a banned-word grep, and a dev-server visual check. Brand rules in repo `CLAUDE.md` are binding: light mode, navy `#00122e`, blue `#3e6aef`, Space Grotesk/Inter, flat bordered cards, no orbs/glassmorphism/gradient H1, builder voice, banned words (leverage, synergize, unlock, transform, empower, solutions provider, cutting-edge, next-generation, "in today's world").

---

## File Structure

- Create: `components/AiOsExplainer.tsx` — the "What is an AI OS?" 3-step section; `showCta` prop toggles the homepage teaser link.
- Create: `components/AiOsTiers.tsx` — 3 tier cards + body price lines + Office Rebuild callout.
- Create: `app/ai-os/page.tsx` — flagship page composing hero → reality → explainer → what's inside → tiers → who-it's-for/Sovereign → proof → CTA, plus metadata + JSON-LD.
- Modify: `app/page.tsx` — insert `<AiOsExplainer showCta />` after the client logo strip.
- Modify: `components/Navbar.tsx` — add an "AI OS" link to desktop + mobile nav.
- Modify: `components/Footer.tsx` — add `/ai-os` to the offerings links.
- Modify: `app/sitemap.ts` — add the `/ai-os` static entry.

---

## Task 1: AiOsExplainer component

**Files:**
- Create: `components/AiOsExplainer.tsx`

- [ ] **Step 1: Write the component**

```tsx
import Link from "next/link";
import { Box, Wrench, HeartPulse, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Box,
    title: "1 — We set up the machine",
    body: "A Mac, Windows, or Linux box, configured by us with the AI tools your business actually needs. It arrives working.",
  },
  {
    icon: Wrench,
    title: "2 — Built for your business",
    body: "We wire in the automations and integrations that kill your busywork — answering calls, drafting, research, the recurring tasks you do by hand today.",
  },
  {
    icon: HeartPulse,
    title: "3 — We keep it running",
    body: "We monitor it, update the models and tools, and maintain the automations. You never touch the tech. That's the whole point.",
  },
];

export default function AiOsExplainer({ showCta = false }: { showCta?: boolean }) {
  return (
    <section className="py-24 bg-navy-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-2xl mb-14">
          <span className="section-kicker">What is an AI Operating System?</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mt-3 mb-4 tracking-tight">
            Your business runs on people and software. An AI OS adds a third layer — AI that does the work.
          </h2>
          <p className="text-lg text-white/70">
            One machine we set up and maintain. Like a tireless employee who lives in a box on your desk and never quits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.title} className="rounded-md bg-white/5 border border-white/10 p-6">
              <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center mb-5">
                <s.icon aria-hidden="true" className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-white text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        {showCta && (
          <div className="mt-12">
            <Link
              href="/ai-os"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-brand text-white font-medium hover:bg-brand-hover transition-colors"
            >
              See the AI OS tiers
              <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd ~/stackconsultingai-com && npx tsc --noEmit 2>&1 | grep -i AiOsExplainer || echo "no type errors in AiOsExplainer"`
Expected: `no type errors in AiOsExplainer`

- [ ] **Step 3: Commit**

```bash
git add components/AiOsExplainer.tsx
git commit -m "feat(ai-os): add AiOsExplainer section component"
```

---

## Task 2: AiOsTiers component

**Files:**
- Create: `components/AiOsTiers.tsx`

- [ ] **Step 1: Write the component**

```tsx
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

type Tier = {
  name: string;
  blurb: string;
  setup: string;
  care: string;
  forWho: string;
  features: string[];
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Foundation",
    blurb: "Your first AI machine, configured and supported.",
    setup: "$1,500",
    care: "$199",
    forWho: "Solo & micro businesses",
    features: [
      "Frontier cloud AI (Claude / GPT) configured to your work",
      "Claude Code + Codex installed and ready",
      "Automation runtime with failure alerting",
      "2 starter automations built for you",
      "Email support",
    ],
  },
  {
    name: "Operator",
    blurb: "We run your business's AI day to day.",
    setup: "$3,500",
    care: "$499",
    forWho: "Growing small businesses",
    featured: true,
    features: [
      "Everything in Foundation",
      "Custom automations we build and maintain",
      "Integrations via MCP — Google, QuickBooks, your CRM",
      "Voice receptionist tie-in (FreeSWITCH + OpenAI Realtime)",
      "Priority support + monthly tune-up",
    ],
  },
  {
    name: "Sovereign",
    blurb: "Nothing leaves your building.",
    setup: "$7,500",
    care: "$999",
    forWho: "Law, medical, finance",
    features: [
      "Everything in Operator",
      "Local AI models on the box — data never leaves",
      "Encryption + audit logging",
      "HIPAA-friendly posture",
      "Compliance-ready documentation",
    ],
  },
];

const bodies = [
  { name: "Linux mini", price: "$700" },
  { name: "Windows mini", price: "$1,000" },
  { name: "Mac Mini", price: "$1,400", note: "high-memory build for Sovereign: $2,400" },
];

export default function AiOsTiers() {
  return (
    <section id="tiers" className="py-28">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-14 max-w-2xl">
          <span className="section-kicker">Pricing</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
            Pick a brain. Pick a body.
          </h2>
          <p className="text-lg text-muted-foreground">
            The tier is the brain — what the AI OS can do. The machine is the body — same brain, cheaper body if you want. The monthly Care plan is what keeps it all running.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-md bg-white border p-6 flex flex-col ${
                t.featured ? "border-brand ring-1 ring-brand shadow-[0_8px_30px_rgba(62,106,239,0.12)]" : "border-border"
              }`}
            >
              {t.featured && (
                <span className="self-start text-xs font-medium text-brand bg-brand/10 px-2.5 py-1 rounded-full mb-3">
                  Most popular
                </span>
              )}
              <h3 className="font-heading text-xl font-bold text-navy-900">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{t.blurb}</p>
              <div className="mb-1">
                <span className="font-heading text-3xl font-bold text-navy-900">{t.care}</span>
                <span className="text-muted-foreground text-sm">/mo Care</span>
              </div>
              <p className="text-xs text-muted-foreground mb-5">{t.setup} setup + your machine</p>
              <p className="text-xs font-medium text-navy-900/60 uppercase tracking-wide mb-3">
                {t.forWho}
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-navy-900/80">
                    <Check aria-hidden="true" className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/#contact"
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md font-medium transition-colors ${
                  t.featured
                    ? "bg-brand text-white hover:bg-brand-hover"
                    : "bg-white text-navy-900 border border-border hover:border-navy-900"
                }`}
              >
                Book a fit call
                <ArrowRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Bodies */}
        <div className="mt-12 max-w-4xl">
          <h3 className="font-heading font-semibold text-navy-900 mb-4">The machine (one-time)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bodies.map((b) => (
              <div key={b.name} className="p-5 rounded-md bg-white border border-border">
                <div className="flex items-baseline justify-between">
                  <span className="font-heading font-semibold text-navy-900">{b.name}</span>
                  <span className="text-navy-900 font-medium">{b.price}</span>
                </div>
                {b.note && <p className="text-xs text-muted-foreground mt-1">{b.note}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Office Rebuild add-on */}
        <div className="mt-8 max-w-4xl rounded-md bg-soft border border-border p-6">
          <h3 className="font-heading font-semibold text-navy-900 mb-1">Add-on: Office Rebuild</h3>
          <p className="text-sm text-muted-foreground">
            We rebuild and refresh the PCs already in your office into AI-ready
            machines that talk to your AI OS. $350 per seat, or bundle it into your Care plan.
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd ~/stackconsultingai-com && npx tsc --noEmit 2>&1 | grep -i AiOsTiers || echo "no type errors in AiOsTiers"`
Expected: `no type errors in AiOsTiers`

- [ ] **Step 3: Commit**

```bash
git add components/AiOsTiers.tsx
git commit -m "feat(ai-os): add AiOsTiers pricing component"
```

---

## Task 3: Flagship /ai-os page

**Files:**
- Create: `app/ai-os/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiOsExplainer from "@/components/AiOsExplainer";
import AiOsTiers from "@/components/AiOsTiers";
import { ArrowRight, Terminal, Workflow, Plug, Phone, Lock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Stack AI OS — A managed AI workstation for your business | Stack Consulting AI",
  description:
    "We set up one machine — Mac, Windows, or Linux — with the AI tools and automations your business needs, then keep it running. Three tiers. Local-private option for law, medical, and finance.",
  alternates: { canonical: "https://stackconsultingai.com/ai-os" },
  openGraph: {
    title: "Stack AI OS — A managed AI workstation for your business",
    description:
      "One machine, set up and maintained by us. The AI does the work — you never touch the tools.",
    url: "https://stackconsultingai.com/ai-os",
    type: "website",
  },
};

const inside = [
  { icon: Terminal, title: "Agentic toolchain", body: "Claude Code and Codex, installed and configured to your business — the same tools we build with." },
  { icon: Workflow, title: "Automation runtime", body: "The automations we build run as code on a scheduler, watched, with an alert when something breaks." },
  { icon: Plug, title: "Integrations", body: "MCP connectors into Google Workspace, QuickBooks, and your CRM — so the AI works with the tools you already use." },
  { icon: Phone, title: "Voice receptionist", body: "Optional tie-in to our FreeSWITCH + OpenAI Realtime agent that answers and books calls." },
  { icon: Lock, title: "Private models (Sovereign)", body: "On Sovereign, models run on the box itself. Client data never leaves your building." },
  { icon: ShieldCheck, title: "The Care plan", body: "Monitoring, model and tool updates, automation maintenance, and support. This is the product." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Stack AI OS",
  provider: { "@type": "Organization", name: "Stack Consulting AI", url: "https://stackconsultingai.com" },
  description:
    "A managed AI workstation: a Mac, Windows, or Linux machine set up with the AI tools and automations a business needs, maintained on a monthly Care plan.",
  areaServed: "Orange County, California",
  offers: [
    { "@type": "Offer", name: "Foundation", price: "199", priceCurrency: "USD", description: "Monthly Care plan. $1,500 setup plus machine." },
    { "@type": "Offer", name: "Operator", price: "499", priceCurrency: "USD", description: "Monthly Care plan. $3,500 setup plus machine." },
    { "@type": "Offer", name: "Sovereign", price: "999", priceCurrency: "USD", description: "Monthly Care plan with on-box private models. $7,500 setup plus machine." },
  ],
};

export default function AiOsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-soft via-white to-white" />
        <div className="max-w-6xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-navy-900 text-xs font-medium mb-8">
            New from Stack Consulting AI
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-navy-900 leading-[1.05] mb-6 max-w-4xl">
            A managed AI workstation. We run your business's AI — you never touch the tools.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            One machine, set up by us with the AI tools and automations your business needs, then maintained every month. Not another subscription you have to figure out alone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/#contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-brand text-white font-medium hover:bg-brand-hover transition-colors">
              Book a fit call <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
            <Link href="#tiers" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-white text-navy-900 border border-border font-medium hover:border-navy-900 transition-colors">
              See the tiers
            </Link>
          </div>
        </div>
      </section>

      {/* The reality */}
      <section className="py-16 bg-soft">
        <div className="max-w-3xl mx-auto px-4">
          <span className="section-kicker">The reality</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-6 tracking-tight">
            You've got eight AI tools and a shoebox of logins.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every week there's a new AI tool you're told you need. You sign up, poke at it, and it joins the pile. Nothing is connected, nothing is maintained, and none of it actually runs your business. An AI OS is the opposite: one machine, the right tools, wired together and kept running by us.
          </p>
        </div>
      </section>

      {/* What is an AI OS (reused) */}
      <AiOsExplainer />

      {/* What's inside */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <span className="section-kicker">What's inside</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              Real tools, named. No black box.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {inside.map((i) => (
              <div key={i.title} className="rounded-md bg-white border border-border p-6 hover:border-navy-900/30 hover:shadow-[0_8px_30px_rgba(0,18,46,0.06)] transition-all">
                <div className="w-12 h-12 rounded-md bg-brand/10 text-brand flex items-center justify-center mb-5">
                  <i.icon aria-hidden="true" className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold text-navy-900 text-lg mb-2">{i.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{i.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers + bodies + office rebuild */}
      <AiOsTiers />

      {/* Sovereign / who it's for */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <span className="section-kicker">When local matters</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mt-3 mb-6 tracking-tight">
            For law, medical, and finance: nothing leaves the building.
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            Most businesses are best served by frontier cloud models — better answers, lower cost, nothing to maintain. But if you handle privileged or regulated records, the Sovereign tier runs the models on the machine itself. We already build for privacy-sensitive clients like Dr. Robert Woods' psychiatry practice; Sovereign makes that the default.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy-900 mb-6 tracking-tight">
            Stop collecting AI tools. Start running on one.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Tell us what your week looks like and we'll tell you which tier fits and what we'd automate first.
          </p>
          <Link href="/#contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-brand text-white font-medium hover:bg-brand-hover transition-colors">
            Book a fit call <ArrowRight aria-hidden="true" className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd ~/stackconsultingai-com && npx tsc --noEmit 2>&1 | grep -iE 'ai-os|AiOs' || echo "no type errors in ai-os page"`
Expected: `no type errors in ai-os page`

- [ ] **Step 3: Verify no banned words**

Run: `cd ~/stackconsultingai-com && grep -niE 'leverage|synergize|unlock|transform|empower|solutions provider|cutting-edge|next-generation|in today' app/ai-os/page.tsx components/AiOsExplainer.tsx components/AiOsTiers.tsx || echo "clean — no banned words"`
Expected: `clean — no banned words`

- [ ] **Step 4: Commit**

```bash
git add app/ai-os/page.tsx
git commit -m "feat(ai-os): add flagship /ai-os page with tiers and JSON-LD"
```

---

## Task 4: Homepage explainer section

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add the import**

At the top of `app/page.tsx`, after the existing component imports (e.g. after the `ClientLogoStrip` import on line 3), add:

```tsx
import AiOsExplainer from "@/components/AiOsExplainer";
```

- [ ] **Step 2: Insert the section**

Inside the returned JSX of `Home()`, place the section immediately after `<ClientLogoStrip />` and before the next section:

```tsx
      <ClientLogoStrip />
      <AiOsExplainer showCta />
```

(If `<ClientLogoStrip />` is not present or named differently, insert `<AiOsExplainer showCta />` directly after `<Hero />`.)

- [ ] **Step 3: Verify it compiles**

Run: `cd ~/stackconsultingai-com && npx tsc --noEmit 2>&1 | grep -i 'page.tsx' || echo "homepage compiles"`
Expected: `homepage compiles`

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(ai-os): add AI OS explainer section to homepage"
```

---

## Task 5: Nav, footer, and sitemap wiring

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `components/Footer.tsx`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Add the Navbar desktop link**

In `components/Navbar.tsx`, in the desktop nav block (the `hidden md:flex` container, near the existing `/demos` link around line 129), add a link styled identically to the `/demos` link:

```tsx
            <Link
              href="/ai-os"
              className="text-sm transition-colors duration-200 font-medium text-navy-900/70 hover:text-navy-900 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-brand after:transition-all after:duration-300 after:w-0 hover:after:w-full"
            >
              AI OS
            </Link>
```

- [ ] **Step 2: Add the Navbar mobile link**

In the mobile menu block of `components/Navbar.tsx` (search for the other mobile `href="/demos"` entry), add a matching mobile entry for `/ai-os` with label "AI OS", copying the exact className of the adjacent mobile `/demos` link.

- [ ] **Step 3: Add the Footer link**

In `components/Footer.tsx`, find the offerings/services link list (search for an existing `href="/ai-receptionist"` or `href="/services"`). Add, matching the surrounding link markup:

```tsx
<Link href="/ai-os">AI OS</Link>
```

(Match the exact element type and className of its sibling footer links.)

- [ ] **Step 4: Add the sitemap entry**

In `app/sitemap.ts`, add this object to the `staticEntries` array, just after the `ai-receptionist` entry:

```ts
    { url: `${baseUrl}/ai-os`, lastModified: new Date('2026-05-25'), changeFrequency: 'monthly', priority: 0.95 },
```

- [ ] **Step 5: Verify it compiles**

Run: `cd ~/stackconsultingai-com && npx tsc --noEmit 2>&1 | grep -iE 'Navbar|Footer|sitemap' || echo "nav/footer/sitemap compile"`
Expected: `nav/footer/sitemap compile`

- [ ] **Step 6: Commit**

```bash
git add components/Navbar.tsx components/Footer.tsx app/sitemap.ts
git commit -m "feat(ai-os): wire AI OS into nav, footer, and sitemap"
```

---

## Task 6: Build + visual verification

**Files:** none (verification only)

- [ ] **Step 1: Full production build**

Run: `cd ~/stackconsultingai-com && npm run build`
Expected: build completes with no errors; `/ai-os` appears in the route list.

- [ ] **Step 2: Final banned-word sweep across all new/changed files**

Run:
```bash
cd ~/stackconsultingai-com && grep -niE 'leverage|synergize|unlock|transform|empower|solutions provider|cutting-edge|next-generation|in today' \
  app/ai-os/page.tsx components/AiOsExplainer.tsx components/AiOsTiers.tsx \
  || echo "clean"
```
Expected: `clean`

- [ ] **Step 3: Visual check on dev server**

Run: `cd ~/stackconsultingai-com && next dev -p 3008` (3000=Onyx replacement risk avoided; 3007 may hold ops-dashboard). Open `http://localhost:3008/ai-os` and `http://localhost:3008/` and confirm: hero reads cleanly, the navy explainer renders 3 steps, tier cards show with Operator highlighted, no layout shift, light mode / navy+blue brand intact, mobile nav shows "AI OS". Stop the server when done.

- [ ] **Step 4: Commit any visual fixes, then summary commit if needed**

```bash
git add -A && git commit -m "fix(ai-os): visual polish after review" || echo "nothing to fix"
```

---

## Self-Review

**Spec coverage:**
- Positioning statement → hero H1 + AiOsExplainer (Tasks 1, 3). ✓
- 3 tiers with setup+care pricing → AiOsTiers (Task 2). ✓
- Bodies Mac>Win>Linux → AiOsTiers bodies block (Task 2). ✓
- Care plan = the product → tiers lead with /mo, "What's inside" Care card, Sovereign copy (Tasks 2,3). ✓
- Office Rebuild add-on → AiOsTiers callout (Task 2). ✓
- Local = top compliance tier, names Dr. Woods → Sovereign section (Task 3). ✓
- No n8n → "automation runtime / agent-built code" framing only (Task 3 inside list). ✓
- Homepage explainer → Task 4. ✓
- Nav + footer + sitemap + JSON-LD → Tasks 3, 5. ✓
- Brand compliance → banned-word greps (Tasks 3, 6), brand tokens reused from ai-receptionist. ✓

**Placeholder scan:** No TBD/TODO; all copy and markup are concrete. Steps 2–3 of Task 5 reference matching existing sibling markup rather than reproducing unknown footer/mobile code — acceptable because exact classNames must be copied from the live file the engineer is editing.

**Type consistency:** `AiOsExplainer` prop `showCta?: boolean` defined in Task 1, used identically in Tasks 3 (`<AiOsExplainer />`) and 4 (`<AiOsExplainer showCta />`). `AiOsTiers` takes no props, used as `<AiOsTiers />` in Task 3. Brand classes (`brand`, `brand-hover`, `navy-900`, `soft`, `border`, `muted-foreground`, `section-kicker`) all confirmed present in the existing ai-receptionist page. ✓
