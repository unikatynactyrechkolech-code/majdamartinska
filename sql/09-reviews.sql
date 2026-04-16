-- =============================================
-- Tabulka REVIEWS
-- Spusť v Supabase SQL Editoru
-- =============================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL DEFAULT 'majda-web',
  name TEXT NOT NULL,
  name_en TEXT,
  type TEXT NOT NULL DEFAULT '',
  type_en TEXT,
  text TEXT NOT NULL,
  text_en TEXT,
  profile_image TEXT,
  stars INT NOT NULL DEFAULT 5,
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='reviews_select_all') THEN
    CREATE POLICY reviews_select_all ON reviews FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='reviews_insert_anon') THEN
    CREATE POLICY reviews_insert_anon ON reviews FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='reviews_update_anon') THEN
    CREATE POLICY reviews_update_anon ON reviews FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='reviews_delete_anon') THEN
    CREATE POLICY reviews_delete_anon ON reviews FOR DELETE USING (true);
  END IF;
END $$;
