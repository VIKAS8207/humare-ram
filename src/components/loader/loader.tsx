"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  CHARACTERS,
  CRITICAL_IMAGES,
  LOADER_BG,
  preloadImages,
} from "@/lib/preload";
import { createLiquidReveal } from "@/lib/liquid-reveal";
import { LOADER_DONE_EVENT, markLoaderDone } from "@/lib/events";
import { shouldSkipLoader } from "@/lib/skip-loader";

// Counter follows real image loading (min 1.5s so it never flashes).
// Exit: the background melts away from three spots like liquid (WebGL).
// Falls back to a simple curtain lift if WebGL / the image is unavailable.
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      // Reloaded while scrolled down: no loader, just unmount (CSS already hides it)
      if (shouldSkipLoader()) {
        setDone(true);
        return;
      }

      const el = root.current;
      if (!el) return; // loader already unmounted (re-run after it finished)
      const num = el.querySelector<HTMLElement>(".loader-num")!;
      const bar = el.querySelector<HTMLElement>(".loader-bar")!;
      const bg = el.querySelector<HTMLElement>(".loader-bg")!;
      const canvas = el.querySelector<HTMLCanvasElement>(".loader-canvas")!;

      const counter = { value: 0 };
      let cancelled = false;
      let dispatched = false;
      let liquid: ReturnType<typeof createLiquidReveal> = null;

      document.documentElement.style.overflow = "hidden";

      const render = () => {
        num.textContent = String(Math.round(counter.value)).padStart(3, "0");
      };

      // Page intro (hero) starts here, while the loader is still dissolving
      const revealPage = () => {
        if (dispatched) return;
        dispatched = true;
        markLoaderDone();
        window.dispatchEvent(new Event(LOADER_DONE_EVENT));
      };

      const finish = () => {
        document.documentElement.style.overflow = "";
        revealPage();
        liquid?.destroy();
        setDone(true);
      };

      const runExit = (bgImage?: HTMLImageElement) => {
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        liquid =
          !reduced && bgImage ? createLiquidReveal(canvas, bgImage) : null;

        const tl = gsap.timeline({ onComplete: finish });
        tl.to(".loader-content", {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: "power2.in",
        });

        if (liquid) {
          const state = { p: 0 };
          const l = liquid;
          tl.add(() => {
            // Swap DOM background for the identical WebGL render, then melt
            l.render(0);
            canvas.style.visibility = "visible";
            bg.style.visibility = "hidden";
            el.style.backgroundColor = "transparent";
          });
          tl.to(state, {
            p: 1,
            duration: 4,
            ease: "power1.inOut",
            onUpdate: () => l.render(state.p),
          });
          tl.add(revealPage, "<+=1.9");
        } else {
          tl.to(
            el,
            { yPercent: -100, duration: 1, ease: "power4.inOut" },
            "-=0.1",
          );
          tl.add(revealPage, "-=0.4");
        }
      };

      const minTime = new Promise<void>((r) => gsap.delayedCall(1.5, r));
      const assets = preloadImages(CRITICAL_IMAGES, (ratio) => {
        if (cancelled) return;
        // Cap at 99 until everything (incl. min time) is done
        gsap.to(counter, {
          value: ratio * 99,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: render,
          overwrite: true,
        });
        gsap.to(bar, {
          scaleX: ratio * 0.99,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
        });
      });

      Promise.all([assets, minTime]).then(([imgs]) => {
        if (cancelled) return;
        gsap.to(counter, {
          value: 100,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: render,
          overwrite: true,
        });
        gsap.to(bar, {
          scaleX: 1,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
          onComplete: () =>
            !cancelled && runExit(imgs[CRITICAL_IMAGES.indexOf(LOADER_BG)]),
        });
      });

      return () => {
        cancelled = true;
        liquid?.destroy();
        document.documentElement.style.overflow = "";
      };
    },
    { scope: root, dependencies: [] },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      data-loader
      className="fixed inset-0 z-50 flex items-end justify-center bg-black text-white will-change-transform"
    >
      <div className="loader-bg absolute inset-0">
        <Image
          src={LOADER_BG.src}
          alt=""
          fill
          priority
          sizes={LOADER_BG.sizes}
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
        />
      </div>
      <canvas
        aria-hidden
        className="loader-canvas pointer-events-none absolute inset-0 h-full w-full"
        style={{ visibility: "hidden" }}
      />
      {/* Cutout stays put while the forest melts; hero renders the identical layer underneath */}
      <Image
        src={CHARACTERS.src}
        alt=""
        fill
        priority
        sizes={CHARACTERS.sizes}
        className="pointer-events-none object-cover"
      />
      <div className="loader-content relative z-10 flex w-[min(70vw,20rem)] flex-col items-center gap-3 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="flex w-full items-baseline justify-between text-[0.65rem] uppercase tracking-[0.3em] text-white/60">
          <span>Loading</span>
          <span className="loader-num tabular-nums">000</span>
        </div>
        <div className="h-px w-full bg-white/20">
          <div className="loader-bar h-full origin-left scale-x-0 bg-orange-400" />
        </div>
      </div>
    </div>
  );
}
