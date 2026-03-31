"use client";

import { useState, useEffect } from "react";
import { X, PhoneCall } from "lucide-react";

const DISMISS_KEY = "lead-banner-dismissed";
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export default function LeadBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DURATION_MS) {
      return; // still within 24-hour dismissal window
    }

    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const handleBookCall = () => {
    handleDismiss();
    const contact = document.getElementById("contact");
    if (contact) {
      contact.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 p-3 md:p-4 animate-[slideUp_0.4s_ease-out]"
      role="banner"
      aria-label="Free AI strategy call offer"
    >
      <div className="max-w-4xl mx-auto bg-card/95 backdrop-blur-md border border-primary/30 rounded-xl shadow-2xl shadow-primary/10 px-4 py-3 md:px-6 md:py-4 flex items-center gap-3 md:gap-4">
        {/* Icon - hidden on small mobile */}
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-primary/15 shrink-0">
          <PhoneCall className="w-5 h-5 text-primary" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm md:text-base font-semibold text-foreground leading-tight">
            Get a Free AI Strategy Call
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5 leading-snug">
            See how automation can save your business 10+ hours/week
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleBookCall}
          className="shrink-0 px-4 py-2 md:px-6 md:py-2.5 bg-primary text-primary-foreground rounded-lg text-xs md:text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 whitespace-nowrap"
        >
          Book Free Call
        </button>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
