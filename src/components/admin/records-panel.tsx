"use client";

import { useState } from "react";
import { VENUES } from "@/components/booking/booking.data";
import { dateParts, formatTime, inr } from "@/components/booking/booking.utils";
import {
  removeSeatRecord,
  updateSeatRecord,
  useSeatRecords,
  type SeatRecord,
  type SeatRecordType,
} from "@/lib/seat-store";
import { PAYMENT_MODES } from "./tickets/payment-modes";

const TABS: { type: SeatRecordType; label: string; empty: string }[] = [
  {
    type: "hold",
    label: "Held seats",
    empty: "No seats on hold. Held seats waiting for payment appear here.",
  },
  { type: "block", label: "Blocked", empty: "No blocked seats yet." },
  { type: "reserve", label: "Reserved", empty: "No reserved seats yet." },
];

const fmtWhen = (ms: number) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ms));

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
        <h3 className="mb-5 text-xl font-semibold tracking-tight">{title}</h3>
        {children}
      </div>
    </div>
  );
}

// Dashboard list of Held / Blocked / Reserved seats. Held seats can be moved to
// Block (when the payment arrives) or released.
export default function RecordsPanel({ adminName }: { adminName: string }) {
  const records = useSeatRecords();
  const [tab, setTab] = useState<SeatRecordType>("hold");
  const [converting, setConverting] = useState<SeatRecord | null>(null);
  const [releasing, setReleasing] = useState<SeatRecord | null>(null);
  const [mode, setMode] = useState("");
  const [modeError, setModeError] = useState(false);

  const counts = Object.fromEntries(
    TABS.map((t) => [t.type, records.filter((r) => r.type === t.type).length]),
  ) as Record<SeatRecordType, number>;
  const dueTotal = records
    .filter((r) => r.type === "hold")
    .reduce((s, r) => s + r.amount, 0);
  const list = records.filter((r) => r.type === tab);

  const openConvert = (r: SeatRecord) => {
    setMode("");
    setModeError(false);
    setConverting(r);
  };
  const confirmConvert = () => {
    if (!mode) return setModeError(true);
    updateSeatRecord(converting!.id, {
      type: "block",
      paymentMode: mode,
      adminName,
      convertedAt: Date.now(),
    });
    setConverting(null);
    setTab("block");
  };

  return (
    <section aria-label="Seat records" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-orange-400">
          Seat activity
        </h2>
        {counts.hold > 0 && (
          <p className="text-sm text-amber-200">
            {counts.hold} on hold · {inr(dueTotal)} waiting for payment
          </p>
        )}
      </div>

      <div role="tablist" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.type}
            role="tab"
            type="button"
            aria-selected={tab === t.type}
            onClick={() => setTab(t.type)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              tab === t.type
                ? "bg-orange-400 text-black"
                : "border border-white/15 text-white/70 hover:border-white/40"
            }`}
          >
            {t.label} <span className="opacity-70">({counts[t.type]})</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/50">
          {TABS.find((t) => t.type === tab)!.empty}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((r) => {
            const venue = VENUES.find((v) => v.id === r.venueId);
            return (
              <li
                key={r.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex min-w-0 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-lg font-semibold">
                      {r.person.name}
                    </span>
                    <span className="text-sm text-white/50">
                      {r.person.phone}
                    </span>
                    <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.2em] text-white/50">
                      {r.id}
                    </span>
                  </div>
                  <p className="text-sm text-white/70">
                    {venue ? `${venue.name}, ${venue.city}` : r.venueId} ·{" "}
                    {dateParts(r.date).long} · {formatTime(r.time)}
                  </p>
                  <p className="text-sm">
                    <span className="text-white/50">Seats:</span>{" "}
                    {r.seats.join(", ")}
                    {r.type !== "reserve" && (
                      <>
                        <span className="mx-2 text-white/25">|</span>
                        <span className="text-white/50">
                          {r.type === "hold" ? "Due:" : "Received:"}
                        </span>{" "}
                        {inr(r.amount)}
                        {r.paymentMode && (
                          <span className="text-white/50">
                            {" "}
                            ({r.paymentMode})
                          </span>
                        )}
                      </>
                    )}
                  </p>
                  {r.person.note && (
                    <p className="text-sm text-white/50">
                      Note: {r.person.note}
                    </p>
                  )}
                  <p className="text-xs text-white/40">
                    {r.convertedAt
                      ? `Moved to block ${fmtWhen(r.convertedAt)}`
                      : fmtWhen(r.createdAt)}{" "}
                    · by {r.adminName}
                  </p>
                </div>

                {r.type === "hold" && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => openConvert(r)}
                      className="rounded-full bg-orange-400 px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105"
                    >
                      Payment received · Block
                    </button>
                    <button
                      type="button"
                      onClick={() => setReleasing(r)}
                      className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-red-400/60 hover:text-red-300"
                    >
                      Release
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Move a hold to block */}
      {converting && (
        <Modal title="Move to block" onClose={() => setConverting(null)}>
          <div className="flex flex-col gap-4 text-sm">
            <p className="text-white/70">
              {converting.person.name} · {converting.seats.join(", ")} ·{" "}
              {inr(converting.amount)}
            </p>
            <label className="flex flex-col gap-2">
              <span className="text-white/60">Payment received by</span>
              <select
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value);
                  setModeError(false);
                }}
                className={`rounded-xl border bg-white/[0.04] px-4 py-3 text-base text-white outline-none focus:border-orange-400 ${
                  modeError ? "border-red-400" : "border-white/15"
                }`}
              >
                <option value="">Select…</option>
                {PAYMENT_MODES.map((m) => (
                  <option key={m} value={m} className="text-black">
                    {m}
                  </option>
                ))}
              </select>
              {modeError && (
                <span className="text-xs text-red-400">
                  Choose how the payment was received
                </span>
              )}
            </label>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="text-white/50">Processed by</span>
              <span className="font-semibold">{adminName}</span>
            </div>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setConverting(null)}
                className="rounded-full border border-white/20 px-6 py-3 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmConvert}
                className="flex-1 rounded-full bg-orange-400 px-6 py-3 font-semibold text-black"
              >
                Confirm & block
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Release a hold */}
      {releasing && (
        <Modal title="Release these seats?" onClose={() => setReleasing(null)}>
          <div className="flex flex-col gap-4 text-sm">
            <p className="text-white/70">
              {releasing.seats.join(", ")} held for {releasing.person.name} go
              back on sale. This can&apos;t be undone.
            </p>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setReleasing(null)}
                className="rounded-full border border-white/20 px-6 py-3 font-medium"
              >
                Keep holding
              </button>
              <button
                type="button"
                onClick={() => {
                  removeSeatRecord(releasing.id);
                  setReleasing(null);
                }}
                className="flex-1 rounded-full bg-red-500 px-6 py-3 font-semibold text-white"
              >
                Release seats
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
