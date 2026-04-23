'use client';

/* ============================================================
   DYNAMIC CIRCLE SCROLL
   ------------------------------------------------------------
   Horizontální galerie kruhových fotek (jako "to první co tam
   už je"), do které admin může za chodu PŘIDÁVAT a ODEBÍRAT
   položky. Přidání nového kolečka uloží jeho ID do speciální
   sekce `<sectionPrefix>.ids`, která je perzistovaná v DB
   stejným způsobem jako jakýkoliv jiný editovatelný text.

   Pro každé kolečko jsou pak tři klasická editovatelná pole:
   - obrázek            (EditableImage)  — sekce `<prefix>.<id>.img`
   - titulek pod kolem  (EditableText)   — sekce `<prefix>.<id>.caption`
   - volitelný odkaz    (EditableText)   — sekce `<prefix>.<id>.href`

   Pro běžného návštěvníka funguje jako normální drag-scroll
   galerie. Pro admina se navíc objevují tlačítka „+ Přidat" a
   „× Smazat".
   ============================================================ */

import { useRef, useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { EditableImage } from './EditableImage';
import { EditableText } from './EditableText';
import { useAdmin } from '@/contexts/AdminContext';

const DEFAULT_IMG =
  'https://res.cloudinary.com/dh8ts5fpa/image/upload/v1774978116/Sni%CC%81mek_obrazovky_2026-03-31_v_19.27.39_tonhmp.png';

interface DynamicCircleScrollProps {
  /** Common prefix for all sectionIds, e.g. "home.circles" */
  sectionPrefix: string;
  /** Default ids if admin hasn't configured anything yet (comma-separated) */
  defaultIds?: string[];
  /** Title shown above the gallery (editable). */
  titleSectionId?: string;
  /** Default title text */
  defaultTitle?: string;
}

export function DynamicCircleScroll({
  sectionPrefix,
  defaultIds = [],
  titleSectionId,
  defaultTitle,
}: DynamicCircleScrollProps) {
  const { isAdmin, drafts, setDraft } = useAdmin();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  const idsKey = `${sectionPrefix}.ids`;
  const idsRaw = drafts[idsKey]?.value ?? defaultIds.join(',');
  const ids = idsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const [, force] = useState(0);

  const persistIds = useCallback(
    async (next: string[]) => {
      const value = next.join(',');
      setDraft(idsKey, value);
      try {
        const { saveDrafts, publishChanges } = await import('@/app/actions/content');
        await saveDrafts([{ section_id: idsKey, draft_text: value }]);
        await publishChanges([idsKey]);
      } catch (err) {
        console.error('persistIds failed:', err);
      }
      force((n) => n + 1);
    },
    [idsKey, setDraft]
  );

  const addCircle = useCallback(() => {
    const nextNum =
      ids.length === 0
        ? 1
        : Math.max(
            ...ids.map((id) => {
              const n = parseInt(id, 10);
              return Number.isFinite(n) ? n : 0;
            })
          ) + 1;
    persistIds([...ids, String(nextNum)]);
  }, [ids, persistIds]);

  const removeCircle = useCallback(
    (id: string) => {
      if (!confirm('Opravdu smazat tento prvek z galerie?')) return;
      persistIds(ids.filter((x) => x !== id));
    },
    [ids, persistIds]
  );

  // Drag-to-scroll like HorizontalScroll
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
      setTimeout(() => {
        hasDragged.current = false;
      }, 0);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - wrapper.offsetLeft;
      const walk = (x - startX.current) * 2;
      if (Math.abs(x - startX.current) > 5) hasDragged.current = true;
      wrapper.scrollLeft = scrollLeftRef.current - walk;
    };
    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX > absY * 0.5) return;
      const canScrollLeft = wrapper.scrollLeft > 1;
      const canScrollRight =
        wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth - 2;
      if (e.deltaY > 0 && !canScrollRight) return;
      if (e.deltaY < 0 && !canScrollLeft) return;
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

  const handleItemClick = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) e.preventDefault();
  }, []);

  return (
    <section className="section circle-scroll-section" data-animate>
      <div className="container">
        {titleSectionId && (
          <h2 className="section-title circle-scroll-title">
            <EditableText
              sectionId={titleSectionId}
              defaultValue={defaultTitle ?? 'Galerie'}
              as="span"
            />
          </h2>
        )}
      </div>

      <div className="circle-scroll-wrapper" ref={wrapperRef}>
        <div className="circle-scroll-track">
          {ids.map((id) => {
            const hrefKey = `${sectionPrefix}.${id}.href`;
            const hrefValue = drafts[hrefKey]?.value?.trim();
            const inner = (
              <>
                <div className="circle-scroll-img-wrap">
                  <EditableImage
                    sectionId={`${sectionPrefix}.${id}.img`}
                    src={DEFAULT_IMG}
                    alt=""
                    width={260}
                    height={260}
                    sizes="(max-width: 768px) 180px, 260px"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%',
                    }}
                    noLightbox
                    unoptimized
                  />
                  {isAdmin && (
                    <button
                      type="button"
                      className="circle-scroll-remove"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeCircle(id);
                      }}
                      title="Smazat tento prvek"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="circle-scroll-caption">
                  <EditableText
                    sectionId={`${sectionPrefix}.${id}.caption`}
                    defaultValue="Nový titulek"
                    as="span"
                  />
                </div>
                {isAdmin && (
                  <div className="circle-scroll-href">
                    <span className="circle-scroll-href-label">odkaz:</span>
                    <EditableText
                      sectionId={hrefKey}
                      defaultValue=""
                      as="span"
                    />
                  </div>
                )}
              </>
            );

            return hrefValue ? (
              <Link
                href={hrefValue}
                className="circle-scroll-item"
                key={id}
                onClick={handleItemClick}
              >
                {inner}
              </Link>
            ) : (
              <div className="circle-scroll-item" key={id}>
                {inner}
              </div>
            );
          })}

          {isAdmin && (
            <button
              type="button"
              className="circle-scroll-add"
              onClick={addCircle}
              title="Přidat nové kolečko"
            >
              <span className="circle-scroll-add-plus">+</span>
              <span className="circle-scroll-add-label">Přidat</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
