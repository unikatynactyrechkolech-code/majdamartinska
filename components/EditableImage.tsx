'use client';

import Image, { type ImageProps } from 'next/image';
import { useAdmin } from '@/contexts/AdminContext';
import { useCallback, useState, useRef, useEffect } from 'react';

interface EditableImageProps extends Omit<ImageProps, 'onClick'> {
  /** Unique identifier for this image, e.g. "home.promise.img" */
  sectionId: string;
}

export function EditableImage({
  sectionId,
  className = '',
  style,
  src: defaultSrc,
  alt: defaultAlt,
  ...props
}: EditableImageProps) {
  const { isAdmin } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Track the current image URL from DB (null = use default prop)
  const [dbImageUrl, setDbImageUrl] = useState<string | null>(null);
  const [dbLoaded, setDbLoaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing image from DB on mount
  useEffect(() => {
    let cancelled = false;
    async function loadImage() {
      try {
        const { getImage } = await import('@/app/actions/images');
        const record = await getImage(sectionId);
        if (!cancelled && record) {
          setDbImageUrl(record.image_url);
        }
      } catch (err) {
        console.error('Failed to load image:', err);
      } finally {
        if (!cancelled) setDbLoaded(true);
      }
    }
    loadImage();
    return () => { cancelled = true; };
  }, [sectionId]);

  const currentSrc = dbImageUrl || defaultSrc;

  const handleClick = useCallback(() => {
    if (!isAdmin) return;
    setIsModalOpen(true);
    setUploadError(null);
  }, [isAdmin]);

  const closeModal = useCallback(() => {
    if (isUploading) return; // prevent closing during upload
    setIsModalOpen(false);
    setUploadError(null);
  }, [isUploading]);

  // Handle file selection (from input or drag&drop)
  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sectionId', sectionId);

        const { uploadImage } = await import('@/app/actions/images');
        const result = await uploadImage(formData);

        if (!result.success) {
          setUploadError(result.error || 'Nahrávání selhalo.');
          return;
        }

        // Update the displayed image
        if (result.imageUrl) {
          setDbImageUrl(result.imageUrl);
        }

        // Show warning if DB failed but upload succeeded
        if (result.error) {
          setUploadError(result.error);
          return;
        }

        // Success — close modal
        setIsModalOpen(false);
      } catch (err) {
        console.error('Upload error:', err);
        setUploadError(err instanceof Error ? err.message : 'Neznámá chyba.');
      } finally {
        setIsUploading(false);
      }
    },
    [sectionId]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  // Drag & drop handlers
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
        setUploadError('Přetáhněte obrázek (JPG, PNG, WebP, GIF).');
      }
    },
    [handleFileUpload]
  );

  // Delete current image and revert to default
  const handleDelete = useCallback(async () => {
    if (!dbImageUrl) return;

    const confirmed = window.confirm('Opravdu chcete smazat tento obrázek? Vrátí se výchozí.');
    if (!confirmed) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const { deleteImage } = await import('@/app/actions/images');
      const result = await deleteImage(sectionId);

      if (!result.success) {
        setUploadError(result.error || 'Mazání selhalo.');
        return;
      }

      setDbImageUrl(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Delete error:', err);
      setUploadError(err instanceof Error ? err.message : 'Neznámá chyba.');
    } finally {
      setIsUploading(false);
    }
  }, [dbImageUrl, sectionId]);

  return (
    <>
      <div
        className={`${isAdmin ? 'cms-editable-image' : ''}`}
        style={{ position: 'relative', cursor: isAdmin ? 'pointer' : undefined }}
        onClick={handleClick}
      >
        <Image
          className={className}
          style={style}
          src={currentSrc}
          alt={defaultAlt}
          {...props}
        />
        {isAdmin && (
          <div className="cms-image-overlay">
            <span className="cms-image-overlay-icon">📷</span>
            <span className="cms-image-overlay-text">
              {dbImageUrl ? 'Klikněte pro změnu / smazání' : 'Klikněte pro nahrání'}
            </span>
          </div>
        )}
      </div>

      {/* Upload modal */}
      {isModalOpen && (
        <div className="cms-img-modal-backdrop" onClick={closeModal}>
          <div className="cms-img-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="cms-img-modal-close"
              onClick={closeModal}
              disabled={isUploading}
            >
              ✕
            </button>

            <h3 className="cms-img-modal-title">
              📷 Správa obrázku
            </h3>
            <p className="cms-img-modal-section">
              Sekce: <code>{sectionId}</code>
            </p>

            {/* Current image preview */}
            <div className="cms-img-preview-wrap">
              <p className="cms-img-preview-label">Aktuální obrázek:</p>
              <div className="cms-img-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={typeof currentSrc === 'string' ? currentSrc : ''}
                  alt="Náhled"
                  className="cms-img-preview-img"
                />
              </div>
              {dbImageUrl && (
                <span className="cms-img-badge cms-img-badge-cloud">☁️ Cloudinary</span>
              )}
              {!dbImageUrl && (
                <span className="cms-img-badge cms-img-badge-default">📌 Výchozí</span>
              )}
            </div>

            {/* Drop zone */}
            <div
              className={`cms-img-dropzone ${isDragging ? 'cms-img-dropzone-active' : ''} ${isUploading ? 'cms-img-dropzone-uploading' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="cms-img-uploading">
                  <span className="cms-img-spinner" />
                  <span>Nahrávám…</span>
                </div>
              ) : (
                <>
                  <span className="cms-img-dropzone-icon">⬆️</span>
                  <span className="cms-img-dropzone-text">
                    Přetáhněte obrázek sem<br />
                    <small>nebo klikněte pro výběr</small>
                  </span>
                  <span className="cms-img-dropzone-hint">
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

            {/* Error message */}
            {uploadError && (
              <div className="cms-img-error">
                ❌ {uploadError}
              </div>
            )}

            {/* Actions */}
            <div className="cms-img-modal-actions">
              {dbImageUrl && (
                <button
                  className="cms-img-btn-delete"
                  onClick={handleDelete}
                  disabled={isUploading}
                >
                  🗑️ Smazat obrázek
                </button>
              )}
              <button
                className="cms-img-btn-cancel"
                onClick={closeModal}
                disabled={isUploading}
              >
                Zavřít
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
