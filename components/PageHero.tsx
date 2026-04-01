'use client';

import { EditableText } from '@/components/EditableText';

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  /** @deprecated Image is no longer used — brown background instead */
  image?: string;
  /** sectionId prefix, e.g. "portfolio.hero" → will create "portfolio.hero.title" and "portfolio.hero.subtitle" */
  sectionPrefix?: string;
}

export function PageHero({ title, subtitle, sectionPrefix }: PageHeroProps) {
  return (
    <section className="page-hero">
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
