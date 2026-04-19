/**
 * Tool catalog — the recommendable universe Stacks can pull from when
 * generating an AI Tools Assessment report.
 *
 * Claude's extraction step looks at each pain point in the interview
 * transcript, maps it to a ToolCategory, then picks the best-fitting
 * tools from this catalog. Add/remove tools here; DO NOT rename tier
 * or category values (report renderer keys off them).
 *
 * Tier convention:
 *   quick-win      — low effort / high impact (always prioritized)
 *   major-project  — high effort / high impact (upsell pitch)
 *   fill-in        — low effort / low impact (nice-to-have)
 *   ignore         — don't recommend (kept here only for explicit rejection)
 *
 * Pricing is indicative (USD, 2026) — not contractual. Update annually.
 */

import type { ToolCategory } from "./interview-scripts";

export type Tier = "quick-win" | "major-project" | "fill-in" | "ignore";

export interface Tool {
  id: string;
  name: string;
  url: string;
  tagline: string;
  tier: Tier;
  categories: ToolCategory[];
  /** Monthly cost in USD — use 0 for free tiers, -1 for custom quote */
  monthlyCost: number;
  /** Human-readable cost string ("$7/mo", "$0–10/user", "Custom") */
  costLabel: string;
  /** Typical setup time in minutes */
  setupMinutes: number;
  /** Typical weekly hours reclaimed — calibrate by category, not the product */
  weeklyHoursSaved: number;
  /** Industries where this tool is especially good (empty = universal) */
  bestForIndustries?: string[];
  /** One-liner Stacks can quote when recommending this tool */
  recommendationBlurb: string;
  /** Compliance flags this tool satisfies (used when filtering HIPAA/PCI callers) */
  complianceFlags?: Array<"hipaa" | "pci" | "soc2">;
}

/* ================================================================
   QUICK WINS — the default AI Tools Assessment recommendations
   Mirrors Corey Ganim's template baseline: Fathom, SaneBox, DashThis, Canva
   ================================================================ */

