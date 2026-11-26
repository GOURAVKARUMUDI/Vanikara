import React from "react";
import Eyebrow from "./Eyebrow";

interface SectionHeaderProps {
  eyebrow?: string;
  tone?: "warm" | "cool";
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
  children?: React.ReactNode;
}

export default function SectionHeader({
  eyebrow,
  tone = "cool",
  title,
  lead,
  align = "left",
  as: Heading = "h2",
  className = "",
  children,
}: SectionHeaderProps) {
  const centered = align === "center";
  const isPageHeader = Heading === "h1";
  return (
    <header
      className={`${isPageHeader ? "max-w-4xl" : "max-w-3xl"} ${centered ? "mx-auto text-center" : ""} ${isPageHeader ? "rise-in" : ""} ${className}`}
      data-reveal={isPageHeader ? undefined : true}
    >
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <Heading className={`${isPageHeader ? "text-page-title" : "text-headline"} text-fg ${eyebrow ? "mt-3" : ""}`}>
        {title}
      </Heading>
      {lead && <p className={`text-lead mt-4 ${centered ? "mx-auto" : ""} max-w-2xl`}>{lead}</p>}
      {children}
    </header>
  );
}
