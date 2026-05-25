import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Compact homepage teaser linking to the full /ai-os page.
// The full explainer + tiers live on /ai-os; the homepage just points there.
export default function AiOsTeaser() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-md border border-border bg-soft p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex-1">
            <span className="section-kicker">New offering</span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy-900 mt-3 mb-2 tracking-tight">
              Meet the Stack AI OS
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              A managed AI workstation — one machine we set up with the AI tools and automations your business needs, then keep running. Three tiers, from a starter box to a private on-premise build for law, medical, and finance.
            </p>
          </div>
          <Link
            href="/ai-os"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-brand text-white font-medium hover:bg-brand-hover transition-colors"
          >
            Explore the AI OS
            <ArrowRight aria-hidden="true" className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
