import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import ApplicationForm from "@/sections/careers/ApplicationForm";
import JobBoard, { type PublicJob } from "@/sections/careers/JobBoard";
import { getSiteContent } from "@/lib/content";
import { supabaseService } from "@/utils/supabase/service";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore open engineering, product, and internship opportunities at VANIKARA Intelligence Private Limited in Guntur, Andhra Pradesh.",
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

export default async function CareersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const [{ identity }, jobs, params] = await Promise.all([
    getSiteContent(),
    fetchPublishedJobs(),
    searchParams,
  ]);

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
              <Button href="#apply" variant="outline">
                General Application
              </Button>
              <Link
                href="/account/applications"
                className="inline-flex h-11 items-center px-3 text-sm font-medium text-intel hover:underline"
              >
                Track an existing application →
              </Link>
            </div>
          </SectionHeader>
          <div className="relative mt-12 aspect-[21/9] w-full overflow-hidden rounded-[8px] border border-line bg-surface-secondary">
            <Image
              src="/images/careers/collaboration.webp"
              alt="Illustrative technology workplace collaboration"
              fill
              priority
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Open Positions */}
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

      {/* General Application Form */}
      <section id="apply" className="bg-surface">
        <div className="container-page py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow tone="warm">Apply Directly</Eyebrow>
              <h2 className="text-headline mt-3 text-fg">Submit your application.</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                All applications are reviewed by humans. Upload your résumé (PDF or DOCX, max 4 MB) and you will receive an immediate reference number for status tracking.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ApplicationForm contactEmail={identity.officialEmail} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
