import type { Metadata } from "next";
import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import { SYMBOL_SRC } from "@/components/brand/BrandMark";
import { INITIATIVES } from "@/data/company";

export const metadata: Metadata = {
  title: "CYGMA AI",
  description:
    "CYGMA is VANIKARA's proprietary long-term intelligence initiative — company-specific intelligence around its products, knowledge, systems and operations. Not a public chatbot.",
};

export default function CygmaPage() {
  const { cygma, foodDelivery } = INITIATIVES;

  return (
    <>
      {/* Atmospheric header — always dark */}
      <section className="container-page pt-6 sm:pt-10">
        <div className="relative isolate overflow-hidden rounded-panel border border-white/10 bg-navy px-6 pb-16 pt-20 text-white sm:px-12 sm:pb-24 sm:pt-28 lg:px-16 dark:bg-surface-raised">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(50% 70% at 80% 30%, color-mix(in oklab, var(--vanikara-blue) 50%, transparent), transparent 70%), radial-gradient(35% 50% at 95% 95%, color-mix(in oklab, var(--vanikara-cyan) 25%, transparent), transparent 70%), radial-gradient(45% 60% at 5% 100%, color-mix(in oklab, var(--vanikara-deep-blue) 80%, transparent), transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              WebkitMaskImage: "radial-gradient(ellipse 55% 75% at 78% 35%, #000, transparent 75%)",
              maskImage: "radial-gradient(ellipse 55% 75% at 78% 35%, #000, transparent 75%)",
            }}
          />
          <Image
            src={SYMBOL_SRC}
            alt=""
            aria-hidden="true"
            width={520}
            height={424}
            sizes="(min-width: 1024px) 460px, 0px"
            priority
            className="pointer-events-none absolute right-12 top-1/2 -z-10 hidden w-[380px] -translate-y-1/2 select-none opacity-[0.16] lg:block"
          />

          <div className="rise-in max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-white/70">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-cyan shadow-[0_0_0_4px_rgba(0,207,255,0.18)]" />
              {cygma.index} · {cygma.status}
            </p>
            <h1 className="text-display mt-6">{cygma.title}</h1>
            <p className="mt-6 text-xl font-semibold leading-snug text-white/90">{cygma.tagline}</p>
            <p className="mt-5 text-lg leading-relaxed text-white/70">{cygma.summary}</p>
          </div>
        </div>
      </section>

      {/* What it is not */}
      <section aria-labelledby="scope-title" className="container-page py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-reveal>
            <Eyebrow tone="cool">Scope</Eyebrow>
            <h2 id="scope-title" className="text-headline mt-5 text-fg">
              Clear about what it is — and isn&apos;t.
            </h2>
          </div>
          <ul className="space-y-0 border-t border-line lg:col-span-6 lg:col-start-7" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
            {cygma.clarifications.map((line) => (
              <li key={line} className="flex items-center gap-4 border-b border-line py-5 text-lg font-semibold text-fg">
                <span aria-hidden="true" className="h-px w-6 bg-brand-blue" />
                {line}
              </li>
            ))}
            <li className="py-5 text-[1.0625rem] leading-relaxed text-fg-muted">
              CYGMA is proprietary to VANIKARA and is being shaped around the company itself.
            </li>
          </ul>
        </div>
      </section>

      {/* Directions */}
      <section aria-labelledby="directions-title" className="container-page py-16 sm:py-24">
        <div data-reveal className="max-w-2xl">
          <Eyebrow tone="cool">Direction</Eyebrow>
          <h2 id="directions-title" className="text-headline mt-5 text-fg">
            Intended to develop intelligence around the company.
          </h2>
        </div>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {cygma.directions.map((direction, i) => (
            <li
              key={direction.title}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
              className="bg-surface-raised p-6 sm:p-7"
            >
              <span className="text-[0.8125rem] font-semibold tabular-nums text-intel">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-lg font-bold text-fg">{direction.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-muted">{direction.desc}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-fg-subtle" data-reveal>
          {cygma.note}
        </p>
      </section>

      {/* Cross-link */}
      <section className="container-page py-16 sm:py-24">
        <div data-reveal className="surface flex flex-col gap-6 rounded-panel p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="max-w-xl">
            <p className="text-[0.8125rem] font-semibold text-ambition">
              {foodDelivery.index} · {foodDelivery.status}
            </p>
            <h2 className="text-title mt-2 text-fg">{foodDelivery.title}</h2>
            <p className="mt-2 text-[1.0625rem] leading-relaxed text-fg-muted">
              The product VANIKARA is building now — targeting {foodDelivery.targetLaunch} in Guntur.
            </p>
          </div>
          <Button href="/food-delivery" variant="secondary" arrow className="shrink-0">
            Explore the platform
          </Button>
        </div>
      </section>
    </>
  );
}
