import Link from "next/link";
import { Box, Wrench, HeartPulse, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Box,
    title: "1 — We set up the machine",
    body: "A Mac, Windows, or Linux box, configured by us with the AI tools your business actually needs. It arrives working.",
  },
  {
    icon: Wrench,
    title: "2 — Built for your business",
    body: "We wire in the automations and integrations that kill your busywork — answering calls, drafting, research, the recurring tasks you do by hand today.",
  },
  {
    icon: HeartPulse,
    title: "3 — We keep it running",
    body: "We monitor it, update the models and tools, and maintain the automations. You never touch the tech. That's the whole point.",
  },
];

export default function AiOsExplainer({ showCta = false }: { showCta?: boolean }) {
  return (
    <section className="py-24 bg-navy-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-2xl mb-14">
          <span className="section-kicker">What is an AI Operating System?</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mt-3 mb-4 tracking-tight">
            Your business runs on people and software. An AI OS adds a third layer — AI that does the work.
          </h2>
          <p className="text-lg text-white/70">
            One machine we set up and maintain. Like a tireless employee who lives in a box on your desk and never quits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.title} className="rounded-md bg-white/5 border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center mb-5">
                <s.icon aria-hidden="true" className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-white text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        {showCta && (
          <div className="mt-12">
            <Link
              href="/ai-os"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-brand text-white font-medium hover:bg-brand-hover transition-colors"
            >
              See the AI OS tiers
              <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
