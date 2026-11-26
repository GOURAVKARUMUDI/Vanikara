import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";

export default function PrinciplesSection() {
  return (
    <section aria-labelledby="engineering-philosophy-heading" className="border-b border-line bg-surface">
      <div className="container-page py-20 sm:py-28">
        <div className="max-w-2xl" data-reveal>
          <Eyebrow tone="cool">Engineering &amp; Technology</Eyebrow>
          <h2 id="engineering-philosophy-heading" className="text-headline mt-4 text-fg">
            Built with care, secured by design.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-fg-muted">
            Clear system boundaries, strict access control and human oversight of automated decisions.
          </p>
          <div className="mt-8">
            <Button href="/technology" variant="outline" arrow>
              Explore Engineering
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
