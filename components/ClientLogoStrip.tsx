"use client";

const CLIENTS = [
  "Fix It San Clemente",
  "Strategic Sync",
  "Dr. Woods Psychiatry",
  "Tito's Automotive",
  "Elysium Ranch",
  "Mid-Pacific Cleaning",
  "CG ModelTek",
  "AnyFix Chicago",
  "Continental Interior",
  "The Puffery",
  "VenturAI",
];

export default function ClientLogoStrip() {
  const items = [...CLIENTS, ...CLIENTS]; // duplicated for seamless loop
  return (
    <section
      aria-label="Client brands"
      className="py-14 border-y border-border bg-white"
    >
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
          Built for real businesses across Southern California &amp; beyond
        </p>
        <div className="marquee-container overflow-hidden relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent"
          />
          <div className="marquee-track flex gap-12 md:gap-16 whitespace-nowrap">
            {items.map((name, i) => (
              <span
                key={i}
                className="font-heading text-lg md:text-xl font-semibold text-navy-900/60 hover:text-navy-900 transition-colors select-none"
                aria-hidden={i >= CLIENTS.length}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
