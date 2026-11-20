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
      <div className="relative w-full max-w-72 rounded-t-full border border-amber-300/25 p-1 transition md:p-2-colors duration-500 group-hover:border-amber-300/70">
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-gradient-to-b from-amber-900/40 to-neutral-900">
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
              className="absolute inset-0 grid place-content-center text-3xl font-semibold tracking-tight text-amber-300/40 md:text-6xl"
            >
              {initials(name)}
            </span>
          )}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-neutral-950/70 to-transparent"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center gap-1.5 md:mt-6 md:gap-3">
        {badge && (
          <span className="rounded-full border border-orange-400/50 px-1.5 py-0.5 text-[0.4rem] font-medium uppercase tracking-[0.1em] text-orange-300 md:px-3 md:py-1 md:text-[0.65rem] md:tracking-[0.25em]">
            {badge}
          </span>
        )}
        <h3 className="text-[0.7rem] font-semibold leading-tight tracking-tight text-amber-100 md:text-xl">
          {name}
        </h3>
        <p className="line-clamp-4 max-w-xs text-[0.5rem] leading-snug text-white/60 md:line-clamp-none md:text-sm md:leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
}
