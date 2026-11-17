"use client";

import { useRef } from "react";
import BookLink from "@/components/transitions/book-link";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import Embers from "@/components/effects/embers";
import { CHARACTERS, HERO_LOGO } from "@/lib/preload";
import { IMAGES } from "@/config/images";
import { BOOK_NOW_HREF } from "@/components/navbar/nav.data";
import { LOADER_DONE_EVENT, isLoaderDone } from "@/lib/events";
import { shouldSkipLoader } from "@/lib/skip-loader";

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap
          .timeline({ defaults: { ease: "power3.out" }, paused: true })
          .from(".hero-brand", {
            y: -20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
          })
          .from(
            ".hero-logo",
            { y: 40, scale: 0.92, opacity: 0, duration: 1.2 },
            "-=0.4",
          )
          .from(".hero-sub", { y: 24, opacity: 0, duration: 0.8 }, "-=0.5")
          .from(".hero-cta", { y: 24, opacity: 0, duration: 0.8 }, "-=0.6");

        // Wait for loader curtain before playing intro
        if (shouldSkipLoader() || isLoaderDone()) {
          intro.progress(1); // no loader this time: show hero in final state immediately
        } else {
          window.addEventListener(LOADER_DONE_EVENT, () => intro.play(), {
            once: true,
          });
        }

        // Parallax: content drifts and fades as hero scrolls out
        gsap.to(".hero-content", {
          yPercent: 25,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".hero-glow", {
          yPercent: 40,
          scale: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative flex h-screen h-dvh w-full items-center justify-center overflow-hidden bg-neutral-950 text-white"
    >
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/30 blur-3xl will-change-transform"
      />

      {/* Drifting embers: behind the cutout, in front of the glow */}
      <Embers className="absolute inset-0 h-full w-full" />

      {/* Same cutout as the loader, so it carries over when the forest dissolves */}
      <Image
        src={CHARACTERS.src}
        alt="Ravan and Ram facing each other"
        fill
        priority
        sizes={CHARACTERS.sizes}
        className="hero-characters pointer-events-none select-none object-cover"
      />

      <div className="hero-content relative z-10 flex flex-col items-center gap-8 px-6 text-center md:gap-12 will-change-transform">
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <Image
            src={IMAGES.havells.src}
            alt="Havells"
            width={IMAGES.havells.width}
            height={IMAGES.havells.height}
            priority
            sizes="(min-width: 768px) 6rem, 5rem"
            className="hero-brand h-auto w-20 select-none rounded-sm md:w-24"
          />
          <p className="hero-brand text-xs font-medium uppercase tracking-[0.35em] opacity-80 md:text-sm">
            Presents
          </p>
        </div>
        <h1 className="hero-logo w-[80vw] md:w-[min(36vw,40rem)] will-change-transform">
          <Image
            src={HERO_LOGO.src}
            alt="Humare Ram"
            width={HERO_LOGO.width}
            height={HERO_LOGO.height}
            priority
            sizes={HERO_LOGO.sizes}
            className="h-auto w-full select-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
          />
        </h1>
        <p className="hero-sub -mt-4 max-w-xl text-lg md:-mt-6 opacity-70 md:text-xl">
          Discover Ramayan&apos;s <br></br> untold chapters, live on stage
        </p>
        <BookLink
          href={BOOK_NOW_HREF}
          className="hero-cta rounded-full bg-white px-8 py-3 text-black transition-transform hover:scale-105"
        >
          Book Now
        </BookLink>
      </div>
    </section>
  );
}
