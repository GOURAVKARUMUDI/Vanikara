import type { Metadata } from "next";
import LegalDocument, { Bullets, MailLink, type LegalSection } from "@/components/legal/LegalDocument";
import { COMPANY_IDENTITY } from "@/data/company";

export const metadata: Metadata = {
  title: "Security & Responsible Disclosure",
  description: "How VANIKARA protects data, and how to report a security vulnerability responsibly.",
  alternates: { canonical: "/legal/security" },
};

const C = COMPANY_IDENTITY;

const sections: LegalSection[] = [
  {
    id: "approach",
    title: "How we protect the website and your data",
    body: (
      <Bullets
        items={[
          "All traffic is encrypted with HTTPS, with strict transport security and a content security policy.",
          "Private data (enquiries, accounts, applications, orders) cannot be read with the public website key; only our server can access it.",
          "Résumés are kept in private storage and shared internally through links that expire.",
          "Administrator passwords are stored only as salted scrypt hashes; sessions use signed, HTTP-only cookies that expire.",
          "Sign-in, forms and APIs are rate-limited and checked for cross-site request forgery.",
          "Card, UPI and bank details are handled only by Razorpay and your bank — never by our servers.",
          "Dependencies are kept up to date and checked for known vulnerabilities.",
        ]}
      />
    ),
  },
  {
    id: "report",
    title: "Reporting a vulnerability",
    body: (
      <>
        <p>
          If you believe you have found a security issue, email <MailLink email={C.supportEmail} subject="Security report" /> with:
        </p>
        <Bullets items={["a description of the issue and where it is (URL or endpoint);", "steps to reproduce it;", "the possible impact, and your contact details."]} />
      </>
    ),
  },
  {
    id: "rules",
    title: "Rules for testing",
    body: (
      <Bullets
        items={[
          "Only test against your own account or data. Do not access, change or delete anyone else's data.",
          "Do not run denial-of-service attacks, spam, brute-force password guessing or social engineering.",
          "Stop and report as soon as you find an issue; do not keep or share any data you encountered.",
          "Give us reasonable time to fix the issue before disclosing it publicly.",
        ]}
      />
    ),
  },
  {
    id: "commitment",
    title: "Our commitment",
    body: (
      <p>
        We acknowledge reports within 48 hours, keep you updated while we fix the issue, and will not take legal action against
        researchers who follow these rules in good faith. With your permission, we are happy to credit you.
      </p>
    ),
  },
  {
    id: "incidents",
    title: "Security incidents",
    body: (
      <p>
        We report cyber security incidents to CERT-In as required by the directions under section 70B of the Information Technology
        Act, 2000, and notify affected users and the Data Protection Board of India of personal data breaches as required by the DPDP
        Act, 2023.
      </p>
    ),
  },
];

export default function SecurityPage() {
  return (
    <LegalDocument
      eyebrow="Security"
      title="Security & Responsible Disclosure"
      intro={<>Security is built into how we run the website. If you find a weakness, we want to hear about it.</>}
      sections={sections}
      showGrievance={false}
    />
  );
}
