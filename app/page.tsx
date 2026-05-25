import AnnouncementBar from "@/components/AnnouncementBar";
import Hero from "@/components/Hero";
import ClientLogoStrip from "@/components/ClientLogoStrip";
import FreeAssessmentOffer from "@/components/FreeAssessmentOffer";
import FoundingClientSpecial, {
  LAUNCH_PARTNER_SLOTS_REMAINING,
  LAUNCH_PARTNER_TOTAL_SLOTS,
} from "@/components/FoundingClientSpecial";
import StackComparison from "@/components/StackComparison";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import SiteAuditCTA from "@/components/SiteAuditCTA";
import Newsletter from "@/components/Newsletter";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import FinalCTA from "@/components/FinalCTA";
import AiOsTeaser from "@/components/AiOsTeaser";

// Homepage section order per CLAUDE.md → Section Canon
export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <AnnouncementBar
        slotsRemaining={LAUNCH_PARTNER_SLOTS_REMAINING}
        totalSlots={LAUNCH_PARTNER_TOTAL_SLOTS}
      />
      <Hero />
      <ClientLogoStrip />
      <FreeAssessmentOffer />
      <FoundingClientSpecial />
      <StackComparison />
      <AiOsTeaser />
      <Services />
      <Portfolio />
      <Testimonials />
      <SiteAuditCTA />
      <Newsletter />
      <FAQ />
      <ContactForm />
      <FinalCTA />
    </main>
  );
}
