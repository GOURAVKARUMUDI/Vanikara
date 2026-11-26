import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import FounderCard from "@/components/people/FounderCard";
import { getSiteContent } from "@/lib/content";

export default async function FoundersSection() {
  const { people } = await getSiteContent();

  return (
    <section aria-labelledby="leadership-heading" className="border-b border-line bg-surface">
      <div className="container-page py-20 sm:py-28">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" data-reveal>
          <div className="max-w-2xl">
            <Eyebrow tone="cool">Leadership</Eyebrow>
            <h2 id="leadership-heading" className="text-headline mt-4 text-fg">
              The people building VANIKARA.
            </h2>
          </div>
          <Button href="/leadership" variant="outline" arrow>
            Full leadership profiles
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2" data-reveal>
          {people.map((person, index) => (
            <FounderCard key={person.id} person={person} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
