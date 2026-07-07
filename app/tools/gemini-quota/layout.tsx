import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gemini Key Check | Stack Consulting AI",
  description:
    "Private admin utility for checking Gemini API key access, model availability, quota status, and billing errors.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://stackconsultingai.com/tools/gemini-quota" },
};

export default function GeminiQuotaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
