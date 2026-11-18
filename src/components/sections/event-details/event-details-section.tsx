import Mandala from "@/components/effects/mandala";
import BookLink from "@/components/transitions/book-link";
import { BOOK_NOW_HREF } from "@/components/navbar/nav.data";
import RevealSection from "@/components/ui/reveal-section";
import { CalendarIcon, FACT_ICONS, PinIcon } from "./event-icons";
import {
  EVENT_DATE,
  EVENT_FACTS,
  EVENT_HEADER,
  EVENT_VENUE,
} from "./event-details.data";

const FEATURE_CARD =
  "rv relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-amber-300/25 bg-gradient-to-br from-amber-400/[0.12] via-orange-500/[0.05] to-transparent p-8 md:p-10";

const ICON_BADGE =
  "grid size-14 shrink-0 place-content-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-neutral-950 shadow-[0_0_30px_-4px_rgba(255,160,50,0.55)]";

export default function EventDetailsSection() {
  return (
    <RevealSection
      id="shows"
      className="relative isolate w-full overflow-hidden bg-neutral-950 bg-[radial-gradient(ellipse_at_50%_0%,rgba(190,95,20,0.18),transparent_65%)] px-6 py-24 text-white md:py-36"
    >
      <Mandala className="-left-72 bottom-0" size="44rem" duration={280} reverse />
      <div className="mx-auto flex max-w-6xl flex-col gap-14 md:gap-20">
        <header className="flex flex-col items-center gap-6 text-center">
          <p className="rv text-xs font-medium uppercase tracking-[0.4em] text-orange-400">
            {EVENT_HEADER.eyebrow}
          </p>
          <h2 className="rv text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-none tracking-tight text-white">
            {EVENT_HEADER.title}
          </h2>
          <p className="rv max-w-xl text-base text-white/60 md:text-lg">
            {EVENT_HEADER.subtitle}
          </p>
        </header>

        <div className="flex flex-col gap-4 md:gap-5">
          {/* Date + venue: the two things people look for first */}
          <div className="grid gap-4 md:grid-cols-[1fr_1.4fr] md:gap-5">
            <div className={FEATURE_CARD}>
              <span className={ICON_BADGE}>
                <CalendarIcon />
              </span>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-300/80">
                  {EVENT_DATE.label}
                </p>
                <p className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                  {EVENT_DATE.value}
                </p>
                <p className="text-white/60">{EVENT_DATE.note}</p>
              </div>
            </div>

            <div className={FEATURE_CARD}>
              <span className={ICON_BADGE}>
                <PinIcon />
              </span>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-300/80">
                  {EVENT_VENUE.label}
                </p>
                <p className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                  {EVENT_VENUE.value}
                </p>
                <p className="text-white/60">{EVENT_VENUE.note}</p>
              </div>
              <a
                href={EVENT_VENUE.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex w-fit items-center gap-2 text-sm font-medium text-amber-300 transition-colors hover:text-amber-200"
              >
                Get directions
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* Quick facts */}
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {EVENT_FACTS.map((fact) => {
              const Icon = FACT_ICONS[fact.icon];
              return (
                <li
                  key={fact.label}
                  className="rv flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6"
                >
                  <span className="text-amber-300">
                    <Icon />
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/50">
                      {fact.label}
                    </span>
                    <span className="text-lg font-semibold leading-snug md:text-xl">
                      {fact.value}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rv flex justify-center">
          <BookLink
            href={BOOK_NOW_HREF}
            className="rounded-full bg-white px-10 py-3.5 text-black transition-transform hover:scale-105"
          >
            Book Now
          </BookLink>
        </div>
      </div>
    </RevealSection>
  );
}
