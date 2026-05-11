"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ChangeEvent, type DragEvent } from "react";
import { BigMoon } from "@/components/Moon";
import { ThmBlock, K } from "@/components/Math";
import { tags as TAGS, activity as ACTIVITY, formatDate, type Post } from "@/lib/data";
import { savePost, removePost, signOut, type PostInput } from "./actions";

type Section = "dashboard" | "posts" | "editor" | "media" | "tags" | "settings";

const EDITOR_TEMPLATE = `# The shape of the question

I have spent four nights with the spectral theorem, and I think I finally see it.
It says something almost embarrassingly simple — and yet the proof took me three
notebook pages to convince myself of.

::: definition Self-adjoint
Let $V$ be a finite-dimensional inner product space. An operator $T: V \\to V$ is
self-adjoint if $\\langle Tv, w \\rangle = \\langle v, Tw \\rangle$ for all $v, w \\in V$.
:::

## Self-adjoint, in pictures

Before the theorem, the word *self-adjoint* felt to me like a bookkeeping
condition.[^1] What I missed was that this condition is precisely what forces an
operator to behave the way physical stretches behave: it has only real
eigenvalues, and eigenvectors for distinct eigenvalues are automatically
perpendicular.

$$
\\langle Tv, w \\rangle = \\langle v, Tw \\rangle \\quad\\text{for all } v, w \\in V.
$$

::: theorem Real Spectral Theorem
Let $V$ be finite-dimensional and let $T$ be self-adjoint. Then $V$ has an
orthonormal basis consisting of eigenvectors of $T$.
:::

[^1]: I am told this is roughly the content of Halmos, ch. 8. I have not yet looked.
`;

export function AdminApp({ initialPosts }: { initialPosts: Post[] }) {
  const [section, setSection] = useState<Section>("dashboard");
  const [editingId, setEditingId] = useState<string | null>(null);

  const openEditor = (id: string | null) => { setEditingId(id); setSection("editor"); };
  const switchSection = (s: Section) => { setSection(s); if (s !== "editor") setEditingId(null); };

  return (
    <div className="admin-shell">
      <AdminSide section={section} setSection={switchSection} />
      <main className="admin-main">
        {section === "dashboard" && <AdminDashboard posts={initialPosts} openEditor={openEditor} setSection={setSection} />}
        {section === "posts" && <AdminPosts posts={initialPosts} openEditor={openEditor} />}
        {section === "editor" && <AdminEditor posts={initialPosts} postId={editingId} setSection={setSection} />}
        {section === "media" && <AdminMedia />}
        {section === "tags" && <AdminTags posts={initialPosts} />}
        {section === "settings" && <AdminSettings />}
      </main>
    </div>
  );
}

