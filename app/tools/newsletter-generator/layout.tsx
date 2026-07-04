import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter Generator | Stack Consulting AI",
  robots: { index: false, follow: true },
};

export default function NewsletterGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
