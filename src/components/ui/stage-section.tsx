import RevealSection from "./reveal-section";

// Standard dark-site section: stage background, page padding, white text,
// mandala-friendly (relative + isolate + overflow-hidden), scroll-reveal.
// Pass a Mandala (and the content) as children.
const GLOWS = {
  none: "",
  top: "bg-[radial-gradient(ellipse_at_top,rgba(190,95,20,0.18),transparent_60%)]",
  center:
    "bg-[radial-gradient(ellipse_at_50%_0%,rgba(190,95,20,0.18),transparent_65%)]",
} as const;

/** Classes of a dark-site section (for wrappers that own their own animation) */
export const stageSectionClass = (glow: keyof typeof GLOWS = "none") =>
  `relative isolate w-full overflow-hidden bg-stage px-4 py-16 text-white md:px-6 md:py-36 ${GLOWS[glow]}`;

export default function StageSection({
  id,
  glow = "none",
  className = "",
  children,
}: {
  id?: string;
  glow?: keyof typeof GLOWS;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <RevealSection
      id={id}
      className={`${stageSectionClass(glow)} ${className}`}
    >
      {children}
    </RevealSection>
  );
}
