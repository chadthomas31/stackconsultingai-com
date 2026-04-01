import Image from "next/image";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    name: "Fix It San Clemente",
    description: "Mobile auto repair with online booking — 40% more appointments after launch",
    image: "/screenshots/fixitsanclemente.png",
    alt: "Fix It San Clemente - mobile auto repair website with online booking built by Stack Consulting AI",
    tags: ["Next.js", "Booking", "Local SEO"],
    url: "https://fixitsanclemente.com"
  },
  {
    name: "Strategic Sync",
    description: "AI consulting platform with multi-provider integration and booking system",
    image: "/screenshots/strategicsync.png",
    alt: "Strategic Sync - AI consulting platform with multi-provider integration built with Next.js",
    tags: ["Next.js", "AI", "Full-Stack"],
    url: "https://strategicsync.com"
  },
  {
    name: "Elysium Ranch",
    description: "Holistic wellness retreat with offerings, testimonials, and booking CTA",
    image: "/screenshots/elysiumranch.png",
    alt: "Elysium Ranch - holistic wellness retreat website design with SEO optimization",
    tags: ["Website", "SEO", "UX"],
    url: "https://elysiumranch.org/"
  },
  {
    name: "CG ModelTek",
    description: "Aerospace precision manufacturing — CNC machining capabilities showcase",
    image: "/screenshots/cgmodeltekv3.png",
    alt: "CG ModelTek - aerospace precision manufacturing website with CNC machining showcase",
    tags: ["Next.js", "Manufacturing", "B2B"],
    url: "https://cgmodeltek-v2.vercel.app/"
  },
  {
    name: "Dr. Robert Woods MD",
    description: "Concierge psychiatry practice with personalized care and online scheduling",
    image: "/screenshots/dr-woods.png",
    alt: "Dr. Robert Woods MD - concierge psychiatry website with online scheduling system",
    tags: ["Next.js", "Healthcare", "SEO"],
    url: "https://robertwoodsmd.help"
  },
  {
    name: "The Puffery",
    description: "Artisan cream puff bakery with full online ordering system",
    image: "/screenshots/the-puffery.png",
    alt: "The Puffery - artisan bakery e-commerce website with online ordering system",
    tags: ["Next.js", "E-commerce", "Ordering"],
    url: "https://the-puffery.vercel.app"
  },
  {
    name: "AnyFix Chicago",
    description: "North Shore handyman service with full-service home repair and booking",
    image: "/screenshots/anyfix.png",
    alt: "AnyFix Chicago - North Shore handyman service website with online booking",
    tags: ["Next.js", "Local SEO", "Booking"],
    url: "https://anyfix.vercel.app"
  },
  {
    name: "Tito's Automotive",
    description: "Family-owned auto repair shop with ASE-certified technicians",
    image: "/screenshots/titosautomotive.png",
    alt: "Tito's Automotive Services - auto repair shop website with warranty tracking",
    tags: ["Next.js", "Automotive", "SEO"],
    url: "https://titosautomotiveservices-com.vercel.app"
  },
  {
    name: "DKBR Services",
    description: "Commercial construction firm — drywall, framing, and tenant improvements",
    image: "/screenshots/dkbr-services.png",
    alt: "DKBR Services - commercial construction website",
    tags: ["Next.js", "Construction", "B2B"],
    url: "https://dkbr-services.vercel.app/"
  },
  {
    name: "Continental Interior Service",
    description: "Commercial interior construction — drywall, framing, and tenant improvements",
    image: "/screenshots/continental-interior-service.png",
    alt: "Continental Interior Service - commercial construction website",
    tags: ["Astro", "Construction", "B2B"],
    url: "https://continental-interior-services.vercel.app"
  }
];

export default function Portfolio() {
  const [featured, ...rest] = projects;

  return (
    <section id="portfolio" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header — left-aligned */}
        <div className="mb-14">
          <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">Our Work</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 tracking-tight">Built for Real Businesses</h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            Strategy, automation, and integration — shipped and live.
          </p>
        </div>

        {/* Featured Project — full width */}
        <a
          href={featured.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block mb-8 rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row">
            <div className="relative md:w-3/5 h-64 md:h-80 overflow-hidden bg-secondary">
              <Image
                src={featured.image}
                alt={featured.alt}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
            <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-center bg-card">
              <div className="flex flex-wrap gap-2 mb-4">
                {featured.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                {featured.name}
              </h3>
              <p className="text-muted-foreground mb-6">{featured.description}</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                View Live Site
                <ExternalLink className="w-4 h-4" />
              </span>
            </div>
          </div>
        </a>

        {/* Remaining Projects — compact grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((project, index) => (
            <a
              key={index}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="relative h-40 overflow-hidden bg-secondary">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="p-5 bg-card">
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}