import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  PhoneCall,
  Plug,
  Search,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import CallOptions from "@/components/CallOptions";

export type VerticalAiServiceConfig = {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  audience: string;
  proof: string;
  primaryOffer: string;
  pains: string[];
  builds: Array<{
    title: string;
    detail: string;
  }>;
  outcomes: Array<{
    metric: string;
    label: string;
    detail: string;
  }>;
  faqs: Array<{
    q: string;
    a: string;
  }>;
  related: Array<{
    label: string;
    href: string;
  }>;
};

const icons = [PhoneCall, Bot, Workflow, Plug];

export default function VerticalAiServicePage({
  config,
}: {
  config: VerticalAiServiceConfig;
}) {
  const url = `https://stackconsultingai.com/services/${config.slug}`;
  const ldJson = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: config.label,
      description: config.description,
      serviceType: config.label,
      provider: {
        "@type": "LocalBusiness",
        "@id": "https://stackconsultingai.com/#organization",
        name: "Stack Consulting AI",
      },
      areaServed: [
        "Orange County, CA",
        "San Clemente, CA",
        "Southern California",
      ],
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: config.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />

      <section className="relative overflow-hidden bg-soft pt-32 pb-20 px-4">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(15,23,42,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-brand">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/services" className="hover:text-brand">
                  Services
                </Link>
              </li>
              <li>/</li>
              <li className="text-navy-900 font-medium">{config.label}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <span className="section-kicker">{config.eyebrow}</span>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-navy-900 leading-[1.05] mt-4 mb-6">
                {config.title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                {config.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <CallOptions label="Book a fit call" />
                <Link
                  href="/free-ai-site-audit"
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  Get the free audit
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="rounded-md border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-brand text-sm font-semibold mb-4">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                Built for {config.audience}
              </div>
              <h2 className="font-heading text-2xl font-bold text-navy-900 mb-4">
                What the first build should prove
              </h2>
              <ul className="space-y-3">
                {config.pains.map((pain) => (
                  <li key={pain} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{pain}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-md bg-soft p-4 text-sm text-muted-foreground">
                <span className="font-semibold text-navy-900">Proof point:</span>{" "}
                {config.proof}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-10">
            <span className="section-kicker">What we build</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4">
              {config.primaryOffer}
            </h2>
            <p className="text-muted-foreground text-lg">
              We keep the scope practical: one working lead path, one owner for the
              workflow, and enough reporting to see whether it is producing business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.builds.map((item, index) => {
              const Icon = icons[index % icons.length];
              return (
                <div key={item.title} className="rounded-md border border-border bg-card p-6">
                  <Icon className="w-6 h-6 text-brand mb-4" aria-hidden="true" />
                  <h3 className="font-heading text-xl font-semibold text-navy-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-soft">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <div>
              <span className="section-kicker">Measurement</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-4">
                The point is not AI. The point is more qualified conversations.
              </h2>
              <p className="text-muted-foreground text-lg">
                Every page, form, call link, and demo request should show up in GA4
                as a lead signal. The build ships with practical conversion events
                so Search Console traffic can be tied back to sales activity.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {config.outcomes.map((outcome) => (
                <div key={outcome.label} className="rounded-md bg-white border border-border p-5">
                  <div className="font-heading text-3xl font-bold text-brand mb-2">
                    {outcome.metric}
                  </div>
                  <div className="font-semibold text-navy-900 mb-2">{outcome.label}</div>
                  <p className="text-sm text-muted-foreground">{outcome.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-12">
          <div>
            <span className="section-kicker">FAQ</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-3 mb-8">
              Practical answers before you book.
            </h2>
            <div className="space-y-4">
              {config.faqs.map((faq) => (
                <details key={faq.q} className="rounded-md border border-border bg-card p-5">
                  <summary className="cursor-pointer font-semibold text-navy-900">
                    {faq.q}
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
          <aside className="rounded-md bg-navy-900 text-white p-6 h-fit">
            <ClipboardList className="w-6 h-6 text-brand-soft mb-4" aria-hidden="true" />
            <h3 className="font-heading text-2xl font-bold mb-3">
              Start with a short fit check.
            </h3>
            <p className="text-white/75 mb-6">
              Bring your current website, phone flow, booking process, and the
              repetitive work you want gone. We will tell you what is worth building first.
            </p>
            <CallOptions label="Schedule the fit check" variant="navy" />
            <div className="mt-8 pt-6 border-t border-white/15">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-white/70 mb-3">
                Related pages
              </h4>
              <ul className="space-y-2">
                {config.related.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="inline-flex items-center gap-2 text-white hover:text-brand-soft">
                      <Search className="w-4 h-4" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
