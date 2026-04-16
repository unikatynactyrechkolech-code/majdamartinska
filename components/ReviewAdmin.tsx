'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import type { Review, SaveReviewInput } from '@/app/actions/reviews';

// ============================================================
// REVIEW ADMIN — správa recenzí (přidat / upravit / smazat)
// Zobrazí se jen pro admina na stránce /recenze
// ============================================================

/* ---------- Editor (formulář) ---------- */

function ReviewEditor({
  review,
  onSaved,
  onCancel,
}: {
  review?: Review;
  onSaved: (r: Review) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(review?.name ?? '');
  const [nameEn, setNameEn] = useState(review?.name_en ?? '');
  const [type, setType] = useState(review?.type ?? '');
  const [typeEn, setTypeEn] = useState(review?.type_en ?? '');
  const [text, setText] = useState(review?.text ?? '');
  const [textEn, setTextEn] = useState(review?.text_en ?? '');
  const [profileImage, setProfileImage] = useState(review?.profile_image ?? '');
  const [stars, setStars] = useState(review?.stars ?? 5);
  const [sortOrder, setSortOrder] = useState(review?.sort_order ?? 999);
  const [visible, setVisible] = useState(review?.visible ?? true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { uploadReviewImage } = await import('@/app/actions/reviews');
      const res = await uploadReviewImage(formData);
      if (res.success && res.url) {
        setProfileImage(res.url);
      } else {
        setError(res.error || 'Nahrávání selhalo.');
      }
    } catch {
      setError('Chyba při nahrávání obrázku.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const { saveReview } = await import('@/app/actions/reviews');
      const input: SaveReviewInput = {
        ...(review?.id ? { id: review.id } : {}),
        name,
        name_en: nameEn || null,
        type,
        type_en: typeEn || null,
        text,
        text_en: textEn || null,
        profile_image: profileImage || null,
        stars,
        sort_order: sortOrder,
        visible,
      };
      const res = await saveReview(input);
      if (res.success && res.review) {
        onSaved(res.review);
      } else {
        setError(res.error || 'Uložení selhalo.');
      }
    } catch {
      setError('Neznámá chyba.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="review-editor">
      <h3>{review ? '✏️ Upravit recenzi' : '➕ Nová recenze'}</h3>

      {error && <p className="review-editor-error">{error}</p>}

      {/* Profile image */}
      <div className="review-editor-img-row">
        <div className="review-editor-avatar">
          {profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profileImage} alt="Profilovka" />
          ) : (
            <span className="review-editor-avatar-placeholder">👤</span>
          )}
        </div>
        <div>
          <label className="blog-btn blog-btn-sm" style={{ cursor: 'pointer', display: 'inline-block' }}>
            {uploading ? 'Nahrávám…' : '📷 Nahrát profilovku'}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>
          {profileImage && (
            <button type="button" className="blog-btn blog-btn-sm blog-btn-danger" style={{ marginLeft: 8 }} onClick={() => setProfileImage('')}>
              Odebrat
            </button>
          )}
        </div>
      </div>

      {/* CZ Fields */}
      <fieldset className="review-editor-fieldset">
        <legend>🇨🇿 Čeština</legend>
        <label>
          Jméno *
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jana N." />
        </label>
        <label>
          Typ focení *
          <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Rodinné focení" />
        </label>
        <label>
          Text recenze *
          <textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="Text recenze…" />
        </label>
      </fieldset>

      {/* EN Fields */}
      <fieldset className="review-editor-fieldset">
        <legend>🇬🇧 English (volitelné)</legend>
        <label>
          Name
          <input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Jana N." />
        </label>
        <label>
          Photo type
          <input type="text" value={typeEn} onChange={(e) => setTypeEn(e.target.value)} placeholder="Family photography" />
        </label>
        <label>
          Review text
          <textarea rows={5} value={textEn} onChange={(e) => setTextEn(e.target.value)} placeholder="Review text in English…" />
        </label>
      </fieldset>

      {/* Meta */}
      <div className="review-editor-meta">
        <label>
          Hvězdičky
          <div className="review-editor-stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" className={`review-editor-star ${n <= stars ? 'active' : ''}`} onClick={() => setStars(n)}>★</button>
            ))}
          </div>
        </label>
        <label>
          Pořadí
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} style={{ width: 80 }} />
        </label>
        <label className="review-editor-checkbox">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
          Viditelná na webu
        </label>
      </div>

      {/* Actions */}
      <div className="review-editor-actions">
        <button type="button" className="blog-btn blog-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Ukládám…' : '💾 Uložit'}
        </button>
        <button type="button" className="blog-btn" onClick={onCancel}>
          Zrušit
        </button>
      </div>
    </div>
  );
}

