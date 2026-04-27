import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.majdamartinska.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '',                  priority: 1.0, changeFrequency: 'weekly'  },
    { path: '/sluzby',           priority: 0.9, changeFrequency: 'monthly' },
    { path: '/portfolio',        priority: 0.9, changeFrequency: 'weekly'  },
    { path: '/o-mne',            priority: 0.8, changeFrequency: 'monthly' },
    { path: '/recenze',          priority: 0.8, changeFrequency: 'weekly'  },
    { path: '/kontakt',          priority: 0.9, changeFrequency: 'monthly' },
    { path: '/blog',             priority: 0.7, changeFrequency: 'weekly'  },
    { path: '/art',              priority: 0.6, changeFrequency: 'monthly' },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
