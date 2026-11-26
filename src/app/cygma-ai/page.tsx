import type { Metadata } from "next";
import Button from "@/components/ui/Button";
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
    <div className="bg-[#101C30] text-[#F5F7FA]">
      {/* Hero */}
      <section className="border-b border-[#34445C]">
        <div className="container-page py-20 sm:py-28">
          <div className="max-w-4xl rise-in">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#78A9FF]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-sm bg-[#78A9FF]" />
              CYGMA_AI · Powered by Vanikara Intelligence · {cygmaAi?.developmentStatus ?? "In Development"}
            </span>
            <h1 className="text-page-title mt-4 text-white">Intelligence, Built for Purpose.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#B8C4D4]">
              CYGMA_AI is an intelligence ecosystem powered by Vanikara Intelligence, designed to support specialized AI applications, enterprise workflows and internal operational intelligence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/cygma-ai/resume-intelligence" variant="inverse" size="lg" arrow>
                Explore CYGMA-RI
              </Button>
              <Button href="#responsible-ai" variant="inverse-outline" size="lg">
                Responsible Intelligence
              </Button>
            </div>
            <p className="mt-6 font-mono text-xs text-[#8D9DB3]">
              CYGMA_AI is an enterprise and internal intelligence ecosystem — not a general-purpose public chatbot.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Product: CYGMA-RI */}
      <section className="border-b border-[#34445C]">
        <div className="container-page py-16 sm:py-24">
          <div className="rounded-card border border-[#34445C] bg-[#152238] p-8 sm:p-12" data-reveal>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  <span className="text-[#78A9FF]">FEATURED B2B PRODUCT</span>
                  <span className="rounded bg-[#78A9FF]/15 px-2.5 py-0.5 text-[#78A9FF]">
                    {cygmaRi?.developmentStatus ?? "In Development"}
                  </span>
                </div>
                <h2 className="text-headline mt-3 text-white">CYGMA-RI — Resume Intelligence</h2>
                <p className="mt-1 font-mono text-xs text-[#8D9DB3]">
                  Powered by CYGMA_AI — Vanikara Intelligence
                </p>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#B8C4D4]">
                  An AI-powered B2B resume analysis and pre-verification platform designed to help recruiters evaluate candidate information, review supporting evidence from LinkedIn and GitHub where permitted, and reduce manual verification effort — while keeping final hiring decisions in human hands.
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                <Button href="/cygma-ai/resume-intelligence" variant="inverse" size="lg" arrow>
                  Explore CYGMA-RI
                </Button>
                <Button href="/cygma-ai/resume-intelligence#early-access" variant="inverse-outline" size="md">
                  Request Early Access
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Ecosystem & Internal Intelligence */}
      <section id="internal-intelligence" className="border-b border-[#34445C]">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-4">
              <p className="font-mono text-xs uppercase tracking-wider text-[#78A9FF]">Ecosystem Scope</p>
              <h2 className="text-headline mt-3 text-white">Structured intelligence layers.</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#B8C4D4]">
                Internal Operational Intelligence status:{" "}
                <span className="font-mono text-[#78A9FF]">
                  {internalIntel?.developmentStatus ?? "Research and Development"}
                </span>
                .
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
              {ECOSYSTEM_PILLARS.map((item, idx) => (
                <div key={item.title} className="rounded-card border border-[#34445C] bg-[#152238] p-6">
                  <span className="font-mono text-xs text-[#78A9FF]">0{idx + 1}</span>
                  <h3 className="mt-2 text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#B8C4D4]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Responsible Intelligence */}
      <section id="responsible-ai" className="border-b border-[#34445C]">
        <div className="container-page py-16 sm:py-24">
          <div className="max-w-2xl" data-reveal>
            <p className="font-mono text-xs uppercase tracking-wider text-[#78A9FF]">Responsible AI</p>
            <h2 className="text-headline mt-3 text-white">Governance engineered into every product.</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
            {RESPONSIBLE_PILLARS.map((item) => (
              <div key={item.title} className="rounded-card border border-[#34445C] bg-[#152238] p-6">
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
