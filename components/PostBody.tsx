import Image from "next/image";
import type { ReactNode } from "react";
import { K, ThmBlock } from "./Math";

type ThmKind = "definition" | "theorem" | "proposition" | "lemma" | "corollary" | "proof";

function renderInline(text: string, keyBase: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let key = 0;
  const re = /(\$[^$\n]+\$)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[\^(\d+)\])|(!\[[^\]]*\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<K key={`${keyBase}-m${key++}`} tex={m[1].slice(1, -1)} />);
    else if (m[2]) parts.push(<strong key={`${keyBase}-b${key++}`}>{m[2].slice(2, -2)}</strong>);
    else if (m[3]) parts.push(<em key={`${keyBase}-i${key++}`}>{m[3].slice(1, -1)}</em>);
    else if (m[5]) parts.push(<sup key={`${keyBase}-f${key++}`} className="footnote-ref">[{m[5]}]</sup>);
    else if (m[6]) {
      const inner = m[6];
      const alt = inner.slice(2, inner.indexOf("]"));
      const url = inner.slice(inner.indexOf("(") + 1, -1);
      parts.push(
        <Image
          key={`${keyBase}-img${key++}`}
          src={url}
          alt={alt}
          width={720}
          height={360}
          unoptimized
          style={{ display: "block", maxWidth: "100%", height: "auto", margin: "16px 0", border: "1px solid var(--rule)" }}
        />
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function PostBody({ src }: { src: string }) {
  const blocks: ReactNode[] = [];
  const lines = src.split("\n");
  let i = 0;
  const footnoteDefs: Array<[number, ReactNode[]]> = [];

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
      const kind = (kindRaw || "theorem") as ThmKind;
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
      blocks.push(<h1 key={`h${i}`}>{renderInline(line.slice(2), `h${i}`)}</h1>);
      i++; continue;
    }

    if (line.startsWith("> ")) {
      const buf = [line.slice(2)];
      i++;
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].slice(2));
        i++;
      }
      blocks.push(<blockquote key={`q${i}`}>{renderInline(buf.join(" "), `q${i}`)}</blockquote>);
      continue;
    }

    const fnDef = line.match(/^\[\^(\d+)\]:\s*(.*)$/);
    if (fnDef) {
      footnoteDefs.push([Number(fnDef[1]), renderInline(fnDef[2], `fd${i}`)]);
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
      !lines[i].startsWith("> ") &&
      !lines[i].trim().startsWith(":::") &&
      !lines[i].trim().startsWith("$$") &&
      !/^\[\^\d+\]:/.test(lines[i])
    ) {
      buf.push(lines[i]); i++;
    }
    blocks.push(<p key={`p${i}`}>{renderInline(buf.join(" "), `p${i}`)}</p>);
  }

  if (footnoteDefs.length > 0) {
    blocks.push(
      <div className="footnotes" key="fn">
        <div className="label">Footnotes</div>
        <ol>
          {footnoteDefs
            .sort((a, b) => a[0] - b[0])
            .map(([n, content]) => <li key={n}>{content}</li>)}
        </ol>
      </div>
    );
  }

  return <>{blocks}</>;
}
