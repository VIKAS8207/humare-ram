// Colours for places Tailwind class names cannot reach: the ticket SVG/PNG, the
// seat map and canvas drawing. These mirror src/styles/palette.css, so change
// them together. Everything made of HTML + class names should use the class
// tokens (bg-stage, text-gold, border-line...) instead.

export const PALETTE = {
  // Stage (dark site) + metallic gold
  stage: "#0a0a0a",
  ivory: "#f7ecd6",
  goldLight: "#fbe3a0",
  goldMid: "#f0bb4f",
  goldDeep: "#c98a2b",
  goldLine: "#f3d38a", // soft gold for hairlines and chips
  ember: "#ff9f2e", // warm glow

  // Paper (cream pages)
  paper: "#fcf8f0",
  paperRaised: "#fffcf6",
  ink: "#2b1d12",
  inkMuted: "#7a6650",
  line: "#d8c8aa",
  accent: "#b8431a",
  accentInk: "#fff7ea",
  bronze: "#a06a12",

  // The ticket itself (dark card + white QR panel)
  ticketBg: ["#2a1a0e", "#150e08", "#0d0905"],
  ticketQrPanel: "#fbf4e4",
  ticketQrInk: "#1a1109",
} as const;

// Seat categories on the seat map (booking.data.ts)
export const SEAT_COLORS = {
  vvip: "#d9669c",
  diamondPlatinum: "#7c5cd6",
  gold: "#d99207",
  selected: "#16a34a",
} as const;
