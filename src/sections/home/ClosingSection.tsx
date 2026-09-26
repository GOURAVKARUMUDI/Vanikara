import Image from "next/image";
import Button from "@/components/ui/Button";
import { COMPANY_IDENTITY } from "@/data/company";
import { SYMBOL_SRC } from "@/components/brand/BrandMark";

export default function ClosingSection() {
  return (
    <section aria-labelledby="closing-title" className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[min(900px,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side at 38% 50%, var(--glow-orange), transparent 100%), radial-gradient(closest-side at 62% 50%, var(--glow-blue), transparent 100%)",
        }}
      />
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <Image
            src={SYMBOL_SRC}
            alt=""
            aria-hidden="true"
            width={96}
            height={78}
            sizes="72px"
            className="mx-auto h-auto w-[72px]"
          />
          <h2 id="closing-title" className="text-headline mt-8 text-fg">
            This is the beginning.
          </h2>
          <p className="text-lead mx-auto mt-5 max-w-lg">
            VANIKARA is still early. The products are being built and the ambition is long-term. We would rather build
            carefully than appear finished too soon.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg" arrow>
              Contact VANIKARA
            </Button>
            <Button href={`mailto:${COMPANY_IDENTITY.officialEmail}`} variant="secondary" size="lg">
              {COMPANY_IDENTITY.officialEmail}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