/* ---------- Main Admin List ---------- */

export function ReviewAdmin() {
  const { isAdmin } = useAdmin();
  const [view, setView] = useState<'list' | 'new' | 'edit'>('list');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const { getReviews } = await import('@/app/actions/reviews');
      const data = await getReviews(false); // all including hidden
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) loadReviews();
  }, [isAdmin, loadReviews]);

  if (!isAdmin) return null;

  const handleEdit = (r: Review) => {
    setEditingReview(r);
    setView('edit');
  };

  const handleDelete = async (r: Review) => {
    if (!confirm(`Opravdu smazat recenzi od "${r.name}"?`)) return;
    try {
      const { deleteReview } = await import('@/app/actions/reviews');
      const res = await deleteReview(r.id);
      if (res.success) {
        setReviews((prev) => prev.filter((x) => x.id !== r.id));
      } else {
        alert(res.error || 'Smazání selhalo.');
      }
    } catch {
      alert('Chyba při mazání.');
    }
  };

  const handleSaved = (saved: Review) => {
    setReviews((prev) => {
      const idx = prev.findIndex((x) => x.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
    setView('list');
    setEditingReview(null);
  };

  // --- Editor view ---
  if (view === 'new') {
    return (
      <section className="section">
        <div className="container">
          <ReviewEditor onSaved={handleSaved} onCancel={() => setView('list')} />
        </div>
      </section>
    );
  }
  if (view === 'edit' && editingReview) {
    return (
      <section className="section">
        <div className="container">
          <ReviewEditor review={editingReview} onSaved={handleSaved} onCancel={() => { setView('list'); setEditingReview(null); }} />
        </div>
      </section>
    );
  }

  // --- List view ---
  return (
    <section className="section">
      <div className="container">
        <div className="review-admin">
          <div className="blog-admin-header">
            <h2>🌟 Správa recenzí</h2>
            <button type="button" className="blog-btn blog-btn-primary" onClick={() => setView('new')}>
              + Nová recenze
            </button>
          </div>

          {loading ? (
            <p className="blog-admin-loading">Načítám…</p>
          ) : reviews.length === 0 ? (
            <p className="blog-admin-empty">Zatím žádné recenze v databázi.</p>
          ) : (
            <div className="review-admin-list">
              {reviews.map((r) => (
                <div key={r.id} className={`review-admin-card ${!r.visible ? 'review-admin-card--hidden' : ''}`}>
                  <div className="review-admin-card-avatar">
                    {r.profile_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.profile_image} alt={r.name} />
                    ) : (
                      <span className="review-editor-avatar-placeholder">👤</span>
                    )}
                  </div>
                  <div className="review-admin-card-body">
                    <div className="review-admin-card-top">
                      <strong>{r.name}</strong>
                      <span className="review-admin-card-type">{r.type}</span>
                      {!r.visible && <span className="blog-admin-badge draft">Skrytá</span>}
                      <span className="review-admin-card-order">#{r.sort_order}</span>
                    </div>
                    <p className="review-admin-card-text">{r.text.length > 120 ? r.text.slice(0, 120) + '…' : r.text}</p>
                    <div className="blog-admin-card-actions">
                      <button type="button" className="blog-btn blog-btn-sm" onClick={() => handleEdit(r)}>
                        ✏️ Upravit
                      </button>
                      <button type="button" className="blog-btn blog-btn-sm blog-btn-danger" onClick={() => handleDelete(r)}>
                        🗑️ Smazat
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
