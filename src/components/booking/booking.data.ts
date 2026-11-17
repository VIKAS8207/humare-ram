import type { SeatCategory, ShowDay, Venue } from "./booking.types";

// ───────────────────────────────────────────────────────────────────────────
// PLACEHOLDER DATA — replace venues, dates, times and prices with the real
// ones (later this can come from your backend / ticketing system).
// ───────────────────────────────────────────────────────────────────────────

export const VENUES: Venue[] = [
  {
    id: "venue-1",
    name: "Grand Theatre",
    city: "Mumbai",
    address: "Placeholder address, Mumbai",
  },
  {
    id: "venue-2",
    name: "Royal Auditorium",
    city: "Delhi",
    address: "Placeholder address, New Delhi",
  },
  {
    id: "venue-3",
    name: "Cultural Centre",
    city: "Bengaluru",
    address: "Placeholder address, Bengaluru",
  },
];

// Fixed dates on purpose (no "today" maths), so server and browser always agree.
export const SHOWS: Record<string, ShowDay[]> = {
  "venue-1": [
    { date: "2026-12-05", times: ["16:00", "19:30"] },
    { date: "2026-12-06", times: ["16:00", "19:30"] },
    { date: "2026-12-12", times: ["19:30"] },
    { date: "2026-12-13", times: ["16:00", "19:30"] },
  ],
  "venue-2": [
    { date: "2026-12-19", times: ["19:30"] },
    { date: "2026-12-20", times: ["16:00", "19:30"] },
    { date: "2026-12-26", times: ["19:30"] },
  ],
  "venue-3": [
    { date: "2027-01-09", times: ["16:00", "19:30"] },
    { date: "2027-01-10", times: ["16:00", "19:30"] },
  ],
};

// Placeholder tiers/prices. Which seats belong to which tier is set in seat-layout.ts.
export const SEAT_CATEGORIES: SeatCategory[] = [
  { id: "royal", name: "Royal", price: 2500, color: "#7c5cd6" },
  { id: "premium", name: "Premium", price: 1800, color: "#d99207" },
  { id: "gold", name: "Gold", price: 1500, color: "#2f9e5b" },
  { id: "silver", name: "Silver", price: 1200, color: "#1fa0bd" },
  { id: "standard", name: "Standard", price: 800, color: "#d9669c" },
];

export const MAX_SEATS = 10;

// ───────────────────────────────────────────────────────────────────────────
// PLACEHOLDER — who to contact for bookings of more than MAX_SEATS seats.
// Replace the name, phone and email with the real group-booking contact.
// ───────────────────────────────────────────────────────────────────────────
export const GROUP_BOOKING_CONTACT = {
  name: "Group Bookings Desk",
  phone: "+91 00000 00000",
  email: "groups@humareram.com",
};
