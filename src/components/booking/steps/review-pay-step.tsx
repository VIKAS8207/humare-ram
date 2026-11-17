import { PAYMENTS_ENABLED } from "@/lib/payment";
import type { Attendee } from "../booking.types";
import { SEAT_CATEGORIES } from "../booking.data";
import { categoryOfSeat, inr, sortSeats } from "../booking.utils";

type Errors = Partial<Record<keyof Attendee, string>>;

type Props = {
  seats: string[];
  attendee: Attendee;
  errors: Errors;
  showErrors: boolean;
  terms: boolean;
  paying: boolean;
  payError: string | null;
  onAttendee: (field: keyof Attendee, value: string) => void;
  onTerms: (v: boolean) => void;
};

const FIELDS: {
  key: keyof Attendee;
  label: string;
  type: string;
  autoComplete: string;
  inputMode?: "tel" | "email";
  placeholder: string;
}[] = [
  {
    key: "name",
    label: "Full name",
    type: "text",
    autoComplete: "name",
    placeholder: "As on your ID",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    inputMode: "email",
    placeholder: "Tickets are sent here",
  },
  {
    key: "phone",
    label: "Mobile number",
    type: "tel",
    autoComplete: "tel-national",
    inputMode: "tel",
    placeholder: "10-digit number",
  },
];

export default function ReviewPayStep({
  seats,
  attendee,
  errors,
  showErrors,
  terms,
  paying,
  payError,
  onAttendee,
  onTerms,
}: Props) {
  // Group seats by category for the price breakdown
  const groups = SEAT_CATEGORIES.map((c) => ({
    category: c,
    seats: sortSeats(seats.filter((s) => categoryOfSeat(s).id === c.id)),
  })).filter((g) => g.seats.length > 0);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Review & pay
        </h2>
        <p className="text-bk-muted">
          Check your booking and tell us where to send your tickets.
        </p>
      </header>

      {/* Price breakdown */}
      <section aria-label="Your seats" className="flex flex-col gap-4">
        <h3 className="text-xs font-medium uppercase tracking-[0.3em] text-bk-gold">
          Your seats
        </h3>
        <ul className="divide-y divide-bk-line rounded-2xl border border-bk-line">
          {groups.map(({ category, seats: s }) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">
                  {category.name}{" "}
                  <span className="text-bk-muted">× {s.length}</span>
                </span>
                <span className="text-sm text-bk-muted">{s.join(", ")}</span>
              </div>
              <span className="font-medium">
                {inr(category.price * s.length)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Attendee details */}
      <section aria-label="Your details" className="flex flex-col gap-5">
        <h3 className="text-xs font-medium uppercase tracking-[0.3em] text-bk-gold">
          Your details
        </h3>
        <div className="grid gap-5 md:grid-cols-2">
          {FIELDS.map((f) => {
            const error = showErrors ? errors[f.key] : undefined;
            return (
              <label
                key={f.key}
                className={`flex flex-col gap-2 text-sm ${f.key === "name" ? "md:col-span-2" : ""}`}
              >
                <span className="text-bk-muted">{f.label}</span>
                <input
                  type={f.type}
                  value={attendee[f.key]}
                  autoComplete={f.autoComplete}
                  inputMode={f.inputMode}
                  placeholder={f.placeholder}
                  aria-invalid={Boolean(error)}
                  onChange={(e) => onAttendee(f.key, e.target.value)}
                  className={`rounded-xl border bg-bk-surface px-4 py-3 text-base text-bk-ink outline-none transition-colors placeholder:text-bk-muted/60 focus:border-bk-accent ${
                    error ? "border-red-600" : "border-bk-line"
                  }`}
                />
                {error && <span className="text-xs text-red-700">{error}</span>}
              </label>
            );
          })}
        </div>
      </section>

      <label className="flex items-start gap-3 text-sm text-bk-muted">
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => onTerms(e.target.checked)}
          className="mt-0.5 size-4 accent-bk-accent"
        />
        <span>
          I agree to the terms and conditions and the cancellation policy.
        </span>
      </label>
      {showErrors && !terms && (
        <p className="-mt-6 text-xs text-red-700">
          Please accept the terms to continue.
        </p>
      )}

      {!PAYMENTS_ENABLED && (
        <p className="rounded-xl border border-bk-line bg-bk-gold/10 p-4 text-sm text-bk-ink">
          Demo mode: online payment isn&apos;t connected yet, so no money will
          be taken and no real tickets are issued.
        </p>
      )}
      {payError && (
        <p role="alert" className="text-sm text-red-700">
          {payError}
        </p>
      )}
      {paying && <p className="text-sm text-bk-muted">Processing payment…</p>}
    </div>
  );
}
