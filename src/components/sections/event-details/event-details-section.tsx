import Mandala from "@/components/effects/mandala";
import { IconBadge, SectionHeader, StageSection } from "@/components/ui";
import { FACT_ICONS, PinIcon } from "./event-icons";
import {
  EVENT_DATE,
  EVENT_FACTS,
  EVENT_HEADER,
  EVENT_VENUE,
} from "./event-details.data";

export default function EventDetailsSection() {
  return (
    <StageSection id="shows" glow="center">
      <Mandala
        className="-left-72 bottom-0"
        size="44rem"
        duration={280}
        reverse
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-14 md:gap-20">
        <SectionHeader
          eyebrow={EVENT_HEADER.eyebrow}
          title={EVENT_HEADER.title}
          subtitle={EVENT_HEADER.subtitle}
        />

        {/* One "pass": date | venue | facts */}
        <div className="rv overflow-hidden rounded-[2rem] border border-gold/25 bg-gradient-to-br from-gold-strong/[0.10] via-stage-soft/60 to-stage shadow-[0_30px_80px_-40px_rgba(255,150,40,0.45)]">
          <div className="grid lg:grid-cols-[1fr_1.15fr_1fr]">
            {/* Date */}
            <div className="flex flex-col items-center justify-center gap-3 px-5 py-8 text-center md:gap-4 md:px-8 md:py-12">
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold/80">
                {EVENT_DATE.label}
              </p>
              <div className="flex items-center gap-5">
                {EVENT_DATE.days.map((d, i) => (
                  <span key={d} className="flex items-center gap-5">
                    {i > 0 && (
                      <span
                        aria-hidden
                        className="h-10 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent"
                      />
                    )}
                    <span className="bg-gradient-to-b from-gold-soft to-ember-deep bg-clip-text text-5xl font-semibold leading-none tracking-tight text-transparent md:text-8xl">
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
            <div className="flex flex-col items-center justify-center gap-4 border-t border-dashed border-gold/25 px-5 py-8 text-center md:gap-5 md:px-8 md:py-12 lg:border-l lg:border-t-0">
              <IconBadge>
                <PinIcon />
              </IconBadge>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold/80">
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
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/10 hover:text-gold-soft"
              >
                Get directions
                <span aria-hidden>→</span>
              </a>
            </div>

            {/* Facts */}
            <ul className="flex flex-col justify-center border-t border-dashed border-gold/25 px-5 py-4 md:px-8 md:py-8 lg:border-l lg:border-t-0">
              {EVENT_FACTS.map((fact) => {
                const Icon = FACT_ICONS[fact.icon];
                return (
                  <li
                    key={fact.label}
                    className="flex items-center gap-4 border-b border-white/10 py-3 last:border-b-0 md:py-4"
                  >
                    <span className="grid size-10 shrink-0 place-content-center rounded-xl bg-gold/10 text-gold">
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
    </StageSection>
  );
}
