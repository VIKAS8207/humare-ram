"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Props = {
  children: React.ReactNode;
  /** 1 = moves left, -1 = moves right */
  direction?: 1 | -1;
  /** pixels per second at rest */
  speed?: number;
};

// Infinite marquee. Track holds two identical groups; sliding by -50% loops seamlessly.
// Speeds up (and follows direction) with scroll velocity, pauses when off-screen.
export default function MarqueeRow({ children, direction = 1, speed = 50 }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const group = el.firstElementChild as HTMLElement;
        const duration = group.offsetWidth / speed;

        const tween =
          direction === 1
            ? gsap.to(el, { xPercent: -50, duration, ease: "none", repeat: -1 })
            : gsap.fromTo(el, { xPercent: -50 }, { xPercent: 0, duration, ease: "none", repeat: -1 });

        let velocity = 0;
        let scrollDir = 1;
        let scale = 1;

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? tween.resume() : tween.pause()),
          onUpdate: (self) => {
            velocity = Math.abs(self.getVelocity());
            scrollDir = self.direction;
          },
        });

        const tick = () => {
          velocity *= 0.92;
          const boost = 1 + Math.min(velocity / 400, 5);
          scale += (scrollDir * boost - scale) * 0.08;
          tween.timeScale(scale);
        };
        gsap.ticker.add(tick);

        return () => {
          gsap.ticker.remove(tick);
          st.kill();
          tween.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [direction, speed] },
  );

  return (
    <div ref={root} className="overflow-hidden">
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
