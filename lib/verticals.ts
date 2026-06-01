export type VerticalId = "auto" | "plumbing" | "hvac" | "medspa";

export interface VerticalCopy {
  id: VerticalId;
  label: string;
  headline: string;
  sub: string;
  pain: string;
  bizPlaceholder: string;
}

export const VERTICALS: Record<VerticalId, VerticalCopy> = {
  auto: {
    id: "auto",
    label: "Auto Repair",
    headline: "Your shop's AI service writer, answering every call",
    sub: "Books the appointment, takes the car and the problem, and texts you the details — 24/7.",
    pain: "Every call you miss under a car is a brake job calling the next shop.",
    bizPlaceholder: "Mike's Auto Repair",
  },
  plumbing: {
    id: "plumbing",
    label: "Plumbing",
    headline: "Never miss another after-hours emergency call",
    sub: "Your AI dispatcher answers, captures the address, and books the job — day or night.",
    pain: "The 2am burst-pipe call goes to whoever picks up. Make that you.",
    bizPlaceholder: "Harbor Plumbing",
  },
  hvac: {
    id: "hvac",
    label: "HVAC",
    headline: "Book every call — even when you're up on a roof",
    sub: "Your AI receptionist answers, qualifies the job, and schedules it while you're on the truck.",
    pain: "Summer call surge + a missed phone = the install goes to a competitor.",
    bizPlaceholder: "Pacific Air & Heat",
  },
  medspa: {
    id: "medspa",
    label: "Med Spa",
    headline: "A warm front desk while you're with a client",
    sub: "Your AI receptionist books consultations and answers questions — never a missed booking.",
    pain: "Every unanswered call is a $300+ treatment booking somewhere else.",
    bizPlaceholder: "Lumina Aesthetics",
  },
};

export const VERTICAL_IDS = Object.keys(VERTICALS) as VerticalId[];
