'use client';

import { PageHero } from '@/components/PageHero';
import { PortfolioFilter } from '@/components/PortfolioFilter';

// Art gallery — zatím prázdné, fotky se přidávají přes admin
const artImages: { src: string; alt: string; category: string }[] = [];

export default function ArtPage() {
  return (
    <>
      <PageHero
        title="Art"
        subtitle="Umělecké a experimentální fotografie"
        sectionPrefix="art.hero"
      />

      <section className="section" data-animate>
        <div className="container">
          {artImages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Galerie se připravuje…</p>
              <p style={{ fontSize: '0.9rem' }}>Brzy zde přibudou umělecké fotografie.</p>
            </div>
          ) : (
            <PortfolioFilter images={artImages} />
          )}
        </div>
      </section>
    </>
  );
}
