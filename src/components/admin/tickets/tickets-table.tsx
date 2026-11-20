"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "@/components/ui/modal";
import Select from "@/components/ui/select";
import { VENUES } from "@/components/booking/booking.data";
import { dateParts, formatTime, inr } from "@/components/booking/booking.utils";
import type { SeatRecord, SeatRecordType } from "@/lib/seat-store";

// One ticket table used by the Dashboard and the Cancel page: filter tabs,
// search, rows with a ⋮ menu, a details popup and pagination. What the menu /
// popup can DO (cancel, view ticket, mark paid…) is passed in as `actions`.

export type TableAction = {
  label: string;
  onSelect: (record: SeatRecord) => void;
  tone?: "default" | "primary" | "danger";
};

export const STATUS: Record<
  SeatRecordType,
  { label: string; className: string }
> = {
  block: {
    label: "Booked",
    className: "border-green-700/30 bg-green-700/10 text-green-800",
  },
  reserve: {
    label: "Reserved",
    className: "border-bk-gold/40 bg-bk-gold/10 text-bk-gold",
  },
  hold: {
    label: "On hold",
    className: "border-bk-accent/30 bg-bk-accent/10 text-bk-accent",
  },
};

const FILTERS: { id: "all" | SeatRecordType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "block", label: "Booked" },
  { id: "hold", label: "On hold" },
  { id: "reserve", label: "Reserved" },
];

/** Payment state shown in the table */
export function paymentState(r: SeatRecord) {
  if (r.type === "hold")
    return { label: "Pending", className: "text-bk-accent" };
  if (r.type === "reserve" && !r.paymentMode)
    return { label: "Not paid", className: "text-bk-muted" };
  return { label: "Paid", className: "text-green-800" };
}

const fmtWhen = (ms: number) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ms));

const showShort = (r: SeatRecord) => {
  const p = dateParts(r.date);
  return `${p.weekday}, ${p.day} ${p.month} · ${formatTime(r.time)}`;
};

const PAGE_SIZES = [10, 25, 50].map((n) => ({
  value: String(n),
  label: `${n} per page`,
}));

/** Page numbers with "…" gaps, e.g. 1 … 4 5 6 … 12 */
function pageList(page: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "gap")[] = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(total - 1, page + 1);
  if (from > 2) out.push("gap");
  for (let i = from; i <= to; i++) out.push(i);
  if (to < total - 1) out.push("gap");
  out.push(total);
  return out;
}

const th =
  "px-5 py-3.5 text-left text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-bk-muted";
const td = "px-5 py-4 align-middle";

const toneClass = {
  default:
    "border border-bk-line text-bk-ink hover:border-bk-ink bg-transparent",
  primary: "bg-bk-accent text-white",
  danger: "bg-red-600 text-white",
} as const;

