import type { Metadata } from "next";
import Link from "next/link";
import {
  Wifi,
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Building2,
  Network,
  PenSquare,
  Search,
  MessageSquare,
  Hammer,
  PartyPopper,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Guest WiFi + Email Capture | Stack Consulting AI",
  description:
    "Branded guest WiFi captive portals for cafes, clinics, salons, gyms, and offices in Orange County. Customers connect, you collect emails into your newsletter. pfSense + UniFi.",
  keywords: [
    "guest wifi captive portal",
    "branded wifi small business",
    "wifi marketing Orange County",
    "captive portal pfsense",
    "unifi guest network setup",
    "wifi email capture",
    "lead generation wifi",
    "small business wifi setup",
  ],
  alternates: {
    canonical: "https://stackconsultingai.com/services/guest-wifi",
  },
  openGraph: {
    title: "Guest WiFi + Email Capture | Stack Consulting AI",
    description:
      "Customers log on to your WiFi, you collect emails into your newsletter list. Branded captive portal on pfSense + UniFi.",
    url: "https://stackconsultingai.com/services/guest-wifi",
    type: "website",
  },
};

const whatYouGet = [
  {
    icon: PenSquare,
    title: "Branded Splash Page",
    description:
      "Your logo, your colors, your terms. Looks like part of your business — not a generic router page.",
  },
  {
    icon: Mail,
    title: "Email Capture to Newsletter",
    description:
      "Every connection collects a verified email and pushes it straight into Beehiiv, Mailchimp, ConvertKit, or whatever list you use.",
  },
  {
    icon: ShieldCheck,
    title: "Guest Isolation",
    description:
      "Customers get internet. They can't see your POS, your cameras, your office network, or each other. Built-in segmentation on pfSense.",
  },
  {
    icon: Network,
    title: "Real Hardware",
    description:
      "pfSense firewall + UniFi access points. No SaaS subscription, no per-device fee, no vendor lock-in. You own the gear.",
  },
  {
    icon: Wifi,
    title: "Session Control",
    description:
      "Per-device time limits, bandwidth caps if you want them, re-auth windows. Tune it to fit your business — cafe drop-ins or all-day waiting rooms.",
  },
  {
    icon: Building2,
    title: "One Login, Multiple Locations",
    description:
      "Have two or three locations? Same SSID, same splash, same email list. Customers connect once at any site and roam.",
  },
];

const builtFor = [
  "Cafés & restaurants",
  "Medical & dental practices",
  "Salons & barbershops",
  "Gyms & studios",
  "Coworking spaces",
  "Hotels & short-term rentals",
  "Retail showrooms",
  "Auto service waiting rooms",
];

const processSteps = [
  {
    icon: Search,
    step: "01",
    title: "Site Walk",
    description:
      "We visit your space, measure coverage, identify dead spots, and check your existing internet circuit. You get a written quote with the exact hardware list.",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Design Splash",
    description:
      "We design the captive portal in your brand. You approve the look, the welcome copy, the T&C, and which email list it feeds.",
  },
  {
    icon: Hammer,
    step: "03",
    title: "Install & Configure",
    description:
      "On-site install of access points, pfSense firewall config, VLAN segmentation, captive portal upload, newsletter integration tested end-to-end.",
  },
  {
    icon: PartyPopper,
    step: "04",
    title: "Train & Hand Off",
    description:
      "We walk you through the admin panel, show you how to read the subscriber list, and leave you with a runbook. 30-day post-launch support included.",
  },
];

