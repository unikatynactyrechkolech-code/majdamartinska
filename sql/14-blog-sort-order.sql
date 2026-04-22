-- =============================================
-- BLOG POSTS — přidání sort_order pro drag & drop řazení v adminu
-- Spusť v Supabase SQL Editoru → RUN
-- =============================================

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;

-- Inicializace: nejnovější článek = nejmenší sort_order (bude nahoře)
-- Tím zachováme současné pořadí (created_at DESC) jako výchozí.
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY project_id ORDER BY created_at DESC) AS rn
  FROM blog_posts
)
UPDATE blog_posts b
SET sort_order = r.rn * 10
FROM ranked r
WHERE b.id = r.id;

-- Index pro rychlé řazení
CREATE INDEX IF NOT EXISTS idx_blog_posts_sort
  ON blog_posts (project_id, sort_order ASC);
