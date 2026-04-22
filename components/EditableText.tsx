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
  // Sans-serif
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Lato', value: 'Lato, sans-serif' },
  { label: 'Raleway', value: 'Raleway, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Open Sans', value: '"Open Sans", sans-serif' },
  { label: 'Oswald', value: 'Oswald, sans-serif' },
  // Serif
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'Lora', value: 'Lora, serif' },
  { label: 'Merriweather', value: 'Merriweather, serif' },
  { label: 'Cormorant', value: '"Cormorant Garamond", serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  // Script / handwriting
  { label: 'Dancing Script', value: '"Dancing Script", cursive' },
  { label: 'Pacifico', value: 'Pacifico, cursive' },
  { label: 'Caveat', value: 'Caveat, cursive' },
  { label: 'Great Vibes', value: '"Great Vibes", cursive' },
  // Mono
  { label: 'Courier', value: '"Courier New", monospace' },
];

const FONT_WEIGHTS = [
  { label: 'Thin (100)', value: '100' },
  { label: 'ExtraLight (200)', value: '200' },
  { label: 'Light (300)', value: '300' },
  { label: 'Normální (400)', value: '400' },
  { label: 'Medium (500)', value: '500' },
  { label: 'SemiBold (600)', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: 'Black (900)', value: '900' },
];

const TEXT_COLORS = [
  { label: 'Výchozí', value: '' },
  { label: 'Kávová (akcent)', value: '#c5a47e' },
  { label: 'Tmavě hnědá', value: '#3d2b1f' },
  { label: 'Krémová', value: '#f8f3ed' },
  { label: 'Bílá', value: '#ffffff' },
  { label: 'Černá', value: '#111111' },
  { label: 'Šedá', value: '#888888' },
];

// ---------- Selection helpers ----------

/** Pomocna funkce: ulozi aktualni Range (pokud je v elRef) do refu.
 *  Volame to PRED kliknutim na trigger dropdownu, aby pak slo selection
 *  obnovit i kdyby behem otvirani menu doslo k re-renderu. */
function saveSelectionToRef(elRef: React.RefObject<HTMLElement | null>, ref: React.MutableRefObject<Range | null>) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  if (!elRef.current) return;
  // Pouze pokud je selection uvnitr editovaneho elementu
  if (!elRef.current.contains(range.commonAncestorContainer)) return;
  ref.current = range.cloneRange();
}

/** Obnovi ulozenou selection do dokumentu. Vraci range nebo null. */
function restoreSelectionFromRef(ref: React.MutableRefObject<Range | null>): Range | null {
  if (!ref.current) return null;
  const sel = window.getSelection();
  if (!sel) return null;
  sel.removeAllRanges();
  sel.addRange(ref.current);
  return ref.current;
}

/** Zabali aktualni selection (z refu) do <span> s danym inline stylem.
 *  Po dokonceni re-selectne obsah spanu, aby se daly aplikovat dalsi styly. */
function wrapSelectionWithStyle(
  elRef: React.RefObject<HTMLElement | null>,
  savedRangeRef: React.MutableRefObject<Range | null>,
  styleProp: string,
  styleValue: string
): boolean {
  const range = restoreSelectionFromRef(savedRangeRef);
  if (!range || range.collapsed) return false;
  if (!elRef.current?.contains(range.commonAncestorContainer)) return false;

  const span = document.createElement('span');
  // styleProp je CSS property v camelCase (fontFamily, fontSize, color, fontWeight)
  // ale `style[prop] = value` funguje pro oboji
  (span.style as unknown as Record<string, string>)[styleProp] = styleValue;
  try {
    span.appendChild(range.extractContents());
    range.insertNode(span);
    // Re-select obsah noveho spanu
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(newRange);
    savedRangeRef.current = newRange.cloneRange();
    return true;
  } catch {
    return false;
  }
}

