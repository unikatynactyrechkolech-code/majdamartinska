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
        image="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/3f875228-71be-40bf-96d2-b419364599a1/1/1/_FFF5983.jpg?fjkss=exp=2088681035~hmac=2e9c039a5620e3d43d3fe64b3f7daef7015cc8ae1b4d717a0fea903df01196c7"
        sectionPrefix="portfolio.hero"
      />

      <section className="section section-brown" data-animate>
        <div className="container">
          <PortfolioFilter images={portfolioImages} />
        </div>
      </section>
    </>
  );
}
