import { ButtonLink } from "@/components/ui";
import { VENUES } from "./booking.data";
import type { Attendee, Confirmation, Selection } from "./booking.types";
import { dateParts, formatTime, inr, sortSeats } from "./booking.utils";
import { totalOf } from "./summary-panel";
import TicketCard from "@/components/ticket/ticket-card";

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

  const homeLink = (
    <ButtonLink href="/" variant="dark">
      Back to home
    </ButtonLink>
  );

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-8 py-10 text-center">
      <span className="grid size-16 place-content-center rounded-full bg-accent text-3xl text-accent-ink">
        ✓
      </span>
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Booking confirmed
        </h1>
        <p className="text-ink-muted">
          {attendee.email.trim() ? (
            <>
              A confirmation will be sent to{" "}
              <span className="text-ink">{attendee.email}</span>.
            </>
          ) : (
            "Your booking is confirmed."
          )}
        </p>
      </div>

      <dl className="flex w-full flex-col gap-4 rounded-2xl border border-line bg-paper-raised p-6 text-left text-sm">
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
            <dt className="text-ink-muted">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Ticket with QR code + download, on the same row as Back to home */}
      {selection.date && selection.time ? (
        <TicketCard
          ticket={{
            reference: confirmation.reference,
            name: attendee.name,
            venue: venue ? `${venue.name}, ${venue.city}` : "",
            dateLong: dateParts(selection.date).long,
            time: formatTime(selection.time),
            seats: sortSeats(selection.seats),
            amount: inr(totalOf(selection.seats)),
            status: "Confirmed",
          }}
        >
          {homeLink}
        </TicketCard>
      ) : (
        homeLink
      )}
    </div>
  );
}
