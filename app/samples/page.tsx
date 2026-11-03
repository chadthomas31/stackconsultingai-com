import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Palette, Phone, LayoutTemplate } from "lucide-react";

import { SAMPLE_SITES } from "@/lib/samples";

export const metadata: Metadata = {
  title: "Sample Websites for Local Businesses | Stack Consulting AI",
  description:
    "See sample websites for auto repair, plumbing, HVAC and golf cart shops, each with a live AI receptionist demo. Every site is custom designed for your business.",
  alternates: { canonical: "https://stackconsultingai.com/samples" },
};

export default function SamplesIndex() {
  return (
    <main className="bg-white">
      <section className="pt-32 pb-12 md:pt-40 border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">Sample websites</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900 max-w-3xl">
            See what your website could look like, then hear your phone answered.
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-2xl">
            These are sample sites for fictional businesses. Yours is designed from scratch around your
            business: your colors, your logo and photos, your layout, your services and your service area.
          </p>
          <div className="mt-8 grid sm:grid-cols-3 gap-4 max-w-4xl">
            {[
              { icon: Palette, title: "Your brand", text: "Colors, fonts, logo and photos chosen with you." },
              { icon: LayoutTemplate, title: "Your layout", text: "Pages and sections built around how your customers buy." },
              { icon: Phone, title: "Your phone answered", text: "Add an AI receptionist that answers in your business name, 24/7." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-slate-200 p-5">
                <Icon className="h-6 w-6 text-orange-600" />
                <p className="mt-3 font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          {SAMPLE_SITES.map((s) => {
            const t = s.themes[0];
            return (
              <Link
                key={s.vertical}
                href={`/samples/${s.vertical}`}
                className="group rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-8 text-white" style={{ background: t.dark }}>
                  <p className="text-sm font-semibold" style={{ color: t.accent }}>{s.industry}</p>
                  <p className="mt-2 text-2xl font-bold">{s.business}</p>
                  <p className="mt-2 text-white/75">{s.heroTitle}</p>
                  <div className="mt-5 flex gap-2">
                    {s.themes.map((th) => (
                      <span
                        key={th.name}
                        className="h-5 w-5 rounded-full border border-white/40"
                        style={{ background: `linear-gradient(135deg, ${th.brand} 50%, ${th.accent} 50%)` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <span className="text-slate-700">View the sample site</span>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-12 text-center">
          <p className="text-slate-600">Don&apos;t see your industry? We build for any local business.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/#contact" className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 font-semibold">
              Get a custom site
            </Link>
            <Link href="/demos" className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">
              Try the AI receptionist demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
