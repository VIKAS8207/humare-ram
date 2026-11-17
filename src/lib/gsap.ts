"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Smoother on weak devices: skip lag-compensation jumps, cap catch-up
  gsap.ticker.lagSmoothing(500, 33);
  gsap.config({ force3D: true });
  registered = true;
}

registerGsap();

export { gsap, ScrollTrigger, useGSAP };
