export const STEPS = ["Date & Time", "Seats", "Review & Pay"] as const;

type Props = {
  step: number;
  onStepClick: (index: number) => void;
  /** Custom step names (default: the public booking steps) */
  steps?: readonly string[];
};

// Numbered progress bar. Completed steps are clickable to go back.
export default function Stepper({ step, onStepClick, steps = STEPS }: Props) {
  return (
    <ol
      className="flex items-center gap-2 md:gap-4"
      aria-label="Booking progress"
    >
      {steps.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 md:gap-4">
            <button
              type="button"
              disabled={!done}
              onClick={() => onStepClick(i)}
              aria-current={active ? "step" : undefined}
              className="group flex items-center gap-3 text-left disabled:cursor-default"
            >
              <span
                className={`grid size-8 shrink-0 place-content-center rounded-full border text-sm font-semibold transition-colors ${
                  active
                    ? "border-bk-accent bg-bk-accent text-bk-accent-ink"
                    : done
                      ? "border-bk-accent text-bk-ink group-hover:bg-bk-accent/10"
                      : "border-bk-line text-bk-muted"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={`hidden text-xs font-medium uppercase tracking-[0.2em] md:block ${
                  active
                    ? "text-bk-ink"
                    : done
                      ? "text-bk-ink"
                      : "text-bk-muted"
                }`}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={`h-px flex-1 ${done ? "bg-bk-gold/10" : "bg-bk-line"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
