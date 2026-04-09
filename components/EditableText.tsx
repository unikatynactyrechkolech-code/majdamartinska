'use client';

import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useLang } from '@/contexts/LanguageContext';

// ---------- Constants ----------

const FONT_SIZES = [
  { label: 'Malé', value: '0.85rem' },
  { label: 'Normální', value: '' },
  { label: 'Velké', value: '1.25rem' },
  { label: 'Větší', value: '1.5rem' },
  { label: 'Obrovské', value: '2rem' },
];

const FONT_FAMILIES = [
  { label: 'Výchozí', value: '' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier', value: 'Courier New, monospace' },
];

const TEXT_COLORS = [
  { label: 'Výchozí', value: '' },
  { label: 'Hnědá', value: '#3d2b1f' },
  { label: 'Zlatá', value: '#c5a47e' },
  { label: 'Černá', value: '#111' },
  { label: 'Bílá', value: '#fff' },
  { label: 'Šedá', value: '#888' },
  { label: 'Červená', value: '#dc2626' },
  { label: 'Modrá', value: '#2563eb' },
  { label: 'Zelená', value: '#16a34a' },
  { label: 'Fialová', value: '#9333ea' },
  { label: 'Růžová', value: '#ec4899' },
  { label: 'Oranžová', value: '#ea580c' },
];

// ---------- Toolbar Dropdown ----------

function ToolbarDropdown({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="cms-tb-dropdown" ref={ref}>
      <button
        type="button"
        className="cms-tb-btn cms-tb-dropdown-trigger"
        onMouseDown={(e) => { e.preventDefault(); setOpen(!open); }}
        title={label}
      >
        {label} <span className="cms-tb-arrow">▾</span>
      </button>
      {open && (
        <div className="cms-tb-dropdown-menu" onMouseDown={(e) => e.preventDefault()} onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}

// ---------- Color Swatch ----------

function ColorSwatch({ color, active, onClick, label }: { color: string; active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      className={`cms-tb-color-swatch ${active ? 'active' : ''}`}
      style={{ background: color || '#fff', border: !color ? '1.5px dashed #ccc' : undefined }}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={label}
    >
      {!color && '✕'}
    </button>
  );
}

// ---------- Floating Toolbar ----------

function EditingToolbar({ elRef }: { elRef: React.RefObject<HTMLElement | null> }) {
  const [, forceUpdate] = useState(0);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Refresh toolbar state on selection change
  useEffect(() => {
    const refresh = () => forceUpdate((n) => n + 1);
    document.addEventListener('selectionchange', refresh);
    return () => document.removeEventListener('selectionchange', refresh);
  }, []);

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    forceUpdate((n) => n + 1);
  }, []);

  const isBold = document.queryCommandState('bold');
  const isItalic = document.queryCommandState('italic');
  const isUnderline = document.queryCommandState('underline');

  // Position the toolbar above the editable element
  const pos = useMemo(() => {
    const el = elRef.current;
    if (!el) return { top: 0, left: 0 };
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY - 52,
      left: rect.left + window.scrollX,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elRef.current]);

  return createPortal(
    <div
      ref={toolbarRef}
      className="cms-editing-toolbar"
      style={{ top: pos.top, left: pos.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Bold / Italic / Underline */}
      <button
        type="button"
        className={`cms-tb-btn ${isBold ? 'active' : ''}`}
        onMouseDown={(e) => { e.preventDefault(); exec('bold'); }}
        title="Tučné"
      >
        <b>B</b>
      </button>
      <button
        type="button"
        className={`cms-tb-btn ${isItalic ? 'active' : ''}`}
        onMouseDown={(e) => { e.preventDefault(); exec('italic'); }}
        title="Kurzíva"
      >
        <i>I</i>
      </button>
      <button
        type="button"
        className={`cms-tb-btn ${isUnderline ? 'active' : ''}`}
        onMouseDown={(e) => { e.preventDefault(); exec('underline'); }}
        title="Podtržené"
      >
        <u>U</u>
      </button>

      <span className="cms-tb-sep" />

      {/* Font size */}
      <ToolbarDropdown label="Velikost">
        {FONT_SIZES.map((s) => (
          <button
            key={s.label}
            type="button"
            className="cms-tb-dropdown-item"
            onMouseDown={(e) => {
              e.preventDefault();
              if (s.value) {
                exec('fontSize', '7');
                // Replace font size=7 with custom size via span
                requestAnimationFrame(() => {
                  const el = elRef.current;
                  if (!el) return;
                  el.querySelectorAll('font[size="7"]').forEach((font) => {
                    const span = document.createElement('span');
                    span.style.fontSize = s.value;
                    span.innerHTML = font.innerHTML;
                    font.replaceWith(span);
                  });
                });
              } else {
                exec('removeFormat');
              }
            }}
          >
            {s.label}
          </button>
        ))}
      </ToolbarDropdown>

      {/* Font family */}
      <ToolbarDropdown label="Font">
        {FONT_FAMILIES.map((f) => (
          <button
            key={f.label}
            type="button"
            className="cms-tb-dropdown-item"
            style={{ fontFamily: f.value || 'inherit' }}
            onMouseDown={(e) => {
              e.preventDefault();
              if (f.value) {
                exec('fontName', f.value);
              } else {
                exec('removeFormat');
              }
            }}
          >
            {f.label}
          </button>
        ))}
      </ToolbarDropdown>

      <span className="cms-tb-sep" />

      {/* Text color */}
      <ToolbarDropdown label="🎨">
        <div className="cms-tb-color-grid">
          {TEXT_COLORS.map((c) => (
            <ColorSwatch
              key={c.label}
              color={c.value}
              active={false}
              onClick={() => {
                if (c.value) {
                  exec('foreColor', c.value);
                } else {
                  exec('removeFormat');
                }
              }}
              label={c.label}
            />
          ))}
        </div>
      </ToolbarDropdown>
    </div>,
    document.body
  );
}

// ---------- Props ----------

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
  const { lang, t } = useLang();
  const elRef = useRef<HTMLElement>(null);
  const savingRef = useRef(false);
  const [isEditing, setIsEditing] = useState(false);

  // Register this section so AdminContext knows about it
  useEffect(() => {
    initContent(sectionId, defaultValue);
  }, [sectionId, defaultValue, initContent]);

  // In EN mode, translate the default value; in CS mode use DB value or default
  const csValue = drafts[sectionId]?.value ?? defaultValue;
  const currentValue = lang === 'en' ? t(defaultValue) : csValue;

  // Sync innerHTML when value changes externally (e.g. DB load)
  // but NOT while user is editing (to avoid cursor jumping)
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    // Don't overwrite while focused/editing
    if (document.activeElement === el || isEditing) return;
    if (el.innerHTML !== currentValue) {
      el.innerHTML = currentValue;
    }
  }, [currentValue, isEditing]);

  // Right-click to start editing (context menu)
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    // Focus the element after a tick so contentEditable is applied
    requestAnimationFrame(() => {
      const el = elRef.current;
      if (el) {
        el.focus();
        // Place cursor at end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    });
  }, [isAdmin]);

  // Use ref-based input handler to avoid re-render during typing (cursor jump fix)
  const handleInput = useCallback(() => {
    // We intentionally do NOT call setDraft here during typing.
    // The draft is saved on blur to prevent React re-renders
    // which cause cursor jumping in contentEditable.
  }, []);

  const handleBlur = useCallback(async (e: React.FocusEvent) => {
    // If focus moved to toolbar, don't blur
    const related = e.relatedTarget as HTMLElement | null;
    if (related?.closest('.cms-editing-toolbar')) return;

    setIsEditing(false);
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

  // Allow pasting — keep HTML formatting for rich editing
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    // If there's HTML content paste it, otherwise plain text
    if (html) {
      document.execCommand('insertHTML', false, html);
    } else {
      document.execCommand('insertText', false, text);
    }
  }, []);

  return (
    <>
      <Tag
        ref={elRef}
        className={`${className} ${isAdmin ? 'cms-editable' : ''} ${isEditing ? 'cms-editing' : ''}`}
        style={style}
        contentEditable={isEditing ? true : undefined}
        suppressContentEditableWarning
        onContextMenu={isAdmin ? handleContextMenu : undefined}
        onInput={isEditing ? handleInput : undefined}
        onBlur={isEditing ? handleBlur : undefined}
        onKeyDown={isEditing ? handleKeyDown : undefined}
        onPaste={isEditing ? handlePaste : undefined}
        dangerouslySetInnerHTML={{ __html: currentValue }}
      />
      {isEditing && <EditingToolbar elRef={elRef} />}
    </>
  );
}
