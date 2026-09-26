import { COMPANY_IDENTITY } from "@/data/company";
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
        </dl>
      </div>
    </div>
  );
}
