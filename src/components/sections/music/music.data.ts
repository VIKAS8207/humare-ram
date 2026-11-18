// Content copied from the reference. Add/remove singers freely.
// Photos: drop a file named after the slug into public/images/singers/
// (e.g. shankar-mahadevan.jpg). Without a photo a monogram is shown.
export const MUSIC_HEADER = {
  eyebrow: "The Sound of the Divine",
  title: "Legends of Music",
  subtitle:
    "Original compositions released on T-Series — voices that make this epic eternal",
};

export const MUSIC_EP = {
  label: "Six-track EP",
  label2: "Released on T-Series",
  intro:
    "A six-track extended play (EP) was released by T-Series exclusively for Humare Ram. Featuring India's most iconic playback voices — crafted exclusively for this production.",
  credits: [
    { role: "Lyrics", names: "Alok Shrivastava & Ram Kumar Singh" },
    { role: "Music", names: "Udbhav Ojha & Saurabh Mehta" },
  ],
};

export type Singer = {
  name: string;
  slug: string;
  description: string;
  badge?: string;
};

export const SINGERS: Singer[] = [
  {
    name: "Shankar Mahadevan",
    slug: "shankar-mahadevan",
    description:
      "Legendary Bollywood playback maestro — his powerful voice elevates the devotional core of the production",
    badge: "T-Series EP",
  },
  {
    name: "Sonu Nigam",
    slug: "sonu-nigam",
    description:
      "One of India's most celebrated singers — his voice forms the emotional heart of key compositions",
  },
  {
    name: "Kailash Kher",
    slug: "kailash-kher",
    description:
      "Known for his spiritual Sufi-folk style — his contributions lend the production its raw, earthy devotion",
  },
];
