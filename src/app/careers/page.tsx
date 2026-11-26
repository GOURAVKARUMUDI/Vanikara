import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import ApplicationForm from "@/sections/careers/ApplicationForm";
import JobBoard, { type PublicJob } from "@/sections/careers/JobBoard";
import ServiceGate from "@/components/availability/ServiceGate";
import { getSiteContent } from "@/lib/content";
import { getAvailability } from "@/lib/availability";
import { supabaseService } from "@/utils/supabase/service";

export const metadata: Metadata = {
  title: "Careers",
  description: "Career opportunities at VANIKARA Intelligence Private Limited will be announced when recruitment officially opens.",
};

async function fetchPublishedJobs(): Promise<PublicJob[]> {
  try {
    const { data, error } = await supabaseService
      .from("job_positions")
      .select("id, slug, title, department, location, employment_type, work_arrangement, description, application_deadline")
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as PublicJob[];
  } catch {
    return [];
  }
}

/**
 * While recruitment is closed, the page shows only the Opening Soon notice:
 * no listings, no application controls, no recruitment forms. The job board
 * and application form are kept and appear once an administrator opens
 * recruitment in the Vanikara Console.
 */
export default async function CareersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const [{ identity }, availability, params] = await Promise.all([
    getSiteContent(),
    getAvailability(),
    searchParams,
  ]);
  const recruitmentOpen = availability.recruitment && availability.career_applications;
  const jobs = recruitmentOpen ? await fetchPublishedJobs() : [];

  if (!recruitmentOpen) {
    return (
      <section className="bg-white text-[#0F172A] dark:bg-surface">
        <div className="container-page py-24 sm:py-32">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-intel">Careers at Vanikara</p>
            <h1 className="text-display mt-5 text-fg">Opening Soon</h1>
            <p className="text-lead mt-6 text-fg-muted">
              We are building the foundation for our next chapter. Career opportunities will be announced when recruitment officially opens.
            </p>
            <p className="mt-8 font-mono text-xs font-medium uppercase tracking-wider text-fg-subtle">
              Status: Recruitment Not Yet Open
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-24">
          <SectionHeader
            as="h1"
            eyebrow="Careers at Vanikara"
            tone="cool"
            title="Build with us."
            lead="We are an early-stage technology product company. We value clarity, ownership, and engineers and operators who care deeply about real-world execution."
          >
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#open-positions" arrow>
                Open Positions
              </Button>
              <Link
                href="/account/applications"
                className="inline-flex h-11 items-center px-3 text-sm font-medium text-intel hover:underline"
              >
                Track an existing application →
              </Link>
            </div>
          </SectionHeader>
        </div>
      </section>

      <section id="open-positions" className="border-b border-line bg-surface-secondary">
        <div className="container-page py-16 sm:py-24">
          <div className="max-w-2xl">
            <Eyebrow tone="cool">Open Roles</Eyebrow>
            <h2 className="text-headline mt-3 text-fg">Published opportunities.</h2>
          </div>
          <div className="mt-8">
            <JobBoard jobs={jobs} initialType={params.type} />
          </div>
        </div>
      </section>

      <section id="apply" className="bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow tone="warm">Apply Directly</Eyebrow>
              <h2 className="text-headline mt-3 text-fg">Submit your application.</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                All applications are reviewed by humans. Upload your résumé (PDF or DOCX, max 4 MB) to receive a reference number for status tracking.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ServiceGate service={["career_applications", "recruitment"]}>
                <ApplicationForm contactEmail={identity.officialEmail} />
              </ServiceGate>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
