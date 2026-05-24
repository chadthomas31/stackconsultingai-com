import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Search,
  Gauge,
  Workflow,
  Phone,
  FileText,
  ShieldCheck,
  Sparkles,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "Free AI Website & Automation Audit for Small Businesses | Stack Consulting AI",
  description:
    "Free AI-powered website + automation audit. We review your site, lead capture, contact forms, phone flow, booking process, and automation opportunities. Plain-English report. No sales pitch. Orange County small businesses welcome.",
  keywords: [
    "free AI site audit",
    "free website audit Orange County",
    "AI automation audit small business",
    "free website automation audit",
    "AI consulting audit",
    "small business website audit",
  ],
  alternates: {
    canonical: "https://stackconsultingai.com/free-ai-site-audit",
  },
  openGraph: {
    title: "Free AI Website & Automation Audit for Small Businesses",
    description:
      "We review your site, contact flow, phone system, and automation gaps. Plain-English report. Built for small business owners — not marketing agencies.",
    url: "https://stackconsultingai.com/free-ai-site-audit",
    type: "website",
  },
};

const SERVICE_URL = "https://stackconsultingai.com/free-ai-site-audit";

const reviewAreas = [
  {
    icon: Gauge,
    title: "Website performance",
    detail:
      "Google PageSpeed score, Core Web Vitals, mobile usability, image bloat, render-blocking JS.",
  },
  {
    icon: Search,
    title: "SEO health",
    detail:
      "Title tags, meta descriptions, schema markup, sitemap, broken links, indexability, local SEO signals.",
  },
  {
    icon: FileText,
    title: "Lead capture flow",
    detail:
      "Contact form friction, form fields, follow-up timing, confirmation messaging, email deliverability.",
  },
  {
    icon: Phone,
    title: "Phone + booking flow",
    detail:
      "What happens when a customer calls after hours. Missed-call text-back. Booking link friction. Voicemail handling.",
  },
  {
    icon: Workflow,
    title: "Automation gaps",
    detail:
      "Where you're manually copy-pasting between tools. Where AI can replace a repetitive task. Where workflows break.",
  },
  {
    icon: ShieldCheck,
    title: "Trust + conversion signals",
    detail:
      "Reviews, social proof, security badges, page hierarchy, CTA clarity, mobile-tap targets.",
  },
];

const deliverables = [
  "Plain-English written report (no PDF jargon)",
  "Prioritized list of fixes — quick wins vs strategic projects",
  "Specific tool recommendations (when relevant)",
  "Estimated time savings or revenue lift per fix",
  "30-minute walkthrough call if you want it (optional)",
];

const noStrings = [
  "No retainer required",
  "No upsell pitch in the report",
  "No marketing-agency speak",
  "No subscription trap",
  "Yours to keep + share with your team",
];

const ldJson = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Free AI Website & Automation Audit",
  serviceType: "Website Audit",
  provider: {
    "@type": "LocalBusiness",
    name: "Stack Consulting AI",
    url: "https://stackconsultingai.com",
    telephone: "+1-949-749-0001",
    email: "hello@stackconsultingai.com",
    areaServed: "Orange County, CA",
  },
  url: SERVICE_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

export default function FreeAiSiteAuditPage() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">Free AI Site Audit</li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Free for Orange County small businesses
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Free AI Website & Automation Audit
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We review your website, lead capture, phone flow, booking process,
            and automation gaps — and tell you in plain English where AI can
            actually move the needle. No agency-speak. No sales pitch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Request my free audit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/tools/site-audit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all"
            >
              Or run the instant version
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            Reports delivered in 48 hours. No credit card. No call required.
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Built for small business owners
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-8">
            Most "free audits" are sales funnels for a $5,000 retainer. This one
            isn't. If you own a small business in Orange County and you're
            wondering whether AI is actually worth the hype for your operation,
            we'll tell you straight.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              "You answer your own phone — or wish someone would",
              "Your contact form has been quiet for too long",
              "You're losing leads after hours and don't know how many",
              "You've heard about AI receptionists and want a real read",
              "You manage bookings through 3 different tools",
              "Your website was built in 2018 and shows it",
            ].map((line) => (
              <div
                key={line}
                className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we review */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            What we review
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewAreas.map(({ icon: Icon, title, detail }) => (
              <div
                key={title}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">What you get back</h2>
            <ul className="space-y-3">
              {deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">What you don't get</h2>
            <ul className="space-y-3">
              {noStrings.map((d) => (
                <li key={d} className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for a straight read?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Send us your website. We'll come back in 48 hours with a written
            audit you can act on.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Request my free audit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+19497490001"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all"
            >
              <Phone className="w-5 h-5" />
              (949) 749-0001
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
