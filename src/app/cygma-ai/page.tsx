import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/ui/Button";
import CygmaRiInterfacePreview from "@/components/cygma/CygmaRiInterfacePreview";
import { getSiteContent } from "@/lib/content";
import { getPortfolioItemById } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "CYGMA_AI | Intelligence Ecosystem",
  description:
    "CYGMA_AI is an intelligence ecosystem powered by Vanikara Intelligence, designed to support specialized AI applications, enterprise workflows, and internal operational intelligence.",
  alternates: { canonical: "/cygma-ai" },
};

const ECOSYSTEM_PILLARS = [
  {
    title: "Specialized Intelligence Products",
    desc: "Domain-focused B2B software powered by CYGMA_AI, beginning with CYGMA-RI (Resume Intelligence).",
  },
  {
    title: "Enterprise Applications",
    desc: "Structured analysis, document pre-verification, and evidence-backed operational workflows.",
  },
  {
    title: "Internal Operational Intelligence",
    desc: "Company-specific decision-support systems being researched to strengthen Vanikara's own platforms.",
  },
  {
    title: "Research & Development",
    desc: "Disciplined evaluation of accuracy, latency, safety, and prompt-injection resilience before deployment.",
  },
];

const RESPONSIBLE_PILLARS = [
  { title: "Human Oversight", desc: "High-impact business and hiring decisions remain strictly human-controlled." },
  { title: "Evidence-Based Analysis", desc: "Outputs distinguish verified supporting evidence from missing information or potential inconsistencies." },
  { title: "Privacy-Conscious Processing", desc: "Strict tenant isolation, data minimization, and zero unauthorized training on customer records." },
  { title: "Transparency", desc: "Clear distinction between in-development software, research initiatives, and operational systems." },
  { title: "Responsible Automation", desc: "Augmenting human productivity without autonomous rejection or opaque scoring." },
  { title: "Secure Enterprise Workflows", desc: "Treating external documents and profile text as untrusted input with defense-in-depth controls." },
];

export default async function CygmaAiOverviewPage() {
  const { portfolio } = await getSiteContent();
  const cygmaAi = getPortfolioItemById(portfolio, "cygma-ai");
  const cygmaRi = getPortfolioItemById(portfolio, "cygma-ri");
  const internalIntel = getPortfolioItemById(portfolio, "internal-operational-intelligence");

  return (
    <div className="bg-[#080F20] text-[#F5F7FA]">
      {/* Hero with Computational Core */}
      <section className="border-b border-[#1A2942]">
        <div className="container-page py-20 sm:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="rise-in lg:col-span-5">
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#78A9FF]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-sm bg-[#78A9FF]" />
                CYGMA_AI · Powered by Vanikara Intelligence
              </span>
              <h1 className="text-page-title mt-4 text-white">Intelligence, Built for Purpose.</h1>
              <p className="mt-5 text-lg leading-relaxed text-[#B8C4D4]">
                CYGMA_AI is an intelligence ecosystem powered by Vanikara Intelligence, designed to support specialized AI applications, enterprise workflows and internal operational intelligence.
              </p>
              <p className="mt-3 font-mono text-xs text-[#8D9DB3]">
                Status: {cygmaAi?.developmentStatus ?? "In Development"} · Not a general-purpose public chatbot.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/cygma-ai/resume-intelligence" variant="inverse" size="lg" arrow>
                  Explore CYGMA-RI
                </Button>
                <Button href="#responsible-ai" variant="inverse-outline" size="lg">
                  Responsible Intelligence
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[8px] bg-[#080F20]">
                <Image
                  src="/images/cygma-ai/cygma-intelligence-core.webp"
                  alt="CYGMA_AI precision-engineered computational core"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "radial-gradient(ellipse at center, transparent 58%, #080F20 100%)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Ecosystem & Architecture Visual */}
      <section id="internal-intelligence" className="border-b border-[#1A2942] bg-[#0D172B]">
        <div className="container-page py-20 sm:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[8px] border border-[#1E2E4A] bg-[#080F20]">
                <Image
                  src="/images/cygma-ai/intelligence-architecture.webp"
                  alt="CYGMA_AI modular enterprise intelligence architecture"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
            <div className="lg:col-span-6">
              <p className="font-mono text-xs uppercase tracking-wider text-[#78A9FF]">Ecosystem Scope</p>
              <h2 className="text-headline mt-3 text-white">Structured intelligence layers.</h2>
              <p className="mt-2 font-mono text-xs text-[#8D9DB3]">
                Internal Operational Intelligence: {internalIntel?.developmentStatus ?? "Research and Development"}
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {ECOSYSTEM_PILLARS.map((item, idx) => (
                  <div key={item.title} className="rounded-[8px] border border-[#1E2E4A] bg-[#132139] p-5">
                    <span className="font-mono text-xs text-[#78A9FF]">0{idx + 1}</span>
                    <h3 className="mt-1.5 text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#B8C4D4]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product: CYGMA-RI with Live Conceptual Preview */}
      <section className="border-b border-[#1A2942] bg-[#080F20]">
        <div className="container-page py-20 sm:py-28">
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" data-reveal>
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-wider text-[#78A9FF]">
                Featured B2B Product · {cygmaRi?.developmentStatus ?? "In Development"}
              </span>
              <h2 className="text-headline mt-3 text-white">CYGMA-RI — Resume Intelligence</h2>
              <p className="mt-3 text-base leading-relaxed text-[#B8C4D4]">
                An AI-powered B2B resume analysis and pre-verification platform helping recruiters evaluate candidate claims and review supporting evidence while keeping hiring decisions in human hands.
              </p>
            </div>
            <Button href="/cygma-ai/resume-intelligence" variant="inverse" size="lg" arrow>
              Explore CYGMA-RI
            </Button>
          </div>
          <CygmaRiInterfacePreview />
        </div>
      </section>

      {/* Responsible Intelligence */}
      <section id="responsible-ai" className="bg-[#0D172B]">
        <div className="container-page py-20 sm:py-28">
          <div className="max-w-2xl" data-reveal>
            <p className="font-mono text-xs uppercase tracking-wider text-[#78A9FF]">Responsible AI</p>
            <h2 className="text-headline mt-3 text-white">Governance engineered into every product.</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
            {RESPONSIBLE_PILLARS.map((item) => (
              <div key={item.title} className="rounded-[8px] border border-[#1E2E4A] bg-[#132139] p-6">
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#B8C4D4]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
