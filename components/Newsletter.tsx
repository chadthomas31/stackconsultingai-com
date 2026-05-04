"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          utm_source: "website",
          utm_medium: "newsletter_section",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus("success");
        return;
      }

      // Server signaled the config is missing — gracefully bounce the user
      // to the Beehiiv subscribe page so no signup is lost.
      if (data.fallbackUrl) {
        window.open(data.fallbackUrl, "_blank", "noopener,noreferrer");
        setStatus("success");
        return;
      }

      setStatus("error");
      setErrorMessage(data.error || "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <section id="newsletter" className="py-20 md:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="relative rounded-xl bg-soft border border-border p-8 md:p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-5 h-5 text-brand" />
          </div>
          <span className="section-kicker">Newsletter</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mt-2 mb-3">
            The Stack Report
          </h2>
          <p className="text-muted-foreground mb-2">
            Practical AI, business tech, and productivity — every other week.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            No fluff, no spam. Just actionable ideas.
          </p>

          <div className="flex justify-center gap-2 mb-8">
            <span className="px-3 py-1 text-xs font-medium bg-white border border-border rounded-full text-navy-900">AI</span>
            <span className="px-3 py-1 text-xs font-medium bg-white border border-border rounded-full text-navy-900">Business Tech</span>
            <span className="px-3 py-1 text-xs font-medium bg-white border border-border rounded-full text-navy-900">Productivity</span>
          </div>

          {status === "success" ? (
            <div className="inline-flex items-center justify-center gap-2 text-brand">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">
                You&apos;re in! Check your inbox to confirm.
              </span>
            </div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email address"
                  required
                  className="flex-1 px-4 py-3 rounded-md bg-white border border-border focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-cta-call inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === "loading" ? (
                    "Subscribing..."
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
              {status === "error" && errorMessage && (
                <div
                  role="alert"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-red-600"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            Join free. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
