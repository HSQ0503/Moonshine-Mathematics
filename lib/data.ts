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

export const author = {
  name: "J. Calder",
  initials: "JC",
  bio: "Self-studying mathematics by moonlight. Currently working through linear algebra — Axler, mostly, with Strang for intuition and Halmos for old-world clarity.",
};

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatRelative(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.round((now - then) / 1000);
  if (diffSec < 30) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  if (diffHr < 48) return "Yest.";
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
