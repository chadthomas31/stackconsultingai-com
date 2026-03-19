import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Package,
  BarChart3,
  Users,
  Globe,
  Truck,
  Shield,
  Smartphone,
  Search,
  MessageSquare,
  Paintbrush,
  Hammer,
  PartyPopper,
} from "lucide-react";

export const metadata: Metadata = {
  title: "E-commerce Development Orange County | Online Store Solutions | Stack Consulting AI",
  description:
    "E-commerce development for businesses in Orange County and Southern California. Custom online stores, Shopify development, payment processing, and inventory management. Free consultation.",
  keywords: [
    "e-commerce development Orange County",
    "online store Southern California",
    "Shopify developer",
    "custom e-commerce website",
    "online store development",
    "e-commerce solutions",
    "payment processing integration",
    "inventory management system",
  ],
  alternates: {
    canonical: "https://stackconsultingai.com/services/ecommerce",
  },
  openGraph: {
    title: "E-commerce Development | Orange County | Stack Consulting AI",
    description:
      "Custom online stores, Shopify development, payment processing, and inventory management for Southern California businesses.",
    url: "https://stackconsultingai.com/services/ecommerce",
    type: "website",
  },
};

const whatWeBuild = [
  {
    icon: Globe,
    title: "Custom Online Stores",
    description:
      "Fully custom e-commerce sites built from scratch or on Shopify, designed around your products, brand, and customer journey. No cookie-cutter templates.",
  },
  {
    icon: CreditCard,
    title: "Payment Processing",
    description:
      "Secure checkout with Stripe, Square, or PayPal. Support for subscriptions, installment plans, multi-currency, and PCI-compliant card processing.",
  },
  {
    icon: Package,
    title: "Inventory Management",
    description:
      "Real-time inventory tracking synced across your website, POS, and warehouse. Automated low-stock alerts and reorder triggers so you never oversell.",
  },
  {
    icon: Truck,
    title: "Shipping & Fulfillment",
    description:
      "Integrated shipping rate calculators, label printing, tracking notifications, and multi-carrier support. Connect to ShipStation, EasyPost, or custom logistics.",
  },
  {
    icon: Users,
    title: "Customer Portals",
    description:
      "Self-service account areas where customers manage orders, track shipments, save favorites, and handle returns without calling your team.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description:
      "Custom dashboards showing revenue, conversion rates, top products, and customer lifetime value. Make data-driven decisions instead of guessing.",
  },
];

const platforms = [
  {
    name: "Custom Next.js",
    description: "Full-stack e-commerce built with Next.js, Supabase, and Stripe for maximum flexibility and performance.",
    best: "Complex product catalogs, custom UX, unique business logic",
  },
  {
    name: "Shopify",
    description: "Industry-leading e-commerce platform with custom theme development, app integrations, and Shopify Plus support.",
    best: "Fast launches, large product catalogs, established brand stores",
  },
  {
    name: "Headless Commerce",
    description: "Shopify or Saleor backend with a custom Next.js frontend for the best of both worlds: proven commerce engine, custom experience.",
    best: "High-traffic stores, omnichannel, advanced personalization",
  },
];

const features = [
  { icon: Search, label: "SEO-optimized product pages" },
  { icon: Smartphone, label: "Mobile-first responsive design" },
  { icon: Shield, label: "PCI-compliant security" },
  { icon: BarChart3, label: "Conversion rate optimization" },
  { icon: Users, label: "Customer reviews & ratings" },
  { icon: Package, label: "Product variants & options" },
  { icon: CreditCard, label: "Discount codes & promotions" },
  { icon: Truck, label: "Real-time shipping rates" },
  { icon: Globe, label: "Multi-language support" },
];

const processSteps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Discovery & Strategy",
    description:
      "We learn your products, audience, and revenue goals. We audit competitors, map the customer journey, and recommend the right platform and feature set for your budget.",
  },
  {
    icon: Paintbrush,
    step: "02",
    title: "Design & UX",
    description:
      "We design your storefront with conversion in mind: clean product pages, smooth checkout flow, and trust signals throughout. You review mockups before development begins.",
  },
  {
    icon: Hammer,
    step: "03",
    title: "Build & Integrate",
    description:
      "We develop your store, integrate payment processing, set up shipping, and connect your inventory system. Every feature is tested with real transactions.",
  },
  {
    icon: PartyPopper,
    step: "04",
    title: "Launch & Grow",
    description:
      "We deploy, set up analytics and tracking, submit to Google Merchant Center, and monitor performance. Post-launch, we optimize based on real customer data.",
  },
];

export default function EcommercePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="relative max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">E-commerce</li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <ShoppingCart className="w-4 h-4" />
              E-commerce
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              E-commerce Solutions That Drive Revenue
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              We build online stores that convert browsers into buyers. From
              product pages to checkout, every detail is designed to reduce
              friction, build trust, and maximize your average order value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Get a Free Store Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/#portfolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all"
              >
                See Our Stores
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            What We Build
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Everything you need to sell online, from storefront to fulfillment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeBuild.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(34,197,94,0.12)]"
                >
                  <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Choose Your Platform
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            We recommend the right platform for your products, traffic, and
            growth plans. No one-size-fits-all approach.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-3 text-primary">
                  {platform.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {platform.description}
                </p>
                <div className="pt-4 border-t border-border">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Best for
                  </span>
                  <p className="text-sm mt-1">{platform.best}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Built-In Features
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Every store we build includes the essentials for selling online
            successfully.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-card transition-colors"
                >
                  <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{feature.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Our Process
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            From strategy to first sale, typically in 4 to 8 weeks.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {processSteps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative p-8 rounded-xl bg-card border border-border"
                >
                  <span className="absolute top-4 right-4 text-6xl font-bold text-primary/10">
                    {item.step}
                  </span>
                  <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Related Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/services/web-development"
              className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                Web Development
              </h3>
              <p className="text-muted-foreground text-sm">
                Custom websites and web apps for businesses that need more than a store.
              </p>
            </Link>
            <Link
              href="/services/business-automation"
              className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                Business Automation
              </h3>
              <p className="text-muted-foreground text-sm">
                Automate order processing, inventory alerts, and customer follow-ups.
              </p>
            </Link>
            <Link
              href="/services/maintenance"
              className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                Maintenance & Support
              </h3>
              <p className="text-muted-foreground text-sm">
                Keep your store secure, fast, and running smoothly year-round.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Selling Online?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you are launching your first store or rebuilding an existing
            one, we will help you create an e-commerce experience that customers
            love and that drives real revenue.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Get Your Free Store Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
