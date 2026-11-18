"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Client wrapper: owns the <section> and the scroll-reveal animation,
// so the rest of the section can stay a server component.
export default function MusicReveal({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".m-reveal", {
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
        gsap.from(".m-card", {
          y: 70,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.18,
          scrollTrigger: { trigger: ".m-grid", start: "top 85%", once: true },
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
