import type { Metadata } from "next";
import Link from "next/link";
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
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-soft via-white to-white" />
        <div className="max-w-6xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-navy-900 text-xs font-medium mb-8">
            New from Stack Consulting AI
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-navy-900 leading-[1.05] mb-6 max-w-4xl">
            A managed AI workstation. We run your business&rsquo;s AI — you never touch the tools.
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
            You&rsquo;ve got eight AI tools and a shoebox of logins.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every week there&rsquo;s a new AI tool you&rsquo;re told you need. You sign up, poke at it, and it joins the pile. Nothing is connected, nothing is maintained, and none of it actually runs your business. An AI OS is the opposite: one machine, the right tools, wired together and kept running by us.
          </p>
        </div>
      </section>

      {/* What is an AI OS (reused) */}
      <AiOsExplainer />

      {/* What's inside */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <span className="section-kicker">What&rsquo;s inside</span>
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
            Most businesses are best served by frontier cloud models — better answers, lower cost, nothing to maintain. But if you handle privileged or regulated records, the Sovereign tier runs the models on the machine itself. We already build for privacy-sensitive clients like Dr. Robert Woods&rsquo; psychiatry practice; Sovereign makes that the default.
          </p>
        </div>
      </section>

      {/* Proof */}
      <section className="py-20 bg-soft">
        <div className="max-w-5xl mx-auto px-4">
          <span className="section-kicker">Proof</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-10 tracking-tight">
            We already run this for real businesses.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-md bg-white border border-border">
              <div className="font-heading text-3xl font-bold text-brand mb-1">40%</div>
              <p className="text-sm text-navy-900/80 leading-relaxed">
                More booked appointments at Fix It San Clemente after we put an AI voice agent on their phones.
              </p>
            </div>
            <div className="p-6 rounded-md bg-white border border-border">
              <div className="font-heading text-3xl font-bold text-brand mb-1">24/7</div>
              <p className="text-sm text-navy-900/80 leading-relaxed">
                Our FreeSWITCH + OpenAI Realtime receptionist answers and books calls around the clock for SoCal clients.
              </p>
            </div>
            <div className="p-6 rounded-md bg-white border border-border">
              <div className="font-heading text-3xl font-bold text-brand mb-1">Live</div>
              <p className="text-sm text-navy-900/80 leading-relaxed">
                Try it yourself on the homepage — enter your number and our AI calls you back. The demo is the proof.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy-900 mb-6 tracking-tight">
            Stop collecting AI tools. Start running on one.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Tell us what your week looks like and we&rsquo;ll tell you which tier fits and what we&rsquo;d automate first.
          </p>
          <Link href="/#contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-brand text-white font-medium hover:bg-brand-hover transition-colors">
            Book a fit call <ArrowRight aria-hidden="true" className="w-4 h-4" />
          </Link>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
