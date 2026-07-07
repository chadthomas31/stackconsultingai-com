import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  ClipboardList,
  Search,
  FileText,
  Presentation,
  Workflow,
  ShieldCheck,
  Gauge,
  AlertTriangle,
  Plus,
} from "lucide-react";

import PricingTier from "@/components/PricingTier";
import CallOptions from "@/components/CallOptions";

export const metadata: Metadata = {
  title: "AI Readiness Audit | Stack Consulting AI",
  description:
    "A founder-led AI readiness audit for small businesses. We map your workflows, score your AI readiness, and deliver a prioritized report with fixed-price recommendations. Two flat-fee tiers. No retainer.",
  keywords: [
    "AI readiness audit",
    "AI workflow audit",
    "small business AI audit",
    "AI readiness assessment",
    "AI consultant audit",
    "AI consulting Orange County",
    "AI strategy audit",
  ],
  alternates: {
    canonical: "https://stackconsultingai.com/ai-readiness-audit",
  },
  openGraph: {
    title: "AI Readiness Audit | Stack Consulting AI",
    description:
      "Two flat-fee audit tiers. Workflow audit at $497. Full readiness audit at $1,497. Real builder, real recommendations, no retainer lock-in.",
    url: "https://stackconsultingai.com/ai-readiness-audit",
    type: "website",
  },
};

const SERVICE_URL = "https://stackconsultingai.com/ai-readiness-audit";

const tiers = [
  {
    name: "Workflow Audit",
    price: "$497",
    cadence: "flat fee · 7-day delivery",
    pitch:
      "One workflow under the microscope. Pick the one that hurts most — calls, leads, scheduling, invoicing, support — we map it end-to-end and tell you exactly what AI can and can't fix.",
    bullets: [
      "60-min discovery call",
      "End-to-end workflow map (current state)",
      "Top 3 automation opportunities, ranked by ROI",
      "Specific tool recommendations (Claude vs GPT vs n8n vs custom)",
      "Fixed-price implementation quote if you want to proceed",
      "1-page PDF deliverable + 30-min walkthrough",
    ],
    ctaLabel: "Start a workflow audit",
    ctaHref: "/#contact",
    highlight: false,
  },
  {
    name: "Full AI Readiness Audit",
    price: "$1,497",
    cadence: "flat fee · 14-day delivery",
    pitch:
      "Whole-business assessment. We score your data, your stack, your team, and your processes against real AI use cases. You leave with a 90-day roadmap and a defensible business case.",
    bullets: [
      "Two discovery calls (operations + tech)",
      "Stack & data inventory (CRM, comms, docs, finance)",
      "AI readiness scorecard across 8 dimensions",
      "Top 5 use cases ranked by impact × feasibility",
      "Risk + compliance flags (PII, SOC, vendor lock-in)",
      "12-page report + 60-min executive walkthrough",
      "Fixed-price quotes for the top 3 use cases",
      "Audit fee credited toward any project we ship together",
    ],
    ctaLabel: "Book the full audit",
    ctaHref: "/#contact",
    highlight: true,
  },
];

const insideAudit = [
  {
    icon: Workflow,
    title: "Workflow inventory",
    description:
      "Every repetitive process documented — who does it, how long it takes, where the handoffs break.",
  },
  {
    icon: Gauge,
    title: "Stack & data scorecard",
    description:
      "Your CRM, calendar, docs, comms, and finance tools graded on AI-readiness. Where automation slots in cleanly. Where it can't.",
  },
  {
    icon: AlertTriangle,
    title: "Risk + compliance flags",
    description:
      "PII exposure, vendor lock-in, model-training opt-outs, SOC/HIPAA gotchas. We name what could bite you.",
  },
  {
    icon: ShieldCheck,
    title: "Use-case ranking",
    description:
      "Each opportunity scored on impact × feasibility × cost. No 30-item wish lists. Top 3 to 5 you can actually ship.",
  },
  {
    icon: ClipboardList,
    title: "Tool recommendations",
    description:
      "Specific picks — Claude, GPT, Gemini, n8n, custom Node, FreeSWITCH — with reasons. We name names. We don't take vendor kickbacks.",
  },
  {
    icon: FileText,
    title: "Fixed-price quotes",
    description:
      "If we recommend building something, you get a fixed scope and fixed price the same week. No retainer creep.",
  },
];

