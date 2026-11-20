"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Stat } from "./stats.data";

// One stat: number counts up from 0 and the block fades in when scrolled into view.
// The final value is in the server HTML, so it is correct without JS.
export default function StatItem({
  value,
  unit,
  suffix,
  label,
  index,
}: Stat & { index: number }) {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { v: 0 };
        num.current!.textContent = "0";

        gsap.from(root.current, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 90%",
            once: true,
          },
        });

        gsap.to(counter, {
          v: value,
          duration: 2,
          delay: index * 0.1,
          ease: "power2.out",
          onUpdate: () => {
            num.current!.textContent = String(Math.round(counter.v));
          },
          scrollTrigger: {
            trigger: root.current,
            start: "top 90%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [value] },
  );

  return (
    <div
      ref={root}
      className="flex flex-col items-center gap-2 px-3 text-center md:gap-3 md:px-4"
    >
      <p className="text-[clamp(1.75rem,4vw,3.5rem)] font-semibold leading-none tracking-tight whitespace-nowrap text-amber-100 tabular-nums">
        <span ref={num}>{value}</span>
        {unit && (
          <span className="ml-2 text-[0.55em] text-orange-400">{unit}</span>
        )}
        <span className="text-orange-400">{suffix}</span>
      </p>
      <p className="text-[0.55rem] font-medium uppercase tracking-[0.22em] text-white/60 md:text-xs">
        {label}
      </p>
    </div>
  );
}
