"use client";

import { useState } from "react";
import {
  Code,
  Server,
  Database,
  Globe,
  Layers,
  CheckCircle,
  ArrowRight,
  Mail,
  ThumbsUp,
  ThumbsDown,
  DollarSign,
  Zap,
  RefreshCw,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Inputs {
  businessType: string;
  budget: string;
  priority: string;
  skillLevel: string;
  features: string[];
  email: string;
}

interface StackLayer {
  label: string;
  name: string;
  reason: string;
}

interface Recommendation {
  title: string;
  layers: StackLayer[];
  integrations: string[];
  whyFits: string[];
  pros: string[];
  cons: string[];
  monthlyCost: string;
  alternative: {
    title: string;
    description: string;
  };
}

// ---------------------------------------------------------------------------
// Option definitions
// ---------------------------------------------------------------------------

const businessTypes = [
  { value: "local-service", label: "Local Service" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "saas", label: "SaaS / Web App" },
  { value: "blog", label: "Blog / Content Site" },
  { value: "portfolio", label: "Portfolio / Agency" },
  { value: "nonprofit", label: "Non-profit" },
];

const budgetRanges = [
  { value: "under-3k", label: "Under $3k" },
  { value: "3k-8k", label: "$3k - $8k" },
  { value: "8k-20k", label: "$8k - $20k" },
  { value: "20k-plus", label: "$20k+" },
];

const priorities = [
  { value: "speed", label: "Speed to Launch" },
  { value: "scalability", label: "Scalability" },
  { value: "low-maintenance", label: "Low Maintenance" },
  { value: "customization", label: "Maximum Customization" },
];

const skillLevels = [
  { value: "none", label: "No Technical Skills" },
  { value: "basics", label: "Some Basics" },
  { value: "comfortable", label: "Comfortable with Tech" },
  { value: "developer", label: "Developer" },
];

const featureOptions = [
  { value: "payments", label: "Online Payments" },
  { value: "booking", label: "Booking System" },
  { value: "blog-cms", label: "Blog / CMS" },
  { value: "user-accounts", label: "User Accounts" },
  { value: "email-marketing", label: "Email Marketing" },
  { value: "seo-tools", label: "SEO Tools" },
  { value: "analytics", label: "Analytics Dashboard" },
  { value: "mobile-app", label: "Mobile App" },
];

// ---------------------------------------------------------------------------
// Recommendation engine
// ---------------------------------------------------------------------------

function generateRecommendation(inputs: Inputs): Recommendation {
  const { businessType, budget, priority, skillLevel, features } = inputs;

  const isLowBudget = budget === "under-3k";
  const isMidBudget = budget === "3k-8k";
  const isHighBudget = budget === "8k-20k" || budget === "20k-plus";
  const isPremiumBudget = budget === "20k-plus";
  const isNonTech = skillLevel === "none" || skillLevel === "basics";
  const isDev = skillLevel === "developer";
  const wantsCustomization = priority === "customization";
  const wantsScalability = priority === "scalability";
  const wantsSpeed = priority === "speed";
  const wantsLowMaintenance = priority === "low-maintenance";

  // E-commerce paths
  if (businessType === "ecommerce") {
    if (isLowBudget || (isMidBudget && isNonTech)) {
      return {
        title: "Shopify Commerce Stack",
        layers: [
          { label: "Frontend", name: "Shopify Storefront", reason: "Drag-and-drop store builder with beautiful themes" },
          { label: "Hosting", name: "Shopify (included)", reason: "Fully managed hosting with global CDN" },
          { label: "Database", name: "Shopify (managed)", reason: "Product catalog, orders, and customer data handled automatically" },
        ],
        integrations: buildIntegrations(features, "shopify"),
        whyFits: [
          "Shopify handles payments, inventory, and shipping out of the box -- perfect for getting a store live quickly.",
          "No coding required; you can manage products and orders from a simple dashboard.",
          "Thousands of apps in the Shopify ecosystem let you add features as you grow.",
        ],
        pros: ["Fast setup (days, not weeks)", "Built-in payment processing", "Mobile-responsive themes included", "24/7 support"],
        cons: ["Monthly platform fees add up", "Limited design customization vs. custom builds", "Transaction fees on non-Shopify payments"],
        monthlyCost: "$39 - $105/mo",
        alternative: {
          title: "WooCommerce + WordPress",
          description: "More control over design and no platform fees, but requires more setup and ongoing maintenance. Good if you have some technical comfort.",
        },
      };
    }
    if (isHighBudget || isDev) {
      return {
        title: "Headless Commerce Stack",
        layers: [
          { label: "Frontend", name: "Next.js + React", reason: "Blazing fast storefront with full design control" },
          { label: "Hosting", name: "Vercel", reason: "Edge-optimized hosting with automatic scaling" },
          { label: "Database", name: "Shopify Storefront API + PostgreSQL", reason: "Shopify handles products; Postgres for custom data" },
        ],
        integrations: buildIntegrations(features, "headless-commerce"),
        whyFits: [
          "Headless architecture gives you complete design freedom while Shopify manages inventory and checkout.",
          "Next.js delivers sub-second page loads, which directly improves conversion rates.",
          "This stack scales from hundreds to millions of visitors without rearchitecting.",
        ],
        pros: ["Full design control", "Excellent performance (fast page loads)", "Scales easily", "SEO-friendly server rendering"],
        cons: ["Higher upfront development cost", "Requires developer for changes", "More complex deployment pipeline"],
        monthlyCost: "$50 - $200/mo",
        alternative: {
          title: "Shopify Plus",
          description: "Enterprise Shopify with more customization options. Easier to manage than headless but less flexible on the frontend.",
        },
      };
    }
    // Mid-budget e-commerce
    return {
      title: "WooCommerce + WordPress Stack",
      layers: [
        { label: "Frontend", name: "WordPress + WooCommerce", reason: "Flexible store builder with thousands of plugins" },
        { label: "Hosting", name: "SiteGround or Cloudways", reason: "Optimized WordPress hosting with good performance" },
        { label: "Database", name: "MySQL (managed)", reason: "Included with hosting, handles products and orders" },
      ],
      integrations: buildIntegrations(features, "woocommerce"),
      whyFits: [
        "WooCommerce gives you full ownership of your store with no platform lock-in.",
        "Massive plugin ecosystem means you can add almost any feature without custom code.",
        "Lower ongoing costs than Shopify, especially at higher order volumes.",
      ],
      pros: ["No transaction fees", "Huge plugin ecosystem", "Full data ownership", "Lower ongoing costs"],
      cons: ["More maintenance required", "Performance needs attention as store grows", "Security is your responsibility"],
      monthlyCost: "$25 - $80/mo",
      alternative: {
        title: "Shopify",
        description: "If you prefer a fully managed platform and don't mind platform fees, Shopify is simpler to maintain day-to-day.",
      },
    };
  }

  // SaaS / Web App paths
  if (businessType === "saas") {
    if (isPremiumBudget && isDev) {
      return {
        title: "Enterprise SaaS Stack",
        layers: [
          { label: "Frontend", name: "Next.js + TypeScript + Tailwind", reason: "Production-grade framework with type safety" },
          { label: "Hosting", name: "Vercel + AWS", reason: "Edge delivery for the frontend, AWS for heavy backend workloads" },
          { label: "Database", name: "Supabase (PostgreSQL) + Redis", reason: "Relational data with Supabase auth; Redis for caching and real-time" },
        ],
        integrations: buildIntegrations(features, "saas-premium"),
        whyFits: [
          "This is the same stack used by high-growth startups -- built for scale from day one.",
          "Supabase gives you auth, real-time subscriptions, and a REST API without building from scratch.",
          "TypeScript catches bugs before they reach users, reducing maintenance costs long-term.",
        ],
        pros: ["Infinitely scalable", "Type-safe codebase", "Built-in auth and real-time", "Modern developer experience"],
        cons: ["Steep learning curve for non-developers", "Higher initial development time", "Multiple services to manage"],
        monthlyCost: "$100 - $500/mo",
        alternative: {
          title: "Firebase + React",
          description: "Faster to prototype with real-time database and auth built in. Less flexible for complex queries but great for MVPs.",
        },
      };
    }
    if (isHighBudget || isDev) {
      return {
        title: "Modern SaaS Stack",
        layers: [
          { label: "Frontend", name: "Next.js + React", reason: "Full-stack framework with API routes and server rendering" },
          { label: "Hosting", name: "Vercel", reason: "Zero-config deployments with automatic scaling" },
          { label: "Database", name: "Supabase (PostgreSQL)", reason: "Managed Postgres with built-in auth and real-time features" },
        ],
        integrations: buildIntegrations(features, "saas-modern"),
        whyFits: [
          "Next.js handles both your marketing site and app in one codebase, reducing complexity.",
          "Supabase provides authentication, database, and file storage so you can focus on your product.",
          "Vercel's edge network ensures fast load times globally without DevOps overhead.",
        ],
        pros: ["Fast development cycle", "Built-in auth and database", "Great developer experience", "Scales automatically"],
        cons: ["Requires JavaScript/React knowledge", "Vendor dependency on Supabase", "Can get expensive at very high scale"],
        monthlyCost: "$50 - $200/mo",
        alternative: {
          title: "Laravel + Vue.js + DigitalOcean",
          description: "A proven PHP stack with excellent documentation. Better if your team knows PHP, and offers more control over the backend.",
        },
      };
    }
    // Low/mid budget SaaS
    return {
      title: "No-Code SaaS Stack",
      layers: [
        { label: "Frontend", name: "Bubble.io or Softr", reason: "Visual app builder -- no coding required" },
        { label: "Hosting", name: "Included with platform", reason: "Fully managed, no server setup needed" },
        { label: "Database", name: "Built-in or Airtable", reason: "Visual database management with spreadsheet-like interface" },
      ],
      integrations: buildIntegrations(features, "nocode-saas"),
      whyFits: [
        "No-code platforms let you validate your SaaS idea before investing in custom development.",
        "You can build and iterate on your product yourself, even without a technical background.",
        "Most platforms include user auth, payments, and database -- everything you need to launch.",
      ],
      pros: ["No coding needed", "Very fast to launch (days)", "Low upfront cost", "Easy to iterate"],
      cons: ["Limited customization", "Performance constraints at scale", "Platform lock-in risk", "Monthly platform fees"],
      monthlyCost: "$30 - $150/mo",
      alternative: {
        title: "Next.js + Supabase",
        description: "When you're ready to scale beyond no-code, this modern stack gives you full control. Budget $8k+ for the initial build.",
      },
    };
  }

  // Blog / Content site
  if (businessType === "blog") {
    if (wantsLowMaintenance || isNonTech) {
      return {
        title: "Managed Blog Stack",
        layers: [
          { label: "Frontend", name: "WordPress.com or Ghost(Pro)", reason: "Purpose-built for content with beautiful reading experiences" },
          { label: "Hosting", name: "Included (managed)", reason: "Zero server management -- updates and security handled for you" },
          { label: "Database", name: "Managed (included)", reason: "Content storage handled automatically by the platform" },
        ],
        integrations: buildIntegrations(features, "blog-managed"),
        whyFits: [
          "These platforms are designed from the ground up for content creation and SEO.",
          "Fully managed means you focus on writing, not server maintenance or security updates.",
          "Ghost especially offers clean, distraction-free reading experiences that readers love.",
        ],
        pros: ["Zero maintenance", "Built-in SEO", "Beautiful content templates", "Automatic backups"],
        cons: ["Limited customization", "Monthly subscription required", "Harder to add non-blog features"],
        monthlyCost: "$9 - $45/mo",
        alternative: {
          title: "Self-hosted WordPress",
          description: "More plugins and customization options, but you manage hosting and updates yourself. Better if you want full control.",
        },
      };
    }
    if (isDev || wantsCustomization) {
      return {
        title: "Headless CMS Stack",
        layers: [
          { label: "Frontend", name: "Next.js + MDX or Astro", reason: "Static generation for blazing-fast page loads and perfect SEO" },
          { label: "Hosting", name: "Vercel or Netlify", reason: "Free tier available; deploys from Git automatically" },
          { label: "Database", name: "Sanity or Contentful (headless CMS)", reason: "Structured content API with visual editing interface" },
        ],
        integrations: buildIntegrations(features, "blog-headless"),
        whyFits: [
          "Static site generation gives you the fastest possible page loads -- great for SEO and reader experience.",
          "Headless CMS separates content from presentation, letting you redesign without touching content.",
          "Free hosting tiers mean your ongoing costs can be nearly zero for moderate traffic.",
        ],
        pros: ["Fastest page loads possible", "Perfect Lighthouse scores", "Free hosting for most blogs", "Full design control"],
        cons: ["Developer needed for design changes", "More complex initial setup", "Content editors need to learn the CMS"],
        monthlyCost: "$0 - $30/mo",
        alternative: {
          title: "Ghost (self-hosted)",
          description: "A modern, open-source blogging platform with a clean editor and built-in memberships. Simpler than headless but still developer-friendly.",
        },
      };
    }
    // Default blog
    return {
      title: "WordPress Blog Stack",
      layers: [
        { label: "Frontend", name: "WordPress + Theme", reason: "The world's most popular CMS with endless theme options" },
        { label: "Hosting", name: "SiteGround or Bluehost", reason: "Affordable WordPress-optimized hosting with one-click install" },
        { label: "Database", name: "MySQL (included)", reason: "Comes with hosting; handles all your content and media" },
      ],
      integrations: buildIntegrations(features, "blog-wp"),
      whyFits: [
        "WordPress powers 40%+ of the web -- there's a plugin for virtually anything you need.",
        "Affordable hosting options make this the most budget-friendly choice for content sites.",
        "Huge community means easy to find help, tutorials, and freelancers if needed.",
      ],
      pros: ["Huge plugin ecosystem", "Affordable", "Easy to find help", "SEO plugins available"],
      cons: ["Requires regular updates", "Can be slow without optimization", "Security needs attention"],
      monthlyCost: "$5 - $25/mo",
      alternative: {
        title: "Ghost(Pro)",
        description: "A cleaner, faster alternative focused purely on blogging and newsletters. No plugin bloat, but fewer customization options.",
      },
    };
  }

  // Local service business
  if (businessType === "local-service") {
    if (isNonTech && (isLowBudget || wantsSpeed)) {
      return {
        title: "Simple Business Website Stack",
        layers: [
          { label: "Frontend", name: "Squarespace or Wix", reason: "Drag-and-drop builder with professional templates" },
          { label: "Hosting", name: "Included with platform", reason: "Fully managed -- no server setup or maintenance" },
          { label: "Database", name: "Not needed", reason: "Platform handles contact forms and any data collection" },
        ],
        integrations: buildIntegrations(features, "local-simple"),
        whyFits: [
          "You can have a professional website live in a weekend without touching any code.",
          "Templates are designed for local businesses -- service pages, contact forms, and maps built in.",
          "All-in-one pricing means no surprise bills for hosting, SSL, or domain management.",
        ],
        pros: ["Live in hours, not weeks", "No technical skills needed", "Professional designs included", "Built-in contact forms and maps"],
        cons: ["Limited customization", "Monthly platform fees", "Harder to add complex features later"],
        monthlyCost: "$16 - $45/mo",
        alternative: {
          title: "WordPress + Starter Theme",
          description: "More flexible and cheaper long-term, but requires some technical comfort for setup and maintenance.",
        },
      };
    }
    if (isHighBudget || isDev) {
      return {
        title: "Custom Local Business Stack",
        layers: [
          { label: "Frontend", name: "Next.js + Tailwind CSS", reason: "Lightning-fast site with perfect SEO for local search" },
          { label: "Hosting", name: "Vercel", reason: "Edge-optimized with free SSL and automatic deployments" },
          { label: "Database", name: "Supabase or none", reason: "Only needed if you want booking or user accounts" },
        ],
        integrations: buildIntegrations(features, "local-custom"),
        whyFits: [
          "Custom-built sites load faster than any page builder, directly improving your Google ranking.",
          "Full control over design means your site truly stands out from competitors using templates.",
          "Server-rendered pages with structured data give you the best possible local SEO performance.",
        ],
        pros: ["Best possible performance", "Complete design freedom", "Superior local SEO", "No platform fees"],
        cons: ["Higher upfront cost", "Need a developer for changes", "Overkill if you just need a simple brochure site"],
        monthlyCost: "$0 - $20/mo",
        alternative: {
          title: "WordPress + Local SEO Plugin",
          description: "Easier to self-manage with a good theme and Yoast SEO. Better if you want to make frequent updates yourself.",
        },
      };
    }
    // Default local service
    return {
      title: "WordPress Business Stack",
      layers: [
        { label: "Frontend", name: "WordPress + Business Theme", reason: "Easy to update yourself with visual page builder" },
        { label: "Hosting", name: "SiteGround", reason: "Fast WordPress hosting with free SSL and daily backups" },
        { label: "Database", name: "MySQL (included)", reason: "Included with hosting; handles your content and forms" },
      ],
      integrations: buildIntegrations(features, "local-wp"),
      whyFits: [
        "WordPress gives you the flexibility to add features as your business grows.",
        "Visual page builders like Elementor let you make changes without a developer.",
        "Strong local SEO capabilities with plugins like Yoast help you rank in your area.",
      ],
      pros: ["Easy to self-manage", "Affordable hosting", "Great SEO plugins", "Huge theme selection"],
      cons: ["Needs regular updates", "Can slow down with too many plugins", "Security responsibility is yours"],
      monthlyCost: "$10 - $30/mo",
      alternative: {
        title: "Squarespace",
        description: "Even simpler to manage with no updates or security worries. Best if you want zero maintenance and don't need custom features.",
      },
    };
  }

  // Portfolio / Agency
  if (businessType === "portfolio") {
    if (isDev || wantsCustomization) {
      return {
        title: "Custom Portfolio Stack",
        layers: [
          { label: "Frontend", name: "Next.js + Framer Motion", reason: "Stunning animations and interactions to showcase your work" },
          { label: "Hosting", name: "Vercel", reason: "Free tier handles most portfolio traffic; instant global deploys" },
          { label: "Database", name: "Sanity CMS (optional)", reason: "Headless CMS for easy project updates without code changes" },
        ],
        integrations: buildIntegrations(features, "portfolio-custom"),
        whyFits: [
          "A custom portfolio site is itself a showcase of your technical skills and design taste.",
          "Framer Motion enables rich animations that make your work stand out memorably.",
          "Vercel's free tier is generous enough for most portfolio sites -- your hosting cost can be $0.",
        ],
        pros: ["Unlimited creative freedom", "Rich animations possible", "Free or very cheap hosting", "Great performance"],
        cons: ["Time-intensive to build", "Need to code all updates", "Animation performance needs careful testing"],
        monthlyCost: "$0 - $20/mo",
        alternative: {
          title: "Webflow",
          description: "Visual builder with good animation support. Faster to build than custom code and still looks impressive.",
        },
      };
    }
    // Default portfolio
    return {
      title: "Webflow Portfolio Stack",
      layers: [
        { label: "Frontend", name: "Webflow", reason: "Visual builder with professional animations and interactions" },
        { label: "Hosting", name: "Webflow (included)", reason: "Fast CDN hosting included with your plan" },
        { label: "Database", name: "Webflow CMS", reason: "Built-in CMS for managing portfolio projects" },
      ],
      integrations: buildIntegrations(features, "portfolio-webflow"),
      whyFits: [
        "Webflow produces clean, fast websites that look custom-built -- without writing code.",
        "The visual CMS makes it easy to add new portfolio pieces as you complete projects.",
        "Built-in interactions and animations help your portfolio stand out from template-based sites.",
      ],
      pros: ["No coding required", "Professional animations", "Built-in CMS", "Clean output code"],
      cons: ["Learning curve for Webflow", "Monthly platform fees", "Less flexible than custom code"],
      monthlyCost: "$14 - $39/mo",
      alternative: {
        title: "Squarespace",
        description: "Even simpler with beautiful portfolio templates. Less animation control but faster to set up.",
      },
    };
  }

  // Non-profit
  if (businessType === "nonprofit") {
    if (isHighBudget || isDev) {
      return {
        title: "Custom Non-profit Stack",
        layers: [
          { label: "Frontend", name: "Next.js + Tailwind CSS", reason: "Fast, accessible site that meets WCAG standards" },
          { label: "Hosting", name: "Vercel (free tier or non-profit discount)", reason: "Generous free tier; many providers offer non-profit discounts" },
          { label: "Database", name: "Supabase", reason: "Free tier for donor data and event management" },
        ],
        integrations: buildIntegrations(features, "nonprofit-custom"),
        whyFits: [
          "Custom development ensures your site is fully accessible, meeting your organization's inclusivity values.",
          "Many platforms offer free or discounted tiers for registered non-profits.",
          "A fast, well-built site builds donor trust and improves donation conversion rates.",
        ],
        pros: ["Full accessibility control", "Non-profit discounts available", "Donor trust through professionalism", "Complete customization"],
        cons: ["Higher upfront investment", "Requires developer for changes", "More complex than page builders"],
        monthlyCost: "$0 - $50/mo",
        alternative: {
          title: "WordPress + Non-profit Theme",
          description: "Easier to self-manage with donation plugins like GiveWP. Large volunteer communities can help with maintenance.",
        },
      };
    }
    // Default non-profit
    return {
      title: "WordPress Non-profit Stack",
      layers: [
        { label: "Frontend", name: "WordPress + Non-profit Theme", reason: "Donation-ready themes with event and volunteer management" },
        { label: "Hosting", name: "SiteGround or free non-profit hosting", reason: "Affordable options; some hosts offer free plans for non-profits" },
        { label: "Database", name: "MySQL (included)", reason: "Handles donor data, events, and content" },
      ],
      integrations: buildIntegrations(features, "nonprofit-wp"),
      whyFits: [
        "WordPress has dedicated non-profit themes and donation plugins built specifically for organizations like yours.",
        "Many hosting providers offer free or discounted plans for registered non-profits.",
        "Volunteers with WordPress experience are easy to find for ongoing site maintenance.",
      ],
      pros: ["Non-profit plugins available", "Affordable or free hosting", "Easy to find volunteer help", "Donation forms built in"],
      cons: ["Needs regular maintenance", "Plugin conflicts possible", "Security updates required"],
      monthlyCost: "$0 - $20/mo",
      alternative: {
        title: "Squarespace",
        description: "Simpler to manage with clean templates and built-in donation blocks. Non-profit discount available.",
      },
    };
  }

  // Fallback / generic recommendation
  return {
    title: "WordPress Flexible Stack",
    layers: [
      { label: "Frontend", name: "WordPress + Modern Theme", reason: "The most versatile CMS, suitable for almost any project" },
      { label: "Hosting", name: "SiteGround or Cloudways", reason: "Reliable, fast hosting with good support" },
      { label: "Database", name: "MySQL (included)", reason: "Included with hosting; handles all your data" },
    ],
    integrations: buildIntegrations(features, "generic-wp"),
    whyFits: [
      "WordPress is the safest default -- it powers over 40% of the web for good reason.",
      "Massive ecosystem means you can add any feature through plugins.",
      "Easy to find developers, designers, and support when you need help.",
    ],
    pros: ["Most popular CMS", "Huge plugin library", "Easy to find help", "Flexible"],
    cons: ["Needs maintenance", "Can slow down with plugins", "Security responsibility"],
    monthlyCost: "$10 - $30/mo",
    alternative: {
      title: "Webflow",
      description: "A modern visual builder with clean output. Better design tools than WordPress but smaller ecosystem.",
    },
  };
}

function buildIntegrations(features: string[], stackType: string): string[] {
  const integrations: string[] = [];

  const isShopify = stackType.includes("shopify") || stackType === "shopify";
  const isWP = stackType.includes("wp") || stackType.includes("woocommerce");
  const isNoCode = stackType.includes("nocode");
  const isCustom = stackType.includes("custom") || stackType.includes("headless") || stackType.includes("modern") || stackType.includes("premium");
  const isWebflow = stackType.includes("webflow");
  const isManaged = stackType.includes("managed") || stackType.includes("simple");

  for (const f of features) {
    switch (f) {
      case "payments":
        if (isShopify) integrations.push("Shopify Payments (built-in)");
        else if (isWP) integrations.push("WooCommerce Payments or Stripe plugin");
        else if (isCustom) integrations.push("Stripe API integration");
        else if (isWebflow) integrations.push("Stripe via Webflow E-commerce");
        else if (isNoCode) integrations.push("Stripe via platform integration");
        else if (isManaged) integrations.push("Stripe or PayPal button embed");
        else integrations.push("Stripe payment integration");
        break;
      case "booking":
        if (isWP) integrations.push("Amelia or Bookly plugin");
        else if (isCustom) integrations.push("Cal.com or Calendly API");
        else if (isManaged || isWebflow) integrations.push("Calendly embed");
        else integrations.push("Calendly or Cal.com integration");
        break;
      case "blog-cms":
        if (isWP) integrations.push("WordPress built-in blog");
        else if (isCustom) integrations.push("Sanity or Contentful CMS");
        else if (isWebflow) integrations.push("Webflow CMS (built-in)");
        else integrations.push("Built-in blog/CMS");
        break;
      case "user-accounts":
        if (isCustom) integrations.push("Supabase Auth or NextAuth.js");
        else if (isWP) integrations.push("WP Members or Ultimate Member plugin");
        else if (isNoCode) integrations.push("Platform built-in auth");
        else integrations.push("User authentication system");
        break;
      case "email-marketing":
        if (isCustom) integrations.push("Resend or SendGrid API + Mailchimp");
        else integrations.push("Mailchimp or ConvertKit integration");
        break;
      case "seo-tools":
        if (isWP) integrations.push("Yoast SEO or Rank Math plugin");
        else if (isCustom) integrations.push("Next SEO + structured data + sitemap generation");
        else integrations.push("Built-in SEO tools");
        break;
      case "analytics":
        if (isCustom) integrations.push("Plausible or PostHog analytics");
        else integrations.push("Google Analytics 4 integration");
        break;
      case "mobile-app":
        if (isCustom) integrations.push("React Native or Expo for shared codebase");
        else if (isNoCode) integrations.push("Adalo or FlutterFlow companion app");
        else integrations.push("Progressive Web App (PWA) for mobile experience");
        break;
    }
  }

  return integrations;
}

// ---------------------------------------------------------------------------
// Icon mapping helper
// ---------------------------------------------------------------------------

function LayerIcon({ label }: { label: string }) {
  switch (label) {
    case "Frontend":
      return <Globe className="w-5 h-5 text-primary" />;
    case "Hosting":
      return <Server className="w-5 h-5 text-primary" />;
    case "Database":
      return <Database className="w-5 h-5 text-primary" />;
    default:
      return <Layers className="w-5 h-5 text-primary" />;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TechStackRecommender() {
  const [inputs, setInputs] = useState<Inputs>({
    businessType: "",
    budget: "",
    priority: "",
    skillLevel: "",
    features: [],
    email: "",
  });

  const [result, setResult] = useState<Recommendation | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleFeatureToggle = (value: string) => {
    setInputs((prev) => ({
      ...prev,
      features: prev.features.includes(value)
        ? prev.features.filter((f) => f !== value)
        : [...prev.features, value],
    }));
  };

  const handleGenerate = () => {
    if (!inputs.businessType || !inputs.budget || !inputs.priority || !inputs.skillLevel) {
      alert("Please complete all required selections before generating your recommendation.");
      return;
    }
    const rec = generateRecommendation(inputs);
    setResult(rec);
    setShowResult(true);

    // Scroll to result after a short delay for DOM update
    setTimeout(() => {
      document.getElementById("stack-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleReset = () => {
    setInputs({ businessType: "", budget: "", priority: "", skillLevel: "", features: [], email: "" });
    setResult(null);
    setShowResult(false);
  };

  const currentStep = !inputs.businessType
    ? 1
    : !inputs.budget
      ? 2
      : !inputs.priority
        ? 3
        : !inputs.skillLevel
          ? 4
          : 5;

  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Code className="w-4 h-4" />
            <span>Tech Stack Recommender</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Stack</h2>
          <p className="text-xl text-muted-foreground">
            Answer a few questions and get a personalized technology recommendation.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">Step {Math.min(currentStep, 5)} of 5</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(Math.min(currentStep, 5) / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <div className="space-y-8">
            {/* 1. Business Type */}
            <div>
              <label className="block text-sm font-medium mb-3">
                1. What type of business or project is this for? <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {businessTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setInputs((prev) => ({ ...prev, businessType: type.value }))}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      inputs.businessType === type.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    aria-pressed={inputs.businessType === type.value}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Budget */}
            <div>
              <label className="block text-sm font-medium mb-3">
                2. What is your budget range? <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {budgetRanges.map((range) => (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => setInputs((prev) => ({ ...prev, budget: range.value }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      inputs.budget === range.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    aria-pressed={inputs.budget === range.value}
                  >
                    <div className="font-semibold text-sm">{range.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Priority */}
            <div>
              <label className="block text-sm font-medium mb-3">
                3. What is your top priority? <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setInputs((prev) => ({ ...prev, priority: p.value }))}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      inputs.priority === p.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    aria-pressed={inputs.priority === p.value}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Skill Level */}
            <div>
              <label className="block text-sm font-medium mb-3">
                4. What is your technical skill level? <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {skillLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setInputs((prev) => ({ ...prev, skillLevel: level.value }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      inputs.skillLevel === level.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    aria-pressed={inputs.skillLevel === level.value}
                  >
                    <div className="font-semibold text-sm">{level.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Features (multi-select) */}
            <div>
              <label className="block text-sm font-medium mb-3">
                5. Must-have features <span className="text-muted-foreground font-normal">(select all that apply)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featureOptions.map((feature) => (
                  <button
                    key={feature.value}
                    type="button"
                    onClick={() => handleFeatureToggle(feature.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left flex items-start gap-3 ${
                      inputs.features.includes(feature.value)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    aria-pressed={inputs.features.includes(feature.value)}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        inputs.features.includes(feature.value)
                          ? "border-primary bg-primary"
                          : "border-border"
                      }`}
                    >
                      {inputs.features.includes(feature.value) && (
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{feature.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              Get My Stack Recommendation
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* ----- Result ----- */}
          {showResult && result && (
            <div id="stack-result" className="mt-10 space-y-6 animate-[fadeIn_0.4s_ease-out]">
              {/* Divider */}
              <div className="border-t border-border" />

              {/* Recommended Stack Card */}
              <div className="p-6 rounded-xl bg-primary/5 border-2 border-primary/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary">Recommended Stack</div>
                    <h3 className="text-2xl font-bold">{result.title}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {result.layers.map((layer) => (
                    <div
                      key={layer.label}
                      className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <LayerIcon label={layer.label} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          {layer.label}
                        </div>
                        <div className="font-semibold">{layer.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">{layer.reason}</div>
                      </div>
                    </div>
                  ))}

                  {/* Integrations */}
                  {result.integrations.length > 0 && (
                    <div className="p-4 rounded-lg bg-card/50 border border-border">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        Key Integrations
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.integrations.map((integration, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20"
                          >
                            {integration}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Why This Stack Fits You */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Why This Stack Fits You
                </h4>
                <ul className="space-y-3">
                  {result.whyFits.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                      </div>
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-primary" />
                    Pros
                  </h4>
                  <ul className="space-y-2">
                    {result.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5">+</span>
                        <span className="text-muted-foreground">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ThumbsDown className="w-5 h-5 text-muted-foreground" />
                    Cons
                  </h4>
                  <ul className="space-y-2">
                    {result.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground mt-0.5">-</span>
                        <span className="text-muted-foreground">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Monthly Cost */}
              <div className="p-6 rounded-xl bg-card border border-border flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Estimated Monthly Running Cost</div>
                  <div className="text-2xl font-bold text-primary">{result.monthlyCost}</div>
                </div>
              </div>

              {/* Alternative */}
              <div className="p-6 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Alternative Option</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">{result.alternative.title}</h4>
                <p className="text-sm text-muted-foreground">{result.alternative.description}</p>
              </div>

              {/* CTA */}
              <div className="p-6 rounded-xl bg-primary/5 border-2 border-primary/20 text-center">
                <h4 className="text-xl font-bold mb-2">Stack Consulting AI can build this for you</h4>
                <p className="text-muted-foreground mb-6 text-sm">
                  Get a free consultation and custom quote for your project. We will bring this stack to life.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={inputs.email}
                      onChange={(e) => setInputs((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="you@example.com"
                      aria-label="Email address"
                    />
                  </div>
                  <a
                    href={`mailto:hello@stackconsultingai.com?subject=Tech Stack Build Request&body=Hi, I used your Tech Stack Recommender and got: ${encodeURIComponent(result.title)}. I'd like to discuss building this.`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all whitespace-nowrap"
                  >
                    Get Free Quote
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Start over */}
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Start Over with Different Inputs
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>No signup required -- Instant results -- Expert-curated recommendations</p>
        </div>
      </div>
    </section>
  );
}
