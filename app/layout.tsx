import type { Metadata } from 'next';
import './style.css';
import './loading.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PageTransition } from '@/components/PageTransition';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ScrollAnimations } from '@/components/ScrollAnimations';
import { AdminProvider } from '@/contexts/AdminContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AdminToolbar } from '@/components/AdminToolbar';
import { CookieConsent } from '@/components/CookieConsent';
import { LightboxProvider } from '@/components/ImageLightbox';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Majda Martinská — Fotografka',
  description: 'Rodinné, svatební a newborn focení v Praze. Profesionální fotografka Majda Martinská.',
  icons: {
    icon: '/favicon.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AdminProvider>
          <LanguageProvider>
          <LightboxProvider>
          <LoadingScreen />
          <PageTransition />
          <AdminToolbar />
          <Navigation />
          <main>{children}</main>
          <Footer />
          <ScrollAnimations />
          <CookieConsent />
          </LightboxProvider>
          </LanguageProvider>
        </AdminProvider>
        <Analytics />
      </body>
    </html>
  );
}
