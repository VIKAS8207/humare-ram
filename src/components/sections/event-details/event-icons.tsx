// Small line icons for the event details (inline SVG, inherit text colour).
const base = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function CalendarIcon() {
  return (
    <svg {...base}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg {...base}>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg {...base}>
      <path d="M6.5 3h11M6.5 21h11M7.5 3c0 4 4.5 5 4.5 9s-4.5 5-4.5 9M16.5 3c0 4-4.5 5-4.5 9s4.5 5 4.5 9" />
    </svg>
  );
}

export function AgeIcon() {
  return (
    <svg {...base}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <circle cx="17.5" cy="9.5" r="2.2" />
      <path d="M16.5 14.7c2.4.2 4 1.9 4 4.3" />
    </svg>
  );
}

export function LanguageIcon() {
  return (
    <svg {...base}>
      <path d="M4 5h9M8.5 3v2M6 5c.5 3.5 2.5 6 5.5 7.5M11.5 5c-.5 3.5-3 6.5-7 8.5" />
      <path d="m12.5 20 4-9 4 9M14 17h5" />
    </svg>
  );
}

export function MaskIcon() {
  return (
    <svg {...base}>
      <path d="M4 5.5c3-1.2 5.5-1.2 8 0v6.5c0 3-2 5.5-4 6.5-2-1-4-3.5-4-6.5Z" />
      <path d="M7 10v.5M10 10v.5M6.5 14c1 .9 2.5.9 3.5 0" />
      <path d="M12 8c2.5-1.2 5-1.2 8 0v6.5c0 3-2 5.5-4 6.5" />
    </svg>
  );
}

export const FACT_ICONS = {
  clock: ClockIcon,
  age: AgeIcon,
  language: LanguageIcon,
  mask: MaskIcon,
};
