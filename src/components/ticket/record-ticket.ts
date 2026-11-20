import {
  dateParts,
  formatTime,
  inr,
  sortSeats,
} from "@/components/booking/booking.utils";
import type { TicketData } from "@/lib/ticket";
import type { SeatRecord } from "@/lib/seat-store";

/** Ticket for a Block / Reserve record (holds get no ticket until paid) */
export function recordTicket(r: SeatRecord, venue: string): TicketData {
  return {
    reference: r.id,
    name: r.person.name,
    venue,
    dateLong: dateParts(r.date).long,
    time: formatTime(r.time),
    seats: sortSeats(r.seats),
    amount: r.type === "reserve" && !r.amount ? "Complimentary" : inr(r.amount),
    status: r.type === "reserve" ? "Reserved" : "Booked",
  };
}
