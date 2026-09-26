import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "How VANIKARA approaches engineering: modular systems, replaceable providers, security in the data layer, and software built to be understood.",
};

const PRINCIPLES = [
  {
    title: "Modular before distributed",
    desc: "We start with well-separated modules inside a simple deployment, and split services apart only when real usage calls for it.",
  },
  {
    title: "Replaceable providers",
    desc: "Payments, maps and messaging sit behind our own interfaces, so a vendor can be changed without rewriting the product.",
  },
  {
    title: "Security in the data layer",
    desc: "Access rules belong next to the data, not only in the interface. We treat authorisation as part of the schema.",
  },
  {
    title: "Measured, then optimised",
    desc: "Performance work follows evidence. We add monitoring early so decisions are based on how the software actually behaves.",
  },
  {
    title: "Built to be understood",
    desc: "Clear boundaries and plain naming, so the next engineer can change the system with confidence.",
  },
  {
    title: "Room for CYGMA",
    desc: "We record the context our products produce with care, so a future internal intelligence layer has something meaningful to learn from.",
  },
];

const STACK = ["TypeScript", "React", "Next.js", "PostgreSQL", "Supabase", "Vercel"];

export default function TechnologyPage() {
  return (
    <>
      <section className="container-page pb-12 pt-16 sm:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="Technology"
          tone="cool"
          title="How we intend to build."
          lead="VANIKARA is early, and so is its engineering. These are the principles we are designing around — what we aim for, stated plainly."
        />
      </section>

      <section aria-labelledby="principles-heading" className="container-page py-12 sm:py-20">
        <h2 id="principles-heading" className="sr-only">
          Engineering principles
        </h2>
        <ol className="grid border-t border-line md:grid-cols-2">
          {PRINCIPLES.map((principle, i) => (
            <li
              key={principle.title}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${(i % 2) * 100}ms` }}
              className={`group border-b border-line py-9 md:py-11 ${i % 2 === 0 ? "md:border-r md:pr-12" : "md:pl-12"}`}
            >
              <span className="text-sm font-semibold tabular-nums text-fg-subtle transition-colors duration-300 group-hover:text-intel">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-title mt-4 text-fg">{principle.title}</h3>
              <p className="mt-3 max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">{principle.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="stack-heading" className="container-page py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end" data-reveal>
          <div className="lg:col-span-6">
            <Eyebrow>Current stack</Eyebrow>
            <h2 id="stack-heading" className="text-headline mt-5 text-fg">
              Proven tools, chosen for pace and clarity.
            </h2>
          </div>
          <ul className="flex flex-wrap gap-2.5 lg:col-span-6 lg:justify-end">
            {STACK.map((item) => (
              <li key={item} className="rounded-full border border-line-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-fg">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-10 sm:flex-row" data-reveal>
          <Button href="/what-we-build" arrow>
            See what we are building
          </Button>
          <Button href="/careers" variant="secondary">
            Work with us
          </Button>
        </div>
      </section>
    </>
  );
}
