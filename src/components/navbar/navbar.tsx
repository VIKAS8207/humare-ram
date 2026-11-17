"use client";

import { useRef } from "react";
import BookLink from "@/components/transitions/book-link";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { HERO_LOGO } from "@/lib/preload";
import { BOOK_NOW_HREF, NAV_LINKS } from "./nav.data";

const SHOW_AFTER_PX = 50;

// Hidden at the very top; slides in once the user starts scrolling,
// slides back out when they return to the top.
export default function Navbar() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const dur = reduced ? 0 : 0.6;

      gsap.set(el, { yPercent: -100, autoAlpha: 0 });

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: SHOW_AFTER_PX,
        end: "max",
        // Fires on refresh too, so a reload mid-page shows the nav right away
        onToggle: (self) =>
          gsap.to(el, {
            yPercent: self.isActive ? 0 : -100,
            autoAlpha: self.isActive ? 1 : 0,
            duration: dur,
            ease: "power3.out",
            overwrite: true,
          }),
      });
    },
    { scope: root },
  );

  return (
    <header
      ref={root}
      className="invisible fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/50 text-white backdrop-blur-md will-change-transform"
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6"
      >
        <a href="#" aria-label="Humare Ram — home" className="shrink-0">
          <Image
            src={HERO_LOGO.src}
            alt="Humare Ram"
            width={HERO_LOGO.width}
            height={HERO_LOGO.height}
            sizes="96px"
            className="h-9 w-auto select-none"
          />
        </a>

        <ul className="hidden items-center gap-8 text-sm uppercase tracking-[0.2em] md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="opacity-70 transition-opacity hover:opacity-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <BookLink
          href={BOOK_NOW_HREF}
          className="shrink-0 rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-transform hover:scale-105"
        >
          Book Now
        </BookLink>
      </nav>
    </header>
  );
}
