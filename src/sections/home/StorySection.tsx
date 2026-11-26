import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { getSiteContent } from "@/lib/content";

export default async function StorySection() {
  const { identity } = await getSiteContent();

  return (
    <section aria-labelledby="company-intro-heading" className="border-b border-line bg-surface-secondary">
      <div className="container-page py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-5">
            <Eyebrow tone="cool">About Vanikara</Eyebrow>
            <h2 id="company-intro-heading" className="text-headline mt-4 text-fg">
              {identity.mission}
            </h2>
          </div>

          <div className="space-y-5 lg:col-span-7">
            <p className="text-lg leading-relaxed text-fg">
              {identity.supportingStatement}
            </p>
            <div className="pt-4">
              <Button href="/about" variant="outline" arrow>
                Read our full story
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