/** Smaze inline formatovani z aktualni selection (rozbali spany). */
function clearSelectionFormat(elRef: React.RefObject<HTMLElement | null>, savedRangeRef: React.MutableRefObject<Range | null>) {
  restoreSelectionFromRef(savedRangeRef);
  document.execCommand('removeFormat');
  // execCommand removeFormat nesmaze vlastni inline styles na spanech, tak je
  // explicitne odstranime ze vsech spanu uvnitr selection.
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  const root = elRef.current;
  if (!root) return;
  root.querySelectorAll('span[style], font[face], font[color], font[size]').forEach((node) => {
    if (range.intersectsNode(node)) {
      const parent = node.parentNode;
      if (!parent) return;
      while (node.firstChild) parent.insertBefore(node.firstChild, node);
      parent.removeChild(node);
    }
  });
}

// ---------- Toolbar Dropdown ----------

function ToolbarDropdown({
  label,
  children,
  onOpen,
}: {
  label: string;
  children: React.ReactNode;
  /** Zavolano pri otevreni dropdownu — typicky pro ulozeni selection. */
  onOpen?: () => void;
}) {
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
        onMouseDown={(e) => {
          e.preventDefault();
          // ULOZ selection PRED tim nez se cokoliv re-renderuje
          if (!open) onOpen?.();
          setOpen(!open);
        }}
        title={label}
      >
        {label} <span className="cms-tb-arrow">▾</span>
      </button>
      {open && (
        <div
          className="cms-tb-dropdown-menu"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpen(false)}
        >
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
  /** Posledni Range uvnitr editovaneho elementu — drzime ji pres re-rendery,
   *  aby kliknuti na dropdown nezpusobilo ztratu selection pri aplikaci stylu. */
  const savedRangeRef = useRef<Range | null>(null);

  // Sledujeme zmeny selection a kdyz je selection uvnitr editovaneho elementu,
  // ulozime si ji do refu. Diky tomu pri pristim kliknuti na format-button mame
  // vzdy aktualni range i kdyby react re-renderoval mezi tim.
  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (elRef.current?.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
        // Re-render kvuli active stavum b/i/u
        forceUpdate((n) => n + 1);
      }
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, [elRef]);

  // Helper pro b/i/u — pouziva execCommand (browser native, funguje spolehlive)
  const execInline = useCallback((cmd: string) => {
    restoreSelectionFromRef(savedRangeRef);
    document.execCommand(cmd, false);
    // Po execCommand muze byt selection v jinem range — ulozime aktualni
    saveSelectionToRef(elRef, savedRangeRef);
    forceUpdate((n) => n + 1);
  }, [elRef]);

  // Stavy b/i/u pro vyznaceni active tlacitek
  let isBold = false, isItalic = false, isUnderline = false;
  try {
    isBold = document.queryCommandState('bold');
    isItalic = document.queryCommandState('italic');
    isUnderline = document.queryCommandState('underline');
  } catch { /* noop */ }

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

  // Helper pro jednotne wrap-with-style
  const applyStyle = useCallback((prop: string, value: string) => {
    const ok = wrapSelectionWithStyle(elRef, savedRangeRef, prop, value);
    if (!ok) {
      // Pokud nebyla selection, neudelame nic — vizualne to user pozna podle
      // toho ze nic nezmizelo. Nedavame alert aby to nerusilo.
      return;
    }
    forceUpdate((n) => n + 1);
  }, [elRef]);

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
        onMouseDown={(e) => { e.preventDefault(); execInline('bold'); }}
        title="Tučné"
      >
        <b>B</b>
      </button>
      <button
        type="button"
        className={`cms-tb-btn ${isItalic ? 'active' : ''}`}
        onMouseDown={(e) => { e.preventDefault(); execInline('italic'); }}
        title="Kurzíva"
      >
        <i>I</i>
      </button>
      <button
        type="button"
        className={`cms-tb-btn ${isUnderline ? 'active' : ''}`}
        onMouseDown={(e) => { e.preventDefault(); execInline('underline'); }}
        title="Podtržené"
      >
        <u>U</u>
      </button>

      <span className="cms-tb-sep" />

      {/* Font size — manualni span wrapping, polozky maji LIVE PREVIEW */}
      <ToolbarDropdown label="Velikost" onOpen={() => saveSelectionToRef(elRef, savedRangeRef)}>
        {FONT_SIZES.map((s) => (
          <button
            key={s.label}
            type="button"
            className="cms-tb-dropdown-item"
            style={{ fontSize: s.value || '0.95rem' }}
            onMouseDown={(e) => {
              e.preventDefault();
              if (s.value) applyStyle('fontSize', s.value);
              else clearSelectionFormat(elRef, savedRangeRef);
            }}
          >
            {s.label}
          </button>
        ))}
      </ToolbarDropdown>

      {/* Font family — manualni span wrapping */}
      <ToolbarDropdown label="Font" onOpen={() => saveSelectionToRef(elRef, savedRangeRef)}>
        {FONT_FAMILIES.map((f) => (
          <button
            key={f.label}
            type="button"
            className="cms-tb-dropdown-item"
            style={{ fontFamily: f.value || 'inherit' }}
            onMouseDown={(e) => {
              e.preventDefault();
              if (f.value) applyStyle('fontFamily', f.value);
              else clearSelectionFormat(elRef, savedRangeRef);
            }}
          >
            {f.label}
          </button>
        ))}
      </ToolbarDropdown>

      {/* Font weight (Tloušťka) */}
      <ToolbarDropdown label="Tloušťka" onOpen={() => saveSelectionToRef(elRef, savedRangeRef)}>
        {FONT_WEIGHTS.map((w) => (
          <button
            key={w.value}
            type="button"
            className="cms-tb-dropdown-item"
            style={{ fontWeight: Number(w.value) }}
            onMouseDown={(e) => {
              e.preventDefault();
              applyStyle('fontWeight', w.value);
            }}
          >
            {w.label}
          </button>
        ))}
      </ToolbarDropdown>

      <span className="cms-tb-sep" />

      {/* Text color */}
      <ToolbarDropdown label="🎨" onOpen={() => saveSelectionToRef(elRef, savedRangeRef)}>
        <div className="cms-tb-color-grid">
          {TEXT_COLORS.map((c) => (
            <ColorSwatch
              key={c.label}
              color={c.value}
              active={false}
              onClick={() => {
                if (c.value) applyStyle('color', c.value);
                else clearSelectionFormat(elRef, savedRangeRef);
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

  // Determine the effective sectionId for EN translations
  const enSectionId = `${sectionId}__en`;

  // In EN mode: use DB-stored EN translation → fallback to static dictionary → fallback to Czech
  // In CS mode: use DB value or default
  const csValue = drafts[sectionId]?.value ?? defaultValue;
  const enDbValue = drafts[enSectionId]?.value;
  const currentValue = lang === 'en'
    ? (enDbValue || t(defaultValue))
    : csValue;

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

  // When editing, prevent clicks from triggering parent <a>/<Link> navigation
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!isEditing) return;
    e.preventDefault();
    e.stopPropagation();
  }, [isEditing]);

  // Block parent <a>/<Link> navigation while editing (capture phase)
  useEffect(() => {
    if (!isEditing) return;
    const el = elRef.current;
    if (!el) return;
    const link = el.closest('a');
    if (!link) return;
    const block = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    link.addEventListener('click', block, true);
    return () => link.removeEventListener('click', block, true);
  }, [isEditing]);

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
    // Save to the correct sectionId: EN translations use __en suffix
    const saveSectionId = lang === 'en' ? enSectionId : sectionId;
    // Update draft state with final value
    setDraft(saveSectionId, value);

    try {
      const { saveDrafts } = await import('@/app/actions/content');
      await saveDrafts([{ section_id: saveSectionId, draft_text: value }]);
    } catch (err) {
      console.error('Failed to save draft:', err);
    } finally {
      savingRef.current = false;
    }
  }, [sectionId, enSectionId, lang, drafts, defaultValue, setDraft]);

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
        onClick={isEditing ? handleClick : undefined}
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
