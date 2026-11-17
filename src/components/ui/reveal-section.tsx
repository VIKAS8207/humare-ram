"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Reusable scroll-reveal wrapper so a section can stay a server component.
//   .rv                    fades up in sequence when the section enters view
//   .rv-grid > .rv-card    cards rise in with a stagger when the grid enters view
export default function RevealSection({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".rv", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            once: true,
          },
        });
        gsap.from(".rv-card", {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".rv-grid", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id={id} ref={root} className={className}>
      {children}
    </section>
  );
}
