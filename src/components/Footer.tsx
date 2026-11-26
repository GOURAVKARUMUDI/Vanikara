import Link from "next/link";
import BrandMark from "@/components/brand/BrandMark";
import CookieSettingsButton from "@/components/layout/CookieSettingsButton";
import PublicChrome from "@/components/layout/PublicChrome";
import { getSiteContent } from "@/lib/content";

/** Concise footer: company, business portfolio, AI, careers, contact, legal and registration details only. */
export default async function Footer() {
  const { identity: COMPANY_IDENTITY } = await getSiteContent();

  const COLUMNS = [
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Vanikara" },
        { href: "/leadership", label: "Leadership" },
        { href: "/legal/legal-information", label: "Company information" },
      ],
    },
    {
      title: "Business Portfolio",
      links: [
        { href: "/food-delivery", label: "Food Services" },
        { href: "/businesses/travel", label: "Travel Booking" },
        { href: "/businesses/hotels", label: "Hotel Booking" },
        { href: "/businesses/quick-commerce", label: "Quick Commerce" },
      ],
    },
    {
      title: "Artificial Intelligence",
      links: [
        { href: "/cygma-ai", label: "CYGMA_AI" },
        { href: "/cygma-ai/resume-intelligence", label: "CYGMA-RI" },
      ],
    },
    {
      title: "Careers & Contact",
      links: [
        { href: "/careers", label: "Careers" },
        { href: "/contact", label: "Contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/legal/terms", label: "Terms & Conditions" },
        { href: "/legal/privacy", label: "Privacy Policy" },
        { href: "/legal/refund", label: "Refund & Cancellation" },
        { href: "/legal/shipping", label: "Shipping & Delivery" },
        { href: "/legal/cookies", label: "Cookie Policy" },
      ],
    },
  ];

  return (
    <PublicChrome>
      <footer className="border-t border-[#1E2E4A] bg-[#101C30] text-[#F5F7FA]">
        <div className="container-page py-16 sm:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Link href="/" aria-label="VANIKARA — Home" className="inline-flex rounded-compact [&_span]:text-white">
                <BrandMark size={26} />
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#B8C4D4]">
                {COMPANY_IDENTITY.legalName}
              </p>
              <p className="mt-2 text-xs text-[#8D9DB3]">{COMPANY_IDENTITY.operationalLocation}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-5">
              {COLUMNS.map((column) => (
                <nav key={column.title} aria-label={column.title}>
                  <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-white">
                    {column.title}
                  </h2>
                  <ul className="mt-4 space-y-2.5 text-sm">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-[#B8C4D4] transition-colors hover:text-white hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    {column.title === "Legal" && (
                      <li>
                        <CookieSettingsButton className="text-[#B8C4D4] transition-colors hover:text-white hover:underline" />
                      </li>
                    )}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-[#253654] pt-6 text-xs text-[#8D9DB3] sm:flex-row sm:items-center sm:justify-between">
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
