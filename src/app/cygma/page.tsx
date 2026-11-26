import type { Metadata } from "next";
import CygmaAiOverviewPage from "@/app/cygma-ai/page";

export const metadata: Metadata = {
  title: "CYGMA_AI | Intelligence Ecosystem",
  description:
    "CYGMA_AI is an intelligence ecosystem powered by Vanikara Intelligence, designed to support specialized AI applications, enterprise workflows, and internal operational intelligence.",
  alternates: { canonical: "/cygma-ai" },
};

/** Backward-compatible /cygma route rendering the CYGMA_AI ecosystem overview. */
export default CygmaAiOverviewPage;
