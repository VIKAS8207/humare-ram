// Decorative traditional mandala (public/images/trad-design.svg), tinted with a
// mild warm gradient and turning very slowly. Purely visual: hidden from screen
// readers, ignores the mouse, and stops turning for reduced-motion users.
//
// How it is drawn: the black SVG is used as a CSS *mask* over a gradient, so the
// artwork takes the gradient's colours instead of being black.
//
// Put it as the first child of a section that has `relative overflow-hidden
// isolate`, so it sits behind the content and is clipped at the section edges.
// NOT used in the hero (on purpose).

type Props = {
  /** Positioning of the wrapper, e.g. "-left-40 top-1/2 -translate-y-1/2" */
  className?: string;
  /** Diameter, any CSS length */
  size?: string;
  /** Seconds for one full turn (bigger = slower) */
  duration?: number;
  /** Turn the other way */
  reverse?: boolean;
  /** 0–1, keep it mild */
  opacity?: number;
};

export default function Mandala({
  className = "",
  size = "40rem",
  duration = 240,
  reverse = false,
  opacity = 0.09,
}: Props) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 select-none ${className}`}
      style={{ width: size, height: size, opacity }}
    >
      <div
        className="mandala size-full"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      />
    </div>
  );
}
