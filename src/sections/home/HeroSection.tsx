import Link from "next/link";
import { ArrowUpRight, Layers, ShieldCheck, Globe2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { getSiteContent } from "@/lib/content";
import { getPortfolioItemById } from "@/data/portfolio";

export default async function HeroSection() {
  const { identity, home, portfolio } = await getSiteContent();
  const foodItem = getPortfolioItemById(portfolio, "food-services");
  const cygmaRiItem = getPortfolioItemById(portfolio, "cygma-ri");

  return (
    <section className="border-b border-line bg-surface">
      <div className="container-page py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          <div className="rise-in lg:col-span-8">
            <Eyebrow tone="cool">{identity.brandName} · {identity.operationalLocation}</Eyebrow>
            <h1 className="text-display mt-5 text-fg">
              {home.hero.headlineStart}
            </h1>
            <p className="text-lead mt-6 max-w-2xl">
              {home.hero.headlineMiddle}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/businesses" size="lg" arrow>
                {home.hero.primaryButton}
              </Button>
              <Button href="/cygma-ai" variant="outline" size="lg">
                {home.hero.secondaryButton}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="surface-muted p-6">
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-fg-subtle">
                Two Core Ecosystems
              </p>
              <dl className="mt-5 divide-y divide-line">
                <div className="pb-4">
                  <dt className="flex items-center justify-between text-sm font-semibold text-fg">
                    <span>Unified Consumer Ecosystem</span>
                    <Link
                      href="/businesses"
                      aria-label="Explore Unified Consumer Services Ecosystem"
                      className="text-intel hover:underline"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
                    <Globe2 className="h-3.5 w-3.5 shrink-0 text-ambition" />
                    <span>
                      Food Services ({foodItem?.developmentStatus ?? "Primary consumer initiative"}) · Travel · Hotels · Quick Commerce
                    </span>
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="flex items-center justify-between text-sm font-semibold text-fg">
                    <span>CYGMA_AI Ecosystem</span>
                    <Link
                      href="/cygma-ai"
                      aria-label="Explore CYGMA_AI Ecosystem"
                      className="text-intel hover:underline"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
                    <Layers className="h-3.5 w-3.5 shrink-0 text-intel" />
                    <span>
                      CYGMA-RI Resume Intelligence ({cygmaRiItem?.developmentStatus ?? "In Development"})
                    </span>
                  </dd>
                </div>
                <div className="pt-4">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
                    Corporate Registry
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-status-success" />
                    <span className="font-mono">{identity.cin}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
