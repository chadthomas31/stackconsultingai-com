import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClientLogoStrip from "@/components/ClientLogoStrip";
import FreeAssessmentOffer from "@/components/FreeAssessmentOffer";
import FoundingClientSpecial from "@/components/FoundingClientSpecial";
import StackComparison from "@/components/StackComparison";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import SiteAuditCTA from "@/components/SiteAuditCTA";
import Newsletter from "@/components/Newsletter";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

// Homepage section order per CLAUDE.md → Section Canon
export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navbar />
      <Hero />
      <ClientLogoStrip />
      <FreeAssessmentOffer />
      <FoundingClientSpecial />
      <StackComparison />
      <Services />
      <Portfolio />
      <Testimonials />
      <SiteAuditCTA />
      <Newsletter />
      <FAQ />
      <ContactForm />
      <FinalCTA />
      <Footer />
    </main>
  );
}
