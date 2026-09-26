import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { BrandSymbol } from "@/components/brand/BrandMark";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-20">
      <div className="rise-in max-w-md text-center">
        <BrandSymbol size={48} alt="" className="mx-auto opacity-90" />
        <p className="mt-8 text-sm font-semibold tabular-nums text-fg-subtle">404</p>
        <h1 className="text-headline mt-3 text-fg">This page doesn&apos;t exist.</h1>
        <p className="text-lead mt-4">It may have moved, or the link may be incorrect.</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" arrow>
            Back to home
          </Button>
          <Button href="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
