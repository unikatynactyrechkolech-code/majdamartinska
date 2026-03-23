'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

interface EditableTextProps {
  /** Unique identifier for this piece of content, e.g. "home.hero.title" */
  sectionId: string;
  /** The default / fallback text shown when no DB value exists */
  defaultValue: string;
  /** Render as tag – defaults to span */
  as?: React.ElementType;
  /** Use textarea for multiline? */
  multiline?: boolean;
  /** Pass-through className */
  className?: string;
  /** Pass-through style */
  style?: React.CSSProperties;
}

export function EditableText({
  sectionId,
  defaultValue,
  as: Tag = 'span',
  multiline = false,
  className = '',
  style,
}: EditableTextProps) {
  const { isAdmin, drafts, setDraft, initContent } = useAdmin();
  const elRef = useRef<HTMLElement>(null);
  const savingRef = useRef(false);

  // Register this section so AdminContext knows about it
  useEffect(() => {
    initContent(sectionId, defaultValue);
  }, [sectionId, defaultValue, initContent]);

  const currentValue = drafts[sectionId]?.value ?? defaultValue;

  // Sync innerHTML when value changes externally (e.g. DB load)
  // but NOT while user is editing (to avoid cursor jumping)
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    // Don't overwrite while focused/editing
    if (document.activeElement === el) return;
    if (el.innerHTML !== currentValue) {
      el.innerHTML = currentValue;
    }
  }, [currentValue]);

  const handleInput = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    setDraft(sectionId, el.innerHTML);
  }, [sectionId, setDraft]);

  const handleBlur = useCallback(async () => {
    if (savingRef.current) return;
    savingRef.current = true;

    const value = elRef.current?.innerHTML ?? drafts[sectionId]?.value ?? defaultValue;
    // Update draft state with final value
    setDraft(sectionId, value);

    try {
      const { saveDrafts } = await import('@/app/actions/content');
      await saveDrafts([{ section_id: sectionId, draft_text: value }]);
    } catch (err) {
      console.error('Failed to save draft:', err);
    } finally {
      savingRef.current = false;
    }
  }, [sectionId, drafts, defaultValue, setDraft]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        (e.target as HTMLElement).blur();
      }
      // Single-line: Enter = save & blur
      if (!multiline && e.key === 'Enter') {
        e.preventDefault();
        (e.target as HTMLElement).blur();
      }
    },
    [multiline]
  );

  // Prevent pasting rich text – paste as plain text only
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  return (
    <Tag
      ref={elRef}
      className={`${className} ${isAdmin ? 'cms-editable' : ''}`}
      style={style}
      contentEditable={isAdmin ? true : undefined}
      suppressContentEditableWarning
      onInput={isAdmin ? handleInput : undefined}
      onBlur={isAdmin ? handleBlur : undefined}
      onKeyDown={isAdmin ? handleKeyDown : undefined}
      onPaste={isAdmin ? handlePaste : undefined}
      dangerouslySetInnerHTML={{ __html: currentValue }}
    />
  );
}
