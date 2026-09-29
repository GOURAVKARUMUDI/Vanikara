import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Eyebrow from "@/components/ui/Eyebrow";
import RevealText from "@/components/motion/RevealText";
import { COMPANY_IDENTITY, COMPANY_STORY } from "@/data/company";

const STATEMENT = "We build what\nwe believe\nshould exist.";

export default function StorySection() {
  return (
    <section aria-labelledby="story-title" className="relative section-atmosphere py-20 sm:py-24" data-tone="warm">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Eyebrow>The company</Eyebrow>
          <h2 id="story-title" className="text-headline mt-5 text-fg">
            <RevealText>{STATEMENT}</RevealText>
          </h2>
        </div>

        <div className="space-y-6 lg:col-span-5 lg:pt-14" data-reveal style={{ ["--reveal-delay" as string]: "240ms" }}>
          {COMPANY_STORY.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-[1.0625rem] leading-relaxed text-fg-muted">
              {paragraph}
            </p>
          ))}

          <dl className="grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
            <div>
              <dt className="text-fg-subtle">Founded</dt>
              <dd className="mt-1 font-semibold text-fg">{COMPANY_IDENTITY.foundingDate}</dd>
            </div>
            <div>
              <dt className="text-fg-subtle">Incorporated</dt>
              <dd className="mt-1 font-semibold text-fg">{COMPANY_IDENTITY.incorporationDate}</dd>
            </div>
          </dl>

          <Link href="/about" className="group inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-intel">
            <span className="link-underline">More about VANIKARA</span>
            <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
