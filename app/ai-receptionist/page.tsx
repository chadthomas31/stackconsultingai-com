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
  Clock,
  Zap,
  Plus,
} from "lucide-react";

import PricingTier from "@/components/PricingTier";
import CallOptions from "@/components/CallOptions";
import RetroCallPreview from "@/components/RetroCallPreview";

export const metadata: Metadata = {
  title:
    "AI Receptionist for Small Business | 24/7 Voice Agent | Stack Consulting AI",
  description:
    "An AI receptionist that answers missed calls, qualifies callers, transfers to humans, and emails the transcript — start with a free pilot.",
  keywords: [
    "AI receptionist",
    "AI voice agent",
    "AI phone agent small business",
    "AI answering service",
    "OpenAI Realtime voice agent",
    "missed call automation",
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
  { label: "Telephony", value: "Managed phone number or your existing line forwarded after-hours" },
  { label: "Voice model", value: "OpenAI Realtime API (gpt-realtime)" },
  { label: "Phone routing", value: "Ring your cell, shop line, team number, or voicemail fallback" },
  { label: "Calendar", value: "Google Calendar, Microsoft 365, Cal.com, or simple callback request" },
  { label: "Lead logging", value: "Email summary first; CRM/webhook when you are ready" },
  { label: "Upgrade path", value: "Start simple, then add deeper phone-system control if call volume proves it" },
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

const tiers = [
  {
    name: "Free Missed Call Pilot",
    price: "Free",
    cadence: "limited starter pilot",
    pitch:
      "For the owner who just needs help right now. We answer missed calls, capture the lead, and send it to you. If it helps your business, then we talk about keeping it on.",
    bullets: [
      "One AI receptionist persona",
      "After-hours or missed-call forwarding",
      "Caller name, phone, reason, and urgency captured",
      "Text/email summary after each qualified call",
      "Transfer to one owner or front-desk number",
      "Simple script tuning included during the pilot",
      "No setup fee to prove the idea",
    ],
    ctaLabel: "Start free",
    ctaHref: "/#contact",
    highlight: true,
  },
  {
    name: "Keep It Running",
    price: "Custom",
    cadence: "only after it works",
    pitch:
      "Once the pilot is catching real leads and the owner is happy, keep it on and add booking, CRM, bilingual routing, analytics, and deeper phone-system control.",
    bullets: [
      "Everything in the free pilot",
      "Calendar booking or appointment request flow",
      "Business-hours and after-hours rules",
      "Two transfer destinations",
      "English + Spanish option",
      "Monthly script improvements from real calls",
      "CRM or Google Sheet logging",
      "Upgrade credit toward a custom phone system",
    ],
    ctaLabel: "Upgrade after it works",
    ctaHref: "/#contact",
    highlight: false,
  },
];

const faqs = [
  {
    q: "Can I actually call your AI receptionist before paying anything?",
    a: "Yes. Use the live demo before you buy anything. Enter your phone number, the system places an outbound call to you, and you talk to the agent. The point is not a slide deck. The point is hearing whether this can answer a real call.",
  },
  {
    q: "How is this different from Goodcall, Smith.ai, Ruby, or PolyAI?",
    a: "Goodcall, Smith.ai, and Ruby are answering services. They can be useful, but you are usually paying for a generic workflow. We start smaller: answer missed calls, capture the lead, route it to you, and tune the script around your business. If call volume proves the value, we can later build the deeper phone-system version.",
  },
  {
    q: "Do I really need to spend thousands before I know this works?",
    a: "No. Start with the free missed-call pilot. The goal is simple: stop missed calls from dying in voicemail, collect the caller details, and send you the lead. If it helps, then we talk about what it should cost to keep running.",
  },
  {
    q: "What does the voice sound like?",
    a: "OpenAI Realtime — currently the most natural production-grade conversational voice on the market. The agent can interrupt, be interrupted, handle uh-huhs and side comments, and switch tone. Most callers don't realize it's AI on the first call.",
  },
  {
    q: "Where does the data live?",
    a: "For the starter plans, call summaries are sent to your inbox and optional CRM/Sheet. We keep the minimum needed to operate and tune the service. If you need stricter ownership or compliance, we can scope that separately.",
  },
  {
    q: "What if the AI gets confused or a caller demands a human?",
    a: "Built-in escape hatches. Caller can say 'human' or 'transfer me' at any point and the agent immediately transfers with a spoken summary so the human isn't lost. We also configure custom escalation triggers (e.g., emergency keywords, irate sentiment, complex pricing questions).",
  },
  {
    q: "How long until it's live?",
    a: "The starter version can usually go live in a few business days once the script, forwarding number, and notification destination are confirmed. Calendar booking and CRM integrations add time, but we do not need those to start answering calls.",
  },
  {
    q: "What happens if OpenAI's API goes down?",
    a: "We configure a fallback path. If the AI cannot answer, the call routes to your cell, front desk, voicemail, or another destination you choose.",
  },
  {
    q: "Can it handle HIPAA, PCI, or other regulated data?",
    a: "For HIPAA: yes, with a BAA and a model-routing setup that keeps PHI out of the conversation logs. For PCI: we don't take payment over the AI line — we transfer to your existing PCI-compliant flow. Talk to us about your specific compliance constraints before you scope.",
  },
  {
    q: "Do you build receptionists for businesses outside Orange County?",
    a: "Yes. Most of the work is remote: script, routing, voice tuning, and notifications. We've shipped to clients across Southern California and remote across the US.",
  },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SERVICE_URL}#service`,
  name: "AI Receptionist for Small Business",
  description:
    "AI receptionist for small businesses that answers missed calls, qualifies callers, transfers to humans, and sends summaries through a free starter pilot.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://stackconsultingai.com/#organization",
    name: "Stack Consulting AI",
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
      name: "Free Missed Call Pilot",
      description:
        "Free starter AI receptionist pilot for missed calls, caller qualification, transfer, and email/text summaries.",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: SERVICE_URL,
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
            <Mic aria-hidden="true" className="w-3.5 h-3.5 text-brand" />
            <span>Live demo on the homepage · Call it yourself</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-navy-900 leading-[1.05] mb-6 max-w-5xl">
            An AI receptionist that{" "}
            <span className="text-brand">books appointments while you sleep.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed">
            Answers your phone, qualifies the caller, books the appointment,
            transfers humans when needed, and emails you the transcript &mdash;
            24/7. Sub-1-second answer time. Same voice agent live on this
            site&rsquo;s hero. Call it before you commit.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-start mb-10">
            <Link
              href="/#assessment"
              className="btn-cta-call inline-flex items-center gap-2 text-base"
            >
              <Phone aria-hidden="true" className="w-4 h-4" />
              Call the live demo
            </Link>
            <Link
              href="#tiers"
              className="btn-ghost inline-flex items-center gap-2 text-base"
            >
              See pricing
              <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            10+ Southern California small businesses on this stack since 2025.
          </p>
        </div>
      </section>

      {/* Reality check */}
      <section className="py-16 bg-soft">
        <div className="max-w-4xl mx-auto px-4">
          <span className="section-kicker">The reality</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-6 tracking-tight">
            Voicemail loses leads. Answering services cost $4 a minute. Both
            options stink.
          </h2>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Goodcall, Smith.ai, and Ruby will rent you a receptionist for
            $300&ndash;$1,200 a month forever. PolyAI builds enterprise-only.
            DIY no-code voice tools can work, but most owners do not want
            another dashboard to babysit.
          </p>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            The answer is not a giant phone-system rebuild on day one. The
            answer is to make sure the phone gets answered, the lead gets
            captured, and the owner gets a clean next step.
          </p>
          <p className="text-lg text-navy-900 font-semibold leading-relaxed">
            Start small. Make the phone ring. If the calls turn into money,
            then we can add booking, CRM, bilingual routing, and custom
            infrastructure.
          </p>
        </div>
      </section>

      {/* Signature: call flow — dark band, horizontal sequence */}
      <section className="py-24 bg-navy-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-14 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-soft">
              How a call flows
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mt-3 mb-4 tracking-tight">
              From ring to booked appointment in under 60 seconds.
            </h2>
            <p className="text-white/70 leading-relaxed">
              Same path every inbound call takes. Sub-1-second answer.
              Calendar booked while the caller is still on the line. Receipt
              in your inbox before they hang up.
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 relative">
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-brand/30"
            />
            {[
              {
                Icon: PhoneCall,
                t: "0s",
                title: "Caller dials in",
                desc: "Inbound number, day or night. Forward missed calls or after-hours calls.",
              },
              {
                Icon: Mic,
                t: "<1s",
                title: "AI answers, qualifies",
                desc: "OpenAI Realtime picks up. Asks the questions you scripted.",
              },
              {
                Icon: CalendarCheck,
                t: "~30s",
                title: "Books or transfers",
                desc: "Reads your calendar live. Books slot, or warm-transfers a human.",
              },
              {
                Icon: Mail,
                t: "~60s",
                title: "You get the receipt",
                desc: "Transcript, summary, and CRM record before they hang up.",
              },
            ].map((step) => {
              const { Icon } = step;
              return (
                <li key={step.title} className="relative">
                  <div className="w-16 h-16 rounded-full bg-brand text-white flex items-center justify-center mb-5 relative z-10 ring-4 ring-navy-900">
                    <Icon aria-hidden="true" className="w-7 h-7" />
                  </div>
                  <span className="absolute top-1 left-20 text-xs font-mono text-brand-soft tabular-nums">
                    {step.t}
                  </span>
                  <h3 className="font-heading text-lg font-semibold mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {step.desc}
                  </p>
                </li>
              );
            })}
          </ol>

          <p className="text-sm text-white/60 mt-12">
            Want to hear it?{" "}
            <Link
              href="/#assessment"
              className="text-brand-soft hover:text-white underline underline-offset-4"
            >
              Call the live demo
            </Link>{" "}
            &mdash; same stack running on this page&rsquo;s hero.
          </p>
        </div>
      </section>

      <RetroCallPreview />

      {/* Capabilities — full-width numbered editorial rows */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-14 max-w-2xl">
            <span className="section-kicker">What it does</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              What an AI receptionist actually handles
            </h2>
            <p className="text-lg text-muted-foreground">
              Real capabilities, not framework demos. Each of these runs in
              production on client lines today.
            </p>
          </div>

          <ol className="divide-y divide-border border-y border-border">
            {capabilities.map((c, i) => {
              const Icon = c.icon;
              const num = String(i + 1).padStart(2, "0");
              return (
                <li
                  key={c.title}
                  className="grid grid-cols-[auto_1fr] md:grid-cols-[4rem_2.5rem_1fr_2fr] gap-x-5 gap-y-2 py-7 items-start"
                >
                  <span className="font-heading text-3xl font-bold text-brand-soft tabular-nums">
                    {num}
                  </span>
                  <Icon
                    aria-hidden="true"
                    className="w-6 h-6 text-brand mt-2 hidden md:block"
                  />
                  <h3 className="font-heading text-xl font-semibold text-navy-900 col-start-2 md:col-start-3 md:pt-1">
                    {c.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed col-span-2 md:col-span-1 md:col-start-4 md:pt-1.5">
                    {c.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Stack */}
      <section className="py-20 bg-soft">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-12 max-w-2xl">
            <span className="section-kicker">The stack</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              We name our parts. No black boxes.
            </h2>
            <p className="text-lg text-muted-foreground">
              The starter version stays intentionally boring: answer the call,
              collect the lead, route it, and send the summary. When you need
              more control, the same approach can grow into a full custom phone
              stack.
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
      <section className="py-16">
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

      {/* Proof — single outcome, named client */}
      <section className="py-24 bg-soft">
        <div className="max-w-5xl mx-auto px-4">
          <span className="section-kicker">Proof</span>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start mt-3">
            <div className="md:col-span-3">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-navy-900 leading-[1.1] tracking-tight">
                <span className="text-brand">40% more booked appointments</span>{" "}
                at Fix It San Clemente in 90 days.
              </h2>
            </div>
            <aside className="md:col-span-2 space-y-4 text-sm leading-relaxed text-muted-foreground border-t border-border pt-6 md:pt-0 md:border-t-0 md:border-l md:pl-8">
              <p>
                Same AI receptionist stack live on this page&rsquo;s hero
                &mdash; production-deployed since 2025.
              </p>
              <p>
                <span className="font-semibold text-navy-900">
                  Sub-1-second answer time.
                </span>{" "}
                Calls answered before your phone finishes ringing.
              </p>
              <p>
                <span className="font-semibold text-navy-900">
                  100% of inbound calls
                </span>{" "}
                logged with transcript, summary, and CRM record. Nothing slips
                through after-hours.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tiers" className="py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-14 max-w-2xl">
            <span className="section-kicker">Pricing</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              Free pilot. Make the phone ring first.
            </h2>
            <p className="text-lg text-muted-foreground">
              People are struggling. The offer is simple: let us help first.
              If the pilot catches leads and you want to keep it, then we talk
              about a fair monthly plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {tiers.map((t) => (
              <PricingTier key={t.name} {...t} />
            ))}
          </div>

          <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-md bg-white border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock aria-hidden="true" className="w-4 h-4 text-brand" />
                <h4 className="font-heading font-semibold text-navy-900 text-sm">
                  Fast start
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Most starter installs are ready in a few business days once
                the script and forwarding number are confirmed.
              </p>
            </div>
            <div className="p-5 rounded-md bg-white border border-border">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck aria-hidden="true" className="w-4 h-4 text-brand" />
                <h4 className="font-heading font-semibold text-navy-900 text-sm">
                  Simple by default
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Start with call summaries by email or text. Add CRM,
                dashboards, and custom routing only when the calls justify it.
              </p>
            </div>
            <div className="p-5 rounded-md bg-white border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Zap aria-hidden="true" className="w-4 h-4 text-brand" />
                <h4 className="font-heading font-semibold text-navy-900 text-sm">
                  Charge after trust
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No owner should pay before they understand the value. Prove it
                on real calls, then make the monthly math fair.
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
      <section className="py-24">
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
              href="/#assessment"
              className="btn-cta-call inline-flex items-center justify-center gap-2 text-base"
            >
              <Phone aria-hidden="true" className="w-4 h-4" />
              Call the live demo
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
