"use client";

import { SEAT_COLORS } from "@/config/palette";
import { Button } from "@/components/ui";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BOOKMYSHOW_URL,
  GROUP_BOOKING_CONTACT,
  MAX_SEATS,
  SEAT_CATEGORIES,
} from "../booking.data";
import { categoryOfSeat, inr, isSeatTaken, sortSeats } from "../booking.utils";
import {
  type SeatPos,
  PLAN_HEIGHT,
  PLAN_WIDTH,
  ROW_LABELS,
  ROW_ORDER,
  SEATS,
  SEAT_BY_ID,
  SEAT_PITCH,
  STAGE,
} from "../seat-layout";
import { SeatIcon, SeatSymbol } from "../seat-icon";

type Props = {
  showKey: string;
  quantity: number | null;
  seats: string[];
  onQuantity: (n: number) => void;
  onSeats: (seats: string[]) => void;
  /** Seats already taken by blocks / holds / reservations (on top of the sample "sold" ones) */
  extraTaken?: ReadonlySet<string>;
  /** Most seats one booking may have (default: the public limit) */
  maxSeats?: number;
  /** Public site: past the limit, show the "contact us for groups" popup */
  groupContact?: boolean;
};

// Selected seats: plain green, no border
const SELECTED_COLOR = SEAT_COLORS.selected;

// Seat icon size on the plan (plan units); seats are 16.8 apart
const SEAT_SIZE = 15;

const ZOOMS = [1, 1.5, 2, 3, 4];

