"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CRITICAL_IMAGES, HERO_TOP, preloadImages } from "@/lib/preload";
import { LOADER_DONE_EVENT, markLoaderDone } from "@/lib/events";
import { MOBILE_QUERY, shouldSkipLoader } from "@/lib/skip-loader";

const POSTER = "/images/loader/mobile/mobil-loding-image.png";
const VIDEO = "/images/loader/mobile/mobile-loding-video-2.mp4";

const MIN_WAIT = 1500; // loading screen is never shorter than this (ms)
const MAX_WAIT = 10000; // start the video anyway after this (slow network)
const MAX_PLAY = 30000; // safety net: never get stuck on the video (ms)

// Phones only (see MOBILE_QUERY). Still image + loading counter at the bottom,
// then the video plays once and the site opens. No slide / fade animation: the
// image and the video stay exactly as they are. Desktop uses <Loader /> instead.
export default function MobileLoader() {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!window.matchMedia(MOBILE_QUERY).matches || shouldSkipLoader()) {
      queueMicrotask(() => setDone(true));
      return;
    }
    const el = root.current;
    const vid = video.current;
    if (!el || !vid) return;

    const num = el.querySelector<HTMLElement>(".loader-num")!;
    const bar = el.querySelector<HTMLElement>(".loader-bar")!;
    const content = el.querySelector<HTMLElement>(".loader-content")!;

    let imagesRatio = 0;
    let started = false;
    let finished = false;
    let minPassed = false;
    const timers: number[] = [];

    document.documentElement.style.overflow = "hidden";

    const show = (ratio: number) => {
      const r = Math.min(1, Math.max(0, ratio));
      num.textContent = String(Math.round(r * 100)).padStart(3, "0");
      bar.style.scale = `${r} 1`; // Tailwind v4 scale-x-0 uses the `scale` property
    };

    const videoRatio = () => {
      if (vid.readyState >= 4) return 1; // can play through
      const { buffered, duration } = vid;
      if (!duration || !buffered.length) return 0;
      return buffered.end(buffered.length - 1) / duration;
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      document.documentElement.style.overflow = "";
      markLoaderDone();
      window.dispatchEvent(new Event(LOADER_DONE_EVENT));
      queueMicrotask(() => setDone(true));
    };

    const start = () => {
      if (started || finished) return;
      started = true;
      show(1);
      content.style.visibility = "hidden";
      vid.style.visibility = "visible";
      timers.push(window.setTimeout(finish, MAX_PLAY));
      vid.play().catch(finish);
    };

    // The counter eases toward what is really loaded (and over the minimum
    // time), so it moves smoothly instead of jumping.
    let shown = 0;
    let target = 0;
    const tick = window.setInterval(() => {
      if (started) return;
      shown += (target - shown) * 0.12;
      show(shown);
    }, 40);
    timers.push(tick);

    const check = () => {
      const ready = imagesRatio >= 1 && videoRatio() >= 0.99;
      // Cap at 99 until the video really starts
      target = Math.min(0.99, (imagesRatio + videoRatio()) / 2);
      if (minPassed && ready) start();
    };

    timers.push(
      window.setTimeout(() => {
        minPassed = true;
        check();
      }, MIN_WAIT),
      window.setTimeout(start, MAX_WAIT),
    );

    preloadImages([...CRITICAL_IMAGES, HERO_TOP], (ratio) => {
      imagesRatio = ratio;
      check();
    });

    vid.addEventListener("progress", check);
    vid.addEventListener("loadedmetadata", check);
    vid.addEventListener("canplaythrough", check);
    vid.addEventListener("ended", finish);
    vid.addEventListener("error", finish);
    vid.load();

    return () => {
      timers.forEach(clearTimeout);
      vid.removeEventListener("progress", check);
      vid.removeEventListener("loadedmetadata", check);
      vid.removeEventListener("canplaythrough", check);
      vid.removeEventListener("ended", finish);
      vid.removeEventListener("error", finish);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      data-loader
      className="fixed inset-0 z-50 flex items-end justify-center bg-black text-white md:hidden"
    >
      <Image
        src={POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <video
        ref={video}
        src={VIDEO}
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        style={{ visibility: "hidden" }}
      />
      {/* Black at the bottom, fading to transparent at the top */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
      />
      <div className="loader-content relative z-10 flex w-[min(70vw,20rem)] flex-col items-center gap-3 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="flex w-full items-baseline justify-between text-[0.65rem] uppercase tracking-[0.3em] text-white/60">
          <span>Loading</span>
          <span className="loader-num tabular-nums">000</span>
        </div>
        <div className="h-px w-full bg-white/20">
          <div className="loader-bar h-full origin-left scale-x-0 bg-ember" />
        </div>
      </div>
    </div>
  );
}
