import type { Metadata } from "next";
import CityAiConsultingPage, {
  type CityConfig,
} from "@/components/CityAiConsultingPage";

export const metadata: Metadata = {
  title: "AI Consulting San Clemente | Local AI Consultant for San Clemente Small Businesses | Stack Consulting AI",
  description:
    "Local San Clemente AI consultant. We build voice agents, chatbots, and workflow automations for South OC small businesses. Real local team. Free 30-minute assessment.",
  keywords: [
    "AI consulting San Clemente",
    "AI consultant San Clemente",
    "San Clemente AI agency",
    "South OC AI consulting",
    "San Clemente small business AI",
    "voice AI San Clemente",
    "AI automation San Clemente",
    "local AI consultant Orange County",
  ],
  alternates: {
    canonical:
      "https://stackconsultingai.com/services/ai-consulting-san-clemente",
  },
  openGraph: {
    title: "AI Consulting for Small Businesses in San Clemente",
    description:
      "Local San Clemente AI consultant. Voice agents, chatbots, and automations built in town — not outsourced.",
    url: "https://stackconsultingai.com/services/ai-consulting-san-clemente",
    type: "website",
  },
};

const config: CityConfig = {
  name: "San Clemente",
  slug: "san-clemente",
  cityFlavor:
    "Stack Consulting AI is based in San Clemente. This is our home town, not a target keyword. Our clients here include real local businesses — the kind of shops on Avenida Del Mar, Camino Capistrano, and Rancho San Clemente Business Park. We do meetings in person, we know which coffee shops have decent WiFi, and we can be at your office in 15 minutes if something needs urgent attention.",
  presenceAnswer:
    "Yes. We're literally based in San Clemente. The cell number you'll see for support is a local 949 number. If you want to grab coffee at Bear Coast or HJ Patty's to talk through a project, we're in.",
  localProof:
    "We built a custom booking system + automated follow-ups for Fix It San Clemente that drove appointments up 40% in 90 days. That's a real San Clemente client, not a stock testimonial.",
  neighbors: [
    { name: "Dana Point", slug: "dana-point" },
    { name: "Mission Viejo", slug: "mission-viejo" },
    { name: "Newport Beach", slug: "newport-beach" },
  ],
};

export default function Page() {
  return <CityAiConsultingPage config={config} />;
}
