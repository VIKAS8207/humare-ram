// Gold gradient square holding an icon (event details, venue...).
export default function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-11 shrink-0 place-content-center rounded-xl bg-gradient-to-br from-gold to-ember-deep text-stage shadow-[0_0_30px_-4px_rgba(255,160,50,0.55)] md:size-14 md:rounded-2xl">
      {children}
    </span>
  );
}
