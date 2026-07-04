import type { Metadata } from "next";
import CityAiConsultingPage, {
  type CityConfig,
} from "@/components/CityAiConsultingPage";

export const metadata: Metadata = {
  title: "AI Consulting Mission Viejo | Stack Consulting AI",
  description:
    "Founder-led AI consulting in Mission Viejo and across Orange County. We build voice agents, chatbots, and automations for South OC small businesses. Free 30-minute assessment.",
  keywords: [
    "AI consulting Mission Viejo",
    "AI consulting Orange County",
    "AI consultant Mission Viejo",
    "Mission Viejo AI agency",
    "AI automation Mission Viejo",
    "South OC AI consulting",
    "Mission Viejo small business AI",
    "voice AI Mission Viejo",
    "AI consulting Saddleback",
  ],
  alternates: {
    canonical:
      "https://stackconsultingai.com/services/ai-consulting-mission-viejo",
  },
  openGraph: {
    title: "AI Consulting for Small Businesses in Mission Viejo",
    description:
      "Voice agents, chatbots, and automations for Mission Viejo small businesses. Founder writes the code.",
    url: "https://stackconsultingai.com/services/ai-consulting-mission-viejo",
    type: "website",
  },
};

const config: CityConfig = {
  name: "Mission Viejo",
  slug: "mission-viejo",
  cityFlavor:
    "Mission Viejo is the heart of South OC small business — service-based companies, real estate, legal, accounting, contractors, and the small medical/dental practices clustered around Saddleback Memorial. These are exactly the businesses that benefit most from AI: lots of phone calls, lots of follow-up, lots of repetitive admin. A voice agent and one good automation can free up 10+ hours a week — the most common win we see in AI consulting across Orange County.",
  presenceAnswer:
    "We're in San Clemente, about 15 minutes south of Mission Viejo. We meet clients in person regularly — your office, the Shops at Mission Viejo, or somewhere along Crown Valley. Local team, same area code.",
  neighbors: [
    { name: "San Clemente", slug: "san-clemente" },
    { name: "Irvine", slug: "irvine" },
    { name: "Newport Beach", slug: "newport-beach" },
  ],
};

export default function Page() {
  return <CityAiConsultingPage config={config} />;
}
