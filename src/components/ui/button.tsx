import Link from "next/link";

// THE button (paper theme: booking + admin). Pills only. For the golden
// "Book Now" on the dark site use <BookNowButton />.
//
//   <Button variant="primary" size="md">Pay</Button>
//   <ButtonLink href="/admin" variant="outline">Dashboard</ButtonLink>
//   buttonClass({ variant: "danger" })   // for anything that is not a <button>/<Link>

export type ButtonVariant = "primary" | "dark" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "adaptive";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:scale-[1.02] font-semibold",
  dark: "bg-ink text-paper hover:scale-105 font-semibold",
  danger: "bg-danger text-white hover:scale-[1.02] font-semibold",
  outline:
    "border border-line text-ink hover:border-ink font-medium bg-transparent",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
  // slimmer on phones (bottom bars)
  adaptive: "px-3.5 py-1.5 text-xs md:px-6 md:py-3 md:text-sm",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  grow = false,
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** flex-1: share the row equally with the other buttons */
  grow?: boolean;
  className?: string;
} = {}) {
  return `inline-flex items-center justify-center whitespace-nowrap rounded-full transition-[transform,color,background-color,border-color,opacity] duration-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${grow ? "flex-1" : ""} ${className}`;
}

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  grow?: boolean;
};

export function Button({
  variant,
  size,
  grow,
  className,
  type = "button",
  ...props
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, grow, className })}
      {...props}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  grow,
  className,
  ...props
}: Common & React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={buttonClass({ variant, size, grow, className })}
      {...props}
    />
  );
}
