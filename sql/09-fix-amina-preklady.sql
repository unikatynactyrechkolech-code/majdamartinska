-- 09-fix-amina-preklady.sql
-- Oprava: body 4 a 7 v "10 důvodů" se zobrazovaly anglicky i v české verzi
-- Příčina: anglický text byl omylem uložen do českého sectionId (bez __en)
-- Řešení: vrátit českou verzi a vložit anglické překlady do __en klíčů
--
-- Spustit v Supabase SQL Editor

-- ============================================
-- KROK 1: Opravit české texty (body 4 a 7)
-- ============================================
UPDATE page_content
SET draft_text = 'na úpravě fotografií si dávám hodně záležet <em>(Amina ani neví, co je grafický tablet nebo Photoshop)</em>',
    published_text = 'na úpravě fotografií si dávám hodně záležet <em>(Amina ani neví, co je grafický tablet nebo Photoshop)</em>',
    updated_at = now()
WHERE project_id = 'majdamartinska' AND section_id = 'home.reason4';

UPDATE page_content
SET draft_text = 'při venkovním focení tě vezmu na vážně pěkná místa <em>(no tady musím uznat, že to by možná Amina zvládla lépe)</em>',
    published_text = 'při venkovním focení tě vezmu na vážně pěkná místa <em>(no tady musím uznat, že to by možná Amina zvládla lépe)</em>',
    updated_at = now()
WHERE project_id = 'majdamartinska' AND section_id = 'home.reason7';

-- ============================================
-- KROK 2: Vložit anglické překlady (klíče __en)
-- ============================================
INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  -- Nadpis sekce
  ('majdamartinska', 'home.reasons.title__en',
   '10 reasons to choose me and&nbsp;not <em>Pučálkovic Amina</em>',
   '10 reasons to choose me and&nbsp;not <em>Pučálkovic Amina</em>'),

  -- Bod 1
  ('majdamartinska', 'home.reason1__en',
   'the fun is better with me than with Amina, and&nbsp;that''s saying something',
   'the fun is better with me than with Amina, and&nbsp;that''s saying something'),

  -- Bod 2
  ('majdamartinska', 'home.reason2__en',
   'I really try to make you feel relaxed <em>(which&nbsp;isn''t possible around a giraffe)</em>',
   'I really try to make you feel relaxed <em>(which&nbsp;isn''t possible around a giraffe)</em>'),

  -- Bod 3
  ('majdamartinska', 'home.reason3__en',
   'I shoot at eye level so it looks natural <em>(Amina always shoots from&nbsp;above)</em>',
   'I shoot at eye level so it looks natural <em>(Amina always shoots from&nbsp;above)</em>'),

  -- Bod 4
  ('majdamartinska', 'home.reason4__en',
   'I put a lot of effort into editing <em>(Amina doesn''t even know what a graphics tablet or Photoshop&nbsp;is)</em>',
   'I put a lot of effort into editing <em>(Amina doesn''t even know what a graphics tablet or Photoshop&nbsp;is)</em>'),

  -- Bod 5
  ('majdamartinska', 'home.reason5__en',
   'a visit to me isn''t just a shoot, but a friendly meeting <em>(Amina is friendly, but you really don''t want her showing&nbsp;affection)</em>',
   'a visit to me isn''t just a shoot, but a friendly meeting <em>(Amina is friendly, but you really don''t want her showing&nbsp;affection)</em>'),

  -- Bod 6
  ('majdamartinska', 'home.reason6__en',
   'I''ll make you a delicious coffee for the studio shoot <em>(Amina doesn''t drink coffee, and worse, no&nbsp;alcohol&nbsp;either)</em>',
   'I''ll make you a delicious coffee for the studio shoot <em>(Amina doesn''t drink coffee, and worse, no&nbsp;alcohol&nbsp;either)</em>'),

  -- Bod 7
  ('majdamartinska', 'home.reason7__en',
   'for outdoor shoots I''ll take you to really nice spots <em>(I must admit Amina might do this&nbsp;better)</em>',
   'for outdoor shoots I''ll take you to really nice spots <em>(I must admit Amina might do this&nbsp;better)</em>'),

  -- Bod 8
  ('majdamartinska', 'home.reason8__en',
   'I deliver photos within 21 days max <em>(Amina can''t even count to five and&nbsp;looks&nbsp;like&nbsp;it)</em>',
   'I deliver photos within 21 days max <em>(Amina can''t even count to five and&nbsp;looks&nbsp;like&nbsp;it)</em>'),

  -- Bod 9
  ('majdamartinska', 'home.reason9__en',
   'besides talking a lot, I also listen and adapt to your wishes <em>(Amina just stands there staring&nbsp;oddly)</em>',
   'besides talking a lot, I also listen and adapt to your wishes <em>(Amina just stands there staring&nbsp;oddly)</em>'),

  -- Bod 10
  ('majdamartinska', 'home.reason10__en',
   'I''m leading 9:1 in reasons to choose me over Amina. Don''t hesitate —&nbsp;contact&nbsp;me.',
   'I''m leading 9:1 in reasons to choose me over Amina. Don''t hesitate —&nbsp;contact&nbsp;me.'),

  -- Poznámka
  ('majdamartinska', 'home.reasons.note__en',
   'Note: Pučálkovic Amina is a giraffe from a wonderful book by Jindřich Plachta :)',
   'Note: Pučálkovic Amina is a giraffe from a wonderful book by Jindřich Plachta :)')

ON CONFLICT (project_id, section_id) DO UPDATE SET
  draft_text = EXCLUDED.draft_text,
  published_text = EXCLUDED.published_text,
  updated_at = now();
