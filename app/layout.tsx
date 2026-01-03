import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      </head>
      <body className={inter.className}>
        <Analytics />
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}