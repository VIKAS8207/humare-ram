// Dashboard number card: label, big value, small note, coloured left edge.
const EDGES = {
  gold: "bg-bronze",
  good: "bg-ok",
  warn: "bg-accent",
} as const;

export default function StatCard({
  label,
  value,
  note,
  tone = "gold",
}: {
  label: string;
  value: string;
  note: string;
  tone?: keyof typeof EDGES;
}) {
  return (
    <div className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-line bg-paper-raised p-4 md:gap-3 md:p-5">
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${EDGES[tone]}`}
      />
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink-muted md:text-[0.68rem] md:tracking-[0.18em]">
        {label}
      </span>
      <span className="text-xl font-semibold leading-none tracking-tight tabular-nums md:text-3xl">
        {value}
      </span>
      <span className="text-xs text-ink-muted md:text-sm">{note}</span>
    </div>
  );
}
