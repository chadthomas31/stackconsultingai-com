"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackConversionEvent } from "@/lib/analytics-client";

const highIntentPaths = [
  "/free-ai-site-audit",
  "/ai-readiness-audit",
  "/ai-receptionist",
  "/ai-os",
  "/demos",
  "/services/ai-consulting-orange-county",
  "/services/ai-receptionist-orange-county",
  "/services/ai-receptionist-for-hvac",
  "/services/ai-receptionist-for-auto-shops",
  "/services/ai-receptionist-for-medspas",
  "/services/business-automation-orange-county",
  "/services/website-automation-audit-orange-county",
];

function eventForHref(href: string) {
  if (href.startsWith("tel:")) return "phone_click";
  if (href.startsWith("sms:")) return "sms_click";
  if (href.startsWith("mailto:")) return "email_click";
  if (href.includes("book.stackconsultingai.com")) return "book_consultation_click";
  if (href === "#contact" || href.endsWith("/#contact")) return "contact_cta_click";
  if (href.includes("/free-ai-site-audit") || href.includes("/tools/site-audit")) {
    return "ai_audit_request_click";
  }
  return null;
}

export default function ConversionTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!highIntentPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
      return;
    }

    trackConversionEvent("high_intent_page_view", {
      page_path: pathname,
      lead_source: "seo_landing_page",
    });
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const conversionEvent = eventForHref(href);
      if (!conversionEvent) return;

      trackConversionEvent(conversionEvent, {
        link_url: href,
        link_text: anchor.textContent?.trim().slice(0, 80) || null,
        page_path: window.location.pathname,
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
