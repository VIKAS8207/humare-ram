"use client";

import { useEffect, useRef, useState } from "react";

// Three-dots button that opens a small menu. The menu is fixed-positioned so a
// scrolling table never clips it. Closes on outside click, Esc, scroll, resize.
export type MenuItem = {
  label: string;
  onSelect: () => void;
  danger?: boolean;
};

export default function ActionMenu({
  items,
  label = "Actions",
}: {
  items: MenuItem[];
  label?: string;
}) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btn.current?.contains(t)) return;
      if (!(t as Element).closest?.("[data-action-menu]")) close();
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
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={Boolean(pos)}
        onClick={toggle}
        className={`grid size-9 place-content-center rounded-full text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink ${pos ? "bg-ink/5 text-ink" : ""}`}
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
          data-action-menu
          role="menu"
          style={{ top: pos.top, right: pos.right }}
          className="fixed z-40 min-w-48 overflow-hidden rounded-xl border border-line bg-paper-raised p-1.5 shadow-2xl shadow-ink/20"
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
                    ? "text-danger-strong hover:bg-danger/10"
                    : "text-ink/80 hover:bg-ink/5 hover:text-ink"
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
