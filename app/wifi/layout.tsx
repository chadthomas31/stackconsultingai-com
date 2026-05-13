import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stack Consulting AI — Guest WiFi",
  description: "Connect to Stack Consulting AI guest WiFi.",
  robots: { index: false, follow: false },
};

export default function WifiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
