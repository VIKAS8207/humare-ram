import { SEAT_CATEGORIES } from "./booking.data";
import type { SeatCategory } from "./booking.types";
import { ROW_ORDER, SEAT_BY_ID } from "./seat-layout";

// ── Formatting ──────────────────────────────────────────────────────────────

const inrFormat = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
export const inr = (n: number) => inrFormat.format(n);

// Dates are parsed/printed in UTC so output never depends on the viewer's timezone.
const utc = (date: string) => new Date(`${date}T00:00:00Z`);
const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", ...opts });

export const dateParts = (date: string) => {
  const d = utc(date);
  return {
    weekday: fmt({ weekday: "short" }).format(d),
    day: fmt({ day: "numeric" }).format(d),
    month: fmt({ month: "short" }).format(d),
    long: fmt({
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d),
  };
};

export const formatTime = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
};

// ── Seats ───────────────────────────────────────────────────────────────────

export const categoryOfSeat = (seatId: string): SeatCategory => {
  const tier = SEAT_BY_ID[seatId]?.tier;
  return (
    SEAT_CATEGORIES.find((c) => c.id === tier) ??
    SEAT_CATEGORIES[SEAT_CATEGORIES.length - 1]
  );
};
export const priceOfSeat = (seatId: string) => categoryOfSeat(seatId).price;

// Deterministic "already booked" seats per show (FNV-1a hash), ~20% taken.
// Placeholder for real availability from a backend.
export const isSeatTaken = (showKey: string, seatId: string) => {
  let h = 2166136261;
  const s = `${showKey}:${seatId}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 100 < 20;
};

export const showKeyOf = (venueId: string, date: string, time: string) =>
  `${venueId}|${date}|${time}`;

const splitSeat = (id: string) => {
  const m = /^([A-Z]+)(\d+)$/.exec(id);
  return { row: m ? m[1] : id, n: m ? Number(m[2]) : 0 };
};

// Sorted from the stage outwards, then left to right
export const sortSeats = (seats: string[]) =>
  [...seats].sort((a, b) => {
    const A = splitSeat(a);
    const B = splitSeat(b);
    return ROW_ORDER.indexOf(A.row) - ROW_ORDER.indexOf(B.row) || A.n - B.n;
  });

// ── Validation ──────────────────────────────────────────────────────────────

export const validateAttendee = (a: {
  name: string;
  email: string;
  phone: string;
}) => {
  const errors: Partial<Record<"name" | "email" | "phone", string>> = {};
  if (a.name.trim().length < 2) errors.name = "Enter your full name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email.trim()))
    errors.email = "Enter a valid email";
  if (!/^[6-9]\d{9}$/.test(a.phone.replace(/[\s-]/g, "")))
    errors.phone = "Enter a 10-digit mobile number";
  return errors;
};
