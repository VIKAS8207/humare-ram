import { notFound } from "next/navigation";
import AdminGate from "@/components/admin/admin-gate";
import TicketFlow from "@/components/admin/tickets/ticket-flow";
import { TICKET_ACTIONS } from "@/components/admin/tickets.data";
import { getAdminName } from "@/lib/admin-auth";

export function generateStaticParams() {
  return TICKET_ACTIONS.map((a) => ({ action: a.slug }));
}

// Placeholder page for each ticket action (Block, Hold, Reserve, Cancel Ticket).
// The backend developer builds the real form / seat picker here.
export default async function TicketActionPage({
  params,
}: {
  params: Promise<{ action: string }>;
}) {
  const { action } = await params;
  const item = TICKET_ACTIONS.find((a) => a.slug === action);
  if (!item) notFound();

  if (
    item.slug === "block" ||
    item.slug === "hold" ||
    item.slug === "reserve"
  ) {
    return (
      <AdminGate>
        <TicketFlow mode={item.slug} adminName={getAdminName()} />
      </AdminGate>
    );
  }

  return (
    <AdminGate>
      <div className="flex max-w-2xl flex-col gap-6">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-orange-400">
          Tickets
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{item.label}</h1>
        <p className="text-white/60">{item.description}</p>
        <p className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-100/80">
          This tool isn&apos;t connected to a backend yet.
        </p>
      </div>
    </AdminGate>
  );
}
