import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";

import VerticalDemoFunnel from "@/components/demos/VerticalDemoFunnel";
import KbDemo from "@/components/demos/KbDemo";
import LeadAgentDemo from "@/components/demos/LeadAgentDemo";

export const metadata: Metadata = {
  title: "Live AI Demos | Stack Consulting AI",
  description:
    "Working AI systems you can try right now: call a live AI receptionist, query a real document corpus with cited answers, route a lead through Claude Haiku, and try industry-specific receptionists for HVAC, plumbing, auto repair, and medspas. Built on FreeSWITCH, OpenAI Realtime, and Claude.",
  alternates: { canonical: "https://stackconsultingai.com/demos" },
  openGraph: {
    title: "Live AI Demos — Stack Consulting AI",
    description:
      "Three working AI systems. Try them now. Voice, knowledge-base Q&A, lead-capture agent.",
    url: "https://stackconsultingai.com/demos",
    type: "website",
  },
};

export default function DemosPage() {
  return (
    <>

      <main className="bg-white">
        {/* ======================================================
            Hero band
            ====================================================== */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-border">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-soft via-white to-white" />

          <div className="max-w-6xl mx-auto px-4">
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-navy-900 text-xs font-medium mb-8">
              <span className="live-dot" aria-hidden="true" />
              <span>Three live systems · No signup · Real infrastructure</span>
            </div>

            <h1 className="animate-fade-in-up animation-delay-100 font-heading text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-navy-900 leading-[1.05] md:leading-[1.02] mb-6 max-w-4xl">
              Live demos.{" "}
              <span className="text-brand">Real systems.</span>
              <br className="hidden sm:inline" /> Try them now.
            </h1>

            <p className="animate-fade-in-up animation-delay-200 text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              These aren&rsquo;t mockups. Each demo runs the same stack we ship for
              clients — FreeSWITCH for voice, Claude Haiku for lead routing, and
              OpenAI text-embedding-3-small + gpt-4o-mini for KB RAG over 10 real
              service-doc topics. Pick one and try it.
            </p>

            {/* Jump links — asymmetric, left aligned, no card grid */}
            <nav
              aria-label="Demos on this page"
              className="animate-fade-in-up animation-delay-300 grid sm:grid-cols-3 gap-x-8 gap-y-3 max-w-4xl text-sm"
            >
              <a href="#demo-call" className="group flex items-baseline gap-3 py-2 border-t border-border hover:border-navy-900 transition-colors">
                <span className="font-mono text-xs text-brand font-semibold">01</span>
                <span className="text-navy-900 font-medium">Call a live AI receptionist</span>
                <ArrowDown className="w-3.5 h-3.5 text-navy-900/40 group-hover:text-brand group-hover:translate-y-0.5 transition" aria-hidden="true" />
              </a>
              <a href="#demo-lead" className="group flex items-baseline gap-3 py-2 border-t border-border hover:border-navy-900 transition-colors">
                <span className="font-mono text-xs text-brand font-semibold">02</span>
                <span className="text-navy-900 font-medium">Lead-capture agent</span>
                <ArrowDown className="w-3.5 h-3.5 text-navy-900/40 group-hover:text-brand group-hover:translate-y-0.5 transition" aria-hidden="true" />
              </a>
              <a href="#demo-kb" className="group flex items-baseline gap-3 py-2 border-t border-border hover:border-navy-900 transition-colors">
                <span className="font-mono text-xs text-brand font-semibold">03</span>
                <span className="text-navy-900 font-medium">Knowledge-base Q&amp;A</span>
                <ArrowDown className="w-3.5 h-3.5 text-navy-900/40 group-hover:text-brand group-hover:translate-y-0.5 transition" aria-hidden="true" />
              </a>
            </nav>
          </div>
        </section>

        {/* ======================================================
            Demo 01 — Call Me (white bg)
            Layout: 5/7 split. Copy left, interactive right.
            ====================================================== */}
        <section id="demo-call" className="scroll-mt-28 py-20 md:py-28 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <span className="section-kicker">Demo 01 / Voice</span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy-900 tracking-tight mt-3 mb-6 leading-[1.05]">
                Call a real AI receptionist and talk to it yourself.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-md">
                Pick your trade, tell us who you are, and we&rsquo;ll reveal
                our live demo line. Call it from any phone and you&rsquo;re
                talking to an OpenAI Realtime agent running on our FreeSWITCH
                stack — prompted as a small-business receptionist. Ask it
                anything. Hang up when you&rsquo;ve heard enough.
              </p>
              <dl className="text-sm space-y-2 mb-6 max-w-md">
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-navy-900/70">Stack</dt>
                  <dd className="text-navy-900 font-medium">FreeSWITCH + OpenAI Realtime</dd>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-navy-900/70">Availability</dt>
                  <dd className="text-navy-900 font-medium">Answers 24/7</dd>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-navy-900/70">Cost to you</dt>
                  <dd className="text-navy-900 font-medium">Free — just call</dd>
                </div>
              </dl>
              <p className="text-sm text-navy-900/70 max-w-md">
                <strong className="text-navy-900">For your business:</strong>{" "}
                same agent answers your inbound line 24/7, qualifies callers,
                books appointments on your calendar, and emails the transcript.{" "}
                <Link href="/ai-receptionist" className="text-brand font-medium hover:underline">
                  See the AI Receptionist service →
                </Link>
              </p>
            </div>

            <div className="lg:col-span-7">
              <VerticalDemoFunnel />
            </div>
          </div>
        </section>

        {/* ======================================================
            Demo 02 — Lead-capture agent (soft grey bg, reversed)
            ====================================================== */}
        <section id="demo-lead" className="scroll-mt-28 py-20 md:py-28 bg-soft border-b border-border">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <LeadAgentDemo />
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-32 order-1 lg:order-2">
              <span className="section-kicker">Demo 02 / Automation</span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy-900 tracking-tight mt-3 mb-6 leading-[1.05]">
                Submit a fake lead. Watch the agent route it.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-md">
                The most boring AI use case is also the highest ROI:
                a form gets filled, an agent reads it, summarizes it,
                pulls out the qualifying signal, and notifies the owner.
                This live demo posts to Discord and email — production
                deployments swap in Slack, GoHighLevel, or your CRM.
              </p>
              <dl className="text-sm space-y-2 mb-6 max-w-md">
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-navy-900/70">Stack</dt>
                  <dd className="text-navy-900 font-medium">Claude Haiku 4.5 + webhooks</dd>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-navy-900/70">Latency</dt>
                  <dd className="text-navy-900 font-medium">~1.2s end-to-end</dd>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-navy-900/70">Triggers</dt>
                  <dd className="text-navy-900 font-medium">Discord · Email</dd>
                </div>
              </dl>
              <p className="text-sm text-navy-900/70 max-w-md">
                <strong className="text-navy-900">For your business:</strong>{" "}
                stop reading every contact-form submission. Get only the
                ones that matter, with the answer already drafted.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================
            Demo 03 — KB Q&A (white bg)
            ====================================================== */}
        <section id="demo-kb" className="scroll-mt-28 py-20 md:py-28 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <span className="section-kicker">Demo 03 / Retrieval</span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy-900 tracking-tight mt-3 mb-6 leading-[1.05]">
                Ask questions of a real document. Get cited answers.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-md">
                We pre-loaded a sample knowledge base. Ask anything from it.
                The agent retrieves the relevant chunks, cites them,
                and refuses to answer when the source doesn&rsquo;t support it —
                the part most consumer chatbots skip.
              </p>
              <dl className="text-sm space-y-2 mb-6 max-w-md">
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-navy-900/70">Stack</dt>
                  <dd className="text-navy-900 font-medium">OpenAI embeddings + gpt-4o-mini</dd>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-navy-900/70">Embeddings</dt>
                  <dd className="text-navy-900 font-medium">text-embedding-3-small</dd>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-navy-900/70">Source</dt>
                  <dd className="text-navy-900 font-medium">10 real service-doc topics</dd>
                </div>
              </dl>
              <p className="text-sm text-navy-900/70 max-w-md">
                <strong className="text-navy-900">For your business:</strong>{" "}
                point the same pipeline at your SOPs, contracts, or
                product docs. Your team asks; it answers — with receipts.
              </p>
            </div>

            <div className="lg:col-span-7">
              <KbDemo />
            </div>
          </div>
        </section>

        {/* ======================================================
            Closer
            ====================================================== */}
        <section className="bg-navy-900 text-white py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4">
            <p className="section-kicker text-brand-soft">Next step</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mt-3 mb-6 leading-[1.05]">
              Want one of these wired into <span className="text-brand">your</span> business?
            </h2>
            <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-2xl">
              Each demo above is roughly a 1- to 3-week build for a single
              business. Tell us your phone number, your CRM, and the
              question your customers ask twelve times a day — we&rsquo;ll
              quote a stack.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/#contact" className="btn-cta-call inline-flex items-center gap-2">
                Talk to Chad
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link href="/ai-receptionist" className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/30 text-white/90 hover:bg-white/5 hover:border-white/60 transition font-medium">
                Pricing for AI Receptionist
              </Link>
            </div>
          </div>
        </section>
      </main>

    </>
  );
}
