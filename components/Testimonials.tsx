import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Paul Ries",
    business: "Fix It San Clemente",
    role: "Owner",
    content: "Stack Consulting AI transformed our online presence. The booking system they built has increased our appointments by 40%. Their attention to detail and understanding of our business needs was exceptional.",
    rating: 5
  },
  {
    name: "Kate McCluskey",
    business: "Mid-Pacific Cleaning",
    role: "Owner",
    content: "Working with Stack Consulting AI was seamless. They delivered a beautiful, functional website that perfectly represents our brand. Our leads have doubled since launch.",
    rating: 5
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
  return (
    <section id="testimonials" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real results from real businesses across South Orange County
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.business}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
