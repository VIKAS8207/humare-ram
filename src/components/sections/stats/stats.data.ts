export type Stat = {
  value: number;
  /** optional unit word after the number (rendered smaller), e.g. "Lakh" */
  unit?: string;
  /** symbol after the number/unit, e.g. "+" */
  suffix: string;
  label: string;
};

export const STATS: Stat[] = [
  { value: 450, suffix: "+", label: "Performances" },
  { value: 35, suffix: "+", label: "Cities Toured" },
  { value: 100, suffix: "+", label: "Cast & Crew" },
  { value: 8, unit: "Lakh", suffix: "+", label: "Audiences" },
  { value: 3, unit: "Hrs", suffix: "", label: "Immersive Drama" },
];
