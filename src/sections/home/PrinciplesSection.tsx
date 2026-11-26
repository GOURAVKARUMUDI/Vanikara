import Eyebrow from "@/components/ui/Eyebrow";

const ENGINEERING_PILLARS = [
  {
    index: "01",
    title: "Security by design",
    desc: "Access control, row-level isolation, and least-privilege defaults are engineered into the data layer from day one.",
  },
  {
    index: "02",
    title: "Practical innovation",
    desc: "Technology exists to solve concrete operational problems — never to manufacture complexity or hype.",
  },
  {
    index: "03",
    title: "Intelligent systems",
    desc: "Structured operational telemetry and clean domain boundaries lay the groundwork for internal decision support.",
  },
  {
    index: "04",
    title: "Scalable architecture",
    desc: "Modular systems with clear interfaces allow independent evolution without premature distributed overhead.",
  },
  {
    index: "05",
    title: "Responsible development",
    desc: "Transparent communication, factual product status reporting, and privacy-respecting user experiences.",
  },
  {
    index: "06",
    title: "Long-term reliability",
    desc: "Durable persistence, verifiable audit trails, and measurable performance standards built to endure.",
  },
];

export default function PrinciplesSection() {
  return (
    <section aria-labelledby="engineering-philosophy-heading" className="border-b border-line bg-surface">
      <div className="container-page py-20 sm:py-28">
        <div className="max-w-2xl" data-reveal>
          <Eyebrow tone="cool">Engineering Philosophy</Eyebrow>
          <h2 id="engineering-philosophy-heading" className="text-headline mt-4 text-fg">
            Disciplined software, built for the long term.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-line pt-10 md:grid-cols-2 lg:grid-cols-3" data-reveal>
          {ENGINEERING_PILLARS.map((item) => (
            <div key={item.index} className="space-y-2.5">
              <span className="font-mono text-xs font-medium text-intel">{item.index}</span>
              <h3 className="text-lg font-semibold text-fg">{item.title}</h3>
              <p className="text-sm leading-relaxed text-fg-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
