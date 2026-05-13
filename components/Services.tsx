import { Code2, Zap, ShoppingCart, Wrench, Wifi } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Custom Next.js applications built with TypeScript and modern best practices. Fast, scalable, and SEO-optimized."
  },
  {
    icon: Zap,
    title: "Business Automation",
    description: "Streamline operations with Supabase integration, automated workflows, and efficient data management."
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Complete online store solutions with secure payments, inventory management, and customer portals."
  },
  {
    icon: Wifi,
    title: "Guest WiFi + Email Capture",
    description: "Branded captive portal on pfSense + UniFi. Customers log on, you collect emails into your newsletter list. Lead-gen built into the wall."
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description: "Ongoing support, updates, and optimization to keep your website running smoothly and securely."
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Split layout: copy left, services right */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* Left: Section Copy */}
          <div className="lg:w-2/5 lg:sticky lg:top-32 lg:self-start">
            <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">What we do</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
              Smarter Stacks for Growing Businesses
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Clear systems, practical AI, and real ROI—without enterprise complexity.
            </p>
            <p className="text-sm text-muted-foreground">
              We don&rsquo;t sell AI. We fix stacks.
            </p>
          </div>

          {/* Right: Services List */}
          <div className="lg:w-3/5 space-y-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group flex items-start gap-5 p-6 rounded-xl border border-transparent hover:border-border hover:bg-card/50 transition-all duration-300"
                >
                  <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors duration-300">{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}