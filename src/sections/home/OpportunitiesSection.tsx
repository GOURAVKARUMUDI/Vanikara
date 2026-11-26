import Link from "next/link";
import { ArrowRight, Briefcase, Handshake, Store, Truck } from "lucide-react";
import Eyebrow from "@/components/ui/Eyebrow";

const OPPORTUNITIES = [
  {
    icon: Briefcase,
    title: "Career Opportunities",
    desc: "Explore engineering, product, operations, and internship opportunities at Vanikara.",
    href: "/careers",
    cta: "View careers",
  },
  {
    icon: Handshake,
    title: "Business Partnerships",
    desc: "Connect with our team regarding strategic collaborations and enterprise enquiries.",
    href: "/contact?topic=partnership",
    cta: "Start a conversation",
  },
  {
    icon: Store,
    title: "Restaurant Interest",
    desc: "Restaurants in Guntur interested in our restaurant-first delivery economics can register early interest.",
    href: "/food-delivery#register",
    cta: "Register restaurant",
  },
  {
    icon: Truck,
    title: "Delivery Partner Interest",
    desc: "Prospective delivery partners in Guntur can register interest ahead of our planned 2027 launch.",
    href: "/food-delivery#register",
    cta: "Register as partner",
  },
];

export default function OpportunitiesSection() {
  return (
    <section aria-labelledby="opportunities-heading" className="border-b border-line bg-surface-secondary">
      <div className="container-page py-20 sm:py-28">
        <div className="max-w-2xl" data-reveal>
          <Eyebrow tone="warm">Engage With Us</Eyebrow>
          <h2 id="opportunities-heading" className="text-headline mt-4 text-fg">
            Opportunities & early participation.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {OPPORTUNITIES.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="surface card-interactive group flex flex-col justify-between p-6"
              >
                <div>
                  <Icon aria-hidden="true" className="h-5 w-5 text-intel" />
                  <h3 className="mt-4 text-base font-semibold text-fg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.desc}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-intel">
                  {item.cta}
                  <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
