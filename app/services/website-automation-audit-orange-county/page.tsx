import type { Metadata } from "next";
import VerticalAiServicePage from "@/components/VerticalAiServicePage";
import { verticalAiServices } from "@/lib/vertical-ai-services";

const config = verticalAiServices["website-automation-audit-orange-county"];

export const metadata: Metadata = {
  title: "Website Automation Audit Orange County | Stack Consulting AI",
  description: config.description,
  alternates: {
    canonical: "https://stackconsultingai.com/services/website-automation-audit-orange-county",
  },
  openGraph: {
    title: "Website Automation Audit Orange County",
    description: config.description,
    url: "https://stackconsultingai.com/services/website-automation-audit-orange-county",
    type: "website",
  },
};

export default function Page() {
  return <VerticalAiServicePage config={config} />;
}
