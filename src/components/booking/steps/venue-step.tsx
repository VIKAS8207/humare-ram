import { VENUES } from "../booking.data";

type Props = { venueId: string | null; onSelect: (id: string) => void };

export default function VenueStep({ venueId, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Choose your venue
        </h2>
        <p className="text-ink-muted">
          Select the city and theatre where you would like to watch the show.
        </p>
      </header>

      <div
        role="radiogroup"
        aria-label="Venue"
        className="grid gap-4 sm:grid-cols-2"
      >
        {VENUES.map((v) => {
          const selected = v.id === venueId;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(v.id)}
              className={`flex flex-col gap-3 rounded-2xl border p-6 text-left transition-colors ${
                selected
                  ? "border-accent bg-accent/10"
                  : "border-line bg-paper-raised hover:border-accent/50"
              }`}
            >
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
                {v.city}
              </span>
              <span className="text-xl font-semibold">{v.name}</span>
              <span className="text-sm text-ink-muted">{v.address}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
