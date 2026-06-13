import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import CookieConsent from "@/components/CookieConsent";
import StructuredData from "@/components/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });

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
    // Relative canonical resolves to each page's own URL via metadataBase —
    // a hardcoded absolute URL here would canonicalize every page to the homepage.
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${inter.className}`}>
        <a href="#main-content" className="skip-nav">Skip to main content</a>

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
        <Navbar />
        <div id="main-content">
          <Providers>{children}</Providers>
        </div>
        <Footer />

        {/* Google Analytics 4 */}
        <Script
          id="ga4-script"
          src="https://www.googletagmanager.com/gtag/js?id=G-GKBVKQ49ND"
          strategy="lazyOnload"
        />
        <Script
          id="ga4-config"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-GKBVKQ49ND');`,
          }}
        />

        {/* GTM */}
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

        {/* Chat widget removed 2026-04-21 — GoHighLevel subscription cancelled.
            Previously: GHL chat widget via widgets.leadconnectorhq.com. */}
      </body>
    </html>
  );
}
