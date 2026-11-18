"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Stepper from "@/components/booking/stepper";
import DateTimeStep from "@/components/booking/steps/datetime-step";
import SeatsStep from "@/components/booking/steps/seats-step";
import VenueStep from "@/components/booking/steps/venue-step";
import SummaryPanel, { totalOf } from "@/components/booking/summary-panel";
import { SEAT_CATEGORIES, VENUES } from "@/components/booking/booking.data";
import type { Selection } from "@/components/booking/booking.types";
import {
  categoryOfSeat,
  dateParts,
  formatTime,
  inr,
  showKeyOf,
  sortSeats,
} from "@/components/booking/booking.utils";
import {
  addSeatRecord,
  takenSeatsForShow,
  useSeatRecords,
  type SeatRecord,
  type SeatRecordType,
} from "@/lib/seat-store";
import { PAYMENT_MODES } from "./payment-modes";

type Mode = Exclude<SeatRecordType, never>;

const STEPS = ["Venue", "Date & Time", "Seats", "Details & Confirm"] as const;
const LAST = STEPS.length - 1;
const ADMIN_MAX_SEATS = 20;

const COPY: Record<
  Mode,
  {
    title: string;
    intro: string;
    confirm: string;
    doneTitle: string;
    doneText: string;
    amountLabel: string;
  }
> = {
  block: {
    title: "Block seats",
    intro:
      "Payment has been received. Choose the seats, then enter the customer's details to confirm.",
    confirm: "Confirm & block",
    doneTitle: "Seats blocked",
    doneText:
      "These seats are now sold and no longer available to anyone else.",
    amountLabel: "Amount received",
  },
  hold: {
    title: "Hold seats",
    intro:
      "Payment is not received yet. The seats are held and listed on the Dashboard. Move them to Block once the money arrives.",
    confirm: "Hold seats",
    doneTitle: "Seats on hold",
    doneText:
      "Find them on the Dashboard under Held seats. Move them to Block when payment is received.",
    amountLabel: "Amount due",
  },
  reserve: {
    title: "Reserve seats",
    intro:
      "For VVIPs. The seats are kept back for the guest and no payment is needed.",
    confirm: "Reserve seats",
    doneTitle: "Seats reserved",
    doneText:
      "These seats are kept for the guest and no longer available to anyone else.",
    amountLabel: "Value",
  },
};

const input =
  "w-full rounded-xl border border-bk-line bg-bk-surface px-4 py-3 text-base text-bk-ink outline-none transition-colors placeholder:text-bk-muted/60 focus:border-bk-accent";

type Person = {
  name: string;
  phone: string;
  email: string;
  note: string;
  paymentMode: string;
};

function validate(mode: Mode, p: Person) {
  const e: Partial<Record<keyof Person, string>> = {};
  if (p.name.trim().length < 2) e.name = "Enter the person's full name";
  if (!/^[6-9]\d{9}$/.test(p.phone.replace(/[\s-]|^\+91/g, "")))
    e.phone = "Enter a 10-digit mobile number";
  if (p.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(p.email.trim()))
    e.email = "Enter a valid email";
  if (mode === "block" && !p.paymentMode)
    e.paymentMode = "Choose how the payment was received";
  return e;
}

