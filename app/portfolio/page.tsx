'use client';

import { PageHero } from '@/components/PageHero';
import { PortfolioFilter } from '@/components/PortfolioFilter';
import { portfolioImages } from './data';

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        title="Portfolio"
        subtitle="Výběr z mé práce"
        sectionPrefix="portfolio.hero"
      />

      <section className="section" data-animate>
        <div className="container">
          <PortfolioFilter images={portfolioImages} />
        </div>
      </section>
    </>
  );
}
