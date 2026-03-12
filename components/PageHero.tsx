import Image from 'next/image';

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
}

export function PageHero({ title, subtitle, image }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg">
        <Image
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
        {subtitle && <p className="section-label">{subtitle}</p>}
        <h1>{title}</h1>
      </div>
    </section>
  );
}
