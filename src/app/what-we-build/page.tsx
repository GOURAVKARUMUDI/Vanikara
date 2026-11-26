import type { Metadata } from "next";
import { MapPin, CalendarDays } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "What We Build",
  description:
    "Vanikara's product portfolio: a restaurant-first Food Delivery Platform targeting Guntur in 2027, and CYGMA Intelligence, our internal operational intelligence initiative.",
};

export default async function WhatWeBuildPage() {
  const { initiatives } = await getSiteContent();
  const { foodDelivery, cygma } = initiatives;

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <SectionHeader
            as="h1"
            eyebrow="Product Portfolio"
            tone="cool"
            title="Two focused initiatives. One engineering standard."
            lead="Vanikara concentrates its engineering on a commercial product built toward launch and a long-term internal intelligence initiative."
          />
        </div>
      </section>

      {/* Initiative 01: Food Delivery Platform */}
      <section aria-labelledby="fd-portfolio-title" className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <article className="surface p-7 sm:p-10 lg:p-12" data-reveal>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  <span className="font-semibold text-fg-subtle">{foodDelivery.index}</span>
                  <span className="rounded bg-ambition/10 px-2.5 py-1 font-medium text-ambition">
                    {foodDelivery.status}
                  </span>
                </div>
                <h2 id="fd-portfolio-title" className="text-headline mt-4 text-fg">
                  {foodDelivery.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-fg-muted">{foodDelivery.summary}</p>

                <div className="mt-6 grid grid-cols-1 gap-4 border-t border-line pt-6 sm:grid-cols-2">
                  <div>
                    <h3 className="font-mono text-xs font-semibold uppercase text-fg-subtle">Problem Addressed</h3>
                    <p className="mt-1.5 text-sm text-fg-muted">
                      Thin restaurant margins compressed by high per-order commissions and unpredictable promotional spend.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-mono text-xs font-semibold uppercase text-fg-subtle">Proposed Approach</h3>
                    <p className="mt-1.5 text-sm text-fg-muted">
                      Dedicated merchant, customer, partner and operations tools. Commercial terms are not yet published.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/food-delivery" arrow>
                    Explore Food Delivery Platform
                  </Button>
                </div>
              </div>

              <dl className="space-y-5 border-t border-line pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <div>
                  <dt className="font-mono text-xs uppercase text-fg-subtle">Roadmap Target</dt>
                  <dd className="mt-1 flex items-center gap-2 text-base font-semibold text-fg">
                    <CalendarDays className="h-4 w-4 text-fg-subtle" />
                    {foodDelivery.targetLaunch}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase text-fg-subtle">Planned Launch Geography</dt>
                  <dd className="mt-1 flex items-center gap-2 text-base font-semibold text-fg">
                    <MapPin className="h-4 w-4 text-ambition" />
                    {foodDelivery.initialMarket}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase text-fg-subtle">Intended Users</dt>
                  <dd className="mt-1 text-sm text-fg-muted">
                    Restaurants, customers, delivery partners, and internal operations teams.
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase text-fg-subtle">Product Naming</dt>
                  <dd className="mt-1 text-sm text-fg-muted">{foodDelivery.nameNote}</dd>
                </div>
              </dl>
            </div>
          </article>
        </div>
      </section>

      {/* Initiative 02: CYGMA Intelligence */}
      <section aria-labelledby="cygma-portfolio-title" className="border-b border-white/10 bg-[#101C30] text-[#F5F7FA]">
        <div className="container-page py-16 sm:py-24">
          <article className="rounded-card border border-[#34445C] bg-[#152238] p-7 sm:p-10 lg:p-12" data-reveal>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  <span className="font-semibold text-[#8D9DB3]">{cygma.index}</span>
                  <span className="rounded bg-[#78A9FF]/15 px-2.5 py-1 font-medium text-[#78A9FF]">
                    {cygma.status}
                  </span>
                </div>
                <h2 id="cygma-portfolio-title" className="text-headline mt-4 text-white">
                  CYGMA Intelligence
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#B8C4D4]">{cygma.summary}</p>
                <div className="mt-8">
                  <Button href="/cygma" variant="inverse" arrow>
                    Explore CYGMA Intelligence
                  </Button>
                </div>
              </div>

              <div className="space-y-4 border-t border-[#34445C] pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <p className="font-mono text-xs uppercase text-[#8D9DB3]">Scope & Positioning</p>
                <ul className="space-y-2.5 text-sm text-[#B8C4D4]">
                  {cygma.clarifications.map((c) => (
                    <li key={c} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-[#78A9FF]" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-2 font-mono text-xs text-[#8D9DB3]">{cygma.note}</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-surface">
        <div className="container-page py-16 sm:py-24 text-center" data-reveal>
          <h2 className="text-title text-fg">Have a question about our roadmap?</h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-fg-muted">
            Reach out to our team for business partnerships, restaurant onboarding interest, or general enquiries.
          </p>
          <div className="mt-7">
            <Button href="/contact" size="lg" arrow>
              Contact Vanikara
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
