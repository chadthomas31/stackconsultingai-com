import Link from "next/link";
import {
  ArrowRight,
  Phone,
  PhoneCall,
  Bot,
  Workflow,
  FileText,
  Users,
  Plug,
  CheckCircle2,
  XCircle,
  Search,
  ClipboardList,
  Hammer,
  Rocket,
  MapPin,
} from "lucide-react";

import CallOptions from "@/components/CallOptions";

export type CityNeighbor = {
  name: string;
  slug: string;
};

export type CityConfig = {
  name: string;
  slug: string;
  /** 1–2 sentences describing the local market — SEO-relevant, mentions the city */
  cityFlavor: string;
  /** Short answer to "Are you actually in [city]?" — must be honest */
  presenceAnswer: string;
  /** Optional unique anecdote / proof tied to the city or a nearby client */
  localProof?: string;
  /** 2–4 neighbor cities for crosslinking */
  neighbors: CityNeighbor[];
};

const whatWeBuild = [
  {
    icon: PhoneCall,
    title: "AI Voice Agents",
    description:
      "FreeSWITCH + OpenAI Realtime voice agents that answer your phone, qualify leads, and book appointments 24/7. Same stack live on our hero — call it yourself.",
  },
  {
    icon: Bot,
    title: "AI Chatbots & Assistants",
    description:
      "Custom chat widgets and Slack/Teams bots backed by Claude or GPT, grounded in your data so they actually answer real customer questions, not generic LLM filler.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "n8n, Make, and custom Node services that connect your CRM, calendar, email, and accounting so manual handoffs disappear. Most automations pay for themselves in weeks.",
  },
  {
    icon: FileText,
    title: "Document & Proposal Automation",
    description:
      "Generate proposals, contracts, invoices, and reports from your live data. Pull from Stripe, QuickBooks, Supabase, or Airtable. No more copy-paste.",
  },
  {
    icon: Users,
    title: "CRM & Lead Routing",
    description:
      "Set up Supabase, GoHighLevel, or HubSpot the right way. Auto-route leads, log every call, score by intent. Your team works the right deals first.",
  },
  {
    icon: Plug,
    title: "Custom Integrations",
    description:
      "REST APIs, webhooks, and Zapier-shaped tools we write when no off-the-shelf integration exists. We've connected everything from Twilio to FreeSWITCH to ElevenLabs.",
  },
];

const usVsThem = [
  {
    them: "\u201cWe partner with a development network\u201d (i.e. handed off to an offshore shop)",
    us: "Built in-house in Southern California. Founder writes the code.",
  },
  {
    them: "Account manager + offshore implementer + ticket queue",
    us: "Direct line to Chad. Same person scoping, building, and supporting.",
  },
  {
    them: "Generic AI \u201cstrategy decks\u201d that take 60 days and ship nothing",
    us: "Free assessment in week one, working pilot in 2\u20136 weeks.",
  },
  {
    them: "Vague pricing, retainer locks, monthly minimums",
    us: "Published pricing. Fixed scope. You own the code on day one.",
  },
];

const realResults = [
  {
    metric: "40%",
    label: "More booked appointments",
    detail:
      "Fix It San Clemente shipped a custom booking system + automated follow-ups. Appointments up 40% inside 90 days.",
  },
  {
    metric: "2x",
    label: "Lead volume",
    detail:
      "Strategic Sync rebuilt their site, automation flow, and inbound IVR. Leads doubled within the first quarter.",
  },
  {
    metric: "<5 min",
    label: "Speed-to-lead",
    detail:
      "Inbound forms now trigger an AI follow-up call within 5 minutes. Conversion rates jumped vs. the 24-hour email reply they had before.",
  },
];

const processSteps = [
  {
    icon: Search,
    step: "01",
    title: "Free AI Assessment",
    description:
      "30-minute call. We map your current workflows, find the highest-ROI place to start, and tell you honestly if AI is the right move yet. No pitch deck.",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "Fixed-Price Scope",
    description:
      "We write a one-page scope with deliverables, tools, timeline, and a fixed price. You approve before any code gets written.",
  },
  {
    icon: Hammer,
    step: "03",
    title: "Build & Test",
    description:
      "Most projects ship in 2\u20136 weeks. We build on your stack, test against your real data, and document everything as we go so your team isn't locked out later.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Launch & Hand Over",
    description:
      "Deploy, train your team, monitor for 30 days. Repo and credentials go to you. We stay on a small monthly retainer if you want ongoing support \u2014 not required.",
  },
];

