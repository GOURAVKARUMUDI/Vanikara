import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";

export default function CareersPartnershipsSection() {
  return (
    <section aria-labelledby="careers-partnerships-heading" className="border-b border-line bg-surface-secondary">
      <div className="container-page py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end" data-reveal>
          <div className="lg:col-span-7">
            <Eyebrow tone="warm">Careers &amp; Partnerships</Eyebrow>
            <h2 id="careers-partnerships-heading" className="text-headline mt-4 text-fg">
              Opening Soon.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
              We are building the foundation for our next chapter. Career opportunities will be announced when recruitment officially opens.
            </p>
            <p className="mt-4 font-mono text-xs font-medium uppercase tracking-wider text-fg-subtle">
              Status: Recruitment Not Yet Open
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Button href="/careers" variant="outline" arrow>
              About careers
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
