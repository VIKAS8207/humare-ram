"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

// Link to the booking page. On click a beige sheet slides up from the bottom
// over the current page, then we navigate; the sheet fades away once the new
// page is showing (it has the same beige background, so the hand-over is seamless).
// Modified clicks (new tab etc.) and reduced-motion users get a normal link.
export default function BookLink({ href, className, children }: Props) {
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    e.preventDefault();

    const sheet = document.createElement("div");
    // class names are literal here so Tailwind generates them
    sheet.className =
      "bg-bk-bg fixed inset-0 z-[100] rounded-t-[2rem] shadow-[0_-20px_60px_rgba(0,0,0,0.35)] will-change-transform";
    sheet.setAttribute("aria-hidden", "true");
    document.body.appendChild(sheet);

    const dismiss = () =>
      gsap.to(sheet, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => sheet.remove(),
      });

    gsap.fromTo(
      sheet,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: () => {
          sheet.style.borderRadius = "0";
          router.push(href);
          // wait until the booking page is actually on screen (max ~5s)
          const started = performance.now();
          const timer = setInterval(() => {
            if (
              window.location.pathname === href ||
              performance.now() - started > 5000
            ) {
              clearInterval(timer);
              setTimeout(dismiss, 250);
            }
          }, 50);
        },
      },
    );
  };

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
