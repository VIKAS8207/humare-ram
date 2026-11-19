// Cherry-blossom petals drifting slowly from the top-right down to the bottom-centre, like they are on
// the breeze. Decorative only (hidden from screen readers, ignores the mouse);
// stops for reduced-motion users. Put it inside a `relative overflow-hidden`
// box. Styles: `.petal-*` in globals.css.

// Seeded generator so the "random" layout is identical on server and browser.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(2026);
const r = (n: number) => +n.toFixed(2);

const PETALS = Array.from({ length: 26 }, () => ({
  // Enter at the top-right, exit near the bottom-centre (cqw/cqh = % of box)
  sx: r(82 + rand() * 24),
  sy: r(-14 + rand() * 34),
  ex: r(30 + rand() * 38),
  ey: r(92 + rand() * 14),
  size: r(5 + rand() * 6), // px (small)
  duration: r(24 + rand() * 24), // s for the whole trip (slow, dreamy)
  delay: r(-rand() * 48), // negative = already mid-flight on load
  sway: r(8 + rand() * 18), // px of side-to-side wobble
  swayTime: r(3 + rand() * 4),
  // 3D tumble: random axis, some petals fast (1.6s), some slow (9s)
  spin: r(1.6 + rand() * 7.4),
  ax: r(rand() * 2 - 1),
  ay: r(rand() * 2 - 1),
  az: r(rand() * 2 - 1),
  tone: Math.floor(rand() * 3),
}));

export default function Petals() {
  return (
    <div
      aria-hidden
      className="petals-box pointer-events-none absolute inset-0 select-none overflow-hidden"
    >
      {PETALS.map((p, i) => (
        <span
          key={i}
          className={`petal-drift absolute left-0 top-0 ${i >= 18 ? "max-md:hidden" : ""}`}
          style={
            {
              "--sx": `${p.sx}cqw`,
              "--sy": `${p.sy}cqh`,
              "--ex": `${p.ex}cqw`,
              "--ey": `${p.ey}cqh`,
              "--dur": `${p.duration}s`,
              "--delay": `${p.delay}s`,
            } as React.CSSProperties
          }
        >
          <span
            className="petal-sway block"
            style={
              {
                "--sway": `${p.sway}px`,
                "--sway-t": `${p.swayTime}s`,
              } as React.CSSProperties
            }
          >
            <span
              className={`petal petal-${p.tone} block`}
              style={
                {
                  width: `${p.size}px`,
                  height: `${p.size * 0.78}px`,
                  "--spin": `${p.spin}s`,
                  "--ax": p.ax,
                  "--ay": p.ay,
                  "--az": p.az,
                } as React.CSSProperties
              }
            />
          </span>
        </span>
      ))}
    </div>
  );
}
