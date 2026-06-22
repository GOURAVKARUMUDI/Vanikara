import { FadeUp, StaggerGrid, StaggerItem } from "@/components/Animate";
import Card, { CardBody } from "@/components/ui/Card";
import { SectionContainer, ContentContainer } from "@/components/ui/Containers";

const TESTIMONIALS = [
  {
    quote: "Finding a PG near campus was always a nightmare. FriskFree's university-matched lists saved me weeks of manual searching.",
    name: "Sai Krishna",
    role: "Engineering Student",
    source: "Campus Beta User"
  },
  {
    quote: "Vanik's textbook binding service is super convenient. I put up my second-year books for sale and they sold out in days.",
    name: "Aparna Rao",
    role: "Computer Science Major",
    source: "Vanik Tester"
  },
  {
    quote: "Collaborating with the VANIKARA team has been great. Their attention to system security and performance is outstanding.",
    name: "Barg Technologies rep",
    role: "Integration Partner",
    source: "Barg Partnership"
  }
];

export default function TestimonialsSection() {
  return (
    <SectionContainer id="testimonials">
      <ContentContainer>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeUp>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">
              TESTIMONIALS
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight mt-2">
              What Students Say
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-4">
              Real validation feedback from campus users testing our early product modules.
            </p>
          </FadeUp>
        </div>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test) => (
            <StaggerItem key={test.name}>
              <Card hover className="h-full flex flex-col justify-between">
                <CardBody className="flex flex-col justify-between h-full space-y-6">
                  <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
                    "{test.quote}"
                  </p>
                  <div>
                    <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
                      {test.name}
                    </h3>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                      <span>{test.role}</span>
                      <span className="text-[var(--accent-color)] uppercase font-extrabold tracking-widest text-[8px]">
                        {test.source}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </ContentContainer>
    </SectionContainer>
  );
}
