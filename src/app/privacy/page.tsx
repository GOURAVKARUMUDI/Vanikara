import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import PageHero from '@/components/ui/PageHero';

export const metadata: Metadata = { 
  title: 'Privacy Policy',
  description: 'Learn how VANIKARA INTELLIGENCE PRIVATE LIMITED protects and manages your personal data and privacy.'
};

/**
 * PrivacyPage: Legal documentation regarding data collection and usage.
 */
export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, fill out a form, contact us, or use our services. This may include your name, email address, company name, phone number, and any other information you choose to provide.

We also automatically collect certain information when you use our services, including log data (IP address, browser type, pages visited, time and date), device information, and cookies and similar tracking technologies.`,
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the information we collect to provide, maintain, and improve our services; process transactions; send technical notices and support messages; respond to your comments and questions; and send you marketing communications (where permitted by law).

We may also use your information to monitor and analyse trends and usage, detect and prevent fraudulent transactions and other illegal activities, and comply with legal obligations.`,
    },
    {
      title: '3. Information Sharing',
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, as long as those parties agree to keep this information confidential.

We may also disclose your information when we believe disclosure is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.`,
    },
    {
      title: '4. Data Security',
      content: `We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
      title: '5. Cookies',
      content: `We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some portions of our service may not function properly.`,
    },
    {
      title: '6. Your Rights',
      content: `Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete the personal information we hold about you; the right to object to or restrict certain processing; and the right to data portability.

To exercise these rights, please contact us at vanikara26@gmail.com.`,
    },
    {
      title: '7. Changes to This Policy',
      content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.`,
    },
    {
      title: '8. CYGMA AI Workspace & Model Processing',
      content: `CYGMA AI is a proprietary software workspace developed by VANIKARA Intelligence Private Limited. It does not train, host, or own the connected third-party base models (such as those provided by OpenAI). 

Conversations initiated by authenticated users are stored securely on our database nodes to provide persistent chat histories and custom workspace settings. Guest user conversations are processed in transient memory sessions and are not stored.

If you upload documents (PDF, DOCX, PPTX, TXT, CSV), the workspace extracts the text, segments it, and constructs temporary retrieval indices (RAG) to ground answers. Extracted document details are stored on your private portal profile.

Users can request immediate, permanent deletion of their chat records and uploaded document data at any time from their Settings panel. All session conversation data is kept for a standard retention duration of 30 days unless deleted sooner by the user.`,
    },
    {
      title: '9. Contact Us',
      content: `For questions, clarifications, or requests regarding this Privacy Policy, please reach out to us at vanikara26@gmail.com.`,
    },
  ];

  return (
    <div className="pb-24 bg-transparent">
      <PageHero
        tag="Legal Policy"
        title={<>Privacy <span className="gradient-text">Policy</span></>}
        subtitle="Last updated: March 2025"
      />

      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-12">
        <div className="p-6 rounded-2xl text-xs sm:text-sm bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--accent-color)] font-semibold backdrop-blur-md shadow-sm">
          ℹ️ This policy explains how VANIKARA INTELLIGENCE PRIVATE LIMITED collects, uses, and protects your personal information. By using our services, you agree to this policy.
        </div>

        <div className="space-y-10">
          {sections.map(({ title, content }) => (
            <div key={title} className="scroll-mt-28 space-y-3">
              <h2 className="font-display font-black text-lg text-[var(--text-primary)] uppercase tracking-wide">
                {title}
              </h2>
              <div className="border-l-2 border-[var(--accent-color)] pl-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-4 font-medium">
                {content.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[var(--glass-border)] flex flex-wrap gap-3">
          <Button href="/contact" variant="primary">Contact Us</Button>
          <Button href="/terms" variant="secondary">Terms of Service</Button>
        </div>
      </div>
    </div>
  );
}