function buildFaqs(city: string, presenceAnswer: string) {
  return [
    {
      q: `Are you actually in ${city}, or just SEO-targeting the city?`,
      a: presenceAnswer,
    },
    {
      q: "Do you outsource to overseas dev teams?",
      a: "No. Chad McCluskey writes the code, scopes the work, and runs the calls. If a project needs a specialist we bring on a known SoCal contractor we trust. We don't have a hidden offshore implementation arm.",
    },
    {
      q: `What does a typical AI project cost for a ${city} small business?`,
      a: "AI integrations and automations are usually $2,000\u2013$15,000 depending on scope. AI voice agents start around $5,000 plus monthly infrastructure. Websites with built-in AI start around $3,000. We publish pricing and quote fixed scopes \u2014 no hourly mystery bills.",
    },
    {
      q: "What's the timeline from first call to live system?",
      a: "Most projects ship in 2\u20136 weeks. The free assessment happens in week one. We agree on scope in week two. Build is the rest. Voice agents tend to be the fastest because we have a known stack \u2014 sometimes live in 10 days.",
    },
    {
      q: "My business feels too small for AI. Are you still a fit?",
      a: "Small businesses are the whole reason we exist. The AI consultancies pitching enterprises ignore companies under 50 employees because the deals are too small for them. We've built voice agents, automations, and AI chatbots for shops with 2\u201320 employees. Most of our clients fit that profile.",
    },
    {
      q: "What AI tools do you use? Am I locked into ChatGPT?",
      a: "We pick the model and platform that fits the job. Claude (Anthropic), GPT (OpenAI), Gemini (Google), open-source models on RunPod \u2014 we've shipped on all of them. We don't have a kickback agreement with any AI vendor, so we recommend what actually works for your data, latency needs, and budget.",
    },
    {
      q: "Will my business data stay private and secure?",
      a: "Yes. We host on your infrastructure (your Supabase, your Vercel, your Twilio, your FreeSWITCH) so the data never sits in our environment. We sign mutual NDAs by default. For sensitive industries we run AI workloads against private models (no third-party training on your data).",
    },
    {
      q: "How is this different from a digital marketing agency?",
      a: "Marketing agencies sell campaigns. We build software. The deliverable is working code that runs your business: a voice agent answering calls, an automation processing leads, a chatbot handling support. We don't run ads, we don't post to your social channels. We make the systems behind the scenes work better.",
    },
  ];
}

