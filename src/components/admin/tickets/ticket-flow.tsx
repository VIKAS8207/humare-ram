"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Stepper from "@/components/booking/stepper";
import DateTimeStep from "@/components/booking/steps/datetime-step";
import SeatsStep from "@/components/booking/steps/seats-step";
import { BookingBar, totalOf } from "@/components/booking/summary-panel";
import {
  SEAT_CATEGORIES,
  VENUE,
  VENUES,
} from "@/components/booking/booking.data";
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
import Select from "@/components/ui/select";
import TicketCard from "@/components/ticket/ticket-card";
import { recordTicket } from "@/components/ticket/record-ticket";
import { PAYMENT_MODES } from "./payment-modes";

type Mode = Exclude<SeatRecordType, never>;

const STEPS = ["Date & Time", "Seats", "Details & Confirm"] as const;
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
    title: "Book seats",
    intro:
      "Payment has been received. Enter the customer's details and how they paid, then confirm.",
    confirm: "Confirm & book",
    doneTitle: "Seats booked",
    doneText:
      "These seats are now sold and no longer available to anyone else.",
    amountLabel: "Amount received",
  },
  hold: {
    title: "Hold seats",
    intro:
      "Payment is not received yet. The seats are held and listed on the Dashboard. Move them to Booked once the money arrives.",
    confirm: "Hold seats",
    doneTitle: "Seats on hold",
    doneText:
      "Find them on the Dashboard under Held seats. Move them to Booked when payment is received.",
    amountLabel: "Amount due",
  },
  reserve: {
    title: "Reserve seats",
    intro:
      "For VVIPs and guests. The seats are kept back for them. Choose a payment method only if they paid.",
    confirm: "Reserve seats",
    doneTitle: "Seats reserved",
    doneText:
      "These seats are kept for the guest and no longer available to anyone else.",
    amountLabel: "Amount received",
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
  // Booked needs the payment method; for Reserve it is optional
  if (mode === "block" && !p.paymentMode)
    e.paymentMode = "Choose how the payment was received";
  return e;
}

// What to do with the seats, chosen on the last step. Reserve and Booked both
// need the payment method; Hold does not (payment is still pending).
const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "hold", label: "Hold", hint: "Payment pending" },
  { id: "reserve", label: "Reserve", hint: "Kept for a guest" },
  { id: "block", label: "Booked", hint: "Sold to a customer" },
];

