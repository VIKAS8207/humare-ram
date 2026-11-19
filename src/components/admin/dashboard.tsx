import Link from "next/link";
import RecordsPanel from "./records-panel";
import { TICKET_ACTIONS } from "./tickets.data";

// Placeholder dashboard content (the top bar comes from AdminGate).
// Real admin tools (bookings, shows, pricing…) get added here later.
export default function Dashboard({ adminName }: { adminName: string }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
        <p className="max-w-xl text-bk-muted">
          Manage tickets from the menu above. Bookings, shows and pricing tools
          will appear here.
        </p>
      </div>

      <section aria-label="Ticket actions" className="flex flex-col gap-4">
        <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-bk-gold">
          Tickets
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {TICKET_ACTIONS.map((a) => (
            <Link
              key={a.slug}
              href={`/admin/tickets/${a.slug}`}
              className="flex flex-col gap-2 rounded-2xl border border-bk-line bg-bk-surface p-5 transition-colors hover:border-bk-accent/60"
            >
              <span className="text-lg font-semibold">{a.label}</span>
              <span className="text-sm text-bk-muted">{a.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <RecordsPanel adminName={adminName} />
    </div>
  );
}
