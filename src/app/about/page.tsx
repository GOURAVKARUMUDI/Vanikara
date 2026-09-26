import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import PrinciplesSection from "@/sections/home/PrinciplesSection";
import TimelineSection from "@/sections/home/TimelineSection";
import FoundersSection from "@/sections/home/FoundersSection";
import { COMPANY_IDENTITY, COMPANY_STORY } from "@/data/company";

export const metadata: Metadata = {
  title: "About",
  description:
    "VANIKARA began as a conversation between students about real-world problems. Learn about the company, its principles and the people building it.",
};

const FACTS = [
  { label: "Legal name", value: COMPANY_IDENTITY.legalName },
  { label: "CIN", value: COMPANY_IDENTITY.cin },
  { label: "Founded", value: COMPANY_IDENTITY.foundingDate },
  { label: "Incorporated", value: COMPANY_IDENTITY.incorporationDate },
  { label: "Based in", value: COMPANY_IDENTITY.operationalLocation },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-page pb-16 pt-16 sm:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="About VANIKARA"
          title={COMPANY_STORY.heading}
          lead={COMPANY_STORY.paragraphs[0]}
        />
      </section>

      <section aria-labelledby="about-intent" className="container-page py-16 sm:py-24">
        <div className="grid gap-12 border-t border-line pt-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7" data-reveal>
            <Eyebrow tone="cool">Intent</Eyebrow>
            <p id="about-intent" className="text-headline mt-5 text-fg">
              An attempt to create — rather than simply follow conventional paths.
            </p>
          </div>
          <div className="space-y-10 lg:col-span-5 lg:pt-12" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
            <div>
              <h2 className="text-lg font-semibold text-fg">Why we exist</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-fg-muted">
                People work around inefficient systems every day. Businesses accept limits they have learned to live
                with. VANIKARA exists to notice those gaps and build practical alternatives.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-fg">The name</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-fg-muted">
                &ldquo;Vanikara&rdquo; draws on the idea of commerce and craft — the people who build and conduct
                enterprise. For us it means building with skill, operating with purpose, and creating something of our
                own.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PrinciplesSection />
      <TimelineSection />
      <FoundersSection />

      <section aria-labelledby="facts-title" className="container-page py-16 sm:py-24">
        <div className="surface rounded-panel p-7 sm:p-10 lg:p-12" data-reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 id="facts-title" className="text-title text-fg">
              Company information
            </h2>
            <Link
              href="/legal/legal-information"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-intel"
            >
              <span className="link-underline">Registration details</span>
              <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
            </Link>
          </div>
          <dl className="mt-8 grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-5">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[0.8125rem] text-fg-subtle">{fact.label}</dt>
                <dd className="mt-1.5 text-[0.9375rem] font-semibold tabular-nums text-fg [overflow-wrap:anywhere]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
