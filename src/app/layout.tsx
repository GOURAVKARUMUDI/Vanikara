import type { Metadata, Viewport } from "next";
import { Manrope, Inter, IBM_Plex_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientLogger from "@/components/ClientLogger";
import Enhancements from "@/components/layout/Enhancements";
import ConsentBanner from "@/components/layout/ConsentBanner";
import FirebaseAnalytics from "@/components/auth/FirebaseAnalytics";
import PreferencesModal from "@/components/layout/PreferencesModal";
import { ThemeProvider, THEME_BOOT_SCRIPT } from "@/components/layout/ThemeContext";
import { ConsentProvider } from "@/context/ConsentContext";
import { getSiteContent } from "@/lib/content";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

const TITLE = "VANIKARA — Intelligence Meets Purpose";

export async function generateMetadata(): Promise<Metadata> {
  const { identity: COMPANY_IDENTITY } = await getSiteContent();
  return {
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
      "CYGMA Intelligence",
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
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#101C30" },
  ],
};

function organizationJsonLd(COMPANY_IDENTITY: Awaited<ReturnType<typeof getSiteContent>>["identity"]) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_IDENTITY.legalName,
    alternateName: COMPANY_IDENTITY.brandName,
    url: COMPANY_IDENTITY.siteUrl,
    logo: `${COMPANY_IDENTITY.siteUrl}/icons/icon-512x512.png`,
    foundingDate: "2026-04-01",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Guntur",
      addressRegion: "Andhra Pradesh",
      addressCountry: "IN",
    },
    contactPoint: [
      { "@type": "ContactPoint", contactType: "general enquiries", email: COMPANY_IDENTITY.officialEmail, areaServed: "IN", availableLanguage: "en" },
      { "@type": "ContactPoint", contactType: "customer support", email: COMPANY_IDENTITY.supportEmail, areaServed: "IN", availableLanguage: "en" },
    ],
  };
}

function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

async function OrganizationJsonLd() {
  const { identity } = await getSiteContent();
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(organizationJsonLd(identity)) }} />;
}

async function SiteNavbar() {
  const { identity, navigation } = await getSiteContent();
  return <Navbar identity={identity} navigation={navigation} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${manrope.variable} ${inter.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <OrganizationJsonLd />
      </head>
      <body className="relative flex min-h-screen flex-col font-sans bg-surface text-fg antialiased">
        <ThemeProvider>
          <ConsentProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-compact focus:bg-action focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
              Skip to content
            </a>
            <SiteNavbar />
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
