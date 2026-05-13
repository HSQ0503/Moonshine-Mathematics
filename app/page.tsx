import Link from "next/link";
import { Masthead, Footer } from "@/components/Chrome";
import { PageContent } from "@/components/PageContent";
import { formatDate } from "@/lib/data";
import { getPublishedPosts, getPage, getSettings } from "@/lib/db";

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
    <div className="shell">
      <Masthead page="home" />
      {home?.content && (
        <div className="lede">
          <PageContent content={home.content} />
        </div>
      )}
      {settings.deskLabel && (
        <aside className="on-the-desk">
          <span className="label">On the desk</span>
          <span className="value">{settings.deskLabel}</span>
          {settings.deskSublabel && <span className="detail">{settings.deskSublabel}</span>}
        </aside>
      )}

      {recent.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "var(--ink-mute)", marginTop: 64 }}>
          No entries yet.
        </p>
      ) : (
        <>
          <ul className="post-list">
            {recent.map(p => (
              <li key={p.id}>
                <div className="post-list-num">№ {p.number}</div>
                <div className="post-list-main">
                  <Link href={`/post/${p.slug}`} className="post-list-title">{p.title}</Link>
                  <div className="post-list-sub">{p.subtitle}</div>
                </div>
                <div className="post-list-meta">
                  <span>{formatDate(p.date)}</span>
                  <span className="post-list-tag">{p.tag}</span>
                </div>
              </li>
            ))}
          </ul>
          {hasMore && (
            <p className="see-all">
              <Link href="/archive">See all {posts.length} entries in the archive →</Link>
            </p>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}
