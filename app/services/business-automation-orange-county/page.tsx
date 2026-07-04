import type { Metadata } from "next";
import VerticalAiServicePage from "@/components/VerticalAiServicePage";
import { verticalAiServices } from "@/lib/vertical-ai-services";

const config = verticalAiServices["business-automation-orange-county"];

export const metadata: Metadata = {
  title: "Business Automation Orange County | Stack Consulting AI",
  description: config.description,
  alternates: {
    canonical: "https://stackconsultingai.com/services/business-automation-orange-county",
  },
  openGraph: {
    title: "Business Automation Orange County",
    description: config.description,
    url: "https://stackconsultingai.com/services/business-automation-orange-county",
    type: "website",
  },
};

export default function Page() {
  return <VerticalAiServicePage config={config} />;
}
