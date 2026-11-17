import type { Metadata } from "next";
import BookingFlow from "@/components/booking/booking-flow";

export const metadata: Metadata = {
  title: "Book Tickets — Humare Ram",
  description: "Choose your venue, date and seats for Humare Ram.",
};

export default function BookPage() {
  return <BookingFlow />;
}
