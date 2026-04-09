import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt — Objednejte Si Focení',
  description: 'Kontaktujte fotografku Majdu Martinskou — objednejte si rodinné, svatební nebo newborn focení. Ateliér Praha Suchdol. Rychlá odpověď, příjemné jednání.',
  alternates: {
    canonical: 'https://www.majdamartinska.com/kontakt',
  },
  openGraph: {
    title: 'Kontakt — Majda Martinská Fotografka',
    description: 'Napište mi a domluvíme se na focení. E-mail, telefon nebo kontaktní formulář.',
    url: 'https://www.majdamartinska.com/kontakt',
  },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}
