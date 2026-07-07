import PricingCalculator from "@/components/PricingCalculator";
import ToolSeoPanel from "@/components/ToolSeoPanel";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export const metadata = {
  title: "Website Cost Calculator | Stack Consulting AI",
  description: "Get instant website cost estimates for your project. Free calculator shows pricing breakdowns, timelines, and what's included. No signup required.",
};

export default function CostCalculatorPage() {
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
              <span className="text-foreground">Cost Calculator</span>
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

      {/* Calculator */}
      <PricingCalculator />

      <ToolSeoPanel
        title="Use the estimate to scope the right website build"
        intro="A website quote should reflect the business outcome, not just the page count. The calculator helps separate a straightforward marketing site from a lead-generation build with forms, analytics, integrations, and automation."
        bullets={[
          "Simple brochure sites need clear positioning, fast pages, and clean contact paths before custom software gets involved.",
          "Lead-generation sites need tracked forms, conversion events, local SEO structure, and follow-up automation.",
          "Larger builds should include staging, content migration, redirects, analytics checks, and launch monitoring in the scope.",
        ]}
        primaryHref="/services/web-development"
        primaryLabel="See web development services"
        secondaryHref="/free-ai-site-audit"
        secondaryLabel="Audit your current site"
      />
      
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
