import TechStackRecommender from "@/components/TechStackRecommender";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export const metadata = {
  title: "Tech Stack Recommender | Free Tool | Stack Consulting AI",
  description:
    "Find the perfect technology stack for your business. Get personalized recommendations for frameworks, hosting, databases, and integrations based on your needs and budget.",
};

export default function TechStackPage() {
  return (
    <main className="min-h-screen">
      {/* Breadcrumb & Back Navigation */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                <Home className="w-4 h-4" />
              </Link>
              <span>/</span>
              <Link href="/tools" className="hover:text-foreground transition-colors">
                Tools
              </Link>
              <span>/</span>
              <span className="text-foreground">Tech Stack Recommender</span>
            </div>

            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Tools
            </Link>
          </div>
        </div>
      </div>

      {/* Recommender */}
      <TechStackRecommender />

      {/* Additional Value Proposition */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose Stack Consulting AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">8+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24hr</div>
              <div className="text-sm text-muted-foreground">Average Response</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
