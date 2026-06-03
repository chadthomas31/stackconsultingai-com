/**
 * Per-vertical landing copy. Builder voice. No banned words.
 * Pulled by app/demos/[vertical]/page.tsx and the funnel component.
 */

import type { Vertical } from "@/lib/voice-agents";

export interface VerticalCopy {
  vertical: Vertical;
  displayName: string;
  oneLiner: string;            // chip/kicker text
  h1: string;
  subhead: string;
  proofLine: string;           // metric line; keep it real, not aspirational
  agentDoes: [string, string, string]; // 3 concrete things the agent will do on the demo call
  whyItMatters: string;        // 1-paragraph "what this saves you"
  bookingScript: string;       // suggested 1-line script the prospect can read into the phone
  cta: string;
}

export const COPY: Record<Vertical, VerticalCopy> = {
  hvac: {
    vertical: "hvac",
    displayName: "HVAC",
    oneLiner: "AI receptionist for HVAC shops · 24/7 · Books on your calendar",
    h1: "Your HVAC shop misses 30% of summer calls. The AI receptionist answers all of them.",
    subhead:
      "Dial the demo number and hear how it triages an emergency, captures the ZIP, books a slot around an existing appointment, and texts the customer a confirmation.",
    proofLine:
      "Fix It San Clemente — same pattern — booked 40% more appointments after wiring this up.",
    agentDoes: [
      "Triages emergencies (gas smell, no heat with elderly, frozen pipe) and flags them top-priority",
      "Captures name, ZIP, brand, system age, and service type with no awkward pauses",
      "Books the next open slot — and when the first slot's taken, intelligently offers the one after",
    ],
    whyItMatters:
      "Every missed call in summer is roughly $400 of lost revenue. A $499/mo agent pays for itself in two avoided missed calls. The rest is upside.",
    bookingScript:
      'Try saying: "My AC stopped cooling this morning, I\'m in 92675, it\'s a 12-year-old Trane, can someone come today?"',
    cta: "Book a fit call",
  },

  plumbing: {
    vertical: "plumbing",
    displayName: "Plumbing",
    oneLiner: "AI receptionist for plumbers · 24/7 emergency triage",
    h1: "After-hours plumbing calls go to voicemail. Your competition's are going to a live AI.",
    subhead:
      "Dial the demo number and hear how it handles an active leak — walks the caller through shutting off the main valve while the calendar books the next emergency slot.",
    proofLine:
      "Built on the same stack as Fix It San Clemente (40% more appointments) and our voice agent at Stack Consulting AI.",
    agentDoes: [
      "Asks the emergency question FIRST — is water actively flowing — and adapts the flow if yes",
      "Walks active-leak callers through the main shut-off without losing the appointment booking",
      "Routes sewage backups and commercial water outages as top-priority callbacks",
    ],
    whyItMatters:
      "Plumbing emergencies are 2am decisions. Whoever answers wins. A $499/mo agent that picks up every after-hours call pays for itself in one emergency callout.",
    bookingScript:
      'Try saying: "My kitchen sink is leaking under the cabinet, water everywhere, I\'m in 92692, can someone come tonight?"',
    cta: "Book a fit call",
  },

  auto: {
    vertical: "auto",
    displayName: "Auto Repair",
    oneLiner: "AI receptionist for auto shops · Drop-off & mobile · Books service",
    h1: "Your shop is busy under hoods. The AI receptionist answers the phone the way your best service writer would.",
    subhead:
      "Dial the demo number and hear it pull the year, make, model, symptoms, and book a drop-off or mobile slot — no hold music, no missed call.",
    proofLine:
      "Fix It San Clemente runs this stack — 40% more appointments. Tito's Automotive and SoCal Mobile Auto are on the same backbone.",
    agentDoes: [
      "Captures vehicle year/make/model + symptoms in plain conversation",
      "Routes mobile-service calls vs drop-off based on ZIP and service category",
      "Flags brake failure / overheating as 'don't drive' and books a tow instead of a slot",
    ],
    whyItMatters:
      "Service writers can't be on the phone and at the counter at the same time. The agent handles every call so your team can wrench. One missed appointment = the cost of the agent for a month.",
    bookingScript:
      'Try saying: "I\'ve got a 2019 Honda Civic, the brakes are squealing when I stop, can you fit me in tomorrow morning?"',
    cta: "Book a fit call",
  },

  medspa: {
    vertical: "medspa",
    displayName: "Medspa / Aesthetics",
    oneLiner: "AI receptionist for medspas · Discreet · Books treatments",
    h1: "Your provider is in a treatment room. The AI receptionist sounds like your senior front-desk concierge.",
    subhead:
      "Dial the demo number and hear it greet a new client, pull their treatment of interest, ask for a preferred provider, and slot them in — without ever making a medical claim.",
    proofLine:
      "Built on the same stack as the Dr. Robert Woods MD practice site and our voice agent at Stack Consulting AI.",
    agentDoes: [
      "Recognizes new vs returning client and routes the flow accordingly",
      "Never quotes treatment prices or makes medical claims — always defers to the provider",
      "Flags post-treatment concerns as immediate provider callbacks, not new appointments",
    ],
    whyItMatters:
      "Medspa front desks lose leads to voicemail every time the phone rings during a treatment. A $499/mo agent that picks up every call — discreetly — protects the patient experience AND the booking funnel.",
    bookingScript:
      'Try saying: "I\'m a new client interested in Botox, I\'d love to book a consultation, can I come in this week?"',
    cta: "Book a fit call",
  },
};
