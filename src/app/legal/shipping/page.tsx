import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { Bullets, MailLink, type LegalSection } from "@/components/legal/LegalDocument";
import { COMPANY_IDENTITY } from "@/data/company";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "VANIKARA's services are delivered digitally. How and when your work is delivered.",
  alternates: { canonical: "/legal/shipping" },
};

const C = COMPANY_IDENTITY;

const sections: LegalSection[] = [
  {
    id: "no-shipping",
    title: "No physical shipping",
    body: (
      <p>
        {C.legalName} sells digital services — websites, software and related IT work. <strong>We do not sell or ship any physical
        goods</strong>, so no shipping charges apply and there is no courier or postal delivery.
      </p>
    ),
  },
  {
    id: "how",
    title: "How services are delivered",
    body: (
      <Bullets
        items={[
          "Websites and applications are delivered by publishing them to your domain or hosting account, or to hosting we arrange for you.",
          "Source code, design files and documentation are delivered by email, a shared drive link or access to a code repository.",
          "Progress updates and previews are shared by email or a staging (preview) link before final delivery.",
        ]}
      />
    ),
  },
  {
    id: "when",
    title: "Delivery timelines",
    body: (
      <>
        <p>
          The delivery timeline for your project is stated in the package description or written quotation you accept before paying.
          The timeline starts when we confirm kick-off and have received the content, access and approvals we need from you.
        </p>
        <p>
          If a delay on our side is likely, we tell you in advance with a revised date. If we cannot deliver at all, you receive a
          refund as set out in the <Link href="/legal/refund">Refund &amp; Cancellation Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: "confirmation",
    title: "Delivery confirmation",
    body: (
      <p>
        We email you when work is delivered. Please review it and let us know within 15 days if anything does not match the agreed
        scope, so we can fix it.
      </p>
    ),
  },
  {
    id: "area",
    title: "Service area",
    body: (
      <p>
        We are based in {C.operationalLocation} and deliver our digital services to customers anywhere in India. Payments are accepted
        in Indian Rupees.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Delivery questions: <MailLink email={C.supportEmail} subject="Delivery" />.
      </p>
    ),
  },
];

export default function ShippingPolicyPage() {
  return (
    <LegalDocument
      eyebrow="Payments"
      title="Shipping & Delivery Policy"
      intro={<>Everything we provide is delivered online. Here is how and when you receive your work.</>}
      sections={sections}
    />
  );
}
