"use client";

import { FadeUp } from "@/components/Animate";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Users, Code, Award } from "lucide-react";
import { SectionContainer, ContentContainer } from "@/components/ui/Containers";

export default function WhoWeAre() {
  return (
    <SectionContainer id="who-we-are">
      <ContentContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Glass Visual Representation */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[300px]">
            {/* Glowing atmosphere orb */}
            <div className="absolute w-[250px] h-[250px] bg-gradient-to-tr from-[#1E6BD6] to-[#FF7A00] opacity-20 filter blur-[80px] rounded-full pointer-events-none" />
            
            <FadeUp>
              <Card hover className="max-w-sm mx-auto group">
                <CardBody className="p-8 text-center flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-color)]/10 blur-[40px] rounded-full pointer-events-none -mr-12 -mt-12" />
                  <div className="text-4xl mb-4 animate-pulse">👥</div>
                  <h3 className="font-display font-black text-xl text-[var(--text-primary)] mb-2 uppercase tracking-wide">
                    Human Centered
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                    VANIKARA merges technology with intuitive, human-centered UI/UX experiences, solving campus logistics and resource challenges at scale.
                  </p>
                  <div className="mt-6 flex justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E6BD6]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400]" />
                  </div>
                </CardBody>
              </Card>
            </FadeUp>
          </div>

          {/* Right Column: Corporate Vision Text & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <FadeUp delay={0.15}>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">
                WHO WE ARE
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight mt-2 uppercase">
                A Team of Builders, Innovators, and Friends
              </h2>
              
              <div className="space-y-4 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                <p>
                  Founded on April 17, 2026, VANIKARA Intelligence Private Limited began with a simple idea: technology should make student life easier and more connected. We are a registered Indian Private Limited Company engineered for modern AI platforms and scalable digital products.
                </p>
                <p>
                  <strong>Our Mission:</strong> To construct the intelligence layers that power campus resource finders, student second-hand marketplaces, and custom printing services with high-fidelity WebGL workspaces.
                </p>
                <p>
                  <strong>Our Core Philosophy:</strong> Engineering beautiful technology that solves real-world problems. We ship early, iterate fast, and build transparently in public to maintain high visual standard velocity.
                </p>
              </div>

              <div className="pt-4">
                <Button href="/about" variant="primary" size="md" magnetic>
                  Explore Our Vision
                </Button>
              </div>
            </FadeUp>
          </div>

        </div>
      </ContentContainer>
    </SectionContainer>
  );
}
