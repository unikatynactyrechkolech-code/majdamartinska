'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { BlogEditor } from '@/components/BlogEditor';
import type { BlogPost } from '@/app/actions/blog';

// ============================================================
// BLOG ADMIN — seznam článků + editor
// Přístupné jen admina (heslo majda2026)
// ============================================================

type View = 'list' | 'new' | 'edit';

export function BlogAdmin() {
  const { isAdmin } = useAdmin();
  const [view, setView] = useState<View>('list');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { getBlogPosts } = await import('@/app/actions/blog');
      const data = await getBlogPosts(false); // all posts including drafts
      setPosts(data);
    } catch (err) {
      console.error('Failed to load blog posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) loadPosts();
  }, [isAdmin, loadPosts]);

  if (!isAdmin) return null;

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setView('edit');
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Opravdu smazat "${post.title}"?`)) return;
    try {
      const { deleteBlogPost } = await import('@/app/actions/blog');
      const result = await deleteBlogPost(post.id);
      if (result.success) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
      } else {
        alert(result.error || 'Smazání selhalo.');
      }
    } catch {
      alert('Chyba při mazání.');
    }
  };

  const handleSaved = (saved: BlogPost) => {
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setView('list');
    setEditingPost(null);
  };

  // --- Editor view ---
  if (view === 'new') {
    return (
      <BlogEditor
        onSaved={handleSaved}
        onCancel={() => setView('list')}
      />
    );
  }
  if (view === 'edit' && editingPost) {
    return (
      <BlogEditor
        post={editingPost}
        onSaved={handleSaved}
        onCancel={() => { setView('list'); setEditingPost(null); }}
      />
    );
  }

  // --- List view ---
  return (
    <div className="blog-admin">
      <div className="blog-admin-header">
        <h2>Správa článků</h2>
        <button
          type="button"
          className="blog-btn blog-btn-primary"
          onClick={() => setView('new')}
        >
          + Nový článek
        </button>
      </div>

      {loading ? (
        <p className="blog-admin-loading">Načítám…</p>
      ) : posts.length === 0 ? (
        <p className="blog-admin-empty">Zatím žádné články. Vytvořte první!</p>
      ) : (
        <div className="blog-admin-list">
          {posts.map((post) => (
            <div key={post.id} className="blog-admin-card">
              {post.cover_image && (
                <div className="blog-admin-card-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.cover_image} alt={post.title} />
                </div>
              )}
              <div className="blog-admin-card-body">
                <div className="blog-admin-card-top">
                  <h3>{post.title}</h3>
                  <span className={`blog-admin-badge ${post.published ? 'published' : 'draft'}`}>
                    {post.published ? 'Publikováno' : 'Koncept'}
                  </span>
                </div>
                <p className="blog-admin-card-slug">/blog/{post.slug}</p>
                {post.excerpt && <p className="blog-admin-card-excerpt">{post.excerpt}</p>}
                <div className="blog-admin-card-actions">
                  <button type="button" className="blog-btn blog-btn-sm" onClick={() => handleEdit(post)}>
                    ✏️ Upravit
                  </button>
                  <button type="button" className="blog-btn blog-btn-sm blog-btn-danger" onClick={() => handleDelete(post)}>
                    🗑️ Smazat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
