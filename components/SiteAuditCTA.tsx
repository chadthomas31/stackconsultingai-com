import { ArrowRight, BarChart3, Zap, Search, Shield } from "lucide-react";
import Link from "next/link";

const checks = [
  { icon: Zap, label: "Performance" },
  { icon: Search, label: "SEO" },
  { icon: Shield, label: "Accessibility" },
  { icon: BarChart3, label: "Best Practices" },
];

export default function SiteAuditCTA() {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div className="lg:w-1/2">
            <p className="text-sm font-medium text-accent mb-4 tracking-wide uppercase">
              Free Tool
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              How does your website score?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Get a free, instant audit powered by Google Lighthouse. See exactly where your site stands on performance, SEO, accessibility, and more.
            </p>
            <Link
              href="/tools/site-audit"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all duration-200"
            >
              Run Free Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Visual preview */}
          <div className="lg:w-1/2">
            <div className="bg-card border border-border rounded-2xl p-8">
              {/* Mock grade */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={2 * Math.PI * 42 * (1 - 0.85)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-3xl font-bold text-primary">B+</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Overall Score</div>
                  <div className="text-2xl font-bold">85 / 100</div>
                  <div className="text-xs text-muted-foreground mt-1">Powered by Google Lighthouse</div>
                </div>
              </div>

              {/* Category bars */}
              <div className="space-y-4">
                {checks.map((check, i) => {
                  const Icon = check.icon;
                  const scores = [72, 95, 90, 100];
                  const score = scores[i];
                  const color = score >= 90 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span>{check.label}</span>
                        </div>
                        <span className="text-sm font-semibold">{score}</span>
                      </div>
                      <div className="h-2 rounded-full bg-border overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground mt-6 text-center">
                Sample audit result — run yours free in 15 seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