export const TOOLS: Tool[] = [
  {
    id: "fathom",
    name: "Fathom.ai",
    url: "https://fathom.video",
    tagline: "Auto-joins meetings, captures transcripts, extracts action items.",
    tier: "quick-win",
    categories: ["meeting-notes"],
    monthlyCost: 0,
    costLabel: "$0–10/user",
    setupMinutes: 15,
    weeklyHoursSaved: 2,
    recommendationBlurb:
      "Fathom joins every Zoom/Meet automatically, gives you the transcript plus clean action items, and pushes them into Asana or Slack. No more 'wait, what did we agree to?'",
  },
  {
    id: "sanebox",
    name: "SaneBox",
    url: "https://www.sanebox.com",
    tagline: "Learns which emails matter and filters the noise.",
    tier: "quick-win",
    categories: ["email-triage"],
    monthlyCost: 7,
    costLabel: "$7/mo",
    setupMinutes: 10,
    weeklyHoursSaved: 3,
    recommendationBlurb:
      "SaneBox sits in front of your inbox, learns what matters vs. noise, and files the noise into SaneLater automatically. No workflow change — just a quieter inbox.",
  },
  {
    id: "dashthis",
    name: "DashThis",
    url: "https://dashthis.com",
    tagline: "Consolidates marketing dashboards across GA, Meta, Google Ads.",
    tier: "quick-win",
    categories: ["reporting-dashboards"],
    monthlyCost: 42,
    costLabel: "$42/mo",
    setupMinutes: 90,
    weeklyHoursSaved: 2,
    recommendationBlurb:
      "DashThis pulls Google Analytics, Meta Ads, and Google Ads into one auto-updating dashboard. Kills the monthly 'build the client report' time drain.",
  },
  {
    id: "canva-brand-kit",
    name: "Canva Magic Design + Brand Kit",
    url: "https://www.canva.com",
    tagline: "On-brand templates handled by a team member, not leadership.",
    tier: "quick-win",
    categories: ["design-automation", "content-generation"],
    monthlyCost: 0,
    costLabel: "$0 (Free) or $15/mo Pro",
    setupMinutes: 90,
    weeklyHoursSaved: 2,
    recommendationBlurb:
      "Build a Brand Kit once (colors, fonts, logo), set up 3–5 templates for recurring needs, train a team member to own execution. Design tasks stop reaching leadership.",
  },
  {
    id: "calendly",
    name: "Calendly",
    url: "https://calendly.com",
    tagline: "Self-serve booking link replaces the 'what times work?' thread.",
    tier: "quick-win",
    categories: ["scheduling", "reminders"],
    monthlyCost: 12,
    costLabel: "$12/mo",
    setupMinutes: 20,
    weeklyHoursSaved: 2,
    recommendationBlurb:
      "Calendly kills the back-and-forth of scheduling. Embed on your site or drop in your email signature. Automatic reminders cut no-shows by ~30%.",
  },
  {
    id: "twilio-reminders",
    name: "Twilio SMS reminders",
    url: "https://www.twilio.com",
    tagline: "Automated appointment reminder texts.",
    tier: "quick-win",
    categories: ["reminders", "sms-marketing"],
    monthlyCost: 15,
    costLabel: "~$15/mo at SMB volume",
    setupMinutes: 120,
    weeklyHoursSaved: 2,
    recommendationBlurb:
      "A simple automated text reminder 24 hours before an appointment drops no-show rates by 20–40%. Pay-per-text, usually under $20/mo for a small shop.",
  },
  {
    id: "nicejob",
    name: "NiceJob",
    url: "https://nicejob.co",
    tagline: "Automates review asks after job completion.",
    tier: "quick-win",
    categories: ["review-generation"],
    monthlyCost: 75,
    costLabel: "$75/mo",
    setupMinutes: 30,
    weeklyHoursSaved: 1,
    recommendationBlurb:
      "After each job, NiceJob texts and emails the customer asking for a Google review. Happy customers click through; unhappy ones get routed to you first. Reviews compound.",
  },
  {
    id: "google-workspace-appointment-schedule",
    name: "Google Workspace Appointment Schedules",
    url: "https://workspace.google.com",
    tagline: "Free Calendly alternative if you're already on Workspace.",
    tier: "quick-win",
    categories: ["scheduling"],
    monthlyCost: 0,
    costLabel: "Included in Workspace",
    setupMinutes: 15,
    weeklyHoursSaved: 2,
    recommendationBlurb:
      "If you're already on Google Workspace, appointment schedules is free and does 80% of what Calendly does. Worth starting here before adding another subscription.",
  },
  {
    id: "jane-app",
    name: "Jane (practice management)",
    url: "https://jane.app",
    tagline: "Scheduling, intake, and billing for healthcare/wellness.",
    tier: "quick-win",
    categories: ["scheduling", "billing-automation", "compliance"],
    monthlyCost: 79,
    costLabel: "$79+/mo",
    setupMinutes: 120,
    weeklyHoursSaved: 4,
    bestForIndustries: ["healthcare", "wellness"],
    complianceFlags: ["hipaa"],
    recommendationBlurb:
      "Jane handles scheduling, intake forms, SOAP notes, and billing in one HIPAA-compliant platform. Built for solo practitioners and small clinics.",
  },
  {
    id: "servicetitan-starter",
    name: "ServiceTitan / Housecall Pro",
    url: "https://housecallpro.com",
    tagline: "Dispatch, quotes, and invoicing for home-service businesses.",
    tier: "quick-win",
    categories: ["job-dispatch", "quoting-estimating", "billing-automation"],
    monthlyCost: 79,
    costLabel: "$79+/mo",
    setupMinutes: 180,
    weeklyHoursSaved: 5,
    bestForIndustries: ["home-services", "commercial-cleaning", "auto-repair"],
    recommendationBlurb:
      "One app for scheduling, dispatching, quoting, and invoicing. Housecall Pro is the SMB-friendly option; ServiceTitan is the premium tier.",
  },
  {
    id: "grain",
    name: "Grain",
    url: "https://grain.com",
    tagline: "Fathom alternative with stronger CRM sync.",
    tier: "quick-win",
    categories: ["meeting-notes"],
    monthlyCost: 19,
    costLabel: "$19/user/mo",
    setupMinutes: 15,
    weeklyHoursSaved: 2,
    recommendationBlurb:
      "Grain records sales calls, extracts highlights, and pushes them into your CRM automatically. Popular with revenue teams that live in HubSpot or Salesforce.",
  },

  /* ================================================================
     MAJOR PROJECTS — upsells after the quick wins land
     ================================================================ */

  {
    id: "gohighlevel",
    name: "GoHighLevel",
    url: "https://www.gohighlevel.com",
    tagline: "All-in-one CRM + SMS + email + funnel platform for agencies.",
    tier: "major-project",
    categories: ["crm", "email-automation", "sms-marketing"],
    monthlyCost: 97,
    costLabel: "$97–297/mo",
    setupMinutes: 600,
    weeklyHoursSaved: 6,
    recommendationBlurb:
      "GoHighLevel consolidates CRM, SMS, email, calendars, and funnels into one platform. Implementation is a 2–3 week project — scoped as a separate $3–5K engagement.",
  },
  {
    id: "twenty-crm",
    name: "Twenty (self-hosted CRM)",
    url: "https://twenty.com",
    tagline: "Open-source Linear-style CRM, self-hosted.",
    tier: "major-project",
    categories: ["crm"],
    monthlyCost: 149,
    costLabel: "$149/mo managed hosting",
    setupMinutes: 480,
    weeklyHoursSaved: 5,
    recommendationBlurb:
      "Open-source CRM with a clean Linear-style UI. We self-host for you on dedicated infrastructure, wire in custom integrations, and you own the data. Premium tier alternative to GHL.",
  },
  {
    id: "custom-gpt",
    name: "Custom GPT / Claude Skill",
    url: "https://www.anthropic.com/agents",
    tagline: "Trained on your docs for brand-voice content or customer FAQs.",
    tier: "major-project",
    categories: ["content-generation", "knowledge-base"],
    monthlyCost: 0,
    costLabel: "Depends on usage",
    setupMinutes: 480,
    weeklyHoursSaved: 4,
    recommendationBlurb:
      "We build a custom GPT or Claude Skill trained on your brand guidelines, past content, and SOPs. Content creation and FAQ responses become consistent at scale.",
  },
  {
    id: "speed-to-lead-chatbot",
    name: "Speed-to-Lead AI chatbot",
    url: "https://stackconsultingai.com",
    tagline: "AI chat that responds to website inquiries and books calls.",
    tier: "major-project",
    categories: ["ai-chat-widget", "speed-to-lead", "lead-response"],
    monthlyCost: 200,
    costLabel: "$200/mo + setup",
    setupMinutes: 480,
    weeklyHoursSaved: 3,
    recommendationBlurb:
      "An AI chat widget that responds to new inquiries in under 10 seconds, qualifies the lead, and books a call. Speed-to-lead is the highest-leverage upsell — it ties directly to revenue.",
  },
  {
    id: "freeswitch-ai-ivr",
    name: "Custom AI Voice Agent",
    url: "https://stackconsultingai.com",
    tagline: "AI phone agent that books appointments and escalates to humans.",
    tier: "major-project",
    categories: ["ai-voice-agent"],
    monthlyCost: 150,
    costLabel: "$150/mo + $3–5K setup",
    setupMinutes: 2400,
    weeklyHoursSaved: 8,
    recommendationBlurb:
      "Our signature build — a custom VoIP AI voice agent we design and deploy for you. Books appointments, routes after-hours, hands off to humans when it gets confused. Owned by you.",
  },
  {
    id: "zapier-make-automation",
    name: "Zapier / Make.com automations",
    url: "https://zapier.com",
    tagline: "Custom cross-app automations (CRM, docs, email triggers).",
    tier: "major-project",
    categories: ["follow-up-automation", "crm"],
    monthlyCost: 20,
    costLabel: "$20–50/mo + $1–3K setup",
    setupMinutes: 600,
    weeklyHoursSaved: 5,
    recommendationBlurb:
      "We design and build the specific automations your business needs — new-client onboarding flows, invoice reminders, data sync between CRM and email. Billed as a setup project plus the monthly Zapier/Make cost.",
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    url: "https://www.pipedrive.com",
    tagline: "Simple sales-pipeline CRM for teams under 10.",
    tier: "major-project",
    categories: ["crm"],
    monthlyCost: 24,
    costLabel: "$24/user/mo",
    setupMinutes: 240,
    weeklyHoursSaved: 3,
    recommendationBlurb:
      "Pipedrive is the sweet spot for small teams — visual pipeline, auto-capture from email, decent integrations. Lighter than Salesforce, more structured than a spreadsheet.",
  },

  /* ================================================================
     FILL-INS — low effort, low impact. Only recommend if asked.
     ================================================================ */

  {
    id: "loom",
    name: "Loom",
    url: "https://www.loom.com",
    tagline: "Screen-recorded async updates instead of meetings.",
    tier: "fill-in",
    categories: ["content-generation"],
    monthlyCost: 15,
    costLabel: "$15/user/mo",
    setupMinutes: 5,
    weeklyHoursSaved: 1,
    recommendationBlurb:
      "Loom is useful for async explanations — 'here's what I did, watch this 2-min video' instead of a meeting. Low-leverage until your team has the muscle memory for async.",
  },
  {
    id: "beehiiv",
    name: "Beehiiv",
    url: "https://www.beehiiv.com",
    tagline: "Modern newsletter platform with built-in monetization.",
    tier: "fill-in",
    categories: ["email-automation", "content-generation"],
    monthlyCost: 0,
    costLabel: "Free up to 2,500 subs",
    setupMinutes: 30,
    weeklyHoursSaved: 0.5,
    recommendationBlurb:
      "If you're thinking about a newsletter, Beehiiv is the cleanest current option. Free up to 2,500 subscribers. Monetization hooks if you grow.",
  },
];

/* ================================================================
   PUBLIC HELPERS
   ================================================================ */

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.categories.includes(category));
}

export function getToolsByTier(tier: Tier): Tool[] {
  return TOOLS.filter((t) => t.tier === tier);
}

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}

/** Compact catalog for Claude's prompt (drops blurbs to save tokens) */
export function compactCatalogForPrompt(): string {
  return TOOLS.map(
    (t) =>
      `- ${t.id} | ${t.name} | tier:${t.tier} | cats:[${t.categories.join(
        ","
      )}] | ${t.costLabel} | setup:${t.setupMinutes}m | saves:${
        t.weeklyHoursSaved
      }h/wk${
        t.bestForIndustries?.length
          ? ` | best:[${t.bestForIndustries.join(",")}]`
          : ""
      }${
        t.complianceFlags?.length
          ? ` | compliance:[${t.complianceFlags.join(",")}]`
          : ""
      }`
  ).join("\n");
}
