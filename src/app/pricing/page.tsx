import type { Metadata } from "next";
import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { COMPANY_IDENTITY } from "@/data/company";
import { PAYMENT_TERMS, SERVICE_PACKAGES, formatINR } from "@/data/legal";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Standard website and software packages from VANIKARA, and how custom projects are priced. All prices in INR.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <section className="container-page pb-10 pt-16 sm:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="Pricing"
          tone="warm"
          title="Clear prices, agreed before we start."
          lead="Standard packages for websites, and written quotations for custom software. You always know the price, scope and timeline before you pay."
        />
      </section>

      <section aria-labelledby="packages-title" className="container-page pb-12">
        <h2 id="packages-title" className="sr-only">
          Standard packages
        </h2>
        <ul className="grid gap-5 md:grid-cols-3">
          {SERVICE_PACKAGES.map((pkg, i) => (
            <li
              key={pkg.id}
              data-reveal
              data-tone={i === 1 ? "warm" : "cool"}
              style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
              className={`card-interactive surface relative flex flex-col rounded-feature p-7 ${i === 1 ? "beam-border" : ""}`}
            >
              <h3 className="text-lg font-bold text-fg">{pkg.name}</h3>
              <p className="mt-1 text-sm text-fg-muted">{pkg.summary}</p>
              <p className="mt-6 text-4xl font-extrabold tracking-tight text-fg tabular-nums">{formatINR(pkg.price)}</p>
              <p className="mt-1 text-xs text-fg-subtle">One-time · taxes as applicable, shown on invoice</p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-fg">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-intel" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button href="/contact" variant={i === 1 ? "primary" : "secondary"} className="mt-8 w-full" arrow>
                Enquire about {pkg.name}
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="custom-title" className="container-page pb-12">
        <div className="surface rounded-panel p-7 sm:p-10" data-reveal>
          <h2 id="custom-title" className="text-title text-fg">
            Custom software and IT projects
          </h2>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-fg-muted">
            For anything beyond a standard package, we send a written quotation with the scope, deliverables, timeline, total price in
            INR and any payment milestones. Work starts only after you accept it.
          </p>
          <div className="mt-6">
            <Button href="/contact" arrow>
              Request a quotation
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="payments-title" className="container-page pb-20">
        <div className="grid gap-6 rounded-panel border border-line p-7 sm:p-10 md:grid-cols-[auto_1fr]" data-reveal>
          <ShieldCheck aria-hidden="true" className="h-8 w-8 text-intel" />
          <div>
            <h2 id="payments-title" className="text-base font-bold text-fg">
              Payments, refunds and delivery
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-fg-muted">
              <li>
                Payments are processed securely by {PAYMENT_TERMS.gateway} ({PAYMENT_TERMS.methods}). We never see your card or bank
                details.
              </li>
              <li>
                Cancel before work starts for a full refund; after that, you pay only for work completed. Refunds reach your original
                payment method within {PAYMENT_TERMS.refundCreditWithin}. <Link href="/legal/refund" className="font-semibold text-intel">Refund policy</Link>
              </li>
              <li>
                Everything is delivered online — nothing is physically shipped.{" "}
                <Link href="/legal/shipping" className="font-semibold text-intel">Delivery policy</Link>
              </li>
              <li>
                Sold by {COMPANY_IDENTITY.legalName} (CIN {COMPANY_IDENTITY.cin}). <Link href="/legal/terms" className="font-semibold text-intel">Terms &amp; Conditions</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
