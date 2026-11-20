// Rounded search box for tables and lists.
export default function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  label = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label}
      className="w-full rounded-full border border-line bg-paper-raised px-5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-accent md:max-w-xs"
    />
  );
}
