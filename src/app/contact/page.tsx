import type { Metadata } from "next";
import { FadeUp } from "@/components/Animate";
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/sections/contact/ContactForm";
import ContactInfo from "@/sections/contact/ContactInfo";
import ContactScene from "@/components/contact/ContactScene";
import { PageContainer, SectionContainer, ContentContainer } from "@/components/ui/Containers";

export const metadata: Metadata = { 
  title: "Contact",
  description: "Reach out to VANIKARA INTELLIGENCE PRIVATE LIMITED for inquiries, support, or partnership opportunities."
};

export default function ContactPage() {
  return (
    <PageContainer className="pb-20">
      <ContactScene />
      <PageHero
        tag="Get in Touch"
        title={
          <>
            Let's <span className="gradient-text">Connect</span>
          </>
        }
        subtitle="Want to collaborate, support our journey, or explore what we're building? We'd love to hear from you."
      />
      
      <SectionContainer id="contact-body">
        <ContentContainer>
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 items-start">
            {/* Left Column: Office details, Map, WhatsApp */}
            <FadeUp>
              <ContactInfo />
            </FadeUp>
            
            {/* Right Column: Glass Contact Form */}
            <FadeUp delay={0.1}>
              <ContactForm />
            </FadeUp>
          </div>
        </ContentContainer>
      </SectionContainer>
    </PageContainer>
  );
}
