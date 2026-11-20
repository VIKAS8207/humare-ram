"use client";

import { useEffect } from "react";

// Centered popup over the whole screen. Click outside or press Esc to close.
export default function Modal({
  title,
  onClose,
  children,
  size = "md",
  showClose = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
  /** Show a ✕ button in the header */
  showClose?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const width =
    size === "xl" ? "max-w-3xl" : size === "lg" ? "max-w-lg" : "max-w-md";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`max-h-[90vh] w-full overflow-auto rounded-2xl border border-line bg-paper-raised p-6 shadow-2xl ${width}`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-ink-muted transition-colors hover:text-ink"
            >
              ✕
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
