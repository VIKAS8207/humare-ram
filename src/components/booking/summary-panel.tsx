import { SHOWS, VENUES } from "./booking.data";
import type { Selection } from "./booking.types";
import {
  dateParts,
  formatTime,
  inr,
  priceOfSeat,
  sortSeats,
} from "./booking.utils";

export const totalOf = (seats: string[]) =>
  seats.reduce((sum, s) => sum + priceOfSeat(s), 0);

type Props = { selection: Selection; children?: React.ReactNode };

// Live booking summary (sticky sidebar on desktop). `children` = action buttons.
export default function SummaryPanel({ selection, children }: Props) {
  const venue = VENUES.find((v) => v.id === selection.venueId);
  const hasShow = selection.venueId && SHOWS[selection.venueId];
  const total = totalOf(selection.seats);

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Venue", value: venue ? `${venue.name}, ${venue.city}` : "—" },
    {
      label: "Date",
      value: selection.date && hasShow ? dateParts(selection.date).long : "—",
    },
    { label: "Time", value: selection.time ? formatTime(selection.time) : "—" },
    {
      label: "Seats",
      value: selection.seats.length
        ? sortSeats(selection.seats).join(", ")
        : "—",
    },
  ];

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-bk-line bg-bk-surface p-6">
      <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-bk-accent">
        Your booking
      </h2>
      <dl className="flex flex-col gap-4 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.2em] text-bk-muted">
              {r.label}
            </dt>
            <dd className="font-medium text-bk-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-baseline justify-between border-t border-bk-line pt-5">
        <span className="text-sm text-bk-muted">Total</span>
        <span className="text-3xl font-semibold tracking-tight text-bk-ink">
          {inr(total)}
        </span>
      </div>
      {children}
    </div>
  );
}
