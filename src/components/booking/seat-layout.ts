// Theatre seating plan, built from the real seating PDF (see seat-plan.data.ts).
// The stage is at the BOTTOM of the plan.
//
//   Balcony (Bronze)        rows B11..B1      top, farthest        BookMyShow
//   Silver                  rows AD..P                             BookMyShow
//   Gold                    rows O..J                              BookMyShow
//                           rows I, H                              THIS site
//   Diamond + Platinum      rows G..A                              THIS site
//   VVIP sofa row           row VVIP          next to the stage    THIS site
//
// Only the red seats of the PDF (`bookable`) are sold on this website. Every
// other seat is drawn too, but clicking it sends the visitor to BookMyShow.
// Seat ids are `${row}${number}` (e.g. "G22") for the bookable seats; the other
// seats get an internal id (`${row}~${number}`) that is never shown to anyone.

import { PLAN_ROWS, PLAN_STAGE } from "./seat-plan.data";

export type SeatPos = {
  id: string;
  row: string;
  n: number;
  x: number;
  y: number;
  tier: string; // SeatCategory id
  /** Sold on this site (red on the PDF). false = sold on BookMyShow */
  bookable: boolean;
};

export type RowLabel = { row: string; x: number; y: number };

const SCALE = 2; // PDF points -> plan units
const OFFSET_X = 82;
const OFFSET_Y = 66;
const PITCH = 8.4; // seat spacing in the PDF
const R = 6.4; // seat radius (plan units)
const LABEL_GAP = 9; // PDF points between a row letter and its first seat

const px = (x: number) => (x - OFFSET_X) * SCALE;
const py = (y: number) => (y - OFFSET_Y) * SCALE;

export const SEATS: SeatPos[] = [];
export const ROW_LABELS: RowLabel[] = [];

for (const row of PLAN_ROWS) {
  let left = Infinity;
  let right = -Infinity;
  for (const [x, from, to, bookable] of row.blocks) {
    const count = from - to + 1;
    for (let k = 0; k < count; k++) {
      const n = from - k; // highest number is on the left
      const cx = x + k * PITCH;
      SEATS.push({
        id: bookable ? `${row.row}${n}` : `${row.row}~${n}`,
        row: row.row,
        n,
        x: px(cx),
        y: py(row.y),
        tier: row.tier,
        bookable,
      });
    }
    left = Math.min(left, x);
    right = Math.max(right, x + (count - 1) * PITCH);
  }
  ROW_LABELS.push({ row: row.row, x: px(left - LABEL_GAP), y: py(row.y) });
  ROW_LABELS.push({ row: row.row, x: px(right + LABEL_GAP), y: py(row.y) });
}

/** Bookable rows from the stage outwards — used to sort seats for display. */
export const ROW_ORDER = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "VVIP",
];

export const PLAN_WIDTH = px(530);
export const STAGE = {
  x: px(PLAN_STAGE.x),
  y: py(PLAN_STAGE.y),
  width: PLAN_STAGE.width * SCALE,
  height: PLAN_STAGE.height * SCALE,
};
export const PLAN_HEIGHT = STAGE.y + STAGE.height + 24;
export const SEAT_RADIUS = R;
/** Horizontal distance between two neighbouring seats (plan units) */
export const SEAT_PITCH = PITCH * SCALE;

export const SEAT_BY_ID: Record<string, SeatPos> = Object.fromEntries(
  SEATS.map((s) => [s.id, s]),
);
