import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import ApplicationForm from "@/sections/careers/ApplicationForm";
import ServiceGate from "@/components/availability/ServiceGate";
import { getSiteContent } from "@/lib/content";
import { supabaseService } from "@/utils/supabase/service";

interface JobDetail {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  work_arrangement: string;
  description: string;
  responsibilities: string[];
  required_qualifications: string[];
  preferred_qualifications: string[];
  application_deadline: string | null;
  created_at: string;
}

async function getJobBySlug(slug: string): Promise<JobDetail | null> {
  try {
    const { data, error } = await supabaseService
      .from("job_positions")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error || !data) return null;
    return data as JobDetail;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Position Not Found" };
  return {
    title: `${job.title} — Careers`,
    description: `${job.title} (${job.employment_type}, ${job.location}) at VANIKARA Intelligence Private Limited.`,
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [job, { identity }] = await Promise.all([getJobBySlug(slug), getSiteContent()]);
  if (!job) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.created_at,
    validThrough: job.application_deadline ?? undefined,
    employmentType: job.employment_type,
    hiringOrganization: {
      "@type": "Organization",
      name: identity.legalName,
      sameAs: identity.siteUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressRegion: "Andhra Pradesh",
        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="border-b border-line bg-surface">
        <div className="container-page py-12 sm:py-20">
          <Link href="/careers" className="inline-flex items-center gap-1.5 text-sm font-medium text-intel hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to all positions
          </Link>

          <div className="mt-6 max-w-3xl">
            <span className="font-mono text-xs font-medium uppercase text-intel">{job.department}</span>
            <h1 className="text-page-title mt-2 text-fg">{job.title}</h1>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-fg-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-fg-subtle" />
                {job.location} · {job.work_arrangement}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-fg-subtle" />
                {job.employment_type}
              </span>
              {job.application_deadline && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-fg-subtle" />
                  Apply by {new Date(job.application_deadline).toLocaleDateString("en-IN")}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface-secondary">
        <div className="container-page py-14 sm:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-6">
              <div>
                <h2 className="text-title text-fg">Role Overview</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{job.description}</p>
              </div>
              {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
                <div>
                  <h2 className="text-title text-fg">Responsibilities</h2>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-fg-muted">
                    {job.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(job.required_qualifications) && job.required_qualifications.length > 0 && (
                <div>
                  <h2 className="text-title text-fg">Required Qualifications</h2>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-fg-muted">
                    {job.required_qualifications.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-6">
              <h2 className="text-title mb-4 text-fg">Apply for this position</h2>
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
