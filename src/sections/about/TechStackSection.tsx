import { FadeUp, StaggerGrid, StaggerItem } from '@/components/Animate';
import SectionHeader from '@/components/ui/SectionHeader';
import { SectionContainer, ContentContainer } from '@/components/ui/Containers';

const TECH = [
  { icon: '⚛️', name: 'React / Next.js' },
  { icon: '🐍', name: 'Python / FastAPI' },
  { icon: '☁️', name: 'AWS / Vercel'    },
  { icon: '🗄️', name: 'PostgreSQL'      },
  { icon: '🐳', name: 'Docker / K8s'    },
  { icon: '📦', name: 'TypeScript'      },
];

export default function TechStackSection() {
  return (
    <SectionContainer id="tech-stack">
      <ContentContainer>
        <FadeUp>
          <SectionHeader tag="Technology" title="Our Tech Stack" />
        </FadeUp>
        <StaggerGrid className="flex flex-wrap justify-center gap-3">
          {TECH.map(({ icon, name }) => (
            <StaggerItem key={name}>
              <div
                className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md font-semibold text-[var(--text-primary)] text-sm shadow-sm hover:scale-105 transition-transform"
              >
                <span className="text-xl">{icon}</span> {name}
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </ContentContainer>
    </SectionContainer>
  );
}
