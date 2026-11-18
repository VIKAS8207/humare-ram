// "Divine" light behind a character: a bright pulsing halo, slowly turning
// god-rays and a few tiny twinkles that flicker at random. Decorative only
// (hidden from screen readers, ignores the mouse); every animation stops for
// reduced-motion users. Put it inside a `relative` box, BEFORE the character
// image so the character sits in front of the light.

// Seeded generator so the "random" twinkles are identical on the server and in
// the browser (a plain Math.random() would cause a hydration mismatch).
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(108);
const r = (n: number) => +n.toFixed(2);

const SPARKLES = Array.from({ length: 30 }, () => {
  const star = rand() < 0.35;
  return {
    x: r(rand() * 100),
    y: r(rand() * 88),
    size: star ? r(7 + rand() * 4) : r(2 + rand() * 2.5),
    delay: r(rand() * 9),
    duration: r(3 + rand() * 4),
    star,
  };
});

type Props = {
  /** Where the light radiates from (e.g. behind the head), as CSS "x y" */
  origin?: string;
};

export default function DivineLight({ origin = "50% 25%" }: Props) {
  const [ox, oy] = origin.split(" ");

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 select-none"
    >
      {/* Rays: two layers turning slowly in opposite directions */}
      <div
        className="absolute aspect-square w-[130vmin] -translate-x-1/2 -translate-y-1/2"
        style={{ left: ox, top: oy }}
      >
        <div className="divine-rays absolute inset-0" />
        <div className="divine-rays divine-rays-b absolute inset-0" />
      </div>

      {/* Halo */}
      <div
        className="divine-halo absolute aspect-square w-[34rem] max-w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left: ox, top: oy }}
      />

      {/* Twinkles */}
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className={`divine-twinkle absolute ${s.star ? "divine-star" : "divine-dot"}`}
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              "--d": `${s.duration}s`,
              "--delay": `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
