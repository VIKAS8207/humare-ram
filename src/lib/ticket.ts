import QRCode from "qrcode";
import { PALETTE as P } from "@/config/palette";

// Ticket = one self-contained SVG (works on screen and downloads as a PNG).
// The QR holds the booking reference + seats + show, so the gate can scan it.
// Replace `qrPayload` with whatever the backend validates (e.g. a signed token).

export type TicketData = {
  reference: string;
  name: string;
  venue: string;
  /** e.g. "Saturday, 26 December 2026" */
  dateLong: string;
  /** e.g. "4:00 PM" */
  time: string;
  seats: string[];
  /** Plain text, e.g. "₹7,500" or "Complimentary" */
  amount: string;
  /** e.g. "Block" / "Reserved" shown as a small badge text */
  status?: string;
};

const W = 860;
const H = 380;
const SPLIT = 600; // x of the perforation between ticket and stub

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const qrPayload = (t: TicketData) =>
  `HUMARERAM|${t.reference}|${t.seats.join(",")}|${t.dateLong} ${t.time}`;

/** QR as one SVG path (merged horizontal runs), size in px, at (x, y) */
function qrPath(text: string, size: number, x: number, y: number) {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: "M" });
  const n = modules.size;
  const cell = size / n;
  let d = "";
  for (let r = 0; r < n; r++) {
    let c = 0;
    while (c < n) {
      if (!modules.get(r, c)) {
        c++;
        continue;
      }
      let end = c;
      while (end < n && modules.get(r, end)) end++;
      d += `M${(x + c * cell).toFixed(2)} ${(y + r * cell).toFixed(2)}h${((end - c) * cell).toFixed(2)}v${cell.toFixed(2)}h${(-(end - c) * cell).toFixed(2)}z`;
      c = end;
    }
  }
  return d;
}

const CREAM = P.ivory;
const FONT = "Helvetica, Arial, sans-serif";

/** Seat chips, wrapped into at most 2 rows; the rest becomes "+N" */
function seatChips(seats: string[], x0: number, y0: number, maxX: number) {
  const chips: string[] = [];
  let x = x0;
  let y = y0;
  let row = 0;
  for (let i = 0; i < seats.length; i++) {
    const text = seats[i];
    const w = text.length * 9.5 + 24;
    if (x + w > maxX) {
      row++;
      x = x0;
      y += 38;
    }
    const last = row === 1 && x + w + 60 > maxX && i < seats.length - 1;
    const label = last ? `+${seats.length - i}` : text;
    const cw = last ? 46 : w;
    chips.push(
      `<rect x="${x}" y="${y}" width="${cw}" height="28" rx="8" fill="${P.goldLine}" fill-opacity="0.12" stroke="${P.goldLine}" stroke-opacity="0.55"/>` +
        `<text x="${x + cw / 2}" y="${y + 19}" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="700" fill="${CREAM}">${esc(label)}</text>`,
    );
    if (last) break;
    x += cw + 8;
  }
  return chips.join("");
}

