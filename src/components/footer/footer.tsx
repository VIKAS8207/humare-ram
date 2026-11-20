import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Petals from "@/components/effects/petals";
import BookLink from "@/components/transitions/book-link";
import { HERO_LOGO } from "@/lib/preload";
import { IMAGES } from "@/config/images";
import { BOOK_NOW_HREF } from "@/components/navbar/nav.data";
import {
  CONTACT_LINKS,
  COPYRIGHT_YEAR,
  FOOTER_COLUMNS,
  FOOTER_TAGLINE,
  LEGAL_LINKS,
} from "./footer.data";

// Footer backdrop: drop "footer-bg.png" (or .jpg / .jpeg / .webp) into
// public/images/footer/ and it appears here automatically.
const FOOTER_DIR = path.join(process.cwd(), "public", "images", "footer");
const FOOTER_BG = ["png", "jpg", "jpeg", "webp"]
  .map((ext) => `footer-bg.${ext}`)
  .find((file) => existsSync(path.join(FOOTER_DIR, file)));

export default function Footer() {
  return (
    <footer className="relative isolate w-full overflow-hidden bg-neutral-950 text-white">
      {/* Desktop: petals drift over the whole footer */}
      <div className="hidden md:block">
        <Petals />
      </div>
      {FOOTER_BG && (
        // Image at the very bottom: dark overlay at the base, transparent
        // towards the top, and the top edge fades into the footer colour.
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-[40rem] [mask-image:linear-gradient(to_top,black_60%,transparent)] md:block">
          <Image
            src={`/images/footer/${FOOTER_BG}`}
            alt=""
            fill
            sizes="100vw"
            className="select-none object-cover object-bottom"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
          />
        </div>
      )}
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-14 md:px-6 md:pt-28">
        <div className="grid gap-14 md:grid-cols-[1.4fr_2fr] md:gap-20">
          {/* Brand */}
          <div className="mx-auto flex w-fit flex-col items-center gap-6 text-center md:mx-0">
            <Image
              src={HERO_LOGO.src}
              alt="Humare Ram"
              width={HERO_LOGO.width}
              height={HERO_LOGO.height}
              sizes="(min-width: 768px) 18rem, 14rem"
              className="h-auto w-44 select-none md:w-72"
            />
            <p className="max-w-56 text-sm opacity-70 md:text-base md:max-w-72">
              {FOOTER_TAGLINE}
            </p>
            <BookLink
              href={BOOK_NOW_HREF}
              className="rounded-full bg-white px-8 py-3 text-black transition-transform hover:scale-105"
            >
              Book Now
            </BookLink>
          </div>

          {/* Link columns */}
          <nav
            aria-label="Footer"
            className="flex flex-col items-center gap-10 text-center md:items-stretch md:text-left"
          >
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title} className="w-full md:w-52">
                <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-orange-400">
                  {col.title}
                </h3>
                <ul className="flex flex-col items-center gap-3 text-sm md:items-start">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="break-words opacity-70 transition-opacity hover:opacity-100"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className="mt-8 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-sm md:items-start">
                  {CONTACT_LINKS.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="break-words opacity-70 transition-opacity hover:opacity-100"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center gap-6 border-t border-white/10 pt-8 text-center text-xs opacity-70 md:mt-24 md:flex-row md:justify-between md:text-left">
          <p>© {COPYRIGHT_YEAR} Humare Ram. All rights reserved.</p>

          <div className="flex flex-col items-center gap-3">
            <Image
              src={IMAGES.sponsor.src}
              alt="Shri Ram Jewellers"
              width={IMAGES.sponsor.width}
              height={IMAGES.sponsor.height}
              sizes="6rem"
              className="h-auto w-20"
            />
            <span className="uppercase tracking-[0.3em]">Presented by</span>
          </div>

          <ul className="flex justify-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="transition-opacity hover:opacity-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Phone: the picture sits below all the text, with the petals drifting over it */}
      {FOOTER_BG && (
        <div className="relative mt-4 h-[22rem] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_30%)] md:hidden">
          <Image
            src={`/images/footer/${FOOTER_BG}`}
            alt=""
            fill
            sizes="100vw"
            className="select-none object-cover object-right-bottom"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          />
          <Petals />
        </div>
      )}
    </footer>
  );
}
