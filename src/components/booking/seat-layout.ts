// Theatre seating plan, generated once. Stage is at the BOTTOM of the plan.
//
//   Balcony   rows X..Q   (top, farthest)
//   Mid       rows P..J
//   Front     rows H..A
//   Pit       rows CC..AA (closest to the stage)
//
// Each row is split into left / centre / right blocks with aisles between.
// Side blocks are aligned to the centre aisle, so rows nearer the stage get
// shorter on the sides, giving the curved "fan" shape.
// Seat ids are `${row}${number}` with numbers running left to right (e.g. "C7").

export type SeatPos = {
  id: string;
  row: string;
  n: number;
  x: number;
  y: number;
  tier: string; // SeatCategory id
};

export type RowLabel = { row: string; x: number; y: number };

const PITCH = 17; // seat spacing
const ROW_PITCH = 18;
const AISLE = 46;
const MARGIN = 46;
const MAX_SIDE = 12;
const CENTER = 16;
const SECTION_GAP = 36;
const R = 6.4; // seat radius

type Section = {
  rows: string[]; // listed top -> bottom
  center: number;
  maxSide: number;
  minSide: number;
  tier: (row: string, block: "L" | "C" | "R") => string;
};

const letters = (from: string, to: string) => {
  const out: string[] = [];
  for (let c = from.charCodeAt(0); c <= to.charCodeAt(0); c++)
    out.push(String.fromCharCode(c));
  return out;
};

const SECTIONS: Section[] = [
  {
    rows: letters("Q", "X").reverse(), // X (top) ... Q
    center: CENTER,
    maxSide: 12,
    minSide: 9,
    tier: (row) => (row <= "T" ? "silver" : "standard"),
  },
  {
    rows: letters("J", "P").reverse(), // P ... J
    center: CENTER,
    maxSide: 12,
    minSide: 9,
    tier: () => "gold",
  },
  {
    rows: letters("A", "H").reverse(), // H ... A
    center: CENTER,
    maxSide: 12,
    minSide: 8,
    tier: (row, block) => (block === "C" && row <= "E" ? "royal" : "premium"),
  },
  {
    rows: ["CC", "BB", "AA"],
    center: 10,
    maxSide: 8,
    minSide: 8,
    tier: () => "premium",
  },
];

/** Rows from the stage outwards — used to sort seats for display. */
export const ROW_ORDER = [
  "AA",
  "BB",
  "CC",
  ...letters("A", "H"),
  ...letters("J", "P"),
  ...letters("Q", "X"),
];

export const SEATS: SeatPos[] = [];
export const ROW_LABELS: RowLabel[] = [];

const innerLeftEdge = MARGIN + MAX_SIDE * PITCH;
const centerStart = innerLeftEdge + AISLE;
const rightStart = centerStart + CENTER * PITCH + AISLE;
export const PLAN_WIDTH = rightStart + MAX_SIDE * PITCH + MARGIN;

let y = 34;
SECTIONS.forEach((section, si) => {
  const count = section.rows.length;
  section.rows.forEach((row, ri) => {
    const side =
      count === 1
        ? section.maxSide
        : section.maxSide -
          Math.round((ri * (section.maxSide - section.minSide)) / (count - 1));

    const centerOffset = ((CENTER - section.center) / 2) * PITCH;
    let n = 1;

    for (let j = 0; j < side; j++) {
      SEATS.push({
        id: `${row}${n}`,
        row,
        n: n++,
        x: innerLeftEdge - (side - j - 0.5) * PITCH,
        y,
        tier: section.tier(row, "L"),
      });
    }
    for (let j = 0; j < section.center; j++) {
      SEATS.push({
        id: `${row}${n}`,
        row,
        n: n++,
        x: centerStart + centerOffset + (j + 0.5) * PITCH,
        y,
        tier: section.tier(row, "C"),
      });
    }
    for (let j = 0; j < side; j++) {
      SEATS.push({
        id: `${row}${n}`,
        row,
        n: n++,
        x: rightStart + (j + 0.5) * PITCH,
        y,
        tier: section.tier(row, "R"),
      });
    }

    ROW_LABELS.push({ row, x: innerLeftEdge - side * PITCH - 14, y });
    ROW_LABELS.push({ row, x: rightStart + side * PITCH + 14, y });
    y += ROW_PITCH;
  });
  if (si < SECTIONS.length - 1) y += SECTION_GAP;
});

const STAGE_W = 380;
const STAGE_H = 54;
export const STAGE = {
  x: PLAN_WIDTH / 2 - STAGE_W / 2,
  y: y + 14,
  width: STAGE_W,
  height: STAGE_H,
};
export const PLAN_HEIGHT = STAGE.y + STAGE_H + 30;
export const SEAT_RADIUS = R;

export const SEAT_BY_ID: Record<string, SeatPos> = Object.fromEntries(
  SEATS.map((s) => [s.id, s]),
);
