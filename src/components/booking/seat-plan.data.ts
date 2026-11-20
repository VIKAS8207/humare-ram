// GENERATED from the theatre's official seating PDF (page 1) - the exact seat
// positions of every seat in the hall. Do not edit by hand; if the layout
// changes, regenerate it from the new PDF.
//
// Units are PDF points. Seats in a block are 8.4 apart, numbered downwards from
// left to right (the highest number is on the left, as printed on the plan).
//
//   tier      zone of the hall (bronze = balcony, silver, gold, dp = Diamond +
//             Platinum, vvip = sofa row)
//   blocks    [x of the first seat's centre, first number, last number, bookable]
//             `bookable` = the red seats on the PDF = the ones sold on THIS site.
//             Every other seat is sold on BookMyShow.
export type PlanRow = {
  row: string;
  y: number;
  tier: "bronze" | "silver" | "gold" | "dp" | "vvip";
  blocks: [x: number, from: number, to: number, bookable: boolean][];
};

export const PLAN_ROWS: PlanRow[] = [
  {
    row: "B11",
    y: 79.1,
    tier: "bronze",
    blocks: [
      [103.4, 40, 36, false],
      [162.3, 35, 22, false],
      [305.1, 21, 8, false],
      [447.9, 7, 1, false],
    ],
  },
  {
    row: "B10",
    y: 87.1,
    tier: "bronze",
    blocks: [
      [103.4, 40, 36, false],
      [162.3, 35, 22, false],
      [305.1, 21, 8, false],
      [447.9, 7, 1, false],
    ],
  },
  {
    row: "B9",
    y: 95.2,
    tier: "bronze",
    blocks: [
      [103.4, 40, 36, false],
      [162.3, 35, 22, false],
      [305.1, 21, 8, false],
      [447.9, 7, 1, false],
    ],
  },
  {
    row: "B8",
    y: 103.2,
    tier: "bronze",
    blocks: [
      [103.4, 40, 36, false],
      [162.3, 35, 22, false],
      [305.1, 21, 8, false],
      [447.9, 7, 1, false],
    ],
  },
  {
    row: "B7",
    y: 111.2,
    tier: "bronze",
    blocks: [
      [103.4, 40, 36, false],
      [162.3, 35, 22, false],
      [305.1, 21, 8, false],
      [447.9, 7, 1, false],
    ],
  },
  {
    row: "B6",
    y: 119.3,
    tier: "bronze",
    blocks: [
      [103.4, 40, 36, false],
      [162.3, 35, 22, false],
      [305.1, 21, 8, false],
      [447.9, 7, 1, false],
    ],
  },
  {
    row: "B5",
    y: 127.3,
    tier: "bronze",
    blocks: [
      [103.4, 40, 36, false],
      [162.3, 35, 22, false],
      [305.1, 21, 8, false],
      [447.9, 7, 1, false],
    ],
  },
  {
    row: "B4",
    y: 135.4,
    tier: "bronze",
    blocks: [
      [103.4, 40, 36, false],
      [162.3, 35, 22, false],
      [305.1, 21, 8, false],
      [447.9, 7, 1, false],
    ],
  },
  {
    row: "B3",
    y: 143.4,
    tier: "bronze",
    blocks: [
      [103.4, 40, 36, false],
      [162.3, 35, 22, false],
      [305.1, 21, 8, false],
      [447.9, 7, 1, false],
    ],
  },
  {
    row: "B2",
    y: 151.4,
    tier: "bronze",
    blocks: [
      [103.4, 40, 36, false],
      [162.3, 35, 22, false],
      [305.1, 21, 8, false],
      [447.9, 7, 1, false],
    ],
  },
  {
    row: "B1",
    y: 159.5,
    tier: "bronze",
    blocks: [
      [103.4, 40, 36, false],
      [162.3, 35, 22, false],
      [305.1, 21, 8, false],
      [447.9, 7, 1, false],
    ],
  },
  {
    row: "AD",
    y: 183.6,
    tier: "silver",
    blocks: [
      [103.4, 32, 27, false],
      [187.5, 26, 18, false],
      [321.9, 17, 9, false],
      [431.1, 8, 1, false],
    ],
  },
  {
    row: "AC",
    y: 191.7,
    tier: "silver",
    blocks: [
      [103.4, 32, 27, false],
      [187.5, 26, 18, false],
      [321.9, 17, 9, false],
      [431.1, 8, 1, false],
    ],
  },
  {
    row: "AB",
    y: 199.7,
    tier: "silver",
    blocks: [
      [103.4, 32, 27, false],
      [187.5, 26, 18, false],
      [321.9, 17, 9, false],
      [431.1, 8, 1, false],
    ],
  },
  {
    row: "AA",
    y: 207.7,
    tier: "silver",
    blocks: [
      [103.4, 32, 27, false],
      [187.5, 26, 18, false],
      [321.9, 17, 9, false],
      [431.1, 8, 1, false],
    ],
  },
  {
    row: "Z",
    y: 215.8,
    tier: "silver",
    blocks: [
      [103.4, 32, 27, false],
      [187.5, 26, 18, false],
      [321.9, 17, 9, false],
      [431.1, 8, 1, false],
    ],
  },
  {
    row: "Y",
    y: 223.8,
    tier: "silver",
    blocks: [
      [103.4, 32, 27, false],
      [187.5, 26, 18, false],
      [321.9, 17, 9, false],
      [431.1, 8, 1, false],
    ],
  },
  {
    row: "X",
    y: 231.9,
    tier: "silver",
    blocks: [
      [103.4, 32, 27, false],
      [187.5, 26, 18, false],
      [321.9, 17, 9, false],
      [431.1, 8, 1, false],
    ],
  },
  {
    row: "W",
    y: 239.9,
    tier: "silver",
    blocks: [
      [103.4, 32, 27, false],
      [187.5, 26, 18, false],
      [321.9, 17, 9, false],
      [431.1, 8, 1, false],
    ],
  },
  {
    row: "V",
    y: 247.9,
    tier: "silver",
    blocks: [
      [103.4, 32, 27, false],
      [187.5, 26, 18, false],
      [321.9, 17, 9, false],
      [431.1, 8, 1, false],
    ],
  },
  {
    row: "U",
    y: 256.0,
    tier: "silver",
    blocks: [
      [103.4, 30, 26, false],
      [187.5, 25, 17, false],
      [321.9, 16, 8, false],
      [439.5, 7, 1, false],
    ],
  },
  {
    row: "T",
    y: 264.0,
    tier: "silver",
    blocks: [
      [103.4, 30, 26, false],
      [187.5, 25, 17, false],
      [321.9, 16, 8, false],
      [439.5, 7, 1, false],
    ],
  },
  {
    row: "S",
    y: 272.1,
    tier: "silver",
    blocks: [
      [103.4, 30, 26, false],
      [187.5, 25, 17, false],
      [321.9, 16, 8, false],
      [439.5, 7, 1, false],
    ],
  },
  {
    row: "R",
    y: 280.1,
    tier: "silver",
    blocks: [
      [103.4, 30, 26, false],
      [187.5, 25, 17, false],
      [321.9, 16, 8, false],
      [439.5, 7, 1, false],
    ],
  },
  {
    row: "Q",
    y: 288.1,
    tier: "silver",
    blocks: [
      [103.4, 30, 26, false],
      [187.5, 25, 17, false],
      [321.9, 16, 8, false],
      [439.5, 7, 1, false],
    ],
  },
  {
    row: "P",
    y: 296.2,
    tier: "silver",
    blocks: [
      [103.4, 30, 26, false],
      [187.5, 25, 17, false],
      [321.9, 16, 8, false],
      [439.5, 7, 1, false],
    ],
  },
  {
    row: "O",
    y: 312.3,
    tier: "gold",
    blocks: [
      [103.4, 37, 24, false],
      [271.5, 23, 15, false],
      [405.9, 14, 1, false],
    ],
  },
  {
    row: "N",
    y: 320.3,
    tier: "gold",
    blocks: [
      [103.4, 38, 25, false],
      [263.1, 24, 15, false],
      [405.9, 14, 1, false],
    ],
  },
  {
    row: "M",
    y: 328.3,
    tier: "gold",
    blocks: [
      [103.4, 37, 24, false],
      [271.5, 23, 15, false],
      [405.9, 14, 1, false],
    ],
  },
  {
    row: "L",
    y: 336.4,
    tier: "gold",
    blocks: [
      [111.9, 36, 24, false],
      [263.1, 23, 14, false],
      [405.9, 13, 1, false],
    ],
  },
  {
    row: "K",
    y: 344.4,
    tier: "gold",
    blocks: [
      [111.9, 35, 23, false],
      [271.5, 22, 14, false],
      [405.9, 13, 1, false],
    ],
  },
  {
    row: "J",
    y: 352.5,
    tier: "gold",
    blocks: [
      [111.9, 36, 24, false],
      [263.1, 23, 14, false],
      [405.9, 13, 1, false],
    ],
  },
  {
    row: "I",
    y: 360.5,
    tier: "gold",
    blocks: [
      [120.3, 33, 22, true],
      [271.5, 21, 13, true],
      [405.9, 12, 1, true],
    ],
  },
  {
    row: "H",
    y: 368.6,
    tier: "gold",
    blocks: [
      [120.3, 34, 23, true],
      [263.1, 22, 13, true],
      [405.9, 12, 1, true],
    ],
  },
  {
    row: "G",
    y: 384.6,
    tier: "dp",
    blocks: [
      [137.1, 32, 22, true],
      [263.1, 21, 12, true],
      [405.9, 11, 1, true],
    ],
  },
  {
    row: "F",
    y: 392.7,
    tier: "dp",
    blocks: [
      [137.1, 31, 21, true],
      [271.5, 20, 12, true],
      [405.9, 11, 1, true],
    ],
  },
  {
    row: "E",
    y: 400.7,
    tier: "dp",
    blocks: [
      [145.5, 30, 21, true],
      [263.1, 20, 11, true],
      [405.9, 10, 1, true],
    ],
  },
  {
    row: "D",
    y: 408.8,
    tier: "dp",
    blocks: [
      [145.5, 29, 20, true],
      [271.5, 19, 11, true],
      [405.9, 10, 1, true],
    ],
  },
  {
    row: "C",
    y: 416.8,
    tier: "dp",
    blocks: [
      [145.5, 30, 21, true],
      [263.1, 20, 11, true],
      [405.9, 10, 1, true],
    ],
  },
  {
    row: "B",
    y: 424.8,
    tier: "dp",
    blocks: [
      [145.5, 28, 19, true],
      [271.5, 18, 10, true],
      [414.3, 9, 1, true],
    ],
  },
  {
    row: "A",
    y: 432.9,
    tier: "dp",
    blocks: [
      [145.5, 32, 23, true],
      [254.7, 22, 11, true],
      [405.9, 10, 1, true],
    ],
  },
  {
    row: "VVIP",
    y: 440.9,
    tier: "vvip",
    blocks: [
      [145.5, 15, 15, true],
      [162.3, 14, 14, true],
      [187.5, 13, 13, true],
      [212.7, 12, 12, true],
      [237.9, 11, 11, true],
      [263.1, 10, 10, true],
      [288.2, 9, 9, true],
      [313.5, 8, 8, true],
      [338.7, 7, 7, true],
      [363.9, 6, 6, true],
      [389.1, 5, 5, true],
      [414.3, 4, 4, true],
      [439.5, 3, 3, true],
      [464.7, 2, 2, true],
      [489.5, 1, 1, true],
    ],
  },
];

// The stage, in the same units.
export const PLAN_STAGE = { x: 140.8, y: 458.5, width: 344.3, height: 16.2 };
