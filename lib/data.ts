export type Post = {
  id: string;
  number: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  readingTime: number;
  tag: string;
  status: "published" | "draft";
  featured?: boolean;
  views: number;
  body?: string;
};

export type Activity = {
  ts: string;
  action: string;
  what: string;
};

export const author = {
  name: "J. Calder",
  initials: "JC",
  bio: "Self-studying mathematics by moonlight. Currently working through linear algebra — Axler, mostly, with Strang for intuition and Halmos for old-world clarity.",
};

export const tags = [
  "Vector Spaces", "Linear Maps", "Bases", "Determinants",
  "Eigenvalues", "Inner Products", "Spectral Theory",
  "Dual Spaces", "Operators", "Notebook",
];

export const activity: Activity[] = [
  { ts: "21:14", action: "Published",  what: "The Spectral Theorem, slowly" },
  { ts: "20:42", action: "Edited",     what: "The Spectral Theorem, slowly — added §3" },
  { ts: "19:08", action: "Uploaded",   what: "fig-spectral-decomp.svg" },
  { ts: "18:31", action: "Created",    what: "Draft: Jordan normal form, a first attempt" },
  { ts: "Yest.", action: "Edited",     what: "Determinants are volume, signed" },
  { ts: "May 02",action: "Tagged",     what: "Eigenvalues as fixed directions → Eigenvalues" },
];

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const SYNODIC = 29.530588853;
const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

export function moonPhase(date: Date) {
  const diff = (date.getTime() - REF_NEW_MOON) / 86400000;
  const phase = ((diff % SYNODIC) + SYNODIC) % SYNODIC;
  return phase / SYNODIC;
}

export function phaseIndex(date: Date) {
  return Math.round(moonPhase(date) * 8) % 8;
}

export function phaseName(idx: number) {
  return [
    "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
    "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent",
  ][idx];
}

export const TODAY = new Date(2026, 4, 11);
