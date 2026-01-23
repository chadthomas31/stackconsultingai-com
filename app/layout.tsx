import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Analytics from "@/components/Analytics";
import CookieConsent from "@/components/CookieConsent";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://stackconsultingai.com"),
  title: "Stack Consulting AI | Web Development in South Orange County",
  description: "Professional Next.js, TypeScript, and Supabase web development for small businesses in South Orange County. Modern solutions, proven results.",
  keywords: ["web development", "Next.js", "TypeScript", "Supabase", "Orange County", "small business"],
  authors: [{ name: "Stack Consulting AI" }],
  openGraph: {
    title: "Stack Consulting AI | Modern Web Solutions",
    description: "Professional web development for South Orange County businesses",
    type: "website",
    url: "https://stackconsultingai.com",
    siteName: "Stack Consulting AI",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stack Consulting AI | Modern Web Solutions",
    description: "Professional web development for South Orange County businesses",
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

        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5N9G6XQ4');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5N9G6XQ4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <Analytics />
        <CookieConsent />
        {children}

        {/* ElevenLabs ConvAI Voice Agent */}
        <div
          // Render custom element without JSX typing issues
          dangerouslySetInnerHTML={{
            __html:
              '<elevenlabs-convai agent-id="agent_9101kfg9f05ef038danc3c20ysyd"></elevenlabs-convai>'
          }}
        />
        <Script
          src="https://unpkg.com/@elevenlabs/convai-widget-embed"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}