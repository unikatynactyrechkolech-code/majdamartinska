CREATE TABLE IF NOT EXISTS page_content (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id      TEXT NOT NULL,
  section_id      TEXT NOT NULL,
  draft_text      TEXT,
  published_text  TEXT,
  image_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  published_at    TIMESTAMPTZ,
  UNIQUE (project_id, section_id)
);

CREATE INDEX IF NOT EXISTS idx_page_content_project_section
  ON page_content (project_id, section_id);
