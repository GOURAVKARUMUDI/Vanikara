import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * PageContainer: standard top-level page wrapper.
 */
export function PageContainer({ children, className = "", id }: ContainerProps) {
  return (
    <div id={id} className={`min-h-screen bg-transparent w-full ${className}`}>
      {children}
    </div>
  );
}

/**
 * SectionContainer: standardizes padding across all viewports.
 * Instead of hardcoded py-24, it transitions cleanly: py-12 (mobile) -> py-16 (tablet) -> py-24 (desktop).
 */
export const SectionContainer = React.forwardRef<HTMLElement, ContainerProps>(
  ({ children, className = "", id }, ref) => {
    return (
      <section id={id} ref={ref} className={`py-12 sm:py-16 md:py-20 lg:py-24 relative w-full ${className}`}>
        {children}
      </section>
    );
  }
);
SectionContainer.displayName = "SectionContainer";

/**
 * ContentContainer: holds center-constrained grid structures.
 */
export function ContentContainer({ children, className = "", id }: ContainerProps) {
  return (
    <div id={id} className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${className}`}>
      {children}
    </div>
  );
}

/**
 * HeroContainer: specific tall wrapper for home/sub-page interactive hero segments.
 */
export function HeroContainer({ children, className = "", id }: ContainerProps) {
  return (
    <section
      id={id}
      className={`relative min-h-[85vh] md:min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-28 pb-16 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * FormContainer: constrains form fields width to a highly readable center block.
 */
export function FormContainer({ children, className = "", id }: ContainerProps) {
  return (
    <div id={id} className={`max-w-2xl mx-auto px-4 sm:px-6 w-full relative z-10 ${className}`}>
      {children}
    </div>
  );
}

/**
 * DashboardContainer: container constrained to max-w-7xl for complex grids/tables.
 */
export function DashboardContainer({ children, className = "", id }: ContainerProps) {
  return (
    <div id={id} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${className}`}>
      {children}
    </div>
  );
}
