import Link from "next/link";
import { Masthead, Footer } from "@/components/Chrome";
import { formatDate } from "@/lib/data";
import { getPublishedPosts } from "@/lib/db";

export default async function HomePage() {
  const posts = await getPublishedPosts();

  return (
    <div className="shell">
      <Masthead page="home" />
      <p className="lede">
        Notes on linear algebra by J. Calder. Work in progress, read at your own risk.
      </p>

      {posts.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "var(--ink-mute)", marginTop: 64 }}>
          No entries yet.
        </p>
      ) : (
        <ul className="post-list">
          {posts.map(p => (
            <li key={p.id}>
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
      )}

      <Footer />
    </div>
  );
}
