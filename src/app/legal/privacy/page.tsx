import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { Bullets, MailLink, type LegalSection } from "@/components/legal/LegalDocument";
import { COMPANY_IDENTITY } from "@/data/company";
import { GRIEVANCE_OFFICER } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What personal data VANIKARA collects, why, who it is shared with, and your rights under Indian law.",
  alternates: { canonical: "/legal/privacy" },
};

const C = COMPANY_IDENTITY;

const DATA_TABLE: { what: string; data: string; why: string; keep: string }[] = [
  {
    what: "Contact form",
    data: "Name, email, phone (optional), organisation, subject, message",
    why: "To reply to your enquiry and follow up on it",
    keep: "Up to 3 years after our last contact",
  },
  {
    what: "Google sign-in (optional)",
    data: "Name, email address, profile picture and Google account ID; sign-in dates",
    why: "To create and maintain your account",
    keep: "Until you delete your account",
  },
  {
    what: "Job applications",
    data: "Name, email, phone, position, portfolio link, cover letter, résumé",
    why: "To assess your application and contact you",
    keep: "Up to 12 months, unless you ask us to keep it longer",
  },
  {
    what: "Orders and payments",
    data: "Name, email, phone, billing details, order and invoice details, Razorpay payment and order IDs, payment status",
    why: "To provide services, issue invoices, process refunds and meet tax and accounting law",
    keep: "8 years, as required for books of account (Companies Act, 2013, s. 128)",
  },
  {
    what: "Cookie choices",
    data: "Your consent choices and policy version (stored in your browser)",
    why: "To respect your choices",
    keep: "Until you change or clear them",
  },
  {
    what: "Security and technical data",
    data: "IP address, browser and device information, request logs, error reports",
    why: "To keep the site secure, prevent abuse and fraud, and fix errors",
    keep: "Up to 180 days",
  },
  {
    what: "Analytics (only with your consent)",
    data: "Pages viewed, approximate location, device type (Google Analytics for Firebase)",
    why: "To understand how the site is used and improve it",
    keep: "Up to 14 months",
  },
];

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who is responsible for your data",
    body: (
      <p>
        {C.legalName} (CIN {C.cin}), {C.registeredOffice}, is the <strong>Data Fiduciary</strong> for personal data collected
        through this website, as defined in the Digital Personal Data Protection Act, 2023 (&quot;DPDP Act&quot;). This policy
        also meets the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures
        and Sensitive Personal Data or Information) Rules, 2011.
      </p>
    ),
  },
  {
    id: "collect",
    title: "What we collect and why",
    body: (
      <>
        <p>We only collect data we need. You can use most of the website without giving us any personal data.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-fg">
                <th className="py-2 pr-3 font-semibold">When</th>
                <th className="py-2 pr-3 font-semibold">Data</th>
                <th className="py-2 pr-3 font-semibold">Purpose</th>
                <th className="py-2 font-semibold">Kept for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] align-top">
              {DATA_TABLE.map((row) => (
                <tr key={row.what}>
                  <td className="py-2 pr-3 font-semibold text-fg">{row.what}</td>
                  <td className="py-2 pr-3">{row.data}</td>
                  <td className="py-2 pr-3">{row.why}</td>
                  <td className="py-2">{row.keep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>Payment card and bank details:</strong> we never collect or store your card number, CVV, UPI PIN or net-banking
          credentials. They are entered directly with Razorpay and your bank.
        </p>
      </>
    ),
  },
  {
    id: "basis",
    title: "Legal basis: consent and legitimate uses",
    body: (
      <>
        <p>
          We process personal data on the basis of your <strong>consent</strong>, which you give when you submit a form, sign in,
          apply for a job or accept optional cookies — each time for the purpose described above. You can withdraw consent at any
          time (see <a href="#rights">Your rights</a>); this does not affect processing that happened before.
        </p>
        <p>
          Some processing is a <strong>legitimate use</strong> under section 7 of the DPDP Act that does not need separate consent —
          for example, keeping invoices and accounting records required by law, and responding to legal requests.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share data with",
    body: (
      <>
        <p>
          <strong>We do not sell or rent personal data.</strong> We share it only with service providers (Data Processors) that help
          us run the website and our services, under contracts that require them to protect it:
        </p>
        <Bullets
          items={[
            <><strong>Supabase</strong> — database and file storage for enquiries, accounts, applications and orders.</>,
            <><strong>Vercel</strong> — website hosting and anonymous performance measurement.</>,
            <><strong>Google (Firebase)</strong> — Google sign-in, and analytics only if you consent.</>,
            <><strong>Razorpay</strong> — payment processing and refunds.</>,
            <><strong>Email and Google Forms services</strong> — to deliver notifications and keep internal records of enquiries.</>,
          ]}
        />
        <p>
          We may also disclose data when required by law, a court order or a government authority, or to protect the rights and safety
          of VANIKARA, our users or others.
        </p>
        <p>
          Our internal CYGMA initiative does not send your personal data to public AI services, and we do not use your data to train
          public models.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "Transfers outside India",
    body: (
      <p>
        Some of our providers may store or process data on servers outside India. We transfer data only as permitted by the DPDP Act,
        and never to a country the Government of India has restricted.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Under the DPDP Act you have the right to:</p>
        <Bullets
          items={[
            "get a summary of the personal data we hold about you and how we use it, and the identities of those we have shared it with;",
            "have inaccurate or incomplete data corrected, completed or updated;",
            "have your data erased once it is no longer needed, including deleting your account — unless we must keep it by law (for example, invoices);",
            "withdraw consent at any time, as easily as you gave it;",
            "have a complaint addressed by our Grievance Officer, and then by the Data Protection Board of India if you are not satisfied;",
            "nominate another person to exercise these rights if you die or become incapable.",
          ]}
        />
        <p>
          To use any of these rights, email <MailLink email={GRIEVANCE_OFFICER.email} subject="Privacy request" /> from the email address
          linked to your data. We may ask you to confirm your identity. We respond within {GRIEVANCE_OFFICER.resolveWithin}. You can
          withdraw consent for optional cookies at any time using <strong>Cookie settings</strong> in the footer.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        The website and our services are not directed at children under 18. We do not knowingly collect a child&apos;s personal data
        without verifiable consent from a parent or lawful guardian. If you believe a child has given us data, contact us and we will
        delete it.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect your data",
    body: (
      <>
        <p>
          We use reasonable security practices consistent with IS/ISO/IEC 27001 principles, including: encryption in transit (HTTPS);
          database access rules that block direct public access to private data; private file storage with time-limited links; hashed
          administrator passwords and signed, HTTP-only session cookies; rate limiting and abuse protection; and access limited to
          authorised staff, with administrative actions logged.
        </p>
        <p>
          No method is completely secure. If a personal data breach occurs, we will inform affected users and the Data Protection Board
          of India as required by the DPDP Act, and act to contain it. See our <Link href="/legal/security">Security</Link> page.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>
        We use essential cookies and browser storage to run the site, and optional analytics only with your consent. Details are in
        our <Link href="/legal/cookies">Cookie Policy</Link>.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We will update this policy when our practices change and show the new effective date at the top. If a change is significant,
        we will highlight it on the website, and ask for fresh consent where the law requires it.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      eyebrow="Privacy"
      title="Privacy Policy"
      intro={<>This policy explains, in plain language, what personal data we collect, why we collect it, and how you can control it.</>}
      sections={sections}
    />
  );
}
