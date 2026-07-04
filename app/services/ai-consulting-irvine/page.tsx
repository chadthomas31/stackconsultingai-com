import type { Metadata } from "next";
import CityAiConsultingPage, {
  type CityConfig,
} from "@/components/CityAiConsultingPage";

export const metadata: Metadata = {
  title: "AI Consulting Irvine | Stack Consulting AI",
  description:
    "Founder-led AI consulting in Irvine, CA. We build voice agents, chatbots, and workflow automations for Irvine small businesses. SoCal team, no offshore. Free assessment.",
  keywords: [
    "AI consulting Irvine",
    "AI consultant Irvine CA",
    "AI automation Irvine",
    "AI agency Irvine",
    "Irvine small business AI",
    "voice AI Irvine",
    "Spectrum Irvine AI consulting",
    "FivePoint Irvine AI consultant",
  ],
  alternates: {
    canonical: "https://stackconsultingai.com/services/ai-consulting-irvine",
  },
  openGraph: {
    title: "AI Consulting for Small Businesses in Irvine",
    description:
      "Voice agents, chatbots, and automations for Irvine small businesses. Founder writes the code. No offshore handoffs.",
    url: "https://stackconsultingai.com/services/ai-consulting-irvine",
    type: "website",
  },
};

const config: CityConfig = {
  name: "Irvine",
  slug: "irvine",
  cityFlavor:
    "Irvine has more SMBs per square mile than just about anywhere else in Orange County — Spectrum, FivePoint, the Quail Hill professional offices, the medical campuses around UCI. Most of these companies are sophisticated enough to know AI is coming, but small enough that the enterprise AI consultancies won't return their calls. That's exactly the gap we exist to fill.",
  presenceAnswer:
    "We're in South OC (San Clemente area), about 25 minutes south of Irvine. We meet Irvine clients in person regularly — your office, our office, or a coffee shop near Spectrum. Same time zone always. No 14-hour overseas response delay.",
  localProof:
    "We've shipped voice agents and automations for Irvine-area service businesses, professional offices, and medical practices. The patterns repeat: replace the answering service, route inbound leads in under 5 minutes, automate the appointment + follow-up dance.",
  neighbors: [
    { name: "Newport Beach", slug: "newport-beach" },
    { name: "Costa Mesa", slug: "costa-mesa" },
    { name: "Mission Viejo", slug: "mission-viejo" },
  ],
};

export default function Page() {
  return <CityAiConsultingPage config={config} />;
}
