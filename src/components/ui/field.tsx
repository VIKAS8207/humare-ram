// Form pieces for the paper theme: one input style, one label + error layout.
//
//   <Field label="Full name" error={errors.name}>
//     <TextInput value=… onChange=… invalid={Boolean(errors.name)} />
//   </Field>

export const inputClass =
  "w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-accent";

export function TextInput({
  invalid = false,
  className = "",
  ...props
}: { invalid?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={`${inputClass} ${invalid ? "border-danger" : ""} ${className}`}
      {...props}
    />
  );
}

export function Field({
  label,
  error,
  className = "",
  as: Tag = "label",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  /** "div" when the control is a dropdown / group (a <label> would click it) */
  as?: "label" | "div";
  children: React.ReactNode;
}) {
  return (
    <Tag className={`flex flex-col gap-2 text-sm ${className}`}>
      <span className="text-ink-muted">{label}</span>
      {children}
      {error && <span className="text-xs text-danger-strong">{error}</span>}
    </Tag>
  );
}
