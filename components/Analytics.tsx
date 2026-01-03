"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function Analytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "accepted") {
      setHasConsent(true);
    }

    // Listen for consent event
    const handleConsent = () => {
      setHasConsent(true);
    };

    window.addEventListener("cookie-consent-granted", handleConsent);
    return () => window.removeEventListener("cookie-consent-granted", handleConsent);
  }, []);

  if (!hasConsent) return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-JDX92E665H"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JDX92E665H');
        `}
      </Script>
    </>
  );
}
