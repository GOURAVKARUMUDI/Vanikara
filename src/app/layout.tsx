import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { Manrope } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "./motion.css";
import "./surfaces.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientLogger from "@/components/ClientLogger";
import SiteBackground from "@/components/layout/SiteBackground";
import Enhancements from "@/components/layout/Enhancements";
import ConsentBanner from "@/components/layout/ConsentBanner";
import FirebaseAnalytics from "@/components/auth/FirebaseAnalytics";
import PreferencesModal from "@/components/layout/PreferencesModal";
import { ThemeProvider, THEME_BOOT_SCRIPT } from "@/components/layout/ThemeContext";
import { ConsentProvider } from "@/context/ConsentContext";
import { COMPANY_IDENTITY } from "@/data/company";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  // Variable weight axis (200–800) so intermediate hierarchy weights like
  // 650/750 render as their exact value instead of snapping to the nearest
  // static cut.
  weight: "variable",
  display: "swap",
});

const TITLE = "VANIKARA — Building What Comes Next";

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY_IDENTITY.siteUrl),
  title: {
    default: TITLE,
    template: "%s — VANIKARA",
  },
  description: COMPANY_IDENTITY.supportingStatement,
  applicationName: "VANIKARA",
  keywords: [
    "VANIKARA",
    "VANIKARA Intelligence Private Limited",
    "food delivery platform",
    "CYGMA AI",
    "technology company",
    "Guntur",
    "Andhra Pradesh",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "VANIKARA",
    title: TITLE,
    description: COMPANY_IDENTITY.supportingStatement,
    url: "/",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: COMPANY_IDENTITY.supportingStatement,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F9FC" },
    { media: "(prefers-color-scheme: dark)", color: "#050816" },
  ],
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY_IDENTITY.legalName,
  alternateName: COMPANY_IDENTITY.brandName,
  url: COMPANY_IDENTITY.siteUrl,
  logo: `${COMPANY_IDENTITY.siteUrl}/icons/icon-512x512.png`,
  foundingDate: "2026-04-01",
  address: {
    "@type": "PostalAddress",
    streetAddress: "D-No-4-6-26/4, Near Maruthi Multi Speciality Hospital, Koritepadu",
    addressLocality: "Guntur",
    addressRegion: "Andhra Pradesh",
    postalCode: "522007",
    addressCountry: "IN",
  },
  contactPoint: [
    { "@type": "ContactPoint", contactType: "general enquiries", email: COMPANY_IDENTITY.officialEmail, areaServed: "IN", availableLanguage: "en" },
    { "@type": "ContactPoint", contactType: "customer support", email: COMPANY_IDENTITY.supportEmail, areaServed: "IN", availableLanguage: "en" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
      </head>
      <body className="relative flex min-h-screen flex-col font-sans">
        {/* First-visit brand moment: CSS only, never blocks input */}
        <div className="brand-intro" aria-hidden="true">
          <Image
            src="/brand/vanikara-symbol.png"
            alt=""
            width={128}
            height={104}
            sizes="64px"
            className="brand-intro__mark h-auto"
          />
        </div>

        {/* Refraction field for liquid glass (used by backdrop-filter on Chromium) */}
        <svg aria-hidden="true" width="0" height="0" className="pointer-events-none absolute">
          <filter id="liquid-refract" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.014" numOctaves="2" seed="11" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="3" result="field" />
            <feDisplacementMap in="SourceGraphic" in2="field" scale="22" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        <SiteBackground />

        <ThemeProvider>
          <ConsentProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-action focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
              Skip to content
            </a>
            <Navbar />
            <main id="main-content" className="relative flex-1 pt-[var(--header-height)]">
              {children}
            </main>
            <Footer />
            <ConsentBanner />
            <PreferencesModal />
            <Enhancements />
            <FirebaseAnalytics />
            <ClientLogger />
          </ConsentProvider>
        </ThemeProvider>

        {process.env.VERCEL && (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        )}
      </body>
    </html>
  );
}