const faq = [
  {
    q: "Is this legal? Can I really require an email to use WiFi?",
    a: "Yes — as long as the splash page clearly states you're collecting the email and what you'll send. Our splash includes the T&C language to keep you CAN-SPAM and GDPR-clean. We're not lawyers, but the pattern is standard practice for retail WiFi.",
  },
  {
    q: "What if a customer doesn't want to give an email?",
    a: "Optional: we can add a 'skip & connect' button that gives a shorter session (15 min instead of 4 hours). They get on; you get a chance to convert them next visit.",
  },
  {
    q: "Will it slow down my internet?",
    a: "No. The captive portal runs locally on your pfSense box — no cloud round-trip. Traffic itself isn't filtered through any third-party service. Speed = whatever your ISP gives you, minus guest VLAN traffic shaping if you choose to set it.",
  },
  {
    q: "What if my router or APs already exist?",
    a: "We work with what you have when we can. Most small businesses run consumer gear that can't do captive portals properly — in that case we replace the firewall + APs. We'll tell you the truth on the site walk.",
  },
  {
    q: "What does it cost to run after install?",
    a: "Nothing per month from us. Your only ongoing cost is your internet bill and the newsletter platform (Beehiiv free tier, Mailchimp pay-as-you-grow, etc.).",
  },
];

export default function GuestWifiPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="relative max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">Guest WiFi</li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Wifi className="w-4 h-4" />
              Guest WiFi + Email Capture
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Customers log on. You collect emails. Every time.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              Branded captive portal on pfSense + UniFi. Every device that
              connects to your WiFi drops a verified email into your newsletter
              list — and gets clean internet without seeing your back office.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Get a Site Walk Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+19497490001"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all"
              >
                Call (949) 749-0001
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            What You Get
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Real hardware, real configuration, real lead-gen. Not a SaaS that
            costs you $50/month and rents you back your own WiFi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatYouGet.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(62,106,239,0.12)]"
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

      {/* Built For */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Built For
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Any business where customers sit, wait, eat, sweat, or shop and
            ask for the WiFi password.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {builtFor.map((biz) => (
              <span
                key={biz}
                className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium hover:border-primary/50 transition-colors"
              >
                {biz}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Most installs are done in a single visit. Site walk to live portal
            in under two weeks.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative p-6 rounded-xl bg-card border border-border"
                >
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {step.step}
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4 mt-2">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Straight Pricing
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            No SaaS subscription. No per-device fee. You own the gear, you keep
            the email list.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-xl bg-card border border-border">
              <h3 className="text-2xl font-bold mb-2">Single Location</h3>
              <p className="text-4xl font-bold text-primary mb-1">$1,800</p>
              <p className="text-sm text-muted-foreground mb-6">
                One-time. Hardware included for spaces up to ~2,500 sqft.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>pfSense firewall (Netgate appliance)</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>1× UniFi U6+ access point</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Branded splash + newsletter integration</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>VLAN guest isolation</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>30-day post-launch support</span>
                </li>
              </ul>
            </div>
            <div className="p-8 rounded-xl bg-primary text-primary-foreground border border-primary">
              <h3 className="text-2xl font-bold mb-2">Multi-Location / Larger Space</h3>
              <p className="text-4xl font-bold mb-1">From $3,200</p>
              <p className="text-sm opacity-80 mb-6">
                Custom quote based on coverage + AP count.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Everything in Single Location</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Mesh roaming across APs (802.11r)</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Per-location subscriber tagging</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Cellular failover option (LTE/5G)</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>60-day post-launch support</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            Optional managed-service add-on: $99/month — monitoring, firmware
            updates, subscriber-list health checks, quarterly reporting.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Common Questions
          </h2>
          <div className="space-y-4">
            {faq.map((item, index) => (
              <details
                key={index}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <summary className="font-semibold cursor-pointer flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-primary group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop giving away free WiFi. Start collecting customers.
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Every customer who connects becomes a marketing channel. Book a free
            site walk — we&apos;ll tell you exactly what your space needs and
            what it&apos;ll cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background text-primary rounded-lg font-semibold text-lg hover:bg-background/90 transition-all"
            >
              Book a Site Walk
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+19497490001"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary-foreground/10 transition-all"
            >
              Call (949) 749-0001
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
