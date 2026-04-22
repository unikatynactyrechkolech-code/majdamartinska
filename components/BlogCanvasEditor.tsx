'use client';

import { useState, useRef, useCallback, useEffect, type CSSProperties } from 'react';
import type { BlogPost } from '@/app/actions/blog';
import {
  CANVAS_MARKER,
  parseCanvas,
  serializeCanvas,
  type Align,
  type TextBlock,
  type ImageBlock,
  type CanvasBlock,
  type CanvasDoc,
} from '@/lib/canvas';

export { CANVAS_MARKER, parseCanvas, serializeCanvas };
export type { Align, TextBlock, ImageBlock, CanvasBlock, CanvasDoc };

// ============================================================
// BLOG CANVAS EDITOR — Word/Canva-style block editor
//
// Funkce:
//  - Prázdná stránka (canvas 960×N)
//  - Postranní panel: + Text, + Obrázek
//  - Bloky volně přetahovatelné po stránce
//  - Resize přes 8 úchytů (rohy + hrany)
//  - Snap na mřížku 20 px (magnety)
//  - Snap na hrany ostatních bloků (zarovnání)
//  - Inline editace textu (double-click)
//  - Properties panel: font, velikost, barva, zarovnání, obrázek fit
//  - Vrstvy (z-index nahoru/dolu)
//  - Mazání: Delete / klikem na ikonu
//
// Uloží se jako: <!--MAJDA_CANVAS-->{json}
// V content sloupci tabulky blog_posts (text).
// ============================================================

// Layout/grid constants
const CANVAS_W = 960;
const DEFAULT_H = 1200;
const GRID = 20;
const SNAP_TOLERANCE = 8;
const MIN_W = 60;
const MIN_H = 30;

// ---------- Helpers ----------

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function emptyDoc(): CanvasDoc {
  return { version: 1, width: CANVAS_W, height: DEFAULT_H, bg: '#ffffff', blocks: [] };
}

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

// Snap value to grid + nearby block edges
function snap(value: number, candidates: number[]): number {
  // Grid snap
  const grid = Math.round(value / GRID) * GRID;
  let best = grid;
  let bestDist = Math.abs(value - grid);
  // Other-block snap (priority over grid if closer)
  for (const c of candidates) {
    const d = Math.abs(value - c);
    if (d < bestDist && d <= SNAP_TOLERANCE) {
      best = c;
      bestDist = d;
    }
  }
  return best;
}

// ---------- Default new blocks ----------

function newTextBlock(x: number, y: number, maxZ: number): TextBlock {
  return {
    id: uid(), type: 'text',
    x, y, w: 360, h: 80,
    text: 'Klikni dvakrát pro úpravu textu',
    fontSize: 18, color: '#3d2b1f', bg: '',
    align: 'left', fontFamily: '', bold: false, italic: false, underline: false,
    lineHeight: 1.5, padding: 12,
    z: maxZ + 1,
  };
}

function newImageBlock(x: number, y: number, src: string, maxZ: number, naturalW = 480, naturalH = 320): ImageBlock {
  // Fit into 480 max width, preserve aspect
  const w = Math.min(480, naturalW);
  const h = Math.round((w / naturalW) * naturalH);
  return {
    id: uid(), type: 'image',
    x, y, w, h,
    src, alt: '',
    fit: 'cover', radius: 8,
    z: maxZ + 1,
  };
}

// ============================================================
// MAIN COMPONENT
// ============================================================

interface Props {
  post?: BlogPost | null;
  onSaved?: (post: BlogPost) => void;
  onCancel?: () => void;
}

