"use client";

import { useMemo, useState } from "react";
import {
  ActionMenu,
  Button,
  FilterTabs,
  Modal,
  Pagination,
  Pill,
  SearchInput,
  type ButtonVariant,
  type PillTone,
} from "@/components/ui";
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

const ACTION_VARIANT: Record<
  NonNullable<TableAction["tone"]>,
  ButtonVariant
> = { default: "outline", primary: "primary", danger: "danger" };

export const STATUS: Record<SeatRecordType, { label: string; tone: PillTone }> =
  {
    block: { label: "Booked", tone: "ok" },
    reserve: { label: "Reserved", tone: "bronze" },
    hold: { label: "On hold", tone: "accent" },
  };

type Filter = "all" | SeatRecordType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "block", label: "Booked" },
  { id: "hold", label: "On hold" },
  { id: "reserve", label: "Reserved" },
];

/** Payment state shown in the table */
export function paymentState(r: SeatRecord) {
  if (r.type === "hold") return { label: "Pending", className: "text-accent" };
  if (r.type === "reserve" && !r.paymentMode)
    return { label: "Not paid", className: "text-ink-muted" };
  return { label: "Paid", className: "text-ok-strong" };
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

const th =
  "px-5 py-3.5 text-left text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-muted";
const td = "px-5 py-4 align-middle";

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
  initialFilter?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
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
  const visible = rows.slice((current - 1) * pageSize, current * pageSize);

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
        <FilterTabs
          label="Filter tickets"
          value={filter}
          onChange={(id) => {
            setFilter(id);
            setPage(1);
          }}
          tabs={FILTERS.map((f) => ({
            ...f,
            count:
              f.id === "all"
                ? records.length
                : records.filter((r) => r.type === f.id).length,
          }))}
        />
        <SearchInput
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
          placeholder="Search ticket, name, phone, seat…"
          label="Search tickets"
        />
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-muted">
          {records.length === 0 ? emptyText : "No tickets match your search."}
        </p>
      ) : (
        <div className="rounded-2xl border border-line bg-paper-raised shadow-[0_1px_0_rgba(43,29,18,0.04)]">
          <div className="overflow-x-auto rounded-t-2xl">
            <table className="w-full min-w-184 border-collapse text-sm">
              <thead className="border-b border-line bg-ink/[0.035]">
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
              <tbody className="divide-y divide-line">
                {visible.map((r) => {
                  const st = STATUS[r.type];
                  const pay = paymentState(r);
                  return (
                    <tr
                      key={r.id}
                      className="transition-colors hover:bg-ink/2.5"
                    >
                      <td
                        className={`${td} whitespace-nowrap font-mono text-[0.8rem] font-semibold`}
                      >
                        {r.id}
                      </td>
                      <td className={td}>
                        <Pill tone={st.tone}>{st.label}</Pill>
                      </td>
                      <td className={`${td} font-medium`}>{r.person.name}</td>
                      <td className={`${td} whitespace-nowrap text-ink/80`}>
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
                      <td className={`${td} text-ink/80`}>{r.adminName}</td>
                      <td className={`${td} text-right`}>
                        <ActionMenu
                          label="Ticket actions"
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

          <Pagination
            page={current}
            pageSize={pageSize}
            total={rows.length}
            onPage={setPage}
            onPageSize={(n) => {
              setPageSize(n);
              setPage(1);
            }}
          />
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
          <dl className="flex flex-col divide-y divide-line text-sm">
            {detailRows(viewed).map(([label, value]) => (
              <div key={label} className="flex justify-between gap-6 py-3">
                <dt className="text-ink-muted">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" grow onClick={() => setViewing(null)}>
              Close
            </Button>
            {actions(viewed).map((a) => (
              <Button
                key={a.label}
                variant={ACTION_VARIANT[a.tone ?? "default"]}
                grow
                onClick={() => {
                  setViewing(null);
                  a.onSelect(viewed);
                }}
              >
                {a.label}
              </Button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
