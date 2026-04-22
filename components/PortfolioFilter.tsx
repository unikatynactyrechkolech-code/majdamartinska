'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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

export interface PortfolioFilterDef {
  key: string;
  sectionId: string;
  label: string;
}

const defaultFilters: PortfolioFilterDef[] = [
  { key: 'all', sectionId: 'portfolio.filter.all', label: 'Vše' },
  { key: 'fotokouzla', sectionId: 'portfolio.filter.fotokouzla', label: 'Fotokouzla' },
  { key: 'newborn', sectionId: 'portfolio.filter.newborn', label: 'Newborn' },
  { key: 'rodinna', sectionId: 'portfolio.filter.rodinna', label: 'Rodinné' },
  { key: 'psi', sectionId: 'portfolio.filter.psi', label: 'Pejsci' },
  { key: 'svatby', sectionId: 'portfolio.filter.svatby', label: 'Svatby' },
  { key: 'portret', sectionId: 'portfolio.filter.portret', label: 'Portréty' },
  { key: 'tehotenske', sectionId: 'portfolio.filter.tehotenske', label: 'Těhotenské' },
  { key: 'barevne', sectionId: 'portfolio.filter.barevne', label: 'Barevné focení' },
  { key: 'art', sectionId: 'portfolio.filter.art', label: 'Art' },
];

const categoryAltMap: Record<string, string> = {
  fotokouzla: 'Fotokouzla',
  barevne: 'Barevné focení',
  rodinna: 'Rodinné focení',
  newborn: 'Newborn focení',
  tehotenske: 'Těhotenské focení',
  portret: 'Portrét',
  svatby: 'Svatobní focení',
  psi: 'Focení pejsků',
  art: 'Art',
};

/** Tombstone value stored in DB image_url when a static image is deleted */
const DELETED_MARKER = '__deleted__';

/**
 * Vrátí URL optimalizovanou pro náhled v gridu (menší rozměr, nižší kvalita).
 * Originální URL se použije v lightboxu pro plnou kvalitu.
 *  - Cloudinary: vloží transformaci `f_auto,q_auto:eco,w_900,c_limit` za `/upload/`
 *  - format.creatorcdn.com: ponechá (URL už má pevný rozměr v cestě)
 *  - ostatní: ponechá
 */
