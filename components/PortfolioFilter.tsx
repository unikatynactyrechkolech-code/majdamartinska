'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { EditableText } from '@/components/EditableText';
import { ImageUploader } from '@/components/ImageUploader';
import { useAdmin } from '@/contexts/AdminContext';

interface PortfolioImage {
  src: string;
  alt: string;
  category: string;
}

/** Internal type with sectionId for edit/delete */
interface GalleryItem {
  src: string;
  alt: string;
  category: string;
  sectionId: string;
  /** If true, this is a DB-only image (not in static data) */
  isDbOnly?: boolean;
}

const IMAGES_PER_PAGE = 24;

const filters = [
  { key: 'all', sectionId: 'portfolio.filter.all', label: 'Vše' },
  { key: 'rodinna', sectionId: 'portfolio.filter.rodinna', label: 'Rodinné' },
  { key: 'newborn', sectionId: 'portfolio.filter.newborn', label: 'Newborn' },
  { key: 'tehotenske', sectionId: 'portfolio.filter.tehotenske', label: 'Těhotenské' },
  { key: 'portret', sectionId: 'portfolio.filter.portret', label: 'Portréty' },
  { key: 'svatby', sectionId: 'portfolio.filter.svatby', label: 'Svatby' },
  { key: 'psi', sectionId: 'portfolio.filter.psi', label: 'Pejsci' },
];

const categoryAltMap: Record<string, string> = {
  rodinna: 'Rodinné focení',
  newborn: 'Newborn focení',
  tehotenske: 'Těhotenské focení',
  portret: 'Portrét',
  svatby: 'Svatební focení',
  psi: 'Focení pejsků',
};

/** Tombstone value stored in DB image_url when a static image is deleted */
const DELETED_MARKER = '__deleted__';

