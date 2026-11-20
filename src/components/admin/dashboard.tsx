"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/modal";
import Select from "@/components/ui/select";
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

function Kpi({
  label,
  value,
  note,
  tone = "default",
}: {
  label: string;
  value: string;
  note: string;
  tone?: "default" | "good" | "warn";
}) {
  const bar =
    tone === "good"
      ? "bg-green-700"
      : tone === "warn"
        ? "bg-bk-accent"
        : "bg-bk-gold";
  return (
    <div className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-bk-line bg-bk-surface p-4 md:gap-3 md:p-5">
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-bk-muted md:text-[0.68rem] md:tracking-[0.18em]">
        {label}
      </span>
      <span className="text-xl font-semibold leading-none tracking-tight tabular-nums md:text-3xl">
        {value}
      </span>
      <span className="text-xs text-bk-muted md:text-sm">{note}</span>
    </div>
  );
}

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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Dashboard
          </h1>
          <p className="text-bk-muted">
            Welcome, {adminName}. Here is how ticket sales are going.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/tickets/booking"
            className="rounded-full bg-bk-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            New booking
          </Link>
          <Link
            href="/admin/tickets/cancel"
            className="rounded-full border border-bk-line px-6 py-3 text-sm font-medium transition-colors hover:border-bk-ink"
          >
            Cancel tickets
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <section
        aria-label="Key numbers"
        className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3"
      >
        <Kpi
          label="Revenue received"
          value={inr(stats.received)}
          note={`${stats.bookedTickets} booked ticket${stats.bookedTickets === 1 ? "" : "s"}`}
          tone="good"
        />
        <Kpi
          label="Payment pending"
          value={inr(stats.pending)}
          note={`${stats.heldTickets} ticket${stats.heldTickets === 1 ? "" : "s"} on hold`}
          tone="warn"
        />
        <Kpi
          label="Occupancy"
          value={`${stats.occupancy}%`}
          note={`${stats.taken} of ${stats.capacity} seats taken`}
        />
        <Kpi
          label="Seats booked"
          value={String(stats.bookedSeats)}
          note="Paid and confirmed"
          tone="good"
        />
        <Kpi
          label="Seats on hold"
          value={String(stats.heldSeats)}
          note="Waiting for payment"
          tone="warn"
        />
        <Kpi
          label="Seats reserved"
          value={String(stats.reservedSeats)}
          note={`${stats.reservedTickets} reservation${stats.reservedTickets === 1 ? "" : "s"} (VIP / guests)`}
        />
      </section>

      {/* Seats per show */}
      <section aria-label="Seats by show" className="flex flex-col gap-4">
        <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-bk-gold">
          Seats by show
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {perShow.map((s) => {
            const p = dateParts(s.date);
            const pct = (n: number) => `${(n / CAPACITY) * 100}%`;
            return (
              <div
                key={`${s.date}${s.time}`}
                className="flex flex-col gap-4 rounded-2xl border border-bk-line bg-bk-surface p-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">
                    {p.weekday}, {p.day} {p.month} · {formatTime(s.time)}
                  </span>
                  <span className="text-sm tabular-nums text-bk-muted">
                    {s.total} / {CAPACITY} seats
                  </span>
                </div>
                <div
                  role="img"
                  aria-label={`${s.booked} booked, ${s.held} on hold, ${s.reserved} reserved of ${CAPACITY}`}
                  className="flex h-2.5 overflow-hidden rounded-full bg-bk-ink/10"
                >
                  <span
                    className="bg-green-700"
                    style={{ width: pct(s.booked) }}
                  />
                  <span
                    className="bg-bk-accent"
                    style={{ width: pct(s.held) }}
                  />
                  <span
                    className="bg-bk-gold"
                    style={{ width: pct(s.reserved) }}
                  />
                </div>
                <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-green-700" />
                    <dt className="text-bk-muted">Booked</dt>
                    <dd className="font-medium tabular-nums">{s.booked}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-bk-accent" />
                    <dt className="text-bk-muted">On hold</dt>
                    <dd className="font-medium tabular-nums">{s.held}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-bk-gold" />
                    <dt className="text-bk-muted">Reserved</dt>
                    <dd className="font-medium tabular-nums">{s.reserved}</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bookings + held tickets */}
      <section aria-label="Bookings" className="flex flex-col gap-4">
        <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-bk-gold">
          Bookings
        </h2>
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
            <p className="text-bk-muted">
              {converting.person.name} · {converting.seats.join(", ")} ·{" "}
              {inr(converting.amount)}
            </p>
            <div className="flex flex-col gap-2">
              <span className="text-bk-muted">Payment received by</span>
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
                <span className="text-xs text-red-700">
                  Choose how the payment was received
                </span>
              )}
            </div>
            <div className="flex items-center justify-between rounded-xl border border-bk-line bg-bk-surface px-4 py-3">
              <span className="text-bk-muted">Processed by</span>
              <span className="font-semibold">{adminName}</span>
            </div>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setConverting(null)}
                className="rounded-full border border-bk-line px-6 py-3 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmConvert}
                className="flex-1 rounded-full bg-bk-accent px-6 py-3 font-semibold text-white"
              >
                Confirm &amp; book
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Release a hold */}
      {releasing && (
        <Modal title="Release these seats?" onClose={() => setReleasing(null)}>
          <div className="flex flex-col gap-4 text-sm">
            <p className="text-bk-muted">
              {releasing.seats.join(", ")} held for {releasing.person.name} go
              back on sale. This can&apos;t be undone.
            </p>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setReleasing(null)}
                className="rounded-full border border-bk-line px-6 py-3 font-medium"
              >
                Keep holding
              </button>
              <button
                type="button"
                onClick={() => {
                  removeSeatRecord(releasing.id);
                  setReleasing(null);
                }}
                className="flex-1 rounded-full bg-red-600 px-6 py-3 font-semibold text-white"
              >
                Release seats
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
