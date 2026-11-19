import { SHOWS } from "../booking.data";
import { dateParts, formatTime } from "../booking.utils";

type Props = {
  venueId: string;
  date: string | null;
  time: string | null;
  onDate: (date: string) => void;
  onTime: (time: string) => void;
};

export default function DateTimeStep({
  venueId,
  date,
  time,
  onDate,
  onTime,
}: Props) {
  const days = SHOWS[venueId] ?? [];
  const times = days.find((d) => d.date === date)?.times ?? [];

  return (
    <div className="flex flex-col items-center gap-10 text-center">
      <header className="flex flex-col items-center gap-2">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Pick a date & time
        </h2>
        <p className="text-bk-muted">
          Only dates with scheduled shows are shown.
        </p>
      </header>

      <section className="flex flex-col items-center gap-4" aria-label="Date">
        <h3 className="text-xs font-medium uppercase tracking-[0.3em] text-bk-gold">
          Date
        </h3>
        <div role="radiogroup" className="flex flex-wrap justify-center gap-3">
          {days.map((d) => {
            const p = dateParts(d.date);
            const selected = d.date === date;
            return (
              <button
                key={d.date}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onDate(d.date)}
                className={`flex w-24 flex-col items-center gap-1 rounded-2xl border px-3 py-4 transition-colors ${
                  selected
                    ? "border-bk-accent bg-bk-accent text-bk-accent-ink"
                    : "border-bk-line bg-bk-surface hover:border-bk-accent/50"
                }`}
              >
                <span className="text-xs font-medium uppercase tracking-[0.2em] opacity-70">
                  {p.weekday}
                </span>
                <span className="text-3xl font-semibold leading-none">
                  {p.day}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.2em] opacity-70">
                  {p.month}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col items-center gap-4" aria-label="Time">
        <h3 className="text-xs font-medium uppercase tracking-[0.3em] text-bk-gold">
          Time
        </h3>
        {date ? (
          <div role="radiogroup" className="flex flex-wrap justify-center gap-3">
            {times.map((t) => {
              const selected = t === time;
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onTime(t)}
                  className={`rounded-full border px-6 py-3 text-sm font-medium transition-colors ${
                    selected
                      ? "border-bk-accent bg-bk-accent text-bk-accent-ink"
                      : "border-bk-line hover:border-bk-accent/50"
                  }`}
                >
                  {formatTime(t)}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-bk-muted">
            Select a date to see show times.
          </p>
        )}
      </section>
    </div>
  );
}
