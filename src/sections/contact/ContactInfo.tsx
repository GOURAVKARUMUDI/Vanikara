import Link from "next/link";
import { COMPANY_IDENTITY } from "@/data/company";
import { GRIEVANCE_OFFICER } from "@/data/legal";
import { BrandSymbol } from "@/components/brand/BrandMark";

const CHANNELS = [
  { label: "General enquiries", email: COMPANY_IDENTITY.officialEmail },
  { label: "Support", email: COMPANY_IDENTITY.supportEmail },
];

export default function ContactInfo() {
  return (
    <div className="rise-in space-y-10" style={{ ["--rise-delay" as string]: "120ms" }}>
      <div className="space-y-6">
        {CHANNELS.map((channel) => (
          <div key={channel.email}>
            <p className="text-[0.8125rem] text-fg-subtle">{channel.label}</p>
            <a
              href={`mailto:${channel.email}`}
              className="link-underline mt-1 inline-block text-xl font-semibold text-fg [overflow-wrap:anywhere]"
            >
              {channel.email}
            </a>
          </div>
        ))}
      </div>

      <div className="surface rounded-feature p-6">
        <div className="flex items-center gap-3">
          <BrandSymbol size={22} alt="" />
          <p className="text-sm font-semibold text-fg">{COMPANY_IDENTITY.legalName}</p>
        </div>
        <dl className="mt-6 space-y-5 text-[0.9375rem]">
          <div>
            <dt className="text-[0.8125rem] text-fg-subtle">Registered office</dt>
            <dd className="mt-1 leading-relaxed text-fg">
              <address className="not-italic">
                {COMPANY_IDENTITY.registeredOfficeLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-fg-subtle">Operations</dt>
            <dd className="mt-1 text-fg">{COMPANY_IDENTITY.operationalLocation}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-fg-subtle">CIN</dt>
            <dd className="mt-1 tabular-nums text-fg">{COMPANY_IDENTITY.cin}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-fg-subtle">Support hours</dt>
            <dd className="mt-1 text-fg">{GRIEVANCE_OFFICER.hours}</dd>
          </div>
        </dl>
      </div>

      <div className="surface rounded-feature p-6">
        <p className="text-sm font-semibold text-fg">Grievance Officer</p>
        <p className="mt-2 text-[0.9375rem] text-fg">
          {GRIEVANCE_OFFICER.name}, {GRIEVANCE_OFFICER.designation}
        </p>
        <a
          href={`mailto:${GRIEVANCE_OFFICER.email}?subject=Grievance`}
          className="link-underline mt-1 inline-block text-[0.9375rem] font-semibold text-intel"
        >
          {GRIEVANCE_OFFICER.email}
        </a>
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-fg-muted">
          Complaints are acknowledged within {GRIEVANCE_OFFICER.acknowledgeWithin} and resolved within{" "}
          {GRIEVANCE_OFFICER.resolveWithin}. See our{" "}
          <Link href="/legal/refund" className="font-semibold text-intel">
            refund policy
          </Link>{" "}
          and{" "}
          <Link href="/legal/terms" className="font-semibold text-intel">
            terms
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
