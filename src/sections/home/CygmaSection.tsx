import Button from "@/components/ui/Button";
import { getSiteContent } from "@/lib/content";
import { getPortfolioItemById } from "@/data/portfolio";

export default async function CygmaSection() {
  const { portfolio } = await getSiteContent();
  const cygmaAi = getPortfolioItemById(portfolio, "cygma-ai");
  const cygmaRi = getPortfolioItemById(portfolio, "cygma-ri");

  return (
    <section aria-labelledby="cygma-ai-heading" className="border-b border-white/10 bg-[#101C30] text-[#F5F7FA]">
      <div className="container-page py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#78A9FF]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-sm bg-[#78A9FF]" />
              CYGMA_AI · Powered by Vanikara Intelligence
            </span>
            <h2 id="cygma-ai-heading" className="text-headline mt-4 text-white">
              Intelligence, Engineered for Purpose.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#B8C4D4]">
              CYGMA_AI is Vanikara&apos;s proprietary intelligence ecosystem designed to power specialized B2B enterprise products and internal operational intelligence — engineered with human oversight, evidence traceability, and strict privacy boundaries.
            </p>
            <p className="mt-3 font-mono text-xs text-[#8D9DB3]">
              Status: {cygmaAi?.developmentStatus ?? "In Development"} · Not a general-purpose public chatbot.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/cygma-ai" variant="inverse" arrow>
                Explore CYGMA_AI
              </Button>
              <Button href="/cygma-ai/resume-intelligence" variant="inverse-outline">
                CYGMA-RI Product Page
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-card border border-[#34445C] bg-[#152238] p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#78A9FF]">
                  Featured B2B Product
                </span>
                <span className="rounded bg-[#78A9FF]/15 px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#78A9FF]">
                  {cygmaRi?.developmentStatus ?? "In Development"}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white">
                CYGMA-RI — Resume Intelligence
              </h3>
              <p className="mt-1 font-mono text-xs text-[#8D9DB3]">
                Powered by CYGMA_AI — Vanikara Intelligence
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#B8C4D4]">
                An AI-powered B2B resume analysis and pre-verification platform helping companies and recruiters analyse resumes, cross-check candidate claims against permitted LinkedIn and GitHub evidence, and flag inconsistencies — while keeping final hiring decisions entirely in human hands.
              </p>
              <div className="mt-6 border-t border-[#34445C] pt-5">
                <p className="font-mono text-xs font-medium text-white">
                  Intelligence supports the decision. Humans make it.
                </p>
                <div className="mt-4">
                  <Button href="/cygma-ai/resume-intelligence" variant="inverse" size="sm" arrow>
                    Explore CYGMA-RI
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
