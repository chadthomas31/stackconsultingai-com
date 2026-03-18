"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("https://api.beehiiv.com/v2/publications/pub_stackconsultingai/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, utm_source: "website", utm_medium: "newsletter_section" }),
      });

      // Beehiiv API may not be available without API key, fallback to iframe approach
      if (!res.ok) throw new Error("API unavailable");

      setStatus("success");
    } catch {
      // Fallback: open Beehiiv subscribe page
      window.open(`https://stackconsultingai.beehiiv.com/subscribe?email=${encodeURIComponent(email)}`, "_blank");
      setStatus("success");
    }
  };

  return (
    <section id="newsletter" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 p-8 md:p-12">
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10 text-center">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-7 h-7 text-primary" />
            </div>

            {/* Header */}
            <h2 className="text-3xl md:text-4xl font-bold mb-3">The Stack Report</h2>
            <p className="text-lg text-muted-foreground mb-2">
              Practical AI, business tech, and productivity insights for growing businesses.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Delivered every other week. No fluff, no spam — just actionable ideas.
            </p>

            {/* Tags */}
            <div className="flex justify-center gap-3 mb-8">
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">AI</span>
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Business Tech</span>
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Productivity</span>
            </div>

            {/* Form */}
            {status === "success" ? (
              <div className="flex items-center justify-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">You're in! Check your inbox to confirm.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center sm:text-left"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {status === "loading" ? "Subscribing..." : (
                    <>
                      Subscribe
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="text-xs text-muted-foreground mt-4">
              Join free. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