const process = [
  {
    icon: Phone,
    step: "01",
    title: "Kickoff call",
    description:
      "30–60 minutes. We learn your business, your team size, and what's actually broken. No pitch deck. No demo theater.",
  },
  {
    icon: Search,
    step: "02",
    title: "Stack & workflow review",
    description:
      "We document your current systems, sit in on a real workflow if helpful, and ask the questions a builder asks — not the questions a strategy deck asks.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Report build",
    description:
      "We write the audit. Real PDF, real specifics, real numbers. Workflow Audit ships in 7 days. Full Readiness Audit ships in 14.",
  },
  {
    icon: Presentation,
    step: "04",
    title: "Walkthrough call",
    description:
      "We walk you through the report on a recorded call. You ask whatever. You leave with a clear yes/no/wait on each opportunity and fixed-price quotes if you want to ship.",
  },
];

const goodFit = [
  "You run a small business (2–50 employees) and you're tired of generic AI pitches.",
  "You've been burned by an agency that sold you software you couldn't operate.",
  "You want a defensible business case before you commit to building anything.",
  "You'd rather pay $497–$1,497 once than $5,000+/mo on a retainer.",
];

const badFit = [
  "You're hunting for a $99 ChatGPT prompt pack. We're not that.",
  "You want a 50-page strategy deck with no implementation path. We don't write those.",
  "You expect us to recommend the most expensive option regardless of fit. We won't.",
  "You don't have time for a 60-minute call. The audit needs your input to be honest.",
];

const faqs = [
  {
    q: "How is this different from a free 'AI strategy session' from an agency?",
    a: "A free strategy session is a sales call. The agency walks away with leverage and you walk away with a slide deck. Our audits are paid, fixed-fee, and ship a written report you own. We're incentivized to be honest because we don't need a retainer to keep the lights on.",
  },
  {
    q: "What if the audit tells me AI isn't the right move yet?",
    a: "That's a valid outcome and we say it out loud. About 1 in 4 audits we run end with 'fix your data, fix your CRM, then revisit AI in 6 months.' You still leave with a prioritized list of non-AI fixes. No upsell pressure.",
  },
  {
    q: "Can the audit fee be credited toward implementation?",
    a: "Yes — the full $1,497 Readiness Audit fee is credited toward any project we ship together within 90 days. The Workflow Audit isn't credited because it's already priced as a loss-leader.",
  },
  {
    q: "Who actually does the audit?",
    a: "Chad McCluskey. The same person who builds the systems writes the audit. No junior consultant, no offshore contractor, no template generator dressed up as analysis.",
  },
  {
    q: "Do I have to be in Orange County?",
    a: "No. We run audits remotely across the US. We're based in South Orange County (San Clemente area), so SoCal clients get on-site visits if useful. Out-of-state is video calls + shared docs only.",
  },
  {
    q: "How is this different from the Pacific City AI or surfcity.ai audits?",
    a: "Similar productized format, sharper price, and we ship working software after — not just reports. Our deliverable includes fixed-price implementation quotes the same week, so you can act on the report immediately if you want to.",
  },
  {
    q: "What data do you need access to?",
    a: "For the Workflow Audit, usually nothing — we work from a 60-minute conversation. For the Full Readiness Audit, we ask for a read-only walkthrough of your CRM, your top 3 SaaS tools, and a sample of any docs/data you'd want AI to touch. Mutual NDA signed before anything sensitive moves.",
  },
  {
    q: "Will my data be sent to OpenAI or anyone else?",
    a: "Not during the audit. We don't run your data through any LLM as part of the analysis. If we recommend an LLM-backed system later, we always default to provider plans with no-train guarantees and explicit data residency.",
  },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SERVICE_URL}#service`,
  name: "AI Readiness Audit for Small Businesses",
  description:
    "Founder-led, fixed-fee AI readiness audit. Two tiers: $497 Workflow Audit and $1,497 Full Readiness Audit. Includes scorecard, prioritized use cases, and fixed-price implementation quotes.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://stackconsultingai.com/#organization",
    name: "Stack Consulting AI",
  },
  areaServed: [
    {
      "@type": "AdministrativeArea",
      name: "Orange County, California",
    },
    {
      "@type": "Country",
      name: "United States",
    },
  ],
  serviceType: "AI Readiness Audit",
  category: "Business Consulting",
  audience: {
    "@type": "BusinessAudience",
    audienceType: "Small Business",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Workflow Audit",
      description:
        "One workflow mapped end-to-end with prioritized AI automation opportunities and fixed-price implementation quote.",
      price: "497",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Full AI Readiness Audit",
      description:
        "Whole-business AI readiness scorecard, top use cases, risk flags, 12-page report, executive walkthrough, and fixed-price implementation quotes. Audit fee credited toward implementation.",
      price: "1497",
      priceCurrency: "USD",
    },
  ],
  url: SERVICE_URL,
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://stackconsultingai.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "AI Readiness Audit",
      item: SERVICE_URL,
    },
  ],
};

