"use client";
import Image from "next/image";

import AboutScene from "@/components/about/AboutScene";
import PageHero from "@/components/ui/PageHero";
import MissionSection from "@/sections/about/MissionSection";
import SectionHeader from "@/components/ui/SectionHeader";
import { FadeUp } from "@/components/Animate";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Linkedin, ExternalLink } from "lucide-react";
import InnovationTimeline from "@/sections/home/InnovationTimeline";
import { PageContainer, SectionContainer, ContentContainer } from "@/components/ui/Containers";

const FOUNDERS = [
  {
    name: "Miryala Giri Charan",
    role: "Managing Director (MD) / Chief Executive Officer (CEO)",
    bio: "Specializes in brand positioning, public relations, and strategic communications to amplify VANIKARA's outreach across campus ecosystems.",
    vision: "To establish transparent, compelling brand narratives that connect students directly with essential digital tools.",
    responsibilities: "Brand strategy, media outreach, campaign design, user communications.",
    linkedin: "https://www.linkedin.com/in/giri-charan-miriyala-81a75336b/",
    color: "#1E6BD6"
  },
  {
    name: "Karumudi Gourav",
    role: "Executive Director / Chief Operating Officer (COO)",
    bio: "Leads overall business operations, strategic planning, and organizational efficiency. Oversees operational execution and ensures seamless coordination across all departments.",
    vision: "To build a scalable, operationally efficient organization that delivers excellence in execution and customer satisfaction.",
    responsibilities: "Business operations, strategic planning, department coordination, operational efficiency.",
    linkedin: "https://www.linkedin.com/in/gourav-karumudi-a998b1379/",
    color: "#FF7A00"
  },
  {
    name: "Chejarla Hari Charan Reddy",
    role: "Executive Director / Chief Technology Officer (CTO)",
    bio: "Drives technology strategy, system architecture, and innovation. Leads the technical vision and ensures platform reliability, scalability, and security.",
    vision: "To build resilient, high-performance technology frameworks engineered for enterprise-grade reliability and seamless user experience.",
    responsibilities: "Technology strategy, system architecture, platform security, innovation leadership.",
    linkedin: "https://www.linkedin.com/in/haricharan28/",
    color: "#8B5CF6"
  },
  {
    name: "Yarreddu Sri ChandraSekhar Reddy",
    role: "Chief Human Resources Officer (CHRO)",
    bio: "Leads human resources strategy, talent acquisition, and organizational culture development. Focuses on building high-performing teams and fostering employee growth.",
    vision: "To create a dynamic, inclusive workplace culture that attracts top talent and drives organizational success through people excellence.",
    responsibilities: "HR strategy, talent acquisition, employee development, organizational culture, compliance.",
    linkedin: "https://www.linkedin.com/in/sri-chandrasekar-reddy/",
    color: "#10B981"
  }
];

export default function AboutPage() {
  return (
    <PageContainer>
      <AboutScene />
      <PageHero
        tag="Our Story"
        title={
          <>
            About <span className="gradient-text">VANIKARA</span>
          </>
        }
        subtitle="VANIKARA Intelligence Private Limited is an Indian technology company incorporated on April 17, 2026, focused on creating innovative software, AI-powered platforms, and scalable digital solutions."
      />

      {/* Quote Banner */}
      <SectionContainer className="text-center">
        <ContentContainer className="max-w-4xl">
          <FadeUp>
            <p className="text-lg sm:text-2xl leading-relaxed text-[var(--text-primary)] font-medium italic">
              &quot;Our mission is to simplify student life by building practical digital tools that solve everyday challenges — from accessing resources to finding the right place to stay.&quot;
            </p>
          </FadeUp>
        </ContentContainer>
      </SectionContainer>

      {/* Our Story Block */}
      <SectionContainer id="story">
        <ContentContainer>
          <FadeUp>
            <SectionHeader tag="Our Journey" title="The Story of VANIKARA INTELLIGENCE" />
          </FadeUp>
          <div className="max-w-3xl mx-auto mt-10">
            <FadeUp delay={0.1}>
              <div className="space-y-6 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                <p>
                  VANIKARA began as a shared vision between founders determined to build something meaningful of their own. What started as a simple idea evolved into a journey shaped by learning, persistence, and continuous building.
                </p>
                <p>
                  Today, VANIKARA is growing into an established technology company focused on practical technology solutions and future digital experiences. Each leader contributes a unique strength to the company—from executive leadership and operations to technology and human resources—forming a balanced and execution-focused team.
                </p>
                <div className="border-l-4 border-[var(--accent-color)] pl-6 py-2 my-8 font-semibold text-[var(--text-primary)] bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-r-2xl">
                  We believe in building transparently in public. Every line of code and feature is vetted by actual user testing on local campuses.
                </div>
              </div>
            </FadeUp>
          </div>
        </ContentContainer>
      </SectionContainer>

      <MissionSection />

      {/* Leadership Section - WITHOUT PHOTOS */}
      <SectionContainer id="founders">
        <ContentContainer>
          <FadeUp>
            <SectionHeader tag="Leadership" title="Executive Leadership" />
          </FadeUp>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12">
            {FOUNDERS.map((founder, i) => (
              <FadeUp key={founder.name} delay={i * 0.1}>
                <Card hover className="h-full relative flex flex-col justify-between overflow-hidden">
                  <CardBody className="p-8 flex flex-col justify-between h-full space-y-6">
                    <div>
                      <h3 className="font-display font-black text-xl text-[var(--text-primary)] mb-1">
                        {founder.name}
                      </h3>
                      <span className="block text-[10px] font-black uppercase tracking-wider text-[var(--accent-color)] mb-4">
                        {founder.role}
                      </span>
                      
                      <div className="space-y-4 text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                        <p><strong>Biography:</strong> {founder.bio}</p>
                        <p><strong>Core Vision:</strong> &quot;{founder.vision}&quot;</p>
                        <p><strong>Responsibilities:</strong> {founder.responsibilities}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                      <a
                        href={founder.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent-color)] hover:underline"
                      >
                        <Linkedin className="w-4 h-4" />
                        Connect on LinkedIn
                      </a>
                    </div>
                  </CardBody>
                </Card>
              </FadeUp>
            ))}
          </div>
        </ContentContainer>
      </SectionContainer>

      {/* Innovation Timeline */}
      <InnovationTimeline />

      {/* Collaborations Section */}
      <SectionContainer id="collaborations">
        <ContentContainer>
          <FadeUp>
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">
                PARTNERSHIPS
              </span>
              <h2 className="font-display font-black text-3xl text-[var(--text-primary)]">
                Ecosystem Collaborations
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                VANIKARA is collaborating with <strong>Barg Technologies</strong> to support upcoming projects and expand technical and operational capabilities.
              </p>
              <div className="pt-4">
                <Button 
                  href="https://bargtechnologies.in/" 
                  variant="ghost" 
                  size="md" 
                  magnetic
                  className="inline-flex items-center gap-2"
                >
                  Visit Barg Technologies
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </FadeUp>
        </ContentContainer>
      </SectionContainer>
    </PageContainer>
  );
}
