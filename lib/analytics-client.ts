"use client";

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackConversionEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event,
    ...cleanedPayload,
  });
}
