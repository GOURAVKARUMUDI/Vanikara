import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { PageContainer } from '@/components/ui/Containers';

export const metadata: Metadata = {
  title: 'Products - Coming Soon',
  description: 'VANIKARA INTELLIGENCE - Products coming soon. Join our waitlist to be notified when new products launch.'
};

export default function ProductsPage() {
  return (
    <PageContainer>
      <div className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-4">
              Products Coming Soon
            </h1>
            <p className="text-xl text-[var(--text-secondary)] mb-8">
              We're building innovative digital platforms designed for real impact. Stay tuned for exciting announcements.
            </p>
          </div>

          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg p-8 backdrop-blur-sm">
            <p className="text-[var(--text-secondary)] mb-6">
              Be among the first to know when our new products launch.
            </p>

            <a
              href="mailto:contact@vanikara.com?subject=Product%20Launch%20Notification"
              className="inline-flex items-center gap-3 bg-[var(--accent-color)] hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Mail className="w-5 h-5" />
              Get Notified
            </a>

            <p className="text-sm text-[var(--text-tertiary)] mt-6">
              Contact: <a href="mailto:contact@vanikara.com" className="text-[var(--accent-color)] hover:underline">contact@vanikara.com</a>
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--glass-border)]">
              <div className="text-2xl mb-2">🍽️</div>
              <h3 className="font-bold text-[var(--text-primary)] mb-2">Food Delivery</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Revolutionary food delivery solutions for restaurants and customers.
              </p>
            </div>

            <div className="p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--glass-border)]">
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="font-bold text-[var(--text-primary)] mb-2">Insurance</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Smart insurance solutions designed for modern needs.
              </p>
            </div>

            <div className="p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--glass-border)]">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-bold text-[var(--text-primary)] mb-2">Data Services</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                High-quality data annotation and intelligence services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
