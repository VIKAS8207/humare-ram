import Image from "next/image";

type Props = {
  name: string;
  role: string;
  image?: string;
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

// Portrait card: photo fills the frame, name and role sit on a dark fade at the bottom.
export default function CastCard({ name, role, image }: Props) {
  return (
    <article className="rv-card group relative aspect-[3/4] overflow-hidden rounded-xl border border-amber-300/15 bg-gradient-to-b from-amber-900/30 to-neutral-900 transition-colors duration-500 hover:border-amber-300/50">
      {image ? (
        <Image
          src={image}
          alt={`${name}, ${role}`}
          fill
          sizes="(min-width: 1024px) 180px, (min-width: 640px) 30vw, 45vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <span
          aria-hidden
          className="absolute inset-0 grid place-content-center text-5xl font-semibold tracking-tight text-amber-300/25"
        >
          {initials(name)}
        </span>
      )}

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3">
        <p className="text-[0.6rem] font-medium uppercase leading-tight tracking-[0.2em] text-orange-400">
          {role}
        </p>
        <h3 className="text-sm font-semibold leading-tight tracking-tight text-white md:text-base">
          {name}
        </h3>
      </div>
    </article>
  );
}
