'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface PortfolioImage {
  src: string;
  alt: string;
  category: string;
  id?: string;
}

const filters = [
  { key: 'all', label: 'Vše' },
  { key: 'rodinna', label: 'Rodinné' },
  { key: 'newborn', label: 'Newborn' },
  { key: 'tehotenske', label: 'Těhotenské' },
  { key: 'portret', label: 'Portréty' },
  { key: 'svatby', label: 'Svatby' },
  { key: 'psi', label: 'Pejsci' },
];

export function PortfolioFilter({ images }: { images: PortfolioImage[] }) {
  const [active, setActive] = useState('all');

  const handleFilter = useCallback((key: string) => {
    setActive(key);
  }, []);

  const filtered = active === 'all' ? images : images.filter(img => img.category === active);

  return (
    <>
      <div className="portfolio-filter">
        {filters.map(f => (
          <button
            key={f.key}
            className={active === f.key ? 'active' : ''}
            onClick={() => handleFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="portfolio-masonry">
        {filtered.map((img, i) => (
          <div className="portfolio-item" key={`${img.category}-${i}`} id={img.id}>
            <Image
              src={img.src}
              alt={img.alt}
              width={600}
              height={400}
              loading="lazy"
              quality={75}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
