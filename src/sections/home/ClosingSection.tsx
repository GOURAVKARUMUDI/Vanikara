import Button from "@/components/ui/Button";

export default function ClosingSection() {
  return (
    <section aria-labelledby="closing-cta-heading" className="bg-surface">
      <div className="container-page py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center" data-reveal>
          <h2 id="closing-cta-heading" className="text-headline text-fg">
            The future is built together.
          </h2>
          <p className="text-lead mx-auto mt-4 max-w-2xl">
            Whether you are a restaurant owner in Guntur, an engineer looking to build meaningful systems, or an organization exploring collaboration, we welcome your enquiry.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact" size="lg" arrow>
              Contact Vanikara
            </Button>
            <Button href="/careers" variant="outline" size="lg">
              Explore Careers
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
