import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import ContactForm from "@/sections/contact/ContactForm";
import { getSiteContent } from "@/lib/content";
import ContactInfo from "@/sections/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact VANIKARA for general enquiries, partnerships, product discussions or support.",
};

/** Links such as /contact?topic=restaurant preselect the matching enquiry type. */
const TOPIC_TO_CATEGORY: Record<string, string> = {
  restaurant: "Restaurant",
  partner: "Delivery partner",
  customer: "Customer",
  partnership: "Partnership",
  product: "Product",
  support: "Support",
  media: "Media",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  const initialCategory = topic ? TOPIC_TO_CATEGORY[topic.toLowerCase()] : undefined;
  const { identity } = await getSiteContent();
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
            <ContactForm identity={identity} initialCategory={initialCategory} />
          </div>
        </div>
      </section>
    </>
  );
}
