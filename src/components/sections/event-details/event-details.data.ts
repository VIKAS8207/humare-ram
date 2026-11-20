// Event facts — edit here and the section updates itself.
export const EVENT_HEADER = {
  eyebrow: "Event Details",
  title: "Plan Your Evening",
  subtitle: "Everything you need to know before you take your seat.",
};

export const EVENT_DATE = {
  label: "Date",
  value: "26 – 27 Dec 2026",
  // Shown as big numerals
  days: ["26", "27"],
  monthYear: "December 2026",
  note: "Saturday & Sunday",
};

export const EVENT_VENUE = {
  label: "Venue",
  value: "Pandit Dindayal Upadhyay Auditorium",
  note: "Raipur (CG)",
  // Full state name, shown under the city in the show strip
  state: "Chhattisgarh",
  // Opens Google Maps for directions
  mapHref:
    "https://www.google.com/maps/search/?api=1&query=Pandit+Dindayal+Upadhyay+Auditorium+Raipur",
};

export type EventFact = {
  icon: "clock" | "age" | "language" | "mask";
  label: string;
  value: string;
};

export const EVENT_FACTS: readonly EventFact[] = [
  { icon: "clock", label: "Duration", value: "3 Hours" },
  { icon: "age", label: "Age Limit", value: "8 yrs +" },
  { icon: "language", label: "Language", value: "Hindi" },
  { icon: "mask", label: "Genre", value: "Drama, Mythological" },
];
