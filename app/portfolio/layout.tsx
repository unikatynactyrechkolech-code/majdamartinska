import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio — Ukázky Mé Práce',
  description: 'Prohlédněte si portfolio fotografky Majdy Martinské — rodinné fotografie, svatební reportáže, newborn focení, portréty a těhotenské fotky. Přirozené snímky plné emocí.',
  alternates: {
    canonical: 'https://www.majdamartinska.com/portfolio',
  },
  openGraph: {
    title: 'Portfolio — Majda Martinská Fotografka',
    description: 'Ukázky rodinného, svatebního, newborn a portrétního focení. Přirozené fotografie plné emocí.',
    url: 'https://www.majdamartinska.com/portfolio',
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
