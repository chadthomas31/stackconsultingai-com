/**
 * AI Tools Assessment — interview script catalog
 *
 * Stacks (the OpenAI Realtime voice agent) uses this to conduct an industry-
 * specific 20–30 minute business audit. The caller picks an industry from
 * the homepage assessment widget; we build a system prompt from the matching script
 * and feed it to the agent. After the call, Claude extracts structured data
 * against these field names to generate the report.
 *
 * Edit freely — questions here drive both the agent behavior AND the
 * downstream extraction schema. Keep `extractsField` stable (downstream
 * consumers key off it).
 */

export type ToolCategory =
  | "scheduling"
  | "reminders"
  | "lead-response"
  | "speed-to-lead"
  | "review-generation"
  | "crm"
  | "email-triage"
  | "email-automation"
  | "sms-marketing"
  | "meeting-notes"
  | "reporting-dashboards"
  | "quoting-estimating"
  | "proposal-generation"
  | "inventory"
  | "billing-automation"
  | "time-tracking"
  | "payment-automation"
  | "ai-voice-agent"
  | "ai-chat-widget"
  | "content-generation"
  | "design-automation"
  | "social-media"
  | "follow-up-automation"
  | "compliance"
  | "job-dispatch"
  | "project-management"
  | "knowledge-base";

export interface Question {
  /** Stable id, used by Claude's extraction schema */
  id: string;
  /** Verbatim question Stacks asks the caller */
  text: string;
  /** If answer is vague or < 1 sentence, Stacks asks this follow-up */
  probeFollowup?: string;
  /** Field name in the structured output JSON */
  extractsField: string;
  /** Tool categories this question surfaces. Used to narrow recommendations. */
  mapsToToolCategory: ToolCategory[];
  /** Optional hint shown to Claude during extraction, not spoken */
  extractionHint?: string;
}

export interface IndustryScript {
  id: string;
  label: string;
  emoji: string;
  /** Short intro line Stacks uses after the base intro, before the industry Qs */
  transition: string;
  questions: Question[];
}

/* ============================================================
   BASE — asked for every caller regardless of industry
   ============================================================ */

export const BASE_INTRO: Question[] = [
  {
    id: "intro.name_and_business",
    text: "First — your name, and what's the name of your business?",
    extractsField: "caller_name_and_business",
    mapsToToolCategory: [],
    extractionHint: "Two fields: { callerName, businessName }",
  },
  {
    id: "intro.tenure",
    text: "And how long have you been running it?",
    extractsField: "years_in_business",
    mapsToToolCategory: [],
  },
  {
    id: "intro.team_size",
    text: "How many people on the team, including you?",
    probeFollowup: "Does that include contractors and part-time, or just full-time?",
    extractsField: "team_size",
    mapsToToolCategory: [],
  },
];

export const BASE_CLOSER: Question[] = [
  {
    id: "closer.biggest_pain",
    text: "Of everything we just talked about, which of these pain points stings the most day-to-day?",
    extractsField: "biggest_pain_point",
    mapsToToolCategory: [],
    extractionHint: "Match to one of the earlier question ids when possible.",
  },
  {
    id: "closer.budget_comfort",
    text: "If I told you a tool could give you back five hours a week for around fifty dollars a month, what's the first thing you'd want to know about it?",
    extractsField: "budget_posture",
    mapsToToolCategory: [],
    extractionHint: "Gauges price sensitivity. Score: { conservative, open, aggressive }.",
  },
  {
    id: "closer.unsaid",
    text: "Anything I didn't ask about that you think matters?",
    extractsField: "additional_context",
    mapsToToolCategory: [],
  },
  {
    id: "closer.email",
    text: "Last one — what's the best email to send your assessment to?",
    probeFollowup: "Can you spell that out for me, letter by letter, so I get it right?",
    extractsField: "email",
    mapsToToolCategory: [],
  },
];

/* ============================================================
   INDUSTRY-SPECIFIC SCRIPTS
   ============================================================ */

