-- Přidej chybějící sloupec stars + opravi default sort_order
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS stars INT NOT NULL DEFAULT 5;

-- Refreshni schema cache
NOTIFY pgrst, 'reload schema';
