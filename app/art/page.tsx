'use client';

import { PageHero } from '@/components/PageHero';
import { PortfolioFilter, type PortfolioFilterDef } from '@/components/PortfolioFilter';

// ============================================================
// /art — galerie umělecké fotografie
// Stejný systém jako /portfolio: filter podle kategorie,
// admin může přidávat fotky do každé subsekce.
// Subkategorie jsou specifické pro art:
//   Paralela | Samoty | Krajina | Minimalismus | stará skla | ostatní
// ============================================================

const artFilters: PortfolioFilterDef[] = [
  { key: 'all',           sectionId: 'art.filter.all',           label: 'Vše' },
  { key: 'paralela',      sectionId: 'art.filter.paralela',      label: 'Paralela' },
  { key: 'samoty',        sectionId: 'art.filter.samoty',        label: 'Samoty' },
  { key: 'krajina',       sectionId: 'art.filter.krajina',       label: 'Krajina' },
  { key: 'minimalismus',  sectionId: 'art.filter.minimalismus',  label: 'Minimalismus' },
  { key: 'stara-skla',    sectionId: 'art.filter.stara-skla',    label: 'Stará skla' },
  { key: 'ostatni',       sectionId: 'art.filter.ostatni',       label: 'Ostatní' },
];

// Zatím prázdné — fotky se přidávají přes admin (vytvoří se v DB pod sectionId art.gallery.<key>.new.<ts>)
const artImages: { src: string; alt: string; category: string }[] = [];

export default function ArtPage() {
  return (
    <>
      <PageHero
        title="Art"
        subtitle="Umělecké a experimentální fotografie"
        sectionPrefix="art.hero"
      />

      <h2 className="seo-heading">Umělecká a fine-art fotografie Praha — Paralela, Samoty, Krajina, Minimalismus, stará skla a další tematické série od Majdy Martinské</h2>

      <section className="section" data-animate>
        <div className="container">
          <PortfolioFilter
            images={artImages}
            filters={artFilters}
            sectionPrefix="art.gallery"
            defaultCategory="paralela"
            page="art"
            showTitles
          />
        </div>
      </section>
    </>
  );
}
