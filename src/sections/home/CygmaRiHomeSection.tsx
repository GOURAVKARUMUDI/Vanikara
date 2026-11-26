import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import CygmaRiInterfacePreview from "@/components/cygma/CygmaRiInterfacePreview";

const CAPABILITIES = [
  "Batch resume analysis",
  "Evidence-based pre-verification",
  "Job requirement alignment",
  "Recruiter review assistance",
  "Human-led decision-making",
];

export default function CygmaRiHomeSection() {
  return (
    <section aria-labelledby="cygma-ri-home-heading" className="border-b border-line bg-[#F5F5F7] dark:bg-surface-secondary">
      <div className="container-page py-20 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-5">
            <Eyebrow tone="cool">CYGMA-RI · Resume Intelligence</Eyebrow>
            <h2 id="cygma-ri-home-heading" className="text-headline mt-4 text-fg">
              Enterprise resume analysis for recruiters.
            </h2>
            <ul className="mt-6 space-y-2 text-sm text-fg-muted">
              {CAPABILITIES.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-intel" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/cygma-ai/resume-intelligence" variant="outline" arrow>
                Explore Resume Intelligence
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <CygmaRiInterfacePreview compact />
            <p className="mt-3 font-mono text-[11px] text-fg-subtle">Conceptual product preview.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
