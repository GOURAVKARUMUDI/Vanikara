import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, MapPin, PhoneCall, Store, Utensils, ShoppingBag } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";
import InterestRegistrationForm from "@/sections/food-delivery/InterestRegistrationForm";
import TelephoneOrderingVisual from "@/components/food/TelephoneOrderingVisual";
import { getSiteContent } from "@/lib/content";
import { getPortfolioItemById } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Food Services | Unified Consumer Ecosystem",
  description:
    "Vanikara's Food Services initiative covering Food Delivery, Dine-in, Takeaway, and proposed AI-Assisted Telephone Ordering, designed around restaurant-first economics.",
};

const TELEPHONE_WORKFLOW = [
  "Customer calls the designated ordering telephone number.",
  "AI-powered voice assistant understands the customer's request.",
  "The system retrieves restaurant menu information from connected backend services.",
  "Available items are checked against current restaurant inventory.",
  "The customer confirms their selected items and quantities.",
  "Delivery address or pickup details are confirmed.",
  "The system communicates the applicable item prices and charges clearly.",
  "A secure payment link is generated when online payment is selected.",
  "Eligible cash-on-delivery options may be offered subject to approved policy.",
  "The confirmed order is transmitted directly to the restaurant.",
  "The order proceeds through preparation and fulfilment.",
];

const FAQ_ITEMS = [
  {
    question: "Is Food Services live for consumer ordering today?",
    answer:
      "No. Food Delivery is currently in development with a planned roadmap target in Guntur, Andhra Pradesh in 2027. Dine-in and Takeaway are planned, and AI-Assisted Telephone Ordering is a proposed innovation.",
  },
  {
    question: "How does Vanikara approach restaurant commercial terms?",
    answer:
      "Our planned model focuses on subscription-based restaurant charges, transparent pricing, and preserving original restaurant menu prices as a business objective — reducing dependence on escalating per-order commissions.",
  },
  {
    question: "Is AI-Assisted Telephone Ordering completely offline?",
    answer:
      "No. It is designed as an app-free, telephone-based ordering channel so customers do not need the smartphone app to place an order, while backend menu, inventory, and dispatch systems operate over connected infrastructure.",
  },
  {
    question: "Which food businesses are in scope for Tier-2 markets?",
    answer:
      "Our initial Tier-2 strategy focuses on restaurants, cloud kitchens, bakeries, eligible local food businesses, and street food vendors subject to operational feasibility and regulatory requirements.",
  },
];

