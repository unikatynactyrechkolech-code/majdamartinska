'use client';

import { useCallback, useState, useRef } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

// ============================================================
// UNIVERZÁLNÍ IMAGE UPLOADER
//
// Použití:
//
// 1) Pro page_images tabulku (section_id režim – zpětně kompatibilní):
//    <ImageUploader sectionId="home.hero.img" currentUrl={url} />
//
// 2) Pro libovolnou tabulku (univerzální režim):
//    <ImageUploader
//      tableName="reviews"
//      rowId="42"
//      columnName="avatar_url"
//      currentUrl={url}
//    />
//
// Props:
//   currentUrl       – aktuální URL obrázku (pokud existuje)
//   cloudinaryPublicId – public_id pro mazání z Cloudinary
//   onUploadComplete – callback po úspěšném uploadu ({imageUrl, publicId})
//   onDeleteComplete – callback po úspěšném smazání
//   sectionId        – shorthand pro page_images tabulku
//   tableName        – cílová tabulka v Supabase
//   rowId            – ID řádku
//   columnName       – název sloupce pro URL
//   label            – popisek zobrazený v modalu
//   compact          – kompaktní režim (menší UI)
// ============================================================

interface ImageUploaderProps {
  /** Aktuální URL obrázku (pokud existuje) */
  currentUrl?: string | null;
  /** Cloudinary public_id aktuálního obrázku (pro mazání) */
  cloudinaryPublicId?: string | null;
  /** Callback po úspěšném uploadu */
  onUploadComplete?: (data: { imageUrl: string; publicId: string; width: number; height: number }) => void;
  /** Callback po úspěšném smazání */
  onDeleteComplete?: () => void;

  // --- page_images režim (shorthand) ---
  /** section_id pro page_images tabulku */
  sectionId?: string;

  // --- univerzální režim ---
  /** Název tabulky v Supabase */
  tableName?: string;
  /** ID řádku v tabulce */
  rowId?: string;
  /** Název sloupce kam se uloží URL */
  columnName?: string;

  /** Popisek v modalu */
  label?: string;
  /** Kompaktní režim */
  compact?: boolean;
}

export function ImageUploader({
  currentUrl,
  cloudinaryPublicId,
  onUploadComplete,
  onDeleteComplete,
  sectionId,
  tableName,
  rowId,
  columnName,
  label,
  compact = false,
}: ImageUploaderProps) {
  const { isAdmin } = useAdmin();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resolve target params
  const resolvedTable = tableName || 'page_images';
  const resolvedRowId = rowId || sectionId || '';
  const resolvedColumn = columnName || 'image_url';

  if (!isAdmin) return null;

  // ---- Upload ----
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('table_name', resolvedTable);
      formData.append('row_id', resolvedRowId);
      formData.append('column_name', resolvedColumn);

      // Zpětná kompatibilita
      if (sectionId) {
        formData.append('sectionId', sectionId);
      }

      const { uploadImage } = await import('@/app/actions/images');
      const result = await uploadImage(formData);

      if (!result.success) {
        setError(result.error || 'Nahrávání selhalo.');
        return;
      }

      if (result.error) {
        // Partial success (uploaded but DB failed)
        setError(result.error);
      } else {
        setSuccessMsg('✅ Obrázek úspěšně nahrán!');
        setTimeout(() => setSuccessMsg(null), 3000);
      }

      if (result.imageUrl && result.publicId && onUploadComplete) {
        onUploadComplete({
          imageUrl: result.imageUrl,
          publicId: result.publicId,
          width: result.width || 0,
          height: result.height || 0,
        });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Neznámá chyba.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  // ---- Drag & Drop ----
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        handleFileUpload(file);
      } else {
        setError('Přetáhněte obrázek (JPG, PNG, WebP, GIF).');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolvedTable, resolvedRowId, resolvedColumn, sectionId]
  );

  // ---- Delete ----
  const handleDelete = async () => {
    const confirmed = window.confirm('Opravdu smazat tento obrázek?');
    if (!confirmed) return;

    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { deleteImage } = await import('@/app/actions/images');

      if (resolvedTable === 'page_images' && sectionId) {
        // Zpětná kompatibilita — starý string formát
        const result = await deleteImage(sectionId);
        if (!result.success) {
          setError(result.error || 'Mazání selhalo.');
          return;
        }
      } else {
        const result = await deleteImage({
          cloudinaryPublicId: cloudinaryPublicId || undefined,
          tableName: resolvedTable,
          rowId: resolvedRowId,
          columnName: resolvedColumn,
        });
        if (!result.success) {
          setError(result.error || 'Mazání selhalo.');
          return;
        }
      }

      setSuccessMsg('✅ Obrázek smazán.');
      setTimeout(() => setSuccessMsg(null), 3000);
      onDeleteComplete?.();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Neznámá chyba.');
    } finally {
      setIsUploading(false);
    }
  };

  // ---- Render ----
  const displayLabel = label || sectionId || `${resolvedTable}.${resolvedRowId}.${resolvedColumn}`;

  return (
    <div className={`cms-uploader ${compact ? 'cms-uploader-compact' : ''}`}>
      {/* Header */}
      <div className="cms-uploader-header">
        <span className="cms-uploader-label">📷 {displayLabel}</span>
        {currentUrl && (
          <span className="cms-uploader-badge">☁️ Cloudinary</span>
        )}
      </div>

      {/* Preview */}
      {currentUrl && (
        <div className="cms-uploader-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentUrl} alt="Náhled" className="cms-uploader-preview-img" />
        </div>
      )}

      {/* Dropzone */}
      <div
        className={`cms-uploader-dropzone ${isDragging ? 'cms-uploader-dropzone-active' : ''} ${isUploading ? 'cms-uploader-dropzone-uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="cms-uploader-loading">
            <span className="cms-uploader-spinner" />
            <span>Nahrávám…</span>
          </div>
        ) : (
          <>
            <span className="cms-uploader-dropzone-icon">⬆️</span>
            <span className="cms-uploader-dropzone-text">
              {currentUrl ? 'Nahradit obrázek' : 'Nahrát obrázek'}
              <br />
              <small>Přetáhněte sem nebo klikněte</small>
            </span>
            <span className="cms-uploader-dropzone-hint">
              JPG, PNG, WebP, GIF · max 10 MB
            </span>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* Messages */}
      {error && <div className="cms-uploader-error">❌ {error}</div>}
      {successMsg && <div className="cms-uploader-success">{successMsg}</div>}

      {/* Delete button */}
      {currentUrl && (
        <button
          className="cms-uploader-btn-delete"
          onClick={handleDelete}
          disabled={isUploading}
        >
          🗑️ Smazat obrázek
        </button>
      )}
    </div>
  );
}
