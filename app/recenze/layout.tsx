import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recenze a Reference Klientů',
  description: 'Přečtěte si recenze spokojených klientů fotografky Majdy Martinské. Hodnocení rodinného, svatebního a newborn focení. 100% doporučení od klientů.',
  alternates: {
    canonical: 'https://www.majdamartinska.com/recenze',
  },
  openGraph: {
    title: 'Recenze — Majda Martinská Fotografka',
    description: 'Co říkají klienti o spolupráci s Majdou. Přečtěte si skutečné recenze a reference.',
    url: 'https://www.majdamartinska.com/recenze',
  },
};

export default function RecenzeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
