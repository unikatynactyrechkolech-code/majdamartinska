'use client';

import { useState, useEffect } from 'react';
import { PageHero } from '@/components/PageHero';
import { EditableText } from '@/components/EditableText';
import { BlogAdmin } from '@/components/BlogAdmin';
import { useAdmin } from '@/contexts/AdminContext';
import { useLang } from '@/contexts/LanguageContext';
import type { BlogPost } from '@/app/actions/blog';

/** Pro Cloudinary obrázky vložíme transformaci `f_auto,q_auto:best`,
 *  aby se cover fotky nedoručovaly v originální kvalitě (= zbytečně velké)
 *  ani v default eco komprimaci (= rozpixelované), ale v ostré kvalitě
 *  s nejlepším formátem (AVIF/WebP) podle prohlížeče. */
function coverUrl(src: string): string {
  if (!src) return src;
  if (src.includes('res.cloudinary.com') && src.includes('/upload/')) {
    if (/\/upload\/[^/]*[wq]_[^/]*\//.test(src)) return src;
    return src.replace('/upload/', '/upload/f_auto,q_auto:best,w_1600,c_limit/');
  }
  return src;
}

export default function BlogPage() {
  const { isAdmin } = useAdmin();
  const { t, lang } = useLang();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { getBlogPosts } = await import('@/app/actions/blog');
        // Admin sees all, public sees only published
        const data = await getBlogPosts(!isAdmin);
        setPosts(data);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAdmin]);

  const publishedPosts = posts.filter((p) => p.published);

  return (
    <>
      <PageHero
        title="Blog"
        subtitle="Tipy na focení, inspirace a zákulisí"
        sectionPrefix="blog.hero"
      />

      <h2 className="seo-heading">Blog o focení — tipy na rodinné, svatební, newborn, portrétní a těhotenské focení v Praze</h2>

      {/* Admin Panel */}
      {isAdmin && (
        <section className="section" data-animate>
          <div className="container">
            <BlogAdmin />
          </div>
        </section>
      )}

      {/* Public blog list */}
      <section className="section" data-animate>
        <div className="container">
          <p className="section-label">
            <EditableText sectionId="blog.label" defaultValue="BLOG" as="span" />
          </p>

          {loading ? (
            <p style={{ textAlign: 'center', opacity: 0.6, padding: '2rem' }}>{t('Načítám články…')}</p>
          ) : publishedPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
                <EditableText sectionId="blog.title" defaultValue="Už brzy tu budou příspěvky" as="span" />
              </h2>
              <p style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.7, lineHeight: 1.7 }}>
                <EditableText
                  sectionId="blog.empty"
                  defaultValue="Pracuji na tom, aby tu pro vás brzy byly zajímavé články, tipy na focení a příběhy ze zákulisí. Sledujte mě na sociálních sítích, ať vám nic neuteče&nbsp;📸"
                  as="span"
                />
              </p>
            </div>
          ) : (
            <div className="blog-grid">
              {publishedPosts.map((post) => (
                <a key={post.id} href={`/blog/${post.slug}`} className="blog-card">
                  {post.cover_image && (
                    <div className="blog-card-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverUrl(post.cover_image)} alt={post.title} loading="lazy" />
                    </div>
                  )}
                  <div className="blog-card-body">
                    <p className="blog-card-date">
                      {new Date(post.published_at || post.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'cs-CZ', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <h3 className="blog-card-title">{post.title}</h3>
                    {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
                    <span className="blog-card-cta">{t('Číst více →')}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
