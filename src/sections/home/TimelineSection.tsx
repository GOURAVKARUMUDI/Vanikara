import Eyebrow from "@/components/ui/Eyebrow";
import { COMPANY_IDENTITY, COMPANY_TIMELINE } from "@/data/company";

export default function TimelineSection({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section aria-labelledby={showHeader ? "timeline-title" : undefined} aria-label={showHeader ? undefined : "Timeline"} className="relative section-atmosphere py-20 sm:py-24" data-tone="mixed">
      <div className="container-page">
        {showHeader && (
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end" data-reveal>
            <div className="max-w-2xl">
              <Eyebrow>Timeline</Eyebrow>
              <h2 id="timeline-title" className="text-headline mt-5 text-fg">
                Early, and on the record.
              </h2>
            </div>
            <p className="max-w-sm text-[1.0625rem] leading-relaxed text-fg-muted">
              Registered in Andhra Pradesh · <span className="whitespace-nowrap">CIN <span className="tabular-nums">{COMPANY_IDENTITY.cin}</span></span>
            </p>
          </div>
        )}

        <ol className={`relative grid gap-0 md:grid-cols-4 md:gap-6 ${showHeader ? "mt-14" : ""}`}>
          {/* Connecting line (desktop) */}
          <span aria-hidden="true" className="absolute left-0 right-0 top-[7px] hidden h-px bg-line-strong md:block" />
          {COMPANY_TIMELINE.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 110}ms` }}
              className="relative border-l border-line-strong pb-10 pl-7 last:pb-0 md:border-l-0 md:pb-0 md:pl-0"
            >
              <span
                aria-hidden="true"
                className={`absolute -left-[7.5px] top-0 grid h-[15px] w-[15px] place-items-center rounded-full border md:left-0 ${
                  item.isTarget
                    ? "border-dashed border-brand-orange bg-surface"
                    : "border-brand-blue bg-surface"
                }`}
              >
                <span className={`h-[5px] w-[5px] rounded-full ${item.isTarget ? "bg-brand-orange" : "bg-brand-blue"}`} />
              </span>
              <p className={`text-[0.8125rem] font-semibold md:mt-8 ${item.isTarget ? "text-ambition" : "text-intel"}`}>
                {item.date}
                {item.isTarget && <span className="ml-2 font-medium text-fg-subtle">Target</span>}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-muted">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
