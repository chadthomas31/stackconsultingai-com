import type { VerticalAiServiceConfig } from "@/components/VerticalAiServicePage";

export const verticalAiServices = {
  "ai-receptionist-orange-county": {
    slug: "ai-receptionist-orange-county",
    label: "AI Receptionist Orange County",
    eyebrow: "AI receptionist · Orange County",
    title: "AI receptionist builds for Orange County businesses that miss calls.",
    description:
      "We build phone agents that answer after hours, qualify leads, book appointments, and hand off to your team with call notes. Local implementation from San Clemente, using FreeSWITCH, OpenAI Realtime, and the systems you already run.",
    audience: "local service businesses",
    proof:
      "The same voice-agent stack powers Stack's live assessment line and vertical demos for HVAC, plumbing, auto, and medspa workflows.",
    primaryOffer: "A phone path that captures demand instead of sending it to voicemail.",
    pains: [
      "After-hours callers get an answer, not a voicemail box.",
      "Good leads are tagged by service type, urgency, and next step.",
      "Booked calls and callback requests show up as measurable GA4 lead events.",
      "Your team owns the phone numbers, prompts, call logs, and handoff rules.",
    ],
    builds: [
      {
        title: "Inbound call handling",
        detail:
          "A branded AI receptionist answers common questions, captures contact info, and routes urgent calls to the right human.",
      },
      {
        title: "Booking and callback logic",
        detail:
          "Calendar-aware booking, callback windows, and missed-call text-back flows that match how your team works.",
      },
      {
        title: "Lead summaries",
        detail:
          "Every conversation becomes a structured summary with caller intent, service need, location, urgency, and recommended follow-up.",
      },
      {
        title: "CRM and analytics handoff",
        detail:
          "Push call outcomes into your CRM, inbox, Slack, Supabase, or GoHighLevel, plus GA4 events for conversion tracking.",
      },
    ],
    outcomes: [
      {
        metric: "24/7",
        label: "Coverage",
        detail: "Answer calls nights, weekends, and lunch rush without staffing a second desk.",
      },
      {
        metric: "<5m",
        label: "Follow-up",
        detail: "Route qualified callbacks fast while the buyer still remembers why they called.",
      },
      {
        metric: "1",
        label: "Owner",
        detail: "Founder-led build, scope, QA, and handoff. No offshore ticket queue.",
      },
    ],
    faqs: [
      {
        q: "Is this a generic AI answering service?",
        a: "No. We build a custom receptionist around your services, calendar, escalation rules, and customer language. You own the accounts and call path.",
      },
      {
        q: "Can it transfer to a real person?",
        a: "Yes. We can warm-transfer urgent calls, send SMS alerts, or queue a callback depending on your staffing and business hours.",
      },
      {
        q: "What does an AI receptionist cost?",
        a: "Most pilots start around $5,000 plus phone and model usage. Multi-location or multi-persona builds cost more, but we scope fixed-price before writing code.",
      },
    ],
    related: [
      { label: "AI Receptionist pillar", href: "/ai-receptionist" },
      { label: "Live demos", href: "/demos" },
      { label: "AI Consulting Orange County", href: "/services/ai-consulting-orange-county" },
    ],
  },
  "ai-receptionist-for-hvac": {
    slug: "ai-receptionist-for-hvac",
    label: "AI Receptionist for HVAC",
    eyebrow: "AI receptionist · HVAC",
    title: "AI receptionist for HVAC companies that need every urgent call captured.",
    description:
      "We build HVAC phone agents that screen no-heat, no-cool, maintenance, quote, and emergency calls, then route the right job details to dispatch.",
    audience: "HVAC contractors",
    proof:
      "The HVAC demo already handles urgency, equipment symptoms, appointment windows, and dispatch-style follow-up.",
    primaryOffer: "A dispatch-aware receptionist for seasonal call spikes.",
    pains: [
      "Emergency and non-emergency calls get separated before they hit dispatch.",
      "System type, symptom, location, and preferred time window are captured up front.",
      "Maintenance-plan and replacement leads are flagged for different follow-up.",
      "Booking and phone-click events become trackable demand signals.",
    ],
    builds: [
      {
        title: "HVAC triage script",
        detail:
          "Prompt flow for no-cool, no-heat, maintenance, replacement estimate, indoor air quality, and warranty questions.",
      },
      {
        title: "Dispatch handoff",
        detail:
          "Structured summaries with urgency, address, equipment notes, photos link if needed, and the next best callback.",
      },
      {
        title: "Calendar or FSM integration",
        detail:
          "Connect to Google Calendar, Housecall Pro-style workflows, GoHighLevel, or a custom dispatch sheet.",
      },
      {
        title: "Seasonal reporting",
        detail:
          "Track calls by service category so busy-season marketing produces usable data, not just call volume.",
      },
    ],
    outcomes: [
      { metric: "0", label: "Lost after-hours calls", detail: "Give buyers a path even when the office is closed." },
      { metric: "4", label: "Core job types", detail: "Repair, maintenance, replacement, and emergency routing." },
      { metric: "GA4", label: "Lead visibility", detail: "Tie HVAC landing-page traffic to calls and booked jobs." },
    ],
    faqs: [
      {
        q: "Can the AI book directly on our HVAC calendar?",
        a: "Yes, if your scheduling process has clean availability rules. If not, we start with qualified callback routing and add booking after the workflow is stable.",
      },
      {
        q: "Will it pretend to diagnose equipment?",
        a: "No. It collects symptoms and safety context, then routes the call. It does not give unsafe repair instructions or act like a licensed technician.",
      },
      {
        q: "Can it handle emergency calls?",
        a: "It can identify urgency and escalate based on your rules. True emergency handling should always include a human escalation path.",
      },
    ],
    related: [
      { label: "Try the HVAC demo", href: "/demos/hvac" },
      { label: "AI Receptionist Orange County", href: "/services/ai-receptionist-orange-county" },
      { label: "Business Automation", href: "/services/business-automation" },
    ],
  },
  "ai-receptionist-for-medspas": {
    slug: "ai-receptionist-for-medspas",
    label: "AI Receptionist for Medspas",
    eyebrow: "AI receptionist · Medspas",
    title: "AI receptionist for medspas that need polished intake and faster booking.",
    description:
      "We build discreet AI receptionists for medspas and aesthetics clinics: treatment interest, consultation routing, booking windows, and safe handoff to staff.",
    audience: "medspas and aesthetics clinics",
    proof:
      "The medspa demo is designed around treatment interest, new-client consultation flow, and safe non-medical language.",
    primaryOffer: "A front-desk assistant that protects trust while capturing demand.",
    pains: [
      "New client inquiries get a fast answer without quoting medical advice.",
      "Treatment interest and timing are captured before staff follow up.",
      "Consultation requests are separated from price shoppers and generic questions.",
      "Phone, booking, and demo requests become measurable key-event candidates.",
    ],
    builds: [
      {
        title: "Treatment-aware intake",
        detail:
          "Capture interest in Botox, filler, laser, facial, body contouring, consultation, or other services without overstepping medical boundaries.",
      },
      {
        title: "Consultation routing",
        detail:
          "Send new-client requests to the right provider, calendar, or callback queue with notes your team can use.",
      },
      {
        title: "Policy-safe responses",
        detail:
          "Keep language clear around pricing, eligibility, and provider confirmation so the agent supports staff instead of replacing judgment.",
      },
      {
        title: "CRM follow-up",
        detail:
          "Push structured leads into GoHighLevel, HubSpot, email, or a Supabase dashboard for speed-to-lead tracking.",
      },
    ],
    outcomes: [
      { metric: "24/7", label: "Lead intake", detail: "Catch evening and weekend inquiries from Instagram and Google." },
      { metric: "1st", label: "Consultation focus", detail: "Route serious new clients to the next right step." },
      { metric: "Safe", label: "Boundaries", detail: "No fake medical certainty, no unsafe quote scripts." },
    ],
    faqs: [
      {
        q: "Can the AI give treatment prices?",
        a: "It can share approved general language if you provide it, but it should route final pricing and eligibility to your provider or front desk.",
      },
      {
        q: "Can it book consultations?",
        a: "Yes. We can connect it to your calendar or start with callback requests if your scheduling rules need cleanup first.",
      },
      {
        q: "Will it sound like our brand?",
        a: "Yes. We write the prompt around your tone, policies, treatment menu, and escalation rules.",
      },
    ],
    related: [
      { label: "Try the medspa demo", href: "/demos/medspa" },
      { label: "AI Receptionist", href: "/ai-receptionist" },
      { label: "Free AI Site Audit", href: "/free-ai-site-audit" },
    ],
  },
  "ai-receptionist-for-auto-shops": {
    slug: "ai-receptionist-for-auto-shops",
    label: "AI Receptionist for Auto Shops",
    eyebrow: "AI receptionist · Auto repair",
    title: "AI receptionist for auto shops that need better service intake.",
    description:
      "We build auto-shop phone agents that capture vehicle, symptom, service, drop-off, and mobile repair details before your advisor calls back.",
    audience: "auto repair shops",
    proof:
      "Stack has shipped local auto and service-business work, including booking and follow-up systems for Southern California operators.",
    primaryOffer: "A service-advisor intake flow for missed calls and busy counters.",
    pains: [
      "Caller name, vehicle, issue, location, and urgency are captured consistently.",
      "Drop-off, mobile, warranty, and estimate requests are routed differently.",
      "Simple questions get answered while complex repair decisions go to staff.",
      "Marketing traffic can be tied to calls, callback requests, and booked work.",
    ],
    builds: [
      {
        title: "Vehicle intake",
        detail:
          "Capture year, make, model, symptom, warning lights, service type, and whether the vehicle is drivable.",
      },
      {
        title: "Appointment request flow",
        detail:
          "Collect preferred drop-off windows or mobile-service details and pass them to your service advisor.",
      },
      {
        title: "Advisor handoff",
        detail:
          "Send a clean summary by email, SMS, Slack, CRM, or dashboard so staff can call back with context.",
      },
      {
        title: "Follow-up reporting",
        detail:
          "Track which pages and campaigns generate service requests instead of measuring only raw traffic.",
      },
    ],
    outcomes: [
      { metric: "40%", label: "Booking lift proof", detail: "A local service booking build increased appointments in 90 days." },
      { metric: "5", label: "Core fields", detail: "Vehicle, issue, urgency, location, and next step." },
      { metric: "Fast", label: "Advisor prep", detail: "Fewer cold callbacks with missing vehicle details." },
    ],
    faqs: [
      {
        q: "Can it quote repair prices?",
        a: "It should not guess repair pricing. It can collect details, share approved diagnostic fee language, and route the request to your advisor.",
      },
      {
        q: "Can it work for mobile mechanics?",
        a: "Yes. The intake can collect service location, driveway access, vehicle status, and travel radius before a human confirms.",
      },
      {
        q: "Can it integrate with our shop software?",
        a: "Usually. If your shop system has an API or email workflow, we can connect directly or start with structured summaries while we validate the integration.",
      },
    ],
    related: [
      { label: "Try the auto demo", href: "/demos/auto" },
      { label: "AI Receptionist Orange County", href: "/services/ai-receptionist-orange-county" },
      { label: "Portfolio", href: "/portfolio" },
    ],
  },
  "business-automation-orange-county": {
    slug: "business-automation-orange-county",
    label: "Business Automation Orange County",
    eyebrow: "Business automation · Orange County",
    title: "Business automation for Orange County teams stuck in copy-paste work.",
    description:
      "We connect forms, phones, calendars, CRM, email, invoices, and reporting so small teams stop retyping the same information across tools.",
    audience: "Orange County small businesses",
    proof:
      "Stack builds with practical tools like Supabase, Vercel, n8n, Make, Google Workspace, Resend, and FreeSWITCH, then documents the system so clients keep the keys.",
    primaryOffer: "A practical workflow audit followed by one fixed-scope automation.",
    pains: [
      "Leads move from form or phone call to follow-up without manual copying.",
      "Reports are generated from real system data, not spreadsheet archaeology.",
      "Owner alerts happen when the business risk is real, not for every notification.",
      "Automation completion and lead events show up clearly in analytics.",
    ],
    builds: [
      {
        title: "Lead routing",
        detail:
          "Move contacts from website forms, call summaries, and tools into the right inbox, CRM, or pipeline.",
      },
      {
        title: "Document generation",
        detail:
          "Create quotes, proposals, reports, and customer updates from live data instead of hand-built templates.",
      },
      {
        title: "Operations dashboards",
        detail:
          "Track what owners actually ask about: new leads, stuck follow-ups, missed calls, revenue signals, and open work.",
      },
      {
        title: "AI-assisted workflows",
        detail:
          "Use Claude, OpenAI, Gemini, or smaller models where they make sense, with human review on risky outputs.",
      },
    ],
    outcomes: [
      { metric: "8+", label: "Hours back", detail: "Typical first target for weekly admin work removed." },
      { metric: "2-6w", label: "Build window", detail: "Most fixed-scope automations ship inside a few weeks." },
      { metric: "Owned", label: "Handoff", detail: "Your accounts, your docs, your repo where applicable." },
    ],
    faqs: [
      {
        q: "Do you replace our whole software stack?",
        a: "Usually no. We start by connecting the tools you already use, then replace tools only when the current system is the bottleneck.",
      },
      {
        q: "Can you automate QuickBooks, Google Sheets, or a CRM?",
        a: "Yes, depending on API access and permissions. We prefer reliable APIs and approved webhooks over brittle browser automation.",
      },
      {
        q: "What should we automate first?",
        a: "Start where delay costs money: new leads, missed calls, quote follow-up, invoice collection, scheduling, or owner reporting.",
      },
    ],
    related: [
      { label: "Business Automation", href: "/services/business-automation" },
      { label: "Automation Finder", href: "/tools/automation-finder" },
      { label: "AI Automation Guide", href: "/ai-automation-small-business-guide" },
    ],
  },
  "website-automation-audit-orange-county": {
    slug: "website-automation-audit-orange-county",
    label: "Website Automation Audit Orange County",
    eyebrow: "Website audit · Orange County",
    title: "Website automation audit for Orange County businesses with traffic but no leads.",
    description:
      "We review your website, analytics, forms, phone links, booking flow, and follow-up process so organic traffic turns into trackable lead activity.",
    audience: "small-business owners with under-measured traffic",
    proof:
      "This page exists because a real GA4 review showed early traffic, strong engagement from U.S. visitors, and zero key events configured.",
    primaryOffer: "A lead-path audit that looks beyond Lighthouse scores.",
    pains: [
      "Contact, phone, email, booking, newsletter, and audit actions are measured.",
      "Search Console queries are mapped to the right pages before title changes.",
      "Local and vertical SEO pages get clear ownership instead of keyword overlap.",
      "The report separates technical SEO, content gaps, and conversion gaps.",
    ],
    builds: [
      {
        title: "Analytics event map",
        detail:
          "Define which clicks, forms, demo starts, and audit requests should become GA4 events or key events.",
      },
      {
        title: "Search Console review",
        detail:
          "Map query and page ownership so you know which pages Google already trusts and where gaps exist.",
      },
      {
        title: "Lead-path teardown",
        detail:
          "Test forms, call links, booking links, email links, CTA clarity, confirmation states, and follow-up timing.",
      },
      {
        title: "Fix list",
        detail:
          "Prioritize changes by business impact: tracking first, then internal links, then new landing pages and content.",
      },
    ],
    outcomes: [
      { metric: "0->", label: "Key events", detail: "Turn invisible lead activity into events GA4 can report on." },
      { metric: "GSC", label: "Query map", detail: "Use impressions and clicks before rewriting pages." },
      { metric: "1", label: "Lead offer", detail: "Clarify the main next step for organic visitors." },
    ],
    faqs: [
      {
        q: "Is this different from a free SEO audit tool?",
        a: "Yes. Tools find technical issues. This audit checks whether real visitors can become measurable leads.",
      },
      {
        q: "Do you need access to GA4 and Search Console?",
        a: "For the best answer, yes. Without access, we can still inspect the public site and recommend the event map.",
      },
      {
        q: "What should be marked as a GA4 key event?",
        a: "Usually form submits, booked calls, callback requests, phone clicks, and qualified demo requests. Newsletter signups are useful, but usually secondary.",
      },
    ],
    related: [
      { label: "Free AI Site Audit", href: "/free-ai-site-audit" },
      { label: "Site Audit Tool", href: "/tools/site-audit" },
      { label: "SEO Audit Tool", href: "/tools/seo-audit" },
    ],
  },
} satisfies Record<string, VerticalAiServiceConfig>;

export type VerticalAiServiceSlug = keyof typeof verticalAiServices;
