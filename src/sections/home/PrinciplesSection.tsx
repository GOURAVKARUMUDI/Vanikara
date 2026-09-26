import Eyebrow from "@/components/ui/Eyebrow";
import { PHILOSOPHY_PRINCIPLES } from "@/data/company";

export default function PrinciplesSection() {
  return (
    <section aria-labelledby="principles-title" className="relative py-20 sm:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4" data-reveal>
          <Eyebrow tone="cool">How we work</Eyebrow>
          <h2 id="principles-title" className="text-headline mt-5 text-fg">
            Principles, not slogans.
          </h2>
        </div>

        <ol className="border-t border-line lg:col-span-8">
          {PHILOSOPHY_PRINCIPLES.map((principle, i) => (
            <li
              key={principle.title}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}
              className="group grid gap-3 border-b border-line py-8 sm:grid-cols-[4rem_1fr_1fr] sm:items-baseline sm:gap-6 sm:py-10"
            >
              <span className="text-sm font-semibold tabular-nums text-fg-subtle transition-colors duration-300 group-hover:text-ambition">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-title text-fg">{principle.title}.</h3>
              <p className="text-[1.0625rem] leading-relaxed text-fg-muted">{principle.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
