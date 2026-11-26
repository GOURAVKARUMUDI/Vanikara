import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "CYGMA Intelligence",
  description:
    "CYGMA is Vanikara's proprietary internal intelligence initiative focused on operational intelligence and decision-support systems. Not a public chatbot.",
};

const RESPONSIBLE_PRINCIPLES = [
  {
    title: "Human-in-the-loop authority",
    desc: "Operational and hiring decisions remain human-controlled. Intelligence systems assist analysis rather than replacing accountability.",
  },
  {
    title: "Data minimization & privacy",
    desc: "Internal systems respect strict data boundaries, consent policies, and statutory protections under Indian law.",
  },
  {
    title: "Factual transparency",
    desc: "We never fabricate benchmarks, training claims, or live deployments. Capabilities are stated only when verified.",
  },
  {
    title: "Security-first architecture",
    desc: "Proprietary internal workflows and datasets are isolated from public interfaces with strict role-based access control.",
  },
];

export default async function CygmaPage() {
  const { initiatives } = await getSiteContent();
  const { cygma } = initiatives;

  return (
    <div className="bg-[#101C30] text-[#F5F7FA]">
      <section className="border-b border-[#34445C]">
        <div className="container-page py-20 sm:py-28">
          <div className="max-w-4xl rise-in">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#78A9FF]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-sm bg-[#78A9FF]" />
              {cygma.index} · {cygma.status}
            </span>
            <h1 className="text-page-title mt-4 text-white">CYGMA Intelligence</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#B8C4D4]">
              {cygma.summary}
            </p>
            <ul className="mt-8 flex flex-wrap gap-3 font-mono text-xs text-[#B8C4D4]">
              {cygma.clarifications.map((line) => (
                <li key={line} className="rounded-compact border border-[#34445C] bg-[#152238] px-3 py-1.5">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Research & Operational Directions */}
      <section className="border-b border-[#34445C]">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-4">
              <p className="font-mono text-xs uppercase tracking-wider text-[#78A9FF]">R&D Direction</p>
              <h2 className="text-headline mt-3 text-white">Intended internal focus areas.</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#B8C4D4]">{cygma.note}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
              {cygma.directions.map((dir, idx) => (
                <div key={dir.title} className="rounded-card border border-[#34445C] bg-[#152238] p-6">
                  <span className="font-mono text-xs text-[#78A9FF]">0{idx + 1}</span>
                  <h3 className="mt-2 text-base font-semibold text-white">{dir.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#B8C4D4]">{dir.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Responsible AI & Security */}
      <section className="border-b border-[#34445C]">
        <div className="container-page py-16 sm:py-24">
          <div className="max-w-2xl" data-reveal>
            <p className="font-mono text-xs uppercase tracking-wider text-[#78A9FF]">Governance</p>
            <h2 className="text-headline mt-3 text-white">Responsible engineering principles.</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2" data-reveal>
            {RESPONSIBLE_PRINCIPLES.map((item) => (
              <div key={item.title} className="rounded-card border border-[#34445C] bg-[#152238] p-6">
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#B8C4D4]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explicit Development Status */}
      <section className="border-b border-[#34445C]">
        <div className="container-page py-16 sm:py-24">
          <div className="max-w-3xl" data-reveal>
            <p className="font-mono text-xs uppercase tracking-wider text-[#78A9FF]">Transparency Record</p>
            <h2 className="text-headline mt-3 text-white">Current development status.</h2>
            <div className="mt-8 overflow-x-auto rounded-card border border-[#34445C]">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#34445C] bg-[#152238] font-mono text-xs uppercase text-[#8D9DB3]">
                  <tr>
                    <th className="px-5 py-3.5">Stage</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Clarification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#34445C]">
                  {cygma.developmentStatus.map((row) => (
                    <tr key={row.stage}>
                      <td className="px-5 py-4 font-semibold text-white">{row.stage}</td>
                      <td className="px-5 py-4 font-mono text-xs text-[#78A9FF]">{row.state}</td>
                      <td className="px-5 py-4 text-[#B8C4D4]">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10">
              <Button href="/contact" variant="inverse" arrow>
                Enquire about Vanikara
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
