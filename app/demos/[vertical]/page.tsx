import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DemoRegister from "@/components/DemoRegister";
import { VERTICALS, VERTICAL_IDS, type VerticalId } from "@/lib/verticals";

export function generateStaticParams() {
  return VERTICAL_IDS.map((vertical) => ({ vertical }));
}

export async function generateMetadata({ params }: { params: Promise<{ vertical: string }> }): Promise<Metadata> {
  const { vertical } = await params;
  const copy = VERTICALS[vertical as VerticalId];
  if (!copy) return { title: "AI Receptionist Demo" };
  return {
    title: `${copy.label} AI Receptionist — Try It Free | Stack Consulting AI`,
    description: copy.sub,
  };
}

export default async function VerticalDemoPage({ params }: { params: Promise<{ vertical: string }> }) {
  const { vertical } = await params;
  const copy = VERTICALS[vertical as VerticalId];
  if (!copy) notFound();

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-5xl mx-auto px-5 py-12 md:py-20 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left: the pitch */}
        <div className="md:pt-6">
          <span className="inline-block text-sm font-semibold text-brand uppercase tracking-wide mb-3">
            {copy.label} · AI Receptionist
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy-900 leading-tight tracking-tight">
            {copy.headline}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{copy.sub}</p>
          <p className="mt-6 text-navy-900 font-medium border-l-2 border-brand pl-4">{copy.pain}</p>

          <ul className="mt-8 space-y-3 text-slate-700">
            {[
              "Answers every call, 24/7 — nights, weekends, when you're slammed",
              "Books the appointment straight to your calendar",
              "Texts & emails you a full summary of every call",
              "Sounds human — pick your receptionist's voice",
            ].map((b) => (
              <li key={b} className="flex gap-3">
                <span className="text-brand font-bold">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: the register card */}
        <div className="rounded-lg border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 md:p-8 bg-white">
          <h2 className="font-heading text-xl font-bold text-navy-900 mb-1">Hear it answer as your business</h2>
          <p className="text-sm text-slate-500 mb-6">30 seconds to set up. Then call the demo line — it greets as your company.</p>
          <DemoRegister copy={copy} />
        </div>
      </section>
    </main>
  );
}
