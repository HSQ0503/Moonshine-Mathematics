import Link from "next/link";
import { BigMoon, MoonPhaseGlyph } from "./Moon";
import { ReadingMoon } from "./ReadingMoon";
import { ThemeToggle } from "./ThemeToggle";
import { TODAY, moonPhase, phaseIndex, phaseName } from "@/lib/data";

export function Asterism({ tight, char = "✦" }: { tight?: boolean; char?: string }) {
  return (
    <div className={`asterism ${tight ? "tight" : ""}`}>
      <span className="star">{char}</span>
    </div>
  );
}

export function MidnightBand() {
  const idx = phaseIndex(TODAY);
  const phases = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="midnight-band">
      <div className="inner">
        <div className="left">ISSN 2026–MOON · Vol. I · No. XV</div>
        <div className="moonphase-row">
          {phases.map(p => (
            <span key={p} className={`phase ${p === idx ? "now" : ""}`}>
              <MoonPhaseGlyph idx={p} />
            </span>
          ))}
          <span className="label">tonight — {phaseName(idx)}</span>
        </div>
        <div className="right" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14 }}>
          <span className="observatory">▲ 23:47 · ☾ alt. 41° · transit 02:13</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export function Brand({ subtitle = true, reading = false }: { subtitle?: boolean; reading?: boolean }) {
  return (
    <div className="brand">
      <div className="moon-art">{reading ? <ReadingMoon size={52} /> : <BigMoon size={52} />}</div>
      <h1 className="title"><em>Moonshine</em> Mathematics</h1>
      {subtitle && (
        <>
          <div className="undertitle">a journal of nocturnal study</div>
          <div className="latin">scientia per noctem · scientia per lunam</div>
        </>
      )}
    </div>
  );
}

type PageKey = "home" | "about" | "archive" | "post" | "admin";

export function Masthead({ page, compact = false, reading = false }: { page: PageKey; compact?: boolean; reading?: boolean }) {
  const dateStr = TODAY.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <header>
      <MidnightBand />
      <div className="masthead">
        <Brand subtitle={!compact} reading={reading} />
        <div className="masthead-meta">
          <div className="left">
            <span className="stamp">In this issue</span>
            Axler · ch. vii — self-adjoint operators
          </div>
          <div className="right">
            <span className="stamp">{dateStr}</span>
            Volume I · Issue No. XV · Self-published
          </div>
        </div>
      </div>
      <nav className="nav">
        <Link href="/" className={page === "home" || page === "post" ? "active" : ""}>Journal</Link>
        <span className="sep">✦</span>
        <Link href="/archive" className={page === "archive" ? "active" : ""}>Archive</Link>
        <span className="sep">✦</span>
        <Link href="/about" className={page === "about" ? "active" : ""}>Colophon</Link>
        <span className="sep">✦</span>
        <Link href="/admin" className={page === "admin" ? "active" : ""}>Editorial</Link>
      </nav>
    </header>
  );
}

export function Almanac() {
  const idx = phaseIndex(TODAY);
  const illum = Math.round(50 * (1 - Math.cos(2 * Math.PI * moonPhase(TODAY))));
  return (
    <div className="almanac">
      <div className="cell phase-cell">
        <div className="moon-art">
          <MoonPhaseGlyph idx={idx} size={56} />
        </div>
        <div>
          <div className="label">lunar phase</div>
          <div className="value">{phaseName(idx)}</div>
          <div className="sub">illumination {illum}%</div>
        </div>
      </div>
      <div className="cell">
        <div className="label">primary text</div>
        <div className="value"><span className="accent">Axler</span>, ch. vii</div>
        <div className="sub">linear algebra · 4th ed</div>
      </div>
      <div className="cell">
        <div className="label">current topic</div>
        <div className="value">the spectral theorem</div>
        <div className="sub">§§ 6.A – 7.C</div>
      </div>
      <div className="cell">
        <div className="label">forthcoming</div>
        <div className="value">singular values</div>
        <div className="sub">scheduled for Vol. II</div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div>© mmxxvi · Moonshine Mathematics</div>
      <div>✦ Set in EB Garamond ✦ Composed by lamp-light ✦</div>
      <div>colophon · rss · index</div>
    </footer>
  );
}
