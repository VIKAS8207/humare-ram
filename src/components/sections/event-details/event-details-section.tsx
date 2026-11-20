import Mandala from "@/components/effects/mandala";
import RevealSection from "@/components/ui/reveal-section";
import { FACT_ICONS, PinIcon } from "./event-icons";
import {
  EVENT_DATE,
  EVENT_FACTS,
  EVENT_HEADER,
  EVENT_VENUE,
} from "./event-details.data";

const ICON_BADGE =
  "grid size-11 shrink-0 place-content-center rounded-xl md:size-14 md:rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-neutral-950 shadow-[0_0_30px_-4px_rgba(255,160,50,0.55)]";

export default function EventDetailsSection() {
  return (
    <RevealSection
      id="shows"
      className="relative isolate w-full overflow-hidden bg-neutral-950 bg-[radial-gradient(ellipse_at_50%_0%,rgba(190,95,20,0.18),transparent_65%)] px-4 py-16 text-white md:px-6 md:py-36"
    >
      <Mandala
        className="-left-72 bottom-0"
        size="44rem"
        duration={280}
        reverse
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-14 md:gap-20">
        <header className="flex flex-col items-center gap-6 text-center">
          <p className="rv text-xs font-medium uppercase tracking-[0.4em] text-orange-400">
            {EVENT_HEADER.eyebrow}
          </p>
          <h2 className="rv text-[clamp(1.9rem,7vw,5.5rem)] font-semibold leading-none tracking-tight text-white">
            {EVENT_HEADER.title}
          </h2>
          <p className="rv max-w-xl text-base text-white/60 md:text-lg">
            {EVENT_HEADER.subtitle}
          </p>
        </header>

        {/* One "pass": date | venue | facts */}
        <div className="rv overflow-hidden rounded-[2rem] border border-amber-300/25 bg-gradient-to-br from-amber-400/[0.10] via-neutral-900/60 to-neutral-950 shadow-[0_30px_80px_-40px_rgba(255,150,40,0.45)]">
          <div className="grid lg:grid-cols-[1fr_1.15fr_1fr]">
            {/* Date */}
            <div className="flex flex-col items-center justify-center gap-3 px-5 py-8 text-center md:gap-4 md:px-8 md:py-12">
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-amber-300/80">
                {EVENT_DATE.label}
              </p>
              <div className="flex items-center gap-5">
                {EVENT_DATE.days.map((d, i) => (
                  <span key={d} className="flex items-center gap-5">
                    {i > 0 && (
                      <span
                        aria-hidden
                        className="h-10 w-px bg-gradient-to-b from-transparent via-amber-300/60 to-transparent"
                      />
                    )}
                    <span className="bg-gradient-to-b from-amber-200 to-orange-500 bg-clip-text text-5xl font-semibold leading-none tracking-tight text-transparent md:text-8xl">
                      {d}
                    </span>
                  </span>
                ))}
              </div>
              <p className="text-base font-medium tracking-wide text-white md:text-lg">
                {EVENT_DATE.monthYear}
              </p>
              <p className="text-sm text-white/55">{EVENT_DATE.note}</p>
            </div>

            {/* Venue */}
            <div className="flex flex-col items-center justify-center gap-4 border-t border-dashed border-amber-300/25 px-5 py-8 text-center md:gap-5 md:px-8 md:py-12 lg:border-l lg:border-t-0">
              <span className={ICON_BADGE}>
                <PinIcon />
              </span>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-[0.35em] text-amber-300/80">
                  {EVENT_VENUE.label}
                </p>
                <p className="text-lg font-semibold leading-tight tracking-tight md:text-3xl">
                  {EVENT_VENUE.value}
                </p>
                <p className="text-white/60">{EVENT_VENUE.note}</p>
              </div>
              <a
                href={EVENT_VENUE.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 px-5 py-2 text-sm font-medium text-amber-300 transition-colors hover:bg-amber-300/10 hover:text-amber-200"
              >
                Get directions
                <span aria-hidden>→</span>
              </a>
            </div>

            {/* Facts */}
            <ul className="flex flex-col justify-center border-t border-dashed border-amber-300/25 px-5 py-4 md:px-8 md:py-8 lg:border-l lg:border-t-0">
              {EVENT_FACTS.map((fact) => {
                const Icon = FACT_ICONS[fact.icon];
                return (
                  <li
                    key={fact.label}
                    className="flex items-center gap-4 border-b border-white/10 py-3 last:border-b-0 md:py-4"
                  >
                    <span className="grid size-10 shrink-0 place-content-center rounded-xl bg-amber-300/10 text-amber-300">
                      <Icon />
                    </span>
                    <span className="flex flex-1 items-baseline justify-between gap-4">
                      <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/50">
                        {fact.label}
                      </span>
                      <span className="text-right text-sm font-semibold md:text-lg">
                        {fact.value}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
