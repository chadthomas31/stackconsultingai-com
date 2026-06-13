import type { Metadata } from "next";
import CityAiConsultingPage, {
  type CityConfig,
} from "@/components/CityAiConsultingPage";

export const metadata: Metadata = {
  title: "AI Consulting Costa Mesa | Southern California Voice Agents & Automation | Stack Consulting AI",
  description:
    "Founder-led AI consulting in Costa Mesa and across Southern California. We build voice agents, chatbots, and automations for restaurants, retail, and SOCO-area businesses. Free assessment.",
  keywords: [
    "AI consulting Costa Mesa",
    "AI consulting Southern California",
    "AI consultant Costa Mesa",
    "Costa Mesa AI agency",
    "AI automation Costa Mesa",
    "SOCO Costa Mesa AI",
    "restaurant AI consulting",
    "retail AI Costa Mesa",
    "Costa Mesa small business AI",
  ],
  alternates: {
    canonical:
      "https://stackconsultingai.com/services/ai-consulting-costa-mesa",
  },
  openGraph: {
    title: "AI Consulting for Small Businesses in Costa Mesa",
    description:
      "Voice agents, chatbots, and automations for Costa Mesa restaurants, retail, and creative shops. Founder-led, no offshore.",
    url: "https://stackconsultingai.com/services/ai-consulting-costa-mesa",
    type: "website",
  },
};

const config: CityConfig = {
  name: "Costa Mesa",
  slug: "costa-mesa",
  cityFlavor:
    "Costa Mesa is restaurants, retail, design studios, the SOCO and the Lab area, plus a long tail of small services and contractors. These are businesses that live or die on customer experience — answering the phone, taking the reservation, returning the question on Instagram before someone else does. AI voice agents and chatbots are particularly good fits because they cover the after-hours and weekend gap that small teams can't. It's the same pattern we see in AI consulting work across Southern California — the businesses that answer first win the customer.",
  presenceAnswer:
    "We're in South OC (San Clemente area), about 35 minutes from Costa Mesa. We meet Costa Mesa clients in person — your shop, SOCO, the OC Mart Mix, or Triangle Square. Local team, local time zone.",
  neighbors: [
    { name: "Newport Beach", slug: "newport-beach" },
    { name: "Irvine", slug: "irvine" },
    { name: "Mission Viejo", slug: "mission-viejo" },
  ],
};

export default function Page() {
  return <CityAiConsultingPage config={config} />;
}
