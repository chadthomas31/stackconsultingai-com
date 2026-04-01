import SiteAudit from "@/components/SiteAudit";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export const metadata = {
  title: "Free AI Site Audit | Website Performance & SEO Analysis | Stack Consulting AI",
  description:
    "Run a free website audit powered by Google Lighthouse. Get instant scores for performance, SEO, accessibility, and best practices. No signup required — results in 15 seconds.",
  openGraph: {
    title: "Free AI Site Audit | Stack Consulting AI",
    description:
      "Get a comprehensive website audit with performance, SEO, accessibility, and best practice scores. Powered by Google Lighthouse.",
    type: "website",
  },
};

export default function SiteAuditPage() {
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
              <span className="text-foreground">Site Audit</span>
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

      {/* Audit Tool */}
      <SiteAudit />

      {/* Why This Matters */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold font-heading text-center mb-10">
            Why Website Performance Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-primary font-heading mb-2">
                53%
              </div>
              <p className="text-sm text-muted-foreground">
                of mobile visitors leave a site that takes longer than 3 seconds to load
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-primary font-heading mb-2">
                70%
              </div>
              <p className="text-sm text-muted-foreground">
                of consumers say page speed impacts their purchase decisions
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-primary font-heading mb-2">
                +25%
              </div>
              <p className="text-sm text-muted-foreground">
                increase in conversions from improving Core Web Vitals scores
              </p>
            </div>
          </div>
          <div className="mt-10 text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Google uses page speed and Core Web Vitals as ranking factors. A slow,
              poorly optimized website doesn&apos;t just frustrate visitors — it actively
              hurts your search rankings and costs you customers every day.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Let Us Fix Your Website
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