// ── ⋮ menu (fixed position so the table never clips it) ──────────────────────
function RowMenu({
  items,
}: {
  items: { label: string; onSelect: () => void; danger?: boolean }[];
}) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btn.current?.contains(t)) return;
      if (!(t as Element).closest?.("[data-row-menu]")) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [pos]);

  const toggle = () => {
    if (pos) return setPos(null);
    const r = btn.current!.getBoundingClientRect();
    setPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
  };

  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-label="Ticket actions"
        aria-haspopup="menu"
        aria-expanded={Boolean(pos)}
        onClick={toggle}
        className={`grid size-9 place-content-center rounded-full text-bk-muted transition-colors hover:bg-bk-ink/5 hover:text-bk-ink ${pos ? "bg-bk-ink/5 text-bk-ink" : ""}`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="currentColor"
          aria-hidden
        >
          <circle cx="9" cy="3.5" r="1.5" />
          <circle cx="9" cy="9" r="1.5" />
          <circle cx="9" cy="14.5" r="1.5" />
        </svg>
      </button>
      {pos && (
        <ul
          data-row-menu
          role="menu"
          style={{ top: pos.top, right: pos.right }}
          className="fixed z-40 min-w-48 overflow-hidden rounded-xl border border-bk-line bg-bk-surface p-1.5 shadow-2xl shadow-bk-ink/20"
        >
          {items.map((it) => (
            <li key={it.label} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setPos(null);
                  it.onSelect();
                }}
                className={`block w-full whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  it.danger
                    ? "text-red-700 hover:bg-red-600/10"
                    : "text-bk-ink/80 hover:bg-bk-ink/5 hover:text-bk-ink"
                }`}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function TicketsTable({
  records,
  actions,
  emptyText = "No tickets yet. Booked, reserved and held seats appear here.",
  initialFilter = "all",
}: {
  records: SeatRecord[];
  /** Extra things you can do with a ticket (shown in the ⋮ menu and the popup) */
  actions: (record: SeatRecord) => TableAction[];
  emptyText?: string;
  initialFilter?: "all" | SeatRecordType;
}) {
  const [filter, setFilter] = useState<"all" | SeatRecordType>(initialFilter);
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<SeatRecord | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((r) => {
      if (filter !== "all" && r.type !== filter) return false;
      if (!q) return true;
      return [
        r.id,
        r.person.name,
        r.person.phone,
        r.adminName,
        r.seats.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [records, filter, query]);

  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pages); // e.g. last row of the last page removed
  const start = (current - 1) * pageSize;
  const visible = rows.slice(start, start + pageSize);

  // Keep the popup in sync if the record changes (e.g. hold → booked)
  const viewed = viewing
    ? (records.find((r) => r.id === viewing.id) ?? null)
    : null;

  const detailRows = (r: SeatRecord): [string, string][] => {
    const venue = VENUES.find((v) => v.id === r.venueId);
    const extra = (label: string, value?: string): [string, string][] =>
      value ? [[label, value]] : [];
    return [
      ["Ticket number", r.id],
      ["Status", STATUS[r.type].label],
      ["Booked for", r.person.name],
      ["Phone", r.person.phone],
      ...extra("Email", r.person.email),
      ["Show", `${dateParts(r.date).long}, ${formatTime(r.time)}`],
      ["Venue", venue ? `${venue.name}, ${venue.city}` : "—"],
      ["Seats", `${r.seats.join(", ")} (${r.seats.length})`],
      [
        "Amount",
        r.type === "reserve" && !r.amount ? "Complimentary" : inr(r.amount),
      ],
      [
        "Payment",
        paymentState(r).label + (r.paymentMode ? ` · ${r.paymentMode}` : ""),
      ],
      ...extra("Note", r.person.note),
      ["Booked by", r.adminName],
      ["Created", fmtWhen(r.createdAt)],
      ...extra(
        "Moved to booked",
        r.convertedAt ? fmtWhen(r.convertedAt) : undefined,
      ),
    ];
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div
          role="tablist"
          aria-label="Filter tickets"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((f) => {
            const count =
              f.id === "all"
                ? records.length
                : records.filter((r) => r.type === f.id).length;
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setFilter(f.id);
                  setPage(1);
                }}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-bk-accent text-bk-accent-ink"
                    : "border border-bk-line text-bk-muted hover:border-bk-ink hover:text-bk-ink"
                }`}
              >
                {f.label} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search ticket, name, phone, seat…"
          aria-label="Search tickets"
          className="w-full rounded-full border border-bk-line bg-bk-surface px-5 py-2.5 text-sm text-bk-ink outline-none transition-colors placeholder:text-bk-muted/60 focus:border-bk-accent md:max-w-xs"
        />
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-bk-line p-8 text-center text-sm text-bk-muted">
          {records.length === 0 ? emptyText : "No tickets match your search."}
        </p>
      ) : (
        <div className="rounded-2xl border border-bk-line bg-bk-surface shadow-[0_1px_0_rgba(43,29,18,0.04)]">
          <div className="overflow-x-auto rounded-t-2xl">
            <table className="w-full min-w-184 border-collapse text-sm">
              <thead className="border-b border-bk-line bg-bk-ink/[0.035]">
                <tr>
                  <th className={th}>Ticket</th>
                  <th className={th}>Status</th>
                  <th className={th}>Booked for</th>
                  <th className={th}>Show</th>
                  <th className={`${th} text-center`}>Seats</th>
                  <th className={th}>Amount</th>
                  <th className={th}>Booked by</th>
                  <th className={`${th} w-16 text-right`}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bk-line">
                {visible.map((r) => {
                  const st = STATUS[r.type];
                  const pay = paymentState(r);
                  return (
                    <tr
                      key={r.id}
                      className="transition-colors hover:bg-bk-ink/2.5"
                    >
                      <td
                        className={`${td} whitespace-nowrap font-mono text-[0.8rem] font-semibold`}
                      >
                        {r.id}
                      </td>
                      <td className={td}>
                        <span
                          className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${st.className}`}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className={`${td} font-medium`}>{r.person.name}</td>
                      <td className={`${td} whitespace-nowrap text-bk-ink/80`}>
                        {showShort(r)}
                      </td>
                      <td
                        className={`${td} text-center font-medium tabular-nums`}
                      >
                        {r.seats.length}
                      </td>
                      <td
                        className={`${td} whitespace-nowrap font-medium ${pay.className}`}
                      >
                        {pay.label}
                      </td>
                      <td className={`${td} text-bk-ink/80`}>{r.adminName}</td>
                      <td className={`${td} text-right`}>
                        <RowMenu
                          items={[
                            {
                              label: "View details",
                              onSelect: () => setViewing(r),
                            },
                            ...actions(r).map((a) => ({
                              label: a.label,
                              danger: a.tone === "danger",
                              onSelect: () => a.onSelect(r),
                            })),
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-bk-line px-5 py-4 text-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <p className="text-bk-muted">
                Showing{" "}
                <span className="font-medium text-bk-ink">
                  {start + 1}–{start + visible.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-bk-ink">{rows.length}</span>
              </p>
              <div className="w-36">
                <Select
                  aria-label="Rows per page"
                  value={String(pageSize)}
                  onChange={(v) => {
                    setPageSize(Number(v));
                    setPage(1);
                  }}
                  options={PAGE_SIZES}
                  className="py-2! text-sm"
                />
              </div>
            </div>
            <nav
              aria-label="Pagination"
              className="flex flex-wrap items-center gap-1.5 md:justify-end"
            >
              <span className="mr-2 text-bk-muted">
                Page <span className="font-medium text-bk-ink">{current}</span>{" "}
                of <span className="font-medium text-bk-ink">{pages}</span>
              </span>
              <button
                type="button"
                onClick={() => setPage(current - 1)}
                disabled={current === 1}
                className="rounded-full border border-bk-line px-4 py-2 font-medium transition-colors hover:border-bk-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-bk-line"
              >
                Previous
              </button>
              {pageList(current, pages).map((n, i) =>
                n === "gap" ? (
                  <span key={`g${i}`} className="px-1.5 text-bk-muted">
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={n === current ? "page" : undefined}
                    className={`grid size-9 place-content-center rounded-full font-medium tabular-nums transition-colors ${
                      n === current
                        ? "bg-bk-accent text-bk-accent-ink"
                        : "text-bk-ink/80 hover:bg-bk-ink/5"
                    }`}
                  >
                    {n}
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={() => setPage(current + 1)}
                disabled={current === pages}
                className="rounded-full border border-bk-line px-4 py-2 font-medium transition-colors hover:border-bk-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-bk-line"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* All the details, with the same actions inside */}
      {viewed && (
        <Modal
          title="Ticket details"
          size="lg"
          showClose
          onClose={() => setViewing(null)}
        >
          <dl className="flex flex-col divide-y divide-bk-line text-sm">
            {detailRows(viewed).map(([label, value]) => (
              <div key={label} className="flex justify-between gap-6 py-3">
                <dt className="text-bk-muted">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setViewing(null)}
              className={`flex-1 rounded-full px-6 py-3 font-medium transition-colors ${toneClass.default}`}
            >
              Close
            </button>
            {actions(viewed).map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => {
                  setViewing(null);
                  a.onSelect(viewed);
                }}
                className={`flex-1 whitespace-nowrap rounded-full px-6 py-3 font-semibold ${toneClass[a.tone ?? "default"]}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
