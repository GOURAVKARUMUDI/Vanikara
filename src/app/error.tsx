"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { BrandSymbol } from "@/components/brand/BrandMark";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled page error:", error);
  }, [error]);

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-20">
      <div className="rise-in max-w-md text-center">
        <BrandSymbol size={48} alt="" className="mx-auto opacity-90" />
        <h1 className="text-headline mt-8 text-fg">Something went wrong.</h1>
        <p className="text-lead mt-4">
          An unexpected error stopped this page from loading. Please try again.
          {error.digest && <span className="mt-2 block text-sm tabular-nums text-fg-subtle">Reference: {error.digest}</span>}
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => reset()}>Try again</Button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}
