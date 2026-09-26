import type { Metadata } from "next";
import { MapPin, CalendarDays } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { BrandSymbol } from "@/components/brand/BrandMark";
import { INITIATIVES } from "@/data/company";

export const metadata: Metadata = {
  title: "Food Delivery Platform",
  description:
    "VANIKARA is exploring a restaurant-first approach to food delivery economics. In development, targeting launch in Guntur, Andhra Pradesh in November 2026.",
};

export default function FoodDeliveryPage() {
  const { foodDelivery } = INITIATIVES;

  return (
    <>
      <section className="container-page pb-12 pt-16 sm:pt-24">
        <SectionHeader as="h1" eyebrow={`${foodDelivery.index} · ${foodDelivery.title}`} title={foodDelivery.heroHeading} lead={foodDelivery.summary}>
          <div className="mt-8 flex flex-wrap gap-2.5 text-[0.8125rem] font-semibold">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3.5 py-1.5 text-ambition">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              {foodDelivery.status}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-fg-muted">
              <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
              Target: {foodDelivery.targetLaunch}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-fg-muted">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
              {foodDelivery.initialMarket}
            </span>
          </div>
          <p className="mt-5 text-sm text-fg-subtle">{foodDelivery.nameNote}</p>
        </SectionHeader>
      </section>

      {/* Problem */}
      <section aria-labelledby="problem-title" className="container-page py-16 sm:py-24">
        <div className="grid gap-12 border-t border-line pt-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-reveal>
            <Eyebrow tone="cool">The context</Eyebrow>
            <h2 id="problem-title" className="text-headline mt-5 text-fg">
              {foodDelivery.problemHeading}
            </h2>
          </div>
          <div className="space-y-5 lg:col-span-6 lg:col-start-7 lg:pt-12" data-reveal style={{ ["--reveal-delay" as string]: "140ms" }}>
            {foodDelivery.problemParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-[1.0625rem] leading-relaxed text-fg-muted">
                {paragraph}
              </p>
            ))}
            <p className="text-[1.0625rem] font-semibold text-fg">
              VANIKARA is exploring a restaurant-first approach to food delivery economics.
            </p>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section aria-labelledby="approach-title" className="container-page py-16 sm:py-24">
        <div data-reveal>
          <Eyebrow>Design direction</Eyebrow>
          <h2 id="approach-title" className="text-headline mt-5 max-w-2xl text-fg">
            {foodDelivery.approachHeading}
          </h2>
        </div>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
          {foodDelivery.principles.map((principle, i) => (
            <li
              key={principle.title}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
              className="group bg-surface-raised p-7 transition-colors duration-300 hover:bg-surface sm:p-9"
            >
              <span className="text-sm font-semibold tabular-nums text-fg-subtle transition-colors group-hover:text-ambition">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-bold text-fg">{principle.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-muted">{principle.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Four sides of one platform */}
      <section aria-labelledby="surfaces-title" className="container-page py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-4" data-reveal>
            <Eyebrow tone="cool">Platform</Eyebrow>
            <h2 id="surfaces-title" className="text-headline mt-5 text-fg">
              Four sides of one platform.
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-fg-muted">
              Every order involves a customer, a restaurant, a delivery partner and the people operating the service.
              We are designing each side as part of one system.
            </p>
          </div>

          <div className="relative lg:col-span-7 lg:col-start-6" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
            {/* Cross connectors + hub (desktop) */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
              <span className="absolute left-1/2 top-6 bottom-6 w-px -translate-x-1/2 bg-line-strong" />
              <span className="absolute left-6 right-6 top-1/2 h-px -translate-y-1/2 bg-line-strong" />
              <span className="glass absolute left-1/2 top-1/2 z-10 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full">
                <BrandSymbol size={30} alt="" />
              </span>
            </div>

            <ul className="relative grid gap-4 sm:grid-cols-2 sm:gap-16">
              {foodDelivery.surfaces.map((surface, i) => (
                <li
                  key={surface.id}
                  data-tone={i % 2 === 0 ? "warm" : "cool"}
                  data-tier="utility"
                  className="card-interactive surface rounded-feature p-6"
                >
                  <span className="text-[0.8125rem] font-semibold tabular-nums text-fg-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-fg">{surface.name}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-fg-muted">{surface.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Status + CTA */}
      <section aria-labelledby="status-title" className="container-page py-16 sm:py-24">
        <div
          data-reveal
          className="glass relative isolate overflow-hidden rounded-panel p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:p-12"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{ background: "radial-gradient(60% 120% at 0% 100%, var(--glow-orange), transparent 70%)" }}
          />
          <div className="max-w-xl">
            <h2 id="status-title" className="text-title text-fg">
              In development for {foodDelivery.targetLaunch}.
            </h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-fg-muted">
              We are starting in Guntur. Restaurants and partners who want to talk about the model are welcome to reach
              out.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
            <Button href="/contact" size="lg" arrow>
              Talk to the team
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
