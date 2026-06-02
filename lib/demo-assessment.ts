/**
 * Hand-built demo Assessment for /assessment/demo — The Desert Flower
 * (fictional 12-room Palm Springs boutique hotel). Matches the shape
 * Claude extraction produces, so the same renderer works for live data.
 *
 * When the webhook + Supabase pipeline lands, this stays as the fallback
 * for marketing/demo URLs.
 */

import type { Assessment } from "./assessment-schema";

export const DEMO_ASSESSMENT: Assessment = {
  id: "demo",
  createdAt: "2026-04-18T19:45:00.000Z",

  business: {
    callerName: "Maria Rivera",
    businessName: "The Desert Flower",
    industryId: "boutique-hotel",
    industryLabel: "Boutique Hotel",
    yearsInBusiness: 6,
    teamSize: 4,
    email: "maria@desertflower.example",
  },

  executiveSummary: {
    pain: "After-hours reservation inquiries, manual review follow-up, and a concierge inbox full of repeat questions are consuming front-desk hours and slowing guest response times at a 12-room property where every review compounds.",
    outcome:
      "A four-tool stack can reclaim 11+ hours per week, cut check-in re-confirmation calls, and automate review asks — freeing the front-desk team to focus on the in-person guest experience that earns 5-star reviews.",
    focus: "efficiency",
  },

  painPoints: [
    {
      sourceQuestionId: "hotel.after_hours",
      area: "After-hours reservation inquiries",
      currentState:
        "Guests call or email after 8 PM asking about availability; no one responds until morning and leads convert to OTA bookings instead of direct.",
      estimatedHoursPerWeek: 4,
      impactScore: 5,
      effortScore: 3,
      quadrant: "major-project",
    },
    {
      sourceQuestionId: "hotel.reviews",
      area: "Review generation is manual",
      currentState:
        "Front-desk staff hand-ask guests for Google/TripAdvisor reviews at checkout; asks are inconsistent, and follow-ups rarely happen.",
      estimatedHoursPerWeek: 2,
      impactScore: 4,
      effortScore: 1,
      quadrant: "quick-win",
    },
    {
      sourceQuestionId: "hotel.concierge_inbox",
      area: "Concierge inbox overload",
      currentState:
        "Same ten questions (pool hours, parking, dog policy, late checkout) clog the inbox daily, mixed in with actual reservation changes.",
      estimatedHoursPerWeek: 3,
      impactScore: 4,
      effortScore: 1,
      quadrant: "quick-win",
    },
    {
      sourceQuestionId: "hotel.confirm_calls",
      area: "Check-in re-confirmation calls",
      currentState:
        "Front-desk calls every arriving guest the day before to confirm; half don't answer and need a second call.",
      estimatedHoursPerWeek: 3,
      impactScore: 3,
      effortScore: 1,
      quadrant: "quick-win",
    },
    {
      sourceQuestionId: "hotel.property_tours",
      area: "Property tour bookings",
      currentState:
        "Prospective wedding/event clients email asking for tours; scheduling goes back-and-forth over 4–6 emails.",
      estimatedHoursPerWeek: 2,
      impactScore: 3,
      effortScore: 1,
      quadrant: "quick-win",
    },
    {
      sourceQuestionId: "hotel.ota_drain",
      area: "OTA commission drain",
      currentState:
        "Roughly 60% of bookings flow through Booking.com/Expedia; commissions are ~$6,800/month.",
      estimatedHoursPerWeek: 0,
      impactScore: 5,
      effortScore: 5,
      quadrant: "major-project",
    },
  ],

  quickWins: [
    {
      toolId: "sanebox",
      solvesPainAreas: ["Concierge inbox overload"],
      whyThisToolForYou:
        "SaneBox learns which emails actually need a human — reservation changes, VIP requests, vendor issues — and files the FAQ noise into SaneLater. The front desk opens the inbox and only sees what matters.",
      priority: 1,
    },
    {
      toolId: "nicejob",
      solvesPainAreas: ["Review generation is manual"],
      whyThisToolForYou:
        "NiceJob auto-texts and emails every checked-out guest with a review ask. Happy guests click straight to Google; unhappy ones route to Maria first. Review volume compounds without staff effort.",
      priority: 2,
    },
    {
      toolId: "twilio-reminders",
      solvesPainAreas: ["Check-in re-confirmation calls"],
      whyThisToolForYou:
        "A scheduled SMS 24 hours before arrival (with a one-tap confirm link) kills the re-confirm call loop. For a 12-room hotel this is ~$15/mo in texts and buys back 3 hours of front-desk time weekly.",
      priority: 3,
    },
    {
      toolId: "google-workspace-appointment-schedule",
      solvesPainAreas: ["Property tour bookings"],
      whyThisToolForYou:
        "Google Workspace Appointment Schedules is free with your existing Workspace. Share a booking link for property tours; the back-and-forth email chain disappears. Same mechanic as Calendly, zero new subscription.",
      priority: 4,
    },
  ],

  fourDayPlan: [
    {
      day: 1,
      toolId: "sanebox",
      title: "Set up SaneBox on the concierge inbox",
      actionSteps: [
        "Connect SaneBox to the front-desk Gmail account",
        "Let it learn for 24 hours — no manual tagging needed",
        "Pin the SaneLater folder so staff can spot-check it",
      ],
      estimatedMinutes: 15,
    },
    {
      day: 2,
      toolId: "nicejob",
      title: "Wire NiceJob into checkout workflow",
      actionSteps: [
        "Create NiceJob account and connect Google Business Profile",
        "Import last 90 days of checkouts to seed the ask queue",
        "Enable SMS + email follow-up sequence",
      ],
      estimatedMinutes: 45,
    },
    {
      day: 3,
      toolId: "twilio-reminders",
      title: "Launch 24-hour pre-arrival SMS",
      actionSteps: [
        "Provision a Twilio number local to Palm Springs (760)",
        "Build the pre-arrival SMS template with a one-tap confirm link",
        "Schedule the trigger off your reservation spreadsheet or PMS export",
      ],
      estimatedMinutes: 120,
    },
    {
      day: 4,
      toolId: "google-workspace-appointment-schedule",
      title: "Publish a property-tour booking link",
      actionSteps: [
        "Create an Appointment Schedule for 30-minute tours",
        "Block off Tue/Thu afternoons and Sat mornings",
        "Add the link to the website and to your email signature",
      ],
      estimatedMinutes: 30,
    },
  ],

  financialImpact: {
    weeklyHoursReclaimed: 11,
    monthlyToolCost: 97,
    hourlyRateAssumed: 150,
    monthlyValueReclaimed: 7145,
    monthlyNetRoi: 7048,
  },

  majorProjects: [
    {
      toolId: "freeswitch-ai-ivr",
      why: "A custom VoIP AI voice agent answers after-hours calls, confirms availability, and books reservations directly — preventing those inquiries from leaking to OTA bookings. This is the single biggest revenue lever for a small hotel.",
      estimatedSetupCost: "$150/mo + $3,000–5,000 setup",
    },
    {
      toolId: "speed-to-lead-chatbot",
      why: "An AI chat widget on the website responds to availability inquiries in under 10 seconds, qualifies event/wedding leads, and books the property tour — 24/7, before prospects bounce to Booking.com.",
      estimatedSetupCost: "$200/mo + $1,500 setup",
    },
    {
      toolId: "zapier-make-automation",
      why: "Custom automations to sync your PMS with email marketing, trigger post-stay campaigns for repeat guests, and push reviews into a monthly owner report. Scoped as a single implementation project, then it runs itself.",
      estimatedSetupCost: "$20–50/mo + $1,500–3,000 setup",
    },
  ],

  callDurationSeconds: 1120,
  callerPhoneNumber: "+17605551234",
  modelUsed: "claude-opus-4-8",
};
