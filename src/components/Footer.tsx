import Link from "next/link";
import BrandMark from "@/components/brand/BrandMark";
import CookieSettingsButton from "@/components/layout/CookieSettingsButton";
import PublicChrome from "@/components/layout/PublicChrome";
import { getSiteContent } from "@/lib/content";

export default async function Footer() {
  const { identity: COMPANY_IDENTITY } = await getSiteContent();

  const COLUMNS = [
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Vanikara" },
        { href: "/leadership", label: "Leadership" },
        { href: "/about#journey", label: "Our Journey" },
        { href: "/about#principles", label: "Principles" },
      ],
    },
    {
      title: "Products",
      links: [
        { href: "/what-we-build", label: "All Initiatives" },
        { href: "/food-delivery", label: "Food Delivery Platform" },
        { href: "/cygma", label: "CYGMA Intelligence" },
      ],
    },
    {
      title: "Technology & Careers",
      links: [
        { href: "/technology", label: "Engineering" },
        { href: "/technology#security", label: "Security" },
        { href: "/careers", label: "Open Positions" },
        { href: "/account/applications", label: "Track Application" },
        { href: "/contact", label: "Contact Us" },
      ],
    },
    {
      title: "Legal & Privacy",
      links: [
        { href: "/legal/terms", label: "Terms & Conditions" },
        { href: "/legal/privacy", label: "Privacy Policy" },
        { href: "/legal/refund", label: "Refund & Cancellation" },
        { href: "/legal/shipping", label: "Shipping & Delivery" },
        { href: "/legal/cookies", label: "Cookie Policy" },
        { href: "/legal/security", label: "Security Policy" },
        { href: "/legal/legal-information", label: "Company Information" },
      ],
    },
  ];

  return (
    <PublicChrome>
      <footer className="mt-20 border-t border-line bg-surface-secondary">
        <div className="container-page py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link href="/" aria-label="VANIKARA — Home" className="inline-flex rounded-compact">
                <BrandMark size={26} />
              </Link>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-muted">
                {COMPANY_IDENTITY.supportingStatement}
              </p>
              <div className="mt-6 space-y-1.5 text-sm">
                <a
                  href={`mailto:${COMPANY_IDENTITY.officialEmail}`}
                  className="link-underline block w-fit font-medium text-fg"
                >
                  {COMPANY_IDENTITY.officialEmail}
                </a>
                <a
                  href={`mailto:${COMPANY_IDENTITY.supportEmail}`}
                  className="link-underline block w-fit text-fg-muted hover:text-fg"
                >
                  {COMPANY_IDENTITY.supportEmail}
                </a>
                <p className="pt-1 text-xs text-fg-subtle">{COMPANY_IDENTITY.operationalLocation}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
              {COLUMNS.map((column) => (
                <nav key={column.title} aria-label={column.title}>
                  <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-fg">
                    {column.title}
                  </h2>
                  <ul className="mt-4 space-y-2.5 text-sm">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="link-underline text-fg-muted transition-colors hover:text-fg"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    {column.title === "Legal & Privacy" && (
                      <li>
                        <CookieSettingsButton className="link-underline text-fg-muted transition-colors hover:text-fg" />
                      </li>
                    )}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {COMPANY_IDENTITY.legalName}. All rights reserved.
            </p>
            <p className="font-mono tabular-nums">CIN {COMPANY_IDENTITY.cin}</p>
          </div>
        </div>
      </footer>
    </PublicChrome>
  );
}
