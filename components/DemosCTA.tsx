import Link from "next/link";
import { ArrowRight, Phone, Bot, BookOpen } from "lucide-react";

const demos = [
  {
    icon: Phone,
    label: "Voice call demo",
    detail: "FreeSWITCH + OpenAI Realtime — call a live AI receptionist",
  },
  {
    icon: Bot,
    label: "Lead-capture agent",
    detail: "Claude with tool-use — watch a lead get qualified and routed",
  },
  {
    icon: BookOpen,
    label: "Knowledge-base Q&A",
    detail: "RAG over real service docs — answers cite the chunk they came from",
  },
];

export default function DemosCTA() {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div className="lg:w-1/2">
            <p className="text-sm font-medium text-accent mb-4 tracking-wide uppercase">
              Live systems
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Try the stack before you hire us
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Three working demos on the same infrastructure we ship for clients:
              call a live AI receptionist, route a lead through Claude Haiku to
              Discord and email, and query our service-doc corpus with cited
              answers. No signup. No mockups.
            </p>
            <Link
              href="/demos"
              className="btn-cta-call group inline-flex items-center gap-2 text-lg"
            >
              Open live demos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform motion-reduce:transition-none" aria-hidden="true" />
            </Link>
          </div>

          {/* Right: Demo list */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-card border border-border rounded-2xl p-8">
              <ul className="space-y-5">
                {demos.map((demo, i) => {
                  const Icon = demo.icon;
                  return (
                    <li
                      key={demo.label}
                      className="flex items-start gap-4 pb-5 border-b border-border last:border-0 last:pb-0"
                    >
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-md bg-soft border border-border shrink-0"
                        aria-hidden="true"
                      >
                        <Icon className="w-5 h-5 text-brand" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-mono text-xs text-brand font-semibold">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-semibold text-navy-900">{demo.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {demo.detail}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="text-xs text-muted-foreground mt-6 text-center">
                Same stack as client deployments — try one in under a minute
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
