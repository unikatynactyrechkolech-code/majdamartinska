'use client';

import { useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { EditableImage } from '@/components/EditableImage';
import { useLang } from '@/contexts/LanguageContext';

interface HScrollItem {
  src: string;
  alt: string;
  caption: string;
  /** sectionId for editable image, e.g. "home.hscroll.1" */
  sectionId?: string;
  /** Optional link — clicking navigates instead of opening lightbox */
  href?: string;
}

export function HorizontalScroll({ items }: { items: HScrollItem[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  // Prevent link navigation when user was dragging
  const handleItemClick = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      hasDragged.current = false;
      wrapper.style.cursor = 'grabbing';
      startX.current = e.pageX - wrapper.offsetLeft;
      scrollLeftRef.current = wrapper.scrollLeft;
    };

    const onMouseUp = () => {
      isDragging.current = false;
      wrapper.style.cursor = 'grab';
      // Reset hasDragged after a tick so click handler can still read it
      setTimeout(() => { hasDragged.current = false; }, 0);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - wrapper.offsetLeft;
      const walk = (x - startX.current) * 2;
      if (Math.abs(x - startX.current) > 5) {
        hasDragged.current = true;
      }
      wrapper.scrollLeft = scrollLeftRef.current - walk;
    };

    // Smart wheel handling:
    // - Trackpad two-finger horizontal swipe → native horizontal scroll (don't intercept)
    // - Mouse wheel vertical scroll → convert to horizontal scroll in the gallery
    // - Let vertical scroll pass through when gallery is at start/end
    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);

      // Trackpad horizontal swipe: deltaX is dominant — let browser handle natively
      if (absX > absY * 0.5) return;

      // Pure vertical scroll with no horizontal component (mouse wheel)
      // Only intercept if there's room to scroll horizontally
      const canScrollLeft = wrapper.scrollLeft > 1;
      const canScrollRight = wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth - 2;

      // At the edges, let page scroll vertically
      if (e.deltaY > 0 && !canScrollRight) return;
      if (e.deltaY < 0 && !canScrollLeft) return;

      // Only intercept if mostly vertical (mouse wheel)
      if (absY > 5) {
        e.preventDefault();
        wrapper.scrollLeft += e.deltaY * 1.5;
      }
    };

    wrapper.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseleave', onMouseUp);
    wrapper.addEventListener('mousemove', onMouseMove);
    wrapper.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      wrapper.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseleave', onMouseUp);
      wrapper.removeEventListener('mousemove', onMouseMove);
      wrapper.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <div className="h-scroll-wrapper" ref={wrapperRef}>
      <div className="h-scroll-track">
        {items.map((item, i) => {
          const content = (
            <>
              <EditableImage
                sectionId={item.sectionId || `hscroll.${i}`}
                src={item.src}
                alt={item.alt}
                width={500}
                height={667}
                quality={80}
                loading="eager"
                sizes="(max-width: 768px) 260px, 35vw"
                style={{ width: '100%', height: 'auto', aspectRatio: '3/4', objectFit: 'cover' }}
                noLightbox={!!item.href}
                unoptimized
              />
              <div className="h-scroll-caption">{t(item.caption)}</div>
            </>
          );

          return item.href ? (
            <Link href={item.href} className="h-scroll-item" key={i} onClick={handleItemClick}>
              {content}
            </Link>
          ) : (
            <div className="h-scroll-item" key={i}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
