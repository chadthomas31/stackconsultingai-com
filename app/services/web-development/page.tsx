import type { Metadata } from "next";
import Link from "next/link";
import {
  Code2,
  Layers,
  Rocket,
  Search,
  Smartphone,
  Shield,
  Gauge,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Paintbrush,
  Hammer,
  PartyPopper,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Web Development with Next.js | Stack Consulting AI",
  description:
    "Custom website and web application development for businesses in Orange County and Southern California. We build fast, scalable sites with Next.js, TypeScript, and Tailwind CSS. Free consultation.",
  keywords: [
    "web development Southern California",
    "custom website Orange County",
    "Next.js developer",
    "React developer Orange County",
    "TypeScript web development",
    "custom web application",
    "responsive website design",
    "web developer near me",
  ],
  alternates: {
    canonical: "https://stackconsultingai.com/services/web-development",
  },
  openGraph: {
    title: "Custom Web Development | Southern California | Stack Consulting AI",
    description:
      "Custom website and web application development for businesses in Orange County and Southern California. Fast, scalable, SEO-optimized.",
    url: "https://stackconsultingai.com/services/web-development",
    type: "website",
  },
};

const whatWeBuild = [
  {
    icon: Layers,
    title: "Business Websites",
    description:
      "Professional, conversion-focused websites that represent your brand and drive leads. Built for speed and search engine visibility.",
  },
  {
    icon: Smartphone,
    title: "Web Applications",
    description:
      "Custom dashboards, client portals, and internal tools that automate your workflows and give your team superpowers.",
  },
  {
    icon: Rocket,
    title: "Landing Pages",
    description:
      "High-converting landing pages optimized for ad campaigns, product launches, and lead generation with A/B testing ready.",
  },
  {
    icon: Search,
    title: "SEO-First Sites",
    description:
      "Every site we build is structured for search engines from day one, with server-side rendering, semantic HTML, and blazing load times.",
  },
];

const techStack = [
  { name: "Next.js 15", description: "React framework with App Router for server components, streaming, and optimal performance" },
  { name: "TypeScript", description: "Type-safe code that catches bugs before they reach production" },
  { name: "Tailwind CSS", description: "Utility-first styling for pixel-perfect, responsive designs" },
  { name: "Supabase", description: "Open-source backend with auth, database, storage, and real-time subscriptions" },
  { name: "Vercel", description: "Edge-optimized hosting with global CDN, instant rollbacks, and preview deployments" },
  { name: "Cloudflare", description: "DNS, DDoS protection, and edge caching for bulletproof performance" },
];

const process = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Discovery",
    description:
      "We start with a free consultation to understand your business goals, target audience, and technical requirements. No jargon, just a clear conversation about what you need.",
  },
  {
    icon: Paintbrush,
    step: "02",
    title: "Design",
    description:
      "We create wireframes and high-fidelity mockups for your review. You see exactly what your site will look like on desktop and mobile before a single line of code is written.",
  },
  {
    icon: Hammer,
    step: "03",
    title: "Build",
    description:
      "Our developers bring the design to life with clean, tested code. You get weekly progress updates and a staging site to review as we build.",
  },
  {
    icon: PartyPopper,
    step: "04",
    title: "Launch",
    description:
      "We handle deployment, DNS, SSL, analytics setup, and search console submission. Post-launch, we monitor performance and fix any issues that come up.",
  },
];

const whyChooseUs = [
  "No templates or page builders. Every site is custom-coded for your business.",
  "Performance-first development. Sub-2-second load times on every project.",
  "Built-in SEO. Server-side rendering, structured data, and semantic HTML.",
  "Local to Southern California. We understand the Orange County market.",
  "Transparent pricing. No hidden fees, no scope creep surprises.",
  "Post-launch support included with every project.",
];

export default function WebDevelopmentPage() {
  return (
    <main className="min-h-screen">

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
              <li className="text-foreground font-medium">Web Development</li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Code2 className="w-4 h-4" />
              Web Development
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Custom Web Development for Southern California Businesses
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              We build fast, scalable websites and web applications that look
              great, rank well, and convert visitors into customers. No templates.
              No page builders. Just clean, modern code built for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Get a Free Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/#portfolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all"
              >
                View Our Work
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
            From single-page landing sites to complex web applications, we
            deliver solutions tailored to your goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whatWeBuild.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(34,197,94,0.12)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
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

      {/* Tech Stack */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Our Tech Stack
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            We use best-in-class open-source tools that are battle-tested, well-documented,
            and built for long-term maintainability.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  {tech.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Our Process
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            A straightforward four-step process from first conversation to live
            site. No surprises.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {process.map((item) => {
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

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why Choose Stack Consulting AI
          </h2>
          <div className="space-y-4">
            {whyChooseUs.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-card transition-colors"
              >
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-lg">{reason}</p>
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
              href="/services/ecommerce"
              className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                E-commerce Solutions
              </h3>
              <p className="text-muted-foreground text-sm">
                Custom online stores with payment processing and inventory management.
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
                Automate workflows, CRM, and data pipelines to save time and reduce errors.
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
                Keep your site secure, fast, and up-to-date with ongoing support.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Build Something Great?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tell us about your project and get a free, no-obligation quote
            within 24 hours. We will scope the work, estimate the timeline, and
            walk you through exactly what to expect.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
