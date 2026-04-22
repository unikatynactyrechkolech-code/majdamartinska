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

const SITE_URL = 'https://www.majdamartinska.com';
const OG_IMAGE = 'https://res.cloudinary.com/dh8ts5fpa/image/upload/v1774978116/Sni%CC%81mek_obrazovky_2026-03-31_v_19.27.39_tonhmp.png';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Majda Martinská — Fotografka Praha | Rodinné, Svatební a Newborn Focení',
    template: '%s | Majda Martinská — Fotografka Praha',
  },
  description: 'Profesionální fotografka Majda Martinská — rodinné, svatební, newborn a portrétní focení v Praze. Vlastní ateliér Praha Suchdol. Přirozené fotografie plné emocí.',
  keywords: ['fotografka Praha', 'rodinné focení', 'svatební fotograf', 'newborn focení Praha', 'portrétní fotografie', 'těhotenské focení', 'fotograf Praha Suchdol', 'ateliérové focení', 'focení dětí', 'Majda Martinská'],
  authors: [{ name: 'Majda Martinská' }],
  creator: 'webpojede.cz',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: SITE_URL,
    siteName: 'Majda Martinská — Fotografka',
    title: 'Majda Martinská — Fotografka Praha | Rodinné, Svatební a Newborn Focení',
    description: 'Profesionální fotografka Majda Martinská — rodinné, svatební, newborn a portrétní focení v Praze. Vlastní ateliér Praha Suchdol.',
    images: [
      {
        url: OG_IMAGE,
        width: 422,
        height: 420,
        alt: 'Majda Martinská — Fotografka',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Majda Martinská — Fotografka Praha',
    description: 'Rodinné, svatební, newborn a portrétní focení v Praze. Vlastní ateliér Praha Suchdol.',
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// JSON-LD Structured Data — ProfessionalService
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Majda Martinská — Fotografka',
  alternateName: 'Majda Martinská Photography',
  url: SITE_URL,
  logo: OG_IMAGE,
  image: OG_IMAGE,
  description: 'Profesionální fotografka Majda Martinská — rodinné, svatební, newborn a portrétní focení v Praze. Vlastní ateliér Praha Suchdol.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Praha',
    addressRegion: 'Hlavní město Praha',
    addressCountry: 'CZ',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 50.1333,
    longitude: 14.3833,
  },
  areaServed: {
    '@type': 'City',
    name: 'Praha',
  },
  serviceType: ['Rodinné focení', 'Svatební focení', 'Newborn focení', 'Portrétní focení', 'Těhotenské focení', 'Focení psů'],
  priceRange: 'od 2 900 Kč',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '10',
    bestRating: '5',
  },
  sameAs: [
    'https://www.instagram.com/majdamartinska/',
    'https://www.facebook.com/majdamartinska',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,300&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,300&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Merriweather:wght@300;400;700&family=Oswald:wght@300;400;500;600&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,400&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Caveat:wght@400;500;600;700&family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;1,400&family=Open+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
