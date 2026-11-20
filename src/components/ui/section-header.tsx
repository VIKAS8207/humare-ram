// Small caps label above headings ("EVENT DETAILS", "CAST"...) and the standard
// section heading block used by the dark site sections.

const EYEBROW_TONES = {
  ember: "text-ember", // dark site headings
  gold: "text-gold/80", // dark site sub-headings (Cast, Crew...)
  bronze: "text-bronze", // paper theme (admin, booking)
} as const;

export function Eyebrow({
  tone = "ember",
  tracking = "wider",
  as: Tag = "p",
  className = "",
  children,
}: {
  tone?: keyof typeof EYEBROW_TONES;
  /** letter spacing: wider = 0.4em (section headings), wide = 0.3em (small labels) */
  tracking?: "wider" | "wide";
  /** use a heading tag when it labels a block */
  as?: "p" | "h2" | "h3" | "span";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={`text-xs font-medium uppercase ${tracking === "wide" ? "tracking-[0.3em]" : "tracking-[0.4em]"} ${EYEBROW_TONES[tone]} ${className}`}
    >
      {children}
    </Tag>
  );
}

// eyebrow + big title + subtitle, centred. `reveal` is the animation hook class
// the parent section animates (rv for RevealSection, m-reveal for the music
// section). `titleClass` lets a section tint its title.
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  reveal = "rv",
  titleClass = "text-white",
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  reveal?: string;
  titleClass?: string;
  /** extra content below the subtitle (e.g. an ornament) */
  children?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col items-center gap-4 text-center md:gap-6">
      <Eyebrow className={reveal}>{eyebrow}</Eyebrow>
      <h2
        className={`${reveal} text-[clamp(1.9rem,7vw,5.5rem)] font-semibold leading-none tracking-tight ${titleClass}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`${reveal} max-w-xl text-sm text-white/60 md:text-lg`}>
          {subtitle}
        </p>
      )}
      {children}
    </header>
  );
}
