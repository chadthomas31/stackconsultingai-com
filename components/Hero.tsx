"use client";

import { ArrowRight, Code2, Database, Sparkles } from "lucide-react";

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({ event: "cta_click", cta_text: "Start Your Project" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-slow-reverse"></div>
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-primary/3 rounded-full blur-2xl animate-float-slow" style={{ animationDelay: "2s" }}></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto text-center z-10">
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>8+ Projects Delivered in 2025</span>
        </div>

        {/* Main Heading */}
        <h1 className="animate-fade-in-up animation-delay-100 text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight animate-gradient-text">
          AI Consulting & Web Development for Southern California Businesses
        </h1>

        {/* Subheading */}
        <p className="animate-fade-in-up animation-delay-200 text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          You don&#39;t need more tools. You need a better stack.
          <br />
          Practical AI automation, custom websites, and smarter systems—built for the real world.
        </p>

        {/* Supporting Copy */}
        <div className="animate-fade-in-up animation-delay-300 mb-12 max-w-3xl mx-auto">
          <p className="text-base md:text-lg text-muted-foreground">
            Smarter stacks for growing businesses: clear systems, practical AI, and real ROI—without enterprise
            complexity.
          </p>
        </div>

        {/* CTAs */}
        <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            onClick={scrollToContact}
            className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(34,197,94,0.35)] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/20 animate-pulse-glow"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#portfolio"
            className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 hover:border-primary/30 border border-transparent transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
          >
            View Our Work
          </a>
        </div>

        {/* Tech Stack Icons */}
        <div className="animate-fade-in-up animation-delay-500 flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            <span className="font-medium">Next.js 15</span>
          </div>
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            <span className="font-medium">TypeScript</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            <span className="font-medium">Supabase</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full"></div>
        </div>
      </div>
    </section>
  );
}