import { getBlogPostBySlug, getBlogPosts } from '@/app/actions/blog';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// ============================================================
// /blog/[slug] — veřejná stránka jednoho článku
// ============================================================

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Článek nenalezen' };
  return {
    title: `${post.title} — Majda Martinská Blog`,
    description: post.excerpt || undefined,
    openGraph: post.cover_image ? { images: [post.cover_image] } : undefined,
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts(true);
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      {/* Hero */}
      {post.cover_image && (
        <div className="blog-post-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_image} alt={post.title} />
          <div className="blog-post-hero-overlay" />
        </div>
      )}

      <article className="blog-post">
        <div className="container">
          <header className="blog-post-header">
            <p className="blog-post-date">{formattedDate}</p>
            <h1 className="blog-post-title">{post.title}</h1>
            {post.excerpt && <p className="blog-post-excerpt">{post.excerpt}</p>}
          </header>

          {post.content && (
            <div
              className="blog-post-body"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          <footer className="blog-post-footer">
            <a href="/blog" className="blog-post-back">← Zpět na blog</a>
          </footer>
        </div>
      </article>
    </>
  );
}
