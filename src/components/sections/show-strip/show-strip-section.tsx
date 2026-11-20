import { RevealSection } from "@/components/ui";
import { SHOWS, VENUE } from "@/components/booking/booking.data";
import { formatTime } from "@/components/booking/booking.utils";
import { EVENT_DATE } from "@/components/sections/event-details/event-details.data";

// Slim horizontal band right under the hero: where, and when. Golden letters.
// Everything comes from the booking data, so it never disagrees with the
// booking page.
const times = [...new Set((SHOWS[VENUE.id] ?? []).flatMap((d) => d.times))]
  .map(formatTime)
  .join("  &  ");

const ITEMS = [
  { label: "Venue", value: VENUE.name, span: "col-span-2 md:col-span-1" },
  { label: "Location", value: VENUE.city, span: "" },
  {
    label: "Shows",
    value: EVENT_DATE.value,
    sub: times,
    span: "",
  },
] as const;

const GOLD_TEXT =
  "bg-gradient-to-b from-gold-light via-gold-mid to-gold-deep bg-clip-text text-transparent";

export default function ShowStripSection() {
  return (
    <RevealSection
      id="venue"
      className="relative w-full overflow-hidden border-y border-gold/20 bg-stage px-4 py-6 md:px-6 md:py-10"
    >
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-y-5 md:grid-cols-3 md:gap-y-0">
        {ITEMS.map((item, i) => (
          <li
            key={item.label}
            className={`rv flex flex-col items-center gap-1.5 px-3 text-center md:gap-2 md:px-6 ${item.span} ${
              i > 0 ? "md:border-l md:border-gold/20" : ""
            }`}
          >
            <span className="text-[0.6rem] font-medium uppercase tracking-[0.35em] text-gold/60 md:text-xs">
              {item.label}
            </span>
            <span
              className={`text-base font-semibold leading-snug tracking-tight md:text-2xl ${GOLD_TEXT}`}
            >
              {item.value}
            </span>
            {"sub" in item && item.sub && (
              <span className="text-xs font-medium tracking-wide text-gold-soft/80 md:text-sm">
                {item.sub}
              </span>
            )}
          </li>
        ))}
      </ul>
    </RevealSection>
  );
}
