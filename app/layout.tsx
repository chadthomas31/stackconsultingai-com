import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stack Consulting AI | Web Development in South Orange County",
  description: "Professional Next.js, TypeScript, and Supabase web development for small businesses in South Orange County. Modern solutions, proven results.",
  keywords: ["web development", "Next.js", "TypeScript", "Supabase", "Orange County", "small business"],
  authors: [{ name: "Stack Consulting AI" }],
  openGraph: {
    title: "Stack Consulting AI | Modern Web Solutions",
    description: "Professional web development for South Orange County businesses",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}