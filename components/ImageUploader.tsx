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
  /** Povolí nahrávání více souborů najednou */
  multiple?: boolean;
}

export function ImageUploader({
  sectionId,
  currentUrl,
  cloudinaryPublicId,
  onUploadComplete,
  onDeleteComplete,
  label,
  compact = false,
  // Defaultně povolit nahrávání více fotek najednou — funguje to všude,
  // kde to dává smysl (galerie). Single-slot komponenty (EditableImage,
  // edit modal) stejně použijí jen první soubor díky callbacku.
  multiple = true,
}: ImageUploaderProps) {
  const { isAdmin } = useAdmin();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) return null;

  // ---- Upload single file ----
  const handleFileUpload = async (file: File, overrideSectionId?: string) => {
    const targetSectionId = overrideSectionId || sectionId;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sectionId', targetSectionId);

      const { uploadImage } = await import('@/app/actions/images');
      const result = await uploadImage(formData);

      if (!result.success) {
        setError(result.error || 'Nahrávání selhalo.');
        return;
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
      throw err;
    }
  };

  // ---- Upload one or more files ----
  const handleFilesUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);
    setUploadProgress(null);

    try {
      if (fileArray.length === 1) {
        await handleFileUpload(fileArray[0]);
        setSuccessMsg('✅ Obrázek úspěšně nahrán!');
      } else {
        let uploaded = 0;
        for (let i = 0; i < fileArray.length; i++) {
          const derivedId = i === 0 ? sectionId : `${sectionId}_${Date.now()}_${i}`;
          setUploadProgress(`Nahrávám ${i + 1} / ${fileArray.length}…`);
          await handleFileUpload(fileArray[i], derivedId);
          uploaded++;
        }
        setSuccessMsg(`✅ Nahráno ${uploaded} obrázků!`);
        setUploadProgress(null);
      }
      setTimeout(() => { setSuccessMsg(null); setUploadProgress(null); }, 3000);
    } catch {
      // error already set in handleFileUpload
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFilesUpload(files);
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
      const files = e.dataTransfer.files;
      const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
      if (validFiles.length > 0) {
        handleFilesUpload(validFiles);
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
            <span>{uploadProgress || 'Nahrávám…'}</span>
          </div>
        ) : (
          <>
            <span className="cms-uploader-dropzone-icon">⬆️</span>
            <span className="cms-uploader-dropzone-text">
              {currentUrl ? 'Nahradit obrázek' : (multiple ? 'Nahrát fotografie' : 'Nahrát obrázek')}
              <br />
              <small>{multiple ? 'Přetáhněte nebo klikněte · lze vybrat více najednou' : 'Přetáhněte sem nebo klikněte'}</small>
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
          multiple={multiple}
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
