"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Section from "@/components/Section";
import { trackConversionEvent } from "@/lib/analytics-client";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "fallback"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fallbackUrl, setFallbackUrl] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");
    setFallbackUrl("");

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
        trackConversionEvent("newsletter_signup", {
          lead_source: "newsletter_section",
        });
        return;
      }

      // Server signaled the config is missing — render a visible link so the
      // user can finish subscribing on Beehiiv. Don't `window.open` because
      // browsers popup-block it and the user thinks subscribing succeeded.
      if (data.fallbackUrl) {
        setFallbackUrl(data.fallbackUrl);
        setStatus("fallback");
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
    <Section id="newsletter" width="3xl">
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
          ) : status === "fallback" ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground max-w-md">
                One more step — finish subscribing on our newsletter host:
              </p>
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-call inline-flex items-center justify-center gap-2"
              >
                Finish subscribing
                <ArrowRight className="w-4 h-4" />
              </a>
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
    </Section>
  );
}
