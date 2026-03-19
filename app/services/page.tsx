import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Code2, Zap, ShoppingCart, Wrench, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Consulting & Web Development Services | Southern California | Stack Consulting AI",
  description:
    "Full-service AI consulting, custom web development, business automation, e-commerce, and website maintenance for small businesses in Southern California and Orange County.",
  keywords: [
    "AI consulting services Southern California",
    "web development services Orange County",
    "business automation consulting",
    "e-commerce development",
    "website maintenance",
    "small business technology services",
  ],
  alternates: {
    canonical: "https://stackconsultingai.com/services",
  },
  openGraph: {
    title: "AI Consulting & Web Development Services | Stack Consulting AI",
    description:
      "Full-service AI consulting, custom web development, business automation, e-commerce, and website maintenance for small businesses in Southern California.",
    url: "https://stackconsultingai.com/services",
    type: "website",
  },
};

const services = [
  {
    icon: Code2,
    title: "Custom Web Development",
    description:
      "High-performance Next.js applications built with TypeScript and modern best practices. Fast, scalable, SEO-optimized websites that convert visitors into customers.",
    href: "/services/web-development",
    highlights: ["Next.js & React", "TypeScript", "Tailwind CSS", "Supabase"],
  },
  {
    icon: Zap,
    title: "Business Automation & AI",
    description:
      "Streamline your operations with intelligent workflow automation, CRM integrations, and AI-powered tools that save hours every week and reduce costly errors.",
    href: "/services/business-automation",
    highlights: ["Workflow Automation", "CRM Integration", "AI Tools", "Data Pipelines"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    description:
      "Complete online store solutions with secure payment processing, inventory management, and customer portals designed to maximize revenue and streamline fulfillment.",
    href: "/services/ecommerce",
    highlights: ["Shopify & Custom", "Payment Processing", "Inventory", "Analytics"],
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    description:
      "Ongoing website maintenance, security updates, performance optimization, and technical support to keep your site running smoothly around the clock.",
    href: "/services/maintenance",
    highlights: ["Security Updates", "Performance", "Backups", "24/7 Monitoring"],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">Services</li>
            </ol>
          </nav>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our Services
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            End-to-end technology solutions for Southern California businesses.
            From custom development to ongoing support, we build smarter stacks
            that deliver real ROI.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link
                  key={index}
                  href={service.href}
                  className="group relative rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_8px_32px_rgba(34,197,94,0.12)] hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h2>
                      <p className="text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a free consultation and we will audit your current setup, identify
            quick wins, and map out a plan that fits your budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Schedule Free Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all"
            >
              Try Our Free Tools
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
