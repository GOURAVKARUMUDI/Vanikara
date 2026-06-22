import { FadeUp, StaggerGrid, StaggerItem } from '@/components/Animate';
import Card, { CardBody } from '@/components/ui/Card';
import SectionHeader from '@/components/ui/SectionHeader';
import { SectionContainer, ContentContainer } from '@/components/ui/Containers';

const TEAM = [
  { name: 'Founding Team', role: 'Engineering & Product',  emoji: '🚀' },
  { name: 'Founding Team', role: 'Design & Strategy',     emoji: '🎨' },
  { name: 'Student Devs',  role: '6+ Builders',           emoji: '👨‍💻' },
  { name: 'Community',     role: 'Student Relations',      emoji: '🌍' },
];

export default function TeamSection() {
  return (
    <SectionContainer id="team">
      <ContentContainer>
        <FadeUp>
          <SectionHeader tag="People" title="Meet the Team" />
        </FadeUp>
        <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map(({ name, role, emoji }, i) => (
            <StaggerItem key={`${name}-${i}`}>
              <Card className="text-center">
                <CardBody className="p-6">
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 bg-slate-500/5 border border-[var(--glass-border)]"
                  >
                    {emoji}
                  </div>
                  <h3 className="font-bold text-[var(--text-primary)] text-[0.9375rem]">{name}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{role}</p>
                </CardBody>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </ContentContainer>
    </SectionContainer>
  );
}
