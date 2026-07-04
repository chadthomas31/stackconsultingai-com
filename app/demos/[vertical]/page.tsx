import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { VERTICALS, isVertical, type Vertical } from "@/lib/voice-agents";
import VerticalDemoFunnel from "@/components/demos/VerticalDemoFunnel";
import { COPY } from "./copy";

export const dynamic = "force-static";

interface Params {
  params: Promise<{ vertical: string }>;
}

export function generateStaticParams(): { vertical: Vertical }[] {
  return VERTICALS.map((v) => ({ vertical: v }));
}

const servicePageByVertical: Partial<Record<Vertical, string>> = {
  hvac: "/services/ai-receptionist-for-hvac",
  auto: "/services/ai-receptionist-for-auto-shops",
  medspa: "/services/ai-receptionist-for-medspas",
};

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { vertical } = await params;
  if (!isVertical(vertical)) return { title: "Demo not found" };
  const c = COPY[vertical];
  const title = `${c.displayName} AI Receptionist — Live Demo | Stack Consulting AI`;
  const description =
    `Dial the live demo. Hear an AI receptionist tuned for ${c.displayName.toLowerCase()} ` +
    `shops handle a real call end-to-end. Get a call-report email seconds after you hang up.`;
  return {
    title,
    description,
    alternates: { canonical: `https://stackconsultingai.com/demos/${vertical}` },
    openGraph: {
      title,
      description,
      url: `https://stackconsultingai.com/demos/${vertical}`,
      type: "website",
    },
  };
}

export default async function VerticalDemoPage({ params }: Params) {
  const { vertical } = await params;
  if (!isVertical(vertical)) notFound();
  const c = COPY[vertical];
  const serviceHref =
    servicePageByVertical[vertical] ?? "/services/ai-receptionist-orange-county";

  return (
    <main className="bg-white">
      {/* Hero — light, brand-correct */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 border-b border-border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-soft via-white to-white" />
        <div className="max-w-6xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-navy-900 text-xs font-medium mb-8">
            <span className="live-dot" aria-hidden="true" />
            <span>{c.oneLiner}</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-navy-900 leading-[1.05] md:leading-[1.02] mb-6 max-w-4xl">
            {c.h1}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            {c.subhead}
          </p>

          <div className="text-sm text-navy-900/70 max-w-2xl mb-2">
            <span className="font-medium text-navy-900">Proof:</span>{" "}
            {c.proofLine}
          </div>
        </div>
      </section>

      {/* Funnel + "what it does" — two-column on desktop */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-navy-900 mb-6">
              What the agent does on your demo call
            </h2>
            <ol className="space-y-5">
              {c.agentDoes.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-navy-900 text-white text-sm font-semibold inline-flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-navy-900/85 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-10 p-5 rounded-md border border-border bg-soft">
              <div className="text-xs uppercase tracking-wide text-navy-900/60 font-medium mb-2">
                Why it matters
              </div>
              <p className="text-navy-900/85 leading-relaxed">
                {c.whyItMatters}
              </p>
            </div>

            <div className="mt-6 p-5 rounded-md border border-border bg-white">
              <div className="text-xs uppercase tracking-wide text-navy-900/60 font-medium mb-2">
                Suggested demo script
              </div>
              <p className="text-navy-900/85 leading-relaxed italic">
                {c.bookingScript}
              </p>
            </div>
          </div>

          <div>
            <VerticalDemoFunnel vertical={vertical} displayName={c.displayName} />
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Like what you heard?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Same agent, trained on YOUR services, calendar, and pricing. Live in
            about a week. We run it; you never touch the tools.
          </p>
          <Link
            href={serviceHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-brand text-white font-medium hover:bg-brand-hover transition-colors"
          >
            {c.cta} →
          </Link>
        </div>
      </section>

      {/* JSON-LD Service schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: `${c.displayName} AI Receptionist`,
            provider: {
              "@type": "LocalBusiness",
              "@id": "https://stackconsultingai.com/#organization",
              name: "Stack Consulting AI",
            },
            areaServed: { "@type": "Place", name: "Orange County, California" },
            description: c.subhead,
            url: `https://stackconsultingai.com/demos/${vertical}`,
          }),
        }}
      />
    </main>
  );
}
