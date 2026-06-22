"use client";

import { StaggerGrid, StaggerItem, FadeUp } from "@/components/Animate";
import Card, { CardBody } from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { Laptop, ShoppingBag, Palette, MapPin } from "lucide-react";
import { SectionContainer, ContentContainer } from "@/components/ui/Containers";

const FEATURES = [
  { icon: <Laptop className="w-6 h-6 text-blue-500" />, title: "Web Development", desc: "High-performance, student-focused web experiences built for modern learning environments." },
  { icon: <ShoppingBag className="w-6 h-6 text-orange-500" />, title: "Marketplace Platforms", desc: "Scalable multi-vendor platforms tailored for campus commerce and resource sharing." },
  { icon: <Palette className="w-6 h-6 text-pink-500" />, title: "UI/UX Design", desc: "Intuitive user interfaces crafted with a deep understanding of student behavior." },
  { icon: <MapPin className="w-6 h-6 text-green-500" />, title: "Local Discovery", desc: "Solutions that connect students with local hostels, services, and opportunities." },
];

export default function FeaturesSection() {
  return (
    <SectionContainer id="features">
      <ContentContainer>
        <FadeUp>
          <SectionHeader
            tag="What We Do"
            title="Full-Spectrum Technology Services"
            subtitle="From concept to production, we handle every layer of student platforms and enterprise software."
          />
        </FadeUp>
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
          {FEATURES.map(({ icon, title, desc }) => (
            <StaggerItem key={title}>
              <Card hover className="h-full">
                <CardBody className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-500/5 shrink-0">
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[1.0375rem] text-[var(--text-primary)] mb-2">
                      {title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{desc}</p>
                  </div>
                </CardBody>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </ContentContainer>
    </SectionContainer>
  );
}
