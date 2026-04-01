import AutomationFinder from "@/components/AutomationFinder";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export const metadata = {
  title:
    "Free Automation Opportunity Finder | Save Time & Money | Stack Consulting AI",
  description:
    "Discover which parts of your business can be automated. Get a personalized automation roadmap with estimated time and cost savings — completely free.",
  openGraph: {
    title: "Free Automation Opportunity Finder | Stack Consulting AI",
    description:
      "Find out how much time and money your business can save with automation. Get a free personalized report in minutes.",
    type: "website",
  },
};

export default function AutomationFinderPage() {
  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                <Home className="w-4 h-4" />
              </Link>
              <span>/</span>
              <Link
                href="/tools"
                className="hover:text-foreground transition-colors"
              >
                Tools
              </Link>
              <span>/</span>
              <span className="text-foreground">Automation Finder</span>
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

      {/* Tool */}
      <AutomationFinder />

      {/* Why Automate? */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold font-heading text-center mb-10">
            Why Automate Your Business?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-primary font-heading mb-2">
                40%
              </div>
              <p className="text-sm text-muted-foreground">
                of workers spend at least a quarter of their week on repetitive
                manual tasks
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-primary font-heading mb-2">
                $1.5T
              </div>
              <p className="text-sm text-muted-foreground">
                estimated global value of work activities that can be automated
                with current technology
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-primary font-heading mb-2">
                3x
              </div>
              <p className="text-sm text-muted-foreground">
                faster growth for small businesses that adopt automation early
                compared to those that don&apos;t
              </p>
            </div>
          </div>
          <div className="mt-10 text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Every hour your team spends on repetitive tasks is an hour not spent
              growing your business. Automation isn&apos;t just for big
              companies — small businesses see the biggest ROI from eliminating
              manual processes.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Let Us Automate Your Business
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
