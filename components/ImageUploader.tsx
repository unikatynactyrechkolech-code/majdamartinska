'use client';

import { useCallback, useState, useRef } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

// ============================================================
// IMAGE UPLOADER
// Upload obrázků do Cloudinary + uložení URL do page_content
//
// Použití:
//   <ImageUploader sectionId="home.hero.img" currentUrl={url} />
// ============================================================

interface ImageUploaderProps {
  /** section_id v tabulce page_content */
  sectionId: string;
  /** Aktuální URL obrázku (pokud existuje) */
  currentUrl?: string | null;
  /** Cloudinary public_id aktuálního obrázku (pro mazání) */
  cloudinaryPublicId?: string | null;
  /** Callback po úspěšném uploadu */
  onUploadComplete?: (data: { imageUrl: string; publicId: string; width: number; height: number }) => void;
  /** Callback po úspěšném smazání */
  onDeleteComplete?: () => void;
  /** Popisek v modalu */
  label?: string;
  /** Kompaktní režim */
  compact?: boolean;
}

export function ImageUploader({
  sectionId,
  currentUrl,
  cloudinaryPublicId,
  onUploadComplete,
  onDeleteComplete,
  label,
  compact = false,
}: ImageUploaderProps) {
  const { isAdmin } = useAdmin();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) return null;

  // ---- Upload ----
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sectionId', sectionId);

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
    [sectionId]
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
      const result = await deleteImage(sectionId);
      if (!result.success) {
        setError(result.error || 'Mazání selhalo.');
        return;
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
  const displayLabel = label || sectionId;

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
