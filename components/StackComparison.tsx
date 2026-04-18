"use client";

import { Check, X } from "lucide-react";

const ROWS = [
  {
    area: "AI tools",
    before: "A new subscription every week, nobody uses any of them.",
    after: "One or two tools, wired into what your team already does.",
  },
  {
    area: "Website",
    before: "WordPress + 47 plugins, broken on mobile, slow.",
    after: "Next.js + Vercel. Fast, SEO-clean, edits take minutes.",
  },
  {
    area: "Phone system",
    before: "Press 1 to wait 12 minutes for the wrong department.",
    after: "AI IVR that books appointments and only pages you when it matters.",
  },
  {
    area: "Workflow",
    before: "Copy-paste between 6 apps, spreadsheet for the rest.",
    after: "Supabase + scripts. The copy-paste job just stops existing.",
  },
  {
    area: "Ownership",
    before: "Agency holds the keys, $400 to change a phone number.",
    after: "You own the repo, the domain, and the deploy. We hand you the keys.",
  },
];

export default function StackComparison() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="section-kicker">Built to replace</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-navy-900 mt-2 mb-4">
            What a bad stack looks like. And what a good one does instead.
          </h2>
          <p className="text-lg text-muted-foreground">
            We don&apos;t sell AI for the sake of AI. We replace the parts of
            your stack that are actively costing you time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="soft-card p-8">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
              <X className="w-4 h-4 text-red-500" />
              What you probably have
            </div>
            <ul className="space-y-5">
              {ROWS.map((r) => (
                <li key={r.area}>
                  <div className="text-xs font-semibold text-navy-900/60 uppercase tracking-widest mb-1">
                    {r.area}
                  </div>
                  <div className="text-navy-900/80">{r.before}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-[10px] bg-navy-900 text-white shadow-xl">
            <div className="text-sm font-semibold text-brand-soft uppercase tracking-wider mb-6 flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-soft" />
              What Stack Consulting AI builds
            </div>
            <ul className="space-y-5">
              {ROWS.map((r) => (
                <li key={r.area}>
                  <div className="text-xs font-semibold text-brand-soft/80 uppercase tracking-widest mb-1">
                    {r.area}
                  </div>
                  <div>{r.after}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
