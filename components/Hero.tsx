"use client";

import { ArrowRight, Phone } from "lucide-react";

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({ event: "cta_click", cta_text: id });
    }
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Soft backdrop — no orbs per CLAUDE.md */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-soft via-white to-white" />

      <div className="max-w-6xl mx-auto px-4">
        {/* Kicker pill */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-navy-900 text-xs font-medium mb-8">
          <span className="live-dot" aria-hidden="true" />
          <span>AI Consulting &amp; Web Dev · Southern California</span>
        </div>

        {/* Headline — left-aligned, builder voice, no animated gradient per CLAUDE.md */}
        <h1 className="animate-fade-in-up animation-delay-100 font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-navy-900 leading-[1.05] md:leading-[1.02] mb-6 max-w-5xl">
          You don&rsquo;t need more AI tools.
          <br className="hidden sm:inline" />{" "}
          You need a <span className="text-brand">better stack.</span>
        </h1>

        {/* Subhead — concrete, builder voice */}
        <p className="animate-fade-in-up animation-delay-200 text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Practical AI automation, custom websites, and FreeSWITCH voice agents
          — built cleanly for small businesses that want systems their team
          will actually use.
        </p>

        {/* CTAs — primary is "try the demo" per CLAUDE.md conversion hierarchy */}
        <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row gap-3 items-start mb-14">
          <button
            onClick={() => scrollTo("assessment")}
            className="btn-accent inline-flex items-center gap-2 text-base"
          >
            <Phone className="w-4 h-4" />
            Get your free AI assessment
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="btn-ghost inline-flex items-center gap-2 text-base"
          >
            Talk to an AI expert
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Proof line */}
        <p className="animate-fade-in animation-delay-500 text-sm text-muted-foreground">
          10+ Southern California businesses shipping on this stack since 2025.
        </p>
      </div>
    </section>
  );
}
