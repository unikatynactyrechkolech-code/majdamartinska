import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Služby a Ceník Focení',
  description: 'Nabídka služeb fotografky Majdy Martinské — rodinné focení od 3 900 Kč, newborn focení, svatební fotografie, portrétní focení i těhotenské focení. Ateliér Praha Suchdol.',
  alternates: {
    canonical: 'https://www.majdamartinska.com/sluzby',
  },
  openGraph: {
    title: 'Služby a Ceník — Majda Martinská Fotografka',
    description: 'Kompletní nabídka focení: rodinné, newborn, svatby, portréty, těhotenské, psi. Ateliér Praha Suchdol.',
    url: 'https://www.majdamartinska.com/sluzby',
  },
};

export default function SluzbyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
