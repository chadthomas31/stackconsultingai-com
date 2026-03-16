import ROICalculator from "@/components/ROICalculator";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export const metadata = {
  title: "ROI Calculator | Website Investment Returns | Stack Consulting AI",
  description:
    "Calculate the potential return on investment for your new website. See projected revenue increases, payback period, and ROI percentage. Free, no signup required.",
};

export default function ROICalculatorPage() {
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
              <span className="text-foreground">ROI Calculator</span>
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
      <ROICalculator />

      {/* Additional Value Proposition */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Why Invest in a New Website?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            A professionally built website is one of the highest-ROI investments
            a small business can make. Here is what our clients typically see.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2-3x</div>
              <div className="text-sm text-muted-foreground">
                Average Conversion Lift
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                &lt;6 mo
              </div>
              <div className="text-sm text-muted-foreground">
                Typical Payback Period
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">300%+</div>
              <div className="text-sm text-muted-foreground">
                Average First-Year ROI
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
