"use client";

import { useState, useEffect } from "react";
import { Cookie, Shield } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "accepted") {
      loadAnalytics();
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
      className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slideUp"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-2xl p-4 md:p-6 flex flex-col sm:flex-row items-center gap-4">
        <Cookie className="w-8 h-8 text-primary shrink-0 hidden sm:block" />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            We use cookies and analytics to improve your experience.
            <span className="hidden md:inline"> Your data helps us build better solutions for our clients.</span>
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-4 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-primary" /> Secure & Private</span>
            <span className="flex items-center gap-1"><Cookie className="w-3 h-3 text-primary" /> Google Analytics Only</span>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-5 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-all border border-border"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
