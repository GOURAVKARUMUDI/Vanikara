import type { Metadata } from 'next';
import './globals.css';
import MainLayout from '@/components/MainLayout';
import ClientLogger from '@/components/ClientLogger';
import { ThemeProvider } from '@/components/layout/ThemeContext';
import BackgroundSystem from '@/components/layout/BackgroundSystem';
import { CygmaWorldProvider } from '@/context/CygmaWorldContext';
import { ConsentProvider } from '@/context/ConsentContext';
import { PerformanceProvider } from '@/context/PerformanceContext';

export const metadata: Metadata = {
  title: {
    default: 'VANIKARA INTELLIGENCE — Innovative Technology Solutions',
    template: '%s | VANIKARA INTELLIGENCE',
  },
  description:
    'VANIKARA INTELLIGENCE PRIVATE LIMITED builds premium digital platforms — from student marketplaces to enterprise software. We craft technology that matters.',
  keywords: ['VANIKARA INTELLIGENCE', 'VANIKARA INTELLIGENCE PRIVATE LIMITED', 'technology', 'software development', 'platform engineering', 'web apps'],
  openGraph: {
    title: 'VANIKARA INTELLIGENCE — Innovative Technology Solutions',
    description: 'We build technology that matters.',
    url: 'https://vanikara.com',
    siteName: 'VANIKARA INTELLIGENCE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E6BD6" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <CygmaWorldProvider>
            <ConsentProvider>
              <PerformanceProvider>
                <BackgroundSystem />
                <ClientLogger />
                <MainLayout>
                  {children}
                </MainLayout>
              </PerformanceProvider>
            </ConsentProvider>
          </CygmaWorldProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


