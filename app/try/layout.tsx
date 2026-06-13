import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Try Our AI Receptionist Live | Stack Consulting AI",
  description:
    "Call a live AI receptionist demo trained for auto repair, plumbing, HVAC, or med spa. Hear exactly what your callers would hear — no signup required.",
  alternates: { canonical: "https://stackconsultingai.com/try" },
};

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
