'use client';

import { Mail } from 'lucide-react';
import { PageContainer } from '@/components/ui/Containers';

export default function ProjectsPage() {
  return (
    <PageContainer>
      <div className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-4">
              Projects Coming Soon
            </h1>
            <p className="text-xl text-[var(--text-secondary)] mb-8">
              We're actively developing groundbreaking projects. Detailed information and updates coming soon.
            </p>
          </div>

          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg p-8 backdrop-blur-sm">
            <p className="text-[var(--text-secondary)] mb-6">
              Subscribe to our updates and be the first to learn about our latest projects and initiatives.
            </p>

            <a
              href="mailto:contact@vanikara.com?subject=Project%20Updates"
              className="inline-flex items-center gap-3 bg-[var(--accent-color)] hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Mail className="w-5 h-5" />
              Subscribe for Updates
            </a>

            <p className="text-sm text-[var(--text-tertiary)] mt-6">
              Questions? Email: <a href="mailto:contact@vanikara.com" className="text-[var(--accent-color)] hover:underline">contact@vanikara.com</a>
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--glass-border)]">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="font-bold text-[var(--text-primary)] mb-2">FoodDine Pro</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Subscription-based food delivery platform with zero commissions.
              </p>
            </div>

            <div className="p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--glass-border)]">
              <div className="text-2xl mb-2">🎓</div>
              <h3 className="font-bold text-[var(--text-primary)] mb-2">EduShield</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Student insurance platform for comprehensive coverage and support.
              </p>
            </div>

            <div className="p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--glass-border)]">
              <div className="text-2xl mb-2">🏷️</div>
              <h3 className="font-bold text-[var(--text-primary)] mb-2">DataLabel Hub</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Professional data annotation and intelligence platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
