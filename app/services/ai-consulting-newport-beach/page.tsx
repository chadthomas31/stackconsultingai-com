import type { Metadata } from "next";
import CityAiConsultingPage, {
  type CityConfig,
} from "@/components/CityAiConsultingPage";

export const metadata: Metadata = {
  title: "AI Consulting Newport Beach | Stack Consulting AI",
  description:
    "Founder-led AI consulting in Newport Beach, CA. We build voice agents, chatbots, and automations for professional services, medical, and finance firms. Free assessment.",
  keywords: [
    "AI consulting Newport Beach",
    "AI consultant Newport Beach",
    "AI automation Newport Beach",
    "Newport Beach AI agency",
    "professional services AI Newport Beach",
    "medical practice AI consulting",
    "Newport Beach small business AI",
    "Fashion Island AI consultant",
  ],
  alternates: {
    canonical:
      "https://stackconsultingai.com/services/ai-consulting-newport-beach",
  },
  openGraph: {
    title: "AI Consulting for Small Businesses in Newport Beach",
    description:
      "Voice agents, chatbots, and automations for Newport Beach professional services, medical, and finance firms. Founder writes the code.",
    url: "https://stackconsultingai.com/services/ai-consulting-newport-beach",
    type: "website",
  },
};

const config: CityConfig = {
  name: "Newport Beach",
  slug: "newport-beach",
  cityFlavor:
    "Newport Beach businesses skew toward professional services, medical practices, finance, and high-end real estate. Your client experience is part of your brand, which means a missed call or a slow follow-up costs you more than it costs a generic SMB. AI voice agents that answer in your tone of voice, automated client-onboarding flows, and document automation are usually the highest-ROI starting points.",
  presenceAnswer:
    "We're in South Orange County (San Clemente area), 30 minutes from Newport Beach. We meet Newport Beach clients in person — Fashion Island, Corona del Mar, your office, or somewhere along the harbor. Local team, local time zone, local relationships.",
  localProof:
    "Professional services and medical clients see the fastest wins from AI: speed-to-lead drops from hours to minutes, no-show rates drop with automated reminders, and intake forms route correctly the first time.",
  neighbors: [
    { name: "Costa Mesa", slug: "costa-mesa" },
    { name: "Irvine", slug: "irvine" },
    { name: "Mission Viejo", slug: "mission-viejo" },
  ],
};

export default function Page() {
  return <CityAiConsultingPage config={config} />;
}
