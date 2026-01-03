"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">We Value Your Privacy</h3>
            <p className="text-sm text-muted-foreground">
              We use cookies and analytics to improve your experience and understand how visitors interact with our site.
              By clicking "Accept", you consent to our use of Google Analytics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
