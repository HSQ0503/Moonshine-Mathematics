import Link from "next/link";
import { Masthead, Almanac, Asterism, Footer } from "@/components/Chrome";
import { MoonPhaseGlyph } from "@/components/Moon";
import { FeaturedFigure } from "@/components/FeaturedFigure";
import { formatDate, phaseIndex } from "@/lib/data";
import { getPublishedPosts } from "@/lib/db";

export default async function HomePage() {
  const published = await getPublishedPosts();
  if (published.length === 0) {
    return (
      <div className="shell">
        <Masthead page="home" />
        <p className="lede" style={{ marginTop: 96 }}>
          <span className="drop">No entries yet</span>. Once the journal is seeded, entries will appear here.
        </p>
        <Footer />
      </div>
    );
  }
  const featured = published.find(p => p.featured) ?? published[0];
  const rest = published.filter(p => p.id !== featured.id);

  return (
    <div className="shell">
      <Masthead page="home" />
      <p className="lede">
        <span className="drop">An independent journal of mathematical self-study</span>. Volume I
        collects entries on the foundations of linear algebra, from vector spaces through the
        spectral theorem and singular value decomposition.
      </p>

      <Almanac />

      <section className="featured">
        <div>
          <div className="stamp">Tonight&apos;s entry · No. {featured.number}</div>
          <h2>
            <Link href={`/post/${featured.slug}`}>{featured.title}</Link>
          </h2>
          <p className="excerpt">{featured.excerpt}</p>
          <div className="meta">
            <span>{formatDate(featured.date)}</span>
            <span className="dot" />
            <span>{featured.readingTime} min</span>
            <span className="dot" />
            <span className="tag">{featured.tag}</span>
          </div>
        </div>
        <div className="figure">
          <FeaturedFigure />
        </div>
      </section>

      <Asterism />

      <div className="section-label">The Journal · entries to date</div>
      <ul className="post-list">
        {rest.map(p => {
          const idx = phaseIndex(new Date(p.date));
          return (
            <li key={p.id}>
              <span className="phase-mark">
                <MoonPhaseGlyph idx={idx} size={28} light="var(--moon)" dark="var(--rule-soft)" />
              </span>
              <span className="num">№ {p.number}</span>
              <div>
                <div className="title">
                  <Link href={`/post/${p.slug}`}>{p.title}</Link>
                </div>
                <div className="sub">{p.subtitle}</div>
              </div>
              <div className="meta">
                <span className="date">{formatDate(p.date)}</span>
                <span className="tag">{p.tag}</span>
              </div>
            </li>
          );
        })}
      </ul>

      <Asterism char="⁂" />

      <Footer />
    </div>
  );
}
