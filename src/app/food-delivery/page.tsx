import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";
import InterestRegistrationForm from "@/sections/food-delivery/InterestRegistrationForm";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Food Delivery Platform",
  description:
    "Vanikara's restaurant-first food delivery ecosystem designed for transparent economics, targeting initial launch in Guntur, Andhra Pradesh in 2027.",
};

const FAQ_ITEMS = [
  {
    question: "Is the food delivery platform live for ordering today?",
    answer:
      "No. The platform is currently in development. We are targeting an initial launch in Guntur, Andhra Pradesh in 2027, with the exact date to be announced.",
  },
  {
    question: "Does the platform have an official product name yet?",
    answer:
      "Not yet. The final consumer-facing product name will be officially announced closer to launch.",
  },
  {
    question: "How is Vanikara approaching restaurant economics?",
    answer:
      "We are designing around transparent, subscription-centric commercial models rather than escalating percentage-per-order commissions, so restaurants can forecast costs clearly.",
  },
  {
    question: "What happens when I register early interest?",
    answer:
      "Your registration is stored in our internal CRM with your consent. Our team will contact registered restaurants, delivery partners, and customers ahead of pilot onboarding in Guntur.",
  },
];

export default async function FoodDeliveryPage() {
  const { initiatives } = await getSiteContent();
  const { foodDelivery } = initiatives;

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <SectionHeader
            as="h1"
            eyebrow={`${foodDelivery.index} · ${foodDelivery.title}`}
            tone="warm"
            title={foodDelivery.heroHeading}
            lead={foodDelivery.summary}
          >
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-medium">
              <span className="inline-flex items-center gap-2 rounded-compact border border-line bg-surface-secondary px-3 py-1.5 text-fg">
                <span aria-hidden="true" className="h-2 w-2 rounded-sm bg-ambition" />
                {foodDelivery.status}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-compact border border-line px-3 py-1.5 text-fg-muted">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ambition" />
                Planned Geography: {foodDelivery.initialMarket}
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
              <Button href="/contact" variant="outline" size="lg">
                Contact Our Team
              </Button>
            </div>
          </SectionHeader>
        </div>
      </section>

      {/* The Problem & Restaurant-First Economics */}
      <section className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12" data-reveal>
            <div className="space-y-4 lg:col-span-5">
              <Eyebrow tone="warm">The Structural Challenge</Eyebrow>
              <h2 className="text-headline text-fg">{foodDelivery.problemHeading}</h2>
              {foodDelivery.problemParagraphs.map((p) => (
                <p key={p} className="text-base leading-relaxed text-fg-muted">
                  {p}
                </p>
              ))}
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {foodDelivery.principles.map((p, idx) => (
                  <div key={p.title} className="surface p-6">
                    <span className="font-mono text-xs text-ambition">0{idx + 1}</span>
                    <h3 className="mt-2 text-base font-semibold text-fg">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Intended Applications */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="max-w-2xl" data-reveal>
            <Eyebrow tone="cool">Platform Ecosystem</Eyebrow>
            <h2 className="text-headline mt-3 text-fg">Four coordinated applications.</h2>
            <p className="mt-3 text-base text-fg-muted">
              The ecosystem is being engineered to serve every participant transparently without hidden operational friction.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
            {foodDelivery.surfaces.map((surface, idx) => (
              <div key={surface.id} className="surface-muted p-6">
                <span className="font-mono text-xs text-fg-subtle">APP 0{idx + 1}</span>
                <h3 className="mt-2 text-lg font-semibold text-fg">{surface.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{surface.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="border-b border-line bg-surface-secondary">
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
      <section id="register" className="bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12" data-reveal>
            <div className="lg:col-span-4">
              <Eyebrow tone="warm">Early Participation</Eyebrow>
              <h2 id="register-interest-heading" className="text-headline mt-3 text-fg">
                Register interest for Guntur.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                Whether you run a restaurant, plan to deliver, want to order locally, or represent a business partner, register below to hear from us as we approach pilot onboarding.
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
