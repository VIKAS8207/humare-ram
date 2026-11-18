import Image from "next/image";
import Mandala from "@/components/effects/mandala";
import BookLink from "@/components/transitions/book-link";
import { HERO_LOGO } from "@/lib/preload";
import { IMAGES } from "@/config/images";
import { BOOK_NOW_HREF } from "@/components/navbar/nav.data";
import {
  COPYRIGHT_YEAR,
  FOOTER_COLUMNS,
  FOOTER_TAGLINE,
  LEGAL_LINKS,
} from "./footer.data";

export default function Footer() {
  return (
    <footer className="relative isolate w-full overflow-hidden bg-neutral-950 text-white">
      <Mandala className="-bottom-60 -right-60" size="40rem" duration={300} />
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 md:pt-28">
        <div className="grid gap-14 md:grid-cols-[1.4fr_2fr] md:gap-20">
          {/* Brand */}
          <div className="flex flex-col items-start gap-6">
            <Image
              src={HERO_LOGO.src}
              alt="Humare Ram"
              width={HERO_LOGO.width}
              height={HERO_LOGO.height}
              sizes="(min-width: 768px) 18rem, 14rem"
              className="h-auto w-56 select-none md:w-72"
            />
            <p className="max-w-sm text-base opacity-70">{FOOTER_TAGLINE}</p>
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
            className="grid grid-cols-2 gap-10 sm:grid-cols-3"
          >
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-orange-400">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-3 text-sm">
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
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 text-xs opacity-70 md:mt-24 md:flex-row md:items-center md:justify-between">
          <p>© {COPYRIGHT_YEAR} Humare Ram. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <span className="uppercase tracking-[0.3em]">Presented by</span>
            <Image
              src={IMAGES.sponsor.src}
              alt="Shri Ram Jewellers"
              width={IMAGES.sponsor.width}
              height={IMAGES.sponsor.height}
              sizes="6rem"
              className="h-auto w-20"
            />
          </div>

          <ul className="flex gap-6">
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
    </footer>
  );
}
