import Link from "next/link";

type PageKey = "home" | "about" | "archive" | "post" | "admin";

export function Masthead({ page }: { page: PageKey }) {
  return (
    <header className="masthead">
      <Link href="/" className="masthead-title">Moonshine Mathematics</Link>
      <nav className="nav">
        <Link href="/" className={page === "home" || page === "post" ? "active" : ""}>Journal</Link>
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
      © {new Date().getFullYear()} Moonshine Mathematics
    </footer>
  );
}
