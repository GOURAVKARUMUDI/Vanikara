import Image from "next/image";
import Button from "@/components/ui/Button";

export default async function CygmaSection() {

  return (
    <section
      aria-labelledby="cygma-ai-heading"
      className="relative overflow-hidden border-b border-[#1A2942] bg-[#080F20] text-[#F5F7FA]"
    >
      <div className="container-page py-24 sm:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12" data-reveal>
          {/* Text Left */}
          <div className="relative z-10 lg:col-span-5">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#78A9FF]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-sm bg-[#78A9FF]" />
              CYGMA_AI
            </span>
            <p className="mt-3 font-mono text-xs text-[#8D9DB3]">
              Powered by Vanikara Intelligence
            </p>

            <h2 id="cygma-ai-heading" className="text-headline mt-5 text-white">
              Intelligence, engineered for purpose.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#B8C4D4]">
              A proprietary intelligence platform for specialised enterprise applications.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/cygma-ai" variant="inverse" size="lg" arrow>
                Discover CYGMA_AI
              </Button>
            </div>
          </div>

          {/* Cinematic 3D Computational Core Visual */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[8px] bg-[#080F20]">
              <Image
                src="/images/cygma-ai/cygma-intelligence-core.webp"
                alt="Precision-engineered dark titanium computational core with controlled blue internal channels representing CYGMA_AI"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
              {/* Seamless midnight navy edge blend */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 58%, #080F20 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
