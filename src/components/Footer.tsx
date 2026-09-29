import Link from "next/link";
import Image from "next/image";
import BrandMark from "@/components/brand/BrandMark";
import CookieSettingsButton from "@/components/layout/CookieSettingsButton";
import { COMPANY_IDENTITY, NAVIGATION } from "@/data/company";

const COLUMNS = [
  {
    title: "Products",
    links: [
      ...NAVIGATION.products.map(({ href, label }) => ({ href, label })),
      { href: "/what-we-build", label: "Overview" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/leadership", label: "Leadership" },
      { href: "/technology", label: "Technology" },
      { href: "/careers", label: "Careers" },
      { href: "/login", label: "Sign in" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/cookies", label: "Cookies" },
      { href: "/legal/legal-information", label: "Company information" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-line">
      <div aria-hidden="true" className="footer-glow-line" />
      {/* Atmospheric symbol */}
      <Image
        src="/brand/vanikara-symbol.png"
        alt=""
        aria-hidden="true"
        width={876}
        height={714}
        sizes="560px"
        className="pointer-events-none absolute -bottom-40 -right-24 w-[560px] max-w-none select-none opacity-[0.05] blur-[1px] dark:opacity-[0.07]"
      />

      <div className="container-page relative py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Link href="/" aria-label="VANIKARA — home" className="inline-flex rounded-compact">
              <BrandMark size={28} />
            </Link>
            <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-fg-muted">
              {COMPANY_IDENTITY.shortStatement}
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
              <p className="pt-1 text-fg-subtle">{COMPANY_IDENTITY.operationalLocation}</p>
            </div>
          </div>

          {COLUMNS.map((column, index) => (
            <nav
              key={column.title}
              aria-label={column.title}
              className={`md:col-span-2 ${index === 0 ? "md:col-start-7" : ""}`}
            >
              <h2 className="text-[0.8125rem] font-semibold text-fg">{column.title}</h2>
              <ul className="mt-4 space-y-3 text-[0.9375rem]">
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
                {column.title === "Legal" && (
                  <li>
                    <CookieSettingsButton className="link-underline text-fg-muted transition-colors hover:text-fg" />
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-[0.8125rem] text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {COMPANY_IDENTITY.legalName}
          </p>
          <p className="tabular-nums">CIN {COMPANY_IDENTITY.cin}</p>
        </div>
      </div>

      {/* Oversized wordmark — outlined, fills with the signature gradient on hover */}
      <div aria-hidden="true" className="container-page relative -mb-[0.12em] overflow-hidden" data-reveal="blur">
        <p className="footer-wordmark text-center">VANIKARA</p>
      </div>
    </footer>
  );
}
