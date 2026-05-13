import Link from "next/link";
import { ScrollMoon } from "./ScrollMoon";
import { Moon, type Phase } from "./Moon";

type PageKey = "home" | "about" | "archive" | "post" | "admin";

export function Masthead({ page }: { page: PageKey }) {
  const isJournal = page === "home" || page === "post";
  return (
    <header className="masthead">
      <Link href="/" className="masthead-title">
        <span className="masthead-moon"><ScrollMoon size={36} /></span>
        <span>
          <span className="masthead-name">Moonshine Mathematics</span>
          <span className="masthead-tag">A journal kept by lamplight · est. on the new moon, MMXXV</span>
        </span>
      </Link>
      <nav className="nav">
        <Link href="/" className={isJournal ? "active" : ""}>Journal</Link>
        <Link href="/archive" className={page === "archive" ? "active" : ""}>Archive</Link>
        <Link href="/about" className={page === "about" ? "active" : ""}>About</Link>
        <Link href="/admin" className={page === "admin" ? "active" : ""}>Editor</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cycle" aria-hidden>
        {[0, 1, 2, 3, 4, 5, 6, 7].map(p => (
          <div key={p} className={`cell ${p === 4 ? "full" : ""}`}>
            <Moon
              phase={p as Phase}
              size={p === 4 ? 18 : 13}
              tone={p === 4 ? "gold" : "vellum"}
              glow={p === 4}
            />
          </div>
        ))}
      </div>
      <div className="footer-meta">
        <div className="col"><em>Kept since the new moon, November 2025</em></div>
        <div className="col center">© {new Date().getFullYear()} Moonshine Mathematics</div>
        <div className="col right"><em>RSS · Atom · gershgorindisk@gmail.com</em></div>
      </div>
    </footer>
  );
}
