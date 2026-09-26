import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import ContactForm from "@/sections/contact/ContactForm";
import ContactInfo from "@/sections/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact VANIKARA for general enquiries, partnerships, product discussions or support.",
};

export default function ContactPage() {
  return (
    <>
      <section className="container-page pb-12 pt-16 sm:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="Contact"
          title="Let's talk."
          lead="For enquiries, partnerships, product discussions or support — write to us and a member of the team will reply."
        />
      </section>

      <section aria-label="Contact details and form" className="container-page pb-16 sm:pb-24">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <ContactInfo />
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
