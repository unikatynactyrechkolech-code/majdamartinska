import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vyzvedni fotky — Majda Martinská Fotografka',
  description: 'Vyzvedněte si své hotové fotografie od Majdy Martinské. Jednoduché stažení přes sdílený odkaz.',
  alternates: {
    canonical: 'https://www.majdamartinska.com/vyzvedni-fotky',
  },
};

export default function VyzvedniLayout({ children }: { children: React.ReactNode }) {
  return children;
}
