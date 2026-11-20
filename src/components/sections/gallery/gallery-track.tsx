"use client";

import { useRef } from "react";
import Mandala from "@/components/effects/mandala";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import type { GalleryImage } from "./gallery-images";

const MAX_ANGLE = 45; // deg, side images turn toward the centre
const DEPTH = 340; // px, side images come closer (=> bigger) at the edges
const AUTO_SPEED = -40; // px/s resting drift (negative = moves left)

type Props = {
  title: string;
  subtitle: string;
  images: GalleryImage[];
};

const wrap = (v: number, total: number) =>
  ((((v + total / 2) % total) + total) % total) - total / 2;

// Endless curved carousel. Drifts slowly on its own; drag/swipe to move it with
// inertia. Vertical page scrolling is untouched (touch-action: pan-y).
export default function GalleryTrack({ title, subtitle, images }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stageEl = stage.current!;
      const items = Array.from(stageEl.children) as HTMLElement[];
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const base = reduced ? 0 : AUTO_SPEED;

      let vw = 0;
      let step = 0;
      let total = 0;
      let offset = 0;
      let vel = base;
      let visible = true;
      let dragging = false;
      let lastX = 0;
      let lastT = 0;

      const measure = () => {
        vw = stageEl.clientWidth;
        const w = items[0].offsetWidth;
        step = w + Math.max(16, w * 0.1);
        total = step * items.length;
      };

      const render = () => {
        for (let i = 0; i < items.length; i++) {
          const x = wrap(i * step + offset, total);
          const n = x / (vw / 2); // -1 left edge ... 1 right edge
          const angle = Math.max(
            -MAX_ANGLE,
            Math.min(MAX_ANGLE, -n * MAX_ANGLE),
          );
          const z = Math.min(n * n, 2.2) * DEPTH;
          const el = items[i];
          el.style.transform = `translate(-50%,-50%) translate3d(${x}px,0,${z}px) rotateY(${angle}deg)`;
          el.style.zIndex = String(Math.round(z));
        }
      };

      const tick = (_t: number, deltaMs: number) => {
        if (!visible && !dragging) return;
        const dt = Math.min(deltaMs, 50) / 1000;
        if (!dragging) {
          // ease back to the resting drift after a swipe
          vel += (base - vel) * (1 - Math.exp(-dt * 1.8));
          offset += vel * dt;
        }
        render();
      };

      const onDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        lastT = performance.now();
        stageEl.setPointerCapture(e.pointerId);
        stageEl.style.cursor = "grabbing";
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        const now = performance.now();
        const dx = e.clientX - lastX;
        const dtMs = Math.max(1, now - lastT);
        offset += dx;
        vel = vel * 0.6 + (dx / dtMs) * 1000 * 0.4;
        lastX = e.clientX;
        lastT = now;
      };
      const onUp = () => {
        if (!dragging) return;
        dragging = false;
        stageEl.style.cursor = "";
        // held still before release => no fling
        if (performance.now() - lastT > 80) vel = 0;
        vel = Math.max(-3000, Math.min(3000, vel));
      };

      const ro = new ResizeObserver(() => {
        measure();
        render();
      });
      ro.observe(stageEl);
      const io = new IntersectionObserver(
        ([entry]) => (visible = entry.isIntersecting),
      );
      io.observe(stageEl);

      stageEl.addEventListener("pointerdown", onDown);
      stageEl.addEventListener("pointermove", onMove);
      stageEl.addEventListener("pointerup", onUp);
      stageEl.addEventListener("pointercancel", onUp);

      measure();
      render();
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        ro.disconnect();
        io.disconnect();
        stageEl.removeEventListener("pointerdown", onDown);
        stageEl.removeEventListener("pointermove", onMove);
        stageEl.removeEventListener("pointerup", onUp);
        stageEl.removeEventListener("pointercancel", onUp);
      };
    },
    { scope: root, dependencies: [images.length] },
  );

  return (
    <section
      id="gallery"
      ref={root}
      className="relative isolate w-full overflow-hidden bg-neutral-950 bg-[radial-gradient(ellipse_at_center,rgba(190,95,20,0.16),transparent_65%)] py-10 text-white md:py-28"
    >
      <Mandala
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        size="64rem"
        opacity={0.06}
        duration={360}
      />
      <header className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 text-center">
        <h2 className="text-[clamp(1.9rem,6vw,5rem)] font-semibold leading-none tracking-tight text-white">
          {title}
        </h2>
        <p className="max-w-xl text-xs text-white/65 md:text-base">
          {subtitle}
        </p>
      </header>

      {/* Items are stacked at the stage centre and positioned by transform. */}
      <div
        ref={stage}
        className="relative mt-6 h-52 cursor-grab select-none overflow-hidden [perspective:1100px] [touch-action:pan-y] md:mt-14 md:h-[clamp(20rem,58vh,38rem)]"
      >
        {images.map((img, i) => (
          <div
            key={`${img.src}-${i}`}
            className="absolute left-1/2 top-1/2 aspect-[4/3] w-[9.5rem] overflow-hidden rounded-xl md:w-[clamp(15rem,30vw,28rem)] md:rounded-2xl border border-amber-300/20 bg-neutral-900 shadow-2xl shadow-black/60 will-change-transform"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 768px) 30vw, 70vw"
              className="pointer-events-none select-none object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
