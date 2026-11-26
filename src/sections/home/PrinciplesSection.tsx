import Image from "next/image";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";

const ENGINEERING_PILLARS = [
  {
    index: "01",
    title: "Security by design",
    desc: "Row-level data isolation, server-side RBAC, and least-privilege defaults built into the data layer.",
  },
  {
    index: "02",
    title: "Intelligent systems",
    desc: "Structured operational telemetry and clean domain boundaries powering responsible decision support.",
  },
  {
    index: "03",
    title: "Reliable architecture",
    desc: "Modular systems with strict schema validation, audit logging, and predictable failure recovery.",
  },
  {
    index: "04",
    title: "Responsible innovation",
    desc: "Human-supervised automation, factual product status reporting, and privacy-respecting design.",
  },
  {
    index: "05",
    title: "Connectivity",
    desc: "Shared account, merchant, and service infrastructure designed to unite multiple consumer verticals.",
  },
  {
    index: "06",
    title: "Data engineering",
    desc: "Durable relational modeling, evidence traceability, and zero unauthorized training on customer records.",
  },
];

export default function PrinciplesSection() {
  return (
    <section aria-labelledby="engineering-philosophy-heading" className="border-b border-line bg-surface">
      <div className="container-page py-24 sm:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center" data-reveal>
          <div className="lg:col-span-5">
            <Eyebrow tone="cool">04 / Engineering &amp; Technology</Eyebrow>
            <h2 id="engineering-philosophy-heading" className="text-headline mt-4 text-fg">
              Built for tomorrow.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-fg-muted">
              Every Vanikara product is grounded in disciplined systems engineering, clear architectural boundaries, and measurable reliability.
            </p>
            <div className="mt-7">
              <Button href="/technology" variant="outline" arrow>
                Explore Engineering
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[8px] border border-line bg-surface-secondary">
              <Image
                src="/images/technology/engineering-infrastructure.webp"
                alt="Precision enterprise computing infrastructure representing Vanikara engineering standards"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-8 border-t border-line pt-12 md:grid-cols-2 lg:grid-cols-3" data-reveal>
          {ENGINEERING_PILLARS.map((item) => (
            <div key={item.index} className="space-y-2">
              <span className="font-mono text-xs font-medium text-intel">{item.index}</span>
              <h3 className="text-base font-semibold text-fg">{item.title}</h3>
              <p className="text-sm leading-relaxed text-fg-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
