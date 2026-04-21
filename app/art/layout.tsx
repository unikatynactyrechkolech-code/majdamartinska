import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Art — Majda Martinská Fotografka',
  description: 'Umělecké fotografie a art projekty od fotografky Majdy Martinské. Praha Suchdol.',
  alternates: {
    canonical: 'https://www.majdamartinska.com/art',
  },
  openGraph: {
    title: 'Art — Majda Martinská Fotografka',
    description: 'Umělecké fotografie od Majdy Martinské.',
    url: 'https://www.majdamartinska.com/art',
  },
};

export default function ArtLayout({ children }: { children: React.ReactNode }) {
  return children;
}
