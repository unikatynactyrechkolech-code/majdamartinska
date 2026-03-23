'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

interface DraftEntry {
  value: string;
  dirty: boolean;
}

interface AdminContextType {
  isAdmin: boolean;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  login: (password: string) => boolean;
  logout: () => void;
  drafts: Record<string, DraftEntry>;
  setDraft: (sectionId: string, value: string) => void;
  hasDirtyDrafts: boolean;
  publishAll: () => Promise<void>;
  isPublishing: boolean;
  initContent: (sectionId: string, value: string) => void;
  dbLoaded: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

// Admin heslo – v produkci nahradíte Supabase Auth
const ADMIN_PASSWORD = 'majda2026';

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, DraftEntry>>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [dbLoaded, setDbLoaded] = useState(false);

  // Load all published content from Supabase on mount
  useEffect(() => {
    let cancelled = false;

    async function loadFromDB() {
      try {
        const { getAllContent } = await import('@/app/actions/content');
        const content = await getAllContent();

        if (cancelled) return;

        setDrafts((prev) => {
          const next = { ...prev };
          for (const [sectionId, data] of Object.entries(content)) {
            // Use published_text if available, otherwise draft_text
            const dbValue = data.published ?? data.draft;
            if (dbValue !== null && !next[sectionId]?.dirty) {
              next[sectionId] = { value: dbValue, dirty: false };
            }
          }
          return next;
        });

        setDbLoaded(true);
      } catch (err) {
        console.error('Failed to load content from DB:', err);
        setDbLoaded(true); // Mark loaded even on error, so defaults are used
      }
    }

    loadFromDB();
    return () => { cancelled = true; };
  }, []);

  // Persist admin session in sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('cms-admin');
    if (saved === 'true') setIsAdmin(true);
  }, []);

  // Keyboard shortcut: Ctrl+Shift+E opens login or logs out
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        if (isAdmin) {
          logout();
        } else {
          setIsLoginOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isAdmin]);

  const openLogin = useCallback(() => setIsLoginOpen(true), []);
  const closeLogin = useCallback(() => setIsLoginOpen(false), []);

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setIsLoginOpen(false);
      sessionStorage.setItem('cms-admin', 'true');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    setIsLoginOpen(false);
    sessionStorage.removeItem('cms-admin');
    setDrafts((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = { ...next[key], dirty: false };
      }
      return next;
    });
  }, []);

  // Initialise content from default value — only sets if DB hasn't provided a value
  const initContent = useCallback((sectionId: string, value: string) => {
    setDrafts((prev) => {
      // If we already have this key (from DB or dirty edit), don't overwrite
      if (prev[sectionId]) return prev;
      return { ...prev, [sectionId]: { value, dirty: false } };
    });
  }, []);

  const setDraft = useCallback((sectionId: string, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [sectionId]: { value, dirty: true },
    }));
  }, []);

  const hasDirtyDrafts = Object.values(drafts).some((d) => d.dirty);

  const publishAll = useCallback(async () => {
    setIsPublishing(true);
    try {
      const dirtyEntries = Object.entries(drafts).filter(([, d]) => d.dirty);
      if (dirtyEntries.length === 0) return;

      const { saveDrafts, publishChanges } = await import(
        '@/app/actions/content'
      );

      await saveDrafts(
        dirtyEntries.map(([sectionId, d]) => ({
          section_id: sectionId,
          draft_text: d.value,
        }))
      );

      await publishChanges(dirtyEntries.map(([sectionId]) => sectionId));

      setDrafts((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          next[key] = { ...next[key], dirty: false };
        }
        return next;
      });

      alert('✅ Změny byly úspěšně publikovány!');
    } catch (err) {
      console.error('Publish failed:', err);
      alert('❌ Nepodařilo se publikovat. Zkontrolujte konzoli.');
    } finally {
      setIsPublishing(false);
    }
  }, [drafts]);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isLoginOpen,
        openLogin,
        closeLogin,
        login,
        logout,
        drafts,
        setDraft,
        hasDirtyDrafts,
        publishAll,
        isPublishing,
        initContent,
        dbLoaded,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
