import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Eyebrow from "@/components/ui/Eyebrow";
import FounderCard from "@/components/people/FounderCard";
import { getSiteContent } from "@/lib/content";
import Lines from "@/components/ui/Lines";

export default async function FoundersSection() {
  const { people: FOUNDERS_AND_LEADERSHIP, home: { people: copy } } = await getSiteContent();
  return (
    <section aria-labelledby="founders-title" className="relative section-atmosphere py-20 sm:py-24" data-tone="cool">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end" data-reveal>
          <div className="max-w-2xl">
            <Eyebrow tone="cool">{copy.eyebrow}</Eyebrow>
            <h2 id="founders-title" className="text-headline mt-5 text-fg">
              <Lines text={copy.title} />
            </h2>
          </div>
          <Link href="/leadership" className="group inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-intel">
            <span className="link-underline">{copy.linkLabel}</span>
            <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
          {FOUNDERS_AND_LEADERSHIP.map((person, i) => (
            <FounderCard key={person.id} person={person} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
