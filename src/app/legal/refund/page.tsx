import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { COMPANY_IDENTITY } from "@/data/company";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "Dispute resolution, cancellation, and refund policy principles for VANIKARA platforms.",
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-5 pb-16 pt-12 sm:px-6 sm:pt-16">
      
      <Link href="/legal" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted transition-colors hover:text-fg">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        <span>Legal</span>
      </Link>

      <div className="space-y-4">
        <span className="eyebrow">
          Financial Policy
        </span>
        <h1 className="text-headline text-fg">
          Refund Policy
        </h1>
        <p className="text-sm text-fg-subtle">
          Pre-Launch Draft Guidelines • Applicable to Upcoming Platform Services
        </p>
      </div>

      <div className="legal-prose surface space-y-10 rounded-panel p-6 sm:p-10">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            1. Scope of Policy
          </h2>
          <p>
            This policy outlines the financial reconciliation and cancellation standards intended for {COMPANY_IDENTITY.legalName}&apos;s digital products, including the upcoming Food Delivery Platform scheduled for targeted launch in November 2026.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            2. Customer Order Cancellations & Refunds
          </h2>
          <ul className="list-disc space-y-2 pl-5 marker:text-fg-subtle">
            <li><strong>Pre-Acceptance Cancellation:</strong> Orders cancelled before a restaurant confirms order preparation will be eligible for a full refund back to the original payment source.</li>
            <li><strong>Food Quality & Missing Items:</strong> In the event of documented missing items, spillage, or verifiable hygiene issues, customers can submit evidence via the in-app support ticketing console for prompt dispute review and resolution.</li>
            <li><strong>Delivery Delays:</strong> Excessive delays caused by platform routing failure or partner non-assignment will be investigated for compensatory resolution.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            3. Merchant Subscription & Settlement Adjustments
          </h2>
          <p>
            Under our Restaurant-First philosophy, restaurant subscription billing and financial settlements will feature transparent audit ledgers. Merchant payout disputes will be handled through dedicated support channels with expedited review windows.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            4. Refund Processing Timelines
          </h2>
          <p>
            Approved refunds will be initiated automatically to the original payment method (UPI, Debit/Credit Card, Net Banking) and typically reflect within 5 to 7 business days, depending on issuing banking institutions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-fg">
            5. Inquiries & Support
          </h2>
          <p>
            For billing and refund questions, contact our support desk: <a href={`mailto:${COMPANY_IDENTITY.supportEmail}`} className="font-semibold text-intel">{COMPANY_IDENTITY.supportEmail}</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
