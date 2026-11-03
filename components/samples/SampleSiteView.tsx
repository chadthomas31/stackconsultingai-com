"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Battery,
  Car,
  Droplet,
  Flame,
  Gauge,
  Hammer,
  MapPin,
  Palette,
  Phone,
  Shield,
  Snowflake,
  Sparkles,
  Star,
  Thermometer,
  Truck,
  Wind,
  Wrench,
  Zap,
  Clock,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

import type { SampleIcon, SampleSite } from "@/lib/samples";

const ICONS: Record<SampleIcon, LucideIcon> = {
  wrench: Wrench,
  gauge: Gauge,
  car: Car,
  battery: Battery,
  droplet: Droplet,
  flame: Flame,
  snowflake: Snowflake,
  wind: Wind,
  thermometer: Thermometer,
  shield: Shield,
  truck: Truck,
  zap: Zap,
  sparkles: Sparkles,
  hammer: Hammer,
};

/** Two layouts so prospects see that layout is custom too, not just color. */
type LayoutStyle = "split" | "centered";

export default function SampleSiteView({ site }: { site: SampleSite }) {
  const [themeIdx, setThemeIdx] = useState(0);
  const [layout, setLayout] = useState<LayoutStyle>("split");
  const t = site.themes[themeIdx];
  const demoHref = `/demos/${site.vertical}`;

  const vars = {
    "--brand": t.brand,
    "--dark": t.dark,
    "--tint": t.tint,
    "--accent": t.accent,
  } as React.CSSProperties;

  return (
    <div style={vars} className="min-h-screen bg-white text-slate-800">
      {/* Stack sample banner: always visible */}
      <div className="sticky top-0 z-50 bg-slate-950 text-white text-sm">
        <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <p>
            <span className="font-semibold">Sample website by Stack Consulting AI.</span>{" "}
            <span className="text-slate-300">
              {site.business} is a fictional business. Your site is designed around your brand.
            </span>
          </p>
          <div className="flex items-center gap-3">
            <Link href="/samples" className="text-slate-300 hover:text-white underline underline-offset-2">
              All samples
            </Link>
            <Link
              href="/#contact"
              className="rounded-md bg-orange-500 hover:bg-orange-600 px-3 py-1 font-semibold"
            >
              Get a site like this
            </Link>
          </div>
        </div>
      </div>

      {/* Business header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-bold" style={{ color: "var(--brand)" }}>
              {site.business}
            </p>
            <p className="text-xs text-slate-500">{site.industry} · {site.city}</p>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#services" className="hover:text-slate-900">Services</a>
            <a href="#why" className="hover:text-slate-900">Why us</a>
            <a href="#reviews" className="hover:text-slate-900">Reviews</a>
          </nav>
          <Link
            href={demoHref}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--brand)" }}
          >
            <Phone className="h-4 w-4" /> Call us
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: "var(--dark)" }} className="text-white">
        <div
          className={
            layout === "split"
              ? "max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center"
              : "max-w-3xl mx-auto px-4 py-16 md:py-24 text-center"
          }
        >
          <div>
            <p className="text-sm uppercase tracking-wider font-semibold" style={{ color: "var(--accent)" }}>
              {site.tagline}
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight">{site.heroTitle}</h1>
            <p className="mt-5 text-lg text-white/80">{site.heroText}</p>
            <div className={`mt-8 flex flex-wrap gap-3 ${layout === "centered" ? "justify-center" : ""}`}>
              <Link
                href={demoHref}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white"
                style={{ background: "var(--brand)", boxShadow: "0 0 0 2px rgba(255,255,255,.15)" }}
              >
                <Phone className="h-5 w-5" /> Call now, we answer 24/7
              </Link>
              <a
                href="#services"
                className="inline-flex items-center rounded-lg px-6 py-3 font-semibold border border-white/30 hover:bg-white/10"
              >
                See services
              </a>
            </div>
            <ul className={`mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80 ${layout === "centered" ? "justify-center" : ""}`}>
              {site.badges.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" style={{ color: "var(--accent)" }} /> {b}
                </li>
              ))}
            </ul>
          </div>

          {layout === "split" && (
            <div className="rounded-2xl bg-white text-slate-800 p-6 shadow-xl">
              <p className="font-semibold text-lg">Request service</p>
              <p className="text-sm text-slate-500 mt-1">Sample form. On your site this goes straight to your inbox or CRM.</p>
              <div className="mt-4 space-y-3">
                {["Your name", "Phone", "What do you need help with?"].map((label) => (
                  <div key={label}>
                    <label className="text-xs font-medium text-slate-500">{label}</label>
                    <div className="mt-1 h-10 rounded-md border border-slate-200 bg-slate-50" />
                  </div>
                ))}
                <Link
                  href={demoHref}
                  className="block text-center rounded-md py-2.5 font-semibold text-white"
                  style={{ background: "var(--brand)" }}
                >
                  Or call and talk to {site.agent} now
                </Link>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 text-sm text-slate-600 space-y-1">
                <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> {site.hours}</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {site.city}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">What we do</h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {site.services.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <div key={s.title} className="rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="h-11 w-11 rounded-lg flex items-center justify-center" style={{ background: "var(--tint)" }}>
                    <Icon className="h-6 w-6" style={{ color: "var(--brand)" }} />
                  </div>
                  <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
                  <p className="mt-2 text-slate-600">{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why" className="py-16 md:py-20" style={{ background: "var(--tint)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">Why customers pick {site.business}</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {site.why.map((w) => (
              <div key={w.title} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-lg" style={{ color: "var(--brand)" }}>{w.title}</h3>
                <p className="mt-2 text-slate-600">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews (clearly marked as sample text) */}
      <section id="reviews" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">What customers say</h2>
          <p className="text-center text-sm text-slate-500 mt-2">
            Sample reviews for illustration. Your site shows your real Google reviews.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {site.reviews.map((r, i) => (
              <figure key={i} className="rounded-xl border border-slate-200 p-6">
                <div className="flex gap-0.5" aria-hidden>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" style={{ color: "var(--accent)" }} />
                  ))}
                </div>
                <blockquote className="mt-3 text-slate-700">&ldquo;{r.text}&rdquo;</blockquote>
                <figcaption className="mt-3 text-sm text-slate-500">{r.name} (sample)</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Call CTA → the live AI receptionist demo */}
      <section style={{ background: "var(--dark)" }} className="text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Call {site.business}. {site.agent} picks up.</h2>
          <p className="mt-4 text-white/80">
            This shop&apos;s phone is answered by a Stack Consulting AI receptionist. Try it: register at
            the demo page, then call and say something like:
          </p>
          <p className="mt-4 italic text-lg">&ldquo;{site.tryLine}&rdquo;</p>
          <Link
            href={demoHref}
            className="mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white"
            style={{ background: "var(--brand)", boxShadow: "0 0 0 2px rgba(255,255,255,.2)" }}
          >
            <Phone className="h-5 w-5" /> Hear the AI receptionist
          </Link>
        </div>
      </section>

      {/* Business footer */}
      <footer className="border-t border-slate-200 py-8 text-sm text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-between gap-4">
          <p>
            © {site.business} (sample) · {site.city}
          </p>
          <p>
            Website and AI receptionist by{" "}
            <Link href="/" className="font-semibold text-slate-700 hover:underline">
              Stack Consulting AI
            </Link>
          </p>
        </div>
      </footer>

      {/* Customize panel: shows prospects that colors and layout are theirs to choose */}
      <div className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-xs rounded-xl bg-white shadow-2xl border border-slate-200 p-4">
        <p className="flex items-center gap-2 font-semibold text-slate-900">
          <Palette className="h-4 w-4" /> Make it yours
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Every Stack site is custom designed: your colors, logo, photos, layout and services. Try it:
        </p>
        <div className="mt-3 flex gap-2">
          {site.themes.map((th, i) => (
            <button
              key={th.name}
              type="button"
              onClick={() => setThemeIdx(i)}
              title={th.name}
              aria-label={`Color theme: ${th.name}`}
              aria-pressed={i === themeIdx}
              className={`h-8 w-8 rounded-full border-2 ${i === themeIdx ? "border-slate-900" : "border-white shadow"}`}
              style={{ background: `linear-gradient(135deg, ${th.brand} 50%, ${th.accent} 50%)` }}
            />
          ))}
        </div>
        <div className="mt-3 flex gap-2 text-xs">
          {(["split", "centered"] as LayoutStyle[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLayout(l)}
              aria-pressed={layout === l}
              className={`rounded-md px-3 py-1 border ${layout === l ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-700"}`}
            >
              {l === "split" ? "Layout A" : "Layout B"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
