import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import DoodlyVideos from "@/components/DoodlyVideos";
import Testimonials from "@/components/Testimonials";
import VoipIvr from "@/components/VoipIvr";
import PricingCalculator from "@/components/PricingCalculator";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <DoodlyVideos />
      <Testimonials />
      <VoipIvr />
      <PricingCalculator />
      <ContactForm />
      <Footer />
    </main>
  );
}