// Small rounded label: status tags, the "Admin" tag, roles, tiers...
//
//   <Pill tone="ok">Booked</Pill>
//   <Pill tone="ember" size="xs">Writer</Pill>

export type PillTone =
  | "ok" // booked / paid
  | "accent" // on hold / pending
  | "bronze" // reserved (paper theme)
  | "ember" // tags on the dark site
  | "neutral";

const TONES: Record<PillTone, string> = {
  ok: "border-ok/30 bg-ok/10 text-ok-strong",
  accent: "border-accent/30 bg-accent/10 text-accent",
  bronze: "border-bronze/40 bg-bronze/10 text-bronze",
  ember: "border-ember/50 text-ember-soft",
  neutral: "border-line text-ink-muted",
};

const SIZES = {
  // "xs" shrinks on phones by itself
  xs: "px-2.5 py-0.5 text-[0.6rem] tracking-[0.18em] md:px-3 md:py-1 md:text-xs md:tracking-[0.25em]",
  sm: "px-3 py-1 text-[0.68rem] tracking-[0.12em]",
} as const;

export default function Pill({
  tone = "neutral",
  size = "sm",
  className = "",
  children,
}: {
  tone?: PillTone;
  size?: keyof typeof SIZES;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border font-semibold uppercase ${TONES[tone]} ${SIZES[size]} ${className}`}
    >
      {children}
    </span>
  );
}
