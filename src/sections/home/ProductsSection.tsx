import { CalendarDays, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { getSiteContent } from "@/lib/content";

export default async function ProductsSection() {
  const { initiatives } = await getSiteContent();
  const { foodDelivery } = initiatives;

  return (
    <section aria-labelledby="food-delivery-heading" className="border-b border-line bg-surface">
      <div className="container-page py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-6">
            <Eyebrow tone="warm">{foodDelivery.index} · Product Initiative</Eyebrow>
            <h2 id="food-delivery-heading" className="text-headline mt-4 text-fg">
              {foodDelivery.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-fg-muted">
              {foodDelivery.summary}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium">
              <span className="inline-flex items-center gap-2 rounded-compact border border-line bg-surface-secondary px-3 py-1.5 text-fg">
                <span aria-hidden="true" className="h-2 w-2 rounded-sm bg-ambition" />
                {foodDelivery.status}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-compact border border-line px-3 py-1.5 text-fg-muted">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ambition" />
                {foodDelivery.initialMarket}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-compact border border-line px-3 py-1.5 text-fg-muted">
                <CalendarDays aria-hidden="true" className="h-3.5 w-3.5 text-fg-subtle" />
                Target {foodDelivery.targetLaunch}
              </span>
            </div>

            <p className="mt-4 font-mono text-xs text-fg-subtle">{foodDelivery.nameNote}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/food-delivery" arrow>
                Explore the Platform
              </Button>
              <Button href="/food-delivery#register" variant="outline">
                Register Interest
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="surface-muted p-6 sm:p-8">
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-fg-subtle">
                Intended Ecosystem Architecture
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {foodDelivery.surfaces.map((surface, idx) => (
                  <div key={surface.id} className="surface p-4">
                    <span className="font-mono text-xs text-fg-subtle">0{idx + 1}</span>
                    <h3 className="mt-1 text-base font-semibold text-fg">{surface.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                      {surface.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
