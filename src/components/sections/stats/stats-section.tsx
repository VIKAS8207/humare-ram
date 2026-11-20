import StatItem from "./stat-item";
import { STATS } from "./stats.data";

export default function StatsSection() {
  return (
    <section
      aria-label="Highlights"
      className="relative w-full overflow-hidden bg-stage bg-[radial-gradient(ellipse_at_center,rgba(190,95,20,0.16),transparent_70%)] px-6 py-16 text-white md:py-24"
    >
      {/* thin gold rules top and bottom, fading at the edges */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 md:grid-cols-5 md:gap-y-0">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            // vertical dividers between items on desktop
            className="md:border-l md:border-gold/20 md:first:border-l-0 last:col-span-2 md:last:col-span-1"
          >
            <StatItem {...stat} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
