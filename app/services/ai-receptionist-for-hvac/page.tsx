import type { Metadata } from "next";
import VerticalAiServicePage from "@/components/VerticalAiServicePage";
import { verticalAiServices } from "@/lib/vertical-ai-services";

const config = verticalAiServices["ai-receptionist-for-hvac"];

export const metadata: Metadata = {
  title: "AI Receptionist for HVAC Companies | Stack Consulting AI",
  description: config.description,
  alternates: {
    canonical: "https://stackconsultingai.com/services/ai-receptionist-for-hvac",
  },
  openGraph: {
    title: "AI Receptionist for HVAC Companies",
    description: config.description,
    url: "https://stackconsultingai.com/services/ai-receptionist-for-hvac",
    type: "website",
  },
};

export default function Page() {
  return <VerticalAiServicePage config={config} />;
}
