import React from "react";
import Eyebrow from "./Eyebrow";
import RevealText from "@/components/motion/RevealText";

interface SectionHeaderProps {
  eyebrow?: string;
  tone?: "warm" | "cool";
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  /** Heading level; pages use h1 once, sections use h2. */
  as?: "h1" | "h2";
  className?: string;
  children?: React.ReactNode;
}

export default function SectionHeader({
  eyebrow,
  tone = "warm",
  title,
  lead,
  align = "left",
  as: Heading = "h2",
  className = "",
  children,
}: SectionHeaderProps) {
  const centered = align === "center";
  // Page headers sit above the fold: animate with CSS so they never wait on JS.
  const isPageHeader = Heading === "h1";
  return (
    <header
      className={`${isPageHeader ? "max-w-4xl" : "max-w-3xl"} ${centered ? "mx-auto text-center" : ""} ${isPageHeader ? "rise-in" : ""} ${className}`}
      data-reveal={isPageHeader ? undefined : true}
    >
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <Heading className={`${Heading === "h1" ? "text-display" : "text-headline"} text-fg ${eyebrow ? "mt-4" : ""}`}>
        {typeof title === "string" ? <RevealText mode={isPageHeader ? "load" : "scroll"} delay={isPageHeader ? 80 : 0}>{title}</RevealText> : title}
      </Heading>
      {lead && <p className={`text-lead mt-5 ${centered ? "mx-auto" : ""} max-w-2xl`}>{lead}</p>}
      {children}
    </header>
  );
}
