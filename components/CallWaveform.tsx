"use client";

import { useEffect, useRef } from "react";

type Props = {
  active: boolean;
  className?: string;
  height?: number;
};

export default function CallWaveform({
  active,
  className = "",
  height = 56,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mql.matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });

    startRef.current = performance.now();

    // Palette tuned to brand: muted navy + blue, low alpha
    const waves = [
      { amp: 0.42, freq: 0.018, speed: 1.2, color: "rgba(62, 106, 239, 0.55)" },
      { amp: 0.28, freq: 0.026, speed: 1.85, color: "rgba(62, 106, 239, 0.28)" },
      { amp: 0.18, freq: 0.04, speed: 2.4, color: "rgba(255, 255, 255, 0.18)" },
    ];

    const drawStatic = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(62, 106, 239, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
    };

    const draw = (now: number) => {
      if (!active) {
        // Fade to a flat line when inactive
        drawStatic();
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);
      const t = (now - startRef.current) / 1000;

      for (const wave of waves) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const phase = x * wave.freq + t * wave.speed;
          // Envelope pulses so energy ebbs and flows
          const envelope =
            0.65 + 0.35 * Math.sin(t * 0.7 + x * 0.003);
          const y = h / 2 + Math.sin(phase) * wave.amp * (h / 2) * envelope;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 1.25;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    if (reduced) {
      drawStatic();
    } else if (active) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      drawStatic();
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height, display: "block" }}
    />
  );
}
