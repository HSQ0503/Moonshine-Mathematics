import katex from "katex";
import { type ReactNode } from "react";

type KProps = { tex: string; display?: boolean };

export function K({ tex, display = false }: KProps) {
  const html = katex.renderToString(tex, { displayMode: display, throwOnError: false });
  return display ? (
    <div className="katex-display" dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  );
}

type ThmKind = "definition" | "theorem" | "proposition" | "lemma" | "corollary" | "proof";

const TITLES: Record<ThmKind, string> = {
  definition: "Definition",
  theorem: "Theorem",
  proposition: "Proposition",
  lemma: "Lemma",
  corollary: "Corollary",
  proof: "Proof",
};

type ThmBlockProps = {
  kind?: ThmKind;
  n?: string | number;
  name?: string;
  children: ReactNode;
};

export function ThmBlock({ kind = "theorem", n, name, children }: ThmBlockProps) {
  return (
    <div className={`thmblock ${kind}`}>
      {kind !== "proof" && (
        <span className="label">
          {TITLES[kind]}{n != null ? ` ${n}` : ""}
          {name && <span className="name">({name})</span>}
        </span>
      )}
      {children}
    </div>
  );
}

export function FNote({ n }: { n: number }) {
  return <sup className="footnote-ref">[{n}]</sup>;
}

export function Footnotes({ items }: { items: Array<[number, ReactNode]> }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="footnotes">
      <div className="label">Footnotes</div>
      <ol>
        {items.map(([n, content]) => <li key={n}>{content}</li>)}
      </ol>
    </div>
  );
}

