'use client';

import { useState, useRef } from 'react';
import type { GalleryCategory } from '@/app/actions/categories';

// ============================================================
// CategoryAdmin — sprava dynamickych subkategorii v adminu
// Pouziva se inline na strance galerie (portfolio/art).
// Drag & drop pro razeni, inline editace nazvu/slugu, smazani.
// ============================================================

interface Props {
  page: string;                       // 'portfolio' | 'art'
  categories: GalleryCategory[];
  onChange: () => void;               // refetch po jakekoliv zmene
}

export function CategoryAdmin({ page, categories, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newLabelEn, setNewLabelEn] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const dragIdx = useRef<number | null>(null);

  const showMsg = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 2500);
  };

  const handleAdd = async () => {
    if (!newLabel.trim()) return;
    setBusy(true);
    try {
      const { createCategory } = await import('@/app/actions/categories');
      const r = await createCategory({
        page,
        label: newLabel.trim(),
        key: newKey.trim() || undefined,
        label_en: newLabelEn.trim() || undefined,
      });
      if (r.success) {
        setNewLabel(''); setNewKey(''); setNewLabelEn('');
        setAdding(false);
        showMsg('✅ Kategorie přidána');
        onChange();
      } else {
        showMsg('❌ ' + (r.error || 'Chyba'));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = async (cat: GalleryCategory, patch: { label?: string; key?: string; label_en?: string | null; visible?: boolean }) => {
    setBusy(true);
    try {
      const { updateCategory } = await import('@/app/actions/categories');
      const r = await updateCategory({ id: cat.id, ...patch });
      if (r.success) { showMsg('✅ Uloženo'); onChange(); }
      else showMsg('❌ ' + (r.error || 'Chyba'));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (cat: GalleryCategory) => {
    if (!confirm(`Opravdu smazat kategorii "${cat.label}"? Fotky v ní zůstanou v DB, ale nezobrazí se ve filtru.`)) return;
    setBusy(true);
    try {
      const { deleteCategory } = await import('@/app/actions/categories');
      const r = await deleteCategory(cat.id);
      if (r.success) { showMsg('✅ Smazáno'); onChange(); }
      else showMsg('❌ ' + (r.error || 'Chyba'));
    } finally {
      setBusy(false);
    }
  };

  const persistOrder = async (ordered: GalleryCategory[]) => {
    setBusy(true);
    try {
      const { reorderCategories } = await import('@/app/actions/categories');
      const r = await reorderCategories(page, ordered.map((c) => c.id));
      if (r.success) { showMsg('✅ Pořadí uloženo'); onChange(); }
      else showMsg('❌ ' + (r.error || 'Chyba'));
    } finally {
      setBusy(false);
    }
  };

  const move = (from: number, dir: -1 | 1) => {
    const to = from + dir;
    if (to < 0 || to >= categories.length) return;
    const next = [...categories];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    persistOrder(next);
  };

  const onDrop = (toIdx: number) => {
    const from = dragIdx.current;
    dragIdx.current = null;
    if (from === null || from === toIdx) return;
    const next = [...categories];
    const [m] = next.splice(from, 1);
    next.splice(toIdx, 0, m);
    persistOrder(next);
  };

  return (
    <div className="cat-admin">
      <button
        type="button"
        className="cat-admin-toggle"
        onClick={() => setOpen(!open)}
      >
        ⚙️ Spravovat kategorie {open ? '▴' : '▾'}
      </button>

      {open && (
        <div className="cat-admin-panel">
          <div className="cat-admin-header">
            <strong>Kategorie pro stránku /{page}</strong>
            {msg && <span className="cat-admin-msg">{msg}</span>}
          </div>

          {categories.length === 0 ? (
            <p className="cat-admin-empty">Zatím žádné vlastní kategorie.</p>
          ) : (
            <ul className="cat-admin-list">
              {categories.map((cat, idx) => (
                <li
                  key={cat.id}
                  className="cat-admin-item"
                  draggable
                  onDragStart={() => { dragIdx.current = idx; }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(idx)}
                >
                  <span className="cat-admin-drag" title="Přetáhni">⋮⋮</span>
                  <input
                    className="cat-admin-input"
                    defaultValue={cat.label}
                    placeholder="Název"
                    onBlur={(e) => { if (e.target.value.trim() !== cat.label) handleEdit(cat, { label: e.target.value }); }}
                  />
                  <input
                    className="cat-admin-input cat-admin-input-slug"
                    defaultValue={cat.key}
                    placeholder="slug"
                    onBlur={(e) => { if (e.target.value.trim() !== cat.key) handleEdit(cat, { key: e.target.value }); }}
                  />
                  <input
                    className="cat-admin-input cat-admin-input-en"
                    defaultValue={cat.label_en || ''}
                    placeholder="EN"
                    onBlur={(e) => { if ((e.target.value.trim() || null) !== cat.label_en) handleEdit(cat, { label_en: e.target.value }); }}
                  />
                  <label className="cat-admin-vis" title="Zobrazit">
                    <input
                      type="checkbox"
                      checked={cat.visible}
                      onChange={(e) => handleEdit(cat, { visible: e.target.checked })}
                    /> 👁
                  </label>
                  <button type="button" className="cat-admin-arrow" disabled={idx === 0 || busy}
                    onClick={() => move(idx, -1)} title="Nahoru">↑</button>
                  <button type="button" className="cat-admin-arrow" disabled={idx === categories.length - 1 || busy}
                    onClick={() => move(idx, 1)} title="Dolů">↓</button>
                  <button type="button" className="cat-admin-del" onClick={() => handleDelete(cat)} title="Smazat">🗑️</button>
                </li>
              ))}
            </ul>
          )}

          {adding ? (
            <div className="cat-admin-add-form">
              <input
                className="cat-admin-input"
                placeholder="Název kategorie (např. Akty)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                autoFocus
              />
              <input
                className="cat-admin-input cat-admin-input-slug"
                placeholder="slug (volitelné, vygeneruje se z názvu)"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
              />
              <input
                className="cat-admin-input cat-admin-input-en"
                placeholder="EN název"
                value={newLabelEn}
                onChange={(e) => setNewLabelEn(e.target.value)}
              />
              <button type="button" className="cat-admin-save" onClick={handleAdd} disabled={busy || !newLabel.trim()}>
                {busy ? 'Ukládám…' : '✓ Přidat'}
              </button>
              <button type="button" className="cat-admin-cancel" onClick={() => { setAdding(false); setNewLabel(''); setNewKey(''); setNewLabelEn(''); }}>Zrušit</button>
            </div>
          ) : (
            <button type="button" className="cat-admin-add-btn" onClick={() => setAdding(true)}>
              + Přidat novou kategorii
            </button>
          )}

          <p className="cat-admin-hint">
            💡 Slug se použije v URL (např. <code>/{page}#nazev</code>) a v sectionId obrázků. Pokud změníš slug, stávající fotky v té kategorii nezmění svou kategorii — nech to raději být.
          </p>
        </div>
      )}
    </div>
  );
}