export const INDUSTRY_SCRIPTS: Record<string, IndustryScript> = {
  /* ---------------- Auto repair ---------------- */
  "auto-repair": {
    id: "auto-repair",
    label: "Auto repair / automotive service",
    emoji: "🔧",
    transition:
      "Got it — auto repair. Let me ask you some questions about how the shop runs day-to-day.",
    questions: [
      {
        id: "auto.booking_flow",
        text: "Walk me through what happens when someone needs a repair — how do they find you, and how does an appointment end up on the calendar?",
        probeFollowup: "Is that call, online form, walk-in, or a mix?",
        extractsField: "booking_flow",
        mapsToToolCategory: ["scheduling", "lead-response"],
      },
      {
        id: "auto.weekly_volume",
        text: "How many cars come through in a typical week, and what's your no-show rate look like?",
        extractsField: "weekly_volume_and_no_shows",
        mapsToToolCategory: ["scheduling", "reminders"],
      },
      {
        id: "auto.after_hours",
        text: "How are you handling calls that come in after hours or on weekends right now?",
        probeFollowup: "Does that mean phone calls go to voicemail, or does someone always catch them?",
        extractsField: "after_hours_process",
        mapsToToolCategory: ["ai-voice-agent"],
      },
      {
        id: "auto.pickup_notification",
        text: "When a car is ready for pickup, how do you let the customer know?",
        extractsField: "pickup_notification_flow",
        mapsToToolCategory: ["sms-marketing"],
      },
      {
        id: "auto.follow_up",
        text: "What do you do to follow up with customers 30 or 90 days after service?",
        extractsField: "service_follow_up",
        mapsToToolCategory: ["crm", "follow-up-automation", "sms-marketing"],
      },
      {
        id: "auto.parts_ordering",
        text: "What does your parts-ordering process look like — is there a lot of back-and-forth with suppliers?",
        extractsField: "parts_ordering_flow",
        mapsToToolCategory: ["inventory"],
      },
      {
        id: "auto.reviews",
        text: "How are you getting reviews from happy customers today?",
        extractsField: "review_generation_flow",
        mapsToToolCategory: ["review-generation"],
      },
      {
        id: "auto.weekly_time_suck",
        text: "If I watched you run the shop for a week, what's the task that would make me think 'there's got to be a better way'?",
        extractsField: "weekly_time_suck",
        mapsToToolCategory: [],
      },
    ],
  },

  /* ---------------- Healthcare / medical practice ---------------- */
  healthcare: {
    id: "healthcare",
    label: "Healthcare / medical practice",
    emoji: "🩺",
    transition:
      "Got it — medical practice. I'll ask about patient flow, admin, and compliance.",
    questions: [
      {
        id: "health.new_patient_flow",
        text: "How do new patients typically find you, and what does their first appointment booking look like?",
        extractsField: "new_patient_flow",
        mapsToToolCategory: ["lead-response", "scheduling"],
      },
      {
        id: "health.intake",
        text: "Walk me through a new patient intake — from the first call to their first session.",
        extractsField: "intake_process",
        mapsToToolCategory: ["compliance", "scheduling"],
      },
      {
        id: "health.insurance_billing",
        text: "How are you handling insurance verification and billing today — manual, software, billing service?",
        extractsField: "insurance_billing_flow",
        mapsToToolCategory: ["billing-automation"],
      },
      {
        id: "health.no_show_rate",
        text: "What's your no-show rate, and how do you handle cancellations?",
        extractsField: "no_show_and_cancellation",
        mapsToToolCategory: ["reminders", "scheduling"],
      },
      {
        id: "health.appointment_reminders",
        text: "How are you reminding patients about upcoming appointments right now?",
        extractsField: "reminder_flow",
        mapsToToolCategory: ["reminders", "sms-marketing"],
      },
      {
        id: "health.records_compliance",
        text: "How are you storing patient records, and is anything HIPAA-related keeping you up at night?",
        extractsField: "records_and_compliance",
        mapsToToolCategory: ["compliance"],
        extractionHint: "Flag any HIPAA compliance concerns for the recommendation filter — DO NOT recommend non-compliant tools.",
      },
      {
        id: "health.referral_tracking",
        text: "Do you know which referral sources send you your best patients, or is that a black box?",
        extractsField: "referral_tracking",
        mapsToToolCategory: ["crm", "reporting-dashboards"],
      },
      {
        id: "health.front_desk_pain",
        text: "What's the most repetitive administrative task your front desk handles every week?",
        extractsField: "front_desk_time_suck",
        mapsToToolCategory: [],
      },
    ],
  },

  /* ---------------- Home services / handyman ---------------- */
  "home-services": {
    id: "home-services",
    label: "Home services / handyman / repair",
    emoji: "🔨",
    transition:
      "Got it — home services. Let's talk about how jobs move from inquiry to cash in the bank.",
    questions: [
      {
        id: "home.lead_response_time",
        text: "When someone calls or fills out your form, how long before your team actually gets back to them?",
        probeFollowup: "And is that consistent, or only if you happen to see it?",
        extractsField: "lead_response_time",
        mapsToToolCategory: ["speed-to-lead", "lead-response"],
      },
      {
        id: "home.scheduling",
        text: "Walk me through how a job gets on the schedule — who owns that calendar?",
        extractsField: "scheduling_flow",
        mapsToToolCategory: ["scheduling", "job-dispatch"],
      },
      {
        id: "home.quoting",
        text: "How do you handle quotes and estimates — manual each time, or templated?",
        extractsField: "quoting_flow",
        mapsToToolCategory: ["quoting-estimating", "proposal-generation"],
      },
      {
        id: "home.quote_follow_up",
        text: "What do you do for customers who got a quote but didn't book?",
        extractsField: "quote_follow_up",
        mapsToToolCategory: ["follow-up-automation", "crm"],
      },
      {
        id: "home.dispatch",
        text: "How are you dispatching crews or techs to job sites day-to-day?",
        extractsField: "dispatch_flow",
        mapsToToolCategory: ["job-dispatch"],
      },
      {
        id: "home.payment",
        text: "When a job's done, how does payment happen — invoice, on-site card, Venmo?",
        extractsField: "payment_flow",
        mapsToToolCategory: ["payment-automation"],
      },
      {
        id: "home.reviews_referrals",
        text: "How are you collecting reviews and referrals from happy customers?",
        extractsField: "review_flow",
        mapsToToolCategory: ["review-generation"],
      },
      {
        id: "home.admin_drag",
        text: "What's a piece of paperwork or admin task that eats half your day?",
        extractsField: "admin_time_suck",
        mapsToToolCategory: [],
      },
    ],
  },

  /* ---------------- Commercial cleaning ---------------- */
  "commercial-cleaning": {
    id: "commercial-cleaning",
    label: "Commercial cleaning / janitorial",
    emoji: "🧼",
    transition:
      "Got it — commercial cleaning. I'll ask about quoting, crews, and recurring accounts.",
    questions: [
      {
        id: "clean.lead_flow",
        text: "How do new prospects typically find you and end up getting a quote?",
        extractsField: "lead_flow",
        mapsToToolCategory: ["lead-response"],
      },
      {
        id: "clean.quoting_process",
        text: "Walk me through your quoting process — do you always do an onsite walk, or email templates for some?",
        extractsField: "quoting_flow",
        mapsToToolCategory: ["quoting-estimating"],
      },
      {
        id: "clean.crew_dispatch",
        text: "How are you scheduling and dispatching cleaning crews across accounts?",
        extractsField: "crew_dispatch",
        mapsToToolCategory: ["job-dispatch", "scheduling"],
      },
      {
        id: "clean.recurring_billing",
        text: "What does your recurring billing workflow look like for monthly contracts?",
        extractsField: "recurring_billing",
        mapsToToolCategory: ["billing-automation"],
      },
      {
        id: "clean.quality_control",
        text: "How do you handle quality control — complaints, walkthroughs, follow-ups?",
        extractsField: "qc_flow",
        mapsToToolCategory: ["project-management"],
      },
      {
        id: "clean.supplies_inventory",
        text: "How are you tracking supplies and inventory across different accounts?",
        extractsField: "supplies_tracking",
        mapsToToolCategory: ["inventory"],
      },
      {
        id: "clean.time_payroll",
        text: "What's your employee time-tracking and payroll process look like?",
        extractsField: "time_and_payroll",
        mapsToToolCategory: ["time-tracking"],
      },
      {
        id: "clean.weekly_pain",
        text: "What's the single most annoying weekly task still sitting on your desk?",
        extractsField: "weekly_time_suck",
        mapsToToolCategory: [],
      },
    ],
  },

  /* ---------------- Commercial construction / trades ---------------- */
  "commercial-construction": {
    id: "commercial-construction",
    label: "Commercial construction / trades",
    emoji: "🏗️",
    transition:
      "Got it — construction. I'll ask about bids, subs, and project control.",
    questions: [
      {
        id: "construction.bid_flow",
        text: "Walk me through how a new project gets from first contact to a signed contract.",
        extractsField: "bid_to_contract_flow",
        mapsToToolCategory: ["proposal-generation", "crm"],
      },
      {
        id: "construction.estimating",
        text: "How are you putting together estimates and bids — spreadsheets, software, both?",
        extractsField: "estimating_flow",
        mapsToToolCategory: ["quoting-estimating"],
      },
      {
        id: "construction.sub_coordination",
        text: "How are subcontractors and job sites being coordinated day-to-day?",
        extractsField: "sub_coordination",
        mapsToToolCategory: ["project-management", "job-dispatch"],
      },
      {
        id: "construction.change_orders",
        text: "What does your change-order workflow look like when scope shifts mid-project?",
        extractsField: "change_order_flow",
        mapsToToolCategory: ["project-management"],
      },
      {
        id: "construction.cost_tracking",
        text: "How are you tracking project costs against budget in real time — or only at month-end?",
        extractsField: "cost_tracking",
        mapsToToolCategory: ["reporting-dashboards"],
      },
      {
        id: "construction.compliance_docs",
        text: "How do you handle compliance documentation — safety, insurance, permits, certifications?",
        extractsField: "compliance_docs",
        mapsToToolCategory: ["compliance"],
      },
      {
        id: "construction.ar_collections",
        text: "What's your AR / collections process when clients are slow to pay?",
        extractsField: "ar_collections",
        mapsToToolCategory: ["billing-automation", "follow-up-automation"],
      },
      {
        id: "construction.automation_target",
        text: "Where does your team spend time on something that feels like it should already be automated?",
        extractsField: "automation_target",
        mapsToToolCategory: [],
      },
    ],
  },

  /* ---------------- E-commerce / retail ---------------- */
  ecommerce: {
    id: "ecommerce",
    label: "E-commerce / online retail",
    emoji: "🛒",
    transition:
      "Got it — e-commerce. Let's talk about the store, fulfillment, and customer flow.",
    questions: [
      {
        id: "ecom.listing_flow",
        text: "Walk me through how a new product listing gets created and published.",
        extractsField: "listing_flow",
        mapsToToolCategory: ["content-generation"],
      },
      {
        id: "ecom.customer_service",
        text: "How are you handling customer service inquiries — email, chat, DMs, all of the above?",
        extractsField: "cs_channels",
        mapsToToolCategory: ["ai-chat-widget", "email-triage"],
      },
      {
        id: "ecom.fulfillment",
        text: "What's your order fulfillment workflow — from checkout to shipped box?",
        extractsField: "fulfillment_flow",
        mapsToToolCategory: ["inventory"],
      },
      {
        id: "ecom.inventory_tracking",
        text: "How are you tracking inventory across the products you carry?",
        extractsField: "inventory_tracking",
        mapsToToolCategory: ["inventory"],
      },
      {
        id: "ecom.returns",
        text: "How do you handle return or refund requests?",
        extractsField: "returns_flow",
        mapsToToolCategory: ["ai-chat-widget"],
      },
      {
        id: "ecom.repeat_customers",
        text: "What's your repeat-customer rate, and what are you doing to build loyalty?",
        extractsField: "repeat_customer_flow",
        mapsToToolCategory: ["email-automation", "sms-marketing"],
      },
      {
        id: "ecom.email_marketing",
        text: "How are you running email marketing and abandoned-cart follow-ups?",
        extractsField: "email_marketing_flow",
        mapsToToolCategory: ["email-automation", "follow-up-automation"],
      },
      {
        id: "ecom.repetitive_task",
        text: "What's the single most repetitive task you or your team does on this store every week?",
        extractsField: "weekly_time_suck",
        mapsToToolCategory: [],
      },
    ],
  },

  /* ---------------- Food & beverage ---------------- */
  "food-beverage": {
    id: "food-beverage",
    label: "Food & beverage / restaurant / bakery",
    emoji: "🍰",
    transition:
      "Got it — food and beverage. I'll ask about orders, ops, and how you stay in touch with regulars.",
    questions: [
      {
        id: "fnb.order_channels",
        text: "How are customers placing orders today — online, phone, walk-in, or delivery apps?",
        extractsField: "order_channels",
        mapsToToolCategory: ["lead-response"],
      },
      {
        id: "fnb.reservations",
        text: "How are you handling reservations or catering inquiries right now?",
        extractsField: "reservation_flow",
        mapsToToolCategory: ["scheduling", "ai-voice-agent"],
      },
      {
        id: "fnb.prep_inventory",
        text: "What does your daily prep and inventory workflow look like?",
        extractsField: "prep_and_inventory",
        mapsToToolCategory: ["inventory"],
      },
      {
        id: "fnb.staff_scheduling",
        text: "How are you handling staff scheduling — paper, text threads, software?",
        extractsField: "staff_scheduling",
        mapsToToolCategory: ["scheduling", "time-tracking"],
      },
      {
        id: "fnb.loyalty",
        text: "How do you stay in touch with regulars or reward repeat customers?",
        extractsField: "loyalty_flow",
        mapsToToolCategory: ["sms-marketing", "email-automation"],
      },
      {
        id: "fnb.social_media",
        text: "What's your social media rhythm — who's actually posting, and how often?",
        extractsField: "social_media_flow",
        mapsToToolCategory: ["social-media", "content-generation"],
      },
      {
        id: "fnb.reviews",
        text: "How are you handling reviews on Yelp and Google — responding, asking for them?",
        extractsField: "review_flow",
        mapsToToolCategory: ["review-generation"],
      },
      {
        id: "fnb.weekly_fire_drill",
        text: "What's the biggest weekly fire drill that keeps repeating no matter what?",
        extractsField: "weekly_fire_drill",
        mapsToToolCategory: [],
      },
    ],
  },

  /* ---------------- Wellness / holistic ---------------- */
  wellness: {
    id: "wellness",
    label: "Wellness / holistic / coaching",
    emoji: "🌿",
    transition:
      "Got it — wellness practice. Let's talk about clients, sessions, and how you keep the relationship going.",
    questions: [
      {
        id: "wellness.client_journey",
        text: "Walk me through how someone goes from first hearing about you to actually booking a session.",
        extractsField: "client_journey",
        mapsToToolCategory: ["lead-response", "scheduling"],
      },
      {
        id: "wellness.intake_forms",
        text: "How are you handling intake forms, consents, or questionnaires?",
        extractsField: "intake_forms",
        mapsToToolCategory: ["compliance"],
      },
      {
        id: "wellness.cancellations",
        text: "What's your cancellation and no-show handling look like?",
        extractsField: "cancellation_flow",
        mapsToToolCategory: ["reminders", "scheduling"],
      },
      {
        id: "wellness.stay_in_touch",
        text: "How are you keeping in touch with past clients — newsletter, text, email, not at all?",
        extractsField: "re_engagement_flow",
        mapsToToolCategory: ["email-automation", "sms-marketing"],
      },
      {
        id: "wellness.pricing_packages",
        text: "How do you price and sell packages versus single sessions?",
        extractsField: "pricing_structure",
        mapsToToolCategory: ["payment-automation"],
      },
      {
        id: "wellness.content_creation",
        text: "What does your content creation workflow look like — social, blog, email?",
        extractsField: "content_workflow",
        mapsToToolCategory: ["content-generation", "social-media"],
      },
      {
        id: "wellness.session_notes",
        text: "How are you tracking client progress or session notes between appointments?",
        extractsField: "session_notes_flow",
        mapsToToolCategory: ["knowledge-base", "meeting-notes"],
      },
      {
        id: "wellness.non_client_work",
        text: "What's eating your time every week that has nothing to do with actual client sessions?",
        extractsField: "weekly_time_suck",
        mapsToToolCategory: [],
      },
    ],
  },

  /* ---------------- Manufacturing / technical ---------------- */
  manufacturing: {
    id: "manufacturing",
    label: "Manufacturing / CNC / technical",
    emoji: "⚙️",
    transition:
      "Got it — manufacturing. I'll ask about RFQs, production, and supplier flow.",
    questions: [
      {
        id: "mfg.rfq_flow",
        text: "How do new RFQs come in, and what's your quote turnaround time?",
        extractsField: "rfq_flow",
        mapsToToolCategory: ["quoting-estimating", "speed-to-lead"],
      },
      {
        id: "mfg.job_lifecycle",
        text: "Walk me through a typical job — from drawing received to part delivered.",
        extractsField: "job_lifecycle",
        mapsToToolCategory: ["project-management"],
      },
      {
        id: "mfg.production_tracking",
        text: "How are you tracking your production schedule and machine utilization?",
        extractsField: "production_tracking",
        mapsToToolCategory: ["reporting-dashboards", "project-management"],
      },
      {
        id: "mfg.qc_docs",
        text: "What does your quality control documentation process look like?",
        extractsField: "qc_documentation",
        mapsToToolCategory: ["compliance", "knowledge-base"],
      },
      {
        id: "mfg.suppliers",
        text: "How are you handling material and supplier orders?",
        extractsField: "supplier_flow",
        mapsToToolCategory: ["inventory"],
      },
      {
        id: "mfg.customer_acquisition",
        text: "How are new customers finding you — referrals, search, trade shows, past clients?",
        extractsField: "customer_acquisition",
        mapsToToolCategory: ["crm", "email-automation"],
      },
      {
        id: "mfg.follow_up",
        text: "What does post-delivery follow-up look like for repeat orders?",
        extractsField: "post_delivery_flow",
        mapsToToolCategory: ["follow-up-automation", "crm"],
      },
      {
        id: "mfg.admin_vs_production",
        text: "Where are you losing the most time to admin work that takes away from actual production?",
        extractsField: "admin_time_suck",
        mapsToToolCategory: [],
      },
    ],
  },

  /* ---------------- Professional services ---------------- */
  "professional-services": {
    id: "professional-services",
    label: "Professional services (consulting, law, accounting)",
    emoji: "💼",
    transition:
      "Got it — professional services. I'll ask about how you land clients and deliver work.",
    questions: [
      {
        id: "pro.lead_source",
        text: "How does a new client typically find you — referral, content, search, network?",
        extractsField: "lead_source_mix",
        mapsToToolCategory: ["crm"],
      },
      {
        id: "pro.intake",
        text: "Walk me through your intake — from the first call to a signed engagement.",
        extractsField: "intake_flow",
        mapsToToolCategory: ["proposal-generation", "payment-automation"],
      },
      {
        id: "pro.meeting_notes",
        text: "How are you handling meeting notes and action items right now?",
        extractsField: "meeting_notes_flow",
        mapsToToolCategory: ["meeting-notes"],
      },
      {
        id: "pro.recurring_deliverables",
        text: "What's your workflow for recurring client deliverables — monthly reports, check-ins?",
        extractsField: "recurring_deliverables",
        mapsToToolCategory: ["reporting-dashboards", "project-management"],
      },
      {
        id: "pro.proposals",
        text: "How are you generating proposals or statements of work?",
        extractsField: "proposal_flow",
        mapsToToolCategory: ["proposal-generation"],
      },
      {
        id: "pro.billing_time",
        text: "What's your billing and time-tracking process look like?",
        extractsField: "billing_and_time",
        mapsToToolCategory: ["time-tracking", "billing-automation"],
      },
      {
        id: "pro.past_client_touch",
        text: "How are you staying in touch with past clients for repeat or referral work?",
        extractsField: "past_client_touch",
        mapsToToolCategory: ["email-automation", "crm"],
      },
      {
        id: "pro.non_billable",
        text: "What's the most repetitive thing you do every week that isn't billable?",
        extractsField: "non_billable_time_suck",
        mapsToToolCategory: [],
      },
    ],
  },

  /* ---------------- Real estate ---------------- */
  "real-estate": {
    id: "real-estate",
    label: "Real estate / property",
    emoji: "🏡",
    transition:
      "Got it — real estate. I'll ask about leads, listings, and follow-up.",
    questions: [
      {
        id: "re.lead_sources",
        text: "Walk me through how a lead comes in — Zillow, referral, website, sign call?",
        extractsField: "lead_sources",
        mapsToToolCategory: ["lead-response", "crm"],
      },
      {
        id: "re.response_speed",
        text: "How fast does your team typically respond to a new lead?",
        probeFollowup: "Even nights and weekends?",
        extractsField: "lead_response_speed",
        mapsToToolCategory: ["speed-to-lead", "ai-chat-widget"],
      },
      {
        id: "re.listing_prep",
        text: "What's your listing prep workflow look like — photos, copy, MLS entry?",
        extractsField: "listing_prep_flow",
        mapsToToolCategory: ["content-generation", "design-automation"],
      },
      {
        id: "re.showings",
        text: "How are you handling showing scheduling when inquiries come in?",
        extractsField: "showing_scheduling",
        mapsToToolCategory: ["scheduling"],
      },
      {
        id: "re.cold_follow_up",
        text: "What does follow-up cadence look like for leads that went cold?",
        extractsField: "cold_lead_follow_up",
        mapsToToolCategory: ["follow-up-automation", "email-automation"],
      },
      {
        id: "re.reviews_referrals",
        text: "How are you getting testimonials and referrals from past clients?",
        extractsField: "review_flow",
        mapsToToolCategory: ["review-generation"],
      },
      {
        id: "re.transaction_tracking",
        text: "How are you tracking transactions and commissions through close?",
        extractsField: "transaction_tracking",
        mapsToToolCategory: ["project-management", "reporting-dashboards"],
      },
      {
        id: "re.eye_roll_task",
        text: "What's a task you do every week that makes you roll your eyes when it comes around?",
        extractsField: "weekly_time_suck",
        mapsToToolCategory: [],
      },
    ],
  },

  /* ---------------- Fitness / gym / studio ---------------- */
  fitness: {
    id: "fitness",
    label: "Fitness / gym / studio",
    emoji: "🏋️",
    transition:
      "Got it — fitness. Let's talk about members, classes, and retention.",
    questions: [
      {
        id: "fit.new_member",
        text: "Walk me through how a new member finds you and signs up.",
        extractsField: "new_member_flow",
        mapsToToolCategory: ["lead-response", "scheduling"],
      },
      {
        id: "fit.class_scheduling",
        text: "How are you handling class scheduling and booking?",
        extractsField: "class_booking_flow",
        mapsToToolCategory: ["scheduling"],
      },
      {
        id: "fit.membership_billing",
        text: "What's your membership billing and cancellation process?",
        extractsField: "membership_billing",
        mapsToToolCategory: ["billing-automation", "payment-automation"],
      },
      {
        id: "fit.no_shows",
        text: "How do you handle no-shows and late cancellations?",
        extractsField: "no_show_flow",
        mapsToToolCategory: ["reminders"],
      },
      {
        id: "fit.retention",
        text: "What's your retention rate, and what are you doing to re-engage lapsed members?",
        extractsField: "retention_flow",
        mapsToToolCategory: ["email-automation", "sms-marketing"],
      },
      {
        id: "fit.marketing",
        text: "How are you promoting new classes, trainers, or programs?",
        extractsField: "marketing_flow",
        mapsToToolCategory: ["social-media", "email-automation"],
      },
      {
        id: "fit.reviews",
        text: "How are you collecting and responding to reviews?",
        extractsField: "review_flow",
        mapsToToolCategory: ["review-generation"],
      },
      {
        id: "fit.staff_task",
        text: "What's a repetitive task your front desk or staff does every week that could be automated?",
        extractsField: "staff_time_suck",
        mapsToToolCategory: [],
      },
    ],
  },

  /* ---------------- Boutique hotel / hospitality ---------------- */
  "boutique-hotel": {
    id: "boutique-hotel",
    label: "Boutique hotel / inn / B&B",
    emoji: "🏨",
    transition:
      "Got it — boutique hotel. I'll ask about bookings, guest experience, and the OTA tax.",
    questions: [
      {
        id: "hotel.direct_vs_ota",
        text: "What's the split between direct bookings on your own website versus OTA bookings through Booking, Expedia, or Airbnb?",
        probeFollowup: "And roughly what are you paying in OTA commissions each month?",
        extractsField: "direct_vs_ota_mix",
        mapsToToolCategory: ["reporting-dashboards", "email-automation"],
        extractionHint:
          "Capture both the rough percent split AND monthly commission dollars if mentioned.",
      },
      {
        id: "hotel.guest_journey",
        text: "Walk me through the guest journey from the minute they book to the minute they check out. Which parts are you proud of, which parts feel manual?",
        extractsField: "guest_journey",
        mapsToToolCategory: ["email-automation", "sms-marketing"],
      },
      {
        id: "hotel.messaging",
        text: "How are you handling guest messaging — pre-arrival info, questions during their stay, and the post-checkout follow-up?",
        extractsField: "guest_messaging_flow",
        mapsToToolCategory: ["email-automation", "sms-marketing", "ai-chat-widget"],
      },
      {
        id: "hotel.concierge",
        text: "When a guest wants a dinner recommendation, a tour, or a late checkout at 10 PM, how does that get handled?",
        probeFollowup: "Does someone always catch those, or do some slip through?",
        extractsField: "concierge_after_hours",
        mapsToToolCategory: ["ai-voice-agent", "ai-chat-widget", "knowledge-base"],
      },
      {
        id: "hotel.reviews",
        text: "What's your review process across Google, Tripadvisor, Yelp, and the OTA review streams — responding, asking for them?",
        extractsField: "review_flow",
        mapsToToolCategory: ["review-generation"],
      },
      {
        id: "hotel.upsells",
        text: "How are you doing upsells — late checkout, breakfast, room upgrades, local experiences?",
        extractsField: "upsell_flow",
        mapsToToolCategory: ["email-automation", "sms-marketing", "payment-automation"],
      },
      {
        id: "hotel.housekeeping",
        text: "How are you coordinating housekeeping and turnover between stays — who gets the signal, who confirms rooms are ready?",
        extractsField: "housekeeping_flow",
        mapsToToolCategory: ["job-dispatch", "project-management"],
      },
      {
        id: "hotel.direct_booking_blocker",
        text: "What's the single biggest thing keeping you from getting more direct bookings instead of paying those OTA commissions?",
        extractsField: "direct_booking_blocker",
        mapsToToolCategory: [],
        extractionHint:
          "This is the highest-leverage pain point for boutique hotels. Flag it as a priority recommendation for any direct-booking acceleration (speed-to-lead chatbot, pre-arrival email sequence, review acceleration).",
      },
    ],
  },

  /* ---------------- Other / general SMB fallback ---------------- */
  other: {
    id: "other",
    label: "Something else",
    emoji: "💡",
    transition:
      "Got it — let me ask some general questions to figure out where AI can help.",
    questions: [
      {
        id: "gen.monday_morning",
        text: "Walk me through what a typical Monday morning looks like for you.",
        extractsField: "typical_monday",
        mapsToToolCategory: [],
      },
      {
        id: "gen.customer_flow",
        text: "How does a new customer find you and become a paying customer?",
        extractsField: "customer_acquisition_flow",
        mapsToToolCategory: ["lead-response", "crm"],
      },
      {
        id: "gen.current_tools",
        text: "What are the main tools open on your desktop right now?",
        extractsField: "current_tools",
        mapsToToolCategory: [],
        extractionHint: "Extract as a list of named tools.",
      },
      {
        id: "gen.top_time_sucks",
        text: "What are the top two or three things that eat your week — the ones you'd pay to make go away?",
        extractsField: "top_time_sucks",
        mapsToToolCategory: [],
      },
      {
        id: "gen.cracks",
        text: "Where do things regularly fall through the cracks — customers lost, tasks forgotten, follow-ups missed?",
        extractsField: "breakdown_points",
        mapsToToolCategory: ["follow-up-automation", "crm"],
      },
      {
        id: "gen.manual_wish",
        text: "What manual task do you wish just happened on its own?",
        extractsField: "automation_wish",
        mapsToToolCategory: [],
      },
      {
        id: "gen.dreaded_report",
        text: "If you had to pick one report you build by hand that you dread, what is it?",
        extractsField: "dreaded_report",
        mapsToToolCategory: ["reporting-dashboards"],
      },
      {
        id: "gen.staying_late",
        text: "When was the last time you stayed late because of admin work, not actual client work?",
        extractsField: "admin_overflow",
        mapsToToolCategory: [],
      },
    ],
  },
};

