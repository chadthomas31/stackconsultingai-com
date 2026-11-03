/**
 * Sample business websites, one per demo vertical.
 *
 * These are FICTIONAL businesses used to show prospects what a Stack site
 * looks like. Every page carries a "Sample site by Stack Consulting AI"
 * banner, the reviews are labeled as sample text, and the pages are
 * noindex so search engines never list a business that doesn't exist.
 *
 * Business names match the demo AI receptionist's default names on the
 * PBX (ai_assistant_demo.lua), so the site and the phone demo tell the
 * same story.
 */

export type SampleIcon =
  | "wrench"
  | "gauge"
  | "car"
  | "battery"
  | "droplet"
  | "flame"
  | "snowflake"
  | "wind"
  | "thermometer"
  | "shield"
  | "truck"
  | "zap"
  | "sparkles"
  | "hammer";

export interface SampleTheme {
  name: string;
  /** main brand color */
  brand: string;
  /** darker shade for hero background */
  dark: string;
  /** light tint for section backgrounds */
  tint: string;
  /** accent for buttons / highlights */
  accent: string;
}

export interface SampleSite {
  vertical: "auto" | "plumbing" | "hvac" | "golfcart";
  business: string;
  industry: string;
  tagline: string;
  heroTitle: string;
  heroText: string;
  city: string;
  hours: string;
  badges: string[];
  services: { icon: SampleIcon; title: string; text: string }[];
  why: { title: string; text: string }[];
  reviews: { name: string; text: string }[];
  agent: string;
  /** what to say to the AI receptionist when you try the demo */
  tryLine: string;
  themes: SampleTheme[];
}

