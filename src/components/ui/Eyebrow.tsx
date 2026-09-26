import React from "react";

interface EyebrowProps {
  children: React.ReactNode;
  /** Dot colour: warm (orange) for ambition, cool (blue) for intelligence. */
  tone?: "warm" | "cool";
  className?: string;
}

export default function Eyebrow({ children, tone = "warm", className = "" }: EyebrowProps) {
  return (
    <span className={`eyebrow ${className}`}>
      <span aria-hidden="true" className="eyebrow-dot" data-tone={tone} />
      {children}
    </span>
  );
}
