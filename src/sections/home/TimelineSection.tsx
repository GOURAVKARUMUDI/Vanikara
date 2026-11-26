import Eyebrow from "@/components/ui/Eyebrow";
import { getSiteContent } from "@/lib/content";

export default async function TimelineSection() {
  const { timeline } = await getSiteContent();

  return (
    <section id="journey" aria-labelledby="timeline-heading" className="border-b border-line bg-surface-secondary">
      <div className="container-page py-20 sm:py-28">
        <div className="max-w-2xl" data-reveal>
          <Eyebrow tone="cool">Company Journey</Eyebrow>
          <h2 id="timeline-heading" className="text-headline mt-4 text-fg">
            Verified milestones and roadmap.
          </h2>
          <p className="mt-3 text-base text-fg-muted">
            Completed milestones are clearly distinguished from planned roadmap targets.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" data-reveal>
          {timeline.map((item) => (
            <li key={`${item.date}-${item.title}`} className="surface flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-fg">{item.date}</span>
                  <span
                    className={`rounded px-2 py-0.5 font-mono text-[10px] font-medium uppercase ${
                      item.isTarget
                        ? "bg-ambition/10 text-ambition"
                        : "bg-status-success/10 text-status-success"
                    }`}
                  >
                    {item.isTarget ? "Planned Target" : "Completed"}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-fg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
