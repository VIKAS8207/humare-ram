"use client";

import { useRef } from "react";
import BookNowButton from "@/components/ui/book-now-button";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import Embers from "@/components/effects/embers";
import { CHARACTERS, HERO_LOGO } from "@/lib/preload";
import { IMAGES } from "@/config/images";
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
          .from(".hero-rotary", { y: 24, opacity: 0, duration: 0.8 }, "-=0.5")
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
      {/* Phones only: curtain + lamps at the very top, fading to black below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 md:hidden"
      >
        <Image
          src={IMAGES.heroTop.src}
          alt=""
          width={IMAGES.heroTop.width}
          height={IMAGES.heroTop.height}
          priority
          sizes="100vw"
          className="h-auto w-full select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
      </div>

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
            src={IMAGES.sponsor.src}
            alt="Shri Ram Jewellers"
            width={IMAGES.sponsor.width}
            height={IMAGES.sponsor.height}
            priority
            sizes="(min-width: 768px) 8rem, 6rem"
            className="hero-brand h-auto w-24 select-none md:w-32"
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
        {/* Tagline and Rotary logo side by side (stacked on small phones) */}
        <div className="-mt-4 flex flex-col items-center gap-4 sm:flex-row sm:gap-6 md:-mt-6">
          <p className="hero-sub text-center text-sm opacity-70 sm:text-right md:text-base">
            Discover Ramayan&apos;s <br /> untold chapters, live on stage
          </p>
          <span aria-hidden className="hidden h-10 w-px bg-white/25 sm:block" />
          {/* The artwork is dark blue, so it is brightened to stay readable on the dark hero */}
          <Image
            src={IMAGES.rotary.src}
            alt="Rotary International District 3261 — Create Lasting Impact, celebrating 30 years"
            width={IMAGES.rotary.width}
            height={IMAGES.rotary.height}
            sizes="(min-width: 768px) 14rem, 10rem"
            className="hero-rotary h-auto w-40 select-none brightness-[1.9] md:w-56"
          />
        </div>
        <BookNowButton className="hero-cta" />
      </div>
    </section>
  );
}
