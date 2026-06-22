"use client";

import AboutScene from "@/components/about/AboutScene";
import PageHero from "@/components/ui/PageHero";
import MissionSection from "@/sections/about/MissionSection";
import TeamSection from "@/sections/about/TeamSection";
import SectionHeader from "@/components/ui/SectionHeader";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/Animate";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Linkedin, Mail, ExternalLink } from "lucide-react";
import InnovationTimeline from "@/sections/home/InnovationTimeline";
import { PageContainer, SectionContainer, ContentContainer } from "@/components/ui/Containers";

const FOUNDERS = [
  {
    name: "Mirayla Giri Charan",
    role: "Co-Founder & Product Director",
    imgUrl: "/images/mirayla_avatar.png",
    bio: "Passionate about user validation, project scoping, and scaling campus-scale applications.",
    vision: "To structure student logistics into zero-friction automated tools.",
    responsibilities: "Product roadmap, user validation, wireframing, feature design.",
    linkedin: "https://linkedin.com",
    color: "#1E6BD6"
  },
  {
    name: "Gourav Karumudi",
    role: "Co-Founder & Technical Lead",
    imgUrl: "/images/gourav_avatar.png",
    bio: "Full-stack engineer focusing on secure system schemas, database scaling, and modular React architectures.",
    vision: "To build bulletproof web frameworks that support high-density campus usage.",
    responsibilities: "Technical architecture, database optimization, security models.",
    linkedin: "https://linkedin.com",
    color: "#FF7A00"
  },
  {
    name: "Chejarala Hari Charan Reddy",
    role: "Co-Founder & Growth Lead",
    imgUrl: "/images/chejarala_avatar.png",
    bio: "Expertise in community outreach, local host connections, and public relations.",
    vision: "To onboard every local student hub into the VANIKARA ecosystem.",
    responsibilities: "Strategic partnerships, student rep onboarding, branding campaigns.",
    linkedin: "https://linkedin.com",
    color: "#8B5CF6"
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
              "Our mission is to simplify student life by building practical digital tools that solve everyday challenges — from accessing resources to finding the right place to stay."
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
                  VANIKARA began as a shared vision between three friends determined to build something meaningful of their own. What started as a simple idea evolved into a journey shaped by learning, persistence, and continuous building.
                </p>
                <p>
                  Today, VANIKARA is growing into an established technology company focused on practical technology solutions and future digital experiences. Each founder contributes a unique strength to the company—from vision and product thinking to development and growth—forming a balanced and execution-focused team.
                </p>
                <div className="border-l-4 border-[var(--accent-color)] pl-6 py-2 my-8 font-semibold text-[var(--text-primary)] bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-r-2xl">
                  We believe in building transparently in public. Every line of code,PG inspection, and print routing is vetted by actual user testing on local campuses.
                </div>
              </div>
            </FadeUp>
          </div>
        </ContentContainer>
      </SectionContainer>

      <MissionSection />

      {/* Founders Section */}
      <SectionContainer id="founders">
        <ContentContainer>
          <FadeUp>
            <SectionHeader tag="Leadership" title="The Founders" />
          </FadeUp>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {FOUNDERS.map((founder, i) => (
              <FadeUp key={founder.name} delay={i * 0.1}>
                <Card hover className="h-full relative flex flex-col justify-between overflow-hidden">
                  <CardBody className="p-8 flex flex-col justify-between h-full space-y-6">
                    <div>
                      {/* Professional Portrait Image */}
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 border border-[var(--glass-border)] shadow-md group">
                        <img 
                          src={founder.imgUrl} 
                          alt={`${founder.name} Profile`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <h3 className="font-display font-black text-xl text-[var(--text-primary)] mb-1">
                        {founder.name}
                      </h3>
                      <span className="block text-[10px] font-black uppercase tracking-wider text-[var(--accent-color)] mb-4">
                        {founder.role}
                      </span>
                      
                      <div className="space-y-4 text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                        <p><strong>Biography:</strong> {founder.bio}</p>
                        <p><strong>Core Vision:</strong> "{founder.vision}"</p>
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
                VANIKARA is collaborating with <strong>Barg Technologies</strong> to support upcoming projects and expand technical and operational capabilities. This strategic alignment helps accelerate pg verifications and print distribution networks.
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

      <TeamSection />
    </PageContainer>
  );
}
