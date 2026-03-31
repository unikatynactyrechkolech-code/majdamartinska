'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useCallback, useRef, useEffect } from 'react';
import type { BlogPost } from '@/app/actions/blog';

// ============================================================
// BLOG EDITOR — TipTap rich text editor + formulář pro články
//
// Použití:
//   <BlogEditor />                  — nový článek
//   <BlogEditor post={existingPost} /> — editace
// ============================================================

interface BlogEditorProps {
  post?: BlogPost | null;
  onSaved?: (post: BlogPost) => void;
  onCancel?: () => void;
}

// ---------- Slug helper ----------

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')    // remove diacritics
    .replace(/[^a-z0-9]+/g, '-')        // non-alphanum → dash
    .replace(/^-+|-+$/g, '')            // trim dashes
    .substring(0, 80);
}

// ---------- Toolbar ----------

function Toolbar({ editor }: { editor: Editor | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!editor) return null;

  const btn = (
    active: boolean,
    onClick: () => void,
    label: string,
    title: string,
    disabled = false,
  ) => (
    <button
      type="button"
      className={`blog-toolbar-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {label}
    </button>
  );

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { uploadBlogImage } = await import('@/app/actions/blog');
      const result = await uploadBlogImage(formData);

      if (result.success && result.url) {
        editor.chain().focus().setImage({ src: result.url }).run();
      } else {
        alert(result.error || 'Nahrání obrázku selhalo.');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Chyba při nahrávání obrázku.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="blog-toolbar">
      <div className="blog-toolbar-group">
        {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'B', 'Tučné')}
        {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'I', 'Kurzíva')}
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

      <div className="blog-toolbar-group">
        <button
          type="button"
          className="blog-toolbar-btn blog-toolbar-img-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Vložit obrázek"
          disabled={uploading}
        >
          {uploading ? '⏳' : '🖼️'} Obrázek
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
        />
      </div>

      <div className="blog-toolbar-divider" />

      <div className="blog-toolbar-group">
        {btn(
          editor.isActive('blockquote'),
          () => editor.chain().focus().toggleBlockquote().run(),
          '„"', 'Citace',
        )}
        {btn(false, () => editor.chain().focus().setHorizontalRule().run(), '—', 'Oddělovač')}
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
  const coverInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: 'blog-content-img' },
      }),
      Placeholder.configure({
        placeholder: 'Začněte psát článek…',
      }),
    ],
    content: post?.content || '',
    editorProps: {
      attributes: {
        class: 'blog-editor-content',
      },
    },
  });

  // Auto-slug from title (until user manually edits slug)
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
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>

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