/* ============================================================
   PUBLIC HELPERS
   ============================================================ */

/** Ordered list of industries for the UI picker */
export const INDUSTRY_OPTIONS = Object.values(INDUSTRY_SCRIPTS).map((s) => ({
  id: s.id,
  label: s.label,
  emoji: s.emoji,
}));

/** Build the full interview script for a given industry */
export function buildFullScript(industryId: string): Question[] {
  const industry = INDUSTRY_SCRIPTS[industryId] ?? INDUSTRY_SCRIPTS.other;
  return [...BASE_INTRO, ...industry.questions, ...BASE_CLOSER];
}

/** Build the Stacks system prompt for a given industry */
export function buildSystemPrompt(industryId: string): string {
  const industry = INDUSTRY_SCRIPTS[industryId] ?? INDUSTRY_SCRIPTS.other;
  const allQuestions = buildFullScript(industryId);
  const numbered = allQuestions
    .map((q, i) => {
      const probe = q.probeFollowup
        ? `\n     Follow-up if vague: "${q.probeFollowup}"`
        : "";
      return `${i + 1}. "${q.text}"${probe}`;
    })
    .join("\n");

  return `You are Stacks, the AI business analyst for Stack Consulting AI.
You are conducting a free 20-to-30-minute AI Tools Assessment over the phone
with a small business owner. Your job is to understand their day-to-day
workflow so Stack Consulting AI can send them a personalized report with
tool recommendations and a 4-day implementation plan.

INDUSTRY: ${industry.label}
${industry.transition}

RULES:
- Speak like a builder, not a marketer. Concrete, casual, direct.
- Keep your turns under 3 sentences. Let them talk.
- Ask the questions below IN ORDER. Do not skip questions.
- If an answer is vague or under one sentence, ask the follow-up (if provided).
- When they ramble, acknowledge briefly and steer back to the next question.
- If they ask "what tools will you recommend?", say "I can't answer that
  until I understand your business — that's what this call is for. The
  report will cover it."
- If they ask cost, say "The assessment is free. The tools we recommend
  usually total under a hundred dollars a month. Implementation help is
  separate and optional — we'll talk about that after you see the report."
- You are not a salesperson. Do not pitch services during the interview.
- Never invent data, prices, or client names. If you don't know, say so.
- Do not recommend tools during the call. Save that for the written report.
- Close by thanking them by name and confirming the report will arrive
  within 24 hours at the email they gave.

QUESTIONS (ask in this order):
${numbered}

Begin with a warm 15-second intro, then start at question 1. Do not skip
the intro questions even if they already said their name at the start.`;
}

