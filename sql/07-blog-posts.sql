-- =============================================
-- BLOG POSTS — tabulka pro články Majdy
-- Zkopíruj a vlož do Supabase SQL Editor → RUN
-- =============================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL DEFAULT 'default',
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  cover_image TEXT,            -- Cloudinary URL hlavního obrázku
  content TEXT,                -- HTML obsah z TipTap editoru
  excerpt TEXT,                -- Krátký popisek (pro kartu na blogu)
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ,
  UNIQUE(project_id, slug)
);

-- Index pro rychlé řazení
CREATE INDEX IF NOT EXISTS idx_blog_posts_published
  ON blog_posts (project_id, published, published_at DESC);

-- RLS: povolit čtení všem, zápis přes service role (server actions)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_posts_read" ON blog_posts
  FOR SELECT USING (true);

CREATE POLICY "blog_posts_write" ON blog_posts
  FOR ALL USING (true) WITH CHECK (true);
