import Button from "@/components/ui/Button";
import { getSiteContent } from "@/lib/content";

export default async function CygmaSection() {
  const { initiatives } = await getSiteContent();
  const { cygma } = initiatives;

  return (
    <section aria-labelledby="cygma-heading" className="border-b border-white/10 bg-[#101C30] text-[#F5F7FA]">
      <div className="container-page py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#78A9FF]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-sm bg-[#78A9FF]" />
              {cygma.index} · {cygma.status}
            </span>
            <h2 id="cygma-heading" className="text-headline mt-4 text-white">
              CYGMA Intelligence
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[#B8C4D4]">
              {cygma.summary}
            </p>

            <ul className="mt-6 space-y-2 border-l-2 border-[#34445C] pl-4 text-sm text-[#B8C4D4]">
              {cygma.clarifications.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <div className="mt-8">
              <Button href="/cygma" variant="inverse" arrow>
                Explore CYGMA Intelligence
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-card border border-[#34445C] bg-[#152238] p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-wider text-[#8D9DB3]">
                Intended Research & Operational Directions
              </p>
              <dl className="mt-6 divide-y divide-[#34445C]">
                {cygma.directions.map((dir) => (
                  <div key={dir.title} className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-12 sm:gap-4">
                    <dt className="text-sm font-semibold text-white sm:col-span-4">{dir.title}</dt>
                    <dd className="text-sm text-[#B8C4D4] sm:col-span-8">{dir.desc}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 font-mono text-xs text-[#8D9DB3]">{cygma.note}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