function AdminSide({ section, setSection }: { section: Section; setSection: (s: Section) => void }) {
  const items: Array<{ k: Section; label: string }> = [
    { k: "dashboard", label: "Dashboard" },
    { k: "posts",     label: "All Posts" },
    { k: "editor",    label: "New Entry" },
    { k: "media",     label: "Media" },
    { k: "tags",      label: "Tags" },
    { k: "settings",  label: "Settings" },
  ];
  return (
    <aside className="admin-side">
      <div className="brand">
        <div className="glyph">
          <BigMoon size={18} />
          <h1>Moonshine</h1>
        </div>
        <div className="latin">editorial · admin</div>
      </div>
      <nav className="admin-nav">
        {items.map(it => (
          <a
            key={it.k}
            href="#"
            className={section === it.k ? "active" : ""}
            onClick={e => { e.preventDefault(); setSection(it.k); }}
          >
            <span className="dot" /> {it.label}
          </a>
        ))}
        <div style={{ borderTop: "1px solid var(--rule)", margin: "14px 0" }} />
        <Link href="/" style={{ borderBottom: "none" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="dot" /> ↩ View Journal
          </span>
        </Link>
        <form action={signOut}>
          <button type="submit" style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", padding: "10px 12px", color: "var(--ink-mute)", fontFamily: "var(--sans)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <span className="dot" /> Sign out
          </button>
        </form>
      </nav>
      <div className="user">
        <div className="av">JC</div>
        <div>
          <div className="name">J. Calder</div>
          <div className="role">Editor</div>
        </div>
      </div>
    </aside>
  );
}

function AdminDashboard({ posts, openEditor, setSection }: { posts: Post[]; openEditor: (id: string | null) => void; setSection: (s: Section) => void }) {
  const published = posts.filter(p => p.status === "published");
  const drafts = posts.filter(p => p.status === "draft");
  const totalViews = published.reduce((s, p) => s + (p.views || 0), 0);

  return (
    <>
      <div className="admin-bar">
        <div>
          <div className="crumbs">Editorial · Overview</div>
          <h2>Good evening, J.</h2>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn ghost" onClick={() => setSection("posts")}>All Posts</button>
          <button className="btn" onClick={() => openEditor(null)}>+ New Entry</button>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat"><div className="label">Published</div><div className="value">{published.length}</div><div className="delta">live in journal</div></div>
        <div className="stat"><div className="label">Drafts</div><div className="value">{drafts.length}</div><div className="delta">in progress</div></div>
        <div className="stat"><div className="label">Total readers</div><div className="value">{totalViews.toLocaleString()}</div><div className="delta">cumulative</div></div>
        <div className="stat"><div className="label">On the desk</div><div className="value">Axler</div><div className="delta">ch. 7 · self-adjoint</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        <section>
          <div className="section-label" style={{ margin: "4px 0 14px" }}>Recent entries</div>
          <PostsTable posts={posts.slice(0, 5)} onEdit={openEditor} />
        </section>

        <section className="activity">
          <div className="label">Recent activity</div>
          <ul>
            {ACTIVITY.map((a, i) => (
              <li key={i}>
                <span className="ts">{a.ts}</span>
                <span>
                  <span className="a-action">{a.action}</span>
                  {a.what}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function PostsTable({ posts, onEdit, onDelete }: { posts: Post[]; onEdit: (id: string) => void; onDelete?: (id: string) => void }) {
  return (
    <div className="admin-table">
      <div className="row head">
        <div>№</div><div>Title</div><div>Tag</div><div>Date</div><div>Status</div><div></div>
      </div>
      {posts.map(p => (
        <div className="row" key={p.id}>
          <div className="num">{p.number}</div>
          <div className="t">
            <button
              onClick={() => onEdit(p.id)}
              style={{ background: "transparent", border: "none", padding: 0, font: "inherit", color: "inherit", cursor: "pointer", textAlign: "left" }}
            >
              {p.title}
              <span className="sub">{p.subtitle}</span>
            </button>
          </div>
          <div className="tg">{p.tag}</div>
          <div className="d">{formatDate(p.date)}</div>
          <div><span className={`status ${p.status}`}>{p.status}</span></div>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="kebab" title="Edit" onClick={() => onEdit(p.id)}>›</button>
            {onDelete && (
              <button
                className="kebab"
                title="Delete"
                onClick={() => {
                  if (confirm(`Delete "${p.title}"? This cannot be undone.`)) onDelete(p.id);
                }}
              >×</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminPosts({ posts, openEditor }: { posts: Post[]; openEditor: (id: string | null) => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");
  const [q, setQ] = useState("");

  const filtered = posts.filter(p => {
    if (filter === "published" && p.status !== "published") return false;
    if (filter === "drafts" && p.status !== "draft") return false;
    if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const onDelete = (id: string) => {
    startTransition(async () => {
      await removePost(id);
      router.refresh();
    });
  };

  return (
    <>
      <div className="admin-bar">
        <div>
          <div className="crumbs">Editorial · Posts</div>
          <h2>All Entries{pending && <span style={{ marginLeft: 12, fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--mono)" }}>working…</span>}</h2>
        </div>
        <button className="btn" onClick={() => openEditor(null)}>+ New Entry</button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, gap: 16, alignItems: "center" }}>
        <div className="tag-filter">
          {([["all", "All"], ["published", "Published"], ["drafts", "Drafts"]] as const).map(([k, l]) => (
            <button key={k} className={`tag ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>
        <input
          className="admin-search"
          placeholder="Search entries…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        <PostsTable posts={filtered} onEdit={openEditor} onDelete={onDelete} />
      ) : (
        <div style={{ padding: "40px 20px", textAlign: "center", fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-mute)" }}>
          No entries match.
        </div>
      )}
    </>
  );
}

type Upload = { name: string; size: string; date: string };

function AdminEditor({ posts, postId, setSection }: { posts: Post[]; postId: string | null; setSection: (s: Section) => void }) {
  const router = useRouter();
  const existing = postId ? posts.find(p => p.id === postId) ?? null : null;
  const [title, setTitle] = useState(existing?.title ?? "Untitled entry");
  const [subtitle, setSub] = useState(existing?.subtitle ?? "A subtitle in italics.");
  const [tag, setTag] = useState(existing?.tag ?? "Linear Maps");
  const [readingTime, setRT] = useState(existing?.readingTime ?? 8);
  const [body, setBody] = useState(existing?.body ?? EDITOR_TEMPLATE);
  const [number, setNumber] = useState(existing?.number ?? "XVI");
  const [slugInput, setSlugInput] = useState(existing?.slug ?? "");
  const [date, setDate] = useState(existing?.date ?? new Date().toISOString().slice(0, 10));
  const [draft, setDraft] = useState(existing ? existing.status === "draft" : true);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [uploads, setUploads] = useState<Upload[]>([
    { name: "fig-spectral-decomp.svg", size: "12 kB", date: "today 19:08" },
  ]);

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  const effectiveSlug = slugInput || slugify(title);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOver(false);
    const files = Array.from(e.dataTransfer?.files ?? []);
    files.forEach(f => setUploads(u => [{ name: f.name, size: `${Math.ceil(f.size / 1024)} kB`, date: "just now" }, ...u]));
  };

  const onSave = async () => {
    setBusy(true);
    setErr(null);
    try {
      const input: PostInput = {
        id: existing?.id,
        number,
        slug: effectiveSlug,
        title,
        subtitle,
        excerpt: subtitle,
        date,
        readingTime,
        tag,
        status: draft ? "draft" : "published",
        body,
      };
      await savePost(input);
      setSavedAt(new Date());
      router.refresh();
      if (!existing) setSection("posts");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="admin-bar">
        <div>
          <div className="crumbs">
            Editorial · <a href="#" onClick={e => { e.preventDefault(); setSection("posts"); }} style={{ color: "var(--ink-mute)" }}>Posts</a> · {existing ? "Edit" : "New"}
          </div>
          <h2 style={{ fontStyle: "italic", color: "var(--ink-soft)" }}>{title || "Untitled entry"}</h2>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="editor-meta-line" style={{ fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {busy ? "SAVING…" : savedAt ? `SAVED ${savedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}` : "UNSAVED"}
          </span>
          <Toggle on={!draft} onChange={() => setDraft(d => !d)} label={draft ? "Draft" : "Published"} />
          <button className="btn ghost" onClick={() => setSection("posts")}>Discard</button>
          <button className="btn gold" onClick={onSave} disabled={busy}>{draft ? "Save Draft" : "Publish"}</button>
        </div>
      </div>

      {err && (
        <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "#a44", fontSize: 14, margin: "0 0 16px" }}>
          {err}
        </div>
      )}

      <div className="editor-grid">
        <div className="editor-pane">
          <div className="pane-label"><span>Compose</span><span>Markdown + LaTeX</span></div>

          <input className="input-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
          <input className="input-subtitle" value={subtitle} onChange={e => setSub(e.target.value)} placeholder="A subtitle, in italics." />

          <div className="input-meta">
            <span>№ <input value={number} onChange={e => setNumber(e.target.value)} style={{ width: 50 }} /></span>
            <span style={{ color: "var(--rule)" }}>·</span>
            <span>Slug <input value={slugInput} onChange={e => setSlugInput(e.target.value)} placeholder={slugify(title)} style={{ width: 180 }} /></span>
            <span style={{ color: "var(--rule)" }}>·</span>
            <span>Tag <select value={tag} onChange={e => setTag(e.target.value)}>
              {TAGS.map(t => <option key={t}>{t}</option>)}
            </select></span>
            <span style={{ color: "var(--rule)" }}>·</span>
            <span>Date <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: 120 }} /></span>
            <span style={{ color: "var(--rule)" }}>·</span>
            <span>Read <input type="number" value={readingTime} onChange={e => setRT(Number(e.target.value))} style={{ width: 40 }} /> min</span>
          </div>

          <div className="toolbar">
            <button onClick={() => setBody(b => b + "\n\n## Heading\n\n")}>H2</button>
            <button onClick={() => setBody(b => b + " *emph* ")}>Italic</button>
            <button onClick={() => setBody(b => b + " **bold** ")}>Bold</button>
            <span className="sep" />
            <button onClick={() => setBody(b => b + " $x^2 + y^2 = r^2$ ")}>Inline math</button>
            <button onClick={() => setBody(b => b + "\n\n$$\n  \\sum_{k=1}^{n} \\lambda_k\n$$\n\n")}>Display math</button>
            <span className="sep" />
            <button onClick={() => setBody(b => b + "\n\n::: theorem Statement\nThe content of the theorem.\n:::\n\n")}>Theorem</button>
            <button onClick={() => setBody(b => b + "\n\n::: definition Term\nThe content of the definition.\n:::\n\n")}>Definition</button>
            <button onClick={() => setBody(b => b + "\n\n::: proof\nThe proof.\n:::\n\n")}>Proof</button>
            <span className="sep" />
            <button onClick={() => setBody(b => b + "[^1]")}>Footnote</button>
          </div>

          <textarea className="body" value={body} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)} spellCheck={false} />

          <div
            className={`upload-zone ${over ? "over" : ""}`}
            onDragOver={e => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={handleDrop}
          >
            <div className="big">Drop a figure here</div>
            <div>or click to browse · SVG, PNG, PDF up to 4 MB (storage not wired yet)</div>
          </div>

          {uploads.length > 0 && (
            <div style={{ marginTop: 14, fontFamily: "var(--sans)", fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.1em" }}>
              <div style={{ textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 8 }}>Attached</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {uploads.map((u, i) => (
                  <li key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed var(--rule-soft)", fontSize: 12 }}>
                    <span style={{ fontFamily: "var(--serif)", color: "var(--ink)" }}>{u.name}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-faint)" }}>{u.size} · {u.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="preview-pane">
          <div className="pane-label"><span>Preview</span><span style={{ color: "var(--moon)" }}>● Live</span></div>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--moon)", marginBottom: 10 }}>
              Entry № {number} · {tag}
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 30, margin: "0 0 8px", letterSpacing: "-0.005em", lineHeight: 1.15 }}>
              {title || <span style={{ color: "var(--ink-faint)" }}>Untitled</span>}
            </h1>
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-mute)", margin: "0 0 16px", fontSize: 17 }}>{subtitle}</p>
            <div style={{ fontFamily: "var(--sans)", fontSize: 10.5, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-mute)", paddingTop: 12, borderTop: "1px solid var(--rule)", marginBottom: 24 }}>
              By J. Calder · {date} · {readingTime} min
            </div>
            <div className="preview-body">
              <MarkdownPreview src={body} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MarkdownPreview({ src }: { src: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = src.split("\n");
  let i = 0;

  const renderInline = (text: string, keyBase: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let key = 0;
    const re = /(\$[^$\n]+\$)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[\^(\d+)\])/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      if (m[1]) parts.push(<K key={`${keyBase}-m${key++}`} tex={m[1].slice(1, -1)} />);
      else if (m[2]) parts.push(<strong key={`${keyBase}-b${key++}`}>{m[2].slice(2, -2)}</strong>);
      else if (m[3]) parts.push(<em key={`${keyBase}-i${key++}`}>{m[3].slice(1, -1)}</em>);
      else if (m[5]) parts.push(<sup key={`${keyBase}-f${key++}`} style={{ color: "var(--moon)", fontSize: "0.7em" }}>[{m[5]}]</sup>);
      last = re.lastIndex;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("$$")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("$$")) { buf.push(lines[i]); i++; }
      i++;
      blocks.push(<K key={`d${i}`} display tex={buf.join("\n").trim()} />);
      continue;
    }

    if (line.trim().startsWith(":::")) {
      const header = line.replace(/^:::\s*/, "").trim();
      const [kindRaw, ...rest] = header.split(/\s+/);
      const kind = (kindRaw || "theorem") as "definition" | "theorem" | "proposition" | "lemma" | "corollary" | "proof";
      const name = rest.join(" ");
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(":::")) { buf.push(lines[i]); i++; }
      i++;
      blocks.push(
        <ThmBlock key={`t${i}`} kind={kind} name={name || undefined}>
          {buf.join("\n").split(/\n\n+/).map((para, idx) => (
            <p key={idx} style={{ margin: idx === 0 ? 0 : "10px 0 0" }}>{renderInline(para.replace(/\n/g, " "), `c${i}-${idx}`)}</p>
          ))}
        </ThmBlock>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(<h2 key={`h${i}`}>{renderInline(line.slice(3), `h${i}`)}</h2>);
      i++; continue;
    }
    if (line.startsWith("# ")) {
      blocks.push(<h1 key={`h${i}`} style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 24, margin: "24px 0 10px" }}>{renderInline(line.slice(2), `h${i}`)}</h1>);
      i++; continue;
    }

    const fnDef = line.match(/^\[\^(\d+)\]:\s*(.*)$/);
    if (fnDef) {
      blocks.push(
        <div key={`fd${i}`} style={{ fontSize: 13, color: "var(--ink-mute)", fontStyle: "italic", paddingLeft: 18, borderLeft: "2px solid var(--rule)", margin: "12px 0" }}>
          {fnDef[1]}. {renderInline(fnDef[2], `fd${i}`)}
        </div>
      );
      i++; continue;
    }

    if (line.trim() === "") { i++; continue; }
    const buf = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("##") &&
      !lines[i].startsWith("# ") &&
      !lines[i].trim().startsWith(":::") &&
      !lines[i].trim().startsWith("$$")
    ) {
      buf.push(lines[i]); i++;
    }
    blocks.push(<p key={`p${i}`}>{renderInline(buf.join(" "), `p${i}`)}</p>);
  }

  return <>{blocks}</>;
}

function Toggle({ on, onChange, label }: { on: boolean; onChange?: () => void; label: string }) {
  return (
    <button className={`toggle ${on ? "on" : ""}`} onClick={onChange} type="button">
      <span>{label}</span>
      <span className="knob" />
    </button>
  );
}

function AdminMedia() {
  const figs = [
    { n: "fig-spectral-decomp.svg", date: "May 04", size: "12 kB", post: "Spectral theorem" },
    { n: "fig-eigen-fixed.svg",     date: "Mar 27", size: "8 kB",  post: "Eigenvalues" },
    { n: "fig-determinant-cube.svg",date: "Apr 22", size: "14 kB", post: "Determinants" },
  ];
  return (
    <>
      <div className="admin-bar">
        <div><div className="crumbs">Editorial · Library</div><h2>Media</h2></div>
        <button className="btn">+ Upload</button>
      </div>
      <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-mute)", fontSize: 15, marginBottom: 20 }}>
        Storage is not wired to Supabase yet. The list below is illustrative.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {figs.map((f, i) => (
          <div key={i} style={{ border: "1px solid var(--rule)", background: "var(--vellum-warm)" }}>
            <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--rule)", background: "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(20,23,42,0.04) 6px, rgba(20,23,42,0.04) 7px)" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.1em" }}>{f.n.split(".").pop()?.toUpperCase()}</span>
            </div>
            <div style={{ padding: "12px 14px" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--ink)" }}>{f.n}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-mute)", marginTop: 6, display: "flex", justifyContent: "space-between" }}>
                <span>{f.post}</span><span>{f.size} · {f.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function AdminTags({ posts }: { posts: Post[] }) {
  return (
    <>
      <div className="admin-bar">
        <div><div className="crumbs">Editorial · Taxonomy</div><h2>Tags</h2></div>
      </div>
      <div className="admin-table">
        <div className="row head" style={{ gridTemplateColumns: "1fr 100px 140px 40px" }}>
          <div>Name</div><div>Entries</div><div>Last used</div><div></div>
        </div>
        {TAGS.map(t => {
          const count = posts.filter(p => p.tag === t && p.status === "published").length;
          const latest = posts.filter(p => p.tag === t).sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
          return (
            <div className="row" key={t} style={{ gridTemplateColumns: "1fr 100px 140px 40px" }}>
              <div className="t" style={{ fontStyle: "italic" }}>{t}</div>
              <div className="d">{count} entries</div>
              <div className="d">{latest ? formatDate(latest.date) : "—"}</div>
              <div></div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function AdminSettings() {
  return (
    <>
      <div className="admin-bar">
        <div><div className="crumbs">Editorial · Configuration</div><h2>Settings</h2></div>
      </div>
      <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-mute)", fontSize: 15, marginBottom: 20 }}>
        Journal-level settings are read-only at the moment.
      </div>
      <div style={{ maxWidth: 640 }}>
        <div className="field"><label>Journal title</label><input defaultValue="Moonshine Mathematics" disabled /></div>
        <div className="field"><label>Subtitle</label><input defaultValue="scientia per noctem · vol. i" disabled /></div>
        <div className="field"><label>Author name</label><input defaultValue="J. Calder" disabled /></div>
      </div>
    </>
  );
}
