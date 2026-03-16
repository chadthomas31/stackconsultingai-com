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
    name: "Elysium Ranch",
    description: "Holistic wellness retreat website with offerings, testimonials, and booking CTA",
    image: "/screenshots/elysiumranch.png",
    tags: ["Website", "SEO", "UX"],
    url: "https://elysiumranch.org/"
  },
  {
    name: "Strategic Sync",
    description: "AI consulting platform with multi-provider integration and booking system",
    image: "/screenshots/strategicsync.png",
    tags: ["Next.js", "AI", "Full-Stack"],
    url: "https://strategicsync.com"
  },
  {
    name: "Mid-Pacific Cleaning",
    description: "Commercial cleaning services website with service area mapping and eco-friendly focus",
    image: "/screenshots/mid-pacific-cleaning.png",
    tags: ["Next.js", "TypeScript", "SEO"],
    url: "https://mid-pacific-cleaning-com.vercel.app"
  },
  {
    name: "CG ModelTek",
    description: "Aerospace precision manufacturing platform showcasing CNC machining capabilities",
    image: "/screenshots/cgmodeltekv3.png",
    tags: ["Next.js", "TypeScript", "Aerospace"],
    url: "https://cgmodeltekv3.vercel.app"
  },
  {
    name: "Dr. Woods Psychiatry",
    description: "Concierge psychiatry practice with personalized care and online scheduling",
    image: "/screenshots/dr-woods.png",
    tags: ["Next.js", "Healthcare", "SEO"],
    url: "https://dr-woods-website.vercel.app"
  },
  {
    name: "AnyFix Chicago",
    description: "North Shore handyman service with full-service home repair and booking",
    image: "/screenshots/anyfix.png",
    tags: ["Next.js", "TypeScript", "Local SEO"],
    url: "https://anyfix.vercel.app"
  },
  {
    name: "Tito's Automotive Services",
    description: "Family-owned auto repair shop with ASE-certified technicians and warranty tracking",
    image: "/screenshots/titosautomotive.png",
    tags: ["Next.js", "TypeScript", "SEO"],
    url: "https://titosautomotiveservices-com.vercel.app"
  },
  {
    name: "VenturAI",
    description: "Hyperlocal market intelligence platform to find profitable business gaps in your city",
    image: "/screenshots/venturai.png",
    tags: ["React", "Supabase", "AI"],
    url: "https://venturai-tech.vercel.app"
  },
  {
    name: "The Puffery",
    description: "Artisan cream puff specialty bakery with online ordering system",
    image: "/screenshots/the-puffery.png",
    tags: ["Next.js", "TypeScript", "E-commerce"],
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
            We turn disconnected tools into intelligent, streamlined systems.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Strategy, automation, and integration built for your business.
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
                {project.url !== "#" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all"
                    >
                      View Live Site
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
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