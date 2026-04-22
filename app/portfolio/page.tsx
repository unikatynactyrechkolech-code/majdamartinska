'use client';

import { PageHero } from '@/components/PageHero';
import { PortfolioFilter } from '@/components/PortfolioFilter';
import { portfolioImages } from './data';

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        title="Portfolio"
        subtitle="Ukázky rodinného, svatebního a newborn focení"
        sectionPrefix="portfolio.hero"
      />

      <h2 className="seo-heading">Portfolio fotografky Majdy Martinské — rodinné, svatební, newborn, portrétní a těhotenské focení v Praze</h2>

      <section className="section" data-animate>
        <div className="container">
          <PortfolioFilter images={portfolioImages} page="portfolio" />
        </div>
      </section>
    </>
  );
}
