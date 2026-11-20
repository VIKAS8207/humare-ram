"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ui";
import PageTitle from "@/components/ui/page-title";
import {
  removeSeatRecord,
  useSeatRecords,
  type SeatRecord,
} from "@/lib/seat-store";
import TicketsTable from "./tickets-table";

// Cancel page: every ticket in the shared table. "Cancel ticket" (in the ⋮
// menu or inside the details popup) removes the ticket and frees its seats.
export default function CancelTable() {
  const records = useSeatRecords();
  const [cancelling, setCancelling] = useState<SeatRecord | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Cancel"
        subtitle="All tickets in one place. Open the menu on a row to see the details or cancel the ticket."
      />

      <TicketsTable
        records={records}
        actions={() => [
          { label: "Cancel ticket", tone: "danger", onSelect: setCancelling },
        ]}
      />

      {cancelling && (
        <ConfirmDialog
          title="Cancel this ticket?"
          cancelLabel="Keep ticket"
          confirmLabel="Cancel ticket"
          onCancel={() => setCancelling(null)}
          onConfirm={() => {
            removeSeatRecord(cancelling.id);
            setCancelling(null);
          }}
        >
          {cancelling.id} · {cancelling.person.name} · {cancelling.seats.length}{" "}
          seat{cancelling.seats.length > 1 ? "s" : ""}. The ticket stops working
          and the seats become free for everyone. This cannot be undone.
        </ConfirmDialog>
      )}
    </div>
  );
}