// Picks N seats next to each other, as close to the stage centre as possible.
// Only seats sold on this site (bookable) are considered.
function bestAvailable(isTaken: (id: string) => boolean, n: number): string[] {
  for (const row of ROW_ORDER) {
    const rowSeats = SEATS.filter((s) => s.row === row && s.bookable).sort(
      (a, b) => a.x - b.x,
    );
    const mid = PLAN_WIDTH / 2;
    let best: { score: number; ids: string[] } | null = null;
    for (let i = 0; i + n <= rowSeats.length; i++) {
      const run = rowSeats.slice(i, i + n);
      const contiguous = run.every(
        (s, k) =>
          k === 0 ||
          (s.x - run[k - 1].x < SEAT_PITCH * 1.5 && s.n === run[k - 1].n - 1),
      );
      if (!contiguous || run.some((s) => isTaken(s.id))) continue;
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
  max,
  groupContact,
}: {
  current: number | null;
  onPick: (n: number) => void;
  onClose?: () => void;
  max: number;
  groupContact: boolean;
}) {
  const [n, setN] = useState(current ?? 2);
  const [groupOpen, setGroupOpen] = useState(false);
  const tel = GROUP_BOOKING_CONTACT.phone.replace(/[^+\d]/g, "");

  const step =
    "grid size-12 place-content-center rounded-full border border-line text-2xl transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-label="How many people?"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-paper-raised p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-semibold tracking-tight">
            How many people?
          </h3>
          {onClose && (
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
            disabled={n >= max && !groupContact}
            onClick={() =>
              n >= max ? groupContact && setGroupOpen(true) : setN((v) => v + 1)
            }
          >
            +
          </button>
        </div>

        <p className="mt-8 rounded-lg bg-bronze/10 px-4 py-3 text-sm text-ink">
          You can book up to {max} seats in this transaction.
        </p>

        <Button className="mt-5 w-full" onClick={() => onPick(n)}>
          Select {n} seat{n > 1 ? "s" : ""}
        </Button>

        {/* More than the limit: point them to the group-booking contact */}
        {groupOpen && (
          <div
            role="alertdialog"
            aria-label="Group bookings"
            className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-ink/50 p-4 backdrop-blur-[2px]"
          >
            <div className="flex w-full flex-col gap-4 rounded-xl border border-line bg-paper-raised p-6 text-center shadow-xl">
              <h4 className="text-xl font-semibold tracking-tight">
                Booking for more than {max}?
              </h4>
              <p className="text-sm text-ink-muted">
                For bookings of more than {max} seats, please contact:
              </p>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {GROUP_BOOKING_CONTACT.name}
                </span>
                <a
                  href={`tel:${tel}`}
                  className="text-xl font-semibold text-accent underline-offset-4 hover:underline"
                >
                  {GROUP_BOOKING_CONTACT.phone}
                </a>
                <a
                  href={`mailto:${GROUP_BOOKING_CONTACT.email}`}
                  className="text-sm text-ink-muted underline-offset-4 hover:underline"
                >
                  {GROUP_BOOKING_CONTACT.email}
                </a>
              </div>
              <Button
                variant="dark"
                size="sm"
                onClick={() => setGroupOpen(false)}
              >
                Got it
              </Button>
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
  extraTaken,
  maxSeats = MAX_SEATS,
  groupContact = true,
}: Props) {
  const isTaken = (id: string) =>
    isSeatTaken(showKey, id) || Boolean(extraTaken?.has(id));
  const [pickerOpen, setPickerOpen] = useState(quantity === null);
  const [zoom, setZoom] = useState(1);
  const scroller = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(1);
  const anchor = useRef({ x: 0.5, y: 0.5 });
  const dragMoved = useRef(false);
  // Which picked seat the next single tap replaces (counts down, then wraps)
  const swapSlot = useRef(0);

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

  // Seats not sold on this site: send the visitor to BookMyShow (new tab, so
  // the seats picked here are kept)
  const goToBookMyShow = () => {
    window.open(BOOKMYSHOW_URL, "_blank", "noopener,noreferrer");
    setNotice(
      "Those seats are sold on BookMyShow. We opened it in a new tab for you.",
    );
  };

  // Like the ticket apps: the first tap selects the whole group of seats
  // together (next to it, same row, same block). Every tap after that moves one
  // seat: the last picked seat is dropped and the tapped seat takes its place.
  // Tapping a selected seat clears the selection.
  const toggle = (id: string) => {
    if (quantity === null || isTaken(id)) return;
    if (selected.has(id)) {
      setNotice("");
      onSeats([]);
      return;
    }
    // Seats already picked: each single tap replaces one seat, starting from
    // the last (5th), then the 4th, 3rd ... 1st, then the 5th again.
    if (seats.length > 0) {
      setNotice("");
      if (seats.length < quantity) {
        onSeats([...seats, id]);
        return;
      }
      const slot = Math.min(swapSlot.current, quantity - 1);
      const next = [...seats];
      next[slot] = id;
      swapSlot.current = slot === 0 ? quantity - 1 : slot - 1;
      onSeats(next);
      return;
    }
    const clicked = SEAT_BY_ID[id];
    const rowSeats = SEATS.filter(
      (s) => s.row === clicked.row && s.bookable,
    ).sort((a, b) => a.x - b.x);
    // Free seats joined to the clicked one, with no aisle or gap in between
    let lo = rowSeats.findIndex((s) => s.id === id);
    let hi = lo;
    const joined = (a: SeatPos, b: SeatPos) =>
      Math.abs(b.x - a.x) < SEAT_PITCH * 1.5 && !isTaken(b.id);
    while (lo > 0 && joined(rowSeats[lo], rowSeats[lo - 1])) lo--;
    while (hi < rowSeats.length - 1 && joined(rowSeats[hi], rowSeats[hi + 1]))
      hi++;
    const run = rowSeats.slice(lo, hi + 1);
    if (run.length < quantity) {
      // Not enough seats side by side: skip the taken seats (and aisles) and
      // take the next free seats in this row instead, starting at the tapped one
      const free = rowSeats.filter((s) => !isTaken(s.id));
      if (free.length < quantity) {
        setNotice(
          `Only ${free.length} seat${free.length === 1 ? " is" : "s are"} free in row ${clicked.row}. Pick another row.`,
        );
        return;
      }
      const from = Math.min(
        free.findIndex((s) => s.id === id),
        free.length - quantity,
      );
      setNotice(
        "Seats were not free side by side, so we took the next free ones.",
      );
      swapSlot.current = quantity - 1;
      onSeats(free.slice(from, from + quantity).map((s) => s.id));
      return;
    }
    // Start at the tapped seat and go right; slide left if there is no room
    const at = rowSeats.findIndex((s) => s.id === id) - lo;
    const start = Math.min(at, run.length - quantity);
    setNotice("");
    swapSlot.current = quantity - 1;
    onSeats(run.slice(start, start + quantity).map((s) => s.id));
  };

  const pick = (n: number) => {
    onQuantity(n);
    setPickerOpen(false);
    setNotice("");
  };

  const suggest = () => {
    if (quantity === null) return;
    const ids = bestAvailable(isTaken, quantity);
    setNotice(
      ids.length
        ? ""
        : "No block of seats together is free. Please pick seats on the plan.",
    );
    if (ids.length) {
      swapSlot.current = quantity - 1;
      onSeats(ids);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Select your seats
        </h2>
        <p className="text-ink-muted" aria-live="polite">
          {quantity === null
            ? "First tell us how many people are coming."
            : remaining > 0
              ? `Pick ${remaining} more seat${remaining > 1 ? "s" : ""} (${seats.length} of ${quantity} selected).`
              : `All ${quantity} seat${quantity > 1 ? "s" : ""} selected: ${sortSeats(seats).join(", ")}`}
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="dark" size="sm" onClick={() => setPickerOpen(true)}>
          {quantity === null
            ? "Choose quantity"
            : `${quantity} seat${quantity > 1 ? "s" : ""}`}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={suggest}
          disabled={quantity === null}
        >
          Best available
        </Button>
        {seats.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setNotice("");
              onSeats([]);
            }}
            className="px-2 text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
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
            className="grid size-10 place-content-center rounded-full border border-line text-xl transition-colors hover:border-accent disabled:opacity-30 disabled:hover:border-line"
          >
            −
          </button>
          <button
            type="button"
            aria-label="Reset zoom"
            disabled={zoom === 1}
            onClick={() => changeZoom(1)}
            className="w-14 text-center text-xs font-semibold tabular-nums text-ink-muted transition-colors hover:text-ink disabled:hover:text-ink-muted"
          >
            {zoom === 1 ? "Fit" : `${Math.round(zoom * 100)}%`}
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            disabled={zoom >= ZOOMS[ZOOMS.length - 1]}
            onClick={() => zoomStep(1)}
            className="grid size-10 place-content-center rounded-full border border-line text-xl transition-colors hover:border-accent disabled:opacity-30 disabled:hover:border-line"
          >
            +
          </button>
        </div>
      </div>

      {notice && (
        <p role="status" className="text-sm text-ink">
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
            <SeatIcon color={c.color} />
            {c.name} <span className="text-ink-muted">{inr(c.price)}</span>
          </li>
        ))}
        <li className="flex items-center gap-2 text-ink-muted">
          <SeatIcon color="rgba(43,29,18,0.18)" />
          Sold
        </li>
        <li className="flex items-center gap-2 text-ink-muted">
          <SeatIcon color="rgba(43,29,18,0.3)" />
          Book on BookMyShow
        </li>
        <li className="flex items-center gap-2">
          <SeatIcon color={SELECTED_COLOR} />
          Selected
        </li>
      </ul>

      <p className="text-sm text-ink-muted">
        Tap a seat and all your seats are selected together, side by side. Tap
        another seat to move one seat there. Faded seats are sold on BookMyShow.
      </p>

      {/* Seat plan */}
      <div className="relative rounded-2xl border border-line bg-paper-raised">
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
            <SeatSymbol />
            {SEATS.map((s) => {
              const half = SEAT_SIZE / 2;
              const spot = {
                x: s.x - half,
                y: s.y - half,
                width: SEAT_SIZE,
                height: SEAT_SIZE,
              };
              // Not sold on this site: faint seat that leads to BookMyShow
              if (!s.bookable) {
                return (
                  <g
                    key={s.id}
                    role="link"
                    aria-label={`Row ${s.row} seat ${s.n}, book on BookMyShow`}
                    className="cursor-pointer opacity-100 hover:opacity-60"
                    onClick={() => !dragMoved.current && goToBookMyShow()}
                  >
                    <rect {...spot} fill="transparent" />
                    <use href="#hr-seat" {...spot} fill="rgba(43,29,18,0.3)" />
                    <title>{`${s.row} ${s.n} · Book on BookMyShow`}</title>
                  </g>
                );
              }
              const taken = isTaken(s.id);
              const isSel = selected.has(s.id);
              const cat = categoryOfSeat(s.id);
              return (
                <g
                  key={s.id}
                  role="checkbox"
                  aria-checked={isSel}
                  aria-disabled={taken}
                  aria-label={`Row ${s.row} seat ${s.n}, ${cat.name}, ${inr(cat.price)}${taken ? ", sold" : ""}`}
                  className={
                    taken
                      ? "cursor-not-allowed"
                      : "cursor-pointer hover:opacity-75"
                  }
                  onClick={() => !dragMoved.current && toggle(s.id)}
                >
                  <rect {...spot} fill="transparent" />
                  <use
                    href="#hr-seat"
                    {...spot}
                    fill={
                      taken
                        ? "rgba(43,29,18,0.18)"
                        : isSel
                          ? SELECTED_COLOR
                          : cat.color
                    }
                  />
                  <title>{`${s.id} · ${cat.name} · ${inr(cat.price)}${taken ? " · Sold" : ""}`}</title>
                </g>
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
            max={maxSeats}
            groupContact={groupContact}
            current={quantity}
            onPick={pick}
            onClose={quantity !== null ? () => setPickerOpen(false) : undefined}
          />
        )}
      </div>
    </div>
  );
}
