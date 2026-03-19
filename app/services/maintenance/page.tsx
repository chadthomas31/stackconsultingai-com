import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Wrench,
  ArrowRight,
  CheckCircle2,
  Shield,
  Gauge,
  RefreshCw,
  HardDrive,
  AlertTriangle,
  Clock,
  Headphones,
  BarChart3,
  Bug,
  Server,
  Eye,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Website Maintenance & Support | Orange County | Stack Consulting AI",
  description:
    "Professional website maintenance, security updates, performance optimization, and technical support for businesses in Orange County and Southern California. Keep your site fast, secure, and up-to-date.",
  keywords: [
    "website maintenance Orange County",
    "website support Southern California",
    "website security updates",
    "website performance optimization",
    "managed website hosting",
    "website backup service",
    "technical support small business",
    "website monitoring service",
  ],
  alternates: {
    canonical: "https://stackconsultingai.com/services/maintenance",
  },
  openGraph: {
    title: "Website Maintenance & Support | Stack Consulting AI",
    description:
      "Professional website maintenance, security updates, and performance optimization for Southern California businesses.",
    url: "https://stackconsultingai.com/services/maintenance",
    type: "website",
  },
};

const included = [
  {
    icon: RefreshCw,
    title: "Software & Dependency Updates",
    description:
      "We keep your frameworks, libraries, and plugins updated to the latest stable versions. No more security vulnerabilities from outdated dependencies.",
  },
  {
    icon: Shield,
    title: "Security Monitoring & Patching",
    description:
      "Continuous monitoring for vulnerabilities, malware, and suspicious activity. We patch issues within hours, not days, and notify you immediately if anything is found.",
  },
  {
    icon: Gauge,
    title: "Performance Optimization",
    description:
      "Monthly performance audits with Core Web Vitals tracking. We optimize images, clean up code, tune caching, and ensure your site loads fast for every visitor.",
  },
  {
    icon: HardDrive,
    title: "Automated Backups",
    description:
      "Daily automated backups stored off-site with 30-day retention. One-click restore capability so you are never more than 24 hours from a clean recovery point.",
  },
  {
    icon: Eye,
    title: "Uptime Monitoring",
    description:
      "24/7 uptime monitoring with instant alerts. If your site goes down, we know within 60 seconds and start working on a fix before you even notice.",
  },
  {
    icon: Bug,
    title: "Bug Fixes & Content Updates",
    description:
      "Quick turnaround on bug fixes, text changes, image swaps, and minor feature additions. No need to learn a CMS or hire a separate freelancer.",
  },
];

const tiers = [
  {
    name: "Essential",
    description: "For small business websites that need the basics covered.",
    features: [
      "Monthly dependency updates",
      "Weekly automated backups",
      "Uptime monitoring",
      "Security scanning",
      "2 content updates per month",
      "Email support (48h response)",
    ],
    highlight: false,
  },
  {
    name: "Professional",
    description: "For businesses that depend on their website for revenue.",
    features: [
      "Everything in Essential",
      "Bi-weekly dependency updates",
      "Daily automated backups",
      "Monthly performance audit",
      "5 content updates per month",
      "Priority email & chat support (24h response)",
      "Monthly analytics report",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    description: "For high-traffic sites and e-commerce stores.",
    features: [
      "Everything in Professional",
      "Weekly dependency updates",
      "Real-time database backups",
      "Weekly performance optimization",
      "Unlimited content updates",
      "Phone, email, & chat support (4h response)",
      "Custom analytics dashboards",
      "Staging environment",
      "Dedicated account manager",
    ],
    highlight: false,
  },
];

const slaItems = [
  {
    icon: Clock,
    title: "Response Times",
    description:
      "Critical issues (site down): 1-hour response. High priority (broken functionality): 4-hour response. Standard requests: 24-48 hour response.",
  },
  {
    icon: Server,
    title: "99.9% Uptime Target",
    description:
      "We target 99.9% uptime across all managed sites. Our infrastructure runs on Vercel and Cloudflare with automatic failover and global edge caching.",
  },
  {
    icon: Headphones,
    title: "Direct Access",
    description:
      "No ticket queues or overseas call centers. You communicate directly with the developer who built your site and knows your codebase inside out.",
  },
  {
    icon: BarChart3,
    title: "Monthly Reporting",
    description:
      "Detailed monthly reports covering uptime, performance metrics, security scan results, updates applied, and recommendations for improvement.",
  },
];

const whyMaintenanceMatters = [
  "67% of small business websites have unpatched vulnerabilities that could be exploited within weeks.",
  "A 1-second delay in page load time reduces conversions by 7% on average.",
  "Google penalizes slow, insecure sites in search rankings, costing you organic traffic.",
  "The average cost of a website breach for a small business is over $25,000 in downtime, cleanup, and lost trust.",
  "Regular maintenance costs a fraction of an emergency rebuild after a security incident.",
];

export default function MaintenancePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear_gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
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
              <li className="text-foreground font-medium">Maintenance & Support</li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Wrench className="w-4 h-4" />
              Maintenance & Support
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Website Maintenance & Ongoing Support
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              Your website is not a one-and-done project. It needs regular
              updates, security patches, and performance tuning to stay fast,
              secure, and visible in search results. We handle all of it so you
              do not have to think about it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Get a Maintenance Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/tools/speed-checker"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all"
              >
                Check Your Site Speed
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            What is Included
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Comprehensive maintenance that covers security, performance,
            backups, and ongoing improvements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map((item, index) => {
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

      {/* Pricing Tiers */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Maintenance Plans
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Flexible plans that scale with your needs. Contact us for custom
            pricing based on your site complexity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-xl border transition-all duration-300 ${
                  tier.highlight
                    ? "bg-card border-primary shadow-[0_8px_32px_rgba(34,197,94,0.15)]"
                    : "bg-card border-border hover:border-primary/50"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/#contact"
                  className={`inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                    tier.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Get Custom Quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLA */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Our Service Level Agreement
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Clear commitments with measurable standards. You always know what
            to expect.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {slaItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="p-8 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Maintenance Matters */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Why Website Maintenance Matters
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Skipping maintenance is not saving money. It is accumulating risk.
          </p>
          <div className="space-y-4">
            {whyMaintenanceMatters.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-card transition-colors"
              >
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{reason}</p>
              </div>
            ))}
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
                Need a new site or a redesign? We build fast, modern websites from scratch.
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
                Automate workflows and integrate AI to save time and reduce manual work.
              </p>
            </Link>
            <Link
              href="/services/ecommerce"
              className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                E-commerce Solutions
              </h3>
              <p className="text-muted-foreground text-sm">
                Build or upgrade your online store with custom development and integrations.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Keep Your Site Running at Peak Performance
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get a custom maintenance quote based on your site. We will review
            your current setup, identify any issues, and recommend the right
            plan for your needs.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Get Your Maintenance Quote
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
