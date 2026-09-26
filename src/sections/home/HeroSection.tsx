import Button from "@/components/ui/Button";
import BrandStage from "@/components/brand/BrandStage";
import { COMPANY_IDENTITY, INITIATIVES } from "@/data/company";

export default function HeroSection() {
  const { foodDelivery, cygma } = INITIATIVES;

  return (
    <section aria-labelledby="hero-title" className="relative hero-atmosphere">
      <div className="container-page grid items-center gap-10 pb-16 pt-6 sm:pt-10 lg:min-h-[calc(100svh-var(--header-height))] lg:grid-cols-12 lg:gap-6 lg:pb-20 lg:pt-4">
        {/* Symbol — first on mobile, right column on desktop */}
        <div className="order-first mx-auto w-full max-w-[300px] sm:max-w-[380px] lg:order-last lg:col-span-6 lg:max-w-none">
          <BrandStage />
        </div>

        <div className="lg:col-span-6 lg:pr-6">
          <p className="rise-in text-xs font-semibold tracking-[0.08em] text-fg-muted" style={{ ["--rise-delay" as string]: "60ms" }}>
            {COMPANY_IDENTITY.legalName}
          </p>

          <h1
            id="hero-title"
            className="rise-in text-display mt-5 text-fg"
            style={{ ["--rise-delay" as string]: "120ms" }}
          >
            Building what
            <br />
            comes next<span className="text-brand-orange">.</span>
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
            className="rise-in mt-12 grid max-w-xl grid-cols-2 gap-6 border-t border-line pt-6 text-sm"
            style={{ ["--rise-delay" as string]: "420ms" }}
          >
            <div>
              <dt className="flex items-center gap-2 font-semibold text-fg">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                {foodDelivery.title}
              </dt>
              <dd className="mt-1 text-fg-muted">
                {foodDelivery.status} · {foodDelivery.targetLaunch}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 font-semibold text-fg">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                {cygma.title}
              </dt>
              <dd className="mt-1 text-fg-muted">{cygma.status}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
