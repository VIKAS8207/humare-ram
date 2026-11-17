"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  GROUP_BOOKING_CONTACT,
  MAX_SEATS,
  SEAT_CATEGORIES,
} from "../booking.data";
import { categoryOfSeat, inr, isSeatTaken, sortSeats } from "../booking.utils";
import {
  PLAN_HEIGHT,
  PLAN_WIDTH,
  ROW_LABELS,
  ROW_ORDER,
  SEATS,
  SEAT_RADIUS,
  STAGE,
} from "../seat-layout";

type Props = {
  showKey: string;
  quantity: number | null;
  seats: string[];
  onQuantity: (n: number) => void;
  onSeats: (seats: string[]) => void;
};

const ZOOMS = [1, 1.5, 2, 3, 4];

// Picks N seats next to each other, as close to the stage centre as possible.
function bestAvailable(showKey: string, n: number): string[] {
  for (const row of ROW_ORDER) {
    const rowSeats = SEATS.filter((s) => s.row === row).sort(
      (a, b) => a.x - b.x,
    );
    const mid = PLAN_WIDTH / 2;
    let best: { score: number; ids: string[] } | null = null;
    for (let i = 0; i + n <= rowSeats.length; i++) {
      const run = rowSeats.slice(i, i + n);
      const contiguous = run.every(
        (s, k) =>
          k === 0 || (s.x - run[k - 1].x < 24 && s.n === run[k - 1].n + 1),
      );
      if (!contiguous || run.some((s) => isSeatTaken(showKey, s.id))) continue;
      const centre = run.reduce((sum, s) => sum + s.x, 0) / n;
      const score = Math.abs(centre - mid);
      if (!best || score < best.score)
        best = { score, ids: run.map((s) => s.id) };
    }
    if (best) return best.ids;
  }
  return [];
}