function thumbUrl(src: string): string {
  if (!src) return src;
  if (src.includes('res.cloudinary.com') && src.includes('/upload/')) {
    // Pokud už transformace obsahuje vlastní úpravu, nech být
    if (/\/upload\/[^/]*[wq]_[^/]*\//.test(src)) return src;
    return src.replace('/upload/', '/upload/f_auto,q_auto:eco,w_900,c_limit/');
  }
  return src;
}

export function PortfolioFilter({
  images,
  filters = defaultFilters,
  sectionPrefix = 'portfolio.gallery',
  defaultCategory,
}: {
  images: PortfolioImage[];
  filters?: PortfolioFilterDef[];
  sectionPrefix?: string;
  /** Fallback category when 'all' is active for the add-image button */
  defaultCategory?: string;
}) {
  const { isAdmin, images: dbImages, setImage } = useAdmin();
  const [active, setActive] = useState('all');
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [editModal, setEditModal] = useState<GalleryItem | null>(null);
  const [addModal, setAddModal] = useState<string | null>(null); // category for new image
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const addSectionIdRef = useRef<string>('');

  // Read URL hash on mount (e.g. /portfolio#rodinna → auto-select filter)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && filters.some(f => f.key === hash)) {
      setActive(hash);
    }
  }, []);

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
      const sectionId = `${sectionPrefix}.${img.category}.${idx}`;

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

    // 2) Append DB-only images (sectionIds matching <prefix>.*.new.*)
    const dbOnlyKeys = Object.keys(dbImages).filter(
      key => key.startsWith(`${sectionPrefix}.`) && key.includes('.new.')
        && !deletedSectionIds.has(key)
    );

    for (const key of dbOnlyKeys.sort()) {
      const entry = dbImages[key];
      if (!entry?.url) continue;
      const parts = key.split('.');
      const category = parts[2] || (defaultCategory || 'rodinna');
      items.push({
        src: entry.url,
        alt: categoryAltMap[category] || 'Portfolio',
        category,
        sectionId: key,
        isDbOnly: true,
      });
    }

    return items;
  }, [images, dbImages, deletedSectionIds, sectionPrefix, defaultCategory]);

  const filtered = useMemo(
    () => (active === 'all' ? allItems : allItems.filter(img => img.category === active)),
    [active, allItems]
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = () => setVisibleCount(prev => prev + IMAGES_PER_PAGE);

  // — Lightbox —
  const [zoomed, setZoomed] = useState(false);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const panStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const lightboxImgRef = useRef<HTMLImageElement | null>(null);

  const openLightbox = (idx: number) => {
    setLightbox(idx);
    setZoomed(false);
    setPanPos({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox(null);
    setZoomed(false);
    setPanPos({ x: 0, y: 0 });
    document.body.style.overflow = '';
  };

  const prevImage = () => {
    setZoomed(false);
    setPanPos({ x: 0, y: 0 });
    if (lightbox !== null && lightbox > 0) setLightbox(lightbox - 1);
    else if (lightbox === 0) setLightbox(filtered.length - 1);
  };

  const nextImage = () => {
    setZoomed(false);
    setPanPos({ x: 0, y: 0 });
    if (lightbox !== null && lightbox < filtered.length - 1) setLightbox(lightbox + 1);
    else if (lightbox === filtered.length - 1) setLightbox(0);
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoomed) {
      setZoomed(false);
      setPanPos({ x: 0, y: 0 });
    } else {
      setZoomed(true);
      setPanPos({ x: 0, y: 0 });
    }
  };

  // Panning when zoomed
  const handlePanStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!zoomed) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    panStart.current = { x: clientX, y: clientY, px: panPos.x, py: panPos.y };
  };

  const handlePanMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!zoomed || !panStart.current) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const dx = clientX - panStart.current.x;
    const dy = clientY - panStart.current.y;
    setPanPos({ x: panStart.current.px + dx, y: panStart.current.py + dy });
  };

  const handlePanEnd = () => {
    panStart.current = null;
  };

  // Scroll to zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY < 0 && !zoomed) {
      setZoomed(true);
      setPanPos({ x: 0, y: 0 });
    } else if (e.deltaY > 0 && zoomed) {
      setZoomed(false);
      setPanPos({ x: 0, y: 0 });
    }
  }, [zoomed]);

  // Keyboard: Escape to close, arrows to navigate
  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, filtered.length]);

  // — Admin: right-click to edit, single-click for lightbox —
  const handleItemClick = (idx: number) => {
    openLightbox(idx);
  };

  const handleItemContextMenu = (idx: number, e: React.MouseEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setEditModal(filtered[idx]);
    setUploadSuccess(false);
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
    const id = `${sectionPrefix}.${category}.new.${Date.now()}`;
    addSectionIdRef.current = id;
    return id;
  };

  // Category-specific counts for display
  const getCategoryCount = (key: string) => {
    if (key === 'all') return allItems.length;
    return allItems.filter(i => i.category === key).length;
  };

  // Determine which category to use for "add" button
  const firstNonAll = filters.find(f => f.key !== 'all')?.key || 'rodinna';
  const addCategory = active === 'all' ? (defaultCategory || firstNonAll) : active;

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
            onClick={() => handleItemClick(i)}
            onContextMenu={(e) => handleItemContextMenu(i, e)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbUrl(img.src)}
              alt={img.alt}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
            />
            {isAdmin && (
              <div className="portfolio-item-overlay">
                <span>📷 Pravý klik</span>
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
          <a href="/kontakt" className="btn btn-primary">Chci fotky</a>
        </div>
      )}

      {/* Lightbox — portaled to <body> aby unik z transform-stacking-contextu rodičů
           ([data-animate] sekce má transform: translateY(0) i ve viditelném stavu,
           což by jinak rozbíjelo position: fixed lightboxu na vrcholu/dně galerie). */}
      {lightbox !== null && filtered[lightbox] && createPortal(
        <div className="portfolio-lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Zavřít">&times;</button>
          <button
            className="lightbox-prev"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Předchozí"
          >&#8249;</button>
          <div
            className="lightbox-img-wrap"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
            onTouchStart={handlePanStart}
            onTouchMove={handlePanMove}
            onTouchEnd={handlePanEnd}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={lightboxImgRef}
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
              className={zoomed ? 'zoomed' : ''}
              style={zoomed ? {
                transform: `scale(2.5) translate(${panPos.x / 2.5}px, ${panPos.y / 2.5}px)`,
                cursor: 'grab',
              } : undefined}
              onClick={toggleZoom}
              draggable={false}
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
        </div>,
        document.body
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
              multiple={false}
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
              multiple
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
