import { Eyebrow } from "@/components/ui";
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
    label: "Email (optional)",
    type: "email",
    autoComplete: "email",
    inputMode: "email",
    placeholder: "Tickets are also sent here",
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
        <p className="text-ink-muted">
          Check your booking and tell us where to send your tickets.
        </p>
      </header>

      {/* Price breakdown */}
      <section aria-label="Your seats" className="flex flex-col gap-4">
        <Eyebrow as="h3" tone="bronze" tracking="wide">
          Your seats
        </Eyebrow>
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {groups.map(({ category, seats: s }) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">
                  {category.name}{" "}
                  <span className="text-ink-muted">× {s.length}</span>
                </span>
                <span className="text-sm text-ink-muted">{s.join(", ")}</span>
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
        <Eyebrow as="h3" tone="bronze" tracking="wide">
          Your details
        </Eyebrow>
        <div className="grid gap-5 md:grid-cols-2">
          {FIELDS.map((f) => {
            const error = showErrors ? errors[f.key] : undefined;
            return (
              <label
                key={f.key}
                className={`flex flex-col gap-2 text-sm ${f.key === "name" ? "md:col-span-2" : ""}`}
              >
                <span className="text-ink-muted">{f.label}</span>
                <input
                  type={f.type}
                  value={attendee[f.key]}
                  autoComplete={f.autoComplete}
                  inputMode={f.inputMode}
                  placeholder={f.placeholder}
                  aria-invalid={Boolean(error)}
                  onChange={(e) => onAttendee(f.key, e.target.value)}
                  className={`rounded-xl border bg-paper-raised px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-accent ${
                    error ? "border-danger" : "border-line"
                  }`}
                />
                {error && (
                  <span className="text-xs text-danger-strong">{error}</span>
                )}
              </label>
            );
          })}
        </div>
      </section>

      <label className="flex items-start gap-3 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => onTerms(e.target.checked)}
          className="mt-0.5 size-4 accent-accent"
        />
        <span>
          I agree to the terms and conditions and the cancellation policy.
        </span>
      </label>
      {showErrors && !terms && (
        <p className="-mt-6 text-xs text-danger-strong">
          Please accept the terms to continue.
        </p>
      )}

      {!PAYMENTS_ENABLED && (
        <p className="rounded-xl border border-line bg-bronze/10 p-4 text-sm text-ink">
          Demo mode: online payment isn&apos;t connected yet, so no money will
          be taken and no real tickets are issued.
        </p>
      )}
      {payError && (
        <p role="alert" className="text-sm text-danger-strong">
          {payError}
        </p>
      )}
      {paying && <p className="text-sm text-ink-muted">Processing payment…</p>}
    </div>
  );
}
