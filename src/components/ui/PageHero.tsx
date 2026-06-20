import { ReactNode } from 'react';
import { FadeUp } from '@/components/Animate';
import Button from '@/components/ui/Button';

interface PageHeroProps {
  /** Small uppercase tag displayed above the main heading. */
  tag: string;
  /** Main section heading. */
  title: ReactNode;
  /** Descriptive sub-heading text. */
  subtitle: string;
  /** Optional Call to Action button details. */
  cta?: { label: string; href: string };
}

/**
 * PageHero: Premium header section for sub-pages with gradient background and smooth entry animation.
 */
export default function PageHero({ tag, title, subtitle, cta }: PageHeroProps) {
  return (
    <section
      id="page-hero"
      className="py-24 text-center"
      style={{ background: 'linear-gradient(160deg, var(--color-surface-muted) 0%, var(--color-surface-accent) 100%)' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <FadeUp>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)] mb-3">{tag}</p>
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] mb-5 uppercase tracking-tight text-balance">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed font-semibold">
            {subtitle}
          </p>
          {cta && (
            <div className="mt-8">
              <Button href={cta.href} variant="primary" size="lg">{cta.label}</Button>
            </div>
          )}
        </FadeUp>
      </div>
    </section>
  );
}
