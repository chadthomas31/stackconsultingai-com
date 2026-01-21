"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "accepted") {
      // Load analytics if already accepted
      loadAnalytics();
    }
  }, []);

  const loadAnalytics = () => {
    // Dispatch event to load Google Analytics
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
    >
      {/* Backdrop (blocks site interaction) */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Cookie className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">We Value Your Privacy</h3>
              <p className="text-sm text-muted-foreground">
                We use cookies and analytics to improve your experience and understand how visitors interact with our
                site. By clicking <span className="font-medium text-foreground">Accept</span>, you consent to our use of
                Google Analytics.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                You must choose an option to continue.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={handleDecline}
              className="px-5 py-3 rounded-lg border border-border bg-background text-foreground font-semibold hover:bg-secondary/60 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
