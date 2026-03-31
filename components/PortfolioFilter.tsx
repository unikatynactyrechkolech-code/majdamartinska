'use client';

import { useState, useCallback, useMemo } from 'react';
import { EditableText } from '@/components/EditableText';

interface PortfolioImage {
  src: string;
  alt: string;
  category: string;
}

const IMAGES_PER_PAGE = 24;

const filters = [
  { key: 'all', sectionId: 'portfolio.filter.all', label: 'Vše' },
  { key: 'rodinna', sectionId: 'portfolio.filter.rodinna', label: 'Rodinné' },
  { key: 'newborn', sectionId: 'portfolio.filter.newborn', label: 'Newborn' },
  { key: 'tehotenske', sectionId: 'portfolio.filter.tehotenske', label: 'Těhotenské' },
  { key: 'portret', sectionId: 'portfolio.filter.portret', label: 'Portréty' },
  { key: 'svatby', sectionId: 'portfolio.filter.svatby', label: 'Svatby' },
  { key: 'psi', sectionId: 'portfolio.filter.psi', label: 'Pejsci' },
];

export function PortfolioFilter({ images }: { images: PortfolioImage[] }) {
  const [active, setActive] = useState('all');
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const handleFilter = useCallback((key: string) => {
    setActive(key);
    setVisibleCount(IMAGES_PER_PAGE);
  }, []);

  const filtered = useMemo(
    () => (active === 'all' ? images : images.filter(img => img.category === active)),
    [active, images]
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = () => setVisibleCount(prev => prev + IMAGES_PER_PAGE);

  const openLightbox = (idx: number) => {
    setLightbox(idx);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox(null);
    document.body.style.overflow = '';
  };

  const prevImage = () => {
    if (lightbox !== null && lightbox > 0) setLightbox(lightbox - 1);
    else if (lightbox === 0) setLightbox(filtered.length - 1);
  };

  const nextImage = () => {
    if (lightbox !== null && lightbox < filtered.length - 1) setLightbox(lightbox + 1);
    else if (lightbox === filtered.length - 1) setLightbox(0);
  };

  return (
    <>
      <div className="portfolio-filter">
        {filters.map(f => (
          <button
            key={f.key}
            className={active === f.key ? 'active' : ''}
            onClick={() => handleFilter(f.key)}
          >
            <EditableText sectionId={f.sectionId} defaultValue={f.label} as="span" />
            {active !== f.key && (
              <span className="portfolio-filter-count">
                {f.key === 'all' ? images.length : images.filter(i => i.category === f.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="portfolio-masonry">
        {visible.map((img, i) => (
          <div
            className="portfolio-item"
            key={`${img.category}-${i}`}
            onClick={() => openLightbox(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="portfolio-load-more">
          <button className="btn btn-outline" onClick={loadMore}>
            <EditableText sectionId="portfolio.loadmore" defaultValue="Načíst další fotky" as="span" />
            <span className="portfolio-remaining"> ({filtered.length - visibleCount})</span>
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div className="portfolio-lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Zavřít">&times;</button>
          <button
            className="lightbox-prev"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Předchozí"
          >&#8249;</button>
          <div className="lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
            />
          </div>
          <button
            className="lightbox-next"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Další"
          >&#8250;</button>
          <div className="lightbox-counter">
            {lightbox + 1} / {filtered.length}
          </div>
        </div>
      )}
    </>
  );
}
