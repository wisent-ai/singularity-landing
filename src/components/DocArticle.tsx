import type { ReactNode } from "react";

const CODE_MARK = "`";
const STRONG_MARK = "**";

function inline(value: string): ReactNode[] {
  return value.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith(CODE_MARK) && part.endsWith(CODE_MARK)) return <code key={index}>{part.slice(CODE_MARK.length, -CODE_MARK.length)}</code>;
    if (part.startsWith(STRONG_MARK) && part.endsWith(STRONG_MARK)) return <strong key={index}>{part.slice(STRONG_MARK.length, -STRONG_MARK.length)}</strong>;
    return part;
  });
}

export default function DocArticle({ source }: { source: string }) {
  const lines = source.replace(/<!--[^]*?-->/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index += 1; continue; }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const Tag = `h${heading[1].length}` as "h1" | "h2" | "h3";
      blocks.push(<Tag key={index}>{inline(heading[2])}</Tag>);
      index += 1;
      continue;
    }
    if (line.startsWith("```")) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) code.push(lines[index++]);
      index += 1;
      blocks.push(<pre key={index}><code>{code.join("\n")}</code></pre>);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) items.push(lines[index++].trim().replace(/^[-*]\s+/, ""));
      blocks.push(<ul key={index}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ul>);
      continue;
    }
    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,3})\s+|^```|^[-*]\s+/.test(lines[index].trim())) paragraph.push(lines[index++].trim());
    blocks.push(<p key={index}>{inline(paragraph.join(" "))}</p>);
  }
  return <article className="docs-article">{blocks}</article>;
}
