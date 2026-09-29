import Image from "next/image";
import Button from "@/components/ui/Button";
import RevealText from "@/components/motion/RevealText";
import { COMPANY_IDENTITY } from "@/data/company";
import { SYMBOL_SRC } from "@/components/brand/BrandMark";

export default function ClosingSection() {
  return (
    <section aria-labelledby="closing-title" className="relative section-atmosphere overflow-hidden py-20 sm:py-28" data-tone="deep">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center" data-reveal="quiet">
          <div aria-hidden="true" className="relative mx-auto grid h-36 w-36 place-items-center">
            <div className="stage-halo stage-halo--blur" />
            <div className="stage-halo" />
            <Image
              src={SYMBOL_SRC}
              alt=""
              width={96}
              height={78}
              sizes="72px"
              className="float-y relative h-auto w-[72px]"
            />
          </div>
          <h2 id="closing-title" className="text-headline mt-6 text-fg">
            <RevealText>This is the beginning.</RevealText>
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
