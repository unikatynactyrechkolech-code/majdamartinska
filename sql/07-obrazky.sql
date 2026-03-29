-- =============================================
-- TABULKA PRO OBRÁZKY (Cloudinary)
-- Zkopíruj do Supabase SQL Editor a stiskni RUN
-- =============================================

-- 1) Vytvořit tabulku page_images
CREATE TABLE IF NOT EXISTS page_images (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id TEXT NOT NULL DEFAULT 'default',
  section_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  cloudinary_public_id TEXT NOT NULL,
  width INT,
  height INT,
  alt_text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, section_id)
);

-- 2) Zapnout RLS
ALTER TABLE page_images ENABLE ROW LEVEL SECURITY;

-- 3) Smazat staré policies (pro jistotu)
DROP POLICY IF EXISTS "Allow public read images" ON page_images;
DROP POLICY IF EXISTS "Allow public insert images" ON page_images;
DROP POLICY IF EXISTS "Allow public update images" ON page_images;
DROP POLICY IF EXISTS "Allow public delete images" ON page_images;

-- 4) Vytvořit nové policies
CREATE POLICY "Allow public read images"
  ON page_images FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert images"
  ON page_images FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update images"
  ON page_images FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete images"
  ON page_images FOR DELETE
  TO anon
  USING (true);
