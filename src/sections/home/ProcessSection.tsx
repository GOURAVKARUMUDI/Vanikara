import { FadeUp, StaggerGrid, StaggerItem } from '@/components/Animate';
import SectionHeader from '@/components/ui/SectionHeader';
import { SectionContainer, ContentContainer } from '@/components/ui/Containers';

const STEPS = [
  { step: '01', title: 'Discover',  desc: 'We deep-dive into your goals, users, and constraints.' },
  { step: '02', title: 'Design',    desc: 'We prototype and iterate until the solution is perfect.' },
  { step: '03', title: 'Build',     desc: 'Our engineers craft clean, maintainable, tested code.' },
  { step: '04', title: 'Launch',    desc: 'We deploy, monitor, and support your product post-launch.' },
];

export default function ProcessSection() {
  return (
    <SectionContainer id="process">
      <ContentContainer>
        <FadeUp>
          <SectionHeader tag="Our Process" title="How We Work" />
        </FadeUp>
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map(({ step, title, desc }) => (
            <StaggerItem key={step}>
              <div
                className="p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md h-full relative shadow-sm hover:scale-[1.02] transition-transform"
              >
                <span className="absolute top-5 right-5 text-3xl font-black text-[var(--text-secondary)]/10 leading-none select-none">
                  {step}
                </span>
                <h3 className="font-bold text-[var(--text-primary)] text-lg mb-2">{title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </ContentContainer>
    </SectionContainer>
  );
}
