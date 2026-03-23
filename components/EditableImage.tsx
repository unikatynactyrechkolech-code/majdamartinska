'use client';

import Image, { type ImageProps } from 'next/image';
import { useAdmin } from '@/contexts/AdminContext';
import { useCallback } from 'react';

interface EditableImageProps extends Omit<ImageProps, 'onClick'> {
  /** Unique identifier for this image, e.g. "home.promise.img" */
  sectionId: string;
}

export function EditableImage({ sectionId, className = '', style, ...props }: EditableImageProps) {
  const { isAdmin } = useAdmin();

  const handleClick = useCallback(() => {
    if (!isAdmin) return;
    alert(`📷 Zde se v budoucnu otevře nahrávání fotky.\n\nSekce: ${sectionId}`);
  }, [isAdmin, sectionId]);

  return (
    <div
      className={`${isAdmin ? 'cms-editable-image' : ''}`}
      style={{ position: 'relative', cursor: isAdmin ? 'pointer' : undefined }}
      onClick={handleClick}
    >
      <Image className={className} style={style} {...props} />
      {isAdmin && (
        <div className="cms-image-overlay">
          <span className="cms-image-overlay-icon">📷</span>
          <span className="cms-image-overlay-text">Klikněte pro změnu</span>
        </div>
      )}
    </div>
  );
}
