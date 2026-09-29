import { INITIATIVES } from "@/data/company";

/**
 * A slow, continuous band of what VANIKARA is working on — drawn from the
 * same data as the product sections, so it never says more than they do.
 */
export default function MarqueeSection() {
  const { foodDelivery, cygma } = INITIATIVES;
  const warm = foodDelivery.principles.map((p) => p.title);
  const cool = cygma.directions.map((d) => `CYGMA · ${d.title}`);
  const items = [
    { label: foodDelivery.title, tone: "warm" },
    ...warm.map((label) => ({ label, tone: "warm" })),
    { label: cygma.title, tone: "cool" },
    ...cool.map((label) => ({ label, tone: "cool" })),
  ];

  const track = (hidden: boolean) => (
    <ul className="marquee__track" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3 whitespace-nowrap text-[0.9375rem] font-semibold text-fg-muted">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rotate-45 ${item.tone === "warm" ? "bg-brand-orange" : "bg-brand-blue"}`}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="What we are building" className="relative border-y border-line bg-surface-raised/40 py-5 backdrop-blur-sm">
      <div className="marquee">
        {track(false)}
        {track(true)}
      </div>
    </section>
  );
}
