import Link from "next/link";
import { Masthead, Footer } from "@/components/Chrome";
import { PageContent } from "@/components/PageContent";
import { Moon, phaseName, type Phase } from "@/components/Moon";
import { CycleRibbon } from "@/components/CycleRibbon";
import { FloatingScrollMoon } from "@/components/ScrollMoon";
import { Asterism } from "@/components/Asterism";
import { formatDate, phaseFor, cycleFor, toRoman, romanize, type Post } from "@/lib/data";
import { getPublishedPosts, getPage, getSettings } from "@/lib/db";
import type { Settings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, home, settings] = await Promise.all([
    getPublishedPosts(),
    getPage("home"),
    getSettings(),
  ]);

  const RECENT_COUNT = 8;
  const recent = posts.slice(0, RECENT_COUNT);
  const hasMore = posts.length > RECENT_COUNT;

  return (
    <>
      <FloatingScrollMoon />
      <div className="shell">
        <Masthead page="home" />
        <CycleRibbon />

        <Currents settings={settings} posts={posts} />

        <section style={{ marginBottom: 56 }}>
          <h3 className="section-marker">
            <span className="glyph">✶</span> A note from the author
          </h3>
          {home?.content ? (
            <div className="lede">
              <span className="dropmoon"><Moon phase={2} size={32} tone="gold" glow /></span>
              <PageContent content={home.content} />
            </div>
          ) : (
            <p style={{ fontStyle: "italic", color: "var(--ink-mute)" }}>
              No introduction yet.
            </p>
          )}
        </section>

        <Asterism glyph="✦ ✦ ✦" />

        {recent.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "var(--ink-mute)", marginTop: 64 }}>
            No entries yet.
          </p>
        ) : (
          <RecentEntries posts={recent} totalCount={posts.length} hasMore={hasMore} />
        )}

        <Footer />
      </div>
    </>
  );
}

function RecentEntries({ posts, totalCount, hasMore }: { posts: Post[]; totalCount: number; hasMore: boolean }) {
  return (
    <section>
      <h3 className="section-marker">
        <span className="glyph">✶</span> Recent entries
        <span className="count">— {posts.length} of {totalCount}, latest first</span>
      </h3>
      <div className="entries-wrap">
        {posts.map(p => {
          const ph = phaseFor(p.number);
          const cy = cycleFor(p.number);
          return (
            <article className="entry" key={p.id}>
              <div className="entry-moon">
                <Moon phase={ph} size={36} tone={ph === 4 ? "gold" : "vellum"} glow={ph === 4} />
              </div>
              <div className="entry-cycle">
                <span className="roman">№ {romanize(p.number)}</span>
                <span className="phase">{phaseName(ph)}</span>
                <span>Cycle {toRoman(cy)}</span>
              </div>
              <div className="entry-main">
                <Link href={`/post/${p.slug}`} className="entry-title">{p.title}</Link>
                <div className="entry-sub">{p.subtitle}</div>
              </div>
              <div className="entry-meta">
                <span className="date">{formatDate(p.date)}</span>
                <span className="tag">{p.tag}</span>
              </div>
            </article>
          );
        })}
      </div>
      {hasMore && (
        <p className="see-all">
          <Link href="/archive">See all {totalCount} entries in the archive →</Link>
        </p>
      )}
    </section>
  );
}

function Currents({ settings, posts }: { settings: Settings; posts: Post[] }) {
  const rows: Array<{ phase: Phase; term: string; value: string; detail?: string }> = [];
  if (settings.deskLabel) {
    rows.push({ phase: 4, term: "On the desk", value: settings.deskLabel, detail: settings.deskSublabel || undefined });
  }
  if (settings.currentsReading) {
    rows.push({ phase: 2, term: "Reading", value: settings.currentsReading });
  }
  if (settings.currentsResearch) {
    rows.push({ phase: 6, term: "Researching", value: settings.currentsResearch });
  }
  if (settings.currentsWriting) {
    rows.push({ phase: 3, term: "Writing", value: settings.currentsWriting });
  }
  if (rows.length === 0) return null;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const nextCycle = posts.length > 0 ? cycleFor(String(Number(posts[0].number) + 1)) : 1;

  return (
    <section className="currents" aria-label="Currents">
      <div className="currents-head">
        <span className="stamp">✶ Currents <em>as of {dateStr}</em></span>
        <span className="stamp">cycle <em>{toRoman(nextCycle)}</em></span>
      </div>
      <dl className="currents-grid">
        {rows.map(r => (
          <div className="currents-row" key={r.term}>
            <span className="currents-icon"><Moon phase={r.phase} size={16} /></span>
            <dt>{r.term}</dt>
            <dd>
              <span>{r.value}</span>
              {r.detail && <span className="detail">{r.detail}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
