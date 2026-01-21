"use client";

import { useState, useEffect } from "react";
import { Cookie, Shield } from "lucide-react";

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
    <>
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Cookie consent"
      >
        <div className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-10 animate-slideUp">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Cookie className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              We Value Your Privacy
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We use cookies and analytics to improve your experience and understand how visitors interact with our site.
              Your data helps us build better solutions for our clients.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Cookie className="w-5 h-5 text-primary" />
              <span>Google Analytics Only</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDecline}
              className="flex-1 px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-semibold text-lg hover:bg-secondary/80 transition-all border-2 border-border"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 border-2 border-primary"
            >
              Accept & Continue
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            By accepting, you agree to our use of cookies for analytics purposes.
          </p>
        </div>
      </div>
    </>
  );
}
