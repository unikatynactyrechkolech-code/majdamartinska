import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'O Mně — Fotografka Majda Martinská',
  description: 'Seznamte se s fotografkou Majdou Martinskou. Focení s humorem, přirozeností a bez křeče. Vlastní ateliér v Praze Suchdole. Rodinné, svatební a newborn fotografie.',
  alternates: {
    canonical: 'https://www.majdamartinska.com/o-mne',
  },
  openGraph: {
    title: 'O Mně — Majda Martinská Fotografka',
    description: 'Focení s humorem a přirozeností. Vlastní ateliér v Praze Suchdole.',
    url: 'https://www.majdamartinska.com/o-mne',
  },
};

export default function OMneLayout({ children }: { children: React.ReactNode }) {
  return children;
}
