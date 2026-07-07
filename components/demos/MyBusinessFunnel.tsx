"use client";

import { Sparkles, Plus, X } from "lucide-react";
import type { ReceptionistConfig } from "@/lib/receptionist-config-schema";

/**
 * Base personas the "My Business" path can build on top of. Matches
 * `demo_leads.vertical` CHECK constraint (hvac|plumbing|auto|medspa) — a
 * custom lead always stores one of these 4 as its base vertical, plus
 * `biz_config` populated to mark it as custom.
 */
export const BASE_INDUSTRIES = ["auto", "plumbing", "hvac", "medspa"] as const;
export type BaseIndustry = (typeof BASE_INDUSTRIES)[number];

const INDUSTRY_LABELS: Record<BaseIndustry, string> = {
  auto: "Auto Repair",
  plumbing: "Plumbing",
  hvac: "HVAC",
  medspa: "Med Spa / Aesthetics",
};

interface Props {
  companyName: string;
  industry: BaseIndustry;
  onIndustryChange: (v: BaseIndustry) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  city: string;
  onCityChange: (v: string) => void;
  config: ReceptionistConfig | null;
  onConfigChange: (c: ReceptionistConfig) => void;
  generating: boolean;
  error: string | null;
  onGenerate: () => void;
}

export default function MyBusinessFunnel({
  companyName,
  industry,
  onIndustryChange,
  description,
  onDescriptionChange,
  city,
  onCityChange,
  config,
  onConfigChange,
  generating,
  error,
  onGenerate,
}: Props) {
  function updateService(i: number, value: string) {
    if (!config) return;
    const services = [...config.services];
    services[i] = value;
    onConfigChange({ ...config, services });
  }
  function removeService(i: number) {
    if (!config) return;
    onConfigChange({
      ...config,
      services: config.services.filter((_, idx) => idx !== i),
    });
  }
  function addService() {
    if (!config) return;
    onConfigChange({ ...config, services: [...config.services, ""] });
  }

  return (
    <div className="space-y-4 rounded-md border border-border bg-soft/60 p-4">
      <div>
        <label
          htmlFor="mb-industry"
          className="block text-sm font-medium text-navy-900 mb-1.5"
        >
          Closest industry
        </label>
        <select
          id="mb-industry"
          value={industry}
          onChange={(e) => onIndustryChange(e.target.value as BaseIndustry)}
          className="w-full px-3 py-2.5 rounded-md border border-border bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
        >
          {BASE_INDUSTRIES.map((id) => (
            <option key={id} value={id}>
              {INDUSTRY_LABELS[id]}
            </option>
          ))}
        </select>
        <span className="block text-xs text-navy-900/55 mt-1.5">
          Picks the closest voice persona — the details below are still yours.
        </span>
      </div>

      <div>
        <label
          htmlFor="mb-description"
          className="block text-sm font-medium text-navy-900 mb-1.5"
        >
          What does your business do?
        </label>
        <textarea
          id="mb-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          maxLength={600}
          placeholder="Family-owned plumbing shop, 24/7 emergency calls, specialize in tankless water heaters..."
          className="w-full px-3 py-2.5 rounded-md border border-border bg-white text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
        />
      </div>

      <div>
        <label
          htmlFor="mb-city"
          className="block text-sm font-medium text-navy-900 mb-1.5"
        >
          City
        </label>
        <input
          id="mb-city"
          type="text"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="Mission Viejo"
          className="w-full px-3 py-2.5 rounded-md border border-border bg-white text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
        />
      </div>

      {error && (
        <div className="px-3 py-2 rounded-md border border-red-200 bg-red-50 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onGenerate}
        disabled={generating || !companyName || !description}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-brand text-brand font-medium hover:bg-brand-soft transition-colors disabled:opacity-50"
      >
        <Sparkles className="w-4 h-4" aria-hidden="true" />
        {generating ? "Drafting…" : "Generate my receptionist"}
      </button>

      {config && (
        <div className="space-y-4 rounded-md border border-border bg-white p-4">
          <div>
            <span className="block text-xs uppercase tracking-wide text-navy-900/50 font-semibold mb-1">
              Summary
            </span>
            <p className="text-sm text-navy-900/80">{config.summary}</p>
          </div>

          <div>
            <span className="block text-xs uppercase tracking-wide text-navy-900/50 font-semibold mb-1.5">
              Services
            </span>
            <div className="space-y-2">
              {config.services.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={s}
                    onChange={(e) => updateService(i, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-md border border-border bg-white text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                  />
                  <button
                    type="button"
                    onClick={() => removeService(i)}
                    aria-label={`Remove ${s || "service"}`}
                    className="p-2 text-navy-900/40 hover:text-red-600"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addService}
              className="mt-2 inline-flex items-center gap-1 text-xs text-brand hover:underline"
            >
              <Plus className="w-3 h-3" aria-hidden="true" />
              Add service
            </button>
          </div>

          <div>
            <label
              htmlFor="mb-greeting"
              className="block text-xs uppercase tracking-wide text-navy-900/50 font-semibold mb-1.5"
            >
              Greeting
            </label>
            <textarea
              id="mb-greeting"
              value={config.greeting}
              onChange={(e) =>
                onConfigChange({ ...config, greeting: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 rounded-md border border-border bg-white text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-navy-900/60">
            <div>
              <span className="font-semibold text-navy-900/70">Tone: </span>
              {config.tone}
            </div>
            <div>
              <span className="font-semibold text-navy-900/70">
                Asks about:{" "}
              </span>
              {config.intakeFocus.join(", ")}
            </div>
          </div>

          {config.faqs.length > 0 && (
            <div>
              <span className="block text-xs uppercase tracking-wide text-navy-900/50 font-semibold mb-1.5">
                Likely FAQs
              </span>
              <ul className="space-y-1 text-sm text-navy-900/75">
                {config.faqs.map((f, i) => (
                  <li key={i}>
                    <span className="font-medium">{f.q}</span> — {f.a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
