"use client";

import { Check, Dot } from "lucide-react";
import CallWaveform from "./CallWaveform";

export type StageStatus = "pending" | "active" | "done";

export type ConsoleStage = {
  id: string;
  label: string;
  detail: string;
  status: StageStatus;
  elapsedMs?: number;
};

type Props = {
  phone: string;
  industry: string;
  stages: ConsoleStage[];
  isStreaming: boolean;
  totalMs?: number;
};

function formatMs(ms?: number) {
  if (ms == null) return "\u2014";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatPhone(e164: string) {
  // +14422121616 -> (442) 212-1616
  const d = e164.replace(/[^\d]/g, "");
  if (d.length === 11 && d.startsWith("1")) {
    return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  }
  if (d.length === 10) {
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return e164;
}

export default function CallOpsConsole({
  phone,
  industry,
  stages,
  isStreaming,
  totalMs,
}: Props) {
  return (
    <div
      className="ops-console rounded-md bg-navy-900 text-white p-6 md:p-8 relative overflow-hidden"
      role="status"
      aria-live="polite"
      style={{ viewTransitionName: "assessment-card" }}
    >
      {/* Top bar — status */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-5 pb-4 border-b border-white/10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] min-w-0">
          <span
            className={
              isStreaming
                ? "ops-dot ops-dot-live"
                : "ops-dot ops-dot-done"
            }
            aria-hidden="true"
          />
          <span className="text-brand">
            {isStreaming ? "Live" : "Confirmed"}
          </span>
          <span className="text-white/40">/</span>
          <span className="text-white/70 font-mono tracking-tight">
            FreeSWITCH dispatcher
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/50 font-mono">
          <span className="uppercase tracking-wider">{industry}</span>
          <span className="text-white/30">{"\u2192"}</span>
          <span className="text-white/80">{formatPhone(phone)}</span>
        </div>
      </div>

      {/* Stages */}
      <ol className="space-y-2 mb-5">
        {stages.map((stage, i) => {
          const isDone = stage.status === "done";
          const isActive = stage.status === "active";
          return (
            <li
              key={stage.id}
              className={
                "ops-row grid grid-cols-[18px_1fr_auto] items-center gap-3 py-1.5 px-2 rounded transition-colors " +
                (isActive
                  ? "ops-row-active"
                  : isDone
                    ? "ops-row-done"
                    : "ops-row-pending")
              }
              style={{
                // Stagger entrance slightly per stage index
                animationDelay: `${i * 40}ms`,
              }}
            >
              <span
                className="flex items-center justify-center w-[18px] h-[18px]"
                aria-hidden="true"
              >
                {isDone ? (
                  <Check className="w-4 h-4 text-brand" strokeWidth={3} />
                ) : isActive ? (
                  <span className="ops-dot ops-dot-live" />
                ) : (
                  <Dot className="w-5 h-5 text-white/25" strokeWidth={4} />
                )}
              </span>
              <span className="flex flex-col">
                <span
                  className={
                    "text-sm font-medium " +
                    (isDone
                      ? "text-white"
                      : isActive
                        ? "text-white"
                        : "text-white/65")
                  }
                >
                  {stage.label}
                </span>
                {(isActive || isDone) && stage.detail ? (
                  <span className="text-xs text-white/65 mt-0.5">
                    {stage.detail}
                  </span>
                ) : null}
              </span>
              <span
                className={
                  "text-xs font-mono tabular-nums tracking-tight " +
                  (isDone
                    ? "text-brand"
                    : isActive
                      ? "text-white/80"
                      : "text-white/25")
                }
              >
                {isActive && stage.elapsedMs == null
                  ? "\u2026"
                  : formatMs(stage.elapsedMs)}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Waveform */}
      <div
        className={
          "waveform-wrap rounded bg-white/[0.03] border border-white/5 px-3 py-2 transition-opacity duration-300 " +
          (isStreaming ? "opacity-100" : "opacity-40")
        }
      >
        <div className="flex items-center justify-between text-[10px] text-white/35 font-mono tracking-widest uppercase mb-1">
          <span>signal</span>
          <span>
            {isStreaming
              ? "streaming"
              : totalMs != null
                ? `closed \u2022 ${formatMs(totalMs)}`
                : "idle"}
          </span>
        </div>
        <CallWaveform active={isStreaming} height={42} />
      </div>
    </div>
  );
}
