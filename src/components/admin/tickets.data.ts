// Ticket actions shown in the admin "Tickets" menu. The slug is the URL:
//   /admin/tickets/<slug>
export const TICKET_ACTIONS = [
  {
    slug: "block",
    label: "Block",
    description: "Take seats out of sale so customers cannot book them.",
  },
  {
    slug: "hold",
    label: "Hold",
    description:
      "Hold seats for a limited time before they are released or booked.",
  },
  {
    slug: "reserve",
    label: "Reserve",
    description: "Reserve seats for a guest or partner without online payment.",
  },
  {
    slug: "cancel",
    label: "Cancel Ticket",
    description: "Cancel an existing booking using its booking reference.",
  },
] as const;

export type TicketActionSlug = (typeof TICKET_ACTIONS)[number]["slug"];
