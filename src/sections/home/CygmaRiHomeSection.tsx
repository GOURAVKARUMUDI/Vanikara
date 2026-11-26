import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import CygmaRiInterfacePreview from "@/components/cygma/CygmaRiInterfacePreview";

const WORKFLOW = ["Resume Upload", "AI Analysis", "Evidence Review", "Recruiter Review"];

export default function CygmaRiHomeSection() {
  return (
    <section aria-labelledby="cygma-ri-home-heading" className="border-b border-line bg-[#F5F5F7] dark:bg-surface-secondary">
      <div className="container-page py-24 sm:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12" data-reveal>
          {/* Left: Product Identity */}
          <div className="lg:col-span-5">
            <Eyebrow tone="cool">03 / Enterprise Intelligence</Eyebrow>
            <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-wider text-intel">
              CYGMA-RI · Resume Intelligence
            </p>
            <h2 id="cygma-ri-home-heading" className="text-headline mt-2 text-fg">
              Less manual verification. More informed recruitment.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-fg-muted">
              AI-assisted resume analysis and pre-verification designed to support evidence-based recruitment and human-led hiring decisions.
            </p>
            <p className="mt-3 font-mono text-xs text-fg-subtle">
              Powered by CYGMA_AI — Vanikara Intelligence
            </p>
            <div className="mt-8">
              <Button href="/cygma-ai/resume-intelligence" size="lg" arrow>
                Explore Resume Intelligence
              </Button>
            </div>
          </div>

          {/* Right: Substantial Enterprise Application Preview */}
          <div className="lg:col-span-7">
            <CygmaRiInterfacePreview compact />
          </div>
        </div>

        {/* Clean Horizontal Supporting Workflow */}
        <div className="mt-16 border-t border-line pt-10" data-reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <ol className="flex flex-wrap items-center gap-3 text-sm font-medium text-fg">
              {WORKFLOW.map((step, i) => (
                <li key={step} className="inline-flex items-center gap-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="font-mono text-xs text-intel">0{i + 1}</span>
                    <span>{step}</span>
                  </span>
                  {i < WORKFLOW.length - 1 && (
                    <span aria-hidden="true" className="text-fg-subtle">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <p className="font-display text-sm font-semibold text-fg">
              Intelligence supports the decision. Humans make it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
