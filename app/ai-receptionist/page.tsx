import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  PhoneCall,
  CalendarCheck,
  MessageSquare,
  Mail,
  ArrowRightLeft,
  Mic,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title:
    "AI Receptionist for Small Business | 24/7 Voice Agent | Stack Consulting AI",
  description:
    "An AI receptionist that answers your phone, qualifies callers, books appointments, transfers to humans, and emails the transcript — 24/7. Built on FreeSWITCH + OpenAI Realtime. Live demo on the homepage. Setup from $4,997.",
  keywords: [
    "AI receptionist",
    "AI voice agent",
    "AI phone agent small business",
    "AI answering service",
    "OpenAI Realtime voice agent",
    "FreeSWITCH AI",
    "AI receptionist Orange County",
    "small business AI phone system",
    "after hours AI receptionist",
  ],
  alternates: {
    canonical: "https://stackconsultingai.com/ai-receptionist",
  },
  openGraph: {
    title: "AI Receptionist — 24/7 Voice Agent for Small Business",
    description:
      "Your phone answered, your callers qualified, your calendar booked — at 2 a.m. on a Sunday. Live demo on our homepage you can call right now.",
    url: "https://stackconsultingai.com/ai-receptionist",
    type: "website",
  },
};

const SERVICE_URL = "https://stackconsultingai.com/ai-receptionist";

const capabilities = [
  {
    icon: PhoneCall,
    title: "Answer 24/7",
    description:
      "Picks up before voicemail kicks in, every hour, every weekend. Sub-1-second answer time, natural-sounding voice, configurable greeting.",
  },
  {
    icon: MessageSquare,
    title: "Qualify the caller",
    description:
      "Asks the questions you tell it to ask. Captures name, phone, intent, urgency, and any custom fields you want logged before a human ever sees the lead.",
  },
  {
    icon: CalendarCheck,
    title: "Book appointments live",
    description:
      "Reads your real calendar (Google, Microsoft, GoHighLevel, Cal.com), offers actual open slots, books while the caller is still on the phone.",
  },
  {
    icon: ArrowRightLeft,
    title: "Warm transfer to humans",
    description:
      "If the caller wants a human, the agent transfers to your cell, your team, or your existing PBX with a spoken hand-off summary so nobody re-asks the same questions.",
  },
  {
    icon: Mail,
    title: "Email + CRM logging",
    description:
      "Every call ends with a transcript, summary, and qualification fields pushed to your inbox and your CRM. No tab-switching, no manual notes.",
  },
  {
    icon: Mic,
    title: "Sounds like you, not a robot",
    description:
      "OpenAI Realtime voice with custom persona and brand vocabulary. We tune the voice, the script, and the personality to match how you actually talk.",
  },
];

const stack = [
  { label: "Telephony", value: "FreeSWITCH (self-hosted, no per-minute Twilio markup)" },
  { label: "Voice model", value: "OpenAI Realtime API (gpt-realtime)" },
  { label: "Trunking", value: "Telnyx or BYO SIP trunk" },
  { label: "Calendar", value: "Google, Microsoft 365, Cal.com, GoHighLevel" },
  { label: "CRM logging", value: "HubSpot, GoHighLevel, Supabase, custom webhook" },
  { label: "Hosting", value: "Your VPS or ours · 100% your data" },
];

const useCases = [
  {
    title: "After-hours overflow",
    description:
      "You're closed. Voicemail loses leads. The AI receptionist takes the call, qualifies the lead, and either books them or sends you a summary so Monday morning isn't a black box.",
  },
  {
    title: "Single-line businesses that miss calls",
    description:
      "Solo owners, contractors, clinics, and small shops where every missed call is a missed sale. The AI catches everything that would've gone to voicemail.",
  },
  {
    title: "High-volume inbound qualification",
    description:
      "Service businesses where 60% of calls are unqualified tire-kickers. The agent screens, qualifies, and only routes the real ones to a human.",
  },
  {
    title: "Bilingual reception",
    description:
      "English + Spanish out of the box. Caller picks language, agent switches automatically, transcripts logged in both.",
  },
];

