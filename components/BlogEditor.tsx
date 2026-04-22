'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import Dropcursor from '@tiptap/extension-dropcursor';
import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type { BlogPost } from '@/app/actions/blog';

// ============================================================
// BLOG EDITOR — Plně přizpůsobitelný rich text editor
//
// Funkce:
//   - Formátování: bold, italic, underline, strikethrough
//   - Nadpisy: H2, H3
//   - Barva textu + zvýraznění (highlight)
//   - Velikost písma: malé / normální / velké / větší / obrovské
//   - Font family: 6 fontů
//   - Zarovnání: vlevo / střed / vpravo
//   - Seznamy: odrážky, číslování
//   - Citace, oddělovač
//   - Obrázky: upload Cloudinary, drag & drop do editoru, resize přes bubble menu
//   - Modální okno pro vložení obrázku (upload / URL)
// ============================================================

interface BlogEditorProps {
  post?: BlogPost | null;
  onSaved?: (post: BlogPost) => void;
  onCancel?: () => void;
}

// ---------- Constants ----------

const FONT_SIZES = [
  { label: 'Malé', value: '0.85rem' },
  { label: 'Normální', value: null as string | null },
  { label: 'Velké', value: '1.25rem' },
  { label: 'Větší', value: '1.5rem' },
  { label: 'Obrovské', value: '2rem' },
];

const FONT_FAMILIES = [
  { label: 'Výchozí', value: '' },
  // Sans-serif
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Raleway', value: 'Raleway, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Open Sans', value: '"Open Sans", sans-serif' },
  { label: 'Oswald', value: 'Oswald, sans-serif' },
  // Serif
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'Lora', value: 'Lora, serif' },
  { label: 'Merriweather', value: 'Merriweather, serif' },
  { label: 'Cormorant', value: '"Cormorant Garamond", serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  // Script / handwriting
  { label: 'Dancing Script', value: '"Dancing Script", cursive' },
  { label: 'Pacifico', value: 'Pacifico, cursive' },
  { label: 'Caveat', value: 'Caveat, cursive' },
  { label: 'Great Vibes', value: '"Great Vibes", cursive' },
  // Mono
  { label: 'Courier', value: '"Courier New", monospace' },
];

const TEXT_COLORS = [
  { label: 'Výchozí', value: '' },
  { label: 'Hnědá', value: '#3d2b1f' },
  { label: 'Zlatá', value: '#c5a47e' },
  { label: 'Černá', value: '#111' },
  { label: 'Šedá', value: '#888' },
  { label: 'Červená', value: '#dc2626' },
  { label: 'Modrá', value: '#2563eb' },
  { label: 'Zelená', value: '#16a34a' },
  { label: 'Fialová', value: '#9333ea' },
  { label: 'Růžová', value: '#ec4899' },
  { label: 'Oranžová', value: '#ea580c' },
  { label: 'Tyrkysová', value: '#0891b2' },
];

const HIGHLIGHT_COLORS = [
  { label: 'Žádné', value: '' },
  { label: 'Žlutá', value: '#fef08a' },
  { label: 'Zelená', value: '#bbf7d0' },
  { label: 'Modrá', value: '#bfdbfe' },
  { label: 'Růžová', value: '#fecdd3' },
  { label: 'Fialová', value: '#e9d5ff' },
  { label: 'Oranžová', value: '#fed7aa' },
  { label: 'Béžová', value: '#f5f0ea' },
];

// ---------- Slug helper ----------

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

// ---------- Dropdown Component ----------

