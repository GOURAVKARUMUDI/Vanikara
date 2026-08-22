import { FadeUp, StaggerGrid, StaggerItem } from '@/components/Animate';
import SectionHeader from '@/components/ui/SectionHeader';
import { SectionContainer, ContentContainer } from '@/components/ui/Containers';

const UPCOMING = [
  { icon: '🏢', title: 'FinFlow Dashboard', desc: 'Financial analytics for SMEs with AI-powered insights.' },
  { icon: '📅', title: 'EventHub',           desc: 'Campus event management and ticketing with QR check-in.' },
  { icon: '🎓', title: 'GradeU',             desc: 'AI-powered academic performance tracker and study planner.' },
];

export default function ComingSoonSection() {
  return (
    <SectionContainer id="coming-soon">
      <ContentContainer>
        <FadeUp>
          <SectionHeader tag="In the Pipeline" title="What's Next" />
        </FadeUp>
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {UPCOMING.map(({ icon, title, desc }) => (
            <StaggerItem key={title}>
              <div
                className="p-7 rounded-2xl bg-[var(--glass-bg)] border border-dashed border-[var(--glass-border)] backdrop-blur-md relative opacity-75 hover:opacity-100 transition-opacity"
              >
                <span
                  className="absolute top-4 right-4 text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full bg-slate-500/5 text-[var(--accent-color)] border border-[var(--glass-border)]"
                >
                  SOON
                </span>
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">{desc}</p>
                <div className="pt-5 border-t border-[var(--glass-border)]">
                  <a href={`/contact?product=${encodeURIComponent(title)}`} 
                     className="text-xs font-bold text-[var(--accent-color)] hover:opacity-85 flex items-center gap-1 group">
                    Express Interest <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </a>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </ContentContainer>
    </SectionContainer>
  );
}