export function BlogCanvasEditor({ post, onSaved, onCancel }: Props) {
  // --- Metadata ---
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [slugManual, setSlugManual] = useState(!!post?.slug);
  const [coverImage, setCoverImage] = useState(post?.cover_image || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // --- Canvas doc ---
  const initial = parseCanvas(post?.content) || emptyDoc();
  const [doc, setDoc] = useState<CanvasDoc>(initial);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  // --- Save state ---
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imgUploading, setImgUploading] = useState(false);

  // Auto-slug
  useEffect(() => {
    if (!slugManual && title) setSlug(toSlug(title));
  }, [title, slugManual]);

  // ---------- Block helpers ----------
  const maxZ = doc.blocks.reduce((m, b) => Math.max(m, b.z), 0);
  const selected = doc.blocks.find((b) => b.id === selectedId) || null;

  const updateBlock = useCallback((id: string, patch: Partial<CanvasBlock>) => {
    setDoc((d) => ({
      ...d,
      blocks: d.blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as CanvasBlock) : b)),
    }));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setDoc((d) => ({ ...d, blocks: d.blocks.filter((b) => b.id !== id) }));
    setSelectedId(null);
    setEditingTextId(null);
  }, []);

  const bringForward = (id: string) => {
    const top = maxZ;
    updateBlock(id, { z: top + 1 } as Partial<CanvasBlock>);
  };
  const sendBackward = (id: string) => {
    const min = doc.blocks.reduce((m, b) => Math.min(m, b.z), 0);
    updateBlock(id, { z: min - 1 } as Partial<CanvasBlock>);
  };

  // ---------- Add blocks ----------
  const addText = () => {
    const blk = newTextBlock(40, 40 + doc.blocks.length * 20, maxZ);
    setDoc((d) => ({ ...d, blocks: [...d.blocks, blk] }));
    setSelectedId(blk.id);
  };

  const addImageFile = useCallback(async (file: File) => {
    setImgUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { uploadBlogImage } = await import('@/app/actions/blog');
      const result = await uploadBlogImage(formData);
      if (!result.success || !result.url) {
        setError(result.error || 'Nahrání selhalo.');
        return;
      }
      // Detect natural size
      const url = result.url;
      const img = new Image();
      img.onload = () => {
        const blk = newImageBlock(40, 40 + doc.blocks.length * 20, url, maxZ, img.naturalWidth, img.naturalHeight);
        setDoc((d) => ({ ...d, blocks: [...d.blocks, blk] }));
        setSelectedId(blk.id);
      };
      img.onerror = () => {
        const blk = newImageBlock(40, 40 + doc.blocks.length * 20, url, maxZ);
        setDoc((d) => ({ ...d, blocks: [...d.blocks, blk] }));
        setSelectedId(blk.id);
      };
      img.src = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při nahrávání.');
    } finally {
      setImgUploading(false);
    }
  }, [doc.blocks.length, maxZ]);

  const imgFileRef = useRef<HTMLInputElement>(null);

  // ---------- Cover upload ----------
  const handleCoverUpload = useCallback(async (file: File) => {
    setCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { uploadBlogImage } = await import('@/app/actions/blog');
      const result = await uploadBlogImage(formData);
      if (result.success && result.url) setCoverImage(result.url);
      else setError(result.error || 'Nahrání náhledu selhalo.');
    } catch {
      setError('Chyba při nahrávání náhledu.');
    } finally {
      setCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  }, []);

  // ---------- Drag & resize state ----------
  const dragRef = useRef<{
    mode: 'move' | 'resize';
    handle?: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
    id: string;
    startX: number; startY: number;
    orig: { x: number; y: number; w: number; h: number };
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Keyboard: Delete to remove selected
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !editingTextId) {
        const target = e.target as HTMLElement;
        if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) return;
        e.preventDefault();
        deleteBlock(selectedId);
      }
      if (e.key === 'Escape') {
        setEditingTextId(null);
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, editingTextId, deleteBlock]);

  // Pointer move/up handlers
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const others = doc.blocks.filter((b) => b.id !== drag.id);
      const xCands = others.flatMap((b) => [b.x, b.x + b.w, b.x + b.w / 2]);
      const yCands = others.flatMap((b) => [b.y, b.y + b.h, b.y + b.h / 2]);

      if (drag.mode === 'move') {
        let nx = drag.orig.x + dx;
        let ny = drag.orig.y + dy;
        nx = snap(nx, xCands);
        ny = snap(ny, yCands);
        // Also try snapping the right/bottom edges
        const nxRight = snap(nx + drag.orig.w, xCands) - drag.orig.w;
        if (Math.abs(nxRight - nx) <= SNAP_TOLERANCE && nxRight !== nx) nx = nxRight;
        const nyBottom = snap(ny + drag.orig.h, yCands) - drag.orig.h;
        if (Math.abs(nyBottom - ny) <= SNAP_TOLERANCE && nyBottom !== ny) ny = nyBottom;
        // Constrain
        nx = Math.max(0, Math.min(CANVAS_W - drag.orig.w, nx));
        ny = Math.max(0, ny);
        updateBlock(drag.id, { x: nx, y: ny });
      } else if (drag.mode === 'resize' && drag.handle) {
        const o = drag.orig;
        let nx = o.x, ny = o.y, nw = o.w, nh = o.h;
        const h = drag.handle;
        if (h.includes('e')) nw = snap(o.w + dx, xCands.map((c) => c - o.x));
        if (h.includes('s')) nh = snap(o.h + dy, yCands.map((c) => c - o.y));
        if (h.includes('w')) {
          const newX = snap(o.x + dx, xCands);
          nw = o.w + (o.x - newX);
          nx = newX;
        }
        if (h.includes('n')) {
          const newY = snap(o.y + dy, yCands);
          nh = o.h + (o.y - newY);
          ny = newY;
        }
        // Min size
        if (nw < MIN_W) {
          if (h.includes('w')) nx = o.x + o.w - MIN_W;
          nw = MIN_W;
        }
        if (nh < MIN_H) {
          if (h.includes('n')) ny = o.y + o.h - MIN_H;
          nh = MIN_H;
        }
        // Constrain
        if (nx < 0) { nw += nx; nx = 0; }
        if (ny < 0) { nh += ny; ny = 0; }
        if (nx + nw > CANVAS_W) nw = CANVAS_W - nx;
        updateBlock(drag.id, { x: nx, y: ny, w: nw, h: nh });
      }
    };
    const onUp = () => {
      if (dragRef.current) {
        // Auto-grow canvas height if needed
        setDoc((d) => {
          const maxBottom = d.blocks.reduce((m, b) => Math.max(m, b.y + b.h), 0);
          const newH = Math.max(DEFAULT_H, maxBottom + 200);
          return newH !== d.height ? { ...d, height: newH } : d;
        });
      }
      dragRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [doc.blocks, updateBlock]);

  const startDrag = (id: string, e: React.PointerEvent) => {
    if (editingTextId === id) return;
    const blk = doc.blocks.find((b) => b.id === id);
    if (!blk) return;
    e.stopPropagation();
    setSelectedId(id);
    dragRef.current = {
      mode: 'move', id,
      startX: e.clientX, startY: e.clientY,
      orig: { x: blk.x, y: blk.y, w: blk.w, h: blk.h },
    };
  };

  const startResize = (id: string, handle: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw', e: React.PointerEvent) => {
    const blk = doc.blocks.find((b) => b.id === id);
    if (!blk) return;
    e.stopPropagation();
    setSelectedId(id);
    dragRef.current = {
      mode: 'resize', handle, id,
      startX: e.clientX, startY: e.clientY,
      orig: { x: blk.x, y: blk.y, w: blk.w, h: blk.h },
    };
  };

  // ---------- Save ----------
  const handleSave = async (publish: boolean) => {
    if (!title.trim()) {
      setError('Vyplň nadpis článku.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const { saveBlogPost } = await import('@/app/actions/blog');
      const result = await saveBlogPost({
        id: post?.id,
        title,
        slug,
        cover_image: coverImage || null,
        content: serializeCanvas(doc),
        excerpt: excerpt || null,
        published: publish,
      });
      if (!result.success) {
        setError(result.error || 'Uložení selhalo.');
        return;
      }
      setSuccess(publish ? '✅ Článek publikován!' : '✅ Koncept uložen!');
      setTimeout(() => setSuccess(null), 4000);
      if (result.post && onSaved) onSaved(result.post);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neznámá chyba.');
    } finally {
      setSaving(false);
    }
  };

  // ---------- Render ----------
  return (
    <div className="canvas-editor">
      <div className="canvas-editor-header">
        <h2>{post ? 'Upravit článek' : 'Nový článek'}</h2>
        {onCancel && (
          <button type="button" className="blog-editor-cancel" onClick={onCancel}>← Zpět</button>
        )}
      </div>

      {error && <div className="blog-editor-msg blog-editor-error">{error}</div>}
      {success && <div className="blog-editor-msg blog-editor-success">{success}</div>}

      {/* META FIELDS */}
      <div className="canvas-meta">
        <div className="blog-field">
          <label className="blog-field-label">Nadpis článku</label>
          <input
            type="text" className="blog-field-input"
            value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Jak fotit novorozence v ateliéru…"
          />
        </div>
        <div className="blog-field">
          <label className="blog-field-label">URL adresa (slug)</label>
          <div className="blog-slug-row">
            <span className="blog-slug-prefix">/blog/</span>
            <input
              type="text" className="blog-field-input blog-slug-input"
              value={slug}
              onChange={(e) => { setSlugManual(true); setSlug(toSlug(e.target.value)); }}
              placeholder="jak-fotit-novorozence"
            />
          </div>
        </div>
        <div className="blog-field">
          <label className="blog-field-label">Krátký popisek</label>
          <textarea
            className="blog-field-input blog-field-textarea"
            value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Stručný popis pro náhled na blogu…" rows={2}
          />
        </div>
        <div className="blog-field">
          <label className="blog-field-label">Náhledový obrázek (cover)</label>
          <div className="blog-cover-area">
            {coverImage ? (
              <div className="blog-cover-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="Cover" />
                <button type="button" className="blog-cover-remove" onClick={() => setCoverImage('')}>✕ Odebrat</button>
              </div>
            ) : (
              <div className="blog-cover-upload" onClick={() => coverInputRef.current?.click()}>
                <span className="blog-cover-upload-icon">📷</span>
                <span>{coverUploading ? 'Nahrávám…' : 'Klikni pro nahrání obrázku'}</span>
              </div>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }}
            />
          </div>
        </div>
      </div>

      {/* CANVAS WORKSPACE */}
      <div className="canvas-workspace">
        {/* LEFT SIDEBAR */}
        <aside className="canvas-sidebar">
          <h3 className="canvas-sidebar-title">Přidat blok</h3>
          <button type="button" className="canvas-add-btn" onClick={addText}>
            <span className="canvas-add-icon">📝</span>
            <span>Textové pole</span>
          </button>
          <button type="button" className="canvas-add-btn" onClick={() => imgFileRef.current?.click()} disabled={imgUploading}>
            <span className="canvas-add-icon">🖼️</span>
            <span>{imgUploading ? 'Nahrávám…' : 'Obrázek'}</span>
          </button>
          <input ref={imgFileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) addImageFile(f); e.target.value = ''; }}
          />

          <div className="canvas-sidebar-divider" />

          <div className="canvas-sidebar-info">
            <p><strong>Tipy:</strong></p>
            <ul>
              <li>Tahni blok myší — magnety k mřížce 20 px a hranám ostatních bloků</li>
              <li>Roh / hrana = změna velikosti</li>
              <li>2× klik na text = úprava</li>
              <li>Klávesa <kbd>Delete</kbd> = smazat vybraný blok</li>
              <li>Klávesa <kbd>Esc</kbd> = zrušit výběr</li>
            </ul>
          </div>

          {/* PROPERTIES */}
          {selected && (
            <>
              <div className="canvas-sidebar-divider" />
              <h3 className="canvas-sidebar-title">Vlastnosti</h3>
              <PropertiesPanel
                block={selected}
                onChange={(p) => updateBlock(selected.id, p)}
                onDelete={() => deleteBlock(selected.id)}
                onForward={() => bringForward(selected.id)}
                onBackward={() => sendBackward(selected.id)}
              />
            </>
          )}
        </aside>

        {/* CANVAS */}
        <div className="canvas-scroll">
          <div
            ref={canvasRef}
            className="canvas-stage"
            style={{ width: CANVAS_W, height: doc.height, background: doc.bg }}
            onPointerDown={() => { setSelectedId(null); setEditingTextId(null); }}
          >
            {/* Grid background */}
            <div className="canvas-grid" aria-hidden style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)`,
              backgroundSize: `${GRID}px ${GRID}px`,
            }} />

            {doc.blocks.map((b) => (
              <BlockRenderer
                key={b.id}
                block={b}
                selected={selectedId === b.id}
                editing={editingTextId === b.id}
                onPointerDown={(e) => startDrag(b.id, e)}
                onDoubleClick={() => {
                  if (b.type === 'text') { setSelectedId(b.id); setEditingTextId(b.id); }
                }}
                onResizeStart={(handle, e) => startResize(b.id, handle, e)}
                onTextChange={(text) => updateBlock(b.id, { text } as Partial<CanvasBlock>)}
                onStopEdit={() => setEditingTextId(null)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="blog-editor-actions">
        <button type="button" className="blog-btn blog-btn-secondary"
          onClick={() => handleSave(false)} disabled={saving || !title.trim()}>
          {saving ? '⏳ Ukládám…' : '💾 Uložit koncept'}
        </button>
        <button type="button" className="blog-btn blog-btn-primary"
          onClick={() => handleSave(true)} disabled={saving || !title.trim()}>
          {saving ? '⏳ Ukládám…' : '🚀 Publikovat'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// BLOCK RENDERER
// ============================================================

interface BlockRendererProps {
  block: CanvasBlock;
  selected: boolean;
  editing: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onDoubleClick: () => void;
  onResizeStart: (h: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw', e: React.PointerEvent) => void;
  onTextChange: (t: string) => void;
  onStopEdit: () => void;
}

function BlockRenderer({ block, selected, editing, onPointerDown, onDoubleClick, onResizeStart, onTextChange, onStopEdit }: BlockRendererProps) {
  const style: CSSProperties = {
    position: 'absolute',
    left: block.x, top: block.y, width: block.w, height: block.h, zIndex: block.z,
  };

  const handles: Array<'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'> = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

  return (
    <div
      className={`canvas-block ${selected ? 'is-selected' : ''} ${editing ? 'is-editing' : ''}`}
      style={style}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
    >
      {block.type === 'text' && (
        <TextBlockContent block={block} editing={editing} onTextChange={onTextChange} onStopEdit={onStopEdit} />
      )}
      {block.type === 'image' && (
        <ImageBlockContent block={block} />
      )}

      {selected && handles.map((h) => (
        <div
          key={h}
          className={`canvas-handle canvas-handle-${h}`}
          onPointerDown={(e) => onResizeStart(h, e)}
        />
      ))}
    </div>
  );
}

// ---------- Text block content ----------

function TextBlockContent({ block, editing, onTextChange, onStopEdit }: {
  block: TextBlock; editing: boolean; onTextChange: (t: string) => void; onStopEdit: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      // Place caret at end
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editing]);

  const style: CSSProperties = {
    width: '100%', height: '100%',
    fontSize: block.fontSize,
    color: block.color,
    background: block.bg || 'transparent',
    textAlign: block.align,
    fontFamily: block.fontFamily || 'inherit',
    fontWeight: block.bold ? 700 : 400,
    fontStyle: block.italic ? 'italic' : 'normal',
    textDecoration: block.underline ? 'underline' : 'none',
    lineHeight: block.lineHeight,
    padding: block.padding,
    boxSizing: 'border-box',
    overflow: 'hidden',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    outline: 'none',
    cursor: editing ? 'text' : 'inherit',
  };

  return (
    <div
      ref={ref}
      className="canvas-text-content"
      contentEditable={editing}
      suppressContentEditableWarning
      onBlur={(e) => { onTextChange(e.currentTarget.innerText); onStopEdit(); }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') { (e.currentTarget as HTMLElement).blur(); }
        e.stopPropagation();
      }}
      style={style}
    >
      {block.text}
    </div>
  );
}

// ---------- Image block content ----------

function ImageBlockContent({ block }: { block: ImageBlock }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={block.src}
      alt={block.alt}
      draggable={false}
      style={{
        width: '100%', height: '100%',
        objectFit: block.fit, borderRadius: block.radius,
        userSelect: 'none', pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}

// ============================================================
// PROPERTIES PANEL
// ============================================================

interface PropProps {
  block: CanvasBlock;
  onChange: (p: Partial<CanvasBlock>) => void;
  onDelete: () => void;
  onForward: () => void;
  onBackward: () => void;
}

const FONTS = [
  { label: 'Výchozí', value: '' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'Lora', value: 'Lora, serif' },
  { label: 'Dancing Script', value: '"Dancing Script", cursive' },
  { label: 'Pacifico', value: 'Pacifico, cursive' },
  { label: 'Caveat', value: 'Caveat, cursive' },
  { label: 'Great Vibes', value: '"Great Vibes", cursive' },
  { label: 'Cormorant', value: '"Cormorant Garamond", serif' },
];

const COLORS = ['#3d2b1f', '#c5a47e', '#111111', '#666666', '#ffffff', '#dc2626', '#16a34a', '#2563eb', '#a855f7'];

function PropertiesPanel({ block, onChange, onDelete, onForward, onBackward }: PropProps) {
  return (
    <div className="canvas-props">
      {/* Position & Size */}
      <div className="canvas-props-row">
        <label>X</label>
        <input type="number" value={Math.round(block.x)} onChange={(e) => onChange({ x: Number(e.target.value) } as Partial<CanvasBlock>)} />
        <label>Y</label>
        <input type="number" value={Math.round(block.y)} onChange={(e) => onChange({ y: Number(e.target.value) } as Partial<CanvasBlock>)} />
      </div>
      <div className="canvas-props-row">
        <label>Š</label>
        <input type="number" value={Math.round(block.w)} onChange={(e) => onChange({ w: Math.max(MIN_W, Number(e.target.value)) } as Partial<CanvasBlock>)} />
        <label>V</label>
        <input type="number" value={Math.round(block.h)} onChange={(e) => onChange({ h: Math.max(MIN_H, Number(e.target.value)) } as Partial<CanvasBlock>)} />
      </div>

      {block.type === 'text' && (
        <>
          <div className="canvas-props-section">Text</div>
          <div className="canvas-props-row">
            <label>Font</label>
            <select value={block.fontFamily} onChange={(e) => onChange({ fontFamily: e.target.value } as Partial<CanvasBlock>)}>
              {FONTS.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div className="canvas-props-row">
            <label>Velikost</label>
            <input type="number" min={8} max={120} value={block.fontSize}
              onChange={(e) => onChange({ fontSize: Number(e.target.value) } as Partial<CanvasBlock>)} />
            <label>Řádek</label>
            <input type="number" step={0.1} min={0.8} max={3} value={block.lineHeight}
              onChange={(e) => onChange({ lineHeight: Number(e.target.value) } as Partial<CanvasBlock>)} />
          </div>
          <div className="canvas-props-row">
            <label>Zarovnání</label>
            <div className="canvas-btn-group">
              {(['left', 'center', 'right'] as Align[]).map((a) => (
                <button key={a} type="button"
                  className={block.align === a ? 'is-active' : ''}
                  onClick={() => onChange({ align: a } as Partial<CanvasBlock>)}>
                  {a === 'left' ? '⬅' : a === 'center' ? '⬛' : '➡'}
                </button>
              ))}
            </div>
          </div>
          <div className="canvas-props-row">
            <label>Styl</label>
            <div className="canvas-btn-group">
              <button type="button" className={block.bold ? 'is-active' : ''}
                onClick={() => onChange({ bold: !block.bold } as Partial<CanvasBlock>)}><b>B</b></button>
              <button type="button" className={block.italic ? 'is-active' : ''}
                onClick={() => onChange({ italic: !block.italic } as Partial<CanvasBlock>)}><i>I</i></button>
              <button type="button" className={block.underline ? 'is-active' : ''}
                onClick={() => onChange({ underline: !block.underline } as Partial<CanvasBlock>)}><u>U</u></button>
            </div>
          </div>
          <div className="canvas-props-row">
            <label>Barva</label>
            <div className="canvas-color-grid">
              {COLORS.map((c) => (
                <button key={c} type="button" className={`canvas-swatch ${block.color === c ? 'is-active' : ''}`}
                  style={{ background: c }} onClick={() => onChange({ color: c } as Partial<CanvasBlock>)} title={c} />
              ))}
              <input type="color" value={block.color} onChange={(e) => onChange({ color: e.target.value } as Partial<CanvasBlock>)} />
            </div>
          </div>
          <div className="canvas-props-row">
            <label>Pozadí</label>
            <input type="color" value={block.bg || '#ffffff'} onChange={(e) => onChange({ bg: e.target.value } as Partial<CanvasBlock>)} />
            <button type="button" className="canvas-mini-btn" onClick={() => onChange({ bg: '' } as Partial<CanvasBlock>)}>Průhledné</button>
          </div>
          <div className="canvas-props-row">
            <label>Odsazení</label>
            <input type="number" min={0} max={60} value={block.padding}
              onChange={(e) => onChange({ padding: Number(e.target.value) } as Partial<CanvasBlock>)} />
          </div>
        </>
      )}

      {block.type === 'image' && (
        <>
          <div className="canvas-props-section">Obrázek</div>
          <div className="canvas-props-row">
            <label>Vyplnění</label>
            <div className="canvas-btn-group">
              <button type="button" className={block.fit === 'cover' ? 'is-active' : ''}
                onClick={() => onChange({ fit: 'cover' } as Partial<CanvasBlock>)}>Vyplnit</button>
              <button type="button" className={block.fit === 'contain' ? 'is-active' : ''}
                onClick={() => onChange({ fit: 'contain' } as Partial<CanvasBlock>)}>Vejít</button>
            </div>
          </div>
          <div className="canvas-props-row">
            <label>Zaoblení</label>
            <input type="number" min={0} max={200} value={block.radius}
              onChange={(e) => onChange({ radius: Number(e.target.value) } as Partial<CanvasBlock>)} />
          </div>
          <div className="canvas-props-row">
            <label>Alt text</label>
            <input type="text" value={block.alt} onChange={(e) => onChange({ alt: e.target.value } as Partial<CanvasBlock>)} placeholder="Popis obrázku" />
          </div>
        </>
      )}

      <div className="canvas-props-section">Vrstvy</div>
      <div className="canvas-props-row">
        <button type="button" className="canvas-mini-btn" onClick={onBackward}>↓ Dolů</button>
        <button type="button" className="canvas-mini-btn" onClick={onForward}>↑ Nahoru</button>
      </div>

      <div className="canvas-props-section" />
      <button type="button" className="canvas-delete-btn" onClick={onDelete}>🗑️ Smazat blok</button>
    </div>
  );
}
