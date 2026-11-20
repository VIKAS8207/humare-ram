import BookLink from "@/components/transitions/book-link";
import { BOOK_NOW_HREF } from "@/components/navbar/nav.data";

// THE "Book Now" button. Golden, and it glows on hover. Use this everywhere a
// Book Now button is needed (navbar, hero, footer, ...) so the look is changed
// in one place. It opens the booking page with the sheet-slide transition.
const SIZES = {
  sm: "px-5 py-2 text-sm",
  md: "px-8 py-3 text-base",
  lg: "px-10 py-3.5 text-base",
} as const;

export default function BookNowButton({
  size = "md",
  className = "",
  children = "Book Now",
}: {
  size?: keyof typeof SIZES;
  /** Extra classes (spacing / animation hooks), not colours */
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <BookLink
      href={BOOK_NOW_HREF}
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#fbe3a0] via-[#f0bb4f] to-[#c98a2b] font-semibold text-neutral-950 shadow-[0_2px_14px_-4px_rgba(240,187,79,0.55)] ring-1 ring-amber-200/50 transition-[box-shadow,filter,scale] duration-300 hover:scale-105 hover:shadow-[0_0_30px_6px_rgba(255,190,70,0.6)] hover:brightness-110 focus-visible:shadow-[0_0_30px_6px_rgba(255,190,70,0.6)] focus-visible:outline-none ${SIZES[size]} ${className}`}
    >
      {children}
    </BookLink>
  );
}
