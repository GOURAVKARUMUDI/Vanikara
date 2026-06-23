import { StaggerGrid, StaggerItem } from '@/components/Animate';
import Card, { CardBody } from '@/components/ui/Card';
import { SectionContainer, ContentContainer } from '@/components/ui/Containers';

const PILLARS = [
  { icon: '🎯', title: 'Our Mission', desc: 'To build practical and accessible digital solutions that simplify everyday challenges for students.' },
  { icon: '🔭', title: 'Our Vision',  desc: 'To grow into a trusted platform for student-focused innovation, connecting ideas, services, and communities.' },
  { icon: '💡', title: 'Our Values',  desc: 'Execution, continuous learning, collaboration, and solving real problems with meaningful impact.' },
];

export default function MissionSection() {
  return (
    <SectionContainer id="mission">
      <ContentContainer>
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map(({ icon, title, desc }) => (
            <StaggerItem key={title}>
              <Card className="h-full text-center">
                <CardBody>
                  <div className="text-4xl mb-5">{icon}</div>
                  <h2 className="font-bold text-[var(--text-primary)] text-xl mb-3">{title}</h2>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{desc}</p>
                </CardBody>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </ContentContainer>
    </SectionContainer>
  );
}
