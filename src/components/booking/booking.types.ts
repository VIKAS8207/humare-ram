export type Venue = {
  id: string;
  name: string;
  city: string;
  address: string;
};

/** One show day. `date` is YYYY-MM-DD, `times` are 24h "HH:mm". */
export type ShowDay = { date: string; times: string[] };

export type SeatCategory = {
  id: string;
  name: string;
  price: number; // INR
  /** Seat colour on the plan (hex) */
  color: string;
};

export type Selection = {
  venueId: string | null;
  date: string | null;
  time: string | null;
  /** How many seats the user wants — chosen first on the seats step */
  quantity: number | null;
  seats: string[]; // e.g. "A7"
};

export type Attendee = { name: string; email: string; phone: string };

export type Confirmation = { reference: string };
