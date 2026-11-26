import Link from "next/link";
import { ArrowUpRight, MapPin, ShieldCheck, Layers } from "lucide-react";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { getSiteContent } from "@/lib/content";

export default async function HeroSection() {
  const { identity, initiatives } = await getSiteContent();

  return (
    <section className="border-b border-line bg-surface">
      <div className="container-page py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          <div className="rise-in lg:col-span-8">
            <Eyebrow tone="cool">{identity.brandName} · {identity.operationalLocation}</Eyebrow>
            <h1 className="text-display mt-5 text-fg">
              Intelligence meets purpose.
            </h1>
            <p className="text-lead mt-6 max-w-2xl">
              Building practical technology and intelligent systems designed to solve real-world operational challenges.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/what-we-build" size="lg" arrow>
                Explore Our Products
              </Button>
              <Button href="/about" variant="outline" size="lg">
                Discover Vanikara
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="surface-muted p-6">
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-fg-subtle">
                Active Initiatives
              </p>
              <dl className="mt-5 divide-y divide-line">
                <div className="pb-4">
                  <dt className="flex items-center justify-between text-sm font-semibold text-fg">
                    <span>{initiatives.foodDelivery.title}</span>
                    <Link
                      href="/food-delivery"
                      aria-label="Explore Food Delivery Platform"
                      className="text-intel hover:underline"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-ambition" />
                    <span>{initiatives.foodDelivery.status} · Target {initiatives.foodDelivery.targetLaunch}</span>
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="flex items-center justify-between text-sm font-semibold text-fg">
                    <span>CYGMA Intelligence</span>
                    <Link
                      href="/cygma"
                      aria-label="Explore CYGMA Intelligence"
                      className="text-intel hover:underline"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
                    <Layers className="h-3.5 w-3.5 shrink-0 text-intel" />
                    <span>{initiatives.cygma.status} · Internal systems</span>
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
