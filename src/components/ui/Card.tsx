import React, { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Adds the shared hover lift and pointer light. Default: true. */
  hover?: boolean;
  style?: CSSProperties;
}

/**
 * Card: solid information surface built on the shared tokens.
 * Hover behaviour comes from `.card-interactive` in globals.css.
 */
export default function Card({ children, className = "", hover = true, style }: CardProps) {
  return (
    <div
      className={`surface relative overflow-hidden rounded-feature ${hover ? "card-interactive" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 sm:p-6 lg:p-8 ${className}`}>{children}</div>;
}
