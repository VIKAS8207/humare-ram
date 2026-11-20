import { Pill } from "@/components/ui";
import Image from "next/image";
import type { Singer } from "./music.data";

type Props = Singer & { image?: string };

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

// Arched "niche" frame, a nod to temple architecture, with a thin gold outline.
export default function SingerCard({ name, description, badge, image }: Props) {
  return (
    <article className="m-card group relative flex flex-col items-center text-center">
      <div className="relative w-full max-w-72 rounded-t-full border border-gold/25 p-1 transition md:p-2-colors duration-500 group-hover:border-gold/70">
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-gradient-to-b from-gold-shade/40 to-stage-soft">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(min-width: 768px) 288px, 30vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <span
              aria-hidden
              className="absolute inset-0 grid place-content-center text-3xl font-semibold tracking-tight text-gold/40 md:text-6xl"
            >
              {initials(name)}
            </span>
          )}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-stage/70 to-transparent"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center gap-1.5 md:mt-6 md:gap-3">
        {badge && (
          <Pill tone="ember" size="xs" className="font-medium">
            {badge}
          </Pill>
        )}
        <h3 className="text-[0.7rem] font-semibold leading-tight tracking-tight text-gold-pale md:text-xl">
          {name}
        </h3>
        <p className="line-clamp-4 max-w-xs text-[0.5rem] leading-snug text-white/60 md:line-clamp-none md:text-sm md:leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
}
