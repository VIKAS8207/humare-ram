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
    <div className="flex flex-col gap-6 rounded-2xl border border-line bg-paper-raised p-6">
      <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
        Your booking
      </h2>
      <dl className="flex flex-col gap-4 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.2em] text-ink-muted">
              {r.label}
            </dt>
            <dd className="font-medium text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-baseline justify-between border-t border-line pt-5">
        <span className="text-sm text-ink-muted">Total</span>
        <span className="text-3xl font-semibold tracking-tight text-ink">
          {inr(total)}
        </span>
      </div>
      {children}
    </div>
  );
}

// Booking summary pinned to the bottom of the screen: show, seats, total and
// the action buttons (`children`) all in one bar.
export function BookingBar({ selection, children }: Props) {
  const venue = VENUES.find((v) => v.id === selection.venueId);
  const total = totalOf(selection.seats);
  const seats = sortSeats(selection.seats);

  const show =
    selection.date && selection.time
      ? `${dateParts(selection.date).weekday}, ${dateParts(selection.date).day} ${dateParts(selection.date).month} · ${formatTime(selection.time)}`
      : "Pick a date and time";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 py-2.5 shadow-[0_-8px_30px_-12px_rgba(43,29,18,0.25)] backdrop-blur md:px-6 md:py-4">
      <div className="mx-auto flex max-w-6xl items-center gap-3 md:gap-8">
        {/* Phones: one slim line (total + show on the left, buttons on the right) */}
        <div className="min-w-0 flex-1 text-left md:hidden">
          <p className="text-lg font-semibold leading-none tracking-tight">
            {inr(total)}
          </p>
          <p className="mt-0.5 truncate text-[0.68rem] text-ink-muted">
            {show}
            {seats.length > 0 &&
              ` · ${seats.length} seat${seats.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <dl className="hidden min-w-0 flex-1 items-baseline gap-x-6 gap-y-1 text-sm md:grid md:grid-cols-[repeat(3,auto)] md:justify-start">
          <div className="min-w-0 md:col-span-1">
            <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">
              Show
            </dt>
            <dd className="truncate font-medium">{show}</dd>
            {venue && (
              <dd className="hidden truncate text-xs text-ink-muted md:block">
                {venue.name}
              </dd>
            )}
          </div>
          <div className="min-w-0">
            <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">
              Seats{seats.length ? ` (${seats.length})` : ""}
            </dt>
            <dd className="truncate font-medium">
              {seats.length ? seats.join(", ") : "—"}
            </dd>
          </div>
          <div className="col-span-2 flex items-baseline gap-3 md:col-span-1 md:flex-col md:gap-0">
            <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">
              Total
            </dt>
            <dd className="text-2xl font-semibold leading-none tracking-tight">
              {inr(total)}
            </dd>
          </div>
        </dl>
        <div className="shrink-0 md:w-80">{children}</div>
      </div>
    </div>
  );
}
