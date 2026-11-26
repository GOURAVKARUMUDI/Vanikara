import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import FounderCard from "@/components/people/FounderCard";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Vanikara",
  description:
    "VANIKARA Intelligence Private Limited is a technology product company based in Guntur, Andhra Pradesh, building practical digital platforms and internal intelligent systems.",
};

export default async function AboutPage() {
  const { identity, story, principles, timeline, people } = await getSiteContent();

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <SectionHeader
            as="h1"
            eyebrow="About Vanikara"
            tone="cool"
            title={story.heading}
            lead={identity.supportingStatement}
          />
        </div>
      </section>

      {/* Story, Mission & Vision */}
      <section className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12" data-reveal>
            <div className="space-y-5 lg:col-span-7">
              <Eyebrow tone="cool">Company Story</Eyebrow>
              <h2 className="text-headline text-fg">A product-first approach from day one.</h2>
              {story.paragraphs.map((p) => (
                <p key={p} className="text-base leading-relaxed text-fg-muted">
                  {p}
                </p>
              ))}
            </div>

            <div className="space-y-6 lg:col-span-5">
              <div className="surface p-6">
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-intel">Mission</p>
                <p className="mt-2 text-lg font-semibold text-fg">{identity.mission}</p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  To design and engineer practical software products that improve unit economics and operational clarity for real-world businesses.
                </p>
              </div>
              <div className="surface p-6">
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-intel">Long-Term Vision</p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  To build enduring commercial platforms supported by proprietary internal operational intelligence, grounded in transparent business models and disciplined engineering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Principles */}
      <section id="principles" className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="max-w-2xl" data-reveal>
            <Eyebrow tone="cool">Operating Principles</Eyebrow>
            <h2 className="text-headline mt-3 text-fg">How we work.</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 border-t border-line pt-10 md:grid-cols-3" data-reveal>
            {principles.map((item, idx) => (
              <div key={item.title} className="space-y-2">
                <span className="font-mono text-xs text-intel">0{idx + 1}</span>
                <h3 className="text-lg font-semibold text-fg">{item.title}</h3>
                <p className="text-sm leading-relaxed text-fg-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Journey */}
      <section id="journey" className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="max-w-2xl" data-reveal>
            <Eyebrow tone="cool">Company Journey</Eyebrow>
            <h2 className="text-headline mt-3 text-fg">Verified milestones.</h2>
          </div>

          <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" data-reveal>
            {timeline.map((m) => (
              <li key={`${m.date}-${m.title}`} className="surface p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-fg">{m.date}</span>
                  <span
                    className={`rounded px-2 py-0.5 font-mono text-[10px] font-medium uppercase ${
                      m.isTarget ? "bg-ambition/10 text-ambition" : "bg-status-success/10 text-status-success"
                    }`}
                  >
                    {m.isTarget ? "Planned Target" : "Completed"}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-fg">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{m.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Leadership Preview */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
            <div>
              <Eyebrow tone="cool">Leadership</Eyebrow>
              <h2 className="text-headline mt-3 text-fg">Founders & Directors.</h2>
            </div>
            <Button href="/leadership" variant="outline" arrow>
              View leadership page
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2" data-reveal>
            {people.map((founder) => (
              <FounderCard key={founder.id} founder={founder} />
            ))}
          </div>
        </div>
      </section>

      {/* Verified Corporate Identity */}
      <section className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="surface p-6 sm:p-10" data-reveal>
            <Eyebrow tone="cool">Corporate Identity</Eyebrow>
            <h2 className="text-title mt-3 text-fg">Verified statutory registration</h2>
            <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="font-mono text-xs uppercase text-fg-subtle">Legal Name</dt>
                <dd className="mt-1 text-sm font-medium text-fg">{identity.legalName}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase text-fg-subtle">Corporate Identity Number</dt>
                <dd className="mt-1 font-mono text-sm font-medium text-fg">{identity.cin}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase text-fg-subtle">Incorporation Date</dt>
                <dd className="mt-1 text-sm font-medium text-fg">{identity.incorporationDate}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase text-fg-subtle">Operational Base</dt>
                <dd className="mt-1 text-sm font-medium text-fg">{identity.operationalLocation}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" arrow>
                Contact Vanikara
              </Button>
              <Button href="/legal/legal-information" variant="outline">
                Full Company Information
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
