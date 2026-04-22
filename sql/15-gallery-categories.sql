-- =============================================
-- GALLERY CATEGORIES — dynamicke subkategorie pro /portfolio a /art
-- (a pripadne dalsi galerijni stranky v budoucnu)
-- Spust v Supabase SQL Editoru -> RUN
-- =============================================

CREATE TABLE IF NOT EXISTS gallery_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL DEFAULT 'default',
  page TEXT NOT NULL,            -- 'portfolio' | 'art' | ...
  key TEXT NOT NULL,             -- slug (a-z, 0-9, -), pouziva se v URL hash a sectionId
  label TEXT NOT NULL,           -- zobrazeny nazev (CZ)
  label_en TEXT,                 -- volitelny anglicky preklad
  sort_order INT NOT NULL DEFAULT 100,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (project_id, page, key)
);

CREATE INDEX IF NOT EXISTS idx_gallery_categories_page
  ON gallery_categories (project_id, page, sort_order ASC);

-- RLS: cteni vsem, zapis pres service role (server actions)
ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gallery_categories_read" ON gallery_categories;
DROP POLICY IF EXISTS "gallery_categories_write" ON gallery_categories;

CREATE POLICY "gallery_categories_read" ON gallery_categories
  FOR SELECT USING (true);

CREATE POLICY "gallery_categories_write" ON gallery_categories
  FOR ALL USING (true) WITH CHECK (true);
