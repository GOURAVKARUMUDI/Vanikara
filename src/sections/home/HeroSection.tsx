import { CalendarDays, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import BrandStage from "@/components/brand/BrandStage";
import RevealText from "@/components/motion/RevealText";
import { COMPANY_IDENTITY, INITIATIVES } from "@/data/company";

export default function HeroSection() {
  const { foodDelivery, cygma } = INITIATIVES;

  return (
    <section aria-labelledby="hero-title" className="relative hero-atmosphere">
      <div className="container-page grid items-center gap-10 pb-16 pt-6 sm:pt-10 lg:min-h-[calc(100svh-var(--header-height))] lg:grid-cols-12 lg:gap-6 lg:pb-20 lg:pt-4">
        {/* Symbol — first on mobile, right column on desktop */}
        <div
          data-parallax="0.08"
          className="relative order-first mx-auto w-full max-w-[300px] sm:max-w-[380px] lg:order-last lg:col-span-6 lg:max-w-none"
        >
          <div aria-hidden="true" className="hero-grid" />
          <BrandStage />

          {/* Floating liquid-glass chips (tablet and up) */}
          <div
            className="glass-chip liquid-glass glass float-y absolute left-0 top-[16%] hidden sm:inline-flex lg:-left-2"
            style={{ animationDelay: "-2s" }}
          >
            <span aria-hidden="true" className="glass-chip__icon bg-brand-orange/15 text-ambition">
              <MapPin className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[0.6875rem] font-medium text-fg-muted">Initial market</span>
              <span className="block font-semibold">{foodDelivery.initialMarket}</span>
            </span>
          </div>
          <div
            className="glass-chip liquid-glass glass float-y absolute bottom-[14%] right-0 hidden sm:inline-flex lg:-right-2"
            style={{ animationDelay: "-5s" }}
          >
            <span aria-hidden="true" className="glass-chip__icon bg-brand-blue/15 text-intel">
              <CalendarDays className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[0.6875rem] font-medium text-fg-muted">Founded</span>
              <span className="block font-semibold">{COMPANY_IDENTITY.foundingDate}</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 lg:pr-6">
          <p className="rise-in status-pill" style={{ ["--rise-delay" as string]: "60ms" }}>
            <span aria-hidden="true" className="live-dot" style={{ ["--live-color" as string]: "var(--vanikara-bright-orange)" }} />
            {COMPANY_IDENTITY.legalName}
          </p>

          <h1 id="hero-title" className="text-display mt-6 text-fg">
            <RevealText mode="load" delay={120}>
              {[
                { text: "Building what\ncomes " },
                { text: "next", className: "text-shimmer" },
                { text: ".", className: "text-brand-orange" },
              ]}
            </RevealText>
          </h1>

          <p className="rise-in text-lead mt-6 max-w-xl" style={{ ["--rise-delay" as string]: "220ms" }}>
            {COMPANY_IDENTITY.supportingStatement}
          </p>

          <div
            className="rise-in mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ ["--rise-delay" as string]: "320ms" }}
          >
            <Button href="/about" size="lg" arrow>
              Explore VANIKARA
            </Button>
            <Button href="/what-we-build" variant="secondary" size="lg">
              Our Products
            </Button>
          </div>

          <dl
            className="rise-in mt-12 grid max-w-xl grid-cols-2 gap-3 text-sm"
            style={{ ["--rise-delay" as string]: "420ms" }}
          >
            <div className="glass glass-shine rounded-card p-4">
              <dt className="flex items-center gap-2 font-semibold text-fg">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                {foodDelivery.title}
              </dt>
              <dd className="mt-1 text-fg-muted">
                {foodDelivery.status} · {foodDelivery.targetLaunch}
              </dd>
            </div>
            <div className="glass glass-shine rounded-card p-4">
              <dt className="flex items-center gap-2 font-semibold text-fg">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                {cygma.title}
              </dt>
              <dd className="mt-1 text-fg-muted">{cygma.status}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Scroll cue (desktop) */}
      <div
        aria-hidden="true"
        className="rise-in absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.18em] text-fg-subtle lg:flex"
        style={{ ["--rise-delay" as string]: "900ms" }}
      >
        <span className="scroll-cue" />
        SCROLL
      </div>
    </section>
  );
}
