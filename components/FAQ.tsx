"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const QA = [
  {
    q: "What does a typical engagement look like?",
    a: "Short conversation to understand what's broken. Fixed-price scope we both agree to. Build in 2–6 weeks depending on the size. Warranty period where we fix anything we missed, then it's yours.",
  },
  {
    q: "Do I actually own the code and the domain?",
    a: "Yes. The repo is under your GitHub or ours with admin transfer on day one. Domain stays on your registrar. Deploy runs on your Vercel, not a shared account. We hand over the keys — that's the whole point.",
  },
  {
    q: "What do you charge?",
    a: "Websites start around $3,000 for a clean 4–7 page build. Business automation and AI integrations are scoped per project, usually $2,000–$15,000. Ongoing maintenance is a small monthly retainer. We publish pricing — no games.",
  },
  {
    q: "Is the AI phone-agent stuff production-ready?",
    a: "Yes. The same FreeSWITCH + OpenAI Realtime stack you can call from the hero is deployed for real customers. It books appointments, routes after-hours calls, and can hand off to a human when it gets confused.",
  },
  {
    q: "Who actually does the work?",
    a: "Chad McCluskey, based in Southern California. Not a sales rep routing you to offshore. You talk to the person writing the code and wiring the stack.",
  },
  {
    q: "Can you fix a broken project someone else built?",
    a: "Often, yes. Next.js rescues and WordPress-to-Next migrations are a common ask. We do a short audit first so we can tell you whether fixing is cheaper than rebuilding — sometimes it isn't, and we'll say so.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28 bg-soft">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="section-kicker">FAQ</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-navy-900 mt-2">
            Questions we get a lot.
          </h2>
        </div>

        <div className="divide-y divide-border border-y border-border bg-white rounded-lg">
          {QA.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : i)}
                  aria-expanded={expanded}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full flex items-center justify-between px-6 py-5 text-left group"
                >
                  <span className="text-base md:text-lg font-semibold text-navy-900 pr-6">
                    {item.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                      expanded
                        ? "bg-navy-900 border-navy-900 text-white"
                        : "bg-white border-border text-navy-900 group-hover:border-navy-900/50"
                    }`}
                    aria-hidden="true"
                  >
                    {expanded ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  hidden={!expanded}
                  className="px-6 pb-6 text-muted-foreground text-base leading-relaxed"
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
