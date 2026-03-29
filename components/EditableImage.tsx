'use client';

import Image, { type ImageProps } from 'next/image';
import { useAdmin } from '@/contexts/AdminContext';
import { ImageUploader } from '@/components/ImageUploader';
import { useCallback, useState, useEffect } from 'react';

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

  // Track the current image URL from DB (null = use default prop)
  const [dbImageUrl, setDbImageUrl] = useState<string | null>(null);
  const [dbPublicId, setDbPublicId] = useState<string | null>(null);

  // Load existing image from DB on mount
  useEffect(() => {
    let cancelled = false;
    async function loadImage() {
      try {
        const { getImage } = await import('@/app/actions/images');
        const record = await getImage(sectionId);
        if (!cancelled && record) {
          setDbImageUrl(record.image_url);
          setDbPublicId(record.cloudinary_public_id);
        }
      } catch (err) {
        console.error('Failed to load image:', err);
      }
    }
    loadImage();
    return () => { cancelled = true; };
  }, [sectionId]);

  const currentSrc = dbImageUrl || defaultSrc;

  const handleClick = useCallback(() => {
    if (!isAdmin) return;
    setIsModalOpen(true);
  }, [isAdmin]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

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

      {/* Upload modal — uses universal ImageUploader */}
      {isModalOpen && (
        <div className="cms-img-modal-backdrop" onClick={closeModal}>
          <div className="cms-img-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cms-img-modal-close" onClick={closeModal}>✕</button>

            <h3 className="cms-img-modal-title">📷 Správa obrázku</h3>
            <p className="cms-img-modal-section">
              Sekce: <code>{sectionId}</code>
            </p>

            <ImageUploader
              sectionId={sectionId}
              currentUrl={dbImageUrl}
              cloudinaryPublicId={dbPublicId}
              onUploadComplete={(data) => {
                setDbImageUrl(data.imageUrl);
                setDbPublicId(data.publicId);
                setIsModalOpen(false);
              }}
              onDeleteComplete={() => {
                setDbImageUrl(null);
                setDbPublicId(null);
                setIsModalOpen(false);
              }}
              compact
            />

            <div className="cms-img-modal-actions">
              <button className="cms-img-btn-cancel" onClick={closeModal}>
                Zavřít
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
