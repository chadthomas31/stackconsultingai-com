import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

type Tier = {
  name: string;
  blurb: string;
  setup: string;
  care: string;
  forWho: string;
  features: string[];
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Foundation",
    blurb: "Your first AI machine, configured and supported.",
    setup: "$1,500",
    care: "$199",
    forWho: "Solo & micro businesses",
    features: [
      "Frontier cloud AI (Claude / GPT) configured to your work",
      "Claude Code + Codex installed and ready",
      "Automation runtime with failure alerting",
      "2 starter automations built for you",
      "Email support",
    ],
  },
  {
    name: "Operator",
    blurb: "We run your business's AI day to day.",
    setup: "$3,500",
    care: "$499",
    forWho: "Growing small businesses",
    featured: true,
    features: [
      "Everything in Foundation",
      "Custom automations we build and maintain",
      "Integrations via MCP — Google, QuickBooks, your CRM",
      "Voice receptionist tie-in (FreeSWITCH + OpenAI Realtime)",
      "Priority support + monthly tune-up",
    ],
  },
  {
    name: "Sovereign",
    blurb: "Nothing leaves your building.",
    setup: "$7,500",
    care: "$999",
    forWho: "Law, medical, finance",
    features: [
      "Everything in Operator",
      "Local AI models on the box — data never leaves",
      "Encryption + audit logging",
      "HIPAA-friendly posture",
      "Compliance-ready documentation",
    ],
  },
];

const bodies = [
  { name: "Linux mini", price: "$700" },
  { name: "Windows mini", price: "$1,000" },
  { name: "Mac Mini", price: "$1,400", note: "high-memory build for Sovereign: $2,400" },
];

export default function AiOsTiers() {
  return (
    <section id="tiers" className="py-28">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-14 max-w-2xl">
          <span className="section-kicker">Pricing</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4 tracking-tight">
            Pick a brain. Pick a body.
          </h2>
          <p className="text-lg text-muted-foreground">
            The tier is the brain — what the AI OS can do. The machine is the body — same brain, cheaper body if you want. The monthly Care plan is what keeps it all running.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-md bg-white border p-6 flex flex-col ${
                t.featured ? "border-brand ring-1 ring-brand shadow-[0_8px_30px_rgba(62,106,239,0.12)]" : "border-border"
              }`}
            >
              {t.featured && (
                <span className="self-start text-xs font-medium text-brand bg-brand/10 px-2.5 py-1 rounded-full mb-3">
                  Most popular
                </span>
              )}
              <h3 className="font-heading text-xl font-bold text-navy-900">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{t.blurb}</p>
              <div className="mb-1">
                <span className="font-heading text-3xl font-bold text-navy-900">{t.care}</span>
                <span className="text-muted-foreground text-sm">/mo Care</span>
              </div>
              <p className="text-xs text-muted-foreground mb-5">{t.setup} setup + your machine</p>
              <p className="text-xs font-medium text-navy-900/60 uppercase tracking-wide mb-3">
                {t.forWho}
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-navy-900/80">
                    <Check aria-hidden="true" className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/#contact"
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md font-medium transition-colors ${
                  t.featured
                    ? "bg-brand text-white hover:bg-brand-hover"
                    : "bg-white text-navy-900 border border-border hover:border-navy-900"
                }`}
              >
                Book a fit call
                <ArrowRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Bodies */}
        <div className="mt-12 max-w-4xl">
          <h3 className="font-heading font-semibold text-navy-900 mb-4">The machine (one-time)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bodies.map((b) => (
              <div key={b.name} className="p-5 rounded-md bg-white border border-border">
                <div className="flex items-baseline justify-between">
                  <span className="font-heading font-semibold text-navy-900">{b.name}</span>
                  <span className="text-navy-900 font-medium">{b.price}</span>
                </div>
                {b.note && <p className="text-xs text-muted-foreground mt-1">{b.note}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Office Rebuild add-on */}
        <div className="mt-8 max-w-4xl rounded-md bg-soft border border-border p-6">
          <h3 className="font-heading font-semibold text-navy-900 mb-1">Add-on: Office Rebuild</h3>
          <p className="text-sm text-muted-foreground">
            We rebuild and refresh the PCs already in your office into AI-ready
            machines that talk to your AI OS. $350 per seat, or bundle it into your Care plan.
          </p>
        </div>
      </div>
    </section>
  );
}