export function PortfolioFilter({ images }: { images: PortfolioImage[] }) {
  const { isAdmin, images: dbImages, setImage } = useAdmin();
  const [active, setActive] = useState('all');
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [editModal, setEditModal] = useState<GalleryItem | null>(null);
  const [addModal, setAddModal] = useState<string | null>(null); // category for new image
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const addSectionIdRef = useRef<string>('');

  // Compute deleted set from dbImages (tombstones persisted in DB)
  const deletedSectionIds = useMemo(() => {
    const set = new Set<string>();
    for (const [key, entry] of Object.entries(dbImages)) {
      if (entry?.url === DELETED_MARKER) set.add(key);
    }
    return set;
  }, [dbImages]);

  const handleFilter = useCallback((key: string) => {
    setActive(key);
    setVisibleCount(IMAGES_PER_PAGE);
  }, []);

  // Build the full gallery: static images (with DB overrides) + DB-only new images
  const allItems: GalleryItem[] = useMemo(() => {
    const items: GalleryItem[] = [];

    // 1) Static images with sectionIds, applying DB overrides
    images.forEach((img, idx) => {
      const sectionId = `portfolio.gallery.${img.category}.${idx}`;

      // Skip if deleted in this session
      if (deletedSectionIds.has(sectionId)) return;

      const dbEntry = dbImages[sectionId];
      items.push({
        src: dbEntry?.url || img.src,
        alt: img.alt,
        category: img.category,
        sectionId,
      });
    });

    // 2) Append DB-only images (sectionIds matching portfolio.gallery.*.new.*)
    const dbOnlyKeys = Object.keys(dbImages).filter(
      key => key.startsWith('portfolio.gallery.') && key.includes('.new.')
        && !deletedSectionIds.has(key)
    );

    for (const key of dbOnlyKeys.sort()) {
      const entry = dbImages[key];
      if (!entry?.url) continue;
      const parts = key.split('.');
      const category = parts[2] || 'rodinna';
      items.push({
        src: entry.url,
        alt: categoryAltMap[category] || 'Portfolio',
        category,
        sectionId: key,
        isDbOnly: true,
      });
    }

    return items;
  }, [images, dbImages, deletedSectionIds]);

  const filtered = useMemo(
    () => (active === 'all' ? allItems : allItems.filter(img => img.category === active)),
    [active, allItems]
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = () => setVisibleCount(prev => prev + IMAGES_PER_PAGE);

  // — Lightbox —
  const openLightbox = (idx: number) => {
    setLightbox(idx);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox(null);
    document.body.style.overflow = '';
  };

  const prevImage = () => {
    if (lightbox !== null && lightbox > 0) setLightbox(lightbox - 1);
    else if (lightbox === 0) setLightbox(filtered.length - 1);
  };

  const nextImage = () => {
    if (lightbox !== null && lightbox < filtered.length - 1) setLightbox(lightbox + 1);
    else if (lightbox === filtered.length - 1) setLightbox(0);
  };

  // — Admin: edit/delete on double-click —
  const handleItemClick = (idx: number, e: React.MouseEvent) => {
    if (isAdmin && e.detail === 2) {
      // Double-click in admin mode: open edit modal
      e.preventDefault();
      setEditModal(filtered[idx]);
      setUploadSuccess(false);
    } else if (e.detail === 1) {
      // Single-click: open lightbox (with slight delay to distinguish from dblclick)
      setTimeout(() => {
        // only open lightbox if editModal wasn't just opened
        setEditModal((current) => {
          if (current === null) openLightbox(idx);
          return current;
        });
      }, 200);
    }
  };

  const closeEditModal = () => {
    setEditModal(null);
    setUploadSuccess(false);
  };

  const closeAddModal = () => {
    setAddModal(null);
    setUploadSuccess(false);
  };

  // Handle delete for a gallery item
  const handleDeleteItem = async (item: GalleryItem) => {
    const confirmed = window.confirm('Opravdu smazat tento obrázek z galerie?');
    if (!confirmed) return;

    try {
      if (item.isDbOnly) {
        // DB-only image: fully delete from Cloudinary + DB
        const { deleteImage } = await import('@/app/actions/images');
        const result = await deleteImage(item.sectionId);
        if (result.success) {
          setImage(item.sectionId, null);
          setEditModal(null);
        } else {
          alert(result.error || 'Smazání selhalo.');
        }
      } else {
        // Static image: write tombstone to DB so it stays hidden after refresh
        const { markImageDeleted } = await import('@/app/actions/images');
        const result = await markImageDeleted(item.sectionId);
        if (result.success) {
          setImage(item.sectionId, { url: DELETED_MARKER, publicId: '' });
          setEditModal(null);
        } else {
          alert(result.error || 'Smazání selhalo.');
        }
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Chyba při mazání obrázku.');
    }
  };

  // Determine new sectionId for adding an image to a category
  const generateNewSectionId = (category: string) => {
    const id = `portfolio.gallery.${category}.new.${Date.now()}`;
    addSectionIdRef.current = id;
    return id;
  };

  // Category-specific counts for display
  const getCategoryCount = (key: string) => {
    if (key === 'all') return allItems.length;
    return allItems.filter(i => i.category === key).length;
  };

  // Determine which category to use for "add" button
  const addCategory = active === 'all' ? 'rodinna' : active;

  return (
    <>
      <div className="portfolio-filter">
        {filters.map(f => (
          <button
            key={f.key}
            className={active === f.key ? 'active' : ''}
            onClick={() => handleFilter(f.key)}
          >
            <EditableText sectionId={f.sectionId} defaultValue={f.label} as="span" />
            {active !== f.key && (
              <span className="portfolio-filter-count">
                {getCategoryCount(f.key)}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="portfolio-masonry">
        {visible.map((img, i) => (
          <div
            className={`portfolio-item ${isAdmin ? 'portfolio-item-admin' : ''}`}
            key={img.sectionId}
            onClick={(e) => handleItemClick(i, e)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
            />
            {isAdmin && (
              <div className="portfolio-item-overlay">
                <span>📷 2× klik</span>
              </div>
            )}
          </div>
        ))}

        {/* Admin: Add new image card */}
        {isAdmin && (
          <div
            className="portfolio-item portfolio-add-card"
            onClick={() => { generateNewSectionId(addCategory); setAddModal(addCategory); setUploadSuccess(false); }}
          >
            <div className="portfolio-add-inner">
              <span className="portfolio-add-icon">+</span>
              <span className="portfolio-add-text">Přidat obrázek</span>
              {active === 'all' && (
                <span className="portfolio-add-hint">(kategorie se vybere v modalu)</span>
              )}
            </div>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="portfolio-load-more">
          <button className="btn btn-outline" onClick={loadMore}>
            <EditableText sectionId="portfolio.loadmore" defaultValue="Načíst další fotky" as="span" />
            <span className="portfolio-remaining"> ({filtered.length - visibleCount})</span>
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div className="portfolio-lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Zavřít">&times;</button>
          <button
            className="lightbox-prev"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Předchozí"
          >&#8249;</button>
          <div className="lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
            />
          </div>
          <button
            className="lightbox-next"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Další"
          >&#8250;</button>
          <div className="lightbox-counter">
            {lightbox + 1} / {filtered.length}
          </div>
        </div>
      )}

      {/* Edit/Delete Modal (admin) */}
      {editModal && createPortal(
        <div className="cms-img-modal-backdrop" onClick={closeEditModal}>
          <div className="cms-img-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cms-img-modal-close" onClick={closeEditModal}>✕</button>

            <h3 className="cms-img-modal-title">📷 Upravit obrázek</h3>
            <p className="cms-img-modal-section">
              Sekce: <code>{editModal.sectionId}</code>
            </p>

            {/* Current image preview */}
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editModal.src}
                alt={editModal.alt}
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '0.5rem' }}
              />
            </div>

            <ImageUploader
              sectionId={editModal.sectionId}
              currentUrl={dbImages[editModal.sectionId]?.url || null}
              cloudinaryPublicId={dbImages[editModal.sectionId]?.publicId || null}
              onUploadComplete={(data) => {
                setImage(editModal.sectionId, { url: data.imageUrl, publicId: data.publicId });
                setUploadSuccess(true);
                // Update the editModal to show new image
                setEditModal(prev => prev ? { ...prev, src: data.imageUrl } : null);
              }}
              onDeleteComplete={() => {
                setImage(editModal.sectionId, { url: DELETED_MARKER, publicId: '' });
                setEditModal(null);
              }}
              compact
            />

            {uploadSuccess && (
              <div className="cms-img-modal-success">
                ✅ Obrázek nahrazen! Změna je okamžitě aktivní.
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'center' }}>
              <button
                className="cms-img-btn-cancel"
                style={{ background: '#c0392b', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                onClick={() => handleDeleteItem(editModal)}
              >
                🗑 Smazat obrázek
              </button>
              <button className="cms-img-btn-cancel" onClick={closeEditModal}>
                {uploadSuccess ? '✓ Hotovo' : 'Zavřít'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add New Image Modal (admin) */}
      {addModal && createPortal(
        <div className="cms-img-modal-backdrop" onClick={closeAddModal}>
          <div className="cms-img-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cms-img-modal-close" onClick={closeAddModal}>✕</button>

            <h3 className="cms-img-modal-title">➕ Přidat nový obrázek</h3>

            {/* Category selector */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                Kategorie:
              </label>
              <select
                value={addModal}
                onChange={(e) => { generateNewSectionId(e.target.value); setAddModal(e.target.value); }}
                style={{
                  width: '100%', padding: '0.5rem', borderRadius: '0.4rem',
                  border: '1px solid #ccc', fontSize: '0.9rem',
                }}
              >
                {filters.filter(f => f.key !== 'all').map(f => (
                  <option key={f.key} value={f.key}>{f.label}</option>
                ))}
              </select>
            </div>

            <ImageUploader
              sectionId={addSectionIdRef.current}
              currentUrl={null}
              cloudinaryPublicId={null}
              onUploadComplete={(data) => {
                // The image was saved to DB with addSectionIdRef.current
                // Update local context with that same sectionId
                setImage(addSectionIdRef.current, { url: data.imageUrl, publicId: data.publicId });
                setUploadSuccess(true);
                // Generate a new sectionId for the next upload in this session
                if (addModal) generateNewSectionId(addModal);
              }}
              onDeleteComplete={() => {
                setUploadSuccess(false);
              }}
              compact
            />

            {uploadSuccess && (
              <div className="cms-img-modal-success">
                ✅ Obrázek přidán do galerie!
              </div>
            )}

            <div className="cms-img-modal-actions">
              <button className="cms-img-btn-cancel" onClick={closeAddModal}>
                {uploadSuccess ? '✓ Hotovo' : 'Zavřít'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