export default function CityAiConsultingPage({
  config,
}: {
  config: CityConfig;
}) {
  const { name, slug, cityFlavor, presenceAnswer, localProof, neighbors } =
    config;
  const SERVICE_URL = `https://stackconsultingai.com/services/ai-consulting-${slug}`;
  const faqs = buildFaqs(name, presenceAnswer);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SERVICE_URL}#service`,
    name: `AI Consulting for Small Businesses in ${name}`,
    description: `Founder-led AI consulting, voice agents, chatbots, and workflow automation for small businesses in ${name}, California.`,
    provider: {
      "@type": "LocalBusiness",
      "@id": "https://stackconsultingai.com/#organization",
      name: "Stack Consulting AI",
    },
    areaServed: {
      "@type": "City",
      name,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Orange County, California",
      },
    },
    serviceType: "AI Consulting",
    category: "Business Consulting",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Small Business",
    },
    offers: {
      "@type": "Offer",
      description: `Free 30-minute AI assessment for ${name} small businesses.`,
      priceCurrency: "USD",
      price: "0",
    },
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
        name: "Services",
        item: "https://stackconsultingai.com/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "AI Consulting Orange County",
        item: "https://stackconsultingai.com/services/ai-consulting-orange-county",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `AI Consulting ${name}`,
        item: SERVICE_URL,
      },
    ],
  };

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
            <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <li>
                <Link href="/" className="hover:text-brand transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-brand transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href="/services/ai-consulting-orange-county"
                  className="hover:text-brand transition-colors"
                >
                  Orange County
                </Link>
              </li>
              <li>/</li>
              <li className="text-navy-900 font-medium">{name}</li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-navy-900 text-xs font-medium mb-8">
            <MapPin className="w-3.5 h-3.5 text-brand" />
            <span>{name} · AI Consulting · Founder-led</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-navy-900 leading-[1.05] mb-6 max-w-5xl">
            AI consulting for small businesses{" "}
            <span className="text-brand">in {name}.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed">
            We build voice agents, chatbots, and automations for {name} small
            businesses. Real Southern California team. Founder writes the code.
            No offshore handoffs.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-start mb-10">
            <Link
              href="/#assessment"
              className="btn-cta-call inline-flex items-center gap-2 text-base"
            >
              <Phone className="w-4 h-4" />
              Get your free AI assessment
            </Link>
            <Link
              href="/#contact"
              className="btn-ghost inline-flex items-center gap-2 text-base"
            >
              Talk to Chad
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            10+ Southern California businesses shipping on this stack since 2025.
          </p>
        </div>
      </section>

      {/* City flavor */}
      <section className="py-16 bg-soft">
        <div className="max-w-3xl mx-auto px-4">
          <span className="section-kicker">Why {name}</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-6 tracking-tight">
            What AI consulting actually looks like for {name} small businesses
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            {cityFlavor}
          </p>
          {localProof ? (
            <p className="text-lg text-navy-900 font-semibold leading-relaxed">
              {localProof}
            </p>
          ) : null}
        </div>
      </section>

      {/* What we build */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-kicker">What we build</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              What we actually build for {name} small businesses
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real systems, named tools, shipping in weeks not quarters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeBuild.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group p-6 rounded-md bg-white border border-border hover:border-navy-900/30 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,18,46,0.10)]"
                >
                  <div className="p-2.5 rounded-md bg-brand-soft text-brand w-fit mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-navy-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local builder vs offshore */}
      <section className="py-20 bg-soft">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-kicker">Why local matters</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              Local builder vs. offshore handoff
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What you get with us, vs. what other AI agencies quietly do behind
              the scenes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-md bg-white border border-border">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-heading font-semibold text-navy-900">
                  What other shops do
                </h3>
              </div>
              <ul className="space-y-3">
                {usVsThem.map((row) => (
                  <li
                    key={row.them}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    {row.them}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-md bg-white border-2 border-brand/40">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-brand" />
                <h3 className="font-heading font-semibold text-navy-900">
                  What you get with us
                </h3>
              </div>
              <ul className="space-y-3">
                {usVsThem.map((row) => (
                  <li
                    key={row.us}
                    className="text-sm text-navy-900 leading-relaxed"
                  >
                    {row.us}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Real results */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-kicker">Proof</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              Real SoCal clients. Real numbers.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {realResults.map((r) => (
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

      {/* Process */}
      <section className="py-20 bg-soft">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-kicker">How it works</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              From free assessment to live system in 2&ndash;6 weeks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processSteps.map((s) => {
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
                    <Icon className="w-5 h-5" />
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

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-kicker">FAQ</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
              Questions {name} small businesses ask before hiring us
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

      {/* Nearby cities crosslinks */}
      {neighbors.length ? (
        <section className="py-16 bg-soft">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="section-kicker">Nearby OC cities we serve</span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy-900 mt-3 mb-8 tracking-tight">
              Also serving small businesses in
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {neighbors.map((n) => (
                <Link
                  key={n.slug}
                  href={`/services/ai-consulting-${n.slug}`}
                  className="px-4 py-2 rounded-md bg-white border border-border text-sm font-medium text-navy-900 hover:border-brand/40 hover:text-brand transition-colors"
                >
                  AI consulting in {n.name}
                </Link>
              ))}
              <Link
                href="/services/ai-consulting-orange-county"
                className="px-4 py-2 rounded-md bg-white border border-border text-sm font-medium text-navy-900 hover:border-brand/40 hover:text-brand transition-colors"
              >
                All of Orange County
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy-900 mb-6 tracking-tight">
            Ready to see what AI can actually do for your {name} business?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Free 30-minute AI assessment. We map your workflows, find the
            highest-ROI place to start, and give you an honest answer &mdash; even
            if that answer is &ldquo;not yet.&rdquo;
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/#assessment"
              className="btn-cta-call inline-flex items-center justify-center gap-2 text-base"
            >
              <Phone className="w-4 h-4" />
              Book your free AI assessment
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
