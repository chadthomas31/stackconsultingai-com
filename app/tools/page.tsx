import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free AI & Website Tools for Small Business | Stack Consulting AI",
  description:
    "Free tools for small business owners: AI site audit, automation opportunity finder, ROI calculator, SEO audit, speed checker, and more. No signup required.",
  alternates: { canonical: "https://stackconsultingai.com/tools" },
};
import { Calculator, Zap, Search, TrendingUp, Calendar, Code, BarChart3, Workflow, Gift, UserX, Award, ArrowRight } from "lucide-react";

const tools = [
  {
    id: "site-audit",
    icon: BarChart3,
    title: "Free AI Site Audit",
    description: "Get a comprehensive performance, SEO, and accessibility audit powered by Google Lighthouse.",
    badge: "Featured",
    badgeColor: "bg-accent text-accent-foreground",
    stats: "~15 seconds",
    href: "/tools/site-audit",
    active: true,
    cta: "Run Free Audit"
  },
  {
    id: "automation-finder",
    icon: Workflow,
    title: "Automation Opportunity Finder",
    description: "Describe your business and get personalized automation recommendations with estimated savings.",
    badge: "Featured",
    badgeColor: "bg-accent text-accent-foreground",
    stats: "~3 minutes",
    href: "/tools/automation-finder",
    active: true,
    cta: "Find Opportunities"
  },
  {
    id: "cost-calculator",
    icon: Calculator,
    title: "Website Cost Calculator",
    description: "Get an instant estimate for your web development project. See pricing breakdowns and timelines.",
    badge: "Popular",
    badgeColor: "bg-primary text-primary-foreground",
    stats: "~5 minutes",
    href: "/tools/cost-calculator",
    active: true,
    cta: "Calculate Now"
  },
  {
    id: "speed-checker",
    icon: Zap,
    title: "Website Speed Checker",
    description: "Analyze your website's performance and get actionable recommendations to improve speed.",
    badge: "",
    badgeColor: "bg-primary text-primary-foreground",
    stats: "~2 minutes",
    href: "/tools/speed-checker",
    active: true,
    cta: "Check Speed"
  },
  {
    id: "seo-audit",
    icon: Search,
    title: "SEO Quick Audit",
    description: "Get a free SEO health check with insights on meta tags, mobile-friendliness, and more.",
    badge: "",
    badgeColor: "bg-primary text-primary-foreground",
    stats: "~3 minutes",
    href: "/tools/seo-audit",
    active: true,
    cta: "Run Audit"
  },
  {
    id: "roi-calculator",
    icon: TrendingUp,
    title: "ROI Calculator",
    description: "Calculate the potential return on investment for your new website or redesign project.",
    badge: "New",
    badgeColor: "bg-primary text-primary-foreground",
    stats: "~4 minutes",
    href: "/tools/roi-calculator",
    active: true,
    cta: "Calculate ROI"
  },
  {
    id: "timeline-estimator",
    icon: Calendar,
    title: "Project Timeline Estimator",
    description: "Get realistic timelines for your web project based on scope and requirements.",
    badge: "New",
    badgeColor: "bg-primary text-primary-foreground",
    stats: "~3 minutes",
    href: "/tools/timeline-estimator",
    active: true,
    cta: "Estimate Timeline"
  },
  {
    id: "tech-stack",
    icon: Code,
    title: "Tech Stack Recommender",
    description: "Find the perfect technology stack for your business needs and budget.",
    badge: "New",
    badgeColor: "bg-primary text-primary-foreground",
    stats: "~5 minutes",
    href: "/tools/tech-stack",
    active: true,
    cta: "Get Recommendation"
  },
  {
    id: "gemini-quota",
    icon: BarChart3,
    title: "Gemini Quota Tracker",
    description: "Track Google Gemini API usage and stay under your daily limits with live quota visibility.",
    badge: "",
    badgeColor: "bg-primary text-primary-foreground",
    stats: "~1 minute",
    href: "/tools/gemini-quota",
    active: true,
    cta: "Check Quota"
  },
  {
    id: "newsletter-generator",
    icon: Workflow,
    title: "Newsletter Generator",
    description: "AI-assisted newsletter drafting — outline, write, and polish a full issue in minutes.",
    badge: "",
    badgeColor: "bg-primary text-primary-foreground",
    stats: "~10 minutes",
    href: "/tools/newsletter-generator",
    active: true,
    cta: "Draft a Newsletter"
  }
];

const benefits = [
  {
    icon: Gift,
    title: "100% Free",
    description: "No hidden costs or trial periods"
  },
  {
    icon: UserX,
    title: "No Signup Required",
    description: "Get insights instantly without creating an account"
  },
  {
    icon: Award,
    title: "Expert-Built",
    description: "Created by professional developers with real-world experience"
  }
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Free Business Tools
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Professional-grade tools to help you make informed decisions about your web presence. No signup required.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className={`group relative rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/10 ${
                    !tool.active ? 'opacity-60' : ''
                  }`}
                >
                  {/* Badge */}
                  {tool.badge && (
                    <div className="absolute top-4 right-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${tool.badgeColor}`}>
                        {tool.badge}
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                  <p className="text-muted-foreground mb-4 min-h-[3rem]">{tool.description}</p>
                  
                  {/* Stats */}
                  <div className="text-sm text-muted-foreground mb-4">
                    ⏱️ {tool.stats}
                  </div>

                  {/* Button */}
                  {tool.active ? (
                    <Link
                      href={tool.href}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all w-full justify-center"
                    >
                      {tool.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-lg font-semibold cursor-not-allowed w-full justify-center"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Use Our Tools */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Use Our Tools?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Need More Than Tools?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our team can turn your project into reality
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
              href="/#portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}