import { MapPin } from "lucide-react";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { INITIATIVES } from "@/data/company";

export default function ProductsSection() {
  const { foodDelivery } = INITIATIVES;

  return (
    <section aria-labelledby="products-title" className="relative pb-8 pt-20 sm:pt-24">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end" data-reveal>
          <div className="max-w-2xl">
            <Eyebrow>Products</Eyebrow>
            <h2 id="products-title" className="text-headline mt-5 text-fg">
              Two initiatives.
              <br className="hidden sm:block" /> One direction.
            </h2>
          </div>
          <p className="max-w-sm text-[1.0625rem] leading-relaxed text-fg-muted">
            A product with a launch date, and a long-term initiative that will grow alongside it.
          </p>
        </div>

        {/* Product 01 — editorial feature */}
        <article
          data-reveal
          data-tone="warm"
          className="card-interactive surface mt-14 overflow-hidden rounded-panel"
        >
          <div className="grid lg:grid-cols-12">
            <div className="p-7 sm:p-10 lg:col-span-7 lg:p-12">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8125rem]">
                <span className="font-semibold tabular-nums text-fg-subtle">{foodDelivery.index}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 font-semibold text-ambition">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                  {foodDelivery.status}
                </span>
                <span className="text-fg-muted">Target: {foodDelivery.targetLaunch}</span>
              </div>

              <h3 className="text-title mt-6 text-fg">{foodDelivery.title}</h3>
              <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted">{foodDelivery.summary}</p>

              <p className="mt-6 flex items-center gap-2 text-sm text-fg-muted">
                <MapPin aria-hidden="true" className="h-4 w-4 text-ambition" />
                Initial market: <span className="font-semibold text-fg">{foodDelivery.initialMarket}</span>
              </p>

              <div className="mt-9">
                <Button href="/food-delivery" variant="secondary" arrow>
                  Explore the platform
                </Button>
              </div>
            </div>

            <div className="relative border-t border-line bg-surface-sunken/60 p-7 sm:p-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:p-12">
              <p className="text-[0.8125rem] font-semibold text-fg">What we are designing for</p>
              <ul className="mt-6 space-y-5">
                {foodDelivery.principles.map((principle) => (
                  <li key={principle.title} className="flex gap-4">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-brand-orange" />
                    <div>
                      <p className="text-[0.9375rem] font-semibold text-fg">{principle.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-fg-muted">{principle.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-xs text-fg-subtle">{foodDelivery.nameNote}</p>
            </div>
          </div>
        </article>

      </div>
    </section>
  );
}
