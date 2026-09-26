import type { Metadata } from "next";
import Image from "next/image";
import { MapPin } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { SYMBOL_SRC } from "@/components/brand/BrandMark";
import { INITIATIVES } from "@/data/company";

export const metadata: Metadata = {
  title: "Products",
  description:
    "VANIKARA's two initiatives: a food delivery platform in development for Guntur, and CYGMA AI, a long-term intelligence initiative.",
};

export default function ProductsPage() {
  const { foodDelivery, cygma } = INITIATIVES;

  return (
    <>
      <section className="container-page pb-12 pt-16 sm:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="Products"
          title="Two initiatives. One company."
          lead="VANIKARA is building one product towards launch and one long-term initiative that will grow alongside it. Nothing else is in the portfolio — deliberately."
        />
      </section>

      {/* 01 — Food delivery */}
      <section aria-labelledby="fd-title" className="container-page py-10">
        <article data-reveal className="surface relative overflow-hidden rounded-panel">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-2/3"
            style={{ background: "radial-gradient(60% 80% at 100% 50%, var(--glow-orange), transparent 70%)" }}
          />
          <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-12 lg:p-14">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3 text-[0.8125rem]">
                <span className="font-semibold tabular-nums text-fg-subtle">{foodDelivery.index}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 font-semibold text-ambition">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                  {foodDelivery.status}
                </span>
              </div>
              <h2 id="fd-title" className="text-headline mt-6 text-fg">
                {foodDelivery.title}
              </h2>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted">{foodDelivery.summary}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/food-delivery" arrow>
                  Explore the platform
                </Button>
              </div>
            </div>
            <dl className="grid content-start gap-6 border-t border-line pt-8 text-[0.9375rem] lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div>
                <dt className="text-[0.8125rem] text-fg-subtle">Target launch</dt>
                <dd className="mt-1 text-lg font-semibold text-fg">{foodDelivery.targetLaunch}</dd>
              </div>
              <div>
                <dt className="text-[0.8125rem] text-fg-subtle">Initial market</dt>
                <dd className="mt-1 flex items-center gap-2 text-lg font-semibold text-fg">
                  <MapPin aria-hidden="true" className="h-4 w-4 text-ambition" />
                  {foodDelivery.initialMarket}
                </dd>
              </div>
              <div>
                <dt className="text-[0.8125rem] text-fg-subtle">Product name</dt>
                <dd className="mt-1 text-fg-muted">{foodDelivery.nameNote}</dd>
              </div>
            </dl>
          </div>
        </article>
      </section>

      {/* 02 — CYGMA */}
      <section aria-labelledby="cygma-overview-title" className="container-page py-10">
        <article
          data-reveal
          className="relative isolate overflow-hidden rounded-panel border border-white/10 bg-navy p-7 text-white sm:p-10 lg:p-14 dark:bg-surface-raised"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(55% 80% at 90% 20%, color-mix(in oklab, var(--vanikara-blue) 42%, transparent), transparent 70%), radial-gradient(40% 60% at 70% 100%, color-mix(in oklab, var(--vanikara-cyan) 18%, transparent), transparent 70%)",
            }}
          />
          <Image
            src={SYMBOL_SRC}
            alt=""
            aria-hidden="true"
            width={420}
            height={342}
            sizes="420px"
            className="pointer-events-none absolute -bottom-24 -right-16 -z-10 hidden w-[420px] select-none opacity-[0.08] lg:block"
          />
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3 text-[0.8125rem]">
                <span className="font-semibold tabular-nums text-white/50">{cygma.index}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold text-brand-cyan">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
                  {cygma.status}
                </span>
              </div>
              <h2 id="cygma-overview-title" className="text-headline mt-6">
                {cygma.title}
              </h2>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-white/75">{cygma.summary}</p>
              <div className="mt-9">
                <Button href="/cygma" variant="inverse" arrow>
                  Read about CYGMA
                </Button>
              </div>
            </div>
            <ul className="content-start space-y-3 border-t border-white/10 pt-8 text-[0.9375rem] text-white/70 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              {cygma.clarifications.map((line) => (
                <li key={line} className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-4 bg-brand-cyan/70" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <h2 className="text-title text-fg">Interested in what we are building?</h2>
          <p className="text-lead mx-auto mt-4">
            Restaurants in Guntur, potential partners and anyone curious about our work are welcome to get in touch.
          </p>
          <div className="mt-8">
            <Button href="/contact" size="lg" arrow>
              Contact VANIKARA
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
