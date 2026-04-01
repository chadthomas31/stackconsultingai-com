"use client";

import { ArrowRight } from "lucide-react";

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({ event: "cta_click", cta_text: "Start Your Project" });
    }
  };

  return (
    <section className="relative flex items-center px-4 py-32 md:py-40 overflow-hidden">
      {/* Subtle background — single gradient, no orbs */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background"></div>

      {/* Content — left-aligned, dramatic scale */}
      <div className="relative max-w-6xl mx-auto w-full z-10">
        <p className="animate-fade-in-up text-sm font-medium text-primary tracking-wide uppercase mb-6">
          AI Consulting &middot; Southern California
        </p>

        <h1 className="animate-fade-in-up animation-delay-100 font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[1.05] tracking-tight mb-8 max-w-5xl">
          You don&rsquo;t need more tools.
          <br />
          You need a <span className="text-accent">better stack.</span>
        </h1>

        <p className="animate-fade-in-up animation-delay-200 text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
          Practical AI automation, custom websites, and smarter systems for growing businesses — built for the real world, not the demo.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row gap-4 items-start">
          <button
            onClick={scrollToContact}
            className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-2"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#portfolio"
            className="px-8 py-4 text-muted-foreground font-semibold text-lg hover:text-foreground transition-colors duration-200"
          >
            View Our Work
          </a>
        </div>
      </div>
    </section>
  );
}
