import { Code2, Zap, ShoppingCart, Wrench } from "lucide-react";

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
    icon: Wrench,
    title: "Maintenance",
    description: "Ongoing support, updates, and optimization to keep your website running smoothly and securely."
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive web solutions tailored to your business needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}