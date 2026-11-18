// Tiny amber sparks that twinkle out from one centre point and fade away as
// they reach the edge of the glow circle. Meant to sit behind a character,
// on top of the colour glow. Decorative only (hidden from screen readers,
// ignores the mouse); stops for reduced-motion users. Styles: `.amber-*` in
// globals.css. Put it inside a `relative` box, BEFORE the character image.

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

const rand = mulberry32(1008);
const r = (n: number) => +n.toFixed(3);

const SPARKS = Array.from({ length: 80 }, () => {
  const angle = rand() * Math.PI * 2;
  // how far it travels, as a share of the circle radius (most reach the edge)
  const reach = 0.55 + rand() * 0.45;
  return {
    dx: r(Math.cos(angle) * reach),
    dy: r(Math.sin(angle) * reach),
    size: r(4 + rand() * 6), // px
    duration: r(6 + rand() * 7), // s from centre to edge
    delay: r(-rand() * 13), // negative = already mid-flight on load
    flicker: r(0.7 + rand() * 1.4), // s per twinkle
  };
});

type Props = {
  /** Centre point of the sparks, as CSS "x y" (match the glow's centre) */
  origin?: string;
};

export default function AmberBurst({ origin = "50% 42%" }: Props) {
  const [ox, oy] = origin.split(" ");

  return (
    <div
      aria-hidden
      className="amber-box pointer-events-none absolute inset-0 select-none"
    >
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="amber-fly absolute"
          style={
            {
              left: ox,
              top: oy,
              "--dx": s.dx,
              "--dy": s.dy,
              "--dur": `${s.duration}s`,
              "--delay": `${s.delay}s`,
            } as React.CSSProperties
          }
        >
          <span
            className="amber-spark block rounded-full"
            style={
              {
                width: `${s.size}px`,
                height: `${s.size}px`,
                "--flicker": `${s.flicker}s`,
              } as React.CSSProperties
            }
          />
        </span>
      ))}
    </div>
  );
}