/**
 * Build the INBOUND Stacks prompt — used when the caller dialed IN and we
 * don't know their industry yet. Stacks asks the industry up front, then
 * branches into the matching question script at runtime.
 */
export function buildInboundSystemPrompt(): string {
  const industryMenu = Object.values(INDUSTRY_SCRIPTS)
    .map((s) => `   ${s.emoji}  ${s.label}`)
    .join("\n");

  const industryBranches = Object.values(INDUSTRY_SCRIPTS)
    .map((s) => {
      const qs = s.questions
        .map((q, i) => {
          const probe = q.probeFollowup
            ? `\n      Follow-up if vague: "${q.probeFollowup}"`
            : "";
          return `   Q${i + 1}. "${q.text}"${probe}`;
        })
        .join("\n");
      return `[ ${s.label} ]\n   ${s.transition}\n${qs}`;
    })
    .join("\n\n");

  const intro = BASE_INTRO.map(
    (q, i) =>
      `   P1.${i + 1} "${q.text}"${
        q.probeFollowup ? `\n      Follow-up if vague: "${q.probeFollowup}"` : ""
      }`
  ).join("\n");

  const closer = BASE_CLOSER.map(
    (q, i) =>
      `   P3.${i + 1} "${q.text}"${
        q.probeFollowup ? `\n      Follow-up if vague: "${q.probeFollowup}"` : ""
      }`
  ).join("\n");

  return `You are Stacks, the AI business analyst for Stack Consulting AI.
You just answered an inbound call from a small business owner who wants a
free AI Tools Assessment. Your job is to conduct a 10-to-20-minute phone
interview, then Stack Consulting AI will email them a personalized report
with tool recommendations and a 4-day implementation plan.

================================================================
VOICE & TONE
================================================================
- Speak like a builder, not a marketer. Concrete, casual, direct.
- Keep your turns under 3 sentences. Let the caller talk.
- When they ramble, acknowledge briefly and steer back to the next question.
- You are not a salesperson. Do not pitch services during the interview.
- Do not recommend specific tools during the call. The report covers that.
- Never invent data, prices, or client names. If you don't know, say so.

================================================================
CALL STRUCTURE — three phases
================================================================

PHASE 1 — INTRO (always ask these in order)
${intro}

PHASE 2 — PICK INDUSTRY, THEN RUN INDUSTRY QUESTIONS
   After Phase 1, ask the caller:
   "Which of these best describes your business?"
${industryMenu}

   Listen to their answer. Internally pick the BEST-MATCHING industry from
   the list above. Acknowledge with a short natural line like "Got it —
   auto repair," then run THAT industry's question script below in order.

   If their business doesn't clearly match any industry, use the
   "Something else" script.

${industryBranches}

PHASE 3 — CLOSER (always ask these in order, regardless of industry)
${closer}

================================================================
RESPONSES TO COMMON CALLER QUESTIONS
================================================================
- Caller asks "what tools will you recommend?":
  "I can't answer that until I understand your business — that's what
  this call is for. The written report will cover it."

- Caller asks "what does this cost?":
  "The assessment is free. The tools we recommend usually total under a
  hundred dollars a month. Implementation help is separate and optional —
  we'll talk about that after you see the report."

- Caller asks "who runs Stack Consulting AI?":
  "Chad McCluskey, based in Southern California. He'll personally read
  your report. If you want to talk after, you can book a review call
  from the email we send you."

- Caller asks "how long will this take?":
  "About 10 to 20 minutes. We can go faster or slower — your call."

- Caller asks "can I call back?":
  "Sure — hang up whenever you want. If you call back at the same number,
  we'll start fresh. Takes 10 to 20 minutes start to finish."

================================================================
CLOSE
================================================================
- After the last closer question (email), thank them by name.
- Tell them: "Your assessment will land in your inbox within 24 hours.
  Watch for a message from Stack Consulting AI. If you want to talk
  after reading it, there's a link to book a 20-minute review call."
- End the call politely.

Begin the call now with a warm 15-second greeting, then start at P1.1.
Do not skip the intro even if they opened with their name.`;
}
