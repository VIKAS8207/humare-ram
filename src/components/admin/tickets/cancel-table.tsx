"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
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
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Cancel
        </h1>
        <p className="max-w-2xl text-bk-muted">
          All tickets in one place. Open the menu on a row to see the details or
          cancel the ticket.
        </p>
      </div>

      <TicketsTable
        records={records}
        actions={() => [
          { label: "Cancel ticket", tone: "danger", onSelect: setCancelling },
        ]}
      />

      {cancelling && (
        <Modal title="Cancel this ticket?" onClose={() => setCancelling(null)}>
          <p className="text-sm text-bk-muted">
            {cancelling.id} · {cancelling.person.name} ·{" "}
            {cancelling.seats.length} seat
            {cancelling.seats.length > 1 ? "s" : ""}. The ticket stops working
            and the seats become free for everyone. This cannot be undone.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setCancelling(null)}
              className="flex-1 rounded-full border border-bk-line px-6 py-3 font-medium transition-colors hover:border-bk-ink"
            >
              Keep ticket
            </button>
            <button
              type="button"
              onClick={() => {
                removeSeatRecord(cancelling.id);
                setCancelling(null);
              }}
              className="flex-1 rounded-full bg-red-600 px-6 py-3 font-semibold text-white"
            >
              Cancel ticket
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
