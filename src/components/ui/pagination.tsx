"use client";

import Select from "./select";

// Table footer: "Showing 11-20 of 27", rows-per-page dropdown on the left and
// "Page 2 of 3  Previous 1 2 3 Next" on the right.

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

const navButton =
  "rounded-full border border-line px-4 py-2 font-medium transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line";

export default function Pagination({
  page,
  pageSize,
  total,
  onPage,
  onPageSize,
}: {
  /** 1-based, already clamped to the last page */
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = Math.min(total, start + pageSize);

  return (
    <div className="flex flex-col gap-4 border-t border-line px-5 py-4 text-sm md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <p className="text-ink-muted">
          Showing{" "}
          <span className="font-medium text-ink">
            {total === 0 ? 0 : start + 1}-{end}
          </span>{" "}
          of <span className="font-medium text-ink">{total}</span>
        </p>
        <div className="w-36">
          <Select
            aria-label="Rows per page"
            value={String(pageSize)}
            onChange={(v) => onPageSize(Number(v))}
            options={PAGE_SIZES}
            className="py-2! text-sm"
          />
        </div>
      </div>

      <nav
        aria-label="Pagination"
        className="flex flex-wrap items-center gap-1.5 md:justify-end"
      >
        <span className="mr-2 text-ink-muted">
          Page <span className="font-medium text-ink">{page}</span> of{" "}
          <span className="font-medium text-ink">{pages}</span>
        </span>
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className={navButton}
        >
          Previous
        </button>
        {pageList(page, pages).map((n, i) =>
          n === "gap" ? (
            <span key={`g${i}`} className="px-1.5 text-ink-muted">
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPage(n)}
              aria-current={n === page ? "page" : undefined}
              className={`grid size-9 place-content-center rounded-full font-medium tabular-nums transition-colors ${
                n === page
                  ? "bg-accent text-accent-ink"
                  : "text-ink/80 hover:bg-ink/5"
              }`}
            >
              {n}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page === pages}
          className={navButton}
        >
          Next
        </button>
      </nav>
    </div>
  );
}
