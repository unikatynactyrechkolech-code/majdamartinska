'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [reordering, setReordering] = useState(false);
  const [reorderMsg, setReorderMsg] = useState<string | null>(null);
  const dragIndex = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

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

  // ---------- Drag & drop ----------
  const persistOrder = async (ordered: BlogPost[]) => {
    setReordering(true);
    setReorderMsg(null);
    try {
      const { reorderBlogPosts } = await import('@/app/actions/blog');
      const result = await reorderBlogPosts(ordered.map((p) => p.id));
      if (result.success) {
        setReorderMsg('✅ Pořadí uloženo');
        setTimeout(() => setReorderMsg(null), 2000);
      } else {
        setReorderMsg('❌ ' + (result.error || 'Chyba'));
      }
    } catch {
      setReorderMsg('❌ Chyba při ukládání');
    } finally {
      setReordering(false);
    }
  };

  const onDragStart = (index: number) => (e: React.DragEvent) => {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
    // Safari potřebuje, aby data byla nastavena
    try { e.dataTransfer.setData('text/plain', String(index)); } catch {}
  };

  const onDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (overIndex !== index) setOverIndex(index);
  };

  const onDragLeave = () => setOverIndex(null);

  const onDrop = (dropIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIndex.current;
    dragIndex.current = null;
    setOverIndex(null);
    if (from === null || from === dropIndex) return;

    const next = [...posts];
    const [moved] = next.splice(from, 1);
    next.splice(dropIndex, 0, moved);
    setPosts(next);
    persistOrder(next);
  };

  const moveItem = (from: number, dir: -1 | 1) => {
    const to = from + dir;
    if (to < 0 || to >= posts.length) return;
    const next = [...posts];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setPosts(next);
    persistOrder(next);
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
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {reorderMsg && (
            <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>{reorderMsg}</span>
          )}
          <button
            type="button"
            className="blog-btn blog-btn-primary"
            onClick={() => setView('new')}
          >
            + Nový článek
          </button>
        </div>
      </div>

      {posts.length > 1 && !loading && (
        <p className="blog-admin-hint">
          💡 Tip: Karty můžeš <strong>přetáhnout</strong> myší (chyť za ⋮⋮ vlevo) nebo posunout šipkami ↑ ↓ pro změnu pořadí na webu.
        </p>
      )}

      {loading ? (
        <p className="blog-admin-loading">Načítám…</p>
      ) : posts.length === 0 ? (
        <p className="blog-admin-empty">Zatím žádné články. Vytvořte první!</p>
      ) : (
        <div className={`blog-admin-list ${reordering ? 'is-saving' : ''}`}>
          {posts.map((post, index) => (
            <div
              key={post.id}
              className={`blog-admin-card ${overIndex === index ? 'is-drag-over' : ''}`}
              draggable
              onDragStart={onDragStart(index)}
              onDragOver={onDragOver(index)}
              onDragLeave={onDragLeave}
              onDrop={onDrop(index)}
              onDragEnd={() => { dragIndex.current = null; setOverIndex(null); }}
            >
              <div className="blog-admin-card-drag" title="Přetáhni pro změnu pořadí" aria-hidden>
                ⋮⋮
              </div>

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
                  <button
                    type="button"
                    className="blog-btn blog-btn-sm"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0 || reordering}
                    title="Posunout nahoru"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="blog-btn blog-btn-sm"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === posts.length - 1 || reordering}
                    title="Posunout dolů"
                  >
                    ↓
                  </button>
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
