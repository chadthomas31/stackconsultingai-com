import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import CookieConsent from "@/components/CookieConsent";
import LeadBanner from "@/components/LeadBanner";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://stackconsultingai.com"),
  title: "AI Consulting & Web Development | Southern California | Stack Consulting AI",
  description: "AI automation, custom web development, and business process automation for small businesses in Southern California and Orange County. Smarter systems, real ROI. Free consultation.",
  keywords: ["AI consulting", "web development", "business automation", "Southern California", "Orange County", "AI automation", "Next.js", "TypeScript", "small business", "web development Orange County", "AI consulting Southern California", "business process automation"],
  authors: [{ name: "Stack Consulting AI" }],
  openGraph: {
    title: "AI Consulting & Web Development | Southern California | Stack Consulting AI",
    description: "AI automation, custom web development, and business process automation for small businesses in Southern California. Smarter systems, real ROI.",
    type: "website",
    url: "https://stackconsultingai.com",
    siteName: "Stack Consulting AI",
    locale: "en_US",
    images: [{
      url: "https://stackconsultingai.com/og-image.png",
      width: 1200,
      height: 630,
      alt: "Stack Consulting AI - AI Consulting & Web Development in Southern California",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Consulting & Web Development | Southern California",
    description: "AI automation, custom web development, and business process automation for small businesses in Southern California. Smarter systems, real ROI.",
    images: ["https://stackconsultingai.com/og-image.png"],
  },
  alternates: {
    canonical: "https://stackconsultingai.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5N9G6XQ4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <VercelAnalytics />
        <SpeedInsights />
        <CookieConsent />
        <LeadBanner />
        {children}

        {/* GTM - deferred to after first paint to avoid render blocking */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5N9G6XQ4');`,
          }}
        />

        {/* ElevenLabs ConvAI - disabled, replaced by GHL chat widget */}

        {/* GHL Chat Widget */}
        <Script
          id="ghl-chat-widget"
          src="https://widgets.leadconnectorhq.com/loader.js"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="69cc00c67061134043df2d3f"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
