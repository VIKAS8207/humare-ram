"use client";

import { Pill } from "@/components/ui";
import AmberBurst from "@/components/effects/amber-burst";
import { useRef } from "react";
import Mandala from "@/components/effects/mandala";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import type { SpotlightData } from "./spotlight.data";

type Props = SpotlightData & {
  /** Put the character on the left instead of the right */
  reverse?: boolean;
};

// Split section: glowing headline + copy on one side, character cutout over a
// colour glow on the other. Reusable for any character via SpotlightData.
export default function SpotlightSection({
  id,
  eyebrow,
  headline,
  role,
  tags,
  body,
  image,
  glow,
  amber,
  reverse = false,
}: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: root.current,
            start: "top 65%",
            once: true,
          },
        });
        tl.from(".spot-line", { y: 50, opacity: 0, duration: 1, stagger: 0.15 })
          .from(
            ".spot-copy",
            { y: 24, opacity: 0, duration: 0.8, stagger: 0.12 },
            "-=0.5",
          )
          .from(
            ".spot-figure",
            { x: reverse ? -80 : 80, opacity: 0, duration: 1.4 },
            0,
          )
          .from(".spot-glow", { scale: 0.6, opacity: 0, duration: 1.6 }, 0);

        // Slow parallax drift of the glow while the section crosses the screen
        gsap.to(".spot-glow", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [reverse] },
  );

  return (
    <section
      id={id}
      ref={root}
      className="relative isolate w-full overflow-hidden bg-stage text-white"
    >
      <Mandala
        className={`top-1/2 -translate-y-1/2 ${reverse ? "-right-64" : "-left-64"}`}
        size="52rem"
        reverse={reverse}
        duration={280}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-2 px-5 md:min-h-screen md:px-6 md:grid-cols-2 md:gap-10">
        {/* Copy */}
        <div
          className={`relative z-10 flex flex-col items-start gap-5 pb-2 pt-20 md:gap-8 md:py-24 ${
            reverse ? "md:order-2" : ""
          }`}
        >
          <div className="flex flex-col gap-4">
            <p className="spot-copy flex items-center gap-4 text-xs font-medium uppercase tracking-[0.4em] text-ember-soft">
              <span
                aria-hidden
                className="h-px w-10 bg-gradient-to-r from-transparent to-ember md:w-14"
              />
              {eyebrow}
            </p>
            <h2 className="text-[clamp(2.1rem,8vw,7rem)] font-semibold uppercase leading-[0.95] tracking-tight">
              {headline.map((line) => (
                <span key={line} className="spot-line block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="spot-copy text-base font-medium text-ember-soft md:text-2xl">
              {role}
            </p>
            {tags && (
              <ul className="spot-copy flex flex-wrap gap-2 pt-1">
                {tags.map((tag) => (
                  <li key={tag}>
                    <Pill tone="ember" size="xs" className="font-medium">
                      {tag}
                    </Pill>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="spot-copy max-w-md text-sm leading-relaxed opacity-80 md:text-lg">
            {body}
          </p>
        </div>

        {/* Character */}
        <div className="relative h-[48vh] md:h-screen">
          <div
            aria-hidden
            className="spot-glow pointer-events-none absolute left-1/2 top-[45%] aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl will-change-transform"
            style={{
              background: `radial-gradient(circle, ${glow} 0%, transparent 62%)`,
            }}
          />
          {amber && <AmberBurst origin="50% 42%" />}
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="spot-figure absolute inset-0 h-full w-full select-none object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_78%,transparent)]"
          />
        </div>
      </div>
      {/* Phones only: fade everything (glow, pattern, figure) into the page
          colour at the top and bottom edges, so neighbouring sections blend
          into each other with no hard divide. Sits above the content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-stage to-transparent md:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-36 bg-gradient-to-t from-stage via-stage/80 to-transparent md:hidden"
      />
    </section>
  );
}
