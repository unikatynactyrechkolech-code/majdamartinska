-- 10-recenze-oprava.sql
-- Smazání VŠECH starých recenzí z databáze
-- Po smazání se zobrazí texty z kódu (defaultValue)
-- Spustit v Supabase SQL Editor

-- ============================================
-- SMAZAT všechny staré recenze (CZ i EN verze)
-- ============================================
DELETE FROM page_content
WHERE project_id = 'majdamartinska'
  AND section_id LIKE 'recenze.review%';

-- Hotovo! Po refreshi webu se zobrazí nové texty z kódu.
