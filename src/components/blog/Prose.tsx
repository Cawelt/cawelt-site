import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { slugify, type BlogBlock } from "@/lib/blog";

/**
 * Blog gövde renderer'ı. `BlogBlock[]` dizisini anlamsal (semantic) HTML'e
 * çevirir. Sunucu bileşenidir; etkileşim gerektirmez. Satır içi metinde
 * basit bir markdown alt kümesi desteklenir:
 *   **kalın**, *italik*, `kod` ve [metin](url) — iç linkler next/link ile.
 */

// Satır içi: link | kalın | italik | kod
const INLINE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  INLINE.lastIndex = 0;
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const [, linkText, href, bold, italic, code] = match;

    if (href !== undefined && linkText !== undefined) {
      const internal = href.startsWith("/");
      nodes.push(
        internal ? (
          <Link
            key={key++}
            href={href}
            className="text-champagne underline-offset-4 transition-colors hover:text-champagne-soft hover:underline"
          >
            {linkText}
          </Link>
        ) : (
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-champagne underline-offset-4 transition-colors hover:text-champagne-soft hover:underline"
          >
            {linkText}
          </a>
        ),
      );
    } else if (bold !== undefined) {
      nodes.push(
        <strong key={key++} className="font-medium text-bone">
          {bold}
        </strong>,
      );
    } else if (italic !== undefined) {
      nodes.push(<em key={key++}>{italic}</em>);
    } else if (code !== undefined) {
      nodes.push(
        <code
          key={key++}
          className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-champagne-soft"
        >
          {code}
        </code>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="text-lg leading-relaxed text-bone-muted md:text-xl">
          {parseInline(block.text)}
        </p>
      );
    case "p":
      return (
        <p className="leading-relaxed text-bone-muted">
          {parseInline(block.text)}
        </p>
      );
    case "h2":
      return (
        <h2
          id={slugify(block.text)}
          className="scroll-mt-28 pt-4 text-3xl text-bone md:text-4xl"
        >
          {parseInline(block.text)}
        </h2>
      );
    case "h3":
      return (
        <h3
          id={slugify(block.text)}
          className="scroll-mt-28 text-2xl text-bone"
        >
          {parseInline(block.text)}
        </h3>
      );
    case "ul":
      return (
        <ul className="space-y-2 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-bone-muted">
              <span
                aria-hidden
                className="mt-2.5 size-1.5 shrink-0 rounded-full bg-champagne"
              />
              <span className="leading-relaxed">{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-bone-muted">
              <span className="font-mono text-sm text-champagne">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="leading-relaxed">{parseInline(item)}</span>
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 border-champagne pl-6">
          <p className="headline-serif text-2xl text-bone md:text-3xl">
            “{block.text}”
          </p>
          {block.cite ? (
            <cite className="mt-3 block text-sm not-italic text-mute">
              — {block.cite}
            </cite>
          ) : null}
        </blockquote>
      );
    case "callout":
      return (
        <aside className="rounded-card border border-line bg-surface/60 p-6">
          <p className="leading-relaxed text-bone-muted">
            {parseInline(block.text)}
          </p>
        </aside>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-card border border-line bg-ink-2 p-5 text-sm">
          <code className="font-mono text-bone-muted">{block.code}</code>
        </pre>
      );
    case "html":
      // CRM'den gelen güvenilir zengin metin. Güvenilmeyen kaynak için sanitize edin.
      return (
        <div
          className="space-y-4 leading-relaxed text-bone-muted [&_a]:text-champagne [&_a:hover]:underline [&_h2]:text-bone [&_h2]:text-3xl [&_h3]:text-bone [&_h3]:text-2xl [&_strong]:text-bone"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    default:
      return null;
  }
}

export default function Prose({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <Fragment key={i}>
          <Block block={block} />
        </Fragment>
      ))}
    </div>
  );
}