const results = [
  {
    metric: "40%",
    label: "More booked appointments",
    detail:
      "Fix It San Clemente: AI receptionist + automated follow-up. Bookings up 40% inside 90 days.",
  },
  {
    metric: "<1 sec",
    label: "Answer time",
    detail:
      "FreeSWITCH + Realtime API answers faster than your phone can finish ringing. No 'please hold while we connect you.'",
  },
  {
    metric: "100%",
    label: "Calls captured",
    detail:
      "Every inbound call gets a transcript, a summary, and a CRM record. Nothing slips through after-hours, vacation, or a busy team.",
  },
];

const tiers = [
  {
    name: "Pilot",
    price: "$4,997",
    cadence: "one-time setup · ~$300/mo infra",
    pitch:
      "One inbound number, one persona, one calendar integration, one CRM webhook. We launch in 10 business days. Perfect for proving it out before scaling.",
    bullets: [
      "Single phone line + AI persona",
      "1 calendar integration (Google or Microsoft)",
      "1 CRM webhook (HubSpot, GHL, Supabase, or custom)",
      "Email transcript + summary on every call",
      "Warm transfer to a single destination",
      "30 days of post-launch tuning included",
      "You own the FreeSWITCH config + repo",
    ],
    cta: "Start a pilot",
    highlight: false,
  },
  {
    name: "Production",
    price: "$9,997",
    cadence: "one-time setup · ~$500/mo infra",
    pitch:
      "Multiple lines, multiple personas, IVR routing, after-hours rules, bilingual support, and analytics. The full receptionist your front desk wishes they were.",
    bullets: [
      "Multiple lines + per-line persona",
      "IVR menu routing + after-hours logic",
      "English + Spanish (or other language pair)",
      "Multiple calendar + CRM integrations",
      "Recorded call analytics dashboard",
      "Custom escalation paths (cell, team, on-call)",
      "60 days of post-launch tuning + monthly tuning calls",
      "SLA on uptime + response time",
    ],
    cta: "Talk through production scope",
    highlight: true,
  },
];

const faqs = [
  {
    q: "Can I actually call your AI receptionist before paying anything?",
    a: "Yes. The live demo on our homepage uses the exact same FreeSWITCH + OpenAI Realtime stack we deploy for clients. Enter your phone number, the system places an outbound call to you, and you talk to the agent. That's the demo. No watered-down sandbox version.",
  },
  {
    q: "How is this different from Goodcall, Smith.ai, Ruby, or PolyAI?",
    a: "Goodcall, Smith.ai, and Ruby are subscription answering services — you pay per minute or per call forever. PolyAI sells to enterprises only. We build a one-time, owned system on FreeSWITCH that you keep. Lower long-term cost, no per-minute markup, full control over the voice and the script.",
  },
  {
    q: "What does the voice sound like?",
    a: "OpenAI Realtime — currently the most natural production-grade conversational voice on the market. The agent can interrupt, be interrupted, handle uh-huhs and side comments, and switch tone. Most callers don't realize it's AI on the first call.",
  },
  {
    q: "Where does the data live?",
    a: "Your infrastructure. We host FreeSWITCH on your VPS (or ours, if you don't have one). Calls are logged to your CRM, transcripts stored in your storage. We don't keep copies. OpenAI handles voice processing under their no-train commercial terms.",
  },
  {
    q: "What if the AI gets confused or a caller demands a human?",
    a: "Built-in escape hatches. Caller can say 'human' or 'transfer me' at any point and the agent immediately transfers with a spoken summary so the human isn't lost. We also configure custom escalation triggers (e.g., emergency keywords, irate sentiment, complex pricing questions).",
  },
  {
    q: "How long until it's live?",
    a: "Pilot: ~10 business days from contract signed. Production: 3–4 weeks. The bottleneck is usually the calendar/CRM integration on your side, not the voice agent.",
  },
  {
    q: "What happens if OpenAI's API goes down?",
    a: "We configure FreeSWITCH to fail gracefully — caller hears a brief 'one moment' and is transferred to a fallback number (your cell, voicemail, or an answering service). We've never lost a call to an outage in production.",
  },
  {
    q: "Can it handle HIPAA, PCI, or other regulated data?",
    a: "For HIPAA: yes, with a BAA and a model-routing setup that keeps PHI out of the conversation logs. For PCI: we don't take payment over the AI line — we transfer to your existing PCI-compliant flow. Talk to us about your specific compliance constraints before you scope.",
  },
  {
    q: "Do you build receptionists for businesses outside Orange County?",
    a: "Yes. Most of the work is remote — calendar APIs, FreeSWITCH config, voice tuning. We've shipped to clients across Southern California and remote across the US.",
  },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SERVICE_URL}#service`,
  name: "AI Receptionist for Small Business",
  description:
    "24/7 AI voice agent built on FreeSWITCH + OpenAI Realtime. Answers calls, qualifies callers, books appointments, transfers to humans, and emails transcripts. Owned, not subscribed.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://stackconsultingai.com/#organization",
    name: "Stack Consulting AI",
    url: "https://stackconsultingai.com",
    telephone: "+1-949-749-0001",
    email: "hello@stackconsultingai.com",
    address: {
      "@type": "PostalAddress",
      addressRegion: "CA",
      addressLocality: "South Orange County",
      addressCountry: "US",
    },
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Orange County, California" },
    { "@type": "Country", name: "United States" },
  ],
  serviceType: "AI Receptionist",
  category: "AI Voice Agent",
  audience: {
    "@type": "BusinessAudience",
    audienceType: "Small Business",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Pilot",
      description:
        "Single-line AI receptionist pilot with one calendar and CRM integration. Launches in ~10 business days.",
      price: "4997",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Production",
      description:
        "Multi-line AI receptionist with IVR routing, bilingual support, multiple integrations, analytics, and SLAs.",
      price: "9997",
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
    acceptedAnswer: { "@type": "Answer", text: f.a },
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
      name: "AI Receptionist",
      item: SERVICE_URL,
    },
  ],
};

