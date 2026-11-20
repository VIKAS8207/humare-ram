"use client";

import { useMemo, useState } from "react";
import {
  Button,
  ButtonLink,
  ConfirmDialog,
  Eyebrow,
  Modal,
  Select,
  StatCard,
} from "@/components/ui";
import PageTitle from "@/components/ui/page-title";
import TicketCard from "@/components/ticket/ticket-card";
import { recordTicket } from "@/components/ticket/record-ticket";
import { SHOWS, VENUE, VENUES } from "@/components/booking/booking.data";
import { SEATS } from "@/components/booking/seat-layout";
import { dateParts, formatTime, inr } from "@/components/booking/booking.utils";
import {
  removeSeatRecord,
  updateSeatRecord,
  useSeatRecords,
  type SeatRecord,
} from "@/lib/seat-store";
import { PAYMENT_MODES } from "./tickets/payment-modes";
import TicketsTable from "./tickets/tickets-table";

const CAPACITY = SEATS.filter((s) => s.bookable).length; // seats sold on this site, per show

const SHOW_LIST = (SHOWS[VENUE.id] ?? []).flatMap((d) =>
  d.times.map((t) => ({ date: d.date, time: t })),
);

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

// Admin home: key numbers, seats per show, and every booking / held ticket in
// the same table as the Cancel page.
export default function Dashboard({ adminName }: { adminName: string }) {
  const records = useSeatRecords();
  const [ticket, setTicket] = useState<SeatRecord | null>(null);
  const [converting, setConverting] = useState<SeatRecord | null>(null);
  const [releasing, setReleasing] = useState<SeatRecord | null>(null);
  const [payMode, setPayMode] = useState("");
  const [payError, setPayError] = useState(false);

  const stats = useMemo(() => {
    const booked = records.filter((r) => r.type === "block");
    const held = records.filter((r) => r.type === "hold");
    const reserved = records.filter((r) => r.type === "reserve");
    const seats = (list: SeatRecord[]) =>
      list.reduce((n, r) => n + r.seats.length, 0);
    const received =
      booked.reduce((s, r) => s + r.amount, 0) +
      reserved.reduce((s, r) => s + (r.paymentMode ? r.amount : 0), 0);
    const taken = seats(records);
    const capacity = CAPACITY * Math.max(1, SHOW_LIST.length);
    return {
      received,
      bookedTickets: booked.length,
      pending: held.reduce((s, r) => s + r.amount, 0),
      heldTickets: held.length,
      bookedSeats: seats(booked),
      heldSeats: seats(held),
      reservedSeats: seats(reserved),
      reservedTickets: reserved.length,
      occupancy: Math.round((taken / capacity) * 100),
      taken,
      capacity,
    };
  }, [records]);

  const perShow = useMemo(
    () =>
      SHOW_LIST.map((s) => {
        const mine = records.filter(
          (r) => r.date === s.date && r.time === s.time,
        );
        const count = (t: SeatRecord["type"]) =>
          mine
            .filter((r) => r.type === t)
            .reduce((n, r) => n + r.seats.length, 0);
        const booked = count("block");
        const held = count("hold");
        const reserved = count("reserve");
        return {
          ...s,
          booked,
          held,
          reserved,
          total: booked + held + reserved,
        };
      }),
    [records],
  );

  const openConvert = (r: SeatRecord) => {
    setPayMode("");
    setPayError(false);
    setConverting(r);
  };
  const confirmConvert = () => {
    if (!payMode) return setPayError(true);
    updateSeatRecord(converting!.id, {
      type: "block",
      paymentMode: payMode,
      adminName,
      convertedAt: Date.now(),
    });
    setConverting(null);
  };

  const venueOf = (r: SeatRecord) => {
    const v = VENUES.find((x) => x.id === r.venueId);
    return v ? `${v.name}, ${v.city}` : "";
  };

  return (
    <div className="flex flex-col gap-10">
      <PageTitle
        title="Dashboard"
        subtitle={`Welcome, ${adminName}. Here is how ticket sales are going.`}
        actions={
          <>
            <ButtonLink href="/admin/tickets/booking">New booking</ButtonLink>
            <ButtonLink href="/admin/tickets/cancel" variant="outline">
              Cancel tickets
            </ButtonLink>
          </>
        }
      />

      {/* KPIs */}
      <section
        aria-label="Key numbers"
        className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3"
      >
        <StatCard
          label="Revenue received"
          value={inr(stats.received)}
          note={plural(stats.bookedTickets, "booked ticket")}
          tone="good"
        />
        <StatCard
          label="Payment pending"
          value={inr(stats.pending)}
          note={`${plural(stats.heldTickets, "ticket")} on hold`}
          tone="warn"
        />
        <StatCard
          label="Occupancy"
          value={`${stats.occupancy}%`}
          note={`${stats.taken} of ${stats.capacity} seats taken`}
        />
        <StatCard
          label="Seats booked"
          value={String(stats.bookedSeats)}
          note="Paid and confirmed"
          tone="good"
        />
        <StatCard
          label="Seats on hold"
          value={String(stats.heldSeats)}
          note="Waiting for payment"
          tone="warn"
        />
        <StatCard
          label="Seats reserved"
          value={String(stats.reservedSeats)}
          note={`${plural(stats.reservedTickets, "reservation")} (VIP / guests)`}
        />
      </section>

      {/* Seats per show */}
      <section aria-label="Seats by show" className="flex flex-col gap-4">
        <Eyebrow as="h2" tone="bronze" tracking="wide">
          Seats by show
        </Eyebrow>
        <div className="grid gap-4 md:grid-cols-2">
          {perShow.map((s) => {
            const p = dateParts(s.date);
            const pct = (n: number) => `${(n / CAPACITY) * 100}%`;
            return (
              <div
                key={`${s.date}${s.time}`}
                className="flex flex-col gap-4 rounded-2xl border border-line bg-paper-raised p-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">
                    {p.weekday}, {p.day} {p.month} · {formatTime(s.time)}
                  </span>
                  <span className="text-sm tabular-nums text-ink-muted">
                    {s.total} / {CAPACITY} seats
                  </span>
                </div>
                <div
                  role="img"
                  aria-label={`${s.booked} booked, ${s.held} on hold, ${s.reserved} reserved of ${CAPACITY}`}
                  className="flex h-2.5 overflow-hidden rounded-full bg-ink/10"
                >
                  <span className="bg-ok" style={{ width: pct(s.booked) }} />
                  <span className="bg-accent" style={{ width: pct(s.held) }} />
                  <span
                    className="bg-bronze"
                    style={{ width: pct(s.reserved) }}
                  />
                </div>
                <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  {(
                    [
                      ["bg-ok", "Booked", s.booked],
                      ["bg-accent", "On hold", s.held],
                      ["bg-bronze", "Reserved", s.reserved],
                    ] as const
                  ).map(([dot, label, n]) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${dot}`} />
                      <dt className="text-ink-muted">{label}</dt>
                      <dd className="font-medium tabular-nums">{n}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bookings + held tickets */}
      <section aria-label="Bookings" className="flex flex-col gap-4">
        <Eyebrow as="h2" tone="bronze" tracking="wide">
          Bookings
        </Eyebrow>
        <TicketsTable
          records={records}
          emptyText="No bookings yet. Tickets you book, hold or reserve appear here."
          actions={(r) =>
            r.type === "hold"
              ? [
                  {
                    label: "Payment received · Book",
                    tone: "primary",
                    onSelect: openConvert,
                  },
                  {
                    label: "Release seats",
                    tone: "danger",
                    onSelect: setReleasing,
                  },
                ]
              : [{ label: "View ticket", onSelect: setTicket }]
          }
        />
      </section>

      {/* Ticket + QR (booked / reserved only) */}
      {ticket && (
        <Modal title="Ticket" size="xl" onClose={() => setTicket(null)}>
          <TicketCard ticket={recordTicket(ticket, venueOf(ticket))} />
        </Modal>
      )}

      {/* Hold → booked once the money arrives */}
      {converting && (
        <Modal title="Move to booked" onClose={() => setConverting(null)}>
          <div className="flex flex-col gap-4 text-sm">
            <p className="text-ink-muted">
              {converting.person.name} · {converting.seats.join(", ")} ·{" "}
              {inr(converting.amount)}
            </p>
            <div className="flex flex-col gap-2">
              <span className="text-ink-muted">Payment received by</span>
              <Select
                value={payMode}
                onChange={(v) => {
                  setPayMode(v);
                  setPayError(false);
                }}
                invalid={payError}
                options={PAYMENT_MODES.map((m) => ({ value: m, label: m }))}
              />
              {payError && (
                <span className="text-xs text-danger-strong">
                  Choose how the payment was received
                </span>
              )}
            </div>
            <div className="flex items-center justify-between rounded-xl border border-line bg-paper-raised px-4 py-3">
              <span className="text-ink-muted">Processed by</span>
              <span className="font-semibold">{adminName}</span>
            </div>
            <div className="mt-2 flex gap-3">
              <Button variant="outline" onClick={() => setConverting(null)}>
                Cancel
              </Button>
              <Button grow onClick={confirmConvert}>
                Confirm &amp; book
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Release a hold */}
      {releasing && (
        <ConfirmDialog
          title="Release these seats?"
          cancelLabel="Keep holding"
          confirmLabel="Release seats"
          onCancel={() => setReleasing(null)}
          onConfirm={() => {
            removeSeatRecord(releasing.id);
            setReleasing(null);
          }}
        >
          {releasing.seats.join(", ")} held for {releasing.person.name} go back
          on sale. This can&apos;t be undone.
        </ConfirmDialog>
      )}
    </div>
  );
}
