import type { SeatCategory, ShowDay, Venue } from "./booking.types";

// ───────────────────────────────────────────────────────────────────────────
// PLACEHOLDER DATA — replace venues, dates, times and prices with the real
// ones (later this can come from your backend / ticketing system).
// ───────────────────────────────────────────────────────────────────────────

// One venue only, so the booking flow has no venue step. It is selected
// automatically (see VENUE). If a second venue is ever added, bring back the
// venue step (steps/venue-step.tsx still exists) and list it here.
export const VENUES: Venue[] = [
  {
    id: "venue-1",
    name: "Pandit Dindayal Upadhyay Auditorium",
    city: "Raipur (CG)",
    address: "Pandit Dindayal Upadhyay Auditorium, Raipur (CG)",
  },
];
export const VENUE = VENUES[0];

// Fixed dates on purpose (no "today" maths), so server and browser always agree.
// PLACEHOLDER times - replace with the real show timings.
export const SHOWS: Record<string, ShowDay[]> = {
  [VENUE.id]: [
    { date: "2026-12-26", times: ["16:00", "19:30"] },
    { date: "2026-12-27", times: ["16:00", "19:30"] },
  ],
};

// Placeholder prices. Only these zones are sold on this site (the red seats of
// the seating plan); every other seat is sold on BookMyShow. Which seats belong
// to which tier is set in seat-plan.data.ts.
export const SEAT_CATEGORIES: SeatCategory[] = [
  { id: "vvip", name: "VVIP Sofa", price: 5000, color: "#d9669c" },
  { id: "dp", name: "Diamond + Platinum", price: 2500, color: "#7c5cd6" },
  { id: "gold", name: "Gold", price: 1500, color: "#d99207" },
];

// ───────────────────────────────────────────────────────────────────────────
// PLACEHOLDER — the BookMyShow page for Humare Ram. Seats that are not sold on
// this site send the visitor here. Replace with the real event link.
// ───────────────────────────────────────────────────────────────────────────
export const BOOKMYSHOW_URL = "https://in.bookmyshow.com/";

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
