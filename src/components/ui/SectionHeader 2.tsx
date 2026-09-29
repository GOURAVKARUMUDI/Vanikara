import { ReactNode } from 'react';

interface SectionHeaderProps {
  /** Optional badge/tag text above the title. */
  tag?: string;
  /** Main heading content. */
  title: ReactNode;
  /** Optional descriptive text below the title. */
  subtitle?: string;
  /** Whether to center all text. Default: true. */
  centered?: boolean;
  className?: string;
}

/**
 * SectionHeader: Consistent heading structure for page sections.
 */
export default function SectionHeader({
  tag, title, subtitle, centered = true, className = '',
}: SectionHeaderProps) {
  return (
    <div className={`${centered ? 'text-center' : ''} mb-14 ${className}`}>
      {tag && <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)] mb-3">{tag}</p>}
      <h2 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-primary)] uppercase tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-[var(--text-secondary)] text-sm sm:text-base max-w-xl ${centered ? 'mx-auto' : ''} leading-relaxed font-semibold`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