function QuantityPicker({
  current,
  onPick,
  onClose,
}: {
  current: number | null;
  onPick: (n: number) => void;
  onClose?: () => void;
}) {
  const [n, setN] = useState(current ?? 2);
  const [groupOpen, setGroupOpen] = useState(false);
  const tel = GROUP_BOOKING_CONTACT.phone.replace(/[^+d]/g, "");

  const step =
    "grid size-12 place-content-center rounded-full border border-bk-line text-2xl transition-colors hover:border-bk-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-bk-line";

  return (
    <div
      className="absolute inset-0 z-10 grid place-items-start justify-items-center bg-bk-ink/40 p-4 pt-10 backdrop-blur-sm md:pt-16"
      role="dialog"
      aria-label="How many people?"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-bk-line bg-bk-surface p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-semibold tracking-tight">
            How many people?
          </h3>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-bk-muted transition-colors hover:text-bk-ink"
            >
              ✕
            </button>
          )}
        </div>

        {/* − 4 + */}
        <div className="mt-8 flex items-center justify-center gap-8">
          <button
            type="button"
            className={step}
            aria-label="Fewer people"
            disabled={n <= 1}
            onClick={() => setN((v) => Math.max(1, v - 1))}
          >
            −
          </button>
          <output
            aria-live="polite"
            className="w-16 text-center text-5xl font-semibold tabular-nums"
          >
            {n}
          </output>
          <button
            type="button"
            className={step}
            aria-label="More people"
            onClick={() =>
              n >= MAX_SEATS ? setGroupOpen(true) : setN((v) => v + 1)
            }
          >
            +
          </button>
        </div>

        <p className="mt-8 rounded-lg bg-bk-gold/10 px-4 py-3 text-sm text-bk-ink">
          You can book up to {MAX_SEATS} seats in this transaction.
        </p>

        <button
          type="button"
          onClick={() => onPick(n)}
          className="mt-5 w-full rounded-full bg-bk-accent px-6 py-3 text-sm font-semibold text-bk-accent-ink transition-transform hover:scale-[1.02]"
        >
          Select {n} seat{n > 1 ? "s" : ""}
        </button>

        {/* More than MAX_SEATS: point them to the group-booking contact */}
        {groupOpen && (
          <div
            role="alertdialog"
            aria-label="Group bookings"
            className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-bk-ink/50 p-4 backdrop-blur-[2px]"
          >
            <div className="flex w-full flex-col gap-4 rounded-xl border border-bk-line bg-bk-surface p-6 text-center shadow-xl">
              <h4 className="text-xl font-semibold tracking-tight">
                Booking for more than {MAX_SEATS}?
              </h4>
              <p className="text-sm text-bk-muted">
                For bookings of more than {MAX_SEATS} seats, please contact:
              </p>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {GROUP_BOOKING_CONTACT.name}
                </span>
                <a
                  href={`tel:${tel}`}
                  className="text-xl font-semibold text-bk-accent underline-offset-4 hover:underline"
                >
                  {GROUP_BOOKING_CONTACT.phone}
                </a>
                <a
                  href={`mailto:${GROUP_BOOKING_CONTACT.email}`}
                  className="text-sm text-bk-muted underline-offset-4 hover:underline"
                >
                  {GROUP_BOOKING_CONTACT.email}
                </a>
              </div>
              <button
                type="button"
                onClick={() => setGroupOpen(false)}
                className="rounded-full bg-bk-ink px-6 py-2.5 text-sm font-semibold text-bk-bg"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SeatsStep({
  showKey,
  quantity,
  seats,
  onQuantity,
  onSeats,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(quantity === null);
  const [zoom, setZoom] = useState(1);
  const scroller = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(1);
  const anchor = useRef({ x: 0.5, y: 0.5 });
  const dragMoved = useRef(false);

  // Zoom around the middle of what is currently visible
  const changeZoom = useCallback((next: number) => {
    const el = scroller.current;
    if (el && el.scrollWidth > 0) {
      anchor.current = {
        x: (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth,
        y: (el.scrollTop + el.clientHeight / 2) / el.scrollHeight,
      };
    }
    zoomRef.current = next;
    setZoom(next);
  }, []);
  const zoomStep = useCallback(
    (dir: 1 | -1) => {
      const i = ZOOMS.indexOf(zoomRef.current);
      changeZoom(ZOOMS[Math.min(Math.max(i + dir, 0), ZOOMS.length - 1)]);
    },
    [changeZoom],
  );

  // Keep the same part of the plan in view after the size changes
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollLeft = anchor.current.x * el.scrollWidth - el.clientWidth / 2;
    el.scrollTop = anchor.current.y * el.scrollHeight - el.clientHeight / 2;
  }, [zoom]);

  // Ctrl + wheel / trackpad pinch zooms the plan instead of the page
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let lock = false;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      if (lock) return;
      lock = true;
      setTimeout(() => (lock = false), 120);
      zoomStep(e.deltaY < 0 ? 1 : -1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomStep]);

  // Mouse: drag the plan to move around when zoomed in (scrollbars are hidden site-wide)
  const onPanStart = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    if (!el || e.pointerType !== "mouse" || zoomRef.current === 1) return;
    const start = {
      x: e.clientX,
      y: e.clientY,
      left: el.scrollLeft,
      top: el.scrollTop,
    };
    dragMoved.current = false;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) dragMoved.current = true;
      el.scrollLeft = start.left - dx;
      el.scrollTop = start.top - dy;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setTimeout(() => (dragMoved.current = false), 0); // after the click event
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const [notice, setNotice] = useState("");

  const selected = useMemo(() => new Set(seats), [seats]);
  const remaining = quantity === null ? 0 : quantity - seats.length;

  const toggle = (id: string) => {
    if (quantity === null || isSeatTaken(showKey, id)) return;
    if (selected.has(id)) {
      setNotice("");
      onSeats(seats.filter((s) => s !== id));
      return;
    }
    if (seats.length >= quantity) {
      setNotice(
        `You chose ${quantity} seat${quantity > 1 ? "s" : ""}. Deselect one to pick another.`,
      );
      return;
    }
    setNotice("");
    onSeats([...seats, id]);
  };

  const pick = (n: number) => {
    onQuantity(n);
    setPickerOpen(false);
    setNotice("");
  };

  const suggest = () => {
    if (quantity === null) return;
    const ids = bestAvailable(showKey, quantity);
    setNotice(
      ids.length
        ? ""
        : "No block of seats together is free. Please pick seats on the plan.",
    );
    if (ids.length) onSeats(ids);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Select your seats
        </h2>
        <p className="text-bk-muted" aria-live="polite">
          {quantity === null
            ? "First tell us how many people are coming."
            : remaining > 0
              ? `Pick ${remaining} more seat${remaining > 1 ? "s" : ""} (${seats.length} of ${quantity} selected).`
              : `All ${quantity} seat${quantity > 1 ? "s" : ""} selected: ${sortSeats(seats).join(", ")}`}
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="rounded-full bg-bk-ink px-5 py-2.5 text-sm font-semibold text-bk-bg"
        >
          {quantity === null
            ? "Choose quantity"
            : `${quantity} seat${quantity > 1 ? "s" : ""}`}
        </button>
        <button
          type="button"
          onClick={suggest}
          disabled={quantity === null}
          className="rounded-full border border-bk-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-bk-accent/50 disabled:opacity-40"
        >
          Best available
        </button>
        {seats.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setNotice("");
              onSeats([]);
            }}
            className="px-2 text-sm text-bk-muted underline-offset-4 hover:text-bk-ink hover:underline"
          >
            Clear
          </button>
        )}

        {/* Zoom: always visible next to the other controls */}
        <div
          className="ml-auto flex items-center gap-1"
          role="group"
          aria-label="Zoom"
        >
          <button
            type="button"
            aria-label="Zoom out"
            disabled={zoom <= ZOOMS[0]}
            onClick={() => zoomStep(-1)}
            className="grid size-10 place-content-center rounded-full border border-bk-line text-xl transition-colors hover:border-bk-accent disabled:opacity-30 disabled:hover:border-bk-line"
          >
            −
          </button>
          <button
            type="button"
            aria-label="Reset zoom"
            disabled={zoom === 1}
            onClick={() => changeZoom(1)}
            className="w-14 text-center text-xs font-semibold tabular-nums text-bk-muted transition-colors hover:text-bk-ink disabled:hover:text-bk-muted"
          >
            {zoom === 1 ? "Fit" : `${Math.round(zoom * 100)}%`}
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            disabled={zoom >= ZOOMS[ZOOMS.length - 1]}
            onClick={() => zoomStep(1)}
            className="grid size-10 place-content-center rounded-full border border-bk-line text-xl transition-colors hover:border-bk-accent disabled:opacity-30 disabled:hover:border-bk-line"
          >
            +
          </button>
        </div>
      </div>

      {notice && (
        <p role="status" className="text-sm text-bk-ink">
          {notice}
        </p>
      )}

      {/* Price legend */}
      <ul
        className="flex flex-wrap gap-x-6 gap-y-3 text-sm"
        aria-label="Prices"
      >
        {SEAT_CATEGORIES.map((c) => (
          <li key={c.id} className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-3.5 rounded-full"
              style={{ background: c.color }}
            />
            {c.name} <span className="text-bk-muted">{inr(c.price)}</span>
          </li>
        ))}
        <li className="flex items-center gap-2 text-bk-muted">
          <span aria-hidden className="size-3.5 rounded-full bg-bk-line" />
          Sold
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-3.5 rounded-full bg-bk-ink ring-2 ring-bk-accent"
          />
          Selected
        </li>
      </ul>

      {/* Seat plan */}
      <div className="relative rounded-2xl border border-bk-line bg-bk-surface">
        {/* Whole plan visible at 1x; scrolls inside its box once zoomed in */}
        <div
          ref={scroller}
          onPointerDown={onPanStart}
          className={`overflow-auto p-2 md:p-4 ${zoom > 1 ? "max-h-[70vh] cursor-grab active:cursor-grabbing" : ""}`}
        >
          <svg
            viewBox={`0 0 ${PLAN_WIDTH} ${PLAN_HEIGHT}`}
            role="group"
            aria-label="Seat plan, stage at the bottom"
            style={{ width: `${zoom * 100}%`, minWidth: 640 * zoom }}
            className="mx-auto block select-none"
          >
            {/* Row letters */}
            {ROW_LABELS.map((l, i) => (
              <text
                key={i}
                x={l.x}
                y={l.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fill="rgba(43,29,18,0.55)"
              >
                {l.row}
              </text>
            ))}

            {/* Seats */}
            {SEATS.map((s) => {
              const taken = isSeatTaken(showKey, s.id);
              const isSel = selected.has(s.id);
              const cat = categoryOfSeat(s.id);
              return (
                <circle
                  key={s.id}
                  cx={s.x}
                  cy={s.y}
                  r={isSel ? SEAT_RADIUS + 0.8 : SEAT_RADIUS}
                  fill={
                    taken
                      ? "rgba(43,29,18,0.14)"
                      : isSel
                        ? "#2b1d12"
                        : cat.color
                  }
                  fillOpacity={taken || isSel ? 1 : 0.8}
                  stroke={isSel ? "#b8431a" : "none"}
                  strokeWidth={isSel ? 2.2 : 0}
                  role="checkbox"
                  aria-checked={isSel}
                  aria-disabled={taken}
                  aria-label={`Row ${s.row} seat ${s.n}, ${cat.name}, ${inr(cat.price)}${taken ? ", sold" : ""}`}
                  className={
                    taken
                      ? "cursor-not-allowed"
                      : "cursor-pointer hover:opacity-100"
                  }
                  onClick={() => !dragMoved.current && toggle(s.id)}
                >
                  <title>{`${s.id} · ${cat.name} · ${inr(cat.price)}${taken ? " · Sold" : ""}`}</title>
                </circle>
              );
            })}

            {/* Stage */}
            <rect
              x={STAGE.x}
              y={STAGE.y}
              width={STAGE.width}
              height={STAGE.height}
              rx="4"
              fill="rgba(43,29,18,0.05)"
              stroke="rgba(251,146,60,0.7)"
              strokeWidth="1.5"
            />
            <text
              x={STAGE.x + STAGE.width / 2}
              y={STAGE.y + STAGE.height / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="13"
              letterSpacing="6"
              fill="rgba(43,29,18,0.75)"
            >
              STAGE
            </text>
          </svg>
        </div>

        {pickerOpen && (
          <QuantityPicker
            current={quantity}
            onPick={pick}
            onClose={quantity !== null ? () => setPickerOpen(false) : undefined}
          />
        )}
      </div>
    </div>
  );
}
