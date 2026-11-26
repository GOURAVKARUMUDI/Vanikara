import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Eyebrow from "@/components/ui/Eyebrow";

const LINKS = [
  { label: "Explore Careers", desc: "Open roles, internships, and general applications", href: "/careers" },
  { label: "Business Partnerships", desc: "Strategic consumer & enterprise collaborations", href: "/contact?topic=partnership" },
  { label: "Restaurant Partnerships", desc: "Early interest for Guntur Food Services", href: "/food-delivery#register" },
  { label: "CYGMA-RI Enterprise Enquiries", desc: "B2B resume intelligence early access", href: "/cygma-ai/resume-intelligence#early-access" },
];

export default function ClosingSection() {
  return (
    <section aria-labelledby="closing-cta-heading" className="bg-surface">
      <div className="container-page py-24 sm:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[8px] border border-line bg-surface-secondary">
              <Image
                src="/images/careers/collaboration.webp"
                alt="Illustrative technology workplace collaboration representing careers and partnerships at Vanikara"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
            </div>
            <p className="mt-2 font-mono text-[11px] text-fg-subtle">
              Illustrative workplace photography.
            </p>
          </div>

          <div className="lg:col-span-6">
            <Eyebrow tone="cool">Careers &amp; Partnerships</Eyebrow>
            <h2 id="closing-cta-heading" className="text-headline mt-4 text-fg">
              The future is built together.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-fg-muted">
              Whether you are an engineer looking to build enduring systems, a restaurant preparing for transparent delivery economics, or an enterprise recruitment team exploring CYGMA-RI, we welcome the conversation.
            </p>

            <div className="mt-8 divide-y divide-line border-t border-b border-line">
              {LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-intel"
                >
                  <div>
                    <span className="block text-sm font-semibold text-fg group-hover:text-intel">
                      {item.label}
                    </span>
                    <span className="block text-xs text-fg-muted">{item.desc}</span>
                  </div>
                  <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4 shrink-0 text-intel" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
