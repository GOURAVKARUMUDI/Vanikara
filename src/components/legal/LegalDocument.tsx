import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { COMPANY_IDENTITY } from "@/data/company";
import { GRIEVANCE_OFFICER, LEGAL_EFFECTIVE_DATE, LEGAL_VERSION } from "@/data/legal";

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  sections: LegalSection[];
  /** Show the grievance officer card at the end (default true). */
  showGrievance?: boolean;
}

/**
 * Shared layout for every legal page: title, effective date, a table of
 * contents with anchor links, numbered sections, and the grievance
 * officer's details. Keeps all policies consistent and easy to scan.
 */
export default function LegalDocument({ eyebrow, title, intro, sections, showGrievance = true }: LegalDocumentProps) {
  return (
    <div className="container-page pb-16 pt-10 sm:pt-14">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/legal"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Legal
        </Link>

        <header className="rise-in mt-6">
          <span className="eyebrow">
            <span aria-hidden="true" className="eyebrow-dot" data-tone="cool" />
            {eyebrow}
          </span>
          <h1 className="text-headline mt-4 text-fg">{title}</h1>
          <p className="mt-3 text-sm text-fg-subtle">
            Effective {LEGAL_EFFECTIVE_DATE} · Version {LEGAL_VERSION} · {COMPANY_IDENTITY.legalName}
          </p>
          <div className="text-lead mt-5 max-w-2xl">{intro}</div>
        </header>

        <nav aria-label="On this page" className="surface mt-8 rounded-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">On this page</p>
          <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="link-underline text-fg-muted hover:text-fg">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="legal-prose surface mt-6 space-y-10 rounded-panel p-6 sm:p-10">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 space-y-3">
              <h2 className="text-lg font-bold text-fg">
                {i + 1}. {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </article>

        {showGrievance && <GrievanceCard />}
      </div>
    </div>
  );
}

export function GrievanceCard() {
  return (
    <aside aria-labelledby="grievance-title" className="surface mt-6 rounded-panel p-6 sm:p-8">
      <h2 id="grievance-title" className="text-base font-bold text-fg">
        Grievance Officer
      </h2>
      <p className="mt-2 text-sm text-fg-muted">
        For complaints about our services, payments, refunds or your personal data, contact our Grievance Officer. We
        acknowledge complaints within {GRIEVANCE_OFFICER.acknowledgeWithin} and aim to resolve them within{" "}
        {GRIEVANCE_OFFICER.resolveWithin}.
      </p>
      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-fg-subtle">Name</dt>
          <dd className="mt-0.5 font-semibold text-fg">{GRIEVANCE_OFFICER.name}</dd>
        </div>
        <div>
          <dt className="text-fg-subtle">Designation</dt>
          <dd className="mt-0.5 font-semibold text-fg">{GRIEVANCE_OFFICER.designation}</dd>
        </div>
        <div>
          <dt className="text-fg-subtle">Email</dt>
          <dd className="mt-0.5">
            <a href={`mailto:${GRIEVANCE_OFFICER.email}?subject=Grievance`} className="font-semibold text-intel">
              {GRIEVANCE_OFFICER.email}
            </a>{" "}
            <span className="text-fg-subtle">(subject: “Grievance”)</span>
          </dd>
        </div>
        <div>
          <dt className="text-fg-subtle">Hours</dt>
          <dd className="mt-0.5 text-fg">{GRIEVANCE_OFFICER.hours}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-fg-subtle">Address</dt>
          <dd className="mt-0.5 text-fg">{GRIEVANCE_OFFICER.address}</dd>
        </div>
      </dl>
    </aside>
  );
}

/** Small helpers so policy text stays readable in JSX. */
export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-fg-subtle">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function MailLink({ email, subject }: { email: string; subject?: string }) {
  return (
    <a href={`mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`} className="font-semibold">
      {email}
    </a>
  );
}