export const SAMPLE_SITES: SampleSite[] = [
  {
    vertical: "auto",
    business: "Summit Auto Care",
    industry: "Auto repair",
    tagline: "Honest repairs, fast diagnostics, and mobile help when you need it.",
    heroTitle: "Auto repair you can actually trust.",
    heroText:
      "Diagnostics, brakes, maintenance and mobile service. Straight answers and a written estimate before we touch your car.",
    city: "Serving South Orange County",
    hours: "Mon to Fri 7:30 to 6, Sat 8 to 3",
    badges: ["ASE-certified techs", "Written estimates", "Mobile service"],
    services: [
      { icon: "gauge", title: "Check engine and diagnostics", text: "We find the real cause, show you the codes, and explain the fix in plain English." },
      { icon: "wrench", title: "Brakes and suspension", text: "Pads, rotors, struts and alignments, with the old parts shown to you." },
      { icon: "car", title: "Scheduled maintenance", text: "Oil, fluids, filters and factory service intervals for every make." },
      { icon: "battery", title: "Batteries and electrical", text: "Testing, replacement and no-start calls, at the shop or in your driveway." },
      { icon: "truck", title: "Mobile service", text: "We come to your home or office for many repairs and inspections." },
      { icon: "shield", title: "Pre-purchase inspections", text: "Buying used? We check it top to bottom before you sign." },
    ],
    why: [
      { title: "No surprise bills", text: "You approve every dollar before work starts." },
      { title: "Same-day answers", text: "Most diagnostics done the day you drop off." },
      { title: "Calls answered 24/7", text: "Our receptionist picks up nights and weekends, so you're never stuck on voicemail." },
    ],
    reviews: [
      { name: "Sample customer", text: "They showed me exactly what was wrong and the price didn't change. Car was ready the same afternoon." },
      { name: "Sample customer", text: "Called at 8pm with a dead battery and had a mobile appointment booked before I hung up." },
      { name: "Sample customer", text: "Finally a shop that explains things without making me feel dumb." },
    ],
    agent: "Riley",
    tryLine: "Hi, my check engine light came on and the car is shaking at stoplights.",
    themes: [
      { name: "Garage red", brand: "#c8102e", dark: "#1b1d22", tint: "#f6f4f2", accent: "#c8102e" },
      { name: "Racing blue", brand: "#1d4ed8", dark: "#0b1530", tint: "#eef3fc", accent: "#f59e0b" },
      { name: "Shop green", brand: "#15803d", dark: "#0f1f17", tint: "#eef7f1", accent: "#facc15" },
    ],
  },
  {
    vertical: "plumbing",
    business: "Anchor Plumbing",
    industry: "Plumbing",
    tagline: "Fast, clean, licensed plumbing for homes and small businesses.",
    heroTitle: "Leak, clog or no hot water? We're on the way.",
    heroText:
      "Licensed plumbers for drains, water heaters, leaks and repipes. Upfront pricing, clean work, and 24/7 emergency service.",
    city: "Serving Orange County",
    hours: "Open 7 days, 24/7 emergency line",
    badges: ["Licensed and insured", "Upfront pricing", "24/7 emergencies"],
    services: [
      { icon: "droplet", title: "Leak detection and repair", text: "Slab leaks, burst pipes and hidden leaks found fast with minimal damage." },
      { icon: "wrench", title: "Drain cleaning", text: "Kitchen, bath and main-line clogs cleared, with camera inspection when needed." },
      { icon: "flame", title: "Water heaters", text: "Tank and tankless repair and replacement, often same day." },
      { icon: "hammer", title: "Repiping", text: "Whole-home PEX and copper repipes with clean drywall patching." },
      { icon: "shield", title: "Fixtures and installs", text: "Faucets, toilets, disposals and shut-off valves done right the first time." },
      { icon: "zap", title: "Emergency service", text: "Water where it shouldn't be? A real plumber, day or night." },
    ],
    why: [
      { title: "Price before work", text: "Flat-rate quotes, approved by you, every time." },
      { title: "Clean job sites", text: "Shoe covers, drop cloths, and we haul away the mess." },
      { title: "Someone always answers", text: "Our receptionist takes emergency calls 24/7 and dispatches the on-call plumber." },
    ],
    reviews: [
      { name: "Sample customer", text: "Water heater died on a Sunday. They answered right away and had a new one in by the afternoon." },
      { name: "Sample customer", text: "Upfront price, no upsell, and they left the bathroom cleaner than they found it." },
      { name: "Sample customer", text: "Found a slab leak two other companies missed." },
    ],
    agent: "Jesse",
    tryLine: "Hi, there's water coming out from under my kitchen sink and it won't stop.",
    themes: [
      { name: "Ocean blue", brand: "#0369a1", dark: "#0b2238", tint: "#eef6fb", accent: "#f97316" },
      { name: "Navy and gold", brand: "#1e3a8a", dark: "#0c142e", tint: "#f2f4fa", accent: "#eab308" },
      { name: "Teal", brand: "#0f766e", dark: "#0b2422", tint: "#edf7f6", accent: "#ef4444" },
    ],
  },
  {
    vertical: "hvac",
    business: "Summit Heating & Air",
    industry: "Heating and air conditioning",
    tagline: "Heating, cooling and indoor air, done right the first time.",
    heroTitle: "AC out? Heater not heating? We'll make it comfortable again.",
    heroText:
      "Repair, replacement and maintenance for every major brand. Honest recommendations, financing available, and emergency service when it can't wait.",
    city: "Serving Orange County",
    hours: "Mon to Sat 7 to 7, emergency service 24/7",
    badges: ["Licensed technicians", "All major brands", "Financing available"],
    services: [
      { icon: "snowflake", title: "AC repair", text: "Warm air, strange noises or a unit that won't start. Diagnosed and fixed fast." },
      { icon: "flame", title: "Furnace and heating", text: "Gas furnaces, heat pumps and wall heaters repaired and tuned." },
      { icon: "thermometer", title: "New system installs", text: "Right-sized systems with clear options and written quotes." },
      { icon: "wind", title: "Ducts and indoor air", text: "Duct sealing, filtration and air quality upgrades." },
      { icon: "shield", title: "Maintenance plans", text: "Two tune-ups a year, priority service and repair discounts." },
      { icon: "zap", title: "Emergency service", text: "No heat or no cooling for kids or seniors? We prioritize you." },
    ],
    why: [
      { title: "Repair before replace", text: "We only recommend a new system when it actually makes sense." },
      { title: "On-time arrival windows", text: "Two-hour windows and a text when the tech is on the way." },
      { title: "24/7 answering", text: "Our receptionist books service and flags urgent calls any hour." },
    ],
    reviews: [
      { name: "Sample customer", text: "AC quit during a heat wave. They got us on the schedule that night and fixed it the next morning." },
      { name: "Sample customer", text: "They told us a repair would last years instead of selling us a new unit. Rare." },
      { name: "Sample customer", text: "The maintenance plan pays for itself. Easy scheduling every time." },
    ],
    agent: "Riley",
    tryLine: "Hi, my AC is running but it's blowing warm air and it's 95 degrees out.",
    themes: [
      { name: "Cool blue and warm orange", brand: "#2563eb", dark: "#0d1b33", tint: "#eef3fd", accent: "#ea580c" },
      { name: "Deep red", brand: "#b91c1c", dark: "#1f1414", tint: "#fbf1f1", accent: "#0ea5e9" },
      { name: "Slate and lime", brand: "#334155", dark: "#0f172a", tint: "#f1f5f9", accent: "#65a30d" },
    ],
  },
  {
    vertical: "golfcart",
    business: "Coastal Cart Co.",
    industry: "Golf carts",
    tagline: "Custom golf carts, street-legal builds, and mobile repairs.",
    heroTitle: "Custom carts, lithium upgrades and mobile repair.",
    heroText:
      "Lift kits, wheels, seats, lights and lithium conversions, plus repair at your home or community. Build it your way.",
    city: "Serving coastal communities",
    hours: "Tue to Sat 9 to 5, mobile service by appointment",
    badges: ["Mobile repair", "Lithium conversions", "Custom builds"],
    services: [
      { icon: "battery", title: "Lithium conversions", text: "Swap tired lead-acid batteries for lithium: more range, less weight, no watering." },
      { icon: "wrench", title: "Mobile repair", text: "Won't charge, won't go, or making noise? We come to your driveway or community." },
      { icon: "sparkles", title: "Custom builds", text: "Lifts, wheels, seats, paint and accessories, built to your style." },
      { icon: "car", title: "Street-legal packages", text: "Lights, signals, mirrors and seat belts for LSV-ready carts." },
      { icon: "zap", title: "Motor and controller upgrades", text: "More speed and torque for hills and longer trips." },
      { icon: "shield", title: "Seasonal service", text: "Tune-ups, brakes, tires and battery checks before the busy season." },
    ],
    why: [
      { title: "We come to you", text: "Most repairs done on site, no trailer needed." },
      { title: "Build it your way", text: "Pick every part, see the price, then we build it." },
      { title: "Never miss a call", text: "Our receptionist takes repair requests even when we're under a cart." },
    ],
    reviews: [
      { name: "Sample customer", text: "Lithium conversion doubled our range. They did it in our garage in a couple hours." },
      { name: "Sample customer", text: "Cart wouldn't charge on a Saturday. Called, got a mobile appointment for Monday morning." },
      { name: "Sample customer", text: "Our custom build came out exactly like the mockup." },
    ],
    agent: "Riley",
    tryLine: "Hi, my Club Car Precedent won't charge anymore. Can someone come look at it?",
    themes: [
      { name: "Coastal teal", brand: "#0e7490", dark: "#082a33", tint: "#ecf7f9", accent: "#f59e0b" },
      { name: "Fairway green", brand: "#166534", dark: "#0c1f14", tint: "#eff7f1", accent: "#f8fafc" },
      { name: "Sunset orange", brand: "#ea580c", dark: "#24140b", tint: "#fdf3ec", accent: "#0f766e" },
    ],
  },
];

export function getSample(vertical: string): SampleSite | undefined {
  return SAMPLE_SITES.find((s) => s.vertical === vertical);
}
