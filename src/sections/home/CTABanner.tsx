import { FadeUp } from "@/components/Animate";
import Button from "@/components/ui/Button";
import { SectionContainer, ContentContainer } from "@/components/ui/Containers";

interface CTABannerProps {
  title: string;
  subtitle?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CTABanner({
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CTABannerProps) {
  return (
    <SectionContainer id="cta-banner">
      <ContentContainer className="max-w-4xl">
        <FadeUp>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-10 sm:p-16 text-center shadow-xl shadow-black/5">
            {/* Inner background spotlight glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-color)]/10 blur-[100px] rounded-full pointer-events-none -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none -ml-40 -mb-40"></div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2
                className="font-display font-black text-[var(--text-primary)] leading-tight"
                style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)" }}
              >
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto">
                  {subtitle}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button href={primaryHref} variant="primary" size="lg" magnetic>
                  {primaryLabel}
                </Button>
                {secondaryLabel && secondaryHref && (
                  <Button href={secondaryHref} variant="ghost" size="lg" magnetic>
                    {secondaryLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </FadeUp>
      </ContentContainer>
    </SectionContainer>
  );
}
