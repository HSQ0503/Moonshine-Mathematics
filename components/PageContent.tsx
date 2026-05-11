import type { ReactNode } from "react";

function renderInline(text: string, baseKey: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*)|(\*[^*]+\*)|(_[^_]+_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={`${baseKey}-b${k++}`}>{m[1].slice(2, -2)}</strong>);
    else if (m[2]) parts.push(<em key={`${baseKey}-i${k++}`}>{m[2].slice(1, -1)}</em>);
    else if (m[3]) parts.push(<em key={`${baseKey}-u${k++}`}>{m[3].slice(1, -1)}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function PageContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("::: facts")) {
      const rows: Array<[string, string]> = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(":::")) {
        const t = lines[i];
        if (t.includes("|")) {
          const [k, ...rest] = t.split("|");
          rows.push([k.trim(), rest.join("|").trim()]);
        }
        i++;
      }
      i++;
      out.push(
        <dl key={`dl${i}`}>
          {rows.map(([k, v], idx) => (
            <span key={idx} style={{ display: "contents" }}>
              <dt>{k}</dt>
              <dd>{renderInline(v, `v${i}-${idx}`)}</dd>
            </span>
          ))}
        </dl>
      );
      continue;
    }

    if (line.startsWith("> ")) {
      const buf = [line.slice(2)];
      i++;
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].slice(2));
        i++;
      }
      out.push(<p key={`q${i}`} className="pull">{renderInline(buf.join(" "), `q${i}`)}</p>);
      continue;
    }

    if (line.trim() === "") { i++; continue; }

    const buf = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("> ") &&
      !lines[i].trim().startsWith(":::")
    ) {
      buf.push(lines[i]); i++;
    }
    out.push(<p key={`p${i}`}>{renderInline(buf.join(" "), `p${i}`)}</p>);
  }

  return <>{out}</>;
}
