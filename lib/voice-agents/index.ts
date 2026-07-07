/**
 * Vertical voice agent registry.
 *
 * Each entry maps a vertical slug to:
 *   - displayName: marketing-facing label
 *   - extension: FreeSWITCH extension that runs the agent
 *   - systemPrompt: full text loaded by the agent runtime
 *   - intakeFields: the structured slots Claude pulls from the transcript
 *   - didEnvKey: env var holding the public Telnyx DID for this vertical
 *
 * Consumed by:
 *   - app/api/demos/verify/route.ts (returns the right DID after SMS verify)
 *   - app/api/call-ended/route.ts (routes hangup → vertical extractor)
 *   - app/demos/[vertical]/page.tsx (copy + intake schema for the form)
 */

import { HVAC_AGENT } from "./hvac";
import { PLUMBING_AGENT } from "./plumbing";
import { AUTO_AGENT } from "./auto";
import { MEDSPA_AGENT } from "./medspa";

export const VERTICAL_AGENTS = {
  hvac: HVAC_AGENT,
  plumbing: PLUMBING_AGENT,
  auto: AUTO_AGENT,
  medspa: MEDSPA_AGENT,
} as const;

export type Vertical = keyof typeof VERTICAL_AGENTS;
export const VERTICALS: Vertical[] = ["hvac", "plumbing", "auto", "medspa"];

const DID_ENV_KEYS: Record<Vertical, string> = {
  hvac: "DEMO_DID_HVAC",
  plumbing: "DEMO_DID_PLUMBING",
  auto: "DEMO_DID_AUTO",
  medspa: "DEMO_DID_MEDSPA",
};

export function isVertical(value: unknown): value is Vertical {
  return typeof value === "string" && (VERTICALS as string[]).includes(value);
}

export function getVerticalAgent(vertical: Vertical) {
  return VERTICAL_AGENTS[vertical];
}

/** Resolve the Telnyx DID for a vertical from env. Returns null when unconfigured. */
export function getVerticalDid(vertical: Vertical): string | null {
  return process.env[DID_ENV_KEYS[vertical]] ?? null;
}

/** Telephone-link friendly format: strips spaces, keeps leading +. */
export function formatDialString(did: string): string {
  return did.replace(/[^\d+]/g, "");
}

/**
 * The verticals shown in the /demos picker. This is a SUPERSET of VERTICAL_AGENTS:
 * it includes dental + general which have no agent/DID yet.
 * `live: true` means the vertical reveals a real DID; false means "coming soon"
 * (capture a lead, reveal nothing). Flip a vertical live by setting live: true AND
 * ensuring its DID env var is set (and, for dental/general, adding an agent module).
 */
export const DEMO_PICKER: { id: string; displayName: string; live: boolean }[] = [
  { id: "auto", displayName: "Auto Repair", live: true },
  { id: "hvac", displayName: "HVAC", live: false },
  { id: "plumbing", displayName: "Plumbing", live: false },
  { id: "medspa", displayName: "Med Spa / Aesthetics", live: false },
  { id: "dental", displayName: "Dental", live: false },
  { id: "general", displayName: "General Local Service", live: false },
  { id: "mybusiness", displayName: "My Business (build your own)", live: true },
];

/** True only for verticals that reveal a real DID this slice (Auto). */
export function isLiveVertical(id: string): boolean {
  return DEMO_PICKER.some((v) => v.id === id && v.live);
}