function ToolbarDropdown({ label, children, icon }: { label: string; children: ReactNode; icon?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="blog-tb-dropdown" ref={ref}>
      <button
        type="button"
        className="blog-toolbar-btn blog-tb-dropdown-trigger"
        onClick={() => setOpen(!open)}
        title={label}
      >
        {icon || label} <span className="blog-tb-arrow">▾</span>
      </button>
      {open && (
        <div className="blog-tb-dropdown-menu" onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}

// ---------- Color swatch ----------

function ColorSwatch({ color, active, onClick, label }: { color: string; active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      className={`blog-tb-color-swatch ${active ? 'active' : ''}`}
      style={{ background: color || '#fff', border: !color ? '1.5px dashed #ccc' : undefined }}
      onClick={onClick}
      title={label}
    >
      {!color && '✕'}
    </button>
  );
}

// ---------- Image Insert Modal ----------

function ImageInsertModal({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { uploadBlogImage } = await import('@/app/actions/blog');
      const result = await uploadBlogImage(formData);
      if (result.success && result.url) {
        editor.chain().focus().setImage({ src: result.url }).run();
        onClose();
      } else {
        alert(result.error || 'Nahrání obrázku selhalo.');
      }
    } catch {
      alert('Chyba při nahrávání obrázku.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrl = () => {
    if (url.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
      onClose();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleUpload(file);
  };

  return (
    <div className="blog-img-modal-backdrop" onClick={onClose}>
      <div className="blog-img-modal" onClick={(e) => e.stopPropagation()}>
        <div className="blog-img-modal-header">
          <h3>Vložit obrázek</h3>
          <button type="button" className="blog-img-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="blog-img-modal-tabs">
          <button
            type="button"
            className={`blog-img-modal-tab ${tab === 'upload' ? 'active' : ''}`}
            onClick={() => setTab('upload')}
          >
            📤 Nahrát
          </button>
          <button
            type="button"
            className={`blog-img-modal-tab ${tab === 'url' ? 'active' : ''}`}
            onClick={() => setTab('url')}
          >
            🔗 Z URL
          </button>
        </div>

        {tab === 'upload' ? (
          <div
            className="blog-img-modal-dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <div className="blog-img-modal-uploading">
                <span className="blog-img-spinner" />
                Nahrávám…
              </div>
            ) : (
              <>
                <span className="blog-img-modal-dropicon">📷</span>
                <span>Přetáhněte obrázek sem</span>
                <span className="blog-img-modal-or">nebo</span>
                <span className="blog-img-modal-browse">Vyberte soubor</span>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </div>
        ) : (
          <div className="blog-img-modal-url">
            <input
              type="url"
              className="blog-field-input"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrl()}
            />
            <button
              type="button"
              className="blog-btn blog-btn-primary"
              onClick={handleUrl}
              disabled={!url.trim()}
              style={{ marginTop: '0.8rem' }}
            >
              Vložit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Image Bubble Menu (custom floating toolbar) ----------

function ImageBubble({ editor }: { editor: Editor }) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      if (editor.isActive('image')) {
        // Find the selected image DOM element
        const { node } = editor.state.selection as any;
        if (node?.type?.name === 'image') {
          const domNode = editor.view.nodeDOM(editor.state.selection.from) as HTMLElement | null;
          if (domNode) {
            const imgEl = domNode.tagName === 'IMG' ? domNode : domNode.querySelector('img');
            if (imgEl) {
              const rect = imgEl.getBoundingClientRect();
              const editorRect = editor.view.dom.closest('.blog-editor-wrap')?.getBoundingClientRect();
              if (editorRect) {
                setPosition({
                  top: rect.top - editorRect.top - 44,
                  left: rect.left - editorRect.left + rect.width / 2,
                });
                return;
              }
            }
          }
        }
      }
      setPosition(null);
    };

    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);

  if (!position) return null;

  const setWidth = (w: string) => {
    editor.chain().focus().updateAttributes('image', { style: `width: ${w}; height: auto;` }).run();
  };

  return (
    <div
      ref={ref}
      className="blog-bubble-menu"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 50,
      }}
    >
      <button type="button" onClick={() => setWidth('25%')} title="25%">S</button>
      <button type="button" onClick={() => setWidth('50%')} title="50%">M</button>
      <button type="button" onClick={() => setWidth('75%')} title="75%">L</button>
      <button type="button" onClick={() => setWidth('100%')} title="100%">XL</button>
      <span className="blog-bubble-divider" />
      <button
        type="button"
        onClick={() => {
          if (confirm('Smazat obrázek?')) {
            editor.chain().focus().deleteSelection().run();
          }
        }}
        title="Smazat"
        className="blog-bubble-danger"
      >
        🗑️
      </button>
    </div>
  );
}

// ---------- Toolbar ----------

function Toolbar({ editor, onImageInsert }: { editor: Editor | null; onImageInsert: () => void }) {
  if (!editor) return null;

  const btn = (
    active: boolean,
    onClick: () => void,
    label: string,
    title: string,
  ) => (
    <button
      type="button"
      className={`blog-toolbar-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      title={title}
    >
      {label}
    </button>
  );

  // Current states
  const currentFontSize = editor.getAttributes('textStyle').fontSize || null;
  const currentSizeLabel = FONT_SIZES.find(s => s.value === currentFontSize)?.label || 'Velikost';
  const currentFont = editor.getAttributes('textStyle').fontFamily || '';
  const currentFontLabel = FONT_FAMILIES.find(f => f.value === currentFont)?.label || 'Font';
  const currentColor = editor.getAttributes('textStyle').color || '';

  return (
    <div className="blog-toolbar">
      {/* Row 1 — text formatting + font controls */}
      <div className="blog-toolbar-row">
        <div className="blog-toolbar-group">
          {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'B', 'Tučné (Ctrl+B)')}
          {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'I', 'Kurzíva (Ctrl+I)')}
          {btn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), 'U', 'Podtržení (Ctrl+U)')}
          {btn(editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), 'S̶', 'Přeškrtnutí')}
        </div>

        <div className="blog-toolbar-divider" />

        <div className="blog-toolbar-group">
          {btn(
            editor.isActive('heading', { level: 2 }),
            () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            'H2', 'Nadpis 2',
          )}
          {btn(
            editor.isActive('heading', { level: 3 }),
            () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            'H3', 'Nadpis 3',
          )}
        </div>

        <div className="blog-toolbar-divider" />

        {/* Font size dropdown */}
        <ToolbarDropdown label={currentSizeLabel} icon={`↕ ${currentSizeLabel}`}>
          {FONT_SIZES.map(s => (
            <button
              key={s.label}
              type="button"
              className={`blog-tb-dropdown-item ${(s.value === currentFontSize) ? 'active' : ''}`}
              style={s.value ? { fontSize: s.value } : undefined}
              onClick={() => {
                if (s.value) {
                  (editor.commands as any).setFontSize(s.value);
                } else {
                  (editor.commands as any).unsetFontSize();
                }
              }}
            >
              {s.label}
            </button>
          ))}
        </ToolbarDropdown>

        {/* Font family dropdown */}
        <ToolbarDropdown label={currentFontLabel} icon={`🔤 ${currentFontLabel}`}>
          {FONT_FAMILIES.map(f => (
            <button
              key={f.label}
              type="button"
              className={`blog-tb-dropdown-item ${currentFont === f.value ? 'active' : ''}`}
              style={f.value ? { fontFamily: f.value } : undefined}
              onClick={() => {
                if (f.value) {
                  editor.chain().focus().setFontFamily(f.value).run();
                } else {
                  editor.chain().focus().unsetFontFamily().run();
                }
              }}
            >
              {f.label}
            </button>
          ))}
        </ToolbarDropdown>
      </div>

      {/* Row 2 — colors, alignment, lists, image */}
      <div className="blog-toolbar-row">
        {/* Text color + highlight dropdown */}
        <ToolbarDropdown label="Barva" icon="🎨 Barva">
          <div className="blog-tb-color-label">Barva textu</div>
          <div className="blog-tb-color-grid">
            {TEXT_COLORS.map(c => (
              <ColorSwatch
                key={c.label}
                color={c.value}
                active={currentColor === c.value || (!c.value && !currentColor)}
                onClick={() => {
                  if (c.value) {
                    editor.chain().focus().setColor(c.value).run();
                  } else {
                    editor.chain().focus().unsetColor().run();
                  }
                }}
                label={c.label}
              />
            ))}
          </div>
          <div className="blog-tb-color-label" style={{ marginTop: '0.6rem' }}>Zvýraznění</div>
          <div className="blog-tb-color-grid">
            {HIGHLIGHT_COLORS.map(c => (
              <ColorSwatch
                key={c.label}
                color={c.value}
                active={false}
                onClick={() => {
                  if (c.value) {
                    editor.chain().focus().toggleHighlight({ color: c.value }).run();
                  } else {
                    editor.chain().focus().unsetHighlight().run();
                  }
                }}
                label={c.label}
              />
            ))}
          </div>
        </ToolbarDropdown>

        <div className="blog-toolbar-divider" />

        {/* Alignment */}
        <div className="blog-toolbar-group">
          {btn(
            editor.isActive({ textAlign: 'left' }),
            () => editor.chain().focus().setTextAlign('left').run(),
            '⫷', 'Zarovnat vlevo',
          )}
          {btn(
            editor.isActive({ textAlign: 'center' }),
            () => editor.chain().focus().setTextAlign('center').run(),
            '⫿', 'Zarovnat na střed',
          )}
          {btn(
            editor.isActive({ textAlign: 'right' }),
            () => editor.chain().focus().setTextAlign('right').run(),
            '⫸', 'Zarovnat vpravo',
          )}
        </div>

        <div className="blog-toolbar-divider" />

        {/* Lists */}
        <div className="blog-toolbar-group">
          {btn(
            editor.isActive('bulletList'),
            () => editor.chain().focus().toggleBulletList().run(),
            '• —', 'Odrážky',
          )}
          {btn(
            editor.isActive('orderedList'),
            () => editor.chain().focus().toggleOrderedList().run(),
            '1.', 'Číslování',
          )}
        </div>

        <div className="blog-toolbar-divider" />

        {/* Quote + divider */}
        <div className="blog-toolbar-group">
          {btn(
            editor.isActive('blockquote'),
            () => editor.chain().focus().toggleBlockquote().run(),
            '„"', 'Citace',
          )}
          {btn(false, () => editor.chain().focus().setHorizontalRule().run(), '—', 'Oddělovač')}
        </div>

        <div className="blog-toolbar-divider" />

        {/* Image button */}
        <div className="blog-toolbar-group">
          <button
            type="button"
            className="blog-toolbar-btn blog-toolbar-img-btn"
            onClick={onImageInsert}
            title="Vložit obrázek"
          >
            🖼️ Obrázek
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Editor Component ----------

export function BlogEditor({ post, onSaved, onCancel }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [slugManual, setSlugManual] = useState(!!post?.slug);
  const [coverImage, setCoverImage] = useState(post?.cover_image || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        dropcursor: false,
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: 'blog-content-img' },
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: 'Začněte psát článek… Formátujte text, přidávejte obrázky, měňte fonty a barvy.',
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize,
      Dropcursor.configure({
        color: '#c5a47e',
        width: 3,
      }),
    ],
    content: post?.content || '',
    editorProps: {
      attributes: {
        class: 'blog-editor-content',
      },
      // Drag & drop images from desktop directly into editor
      handleDrop(view, event, _slice, moved) {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            const formData = new FormData();
            formData.append('file', file);
            import('@/app/actions/blog').then(({ uploadBlogImage }) => {
              uploadBlogImage(formData).then((result) => {
                if (result.success && result.url) {
                  const { schema } = view.state;
                  const node = schema.nodes.image.create({ src: result.url });
                  const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
                  if (coords) {
                    const tr = view.state.tr.insert(coords.pos, node);
                    view.dispatch(tr);
                  }
                }
              });
            });
            return true;
          }
        }
        return false;
      },
      // Paste images from clipboard
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('image/')) {
            event.preventDefault();
            const file = items[i].getAsFile();
            if (!file) return false;
            const formData = new FormData();
            formData.append('file', file);
            import('@/app/actions/blog').then(({ uploadBlogImage }) => {
              uploadBlogImage(formData).then((result) => {
                if (result.success && result.url) {
                  const { schema } = view.state;
                  const node = schema.nodes.image.create({ src: result.url });
                  const tr = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(tr);
                }
              });
            });
            return true;
          }
        }
        return false;
      },
    },
  });

  // Auto-slug from title
  useEffect(() => {
    if (!slugManual && title) {
      setSlug(toSlug(title));
    }
  }, [title, slugManual]);

  // Cover image upload
  const handleCoverUpload = useCallback(async (file: File) => {
    setCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { uploadBlogImage } = await import('@/app/actions/blog');
      const result = await uploadBlogImage(formData);
      if (result.success && result.url) {
        setCoverImage(result.url);
      } else {
        setError(result.error || 'Nahrání obrázku selhalo.');
      }
    } catch {
      setError('Chyba při nahrávání cover obrázku.');
    } finally {
      setCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  }, []);

  // Save
  const handleSave = async (publish: boolean) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const htmlContent = editor?.getHTML() || '';
      const { saveBlogPost } = await import('@/app/actions/blog');
      const result = await saveBlogPost({
        id: post?.id,
        title,
        slug,
        cover_image: coverImage || null,
        content: htmlContent,
        excerpt: excerpt || null,
        published: publish,
      });

      if (!result.success) {
        setError(result.error || 'Uložení selhalo.');
        return;
      }

      setSuccess(publish ? '✅ Článek publikován!' : '✅ Koncept uložen!');
      setTimeout(() => setSuccess(null), 4000);

      if (result.post && onSaved) {
        onSaved(result.post);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neznámá chyba.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="blog-editor">
      <div className="blog-editor-header">
        <h2>{post ? 'Upravit článek' : 'Nový článek'}</h2>
        {onCancel && (
          <button type="button" className="blog-editor-cancel" onClick={onCancel}>
            ← Zpět
          </button>
        )}
      </div>

      {/* Status */}
      {error && <div className="blog-editor-msg blog-editor-error">{error}</div>}
      {success && <div className="blog-editor-msg blog-editor-success">{success}</div>}

      {/* Title */}
      <div className="blog-field">
        <label className="blog-field-label" htmlFor="blog-title">Nadpis článku</label>
        <input
          id="blog-title"
          type="text"
          className="blog-field-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Jak fotit novorozence v ateliéru…"
        />
      </div>

      {/* Slug */}
      <div className="blog-field">
        <label className="blog-field-label" htmlFor="blog-slug">
          URL adresa (slug)
          {!slugManual && <span className="blog-field-hint"> — generuje se automaticky</span>}
        </label>
        <div className="blog-slug-row">
          <span className="blog-slug-prefix">/blog/</span>
          <input
            id="blog-slug"
            type="text"
            className="blog-field-input blog-slug-input"
            value={slug}
            onChange={(e) => {
              setSlugManual(true);
              setSlug(toSlug(e.target.value));
            }}
            placeholder="jak-fotit-novorozence"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div className="blog-field">
        <label className="blog-field-label" htmlFor="blog-excerpt">Krátký popisek (excerpt)</label>
        <textarea
          id="blog-excerpt"
          className="blog-field-input blog-field-textarea"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Stručný popis článku pro náhled na blogu…"
          rows={2}
        />
      </div>

      {/* Cover Image */}
      <div className="blog-field">
        <label className="blog-field-label">Náhledový obrázek</label>
        <div className="blog-cover-area">
          {coverImage ? (
            <div className="blog-cover-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="Cover" />
              <button
                type="button"
                className="blog-cover-remove"
                onClick={() => setCoverImage('')}
              >
                ✕ Odebrat
              </button>
            </div>
          ) : (
            <div
              className="blog-cover-upload"
              onClick={() => coverInputRef.current?.click()}
            >
              <span className="blog-cover-upload-icon">📷</span>
              <span>{coverUploading ? 'Nahrávám…' : 'Klikněte pro nahrání obrázku'}</span>
            </div>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCoverUpload(file);
            }}
          />
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="blog-field">
        <label className="blog-field-label">Obsah článku</label>
        <div className="blog-editor-wrap">
          <Toolbar editor={editor} onImageInsert={() => setShowImageModal(true)} />
          {editor && <ImageBubble editor={editor} />}
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Image Insert Modal */}
      {showImageModal && editor && (
        <ImageInsertModal editor={editor} onClose={() => setShowImageModal(false)} />
      )}

      {/* Actions */}
      <div className="blog-editor-actions">
        <button
          type="button"
          className="blog-btn blog-btn-secondary"
          onClick={() => handleSave(false)}
          disabled={saving || !title.trim()}
        >
          {saving ? '⏳ Ukládám…' : '💾 Uložit koncept'}
        </button>
        <button
          type="button"
          className="blog-btn blog-btn-primary"
          onClick={() => handleSave(true)}
          disabled={saving || !title.trim()}
        >
          {saving ? '⏳ Ukládám…' : '🚀 Publikovat'}
        </button>
      </div>
    </div>
  );
}
