"use client";

import { useMemo, useState } from "react";
import {
  buildTicketSvg,
  downloadTicketPng,
  type TicketData,
} from "@/lib/ticket";

// The ticket (with QR code) and a Download button. Only render this for seats
// that are booked / blocked / reserved. Held seats get no ticket until paid.
export default function TicketCard({
  ticket,
  children,
}: {
  ticket: TicketData;
  /** Extra buttons, shown on the same row as Download */
  children?: React.ReactNode;
}) {
  const svg = useMemo(() => buildTicketSvg(ticket), [ticket]);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const download = async () => {
    setBusy(true);
    setFailed(false);
    try {
      await downloadTicketPng(ticket);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        role="img"
        aria-label={`Ticket ${ticket.reference}, seats ${ticket.seats.join(", ")}`}
        className="w-full drop-shadow-[0_18px_28px_rgba(43,29,18,0.35)] [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={download}
          disabled={busy}
          className="rounded-full bg-bk-accent px-7 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
        >
          {busy ? "Preparing…" : "Download ticket"}
        </button>
        {children}
      </div>
      {failed && (
        <p className="text-xs text-red-700">
          Could not create the file. Please try again.
        </p>
      )}
    </div>
  );
}
