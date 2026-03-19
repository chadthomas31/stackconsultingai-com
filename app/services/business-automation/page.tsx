import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Workflow,
  Database,
  Mail,
  Users,
  Bot,
  FileText,
  Clock,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Search,
  Hammer,
  PartyPopper,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Business Automation & AI Integration | Orange County | Stack Consulting AI",
  description:
    "Business automation consulting and AI integration for small businesses in Orange County and Southern California. Automate workflows, CRM, email sequences, and data pipelines. Free consultation.",
  keywords: [
    "business automation consulting",
    "workflow automation Orange County",
    "AI automation small business",
    "CRM automation Southern California",
    "business process automation",
    "AI integration consulting",
    "small business automation",
    "workflow optimization",
  ],
  alternates: {
    canonical: "https://stackconsultingai.com/services/business-automation",
  },
  openGraph: {
    title: "Business Automation & AI Integration | Stack Consulting AI",
    description:
      "Automate workflows, CRM, email sequences, and data pipelines for your small business. AI-powered solutions that deliver real ROI.",
    url: "https://stackconsultingai.com/services/business-automation",
    type: "website",
  },
};

const whatWeAutomate = [
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Replace manual, repetitive tasks with automated workflows that trigger on events, schedules, or conditions. From lead intake to invoicing, we connect your tools and let them work together.",
  },
  {
    icon: Database,
    title: "Data Pipelines",
    description:
      "Automatically sync data between your systems. No more copy-pasting between spreadsheets, CRMs, and accounting software. Your data stays accurate and up-to-date everywhere.",
  },
  {
    icon: Mail,
    title: "Email & Communication Sequences",
    description:
      "Automated follow-up emails, appointment reminders, onboarding sequences, and drip campaigns that nurture leads and keep clients engaged without manual effort.",
  },
  {
    icon: Users,
    title: "CRM & Client Management",
    description:
      "Set up and optimize your CRM to automatically track leads, log interactions, assign tasks, and generate reports so nothing falls through the cracks.",
  },
  {
    icon: Bot,
    title: "AI-Powered Assistants",
    description:
      "Custom AI chatbots, voice assistants, and document processing tools that handle customer inquiries, schedule appointments, and extract data from forms and PDFs.",
  },
  {
    icon: FileText,
    title: "Document & Report Automation",
    description:
      "Auto-generate proposals, invoices, reports, and contracts from templates. Pull live data from your systems so documents are always accurate and professional.",
  },
];

const tools = [
  "Supabase & PostgreSQL",
  "n8n & Make (Integromat)",
  "OpenAI & Claude APIs",
  "Zapier",
  "SendGrid & Mailgun",
  "Twilio & ElevenLabs",
  "Google Workspace APIs",
  "Stripe & QuickBooks",
  "Notion & Airtable",
  "Custom REST & Webhook APIs",
];

const roiExamples = [
  {
    icon: Clock,
    metric: "15+ hours/week",
    title: "Time Saved",
    description:
      "A property management company automated tenant communications, maintenance requests, and lease renewals, freeing up 15 hours of staff time per week.",
  },
  {
    icon: TrendingUp,
    metric: "40% more leads",
    title: "Lead Conversion",
    description:
      "An HVAC contractor automated lead follow-up within 5 minutes of form submission. Response rate jumped 40% and close rate doubled within 60 days.",
  },
  {
    icon: DollarSign,
    metric: "$2,400/month",
    title: "Cost Reduction",
    description:
      "A dental practice eliminated manual insurance verification and appointment reminders, reducing no-shows by 35% and saving $2,400 per month in admin costs.",
  },
];

const processSteps = [
  {
    icon: Search,
    step: "01",
    title: "Audit",
    description:
      "We map your current workflows, identify bottlenecks, and calculate time spent on repetitive tasks. You get a clear picture of where automation will have the biggest impact.",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Plan",
    description:
      "We design an automation strategy with specific tools, integrations, and expected outcomes. You approve the plan before any work begins.",
  },
  {
    icon: Hammer,
    step: "03",
    title: "Build & Test",
    description:
      "We build your automations, connect your tools, and test thoroughly with real data. Every workflow is documented so your team knows exactly how it works.",
  },
  {
    icon: PartyPopper,
    step: "04",
    title: "Launch & Optimize",
    description:
      "We deploy, train your team, and monitor for 30 days. We fine-tune triggers, add edge-case handling, and ensure everything runs smoothly.",
  },
];

export default function BusinessAutomationPage() {
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
              <li className="text-foreground font-medium">Business Automation</li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Business Automation
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Business Automation & AI Integration for Small Businesses
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              Stop doing the same tasks over and over. We connect your tools,
              automate your workflows, and integrate AI where it actually makes
              a difference, so you can focus on growing your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Get a Free Automation Audit
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/tools/roi-calculator"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all"
              >
                Calculate Your ROI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Automate */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            What We Automate
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            If your team is doing it manually and it follows a pattern, we can
            probably automate it.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeAutomate.map((item, index) => {
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

      {/* Tools We Use */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Tools & Platforms We Work With
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            We are platform-agnostic. We pick the right tools for your use case
            and budget, not the other way around.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((tool) => (
              <span
                key={tool}
                className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium hover:border-primary/50 transition-colors"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Examples */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Real Results for Real Businesses
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Automation pays for itself. Here is what our clients have seen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roiExamples.map((example, index) => {
              const Icon = example.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-xl bg-card border border-border"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {example.metric}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {example.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {example.description}
                  </p>
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
            From audit to launch in as little as two weeks.
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
                Custom websites and web apps built with Next.js, TypeScript, and modern tools.
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
                Online stores with automated inventory, payments, and fulfillment workflows.
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
                Ongoing monitoring, updates, and support to keep your automations running.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Stop Wasting Time on Repetitive Tasks
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a free automation audit. We will map your workflows, identify the
            biggest time sinks, and show you exactly what can be automated and
            what it will save you.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Book Your Free Audit
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
