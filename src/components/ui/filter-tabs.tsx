// Row of pill tabs with counts, e.g. All (23) | Booked (11) | On hold (6).
export type FilterTab<T extends string> = {
  id: T;
  label: string;
  count?: number;
};

export default function FilterTabs<T extends string>({
  tabs,
  value,
  onChange,
  label = "Filter",
}: {
  tabs: FilterTab<T>[];
  value: T;
  onChange: (id: T) => void;
  label?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-accent text-accent-ink"
                : "border border-line text-ink-muted hover:border-ink hover:text-ink"
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="opacity-70"> ({t.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
