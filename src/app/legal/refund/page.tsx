import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { Bullets, MailLink, type LegalSection } from "@/components/legal/LegalDocument";
import { COMPANY_IDENTITY } from "@/data/company";
import { PAYMENT_TERMS } from "@/data/legal";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "How to cancel an order with VANIKARA, when refunds apply, and how long they take.",
  alternates: { canonical: "/legal/refund" },
};

const C = COMPANY_IDENTITY;
const P = PAYMENT_TERMS;

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "What this policy covers",
    body: (
      <p>
        This policy applies to all payments made to {C.legalName} for our website and software packages and custom projects,
        including payments made online through {P.gateway}. It forms part of our <Link href="/legal/terms">Terms &amp; Conditions</Link>.
      </p>
    ),
  },
  {
    id: "summary",
    title: "Summary",
    body: (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-fg">
              <th className="py-2 pr-4 font-semibold">Situation</th>
              <th className="py-2 font-semibold">Refund</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            <tr>
              <td className="py-2 pr-4">Cancelled before work starts</td>
              <td className="py-2"><strong>100%</strong> of the amount paid</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Cancelled after work has started</td>
              <td className="py-2">Amount paid <strong>minus</strong> the value of work completed and any non-refundable third-party costs</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Project delivered and accepted, or milestone approved</td>
              <td className="py-2">No refund for that delivered work</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Payment failed but money was debited, or you were charged twice</td>
              <td className="py-2"><strong>100%</strong>, automatically</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">We cancel or cannot deliver</td>
              <td className="py-2"><strong>100%</strong> of the amount for undelivered work</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: "before",
    title: "Cancelling before work starts",
    body: (
      <p>
        Work starts when we confirm the project kick-off to you in writing (by email). If you cancel before then, you receive a full
        refund of everything you paid, with no deduction.
      </p>
    ),
  },
  {
    id: "after",
    title: "Cancelling after work has started",
    body: (
      <>
        <p>You can cancel at any time. We then refund the amount you paid, less:</p>
        <Bullets
          items={[
            "the value of work already completed — for milestone-based projects, the price of completed milestones; otherwise, the share of the agreed price that matches the work done, which we explain to you in writing; and",
            "costs we paid to third parties for your project that cannot be recovered, such as domain registrations, paid themes, plugins or licences bought for you (you keep these).",
          ]}
        />
        <p>
          We hand over all work completed up to the cancellation date. If what you have paid is less than the value of work completed,
          nothing further is charged unless your quotation says otherwise.
        </p>
      </>
    ),
  },
  {
    id: "delivered",
    title: "Delivered and accepted work",
    body: (
      <p>
        Once a project or milestone has been delivered and accepted by you — or you have not raised any issue within 15 days of
        delivery — that work is not refundable. If a deliverable does not match the agreed scope, tell us within those 15 days and we
        will fix it free of charge; if we cannot, we refund the amount paid for that part.
      </p>
    ),
  },
  {
    id: "failed",
    title: "Failed, duplicate or incorrect payments",
    body: (
      <p>
        If your account is debited but the payment fails, or you are charged more than once or more than the invoiced amount, the extra
        amount is refunded in full. Failed transactions are usually reversed automatically by {P.gateway} and your bank within{" "}
        {P.failedPaymentRefundWithin}. If you do not see the reversal, email us with the transaction details.
      </p>
    ),
  },
  {
    id: "by-us",
    title: "Cancellation by VANIKARA",
    body: (
      <p>
        If we have to cancel an order or cannot complete it for reasons on our side, we refund the full amount for any work not
        delivered.
      </p>
    ),
  },
  {
    id: "how",
    title: "How to request a cancellation or refund",
    body: (
      <>
        <p>
          Email <MailLink email={C.supportEmail} subject="Cancellation / refund request" /> from the email address used for your order,
          with:
        </p>
        <Bullets
          items={["your name and the order, invoice or Razorpay payment ID;", "the amount paid and the date of payment;", "the reason for the request (optional, but it helps us improve)."]}
        />
        <p>We acknowledge your request within 48 hours and tell you our decision within {P.refundDecisionWithin}.</p>
      </>
    ),
  },
  {
    id: "timelines",
    title: "How and when refunds are paid",
    body: (
      <Bullets
        items={[
          <>Refunds are paid to the <strong>original payment method</strong> (the same card, UPI ID, bank account or wallet) through {P.gateway}. We do not refund in cash.</>,
          <>Once we issue a refund, it usually reaches you within <strong>{P.refundCreditWithin}</strong>, depending on your bank or card issuer.</>,
          "Refunds are made in Indian Rupees for the amount paid. We do not charge any fee for processing a refund.",
          "We email you when the refund has been issued, with the reference number you can quote to your bank.",
        ]}
      />
    ),
  },
  {
    id: "chargebacks",
    title: "Disputes and chargebacks",
    body: (
      <p>
        If something has gone wrong with a payment, please contact us first — most issues are resolved quickly. If you raise a
        chargeback with your bank, we respond to it through {P.gateway} with the relevant order records.
      </p>
    ),
  },
  {
    id: "future",
    title: "Future products",
    body: (
      <p>
        Our food delivery platform is not yet live. When it launches, its own cancellation and refund rules (for example, for orders
        cancelled before a restaurant accepts them) will be published here before any orders are taken.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Refund questions: <MailLink email={C.supportEmail} subject="Refund" />. If you are not satisfied with our response, contact our
        Grievance Officer (details below).
      </p>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalDocument
      eyebrow="Payments"
      title="Refund & Cancellation Policy"
      intro={<>A clear, fair policy: a full refund before work starts, a pro-rata refund after, and automatic refunds for failed payments.</>}
      sections={sections}
    />
  );
}
