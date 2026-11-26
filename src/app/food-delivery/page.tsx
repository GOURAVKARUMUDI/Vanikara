import type { Metadata } from "next";
import Image from "next/image";
import { Store, Utensils, ShoppingBag } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Accordion from "@/components/ui/Accordion";
import InterestRegistrationForm from "@/sections/food-delivery/InterestRegistrationForm";
import ServiceGate from "@/components/availability/ServiceGate";
import { getSiteContent } from "@/lib/content";
import { getPortfolioItemById } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Food Services | Unified Consumer Ecosystem",
  description:
    "Vanikara's Food Services initiative covering Food Delivery, Dine-in, Takeaway, and proposed AI-Assisted Telephone Ordering, designed around restaurant-first economics.",
};


const FAQ_ITEMS = [
  {
    question: "Is Food Services live for consumer ordering today?",
    answer:
      "No. Food Delivery is currently in development with a planned rollout in Guntur, Andhra Pradesh. Dine-in and Takeaway are planned, and AI-Assisted Telephone Ordering is under development. No launch date has been announced.",
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
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-fg-subtle">Under development</span>
            <h2 className="text-headline mt-4 text-fg">AI-assisted telephone ordering.</h2>
            <p className="mt-3 text-base leading-relaxed text-fg-muted">
              A concept for ordering food by phone without installing an app. This service is under development and is not available to order.
            </p>
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
                Registration opens once online submissions are operational.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ServiceGate service="restaurant_partnerships">
                <InterestRegistrationForm />
              </ServiceGate>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