export default function TicketFlow({
  mode,
  adminName,
}: {
  mode: Mode;
  adminName: string;
}) {
  const copy = COPY[mode];
  const records = useSeatRecords();

  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<Selection>({
    venueId: null,
    date: null,
    time: null,
    quantity: null,
    seats: [],
  });
  const [person, setPerson] = useState<Person>({
    name: "",
    phone: "",
    email: "",
    note: "",
    paymentMode: "",
  });
  const [showErrors, setShowErrors] = useState(false);
  const [done, setDone] = useState<SeatRecord | null>(null);

  const extraTaken = useMemo(
    () =>
      takenSeatsForShow(
        records,
        selection.venueId,
        selection.date,
        selection.time,
      ),
    [records, selection.venueId, selection.date, selection.time],
  );

  const total = totalOf(selection.seats);
  const errors = validate(mode, person);

  // Changing an earlier choice clears what depended on it
  const selectVenue = (venueId: string) =>
    setSelection((s) => ({ ...s, venueId, date: null, time: null, seats: [] }));
  const selectDate = (date: string) =>
    setSelection((s) => ({ ...s, date, time: null, seats: [] }));
  const selectTime = (time: string) =>
    setSelection((s) => ({ ...s, time, seats: [] }));
  const setQuantity = (quantity: number) =>
    setSelection((s) => ({
      ...s,
      quantity,
      seats: s.seats.slice(0, quantity),
    }));
  const setSeats = (seats: string[]) => setSelection((s) => ({ ...s, seats }));

  const stepValid = [
    Boolean(selection.venueId),
    Boolean(selection.date && selection.time),
    selection.quantity !== null &&
      selection.seats.length === selection.quantity,
    true,
  ][step];

  const confirm = () => {
    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      return;
    }
    const record = addSeatRecord({
      type: mode,
      venueId: selection.venueId!,
      date: selection.date!,
      time: selection.time!,
      seats: sortSeats(selection.seats),
      person: {
        name: person.name.trim(),
        phone: person.phone.trim(),
        email: person.email.trim() || undefined,
        note: person.note.trim() || undefined,
      },
      amount: mode === "reserve" ? 0 : total,
      paymentMode: mode === "block" ? person.paymentMode : undefined,
      adminName,
    });
    setDone(record);
  };

  const reset = () => {
    setStep(0);
    setSelection({
      venueId: null,
      date: null,
      time: null,
      quantity: null,
      seats: [],
    });
    setPerson({ name: "", phone: "", email: "", note: "", paymentMode: "" });
    setShowErrors(false);
    setDone(null);
  };

  const venue = VENUES.find(
    (v) => v.id === (done?.venueId ?? selection.venueId),
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-orange-400">
          Tickets
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="max-w-2xl text-white/60">{copy.intro}</p>
      </header>

      {/* Same booking screens as the public site, on a light panel */}
      <div className="rounded-3xl bg-bk-bg p-5 text-bk-ink md:p-10">
        {done ? (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-8 py-6 text-center">
            <span className="grid size-16 place-content-center rounded-full bg-bk-accent text-3xl text-bk-accent-ink">
              ✓
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-semibold tracking-tight">
                {copy.doneTitle}
              </h2>
              <p className="text-bk-muted">{copy.doneText}</p>
            </div>
            <dl className="flex w-full flex-col gap-4 rounded-2xl border border-bk-line bg-bk-surface p-6 text-left text-sm">
              {[
                ["Reference", done.id],
                ["For", `${done.person.name} · ${done.person.phone}`],
                ["Venue", venue ? `${venue.name}, ${venue.city}` : "—"],
                [
                  "Show",
                  `${dateParts(done.date).long}, ${formatTime(done.time)}`,
                ],
                ["Seats", done.seats.join(", ")],
                [copy.amountLabel, inr(done.amount)],
                ...(done.paymentMode ? [["Payment", done.paymentMode]] : []),
                ["Processed by", done.adminName],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6">
                  <dt className="text-bk-muted">{label}</dt>
                  <dd className="text-right font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="rounded-full bg-bk-ink px-7 py-3 text-sm font-semibold text-bk-bg transition-transform hover:scale-105"
              >
                {mode === "block"
                  ? "Block more seats"
                  : mode === "hold"
                    ? "Hold more seats"
                    : "Reserve more seats"}
              </button>
              <Link
                href="/admin"
                className="rounded-full border border-bk-line px-7 py-3 text-sm font-semibold transition-colors hover:border-bk-ink"
              >
                Go to dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            <Stepper
              steps={STEPS}
              step={step}
              onStepClick={(i) => setStep(i)}
            />

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
              <div className="min-w-0">
                {step === 0 && (
                  <VenueStep
                    venueId={selection.venueId}
                    onSelect={selectVenue}
                  />
                )}
                {step === 1 && selection.venueId && (
                  <DateTimeStep
                    venueId={selection.venueId}
                    date={selection.date}
                    time={selection.time}
                    onDate={selectDate}
                    onTime={selectTime}
                  />
                )}
                {step === 2 &&
                  selection.venueId &&
                  selection.date &&
                  selection.time && (
                    <SeatsStep
                      showKey={showKeyOf(
                        selection.venueId,
                        selection.date,
                        selection.time,
                      )}
                      quantity={selection.quantity}
                      seats={selection.seats}
                      onQuantity={setQuantity}
                      onSeats={setSeats}
                      extraTaken={extraTaken}
                      maxSeats={ADMIN_MAX_SEATS}
                      groupContact={false}
                    />
                  )}
                {step === 3 && (
                  <div className="flex flex-col gap-10">
                    <header className="flex flex-col gap-2">
                      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                        Customer details
                      </h2>
                      <p className="text-bk-muted">
                        {mode === "reserve"
                          ? "Who are these seats reserved for?"
                          : "Enter the details of the person these seats are for."}
                      </p>
                    </header>

                    {/* Seats + amount */}
                    <section aria-label="Seats" className="flex flex-col gap-4">
                      <h3 className="text-xs font-medium uppercase tracking-[0.3em] text-bk-gold">
                        Seats
                      </h3>
                      <ul className="divide-y divide-bk-line rounded-2xl border border-bk-line">
                        {SEAT_CATEGORIES.map((c) => {
                          const s = sortSeats(
                            selection.seats.filter(
                              (x) => categoryOfSeat(x).id === c.id,
                            ),
                          );
                          if (!s.length) return null;
                          return (
                            <li
                              key={c.id}
                              className="flex items-center justify-between gap-4 p-4"
                            >
                              <div className="flex flex-col gap-1">
                                <span className="font-medium">
                                  {c.name}{" "}
                                  <span className="text-bk-muted">
                                    × {s.length}
                                  </span>
                                </span>
                                <span className="text-sm text-bk-muted">
                                  {s.join(", ")}
                                </span>
                              </div>
                              <span className="font-medium">
                                {inr(c.price * s.length)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </section>

                    <section
                      aria-label="Person"
                      className="grid gap-5 md:grid-cols-2"
                    >
                      {(
                        [
                          [
                            "name",
                            "Full name",
                            "text",
                            "As on ID",
                            "name",
                            "md:col-span-2",
                          ],
                          [
                            "phone",
                            "Mobile number",
                            "tel",
                            "10-digit number",
                            "tel-national",
                            "",
                          ],
                          [
                            "email",
                            "Email (optional)",
                            "email",
                            "For the ticket copy",
                            "email",
                            "",
                          ],
                        ] as const
                      ).map(([key, label, type, placeholder, auto, span]) => {
                        const error = showErrors ? errors[key] : undefined;
                        return (
                          <label
                            key={key}
                            className={`flex flex-col gap-2 text-sm ${span}`}
                          >
                            <span className="text-bk-muted">{label}</span>
                            <input
                              type={type}
                              value={person[key]}
                              placeholder={placeholder}
                              autoComplete={auto}
                              aria-invalid={Boolean(error)}
                              onChange={(e) =>
                                setPerson((p) => ({
                                  ...p,
                                  [key]: e.target.value,
                                }))
                              }
                              className={`${input} ${error ? "border-red-600" : ""}`}
                            />
                            {error && (
                              <span className="text-xs text-red-700">
                                {error}
                              </span>
                            )}
                          </label>
                        );
                      })}

                      {mode === "block" && (
                        <label className="flex flex-col gap-2 text-sm">
                          <span className="text-bk-muted">
                            Payment received by
                          </span>
                          <select
                            value={person.paymentMode}
                            onChange={(e) =>
                              setPerson((p) => ({
                                ...p,
                                paymentMode: e.target.value,
                              }))
                            }
                            aria-invalid={Boolean(
                              showErrors && errors.paymentMode,
                            )}
                            className={`${input} ${showErrors && errors.paymentMode ? "border-red-600" : ""}`}
                          >
                            <option value="">Select…</option>
                            {PAYMENT_MODES.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                          {showErrors && errors.paymentMode && (
                            <span className="text-xs text-red-700">
                              {errors.paymentMode}
                            </span>
                          )}
                        </label>
                      )}

                      <label
                        className={`flex flex-col gap-2 text-sm ${mode === "block" ? "" : "md:col-span-2"}`}
                      >
                        <span className="text-bk-muted">
                          {mode === "reserve"
                            ? "Reason / guest category (optional)"
                            : "Note (optional)"}
                        </span>
                        <input
                          type="text"
                          value={person.note}
                          placeholder={
                            mode === "reserve"
                              ? "e.g. VVIP guest of the producer"
                              : "Anything to remember"
                          }
                          onChange={(e) =>
                            setPerson((p) => ({ ...p, note: e.target.value }))
                          }
                          className={input}
                        />
                      </label>
                    </section>

                    {/* Auto-filled: who is doing this */}
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-bk-line bg-bk-surface px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-[0.2em] text-bk-muted">
                          Processed by
                        </span>
                        <span className="text-lg font-semibold">
                          {adminName}
                        </span>
                      </div>
                      <span className="text-xs text-bk-muted">
                        Added automatically
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <aside className="lg:sticky lg:top-8 lg:self-start">
                <SummaryPanel selection={selection}>
                  {mode !== "reserve" && (
                    <p className="-mt-2 text-xs text-bk-muted">
                      {mode === "block"
                        ? "Amount received"
                        : "Amount due when paid"}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        className="rounded-full border border-bk-line px-6 py-3 text-sm font-medium transition-colors hover:border-bk-ink"
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        step < LAST ? setStep(step + 1) : confirm()
                      }
                      disabled={!stepValid}
                      className="flex-1 rounded-full bg-bk-accent px-6 py-3 text-sm font-semibold text-bk-accent-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                    >
                      {step < LAST ? "Continue" : copy.confirm}
                    </button>
                  </div>
                </SummaryPanel>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
