"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { type Post } from "@/lib/data";

export function ArchiveView({ posts, tags }: { posts: Post[]; tags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const filtered = activeTag ? posts.filter(p => p.tag === activeTag) : posts;

  const byYear = useMemo(() => {
    const groups: Record<string, Post[]> = {};
    filtered.forEach(p => {
      const y = String(new Date(p.date).getFullYear());
      (groups[y] = groups[y] || []).push(p);
    });
    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [filtered]);

  return (
    <section className="archive-page">
      <div className="archive-head">
        <div>
          <h2>Archive</h2>
          <div className="archive-head-meta">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
            {activeTag && <> · filed under <em>{activeTag}</em></>}
          </div>
        </div>
        <div className="tag-filter">
          <button className={`tag ${!activeTag ? "active" : ""}`} onClick={() => setActiveTag(null)}>All</button>
          {tags.map(t => (
            <button key={t} className={`tag ${activeTag === t ? "active" : ""}`} onClick={() => setActiveTag(t)}>{t}</button>
          ))}
        </div>
      </div>
      {byYear.map(([year, list]) => (
        <div className="archive-year" key={year}>
          <div className="y">{year}</div>
          <ul>
            {list.map(p => (
              <li key={p.id}>
                <span className="n">{p.number}</span>
                <span className="d">
                  {new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase()}
                </span>
                <span className="t">
                  <Link href={`/post/${p.slug}`}>{p.title}</Link>
                </span>
                <span className="tg">{p.tag}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
