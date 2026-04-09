import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Tipy na Focení a Zákulisí',
  description: 'Blog fotografky Majdy Martinské — tipy na focení, příběhy ze zákulisí, inspirace pro rodinné a svatební fotky. Jak se připravit na focení.',
  alternates: {
    canonical: 'https://www.majdamartinska.com/blog',
  },
  openGraph: {
    title: 'Blog — Majda Martinská Fotografka',
    description: 'Tipy na focení, příběhy ze zákulisí a inspirace pro vaše fotografie.',
    url: 'https://www.majdamartinska.com/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