export function buildTicketSvg(t: TicketData): string {
  const label = (x: number, y: number, text: string, anchor = "start") =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="10.5" letter-spacing="2.6" fill="${CREAM}" fill-opacity="0.5">${esc(text.toUpperCase())}</text>`;
  const value = (x: number, y: number, text: string, size = 18) =>
    `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="700" fill="${CREAM}">${esc(text)}</text>`;

  const R = 24; // corner radius
  const N = 15; // notch radius
  const shape = `M${R} 0H${SPLIT - N}A${N} ${N} 0 0 0 ${SPLIT + N} 0H${W - R}A${R} ${R} 0 0 1 ${W} ${R}V${H - R}A${R} ${R} 0 0 1 ${W - R} ${H}H${SPLIT + N}A${N} ${N} 0 0 0 ${SPLIT - N} ${H}H${R}A${R} ${R} 0 0 1 0 ${H - R}V${R}A${R} ${R} 0 0 1 ${R} 0Z`;
  const stubX = (SPLIT + W) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.ticketBg[0]}"/><stop offset="0.55" stop-color="${P.ticketBg[1]}"/><stop offset="1" stop-color="${P.ticketBg[2]}"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${P.goldLight}"/><stop offset="1" stop-color="${P.goldDeep}"/></linearGradient>
<radialGradient id="glow" cx="0.18" cy="0" r="0.8"><stop offset="0" stop-color="${P.ember}" stop-opacity="0.28"/><stop offset="1" stop-color="${P.ember}" stop-opacity="0"/></radialGradient>
<clipPath id="shape"><path d="${shape}"/></clipPath>
</defs>
<path d="${shape}" fill="url(#bg)"/>
<g clip-path="url(#shape)">
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<g fill="none" stroke="${P.goldLine}" stroke-opacity="0.07" stroke-width="1.5">
<circle cx="0" cy="${H}" r="120"/><circle cx="0" cy="${H}" r="180"/><circle cx="0" cy="${H}" r="240"/><circle cx="0" cy="${H}" r="300"/><circle cx="0" cy="${H}" r="360"/>
</g>
<rect x="0" y="0" width="${W}" height="6" fill="url(#gold)"/>
<rect x="${SPLIT}" y="6" width="${W - SPLIT}" height="${H - 6}" fill="#000" fill-opacity="0.22"/>
</g>
<path d="${shape}" fill="none" stroke="${P.goldLine}" stroke-opacity="0.38" stroke-width="1.5"/>
<line x1="${SPLIT}" y1="${N + 8}" x2="${SPLIT}" y2="${H - N - 8}" stroke="${P.goldLine}" stroke-opacity="0.45" stroke-width="2" stroke-dasharray="3 8" stroke-linecap="round"/>

<text x="44" y="52" font-family="${FONT}" font-size="11.5" letter-spacing="5" fill="${P.goldLine}">LIVE ON STAGE</text>
<text x="44" y="108" font-family="${FONT}" font-size="54" font-weight="800" fill="url(#gold)">Humare Ram</text>
<text x="44" y="134" font-family="${FONT}" font-size="13" fill="${CREAM}" fill-opacity="0.6">${esc(t.venue)}</text>
<line x1="44" y1="156" x2="${SPLIT - 44}" y2="156" stroke="${P.goldLine}" stroke-opacity="0.25"/>

${label(44, 186, "Date")}${value(44, 210, t.dateLong, 18)}
${label(372, 186, "Time")}${value(372, 210, t.time, 18)}
${label(44, 246, t.seats.length > 1 ? "Seats" : "Seat")}
${seatChips(t.seats, 44, 256, SPLIT - 44)}
${label(44, 340, "Name")}${value(44, 362, t.name, 16)}
${label(372, 340, "Amount")}${value(372, 362, t.amount, 16)}

<text x="${stubX}" y="46" text-anchor="middle" font-family="${FONT}" font-size="11.5" letter-spacing="4" fill="${P.goldLine}">ADMIT ${t.seats.length}</text>
<text x="${stubX}" y="64" text-anchor="middle" font-family="${FONT}" font-size="10" letter-spacing="3" fill="${CREAM}" fill-opacity="0.5">${esc((t.status ?? "Ticket").toUpperCase())}</text>
<rect x="${stubX - 100}" y="80" width="200" height="200" rx="14" fill="${P.ticketQrPanel}"/>
<path d="${qrPath(qrPayload(t), 172, stubX - 86, 94)}" fill="${P.ticketQrInk}"/>
${label(stubX, 310, "Booking reference", "middle")}
<text x="${stubX}" y="336" text-anchor="middle" font-family="Courier New, monospace" font-size="21" font-weight="700" fill="url(#gold)">${esc(t.reference)}</text>
<text x="${stubX}" y="360" text-anchor="middle" font-family="${FONT}" font-size="10" fill="${CREAM}" fill-opacity="0.45">Scan this code at the entrance</text>
</svg>`;
}

/** Render the ticket to a PNG and download it */
export async function downloadTicketPng(t: TicketData) {
  const svg = buildTicketSvg(t);
  const url = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
  );
  try {
    const img = new Image();
    img.decoding = "sync";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("ticket render failed"));
      img.src = url;
    });
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = W * scale;
    canvas.height = H * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) =>
      canvas.toBlob(r, "image/png"),
    );
    if (!blob) throw new Error("png failed");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `humare-ram-ticket-${t.reference}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  } finally {
    URL.revokeObjectURL(url);
  }
}
