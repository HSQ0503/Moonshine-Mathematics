import { Moon, PHASE_SHORT, type Phase } from "./Moon";
import { toRoman } from "@/lib/data";

const SYNODIC_DAYS = 29.5305882;
const REFERENCE_NEW_MOON = new Date(Date.UTC(2025, 10, 20)); // 2025-11-20 UTC

function daysBetween(a: Date, b: Date) {
  return (b.getTime() - a.getTime()) / 86_400_000;
}

function currentLunation(now: Date) {
  const elapsed = daysBetween(REFERENCE_NEW_MOON, now);
  const lunations = Math.floor(elapsed / SYNODIC_DAYS) + 1;
  const dayInCycle = ((elapsed % SYNODIC_DAYS) + SYNODIC_DAYS) % SYNODIC_DAYS;
  const phase = Math.min(7, Math.floor((dayInCycle / SYNODIC_DAYS) * 8)) as Phase;
  return { lunations, dayInCycle, phase };
}

function phaseStartDate(now: Date, phaseIdx: number) {
  const elapsed = daysBetween(REFERENCE_NEW_MOON, now);
  const cycleStartOffset = Math.floor(elapsed / SYNODIC_DAYS) * SYNODIC_DAYS;
  const offsetDays = cycleStartOffset + (phaseIdx * SYNODIC_DAYS) / 8;
  const d = new Date(REFERENCE_NEW_MOON.getTime() + offsetDays * 86_400_000);
  return d;
}

export function CycleRibbon() {
  const now = new Date();
  const { lunations, dayInCycle, phase } = currentLunation(now);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const phaseLabel = ["new moon", "waxing crescent", "first quarter", "waxing gibbous",
                      "full moon", "waning gibbous", "last quarter", "waning crescent"][phase];

  return (
    <section className="cycle-strip" aria-label="Current lunar cycle">
      <div className="cycle-strip-head">
        <span>✶ The Cycle · Lunation <em>{toRoman(lunations)}</em></span>
        <span className="pill">
          {monthLabel} — currently <em className="accent">{phaseLabel}</em>, day {Math.round(dayInCycle)} of {Math.round(SYNODIC_DAYS)}
        </span>
      </div>
      <div className="cycle-grid">
        {[0, 1, 2, 3, 4, 5, 6, 7].map(p => (
          <div key={p} className={`cycle-cell ${p === phase ? "active" : ""}`}>
            <span className="swatch">
              <Moon phase={p as Phase} size={24} tone={p === phase ? "gold" : "vellum"} />
            </span>
            <span className="label">{PHASE_SHORT[p]}</span>
            <span className="date">{fmt(phaseStartDate(now, p))}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
