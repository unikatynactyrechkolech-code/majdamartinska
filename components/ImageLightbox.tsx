'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

interface LightboxContextType {
  openLightbox: (src: string, alt: string) => void;
}

const LightboxContext = createContext<LightboxContextType>({
  openLightbox: () => {},
});

export function useLightbox() {
  return useContext(LightboxContext);
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [imgAlt, setImgAlt] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openLightbox = useCallback((src: string, alt: string) => {
    setImgSrc(src);
    setImgAlt(alt);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, closeLightbox]);

  return (
    <LightboxContext.Provider value={{ openLightbox }}>
      {children}
      {mounted && isOpen && createPortal(
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Zavřít">
            ✕
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <Image
              src={imgSrc}
              alt={imgAlt}
              width={1920}
              height={1280}
              quality={90}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              unoptimized
            />
          </div>
        </div>,
        document.body
      )}
    </LightboxContext.Provider>
  );
}

/**
 * Wrapper that makes any image clickable to open in fullscreen lightbox.
 * Wraps children with a clickable div.
 */
export function LightboxImage({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children: React.ReactNode;
}) {
  const { openLightbox } = useLightbox();

  return (
    <div
      className="lightbox-trigger"
      onClick={() => openLightbox(src, alt)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(src, alt);
        }
      }}
    >
      {children}
    </div>
  );
}
