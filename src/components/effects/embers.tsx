"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type Ember = {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  swayFreq: number;
  flickFreq: number;
  phase: number;
  t: number;
};

type Props = {
  className?: string;
  /** particle density multiplier (1 = default) */
  density?: number;
};

// Small glowing embers drifting upward. One 2D canvas, one pre-rendered glow
// sprite, driven by the shared GSAP ticker; pauses when off-screen.
export default function Embers({ className, density = 1 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Soft ember sprite, drawn once
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d")!;
    const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,225,150,1)");
    grad.addColorStop(0.2, "rgba(255,150,50,0.8)");
    grad.addColorStop(0.5, "rgba(255,90,20,0.25)");
    grad.addColorStop(1, "rgba(255,60,0,0)");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 64, 64);

    let w = 0;
    let h = 0;
    let embers: Ember[] = [];
    let visible = true;

    const make = (initial: boolean): Ember => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      size: 0.8 + Math.random() * 2,
      speed: 18 + Math.random() * 45,
      sway: 10 + Math.random() * 28,
      swayFreq: 0.5 + Math.random() * 1.2,
      flickFreq: 3 + Math.random() * 6,
      phase: Math.random() * Math.PI * 2,
      t: Math.random() * 100,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.round(((w * h) / 22000) * density));
      embers = Array.from({ length: count }, () => make(true));
    };

    const tick = (_time: number, deltaMs: number) => {
      if (!visible) return;
      const dt = Math.min(deltaMs, 50) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y -= e.speed * dt;
        e.t += dt;
        if (e.y < -10) {
          embers[i] = make(false);
          continue;
        }
        const progress = 1 - e.y / h; // 0 at bottom, 1 at top
        const fade = Math.sin(Math.min(Math.max(progress, 0), 1) * Math.PI);
        const flicker = 0.6 + 0.4 * Math.sin(e.t * e.flickFreq + e.phase);
        ctx.globalAlpha = Math.pow(fade, 0.8) * flicker;
        const s = e.size * 7;
        const x = e.x + Math.sin(e.t * e.swayFreq + e.phase) * e.sway;
        ctx.drawImage(sprite, x - s / 2, e.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([entry]) => (visible = entry.isIntersecting),
    );
    io.observe(canvas);
    resize();
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none ${className ?? ""}`}
    />
  );
}
