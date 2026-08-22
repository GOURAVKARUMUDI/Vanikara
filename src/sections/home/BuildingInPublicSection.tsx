import { motion } from "framer-motion";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/Animate";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SectionContainer, ContentContainer } from "@/components/ui/Containers";

const PROGRESS_ITEMS = [
  {
    title: "Vanik",
    phase: "Beta Testing",
    progress: 65,
    desc: "Student marketplace for second-hand items with integrated print and binding services.",
    color: "#1E6BD6",
  },
  {
    title: "FriskFree",
    phase: "Backend Phase",
    progress: 35,
    desc: "Platform helping students discover PGs and hostels based on proximity to university.",
    color: "#FF7A00",
  },
  {
    title: "CYGMA AI",
    phase: "Research Phase",
    progress: 15,
    desc: "Evolving AI ecosystem for automation, smart scheduling, and future platform operations.",
    color: "#8B5CF6",
  },
];

export default function BuildingInPublicSection() {
  return (
    <SectionContainer id="building-in-public">
      <ContentContainer>
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">
              BUILDING IN PUBLIC
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight mt-2">
              Our Active Projects
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-4">
              We believe in transparency. Track the build status of our student platforms and AI products.
            </p>
          </div>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROGRESS_ITEMS.map((item) => (
            <StaggerItem key={item.title}>
              <Card hover className="h-full flex flex-col justify-between">
                <CardBody className="flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-display font-black text-xl text-[var(--text-primary)]">
                        {item.title}
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-500/10 text-[var(--text-secondary)] border border-[var(--glass-border)]">
                        {item.phase}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-[var(--text-primary)]">
                      <span>Development Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-500/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: item.color,
                          boxShadow: `0 0 10px ${item.color}80`,
                        }}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <div className="text-center mt-12">
          <FadeUp>
            <Button href="/projects" variant="secondary" size="md" magnetic>
              View Full Storyboards →
            </Button>
          </FadeUp>
        </div>
      </ContentContainer>
    </SectionContainer>
  );
}
