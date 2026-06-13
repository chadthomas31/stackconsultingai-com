import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  Workflow,
  Calendar,
  MessageCircle,
  Mail,
  Headphones,
  Bot,
  FileText,
  PhoneMissed,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "AI Automation for Small Businesses: Practical Use Cases, Costs, and Tools (2026 Guide) | Stack Consulting AI",
  description:
    "A practical 2026 guide to AI automation for small businesses. Real use cases, honest cost ranges, and the tools that actually work — AI receptionists, appointment booking, lead follow-up, CRM automation, missed-call text-back, and more.",
  keywords: [
    "AI automation small business",
    "small business AI",
    "AI for small business guide",
    "AI receptionist small business",
    "business automation",
    "AI automation use cases",
    "AI automation cost",
    "AI consulting Orange County",
  ],
  alternates: {
    canonical: "https://stackconsultingai.com/ai-automation-small-business-guide",
  },
  openGraph: {
    title: "AI Automation for Small Businesses — Practical 2026 Guide",
    description:
      "Use cases, honest cost ranges, and the tools that actually work. AI receptionists, booking, lead follow-up, CRM automation, missed-call text-back.",
    url: "https://stackconsultingai.com/ai-automation-small-business-guide",
    type: "article",
  },
};

const ARTICLE_URL =
  "https://stackconsultingai.com/ai-automation-small-business-guide";

const useCases = [
  {
    icon: Phone,
    title: "AI receptionist (voice agent)",
    what: "An AI that answers your phone, qualifies the caller, books an appointment if appropriate, and emails you the transcript. Sub-1-second answer time. Works 24/7.",
    when: "You miss more than 3 calls a week. After-hours calls go to voicemail and die. Front desk is one person who keeps getting interrupted.",
    cost: "$300–$1,500 setup, $99–$399/mo (varies by call volume and integrations).",
    tools: "Custom builds on Telnyx / Twilio + OpenAI Realtime or Anthropic. Off-the-shelf: Synthflow, Vapi, Bland. Avoid: anything that gates your phone number behind their platform.",
  },
  {
    icon: Calendar,
    title: "Appointment booking automation",
    what: "Lead fills out a form (or talks to your AI receptionist), gets a calendar link, books a slot, gets a confirmation email + SMS, lands on your calendar with reminders pre-scheduled.",
    when: "You're playing email tag to set up consultations. You forget to send confirmations. No-shows above 15%.",
    cost: "$0–$300 setup. $0–$30/mo (Cal.com free; Calendly $10/seat; SavvyCal $12).",
    tools: "Cal.com (open source, recommended), Calendly, SavvyCal, Acuity. Connect via Zapier / Make / n8n to your CRM.",
  },
  {
    icon: MessageCircle,
    title: "Lead follow-up sequences",
    what: "A new lead fills out a form. Within 60 seconds they get a personalized email and an SMS. If they don't respond in 24 hours, a second message. If still nothing, a final nudge in 3 days.",
    when: "Lead-to-first-touch time is over 5 minutes. You forget to follow up with leads who go cold.",
    cost: "$0–$200 setup. $20–$100/mo depending on volume.",
    tools: "ActiveCampaign, Customer.io, n8n + Resend + Telnyx SMS for custom builds. Lemlist for cold outbound.",
  },
  {
    icon: Workflow,
    title: "CRM automation",
    what: "When a lead comes in, your CRM gets populated automatically. Tags applied. Sales rep assigned. Slack notified. Calendar held. No human types anything.",
    when: "Your CRM is half-empty because nobody enters data. Deals get lost between email and spreadsheet.",
    cost: "$200–$2,000 setup. CRM subscription varies ($0 HubSpot Free, $25 Pipedrive, $50+ HubSpot Pro).",
    tools: "HubSpot, Pipedrive, Close, GoHighLevel. Automation glue: Make, n8n, Zapier, native CRM workflows.",
  },
  {
    icon: Mail,
    title: "Email + SMS workflows",
    what: "Welcome sequences. Abandoned-cart recovery. Renewal reminders. Review requests after a job completes. Birthday / anniversary touches. All triggered by events, not by you remembering.",
    when: "You're forgetting to send renewal emails, review requests, or follow-ups. Customers go cold without re-engagement.",
    cost: "$0–$500 setup. $20–$200/mo depending on contact count.",
    tools: "ActiveCampaign, Customer.io, Mailchimp, Beehiiv (for newsletter), Postmark + Telnyx for custom.",
  },
  {
    icon: Headphones,
    title: "Customer support knowledge base",
    what: "AI chatbot trained on your docs, your past tickets, your policies. Answers FAQs instantly. Escalates real problems to a human. Logs every conversation.",
    when: "Same 5 questions every day. Support inbox is the bottleneck. New hires take weeks to learn the answers.",
    cost: "$500–$3,000 setup. $50–$300/mo.",
    tools: "Intercom Fin, Help Scout AI, Crisp, custom on Claude API or OpenAI. Self-host: Chatwoot + LLM.",
  },
  {
    icon: Bot,
    title: "Website chatbot (lead qualifier)",
    what: "A chatbot on your site that greets visitors, asks 3-5 qualifying questions, books a call for hot leads, drops cold ones into an email sequence.",
    when: "You have website traffic but the contact form doesn't fire. Visitors leave without you knowing they were there.",
    cost: "$300–$1,500 setup. $30–$150/mo.",
    tools: "Custom build on Claude / GPT + your site. Off-the-shelf: Intercom, Drift, Tidio, Chatbase.",
  },
  {
    icon: FileText,
    title: "Call summaries + meeting notes",
    what: "Every sales call, support call, or Zoom meeting gets transcribed, summarized, action-itemed, and dropped into your CRM or Notion. No more 'wait, what did they say?'",
    when: "You're taking notes during calls instead of listening. Action items get lost. Handoffs between you and a teammate are messy.",
    cost: "$0–$300 setup. $10–$30/seat/mo.",
    tools: "Fathom (free tier), Otter, Fireflies, Granola. Integrate with your CRM via native or Zapier.",
  },
  {
    icon: PhoneMissed,
    title: "Missed-call text-back",
    what: "When you miss a call, the system instantly texts the caller: 'Sorry we missed you — what can we help with?' They reply. You respond when you're free. Lead saved.",
    when: "You miss more than 2 calls a week. Mobile-first customer base. Service business where speed-to-lead matters.",
    cost: "$50–$300 setup. $30–$80/mo.",
    tools: "GoHighLevel (built-in), Numa (vertical-specific), or custom on Telnyx + LLM.",
  },
];

