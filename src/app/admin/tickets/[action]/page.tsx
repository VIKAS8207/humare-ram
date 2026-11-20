import { notFound } from "next/navigation";
import AdminGate from "@/components/admin/admin-gate";
import CancelTable from "@/components/admin/tickets/cancel-table";
import TicketFlow from "@/components/admin/tickets/ticket-flow";
import { TICKET_ACTIONS } from "@/components/admin/tickets.data";
import { getAdminName } from "@/lib/admin-auth";

export function generateStaticParams() {
  return TICKET_ACTIONS.map((a) => ({ action: a.slug }));
}

// Ticket pages: Booking (Hold / Reserve / Booked) and Cancel (ticket table).
export default async function TicketActionPage({
  params,
}: {
  params: Promise<{ action: string }>;
}) {
  const { action } = await params;
  const item = TICKET_ACTIONS.find((a) => a.slug === action);
  if (!item) notFound();

  if (item.slug === "booking") {
    return (
      <AdminGate slim>
        <TicketFlow adminName={getAdminName()} />
      </AdminGate>
    );
  }

  // Cancel
  return (
    <AdminGate>
      <CancelTable />
    </AdminGate>
  );
}
