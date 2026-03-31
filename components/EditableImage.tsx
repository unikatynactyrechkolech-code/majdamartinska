'use client';

import Image, { type ImageProps } from 'next/image';
import { createPortal } from 'react-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { ImageUploader } from '@/components/ImageUploader';
import { useCallback, useState } from 'react';

interface EditableImageProps extends Omit<ImageProps, 'onClick'> {
  /** Unique identifier for this image, e.g. "home.promise.img" */
  sectionId: string;
  /** Optional: hide the overlay text (useful for small images like avatars) */
  overlayCompact?: boolean;
}

export function EditableImage({
  sectionId,
  className = '',
  style,
  src: defaultSrc,
  alt: defaultAlt,
  overlayCompact = false,
  fill,
  ...props
}: EditableImageProps) {
  const { isAdmin, images, setImage } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Read image from context (loaded in bulk by AdminContext — no individual fetch)
  const entry = images[sectionId];
  const currentSrc = entry?.url || defaultSrc;
  const currentPublicId = entry?.publicId || null;

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  }, [isAdmin]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setUploadSuccess(false);
  }, []);

  // For fill images, we need the wrapper to also be position:relative
  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    cursor: isAdmin ? 'pointer' : undefined,
    ...(fill ? { width: '100%', height: '100%' } : {}),
  };

  return (
    <>
      <div
        className={`${isAdmin ? 'cms-editable-image' : ''}`}
        style={wrapperStyle}
        onDoubleClick={handleDoubleClick}
      >
        <Image
          className={className}
          style={style}
          src={currentSrc}
          alt={defaultAlt}
          fill={fill}
          {...props}
        />
        {isAdmin && (
          <div className={`cms-image-overlay ${overlayCompact ? 'cms-image-overlay-compact' : ''}`}>
            <span className="cms-image-overlay-icon">📷</span>
            {!overlayCompact && (
              <span className="cms-image-overlay-text">
                {entry ? '2× klik pro změnu' : '2× klik pro nahrání'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Upload modal — rendered via Portal into body to escape overflow:hidden */}
      {isModalOpen && createPortal(
        <div className="cms-img-modal-backdrop" onClick={closeModal}>
          <div className="cms-img-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cms-img-modal-close" onClick={closeModal}>✕</button>

            <h3 className="cms-img-modal-title">📷 Správa obrázku</h3>
            <p className="cms-img-modal-section">
              Sekce: <code>{sectionId}</code>
            </p>

            <ImageUploader
              sectionId={sectionId}
              currentUrl={entry?.url || null}
              cloudinaryPublicId={currentPublicId}
              onUploadComplete={(data) => {
                setImage(sectionId, { url: data.imageUrl, publicId: data.publicId });
                setUploadSuccess(true);
              }}
              onDeleteComplete={() => {
                setImage(sectionId, null);
                setUploadSuccess(false);
              }}
              compact
            />

            {uploadSuccess && (
              <div className="cms-img-modal-success">
                ✅ Obrázek uložen! Změna je okamžitě aktivní — nemusíte klikat na &quot;Publikovat&quot;.
              </div>
            )}

            <div className="cms-img-modal-actions">
              <button className="cms-img-btn-cancel" onClick={closeModal}>
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