const startHere = [
  {
    title: "Step 1 — Audit current pain",
    body: "Look at where you (or your team) spend the most repetitive time, and where leads are dying. Don't start with the shiniest AI use case. Start with the highest-cost bottleneck.",
  },
  {
    title: "Step 2 — Quantify it",
    body: "How many calls do you miss per week? How long does lead follow-up take? How many leads die in your inbox? Numbers turn 'we should automate' into a clear ROI case.",
  },
  {
    title: "Step 3 — Pick one — not five",
    body: "Most failed automations come from doing too much at once. Ship ONE workflow end-to-end. Make it work. Measure the lift. Then pick the next.",
  },
  {
    title: "Step 4 — Decide build vs buy",
    body: "Off-the-shelf is faster but locks you in. Custom is more flexible but takes longer. For a 1-20 person business, off-the-shelf wins 80% of the time. The 20% where custom wins: anything that touches your phone system or has a unique knowledge-base requirement.",
  },
  {
    title: "Step 5 — Run it for 30 days, then review",
    body: "AI workflows look great in a demo and break in real conditions. Don't celebrate launch. Celebrate 30 days of clean data + measurable lift. That's success.",
  },
];

const honestTradeoffs = [
  {
    q: "Will AI replace my staff?",
    a: "For a small business, no — and that's actually the wrong frame. AI replaces the tasks your staff hates: data entry, repetitive follow-ups, after-hours coverage. People stay; the worst hours of their job go away. The risk is the opposite — over-automating something that needs a human touch and losing customers because of it.",
  },
  {
    q: "How much should I budget for the first year?",
    a: "A reasonable first-year all-in budget for a 1-10 person business landing on practical AI automation is $5,000–$25,000. That includes setup costs, monthly subscriptions, and 1-2 consulting engagements to actually wire things up. Less than that = you're cobbling it together yourself (fine, but slow). More than that = you're either at scale or being upsold.",
  },
  {
    q: "What about ChatGPT — isn't that all I need?",
    a: "ChatGPT alone is a great writing tool and a poor business workflow. Real automation requires connecting AI to your phone, your calendar, your CRM, your inbox, and your data — and that's the work nobody talks about. The model is the easy part.",
  },
  {
    q: "What's the riskiest thing to automate first?",
    a: "Anything customer-facing where the AI is the first impression. AI receptionists, chatbots, automated outreach. Get those wrong and you damage trust faster than you build it. Start with internal-only workflows (call summaries, CRM auto-fill, lead routing) where AI mistakes are recoverable.",
  },
  {
    q: "What's the safest thing to automate first?",
    a: "Missed-call text-back. It's invisible when it works, customers like it, the failure mode is benign (they don't reply, same as if you'd done nothing), and the ROI is immediate. Most service businesses see lead capture improve by 15-30% in the first month.",
  },
];

