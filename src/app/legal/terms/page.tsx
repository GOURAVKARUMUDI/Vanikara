import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { Bullets, MailLink, type LegalSection } from "@/components/legal/LegalDocument";
import { COMPANY_IDENTITY } from "@/data/company";
import { GRIEVANCE_OFFICER, PAYMENT_TERMS } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms for using the VANIKARA website and buying services from ${COMPANY_IDENTITY.legalName}.`,
  alternates: { canonical: "/legal/terms" },
};

const C = COMPANY_IDENTITY;

const sections: LegalSection[] = [
  {
    id: "about",
    title: "Who we are",
    body: (
      <p>
        This website, <strong>{C.siteUrl.replace("https://", "")}</strong>, is operated by <strong>{C.legalName}</strong>{" "}
        (&quot;VANIKARA&quot;, &quot;we&quot;, &quot;us&quot;), a private limited company incorporated under the Companies Act, 2013
        (CIN {C.cin}), with its registered office at {C.registeredOffice}. You can reach us at <MailLink email={C.officialEmail} />.
      </p>
    ),
  },
  {
    id: "acceptance",
    title: "Accepting these terms",
    body: (
      <>
        <p>
          By using this website, creating an account, or buying a service from us, you agree to these Terms &amp; Conditions,
          our <Link href="/legal/privacy">Privacy Policy</Link>, <Link href="/legal/refund">Refund &amp; Cancellation Policy</Link>,{" "}
          <Link href="/legal/shipping">Shipping &amp; Delivery Policy</Link> and <Link href="/legal/cookies">Cookie Policy</Link>,
          which form part of these terms. If you do not agree, please do not use the website or our services.
        </p>
        <p>
          You must be at least 18 years old, or use the services under the supervision of a parent or guardian who accepts these
          terms, and be competent to contract under the Indian Contract Act, 1872. If you act for a business, you confirm you are
          authorised to bind it.
        </p>
      </>
    ),
  },
  {
    id: "services",
    title: "Our services",
    body: (
      <>
        <p>We currently offer:</p>
        <Bullets
          items={[
            <>
              <strong>Standard website and software packages</strong> at the prices listed on our <Link href="/pricing">Pricing</Link> page.
            </>,
            <>
              <strong>Custom software and IT projects</strong>, priced by a written quotation or proposal that sets out the scope,
              deliverables, timeline, price and payment milestones.
            </>,
          ]}
        />
        <p>
          Our food delivery platform and the CYGMA initiative described on this website are <strong>in development and not yet
          offered for sale</strong>. Descriptions of them show intent and direction, not features that are available today.
          Separate terms will apply when they launch.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Accounts and sign-in",
    body: (
      <>
        <p>
          You can browse the whole website without an account. You may optionally sign in with your Google account; this creates a
          VANIKARA account using your name, email address and profile picture from Google. Signing in does not give access to any
          additional content. Administrative accounts are issued only by VANIKARA — there is no public registration for them.
        </p>
        <p>
          You are responsible for keeping your Google account secure and for activity under your account. We may suspend or close
          an account that breaches these terms or is used unlawfully. You can ask us to delete your account at any time (see the{" "}
          <Link href="/legal/privacy#rights">Privacy Policy</Link>).
        </p>
      </>
    ),
  },
  {
    id: "orders",
    title: "Quotations, orders and acceptance",
    body: (
      <Bullets
        items={[
          "An order is placed when you accept a package or a written quotation and make the payment requested for it.",
          "A contract is formed when we confirm your order by email. We may decline an order (for example, if the requested work is unlawful or outside our capabilities); if we decline after you have paid, we refund you in full.",
          "The scope of work is what is stated in the package description or your quotation. Changes to scope are agreed in writing and may change the price and timeline.",
          "You agree to provide the content, access and approvals we reasonably need, on time. Delays in providing them may move the delivery timeline.",
        ]}
      />
    ),
  },
  {
    id: "pricing-payment",
    title: "Prices and payment",
    body: (
      <>
        <Bullets
          items={[
            <>All prices are in {PAYMENT_TERMS.currency}. Applicable taxes, where they apply, are shown on your invoice before you pay.</>,
            <>
              Online payments are processed by <strong>{PAYMENT_TERMS.gateway}</strong> ({PAYMENT_TERMS.gatewayLegalName}), an
              RBI-authorised payment aggregator. Accepted methods include {PAYMENT_TERMS.methods}.
            </>,
            "We never see or store your full card number, CVV, UPI PIN or net-banking password. These are entered directly with Razorpay and your bank, and are handled under their security standards (including PCI-DSS).",
            "For custom projects, payment may be due in milestones (for example, an advance before work starts and the balance on delivery), as set out in the quotation.",
            "You receive a payment confirmation from Razorpay and an invoice or receipt from us by email.",
            "If a payment fails but your account is debited, the amount is reversed automatically — see the Refund & Cancellation Policy.",
          ]}
        />
        <p>
          We may change our prices at any time, but a change never affects an order that has already been confirmed.
        </p>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Delivery of services",
    body: (
      <p>
        Our services are delivered digitally — nothing is physically shipped. How and when work is delivered is explained in our{" "}
        <Link href="/legal/shipping">Shipping &amp; Delivery Policy</Link> and in your quotation.
      </p>
    ),
  },
  {
    id: "cancellation",
    title: "Cancellations and refunds",
    body: (
      <p>
        You can cancel an order, and may be entitled to a full or partial refund, as described in our{" "}
        <Link href="/legal/refund">Refund &amp; Cancellation Policy</Link>. Nothing in these terms limits any right you have under
        the Consumer Protection Act, 2019.
      </p>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <>
        <p>
          The VANIKARA name, logo, website design, text and code are owned by or licensed to {C.legalName} and are protected by
          Indian and international law. You may not copy, reproduce, scrape or reuse them without our written permission, except to
          view and share pages for personal, non-commercial use.
        </p>
        <p>
          For work we deliver to you: once you have paid in full, you own the final deliverables created specifically for you, unless
          your quotation says otherwise. We keep ownership of our pre-existing tools, libraries and know-how, and grant you a
          non-exclusive licence to use any of them included in your deliverables. Third-party and open-source components remain under
          their own licences. Unless you ask us not to, we may mention that we worked with you in our portfolio, without disclosing
          confidential information.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>When using the website or our services, you agree not to:</p>
        <Bullets
          items={[
            "break any law, or infringe anyone's rights, including intellectual property and privacy rights;",
            "submit false, misleading, abusive or spam messages through our forms;",
            "attempt to gain unauthorised access to any account, system or data, or probe, scan or test our security without permission (see our Security page for responsible disclosure);",
            "upload malware, or overload, disrupt or attack the website (including denial-of-service or automated scraping);",
            "ask us to build anything unlawful, deceptive or harmful;",
            "impersonate VANIKARA, its directors or staff, or misrepresent an affiliation with us.",
          ]}
        />
      </>
    ),
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    body: (
      <p>
        Each party keeps confidential any non-public information received from the other in connection with a project and uses it
        only for that project. This does not apply to information that is public, already known, independently developed, or that
        must be disclosed by law.
      </p>
    ),
  },
  {
    id: "warranties",
    title: "Warranties and disclaimers",
    body: (
      <>
        <p>
          We will perform services with reasonable skill and care. If a deliverable does not meet the agreed scope, tell us within 15
          days of delivery and we will fix it at no extra cost.
        </p>
        <p>
          Otherwise, the website and its content are provided &quot;as is&quot; for general information. We do not guarantee that the
          website will be uninterrupted or error-free, or that third-party services we depend on (such as hosting, Google or Razorpay)
          will always be available.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <p>
        To the extent permitted by law, VANIKARA is not liable for indirect, incidental, special or consequential losses, or for loss
        of profits, revenue or data. Our total liability for any claim relating to a service is limited to the amount you paid us for
        that service. Nothing in these terms excludes liability that cannot be excluded by law, including for fraud or for death or
        personal injury caused by negligence.
      </p>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    body: (
      <p>
        You agree to compensate VANIKARA for losses arising from content or materials you provide to us that infringe someone
        else&apos;s rights, or from your breach of these terms.
      </p>
    ),
  },
  {
    id: "third-party",
    title: "Third-party services and links",
    body: (
      <p>
        The website uses and links to third-party services, including Google (sign-in and analytics) and Razorpay (payments). Their
        use is governed by their own terms and privacy policies, and we are not responsible for their content or practices.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Suspension and termination",
    body: (
      <p>
        We may suspend or end your access to the website or an account if you breach these terms. Either party may end a project
        under the Refund &amp; Cancellation Policy. Sections that by their nature should continue — such as payment for work
        delivered, intellectual property, confidentiality and limitation of liability — survive termination.
      </p>
    ),
  },
  {
    id: "force-majeure",
    title: "Events outside our control",
    body: (
      <p>
        We are not responsible for delays or failures caused by events beyond our reasonable control, such as natural disasters,
        outages of internet or cloud providers, government action or strikes. We will tell you promptly and resume as soon as we can.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: (
      <p>
        These terms are governed by the laws of India. We encourage you to contact our Grievance Officer first so we can try to
        resolve any concern quickly. Subject to your rights under the Consumer Protection Act, 2019 (including approaching a Consumer
        Commission), the courts at Guntur, Andhra Pradesh have exclusive jurisdiction.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. The version and effective date at the top of this page show when they last
        changed. Changes do not affect orders already confirmed. Continuing to use the website after a change means you accept the
        updated terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about these terms: <MailLink email={C.officialEmail} subject="Terms & Conditions" />. Complaints:{" "}
        {GRIEVANCE_OFFICER.name}, Grievance Officer, <MailLink email={GRIEVANCE_OFFICER.email} subject="Grievance" />.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Terms"
      title="Terms & Conditions"
      intro={<>These terms set out the rules for using our website and the agreement that applies when you buy services from us.</>}
      sections={sections}
    />
  );
}
