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
    <ol className="flex items-start" aria-label="Booking progress">
      {steps.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="relative flex flex-1 justify-center">
            {/* Line from this circle's centre to the next one's */}
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={`absolute left-1/2 top-4 h-px w-full ${done ? "bg-bk-accent/50" : "bg-bk-line"}`}
              />
            )}
            <button
              type="button"
              disabled={!done}
              onClick={() => onStepClick(i)}
              aria-current={active ? "step" : undefined}
              className="group relative flex flex-col items-center gap-2 text-center disabled:cursor-default"
            >
              <span
                className={`grid size-8 shrink-0 place-content-center rounded-full border text-sm font-semibold transition-colors ${
                  active
                    ? "border-bk-accent bg-bk-accent text-bk-accent-ink"
                    : done
                      ? "border-bk-accent bg-bk-bg text-bk-ink group-hover:bg-bk-accent/10"
                      : "border-bk-line bg-bk-bg text-bk-muted"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={`text-[0.65rem] font-medium uppercase tracking-[0.15em] md:text-xs md:tracking-[0.2em] ${
                  active || done ? "text-bk-ink" : "text-bk-muted"
                }`}
              >
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
