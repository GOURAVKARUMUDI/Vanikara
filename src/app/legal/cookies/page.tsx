import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, { MailLink, type LegalSection } from "@/components/legal/LegalDocument";
import CookieSettingsButton from "@/components/layout/CookieSettingsButton";
import { COMPANY_IDENTITY } from "@/data/company";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "The cookies and browser storage the VANIKARA website uses, and how to control them.",
  alternates: { canonical: "/legal/cookies" },
};

const STORAGE: { name: string; type: string; category: string; purpose: string; duration: string }[] = [
  { name: "vk_user", type: "Cookie (HTTP-only)", category: "Essential", purpose: "Keeps you signed in after Google sign-in", duration: "7 days" },
  { name: "vk_admin", type: "Cookie (HTTP-only)", category: "Essential", purpose: "Signed-in session for VANIKARA administrators only", duration: "8 hours" },
  { name: "Firebase Auth (firebase:authUser…)", type: "Browser storage (IndexedDB)", category: "Essential", purpose: "Completes Google sign-in; set only when you sign in", duration: "Until you sign out" },
  { name: "cookie_consent_settings, cookie_consent_version", type: "Local storage", category: "Essential", purpose: "Remembers your cookie choices", duration: "Until changed or cleared" },
  { name: "vanikara-theme", type: "Local storage", category: "Preference", purpose: "Remembers Light, Dark or Auto theme", duration: "Until changed or cleared" },
  { name: "vk-intro", type: "Session storage", category: "Preference", purpose: "Shows the opening animation once per visit", duration: "Until the tab closes" },
  { name: "_ga, _ga_*", type: "Cookie", category: "Analytics (optional)", purpose: "Google Analytics for Firebase — how the site is used", duration: "Up to 14 months" },
];

const sections: LegalSection[] = [
  {
    id: "what",
    title: "What cookies and browser storage are",
    body: (
      <p>
        Cookies are small text files a website stores in your browser. Websites can also use local storage, session storage and
        IndexedDB for similar purposes. We call all of these &quot;cookies&quot; in this policy.
      </p>
    ),
  },
  {
    id: "categories",
    title: "The categories we use",
    body: (
      <ul className="list-disc space-y-2 pl-5 marker:text-fg-subtle">
        <li><strong>Essential</strong> — needed for the site to work and be secure (sign-in, remembering your cookie choice). Always on.</li>
        <li><strong>Preference</strong> — remember choices such as the theme. They do not track you.</li>
        <li><strong>Analytics</strong> — help us understand how the site is used. <strong>Off unless you accept them.</strong></li>
        <li>We do <strong>not</strong> use advertising or cross-site tracking cookies.</li>
      </ul>
    ),
  },
  {
    id: "list",
    title: "Exactly what we store",
    body: (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-fg">
              <th className="py-2 pr-3 font-semibold">Name</th>
              <th className="py-2 pr-3 font-semibold">Type</th>
              <th className="py-2 pr-3 font-semibold">Category</th>
              <th className="py-2 pr-3 font-semibold">Purpose</th>
              <th className="py-2 font-semibold">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] align-top">
            {STORAGE.map((row) => (
              <tr key={row.name}>
                <td className="py-2 pr-3 font-mono text-xs text-fg">{row.name}</td>
                <td className="py-2 pr-3">{row.type}</td>
                <td className="py-2 pr-3">{row.category}</td>
                <td className="py-2 pr-3">{row.purpose}</td>
                <td className="py-2">{row.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: "vercel",
    title: "Performance measurement",
    body: (
      <p>
        Our host, Vercel, measures page speed and anonymous visit counts without cookies and without identifying you. Razorpay may set
        its own cookies on its checkout pages to process payments securely; those are covered by Razorpay&apos;s policies.
      </p>
    ),
  },
  {
    id: "choices",
    title: "Your choices",
    body: (
      <>
        <p>
          When you first visit, you can accept all cookies, keep essential cookies only, or choose categories. You can change your
          choice at any time: <CookieSettingsButton className="font-semibold text-intel underline-offset-2 hover:underline" />.
        </p>
        <p>
          You can also block or delete cookies in your browser settings. Blocking essential cookies may stop sign-in and some features
          from working.
        </p>
      </>
    ),
  },
  {
    id: "more",
    title: "More information",
    body: (
      <p>
        How we use personal data is explained in our <Link href="/legal/privacy">Privacy Policy</Link>. Questions:{" "}
        <MailLink email={COMPANY_IDENTITY.supportEmail} subject="Cookies" />.
      </p>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalDocument
      eyebrow="Privacy"
      title="Cookie Policy"
      intro={<>We keep cookies to a minimum: what is needed to run the site, and analytics only if you say yes.</>}
      sections={sections}
      showGrievance={false}
    />
  );
}
