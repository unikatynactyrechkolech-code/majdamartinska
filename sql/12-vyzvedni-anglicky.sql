-- 12-vyzvedni-anglicky.sql
-- English translations for the /vyzvedni-fotky page
-- Uses __en suffix convention for EditableText translations
-- Spustit v Supabase SQL Editor

INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  -- ── HERO ──
  ('majdamartinska', 'vyzvedni.hero.title__en',
   'Pick up photos',
   'Pick up photos'),

  ('majdamartinska', 'vyzvedni.hero.subtitle__en',
   'Here you can pick up your finished photos',
   'Here you can pick up your finished photos'),

  -- ── BODY ──
  ('majdamartinska', 'vyzvedni.label__en',
   'FINISHED PHOTOS',
   'FINISHED PHOTOS'),

  ('majdamartinska', 'vyzvedni.title__en',
   'How to pick up your photos?',
   'How to pick up your photos?'),

  -- ── STEP 1 ──
  ('majdamartinska', 'vyzvedni.step1.title__en',
   'You received a link by email',
   'You received a link by email'),

  ('majdamartinska', 'vyzvedni.step1.text__en',
   'Once the photos are processed I''ll send you an email with a private download link. The link is valid for 30 days.',
   'Once the photos are processed I''ll send you an email with a private download link. The link is valid for 30 days.'),

  -- ── STEP 2 ──
  ('majdamartinska', 'vyzvedni.step2.title__en',
   'Download your gallery',
   'Download your gallery'),

  ('majdamartinska', 'vyzvedni.step2.text__en',
   'Click the link in the email and download the photos in full quality. I recommend downloading everything at once as a ZIP archive.',
   'Click the link in the email and download the photos in full quality. I recommend downloading everything at once as a ZIP archive.'),

  -- ── STEP 3 ──
  ('majdamartinska', 'vyzvedni.step3.title__en',
   'Didn''t get the link or it expired?',
   'Didn''t get the link or it expired?'),

  ('majdamartinska', 'vyzvedni.step3.text__en',
   'Reach out by email or via the contact form and we''ll arrange a new link.',
   'Reach out by email or via the contact form and we''ll arrange a new link.')

ON CONFLICT (project_id, section_id) DO UPDATE SET
  draft_text = EXCLUDED.draft_text,
  published_text = EXCLUDED.published_text,
  updated_at = NOW();

-- Hotovo! Po načtení této SQL bude /vyzvedni-fotky kompletně přeložená do EN.