export default function AiReadinessAuditPage() {
  return (
    <main className="min-h-screen bg-white">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-soft via-white to-white" />
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-brand transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-navy-900 font-medium">AI Readiness Audit</li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-navy-900 text-xs font-medium mb-8">
            <ClipboardList aria-hidden="true" className="w-3.5 h-3.5 text-brand" />
            <span>Fixed-fee · Founder-led · 7–14 day delivery</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-navy-900 leading-[1.05] mb-6 max-w-5xl">
            An AI readiness audit{" "}
            <span className="text-brand">that ends with a real plan.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed">
            Skip the 40-slide strategy deck. We map your workflows, score your
            stack, name the top 3–5 places AI actually moves the needle, and
            hand you fixed-price quotes the same week. Two flat-fee tiers. No
            retainer.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-start mb-10">
            <Link
              href="#tiers"
              className="btn-cta-call inline-flex items-center gap-2 text-base"
            >
              See audit tiers
              <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
            <Link
              href="/#contact"
              className="btn-ghost inline-flex items-center gap-2 text-base"
            >
              Talk to Chad first
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            10+ Southern California small businesses audited and shipped on this
            stack since 2025.
          </p>
        </div>
      </section>

      {/* Reality */}
      <section className="py-16 bg-soft">
        <div className="max-w-4xl mx-auto px-4">
          <span className="section-kicker">The reality</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-6 tracking-tight">
            You don&rsquo;t need an AI strategy. You need to know what to build
            first.
          </h2>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Most &ldquo;AI readiness&rdquo; offers are loss-leaders for a
            six-figure consulting engagement. The deliverable is a slide deck
            full of frameworks. Six weeks later you still have no idea whether
            to build a chatbot, automate your follow-ups, or fire your CRM.
          </p>
          <p className="text-lg text-navy-900 font-semibold leading-relaxed">
            Our audit is the opposite. Flat fee. Real PDF. Specific tools, real
            cost estimates, and quotes you can act on immediately. If the right
            answer is &ldquo;not yet,&rdquo; we&rsquo;ll say that too.
          </p>
        </div>
      </section>

      {/* Signature: sample report preview */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <span className="section-kicker">Sample deliverable</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
                What lands in your inbox.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A 12-page PDF with a real scorecard, named tools, ranked
                opportunities, and fixed-price quotes. Formatted to forward to
                your accountant or your board without rewriting a word.
              </p>
              <ul className="space-y-2 text-sm text-navy-900">
                <li className="flex gap-2">
                  <span className="text-brand">→</span> AI-readiness score across 8 dimensions
                </li>
                <li className="flex gap-2">
                  <span className="text-brand">→</span> Top 5 use cases, ranked impact × feasibility
                </li>
                <li className="flex gap-2">
                  <span className="text-brand">→</span> Risk + compliance flags called out
                </li>
                <li className="flex gap-2">
                  <span className="text-brand">→</span> Fixed-price implementation quotes
                </li>
              </ul>
            </div>

            {/* Stylized PDF preview */}
            <div
              aria-hidden="true"
              className="md:col-span-7 relative"
            >
              <div className="absolute -top-6 -right-6 w-full h-full rounded-md bg-brand-soft hidden md:block" />
              <div className="relative bg-white border border-border rounded-md p-8 md:p-10 shadow-[0_24px_60px_-24px_rgba(0,18,46,0.25)]">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand" />
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      AI Readiness Audit · Acme Co.
                    </span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    p. 03 / 12
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-navy-900 mb-1">
                  Readiness Scorecard
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  How your stack scores across 8 dimensions (0&ndash;10).
                </p>

                <div className="space-y-3">
                  {[
                    { label: "Data hygiene", score: 7 },
                    { label: "CRM completeness", score: 4 },
                    { label: "Workflow documentation", score: 3 },
                    { label: "Tool consolidation", score: 6 },
                    { label: "Team AI literacy", score: 5 },
                    { label: "Compliance posture", score: 8 },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-[1fr_auto] items-center gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-navy-900">
                            {row.label}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground tabular-nums">
                            {row.score}/10
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-soft overflow-hidden">
                          <div
                            className="h-full bg-brand rounded-full"
                            style={{ width: `${row.score * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-border flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Overall
                  </span>
                  <span className="font-heading text-2xl font-bold text-navy-900">
                    5.5<span className="text-muted-foreground text-base font-normal">/10</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-14 max-w-2xl">
            <span className="section-kicker">Pick your tier</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              Two flat fees. No retainer trap.
            </h2>
            <p className="text-lg text-muted-foreground">
              Start narrow with one workflow, or go broad with the full
              readiness scorecard. Either way: fixed price, fixed timeline,
              real deliverable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {tiers.map((t) => (
              <PricingTier key={t.name} {...t} />
            ))}
          </div>

          <p className="text-sm text-muted-foreground text-center mt-8 max-w-2xl mx-auto">
            Not sure which fits?{" "}
            <Link href="/#contact" className="text-brand-hover hover:underline">
              Talk to Chad
            </Link>{" "}
            for 15 minutes &mdash; we&rsquo;ll point you to the right tier even
            if it&rsquo;s the cheaper one.
          </p>
        </div>
      </section>

      {/* What's inside — editorial list, no card grid */}
      <section className="py-20 bg-soft">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-4">
              <span className="section-kicker">What&rsquo;s inside</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
                What an audit actually contains
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Real artifacts, not framework slides. The full audit ships as
                a 12-page PDF you can hand to your accountant, your team, or
                your board.
              </p>
            </div>

            <ol className="md:col-span-8 divide-y divide-border border-y border-border">
              {insideAudit.map((item, i) => {
                const Icon = item.icon;
                const num = String(i + 1).padStart(2, "0");
                return (
                  <li
                    key={item.title}
                    className="flex items-start gap-5 py-6"
                  >
                    <span className="font-heading text-2xl font-bold text-brand-soft tabular-nums w-10 shrink-0 pt-0.5">
                      {num}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className="w-5 h-5 text-brand shrink-0 mt-1.5"
                    />
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-navy-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12 max-w-2xl">
            <span className="section-kicker">How it works</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              Kickoff to walkthrough in 7&ndash;14 days
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {process.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative p-8 rounded-md bg-white border border-border"
                >
                  <span className="absolute top-4 right-4 font-heading text-5xl font-bold text-brand-soft">
                    {s.step}
                  </span>
                  <div className="p-2.5 rounded-md bg-brand-soft text-brand w-fit mb-4">
                    <Icon aria-hidden="true" className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-navy-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fit / Not fit */}
      <section className="py-20 bg-soft">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-kicker">Honest fit check</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              Who this is for &mdash; and who it isn&rsquo;t
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-md bg-white border-2 border-brand/40">
              <h3 className="font-heading font-semibold text-navy-900 mb-4">
                Good fit
              </h3>
              <ul className="space-y-3">
                {goodFit.map((g) => (
                  <li
                    key={g}
                    className="flex items-start gap-3 text-sm text-navy-900 leading-relaxed"
                  >
                    <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-md bg-white border border-border">
              <h3 className="font-heading font-semibold text-navy-900 mb-4">
                Probably not a fit
              </h3>
              <ul className="space-y-3">
                {badFit.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                  >
                    <AlertTriangle aria-hidden="true" className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-kicker">FAQ</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              Common questions before booking
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-md bg-white border border-border p-5 open:border-brand/40 transition-colors"
              >
                <summary className="cursor-pointer list-none font-heading font-semibold text-navy-900 flex items-start justify-between gap-4">
                  <span>{f.q}</span>
                  <Plus
                    aria-hidden="true"
                    className="text-brand-hover transition-transform group-open:rotate-45 mt-1 w-5 h-5 shrink-0"
                  />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 bg-soft">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy-900 mb-6 tracking-tight">
            Ready for an honest answer?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Pick a tier or just tell us what&rsquo;s broken. We&rsquo;ll point
            you to the right one &mdash; or tell you to skip the audit
            entirely.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="#tiers"
              className="btn-cta-call inline-flex items-center justify-center gap-2 text-base"
            >
              See audit tiers
              <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
            <CallOptions label="Talk to Chad" variant="ghost" />
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Phone: (949) 749-0001 · Or pick a meeting platform above
          </p>
        </div>
      </section>

    </main>
  );
}