const ldJson = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "AI Automation for Small Businesses: Practical Use Cases, Costs, and Tools",
  description:
    "A practical 2026 guide to AI automation for small businesses with real use cases, honest cost ranges, and the tools that actually work.",
  author: {
    "@type": "Person",
    name: "Chad McCluskey",
  },
  publisher: {
    "@type": "Organization",
    name: "Stack Consulting AI",
    url: "https://stackconsultingai.com",
    logo: {
      "@type": "ImageObject",
      url: "https://stackconsultingai.com/stack-logo.png",
    },
  },
  url: ARTICLE_URL,
  mainEntityOfPage: ARTICLE_URL,
  datePublished: "2026-05-22",
  dateModified: "2026-05-22",
};

export default function AiAutomationGuidePage() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="relative max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8 text-center">
            <ol className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">Guide</li>
            </ol>
          </nav>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Practical Guide · 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              AI Automation for Small Businesses
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Practical use cases, honest cost ranges, and the tools that
              actually work. Written for operators, not for marketing decks.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto prose-lg space-y-6 text-lg leading-relaxed">
          <p>
            Most &ldquo;AI for small business&rdquo; content online is written either by
            people who&rsquo;ve never run a small business, or by tool vendors trying
            to sell you their platform. This guide is neither. It&rsquo;s a working
            list of the AI automations that small businesses are actually using
            in 2026, what they cost, what tools to use, and which ones to start
            with.
          </p>
          <p>
            If you run a 1-20 person business — service, retail, professional
            services, hospitality, healthcare — this is for you. We&rsquo;ll skip the
            &ldquo;ChatGPT will change everything&rdquo; intro and get into specifics.
          </p>
          <div className="not-prose flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              href="/free-ai-site-audit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
            >
              Get a free site + automation audit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ai-receptionist"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-all"
            >
              See the AI Receptionist live
            </Link>
          </div>
        </div>
      </article>

      {/* Use cases */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            9 AI automations small businesses actually use
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            Ranked roughly by how often we deploy each one for OC small business
            clients. Costs are realistic ranges for a 1-20 person business — not
            enterprise pricing.
          </p>
          <div className="space-y-6">
            {useCases.map(({ icon: Icon, title, what, when, cost, tools }) => (
              <div
                key={title}
                className="p-6 md:p-8 rounded-xl border border-border bg-card"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-semibold">{title}</h3>
                </div>
                <dl className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                  <div>
                    <dt className="font-semibold text-sm text-primary mb-1">
                      What it is
                    </dt>
                    <dd className="text-muted-foreground">{what}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-sm text-primary mb-1">
                      When you need it
                    </dt>
                    <dd className="text-muted-foreground">{when}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-sm text-primary mb-1">
                      Realistic cost
                    </dt>
                    <dd className="text-muted-foreground">{cost}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-sm text-primary mb-1">
                      Tools
                    </dt>
                    <dd className="text-muted-foreground">{tools}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Start here */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            How to actually start
          </h2>
          <div className="space-y-6">
            {startHere.map((s, i) => (
              <div
                key={s.title}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                    <p className="text-muted-foreground">{s.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Honest tradeoffs */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Honest answers to common questions
          </h2>
          <div className="space-y-6">
            {honestTradeoffs.map((f) => (
              <div
                key={f.q}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <h3 className="text-xl font-semibold mb-3">{f.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to skip the guesswork?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get a free written audit of your site + automation gaps, tailored to
            your business. No pitch. Just a straight read in 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/free-ai-site-audit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Get my free audit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/services/ai-consulting-orange-county"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all"
            >
              Orange County consulting
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Founder-led. No retainer. No offshore handoffs.
          </p>
        </div>
      </section>
    </main>
  );
}
