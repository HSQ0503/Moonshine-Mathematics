"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { type Post, phaseFor, cycleFor, toRoman, romanize } from "@/lib/data";
import { Moon, type Phase } from "@/components/Moon";

export function ArchiveView({ posts, tags }: { posts: Post[]; tags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const filtered = activeTag ? posts.filter(p => p.tag === activeTag) : posts;

  const cycles = useMemo(() => {
    const groups: Record<string, Post[]> = {};
    filtered.forEach(p => {
      const c = String(cycleFor(p.number));
      (groups[c] = groups[c] || []).push(p);
    });
    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [filtered]);

  return (
    <section>
      <div className="archive-head">
        <div>
          <h2>The Archive</h2>
          <div className="archive-head-meta">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"} across {cycles.length} {cycles.length === 1 ? "lunar cycle" : "lunar cycles"}
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

      {cycles.map(([cycle, list]) => {
        const startDate = new Date(list[list.length - 1].date);
        const endDate = new Date(list[0].date);
        const sameYear = startDate.getFullYear() === endDate.getFullYear();
        const span = sameYear
          ? `${startDate.toLocaleString("en-US", { month: "short" })} – ${endDate.toLocaleString("en-US", { month: "short", year: "numeric" })}`
          : `${startDate.toLocaleString("en-US", { month: "short", year: "numeric" })} – ${endDate.toLocaleString("en-US", { month: "short", year: "numeric" })}`;
        const phasesInCycle = new Set(list.map(p => phaseFor(p.number)));
        return (
          <div className="cycle-block" key={cycle}>
            <div className="cycle-header">
              <div className="cycle-num">Cycle {toRoman(Number(cycle))}</div>
              <div className="year">{endDate.getFullYear()}</div>
              <div className="span">{span}</div>
              <div className="mini-cycle">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(p => {
                  const present = phasesInCycle.has(p as Phase);
                  return (
                    <Moon
                      key={p}
                      phase={p as Phase}
                      size={present ? 14 : 10}
                      tone={present ? "gold" : "vellum"}
                    />
                  );
                })}
              </div>
            </div>
            <ul className="archive-list">
              {list.map(p => (
                <li key={p.id}>
                  <span className="a-moon"><Moon phase={phaseFor(p.number)} size={18} /></span>
                  <span className="a-num">№ {romanize(p.number)}</span>
                  <span className="a-date">
                    {new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase()}
                  </span>
                  <span className="a-title">
                    <Link href={`/post/${p.slug}`}>{p.title}</Link>
                    {p.subtitle && <span className="sub">{p.subtitle}</span>}
                  </span>
                  <span className="a-tag">{p.tag}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
