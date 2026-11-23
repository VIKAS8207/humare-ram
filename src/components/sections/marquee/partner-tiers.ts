import type { Logo } from "./marquee-logos";

// Partner tiers shown on the home page, top to bottom. A tier with no logos is
// not shown, so "Diamond" appears as soon as a Diamond logo is added.
export type TierId = "powered" | "diamond" | "platinum" | "gold" | "media";

export const TIERS: {
  id: TierId;
  label: string;
  /** Card size + colours */
  card: string;
  logo: string;
  label_class: string;
}[] = [
  {
    id: "powered",
    label: "Powered by",
    card: "border-ember/40 bg-ember/[0.06] hover:border-ember-soft/70",
    logo: "h-6 md:h-12",
    label_class: "text-ember",
  },
  {
    id: "diamond",
    label: "Diamond Partner",
    card: "border-tier-diamond/40 bg-tier-diamond/[0.05] hover:border-tier-diamond-soft/70",
    logo: "h-6 md:h-12",
    label_class: "text-tier-diamond",
  },
  {
    id: "platinum",
    label: "Platinum Sponsor",
    card: "border-tier-platinum/35 bg-tier-platinum/[0.05] hover:border-tier-platinum-soft/70",
    logo: "h-6 md:h-12",
    label_class: "text-tier-platinum",
  },
  {
    id: "gold",
    label: "Gold Sponsor",
    card: "border-gold/40 bg-gold/[0.05] hover:border-gold-soft/70",
    logo: "h-6 md:h-12",
    label_class: "text-gold",
  },
  {
    id: "media",
    label: "Media Partner",
    card: "border-white/15 bg-white/[0.03] hover:border-white/35",
    logo: "h-6 md:h-12",
    label_class: "text-white/60",
  },
];

// Which tier each logo belongs to, matched on the file name. Also sets a clean
// display name. Unknown files can be put in a tier by naming them with the
// tier as a prefix: powered-x.png, diamond-x.png, platinum-x.png, gold-x.png,
// media-x.png. Anything else falls in "Media Partner".
const KNOWN: { match: RegExp; tier: TierId; name: string }[] = [
  { match: /sendh/i, tier: "powered", name: "The Sendh Lake City" },
  { match: /sagar.?tmt/i, tier: "powered", name: "Sagar TMT" },
  { match: /marina/i, tier: "platinum", name: "31 Marina by Dee Vee" },
  { match: /super|sarvottam/i, tier: "gold", name: "Sarvottam" },
  { match: /asa/i, tier: "media", name: "ASA Advertising Agency" },
];

export function tierOf(logo: Logo): { tier: TierId; alt: string } {
  const known = KNOWN.find((k) => k.match.test(logo.alt));
  if (known) return { tier: known.tier, alt: known.name };
  const m = logo.alt.match(
    /^(powered|diamond|platinum|gold|media)[\s-]+(.*)$/i,
  );
  if (m) return { tier: m[1].toLowerCase() as TierId, alt: m[2] || logo.alt };
  return { tier: "media", alt: logo.alt };
}