export default function AiReceptionistPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

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
              <li className="text-navy-900 font-medium">AI Receptionist</li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-navy-900 text-xs font-medium mb-8">
            <Mic className="w-3.5 h-3.5 text-brand" />
            <span>Live demo on the homepage · Call it yourself</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-navy-900 leading-[1.05] mb-6 max-w-5xl">
            An AI receptionist that{" "}
            <span className="text-brand">books appointments while you sleep.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed">
            FreeSWITCH + OpenAI Realtime, deployed on your infrastructure.
            Answers your phone, qualifies the caller, reads your calendar,
            books the appointment, transfers humans when needed, and emails
            you the transcript. 24/7. Sub-1-second answer time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-start mb-10">
            <Link
              href="/#call-me"
              className="btn-accent inline-flex items-center gap-2 text-base"
            >
              <Phone className="w-4 h-4" />
              Call the live demo
            </Link>
            <Link
              href="#tiers"
              className="btn-ghost inline-flex items-center gap-2 text-base"
            >
              See pricing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Same stack live on this site&rsquo;s hero. Try it before you trust it.
          </p>
        </div>
      </section>

      {/* Reality check */}
      <section className="py-20 bg-soft">
        <div className="max-w-4xl mx-auto px-4">
          <span className="section-kicker">The reality</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-6 tracking-tight">
            Voicemail loses leads. Answering services cost $4 a minute. Both
            options stink.
          </h2>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Goodcall, Smith.ai, and Ruby will rent you a receptionist for
            $300&ndash;$1,200 a month forever. PolyAI builds enterprise-only.
            DIY no-code voice tools sound like robots and break the moment a
            caller goes off-script.
          </p>
          <p className="text-lg text-navy-900 font-semibold leading-relaxed">
            We build you the receptionist instead of renting it. One-time
            setup, your infrastructure, your data, your voice. Pay once.
            Operate for years.
          </p>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-kicker">What it does</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              What an AI receptionist actually handles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real capabilities, not framework demos. Each of these runs in
              production on client lines today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="p-6 rounded-md bg-white border border-border hover:border-navy-900/30 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,18,46,0.10)]"
                >
                  <div className="p-2.5 rounded-md bg-brand-soft text-brand w-fit mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-navy-900 mb-2">
                    {c.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {c.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="py-20 bg-soft">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-kicker">The stack</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              We name our parts. No black boxes.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every layer is open, owned, and replaceable. Nothing locked
              behind a proprietary &ldquo;AI platform.&rdquo;
            </p>
          </div>

          <div className="rounded-md bg-white border border-border overflow-hidden">
            {stack.map((row, i) => (
              <div
                key={row.label}
                className={
                  i === stack.length - 1
                    ? "flex flex-col sm:flex-row gap-2 sm:gap-6 px-6 py-4"
                    : "flex flex-col sm:flex-row gap-2 sm:gap-6 px-6 py-4 border-b border-border"
                }
              >
                <div className="sm:w-40 text-xs uppercase tracking-wide text-muted-foreground font-semibold pt-0.5">
                  {row.label}
                </div>
                <div className="text-navy-900 text-sm leading-relaxed">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-12">
            <span className="section-kicker">Where it pays for itself</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              Best-fit use cases
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((u) => (
              <div
                key={u.title}
                className="p-6 rounded-md bg-white border border-border"
              >
                <h3 className="font-heading text-lg font-semibold text-navy-900 mb-2">
                  {u.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {u.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 bg-soft">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-kicker">Proof</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              Real clients. Real numbers.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((r) => (
              <div
                key={r.label}
                className="p-8 rounded-md bg-white border border-border text-center"
              >
                <div className="font-heading text-5xl font-bold text-brand mb-2">
                  {r.metric}
                </div>
                <div className="font-heading text-lg font-semibold text-navy-900 mb-3">
                  {r.label}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {r.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tiers" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-kicker">Pricing</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              Two tiers. Owned, not rented.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One-time build fee plus your own infrastructure costs. No
              per-minute markup. No subscription that doubles next year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={
                  t.highlight
                    ? "relative p-8 rounded-md bg-white border-2 border-brand shadow-[0_8px_32px_rgba(62,106,239,0.18)]"
                    : "p-8 rounded-md bg-white border border-border"
                }
              >
                {t.highlight ? (
                  <span className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-brand text-white text-xs font-semibold tracking-wide">
                    Most chosen
                  </span>
                ) : null}
                <h3 className="font-heading text-2xl font-bold text-navy-900 mb-1">
                  {t.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-heading text-5xl font-bold text-navy-900">
                    {t.price}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-5">
                  {t.cadence}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t.pitch}
                </p>
                <ul className="space-y-3 mb-8">
                  {t.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-sm text-navy-900 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/#contact"
                  className={
                    t.highlight
                      ? "btn-accent w-full inline-flex items-center justify-center gap-2"
                      : "btn-ghost w-full inline-flex items-center justify-center gap-2"
                  }
                >
                  {t.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-md bg-white border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-brand" />
                <h4 className="font-heading font-semibold text-navy-900 text-sm">
                  10-day pilot
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Most pilots are answering real calls in ten business days from
                contract signed.
              </p>
            </div>
            <div className="p-5 rounded-md bg-white border border-border">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-brand" />
                <h4 className="font-heading font-semibold text-navy-900 text-sm">
                  Your data stays yours
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hosted on your infrastructure. OpenAI no-train commercial
                terms by default. NDA + DPA on request.
              </p>
            </div>
            <div className="p-5 rounded-md bg-white border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-brand" />
                <h4 className="font-heading font-semibold text-navy-900 text-sm">
                  No per-minute markup
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You pay OpenAI + your SIP trunk at cost. We don&rsquo;t resell
                minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-soft">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-kicker">FAQ</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              What buyers ask before signing
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
                  <span
                    aria-hidden
                    className="text-brand transition-transform group-open:rotate-45 mt-0.5 text-xl leading-none"
                  >
                    +
                  </span>
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
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy-900 mb-6 tracking-tight">
            Stop losing calls. Start booking them.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Try the live demo on the homepage. If it sounds like something
            your business needs, we can have a pilot live in 10 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/#call-me"
              className="btn-accent inline-flex items-center justify-center gap-2 text-base"
            >
              <Phone className="w-4 h-4" />
              Call the live demo
            </Link>
            <Link
              href="/#contact"
              className="btn-ghost inline-flex items-center justify-center gap-2 text-base"
            >
              Talk to Chad
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Or call us directly:{" "}
            <a
              href="tel:+19497490001"
              className="text-brand hover:underline font-medium"
            >
              (949) 749-0001
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