export default function TicketFlow({ adminName }: { adminName: string }) {
  const [mode, setMode] = useState<Mode>("hold");
  const copy = COPY[mode];
  const records = useSeatRecords();

  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<Selection>({
    venueId: VENUE.id,
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
  const [leaveOpen, setLeaveOpen] = useState(false);
  const router = useRouter();

  // Anything picked or typed that would be lost by leaving
  const dirty =
    !done &&
    Boolean(
      selection.date ||
      selection.seats.length ||
      person.name ||
      person.phone ||
      person.email ||
      person.note,
    );

  // Closing / reloading the tab with an unfinished booking: browser warning
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

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
      // Reserve without a payment method = complimentary seats (no amount)
      amount: mode === "reserve" && !person.paymentMode ? 0 : total,
      paymentMode:
        mode !== "hold" && person.paymentMode ? person.paymentMode : undefined,
      adminName,
    });
    setDone(record);
  };

  const reset = () => {
    setStep(0);
    setSelection({
      venueId: VENUE.id,
      date: null,
      time: null,
      quantity: null,
      seats: [],
    });
    setPerson({ name: "", phone: "", email: "", note: "", paymentMode: "" });
    setShowErrors(false);
    setDone(null);
    setMode("hold");
    setLeaveOpen(false);
  };

  const venue = VENUES.find(
    (v) => v.id === (done?.venueId ?? selection.venueId),
  );

  const doneButtons = (
    <>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-bk-ink px-7 py-3 text-sm font-semibold text-bk-bg transition-transform hover:scale-105"
      >
        {mode === "block"
          ? "Book more seats"
          : mode === "hold"
            ? "Hold more seats"
            : "Reserve more seats"}
      </button>
      <Link
        href="/admin"
        onClick={reset}
        className="rounded-full border border-bk-line px-7 py-3 text-sm font-semibold transition-colors hover:border-bk-ink"
      >
        Go to dashboard
      </Link>
    </>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Same booking screens as the public site, on a light panel */}
      <div className="rounded-3xl border border-bk-line bg-bk-surface/60 p-5 text-bk-ink md:p-10">
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
            {/* Ticket + QR + download for booked seats (buttons share one row); none for a hold */}
            {done.type !== "hold" ? (
              <TicketCard
                ticket={recordTicket(
                  done,
                  venue ? `${venue.name}, ${venue.city}` : "",
                )}
              >
                {doneButtons}
              </TicketCard>
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                {doneButtons}
              </div>
            )}
          </div>
        ) : (
          <>
            {step !== 1 && (
              <Stepper
                steps={STEPS}
                step={step}
                onStepClick={(i) => setStep(i)}
              />
            )}

            <div className={`${step !== 1 ? "mt-10" : ""} pb-28 md:pb-20`}>
              <div className="min-w-0">
                {step === 0 && selection.venueId && (
                  <DateTimeStep
                    venueId={selection.venueId}
                    date={selection.date}
                    time={selection.time}
                    onDate={selectDate}
                    onTime={selectTime}
                  />
                )}
                {step === 1 &&
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
                {step === 2 && (
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

                      <div className="flex flex-col gap-2 text-sm">
                        <span className="text-bk-muted">Booking type</span>
                        <Select
                          value={mode}
                          onChange={(v) => setMode(v as Mode)}
                          options={MODES.map((m) => ({
                            value: m.id,
                            label: m.label,
                            hint: m.hint,
                          }))}
                        />
                      </div>

                      {mode !== "hold" && (
                        <div className="flex flex-col gap-2 text-sm">
                          <span className="text-bk-muted">
                            Payment received by
                            {mode === "reserve" ? " (optional)" : ""}
                          </span>
                          <Select
                            value={person.paymentMode}
                            onChange={(v) =>
                              setPerson((p) => ({ ...p, paymentMode: v }))
                            }
                            invalid={Boolean(showErrors && errors.paymentMode)}
                            options={[
                              ...(mode === "reserve"
                                ? [{ value: "", label: "Not paid / none" }]
                                : []),
                              ...PAYMENT_MODES.map((m) => ({
                                value: m,
                                label: m,
                              })),
                            ]}
                          />
                          {showErrors && errors.paymentMode && (
                            <span className="text-xs text-red-700">
                              {errors.paymentMode}
                            </span>
                          )}
                        </div>
                      )}

                      <label
                        className={`flex flex-col gap-2 text-sm ${mode !== "hold" ? "md:col-span-2" : ""}`}
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

              {/* Booking summary pinned to the bottom, like the public site */}
              <BookingBar selection={selection}>
                {mode !== "reserve" && (
                  <p className="mb-1 text-xs text-bk-muted">
                    {mode === "block"
                      ? "Amount received"
                      : "Amount due when paid"}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  {step === 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        dirty ? setLeaveOpen(true) : router.push("/admin")
                      }
                      className="rounded-full border border-bk-line px-6 py-3 text-sm font-medium transition-colors hover:border-bk-ink"
                    >
                      Back
                    </button>
                  )}
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
              </BookingBar>
            </div>
          </>
        )}
      </div>

      {leaveOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Leave booking"
          className="fixed inset-0 z-50 grid place-items-center bg-bk-ink/40 p-4 backdrop-blur-sm"
          onMouseDown={(e) =>
            e.target === e.currentTarget && setLeaveOpen(false)
          }
        >
          <div className="w-full max-w-md rounded-2xl border border-bk-line bg-bk-surface p-6 shadow-2xl">
            <h3 className="mb-3 text-xl font-semibold tracking-tight">
              Leave this booking?
            </h3>
            <p className="text-bk-muted">
              The booking is not complete. All the selections you made will
              disappear if you go back to the dashboard.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setLeaveOpen(false)}
                className="flex-1 rounded-full border border-bk-line px-6 py-3 font-medium transition-colors hover:border-bk-ink"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={() => {
                  // Leaving cancels this booking: coming back starts a new one
                  reset();
                  router.push("/admin");
                }}
                className="flex-1 rounded-full bg-red-600 px-6 py-3 font-semibold text-white"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
