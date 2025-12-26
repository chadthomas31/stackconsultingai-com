import Image from "next/image";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    name: "Fix It San Clemente",
    description: "Local mobile auto repair and maintenance service with online booking",
    image: "/screenshots/fixitsanclemente.png",
    tags: ["Next.js", "TypeScript", "Booking"],
    url: "https://fixitsanclemente.com"
  },
  {
    name: "Tito's Automotive Services",
    description: "Professional automotive repair shop with service scheduling and quotes",
    image: "/screenshots/titosautomotive.png",
    tags: ["Next.js", "TypeScript", "SEO"],
    url: "https://titosautomotiveservices.com"
  },
  {
    name: "DKBR Services",
    description: "Commercial and residential services with project management portal",
    image: "/screenshots/dkbr-services.png",
    tags: ["Next.js", "Supabase", "Dashboard"],
    url: "https://dkbr.services"
  },
  {
    name: "The Puffery",
    description: "E-commerce platform for premium vaping products with custom ordering system",
    image: "/screenshots/the-puffery.png",
    tags: ["Next.js", "TypeScript", "E-commerce"],
    url: "#"
  },
  {
    name: "SoCal Mobile Auto",
    description: "Mobile auto repair service website with booking and scheduling",
    image: "/screenshots/socalmobileauto.png",
    tags: ["Next.js", "Supabase", "Booking"],
    url: "https://socalmobileauto.com"
  },
  {
    name: "Mobile Auto Repair Tech",
    description: "Professional mobile auto repair services with multilingual support",
    image: "/screenshots/mobileautorepair.png",
    tags: ["Next.js", "TypeScript", "i18n"],
    url: "#"
  },
  {
    name: "Mid-Pacific Cleaning",
    description: "Commercial cleaning services website with service area mapping",
    image: "/screenshots/mid-pacific-cleaning.png",
    tags: ["Next.js", "TypeScript", "SEO"],
    url: "#"
  },
  {
    name: "VenturAI",
    description: "AI-powered business idea generator with Stripe integration",
    image: "/screenshots/venturai.png",
    tags: ["React", "Supabase", "AI"],
    url: "#"
  },
  {
    name: "Quadra Touch",
    description: "Modern business solutions platform with custom features",
    image: "/screenshots/quadratouch.png",
    tags: ["Next.js", "TypeScript", "Supabase"],
    url: "#"
  }
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Work</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Delivering results for businesses across South Orange County
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-secondary">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  {project.url !== "#" && (
                    <a 
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}