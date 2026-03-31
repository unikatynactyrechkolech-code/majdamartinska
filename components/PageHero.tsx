'use client';

import { EditableImage } from '@/components/EditableImage';
import { EditableText } from '@/components/EditableText';

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  /** sectionId prefix, e.g. "portfolio.hero" → will create "portfolio.hero.title" and "portfolio.hero.subtitle" */
  sectionPrefix?: string;
}

export function PageHero({ title, subtitle, image, sectionPrefix }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg">
        <EditableImage
          sectionId={sectionPrefix ? `${sectionPrefix}.img` : 'page.hero.img'}
          src={image}
          alt={title}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
        />
      </div>
      <div className="hero-overlay" />
      <div className="page-hero-content">
        {subtitle && (
          sectionPrefix
            ? <EditableText sectionId={`${sectionPrefix}.subtitle`} defaultValue={subtitle} as="p" className="section-label" />
            : <p className="section-label">{subtitle}</p>
        )}
        {sectionPrefix
          ? <EditableText sectionId={`${sectionPrefix}.title`} defaultValue={title} as="h1" />
          : <h1>{title}</h1>
        }
      </div>
    </section>
  );
}
