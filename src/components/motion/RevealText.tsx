import React from "react";

interface Segment {
  text: string;
  /** Extra class for this run of words (e.g. "text-shimmer"). */
  className?: string;
}

interface RevealTextProps {
  /** Plain text, or segments when part of the line needs its own styling. Use "\n" for a line break. */
  children: string | Segment[];
  /** "load" animates on first paint (above the fold); "scroll" waits for the viewport. */
  mode?: "load" | "scroll";
  className?: string;
  /** Base delay in ms before the first word. */
  delay?: number;
}

/**
 * Splits a heading into words that rise out of a clipped line, one after
 * another. The full string stays in the accessibility tree as normal text;
 * the per-word spans are purely presentational.
 */
export default function RevealText({ children, mode = "scroll", className = "", delay = 0 }: RevealTextProps) {
  const segments: Segment[] = typeof children === "string" ? [{ text: children }] : children;

  let wordIndex = 0;
  const nodes: React.ReactNode[] = [];

  segments.forEach((segment, s) => {
    const lines = segment.text.split("\n");
    lines.forEach((line, l) => {
      if (l > 0) nodes.push(<br key={`br-${s}-${l}`} />);
      const words = line.split(/(\s+)/);
      words.forEach((word, w) => {
        if (!word) return;
        if (/^\s+$/.test(word)) {
          nodes.push(" ");
          return;
        }
        const i = wordIndex++;
        nodes.push(
          <span key={`w-${s}-${l}-${w}`} className="rw">
            <span className={segment.className} style={{ ["--w" as string]: i }}>
              {word}
            </span>
          </span>
        );
      });
    });
  });

  return (
    <span
      className={`reveal-words ${className}`}
      data-mode={mode}
      data-reveal={mode === "scroll" ? "words" : undefined}
      style={{ ["--rise-delay" as string]: `${delay}ms`, ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {nodes}
    </span>
  );
}
