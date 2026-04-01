import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Paul Ries",
    business: "Fix It San Clemente",
    role: "Owner",
    content: "Stack Consulting AI transformed our online presence. The booking system they built has increased our appointments by 40%. Their attention to detail and understanding of our business needs was exceptional.",
    rating: 5,
    stat: "40%",
    statLabel: "more appointments"
  },
  {
    name: "Kate McCluskey",
    business: "Mid-Pacific Cleaning",
    role: "Owner",
    content: "Working with Stack Consulting AI was seamless. They delivered a beautiful, functional website that perfectly represents our brand. Our leads have doubled since launch.",
    rating: 5,
    stat: "2x",
    statLabel: "lead volume"
  },
  {
    name: "David Thompson",
    business: "DKBR Services",
    role: "CEO",
    content: "The project management portal they developed has streamlined our entire workflow. Communication was excellent throughout the project, and the final product exceeded expectations.",
    rating: 5
  }
];

export default function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section id="testimonials" className="py-24 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">Client Results</p>

        {/* Featured Testimonial — large, asymmetric */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 mb-12">
          <div className="md:w-3/5 relative">
            <Quote className="absolute -top-2 -left-2 w-10 h-10 text-primary/15" />
            <blockquote className="text-2xl md:text-3xl font-medium leading-snug text-foreground pl-6 border-l-2 border-primary/30">
              {featured.content}
            </blockquote>
            <div className="flex items-center gap-3 mt-8 pl-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                {featured.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="font-semibold text-sm">{featured.name}</div>
                <div className="text-xs text-muted-foreground">{featured.role}, {featured.business}</div>
              </div>
              <div className="ml-4 flex gap-0.5">
                {[...Array(featured.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
            </div>
          </div>

          {/* Stat callout */}
          {featured.stat && (
            <div className="md:w-2/5 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-heading font-bold text-accent">{featured.stat}</div>
                <div className="text-sm text-muted-foreground mt-2">{featured.statLabel}</div>
              </div>
            </div>
          )}
        </div>

        {/* Secondary testimonials — compact row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between p-6 rounded-xl border border-border"
            >
              <div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.business}</div>
                  </div>
                </div>
                {testimonial.stat && (
                  <div className="text-right">
                    <div className="text-xl font-bold text-accent">{testimonial.stat}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.statLabel}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
