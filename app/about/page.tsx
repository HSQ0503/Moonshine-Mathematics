import { Masthead, Footer } from "@/components/Chrome";
import { PageContent } from "@/components/PageContent";
import { Moon, type Phase } from "@/components/Moon";
import { getPage, getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

const JOURNAL_START = new Date(Date.UTC(2025, 10, 1));

function timelineMonths(now: Date) {
  const cells: Array<{ label: string; phase: Phase; active: boolean }> = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(Date.UTC(JOURNAL_START.getUTCFullYear(), JOURNAL_START.getUTCMonth() + i, 1));
    const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
    const active = next.getTime() <= now.getTime() + 31 * 86_400_000;
    cells.push({
      label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" }).replace(" ", " '").replace(", ", " '"),
      phase: (i % 8) as Phase,
      active,
    });
  }
  return cells;
}

export default async function AboutPage() {
  const [page, settings] = await Promise.all([getPage("about"), getSettings()]);
  const title = page?.title ?? "About this journal";
  const content = page?.content ?? "";
  const months = timelineMonths(new Date());

  const facts: Array<[string, string]> = [
    ["Name", settings.authorName || "Work in progress ;)"],
    ["Begun", "on the new moon, November 2025"],
    ["Currently reading", settings.currentsReading || settings.deskLabel || "—"],
    ["Pace", "roughly one entry per lunar cycle"],
    ["Hours kept", "22:00 — 03:00, irregular"],
    ["Correspondence", "gershgorindisk@gmail.com"],
  ];

  return (
    <div className="shell">
      <Masthead page="about" />
        <div className="about-grid">
          <article className="about-prose">
            <h1>{title}</h1>
            {content ? (
              <PageContent content={content} />
            ) : (
              <p style={{ fontStyle: "italic", color: "var(--ink-mute)" }}>
                Nothing here yet.
              </p>
            )}
          </article>

          <aside className="about-card">
            <div className="label">✶ Vital statistics</div>
            <dl>
              {facts.map(([k, v]) => (
                <div className="fact" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <div className="lunar-timeline">
          <div className="lt-head">
            <span className="lt-title">✶ The first lunar year</span>
            <span className="lt-meta">a year of cycles, beginning new moon, Nov 2025</span>
          </div>
          <div className="lunar-timeline-track">
            {months.map((mo, i) => (
              <div className="tl-cell" key={i}>
                <span className="swatch">
                  <Moon
                    phase={mo.phase}
                    size={mo.active ? 24 : 16}
                    tone={mo.active ? (mo.phase === 4 ? "gold" : "vellum") : "vellum"}
                    glow={mo.active && mo.phase === 4}
                  />
                </span>
                <span className="tl-month" style={{ opacity: mo.active ? 1 : 0.45 }}>{mo.label}</span>
              </div>
            ))}
          </div>
        </div>

      <Footer />
    </div>
  );
}
