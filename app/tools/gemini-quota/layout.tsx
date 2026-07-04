import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gemini Key Check | Stack Consulting AI",
  robots: { index: false, follow: true },
};

export default function GeminiQuotaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
