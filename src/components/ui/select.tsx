"use client";

import { useEffect, useId, useRef, useState } from "react";

export type SelectOption = { value: string; label: string; hint?: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  invalid?: boolean;
  /** Extra classes for the button (e.g. width) */
  className?: string;
  "aria-label"?: string;
};

// Custom dropdown (replaces the native <select>): own arrow, own list, themed
// with the booking palette. Keyboard: arrows move, Enter/Space picks, Esc closes.
export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  invalid = false,
  className = "",
  "aria-label": ariaLabel,
}: Props) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  const openList = () => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const pick = (i: number) => {
    const o = options[i];
    if (!o) return;
    onChange(o.value);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "Tab") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return openList();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a + step + options.length) % options.length);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) return openList();
      pick(active);
    }
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-bk-surface px-4 py-3 text-left text-base outline-none transition-colors focus-visible:border-bk-accent ${
          open
            ? "border-bk-accent"
            : invalid
              ? "border-red-600"
              : "border-bk-line"
        } ${selected ? "text-bk-ink" : "text-bk-muted/70"} ${className}`}
      >
        <span className="truncate">
          {selected ? selected.label : placeholder}
        </span>
        {/* Arrow: its own box, so it is exactly centred vertically */}
        <span
          aria-hidden
          className="grid size-5 shrink-0 place-content-center text-bk-muted"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`block transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M2.5 4.5 6 8l3.5-3.5" />
          </svg>
        </span>
      </button>

      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="absolute left-0 right-0 top-full z-40 mt-2 max-h-64 overflow-auto rounded-xl border border-bk-line bg-bk-surface p-1.5 shadow-2xl shadow-bk-ink/20"
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isSelected
                    ? "bg-bk-accent text-bk-accent-ink"
                    : i === active
                      ? "bg-bk-ink/5 text-bk-ink"
                      : "text-bk-ink/80"
                }`}
              >
                <span>{o.label}</span>
                {o.hint && (
                  <span
                    className={`text-xs ${isSelected ? "opacity-80" : "text-bk-muted"}`}
                  >
                    {o.hint}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