export default async function FoodDeliveryPage() {
  const { initiatives, portfolio } = await getSiteContent();
  const { foodDelivery } = initiatives;

  const foodDelStatus = getPortfolioItemById(portfolio, "food-delivery")?.developmentStatus ?? "In Development";
  const dineInStatus = getPortfolioItemById(portfolio, "dine-in")?.developmentStatus ?? "Planned";
  const takeawayStatus = getPortfolioItemById(portfolio, "takeaway")?.developmentStatus ?? "Planned";
  const phoneStatus = getPortfolioItemById(portfolio, "ai-telephone-ordering")?.developmentStatus ?? "Proposed";

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <SectionHeader
            as="h1"
            eyebrow="Unified Consumer Ecosystem · Food Services"
            tone="warm"
            title={foodDelivery.heroHeading}
            lead="Vanikara's primary consumer initiative — encompassing Food Delivery, Dine-in, Takeaway, and proposed AI-Assisted Telephone Ordering built around sustainable restaurant economics."
          >
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-medium">
              <span className="inline-flex items-center gap-2 rounded-compact border border-line bg-surface-secondary px-3 py-1.5 text-fg">
                <span aria-hidden="true" className="h-2 w-2 rounded-sm bg-ambition" />
                Food Delivery: {foodDelStatus}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-compact border border-line px-3 py-1.5 text-fg-muted">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ambition" />
                Tier-2 Initial Target: {foodDelivery.initialMarket}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-compact border border-line px-3 py-1.5 text-fg-muted">
                <CalendarDays aria-hidden="true" className="h-3.5 w-3.5 text-fg-subtle" />
                Roadmap Target: {foodDelivery.targetLaunch}
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#register" size="lg" arrow>
                Register Early Interest
              </Button>
              <Button href="#telephone-ordering" variant="outline" size="lg">
                AI Telephone Ordering
              </Button>
            </div>
          </SectionHeader>
          <div className="relative mt-12 aspect-[21/9] w-full overflow-hidden rounded-[8px] border border-line bg-surface-secondary">
            <Image
              src="/images/businesses/food/food-services-showcase.webp"
              alt="Editorial photograph of Indian restaurant food and takeaway experience"
              fill
              priority
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Core Service Lines: Delivery, Dine-in, Takeaway */}
      <section className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="max-w-2xl" data-reveal>
            <Eyebrow tone="warm">Food Services Scope</Eyebrow>
            <h2 className="text-headline mt-3 text-fg">Three core dining channels.</h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3" data-reveal>
            <div id="delivery" className="surface overflow-hidden">
              <div className="relative aspect-[4/3] w-full bg-surface-secondary">
                <Image
                  src="/images/businesses/food/food-services-showcase.webp"
                  alt="Restaurant food prepared for delivery"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <Store className="h-5 w-5 text-ambition" />
                  <span className="rounded bg-ambition/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-ambition">
                    {foodDelStatus}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-fg">Food Delivery</h3>
                <ul className="mt-3 space-y-2 text-sm text-fg-muted">
                  <li>• Restaurant discovery &amp; structured menu browsing</li>
                  <li>• Transparent food ordering &amp; order tracking</li>
                  <li>• Coordinated delivery fulfilment</li>
                  <li>• Restaurant-first commercial model</li>
                </ul>
              </div>
            </div>

            <div id="dine-in" className="surface overflow-hidden">
              <div className="relative aspect-[4/3] w-full bg-surface-secondary">
                <Image
                  src="/images/businesses/food/dine-in-experience.webp"
                  alt="Modern restaurant dining interior"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <Utensils className="h-5 w-5 text-intel" />
                  <span className="rounded bg-surface-secondary px-2.5 py-0.5 font-mono text-[11px] font-medium text-fg-muted">
                    {dineInStatus}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-fg">Dine-in</h3>
                <ul className="mt-3 space-y-2 text-sm text-fg-muted">
                  <li>• Local restaurant discovery</li>
                  <li>• Clean digital menu access</li>
                  <li>• Planned dine-in ordering capabilities</li>
                  <li>• Streamlined in-venue dining experience</li>
                </ul>
              </div>
            </div>

            <div id="takeaway" className="surface overflow-hidden">
              <div className="relative aspect-[4/3] w-full bg-surface-secondary">
                <Image
                  src="/images/businesses/food/takeaway-counter.webp"
                  alt="Contemporary restaurant takeaway pickup counter"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <ShoppingBag className="h-5 w-5 text-intel" />
                  <span className="rounded bg-surface-secondary px-2.5 py-0.5 font-mono text-[11px] font-medium text-fg-muted">
                    {takeawayStatus}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-fg">Takeaway</h3>
                <ul className="mt-3 space-y-2 text-sm text-fg-muted">
                  <li>• Advance food ordering &amp; scheduled preparation</li>
                  <li>• Coordinated pickup handoff</li>
                  <li>• Reduced customer waiting time</li>
                  <li>• Order readiness notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Commercial Model, Membership & Tier-2 Focus */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3" data-reveal>
            <div className="surface-muted p-7">
              <p className="font-mono text-xs uppercase text-ambition">Commercial Model (Planned)</p>
              <h3 className="mt-2 text-lg font-semibold text-fg">Restaurant-First Economics</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                Designed around subscription-based restaurant charges, transparent pricing, and preserving original restaurant menu prices as a business objective — reducing dependence on high per-order commission structures.
              </p>
            </div>

            <div className="surface-muted p-7">
              <p className="font-mono text-xs uppercase text-intel">Consumer Membership (Planned)</p>
              <h3 className="mt-2 text-lg font-semibold text-fg">Passes &amp; Rewards</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                Planned consumer membership capabilities including monthly passes, eligible service benefits, reward coins, and coupon redemption. Commercial terms will be published only once finalized.
              </p>
            </div>

            <div className="surface-muted p-7">
              <p className="font-mono text-xs uppercase text-fg-subtle">Target Market Strategy</p>
              <h3 className="mt-2 text-lg font-semibold text-fg">Tier-2 Food Ecosystem</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                Focused on Tier-2 cities starting with Guntur — serving restaurants, cloud kitchens, bakeries, eligible local food businesses, and street food vendors subject to feasibility and regulatory requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Assisted Telephone Ordering */}
      <section id="telephone-ordering" className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-2 rounded bg-intel/10 px-2.5 py-1 font-mono text-xs font-medium text-intel">
                <PhoneCall className="h-3.5 w-3.5" />
                {phoneStatus} Innovation
              </span>
              <h2 className="text-headline mt-4 text-fg">AI-Assisted Telephone Ordering.</h2>
              <p className="mt-3 text-base leading-relaxed text-fg-muted">
                An app-free, telephone-based ordering concept enabling customers to order food via a standard phone call without requiring the consumer mobile application.
              </p>
              <div className="mt-6">
                <TelephoneOrderingVisual />
              </div>
              <div className="mt-6 surface p-5 text-xs leading-relaxed text-fg-muted space-y-2">
                <p className="font-semibold text-fg">Key Engineering &amp; Governance Considerations</p>
                <p>
                  Future implementation accounts for multilingual and regional voice interaction, speech recognition accuracy, live inventory synchronization, human support fallback, explicit customer consent, call recording disclosures where applicable, secure payment links, and duplicate-order prevention.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="surface p-6 sm:p-8">
                <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
                  Proposed End-to-End Telephone Workflow
                </p>
                <ol className="mt-5 space-y-3 text-sm text-fg-muted">
                  {TELEPHONE_WORKFLOW.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-surface-secondary font-mono text-[11px] font-semibold text-intel">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-4">
              <Eyebrow tone="cool">Frequently Asked Questions</Eyebrow>
              <h2 id="fd-faq-heading" className="text-headline mt-3 text-fg">
                Clear answers, no hype.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <Accordion items={FAQ_ITEMS} headingId="fd-faq-heading" />
            </div>
          </div>
        </div>
      </section>

      {/* Interest Registration */}
      <section id="register" className="bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-4">
              <Eyebrow tone="warm">Early Participation</Eyebrow>
              <h2 id="register-interest-heading" className="text-headline mt-3 text-fg">
                Register interest for Food Services.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                Restaurants, cloud kitchens, bakeries, delivery partners, customers, and business partners can register early interest below.
              </p>
            </div>
            <div className="lg:col-span-8">
              <InterestRegistrationForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
