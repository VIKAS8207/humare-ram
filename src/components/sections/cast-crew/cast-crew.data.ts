import { IMAGES } from "@/config/images";

// Names and titles come from the artist list you shared. Check the spellings.
// Photos: drop <slug>.jpg into public/images/cast/ (slug = the `slug` field).
export const CAST_CREW_HEADER = {
  eyebrow: "The Ensemble",
  title: "Cast & Crew",
  subtitle:
    "The artists and storytellers who bring Humare Ram to life, live on stage.",
};

export type CastMember = {
  name: string;
  slug: string;
  role: string;
  /** Fixed image (overrides the cast/ folder), e.g. an existing cutout */
  image?: { src: string };
};

export const CAST: CastMember[] = [
  { name: "Gaurav Bhhardwaj", slug: "gaurav-bhhardwaj", role: "Director" },
  {
    name: "Ashutosh Rana",
    slug: "ashutosh-rana",
    role: "Actor · Ravan",
    image: IMAGES.ravan,
  },
  {
    name: "Rahul Bhuchar",
    slug: "rahul-bhuchar",
    role: "Actor, Producer · Lord Shri Ram",
    image: IMAGES.ram,
  },
  { name: "Danish Akhtar", slug: "danish-akhtar", role: "Actor" },
  { name: "Tarun Khanna", slug: "tarun-khanna", role: "Actor" },
  { name: "Deepti Kumar", slug: "deepti-kumar", role: "Actor" },
  { name: "Amrita Parihar", slug: "amrita-parihar", role: "Actor" },
  { name: "Sonu Nigam", slug: "sonu-nigam", role: "Singer" },
  { name: "Shankar Mahadevan", slug: "shankar-mahadevan", role: "Singer" },
  { name: "Kailash Kher", slug: "kailash-kher", role: "Singer" },
  { name: "Bhanu Pratap Singh", slug: "bhanu-pratap-singh", role: "Actor" },
  { name: "Karan Sharma", slug: "karan-sharma", role: "Actor" },
];

export const CREW: { role: string; names: string }[] = [
  { role: "Director", names: "Gaurav Bhhardwaj" },
  { role: "Writer", names: "Rahul Bhuchar" },
  { role: "Producer", names: "Rahul Bhuchar" },
  { role: "Lyrics", names: "Alok Shrivastava & Ram Kumar Singh" },
  { role: "Music", names: "Udbhav Ojha & Saurabh Mehta" },
  { role: "Music Label", names: "T-Series" },
  { role: "Presented by", names: "Havells" },
];
