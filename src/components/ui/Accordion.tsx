import React from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  question: string;
  answer: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  headingId?: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * Semantic accessible accordion built with native <details>/<summary>.
 * Non-exclusive by default so users can compare answers; animates
 * smoothly via CSS ::details-content with prefers-reduced-motion support.
 */
export default function Accordion({ items, headingId, ariaLabel, className = "" }: AccordionProps) {
  return (
    <div
      className={`v2-accordion border-t border-line ${className}`}
      role={ariaLabel || headingId ? "region" : undefined}
      aria-labelledby={headingId}
      aria-label={!headingId ? ariaLabel : undefined}
    >
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="text-base text-fg">
            <span>{item.question}</span>
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-fg-muted transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="pb-5 pr-8 text-[0.9375rem] leading-relaxed text-fg-muted">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
