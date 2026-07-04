import type { Metadata } from "next";
import Link from "next/link";
import {
  Bot,
  Code2,
  PhoneCall,
  Search,
  ShoppingCart,
  Wrench,
  Wifi,
  ArrowRight,
  MapPin,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Consulting & Web Development | Stack Consulting AI",
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
    title: "AI Consulting & Web Development | Stack Consulting AI",
    description:
      "Full-service AI consulting, custom web development, business automation, e-commerce, and website maintenance for small businesses in Southern California.",
    url: "https://stackconsultingai.com/services",
    type: "website",
  },
};

const services = [
  {
    icon: MapPin,
    title: "AI Consulting Orange County",
    description:
      "Founder-led AI consulting for OC small businesses. Voice agents, chatbots, and automations built in-house — no offshore handoffs. Free 30-minute assessment.",
    href: "/services/ai-consulting-orange-county",
    highlights: ["Voice Agents", "Chatbots", "Workflow Automation", "OC-based"],
  },
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
    icon: Wifi,
    title: "Guest WiFi + Email Capture",
    description:
      "Branded captive portal on pfSense + UniFi. Customers connect to your WiFi, you collect verified emails straight into your newsletter list. Lead-gen built into the wall.",
    href: "/services/guest-wifi",
    highlights: ["Branded Splash", "Newsletter Sync", "Guest Isolation", "Multi-Location"],
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

const focusedAiServices = [
  {
    icon: PhoneCall,
    title: "AI Receptionist Orange County",
    description:
      "Phone agents for local service businesses that miss calls, need better intake, or want after-hours booking coverage.",
    href: "/services/ai-receptionist-orange-county",
  },
  {
    icon: Bot,
    title: "AI Receptionist for HVAC",
    description:
      "Dispatch-aware intake for no-cool, no-heat, maintenance, replacement, and emergency HVAC calls.",
    href: "/services/ai-receptionist-for-hvac",
  },
  {
    icon: Bot,
    title: "AI Receptionist for Medspas",
    description:
      "Polished consultation routing and treatment-interest intake for aesthetics clinics and medspas.",
    href: "/services/ai-receptionist-for-medspas",
  },
  {
    icon: Bot,
    title: "AI Receptionist for Auto Shops",
    description:
      "Vehicle, symptom, drop-off, mobile repair, and advisor handoff flows for busy service counters.",
    href: "/services/ai-receptionist-for-auto-shops",
  },
  {
    icon: Zap,
    title: "Business Automation Orange County",
    description:
      "Lead routing, reporting, document generation, and workflow automation for small teams in OC.",
    href: "/services/business-automation-orange-county",
  },
  {
    icon: Search,
    title: "Website Automation Audit Orange County",
    description:
      "A lead-path audit for businesses with traffic, unclear conversion tracking, and under-measured SEO.",
    href: "/services/website-automation-audit-orange-county",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">

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

      <section className="py-20 px-4 bg-soft">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-10">
            <p className="text-sm font-medium text-accent mb-4 tracking-wide uppercase">
              Focused AI service pages
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              Start with the search intent that matches the buyer.
            </h2>
            <p className="text-lg text-muted-foreground">
              Broad AI consulting is crowded. These pages target the local and
              vertical problems buyers actually search for: missed calls, lead
              routing, service intake, and conversion tracking.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {focusedAiServices.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group rounded-xl border border-border bg-white p-6 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1"
                >
                  <Icon className="w-6 h-6 text-primary mb-4" aria-hidden="true" />
                  <h3 className="font-heading text-xl font-semibold text-navy-900 mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                    View service <ArrowRight className="w-4 h-4" aria-hidden="true" />
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

    </main>
  );
}
