import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter Generator | Stack Consulting AI",
  description:
    "Private Stack Report drafting tool for turning video research into newsletter subjects, preheaders, and markdown drafts.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://stackconsultingai.com/tools/newsletter-generator",
  },
};

export default function NewsletterGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
