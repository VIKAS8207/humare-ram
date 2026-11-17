import { IMAGES } from "@/config/images";

// Placeholder copy — replace with real content.
export type SpotlightData = {
  id: string;
  /** Small label above the headline */
  eyebrow: string;
  /** Headline lines (the actor's name) */
  headline: readonly string[];
  /** Role line under the headline */
  role: string;
  /** Optional extra credits shown as small tags (e.g. Writer, Producer) */
  tags?: readonly string[];
  body: string;
  image: { src: string; alt: string; width: number; height: number };
  /** Glow behind the character, any CSS color */
  glow: string;
};

export const RAVAN: SpotlightData = {
  id: "ravan",
  eyebrow: "Starring",
  headline: ["Ashutosh", "Rana"],
  role: "as Ravan, The King of Lanka",
  body: "One of Indian cinema's most acclaimed actors steps into the crown of the ten-headed king — in a live stage spectacle of fire, music and untold stories.",
  image: {
    ...IMAGES.ravan,
    alt: "Ashutosh Rana as Ravan, king of Lanka, in golden armour",
  },
  glow: "rgba(230, 90, 25, 0.5)",
};

export const RAM: SpotlightData = {
  id: "ram",
  eyebrow: "Starring",
  headline: ["Rahul", "Bhuchar"],
  role: "as Lord Shri Ram, The King of Ayodhya",
  tags: ["Writer", "Producer"],
  body: "Rahul Bhuchar not only steps into the role of Lord Shri Ram — he also wrote the story and produced the production, bringing the untold chapters of the Ramayan to the stage.",
  image: {
    ...IMAGES.ram,
    alt: "Rahul Bhuchar as Lord Shri Ram, holding a quiver of arrows",
  },
  glow: "rgba(245, 170, 40, 0.45)",
};
