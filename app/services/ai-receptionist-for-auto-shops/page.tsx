import type { Metadata } from "next";
import VerticalAiServicePage from "@/components/VerticalAiServicePage";
import { verticalAiServices } from "@/lib/vertical-ai-services";

const config = verticalAiServices["ai-receptionist-for-auto-shops"];

export const metadata: Metadata = {
  title: "AI Receptionist for Auto Shops | Stack Consulting AI",
  description: config.description,
  alternates: {
    canonical: "https://stackconsultingai.com/services/ai-receptionist-for-auto-shops",
  },
  openGraph: {
    title: "AI Receptionist for Auto Shops",
    description: config.description,
    url: "https://stackconsultingai.com/services/ai-receptionist-for-auto-shops",
    type: "website",
  },
};

export default function Page() {
  return <VerticalAiServicePage config={config} />;
}
