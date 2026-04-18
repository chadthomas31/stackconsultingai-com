"use client";

import { ArrowRight, Phone } from "lucide-react";

export default function FinalCTA() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative rounded-[16px] bg-navy-900 text-white overflow-hidden p-10 md:p-16">
          <div
            aria-hidden="true"
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand/25 blur-3xl"
          />
          <div className="relative max-w-3xl">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-soft">
              Ready when you are
            </span>
            <h2 className="font-heading text-4xl md:text-6xl font-bold mt-3 mb-5 leading-[1.05]">
              Stack smarter. Move faster. Keep the keys.
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl">
              Book a 20-minute call. Bring your current setup. You&apos;ll
              leave with a clear answer on whether we can help — and what it
              would cost.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => scrollTo("contact")}
                className="btn-accent inline-flex items-center gap-2"
              >
                Book a call
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTo("call-me")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Hear the AI IVR first
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
