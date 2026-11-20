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
    <article className="rv-card group relative aspect-[3/4] overflow-hidden rounded-lg border border-gold/15 md:rounded-xl bg-gradient-to-b from-gold-shade/30 to-stage-soft transition-colors duration-500 hover:border-gold/50">
      {image ? (
        <Image
          src={image}
          alt={`${name}, ${role}`}
          fill
          sizes="(min-width: 1024px) 180px, 25vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <span
          aria-hidden
          className="absolute inset-0 grid place-content-center text-2xl font-semibold tracking-tight text-gold/25 md:text-5xl"
        >
          {initials(name)}
        </span>
      )}

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stage via-stage/70 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-0.5 p-1.5 text-center md:items-stretch md:p-3 md:text-left">
        <p className="line-clamp-2 text-[0.42rem] font-medium uppercase leading-tight tracking-[0.08em] text-ember md:text-[0.6rem] md:tracking-[0.2em]">
          {role}
        </p>
        <h3 className="text-[0.62rem] font-semibold leading-tight tracking-tight text-white md:text-base">
          {name}
        </h3>
      </div>
    </article>
  );
}
