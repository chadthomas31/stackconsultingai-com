"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function WifiPortalForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [accept, setAccept] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UniFi passes these in the redirect query string
  const id = params.get("id") || "";
  const ap = params.get("ap") || "";
  const ssid = params.get("ssid") || "Stack Consulting Guest";
  const t = params.get("t") || "";
  const originalUrl = params.get("url") || "https://stackconsultingai.com/?utm_source=wifi_portal";

  // UniFi local authorization endpoint — guest's browser hits it directly, AP authorizes locally.
  // The guest device cannot reach the controller, but it CAN reach the AP that intercepted them,
  // because the AP gateway-NATs the auth path. UniFi expects: GET /guest/s/<site>/?... with the params.
  // Path the guest hits is automatic — we just POST the form back to UniFi's expected endpoint.
  const unifiAuthBase = "http://172.16.23.10:8880"; // AP-served redirect target on guest VLAN

  useEffect(() => {
    // If UniFi didn't pass params, we're not actually in a captive portal session.
    // Hide the "connecting" UX and tell user to connect to WiFi first.
    if (!id && !ap && !t) {
      setError("Open this page after connecting to the Stack Consulting Guest WiFi.");
    }
  }, [id, ap, t]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!accept) {
      setError("Please accept the terms.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email.");
      return;
    }
    setSubmitting(true);

    // Fire-and-forget email capture to Beehiiv
    try {
      fetch("/api/wifi-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          ap,
          ssid,
          site: "stack_office",
        }),
        keepalive: true,
      }).catch(() => {});
    } catch (_) {}

    // Hand guest back to UniFi for local authorization
    // UniFi sends the guest to controller's hotspot URL with `id` and `t` (auth token).
    // After authorize, guest is redirected to their original requested URL.
    await new Promise((r) => setTimeout(r, 400));
    const back = new URL(`${unifiAuthBase}/guest/s/default/`);
    back.searchParams.set("id", id);
    back.searchParams.set("ap", ap);
    back.searchParams.set("t", t);
    back.searchParams.set("url", originalUrl);
    back.searchParams.set("ssid", ssid);
    back.searchParams.set("accept", "true");
    window.location.href = back.toString();
  }

  return (
    <main className="min-h-screen bg-soft flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white border border-[#e2e2e2] rounded-md shadow-[0_20px_40px_rgba(0,18,46,0.06)] p-8 sm:p-10">
        <div className="text-center mb-6">
          <span className="inline-block bg-navy-900 text-white text-xs font-bold tracking-widest px-2.5 py-1.5 rounded">
            STACK CONSULTING AI
          </span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-navy-900 text-center mb-2 tracking-tight">
          Guest WiFi
        </h1>
        <p className="text-sm text-gray-600 text-center mb-7">
          Drop your email and you&apos;re online — plus you&apos;ll get The Stack Report, the
          biweekly newsletter on AI for small business.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-navy-900 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com"
              className="w-full px-3.5 py-3 border border-[#e2e2e2] rounded-md text-base text-navy-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="flex items-start gap-2.5 text-sm text-gray-600">
            <input
              id="accept"
              type="checkbox"
              required
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
              className="mt-0.5"
            />
            <label htmlFor="accept">
              I agree to the{" "}
              <a
                href="https://stackconsultingai.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                terms of use
              </a>{" "}
              and to receive The Stack Report newsletter.
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-brand text-white rounded-md text-base font-semibold hover:bg-brand-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Connecting…" : "Connect to WiFi"}
          </button>

          {error && (
            <p className="text-sm text-[#c2410c] font-medium" role="alert">
              {error}
            </p>
          )}
        </form>

        <p className="mt-6 text-xs text-gray-500 text-center">
          Powered by{" "}
          <a
            href="https://stackconsultingai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand"
          >
            stackconsultingai.com
          </a>
        </p>
      </div>
    </main>
  );
}

export default function WifiPortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-soft" />}>
      <WifiPortalForm />
    </Suspense>
  );
}
