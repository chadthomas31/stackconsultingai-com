"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Shield, BarChart3 } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "accepted") {
      loadAnalytics();
    }
  }, []);

  // Focus the accept button when modal opens
  useEffect(() => {
    if (showBanner) {
      acceptRef.current?.focus();
    }
  }, [showBanner]);

  // Trap focus inside the modal
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      "button, a[href], [tabindex]:not([tabindex='-1'])"
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const loadAnalytics = () => {
    window.dispatchEvent(new Event("cookie-consent-granted"));
  };

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
    loadAnalytics();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      onKeyDown={handleKeyDown}
      ref={dialogRef}
    >
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-8 text-center">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <BarChart3 className="w-7 h-7 text-primary" />
        </div>

        {/* Heading */}
        <h2 className="font-heading text-xl font-bold mb-2">We value your privacy</h2>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          We use analytics to understand how visitors use our site so we can build better experiences. No personal data is sold — ever.
        </p>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-5 mb-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            Secure & Private
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-primary" />
            Analytics Only
          </span>
        </div>

        {/* Buttons — Accept is prominent */}
        <div className="flex flex-col gap-3">
          <button
            ref={acceptRef}
            onClick={handleAccept}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200"
          >
            Accept Analytics
          </button>
          <button
            onClick={handleDecline}
            className="w-full px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            No thanks
          </button>
        </div>

        {/* Legal link */}
        <a
          href="/privacy"
          className="inline-block mt-4 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
