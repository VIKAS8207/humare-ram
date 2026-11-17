import Link from "next/link";
import { VENUES } from "./booking.data";
import type { Attendee, Confirmation, Selection } from "./booking.types";
import { dateParts, formatTime, inr, sortSeats } from "./booking.utils";
import { totalOf } from "./summary-panel";

type Props = {
  selection: Selection;
  attendee: Attendee;
  confirmation: Confirmation;
};

export default function ConfirmationView({
  selection,
  attendee,
  confirmation,
}: Props) {
  const venue = VENUES.find((v) => v.id === selection.venueId);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-8 py-10 text-center">
      <span className="grid size-16 place-content-center rounded-full bg-bk-accent text-3xl text-bk-accent-ink">
        ✓
      </span>
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          Booking confirmed
        </h1>
        <p className="text-bk-muted">
          A confirmation will be sent to{" "}
          <span className="text-bk-ink">{attendee.email}</span>.
        </p>
      </div>

      <dl className="flex w-full flex-col gap-4 rounded-2xl border border-bk-line bg-bk-surface p-6 text-left text-sm">
        {[
          ["Reference", confirmation.reference],
          ["Venue", venue ? `${venue.name}, ${venue.city}` : "—"],
          [
            "Show",
            selection.date && selection.time
              ? `${dateParts(selection.date).long}, ${formatTime(selection.time)}`
              : "—",
          ],
          ["Seats", sortSeats(selection.seats).join(", ")],
          ["Amount", inr(totalOf(selection.seats))],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-6">
            <dt className="text-bk-muted">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <Link
        href="/"
        className="rounded-full bg-bk-ink px-8 py-3 font-medium text-bk-bg transition-transform hover:scale-105"
      >
        Back to home
      </Link>
    </div>
  );
}
