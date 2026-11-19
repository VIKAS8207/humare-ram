// Ticket actions shown in the admin "Tickets" menu. The slug is the URL:
//   /admin/tickets/<slug>
// "Booking" covers Hold, Reserve and Block (picked on the page itself).
export const TICKET_ACTIONS = [
  {
    slug: "booking",
    label: "Booking",
    description:
      "Hold, reserve or block seats. Blocking also records how the payment was received.",
  },
  {
    slug: "cancel",
    label: "Cancel",
    description: "Cancel an existing booking using its booking reference.",
  },
] as const;

export type TicketActionSlug = (typeof TICKET_ACTIONS)[number]["slug"];
