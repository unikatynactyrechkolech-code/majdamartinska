-- 11-recenze-anglicky.sql
-- English translations for all 10 reviews on the /recenze page
-- Uses __en suffix convention for EditableText translations
-- Spustit v Supabase SQL Editor

INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  -- ============================================
  -- REVIEW 1 — Pavla K.
  -- ============================================
  ('majdamartinska', 'recenze.review1.text__en',
   '„I asked Majda for photos for my consulting website. Although I''m a friendly and communicative person, I''m not the type who needs to show off in front of a camera at every opportunity. So deliberate posing in front of a camera is stepping out of my comfort zone. But with Majda, the whole shoot went smoothly. Our meeting turned into a casual walk in nature, where you have space not only to breathe but also to relax. So a few clicks of the camera don''t even bother you anymore. Majda is very empathetic, patient and has fresh ideas for locations and ways to position a person. You don''t have to feel like a puppet or a mannequin. When I received the result, I was moved in one word. From my own photos I felt the same calm I experienced during the shoot and also want to pass on to my clients through my website. Although some time has passed since the shoot with Majda, I still look at the photos with great gratitude and fondly remember our session together."',
   '„I asked Majda for photos for my consulting website. Although I''m a friendly and communicative person, I''m not the type who needs to show off in front of a camera at every opportunity. So deliberate posing in front of a camera is stepping out of my comfort zone. But with Majda, the whole shoot went smoothly. Our meeting turned into a casual walk in nature, where you have space not only to breathe but also to relax. So a few clicks of the camera don''t even bother you anymore. Majda is very empathetic, patient and has fresh ideas for locations and ways to position a person. You don''t have to feel like a puppet or a mannequin. When I received the result, I was moved in one word. From my own photos I felt the same calm I experienced during the shoot and also want to pass on to my clients through my website. Although some time has passed since the shoot with Majda, I still look at the photos with great gratitude and fondly remember our session together."'),

  ('majdamartinska', 'recenze.review1.name__en', 'Pavla K.', 'Pavla K.'),
  ('majdamartinska', 'recenze.review1.type__en', 'Portrait photography', 'Portrait photography'),

  -- ============================================
  -- REVIEW 2 — Anna B. (Prolhaná Anna)
  -- ============================================
  ('majdamartinska', 'recenze.review2.text__en',
   '„I''ve been working with Majda for over 10 years. Besides studio photos, outdoor and wedding photography, she has now expanded her offer to include video production. Apart from weddings, I''ve tried all her services and can only recommend. Majda has an incredible sense for atmosphere and the specific mood of a photo. She''s full of ideas, able to capture the personality of the subject through photos or video. It never happened that she posed me in unnatural positions or arranged poses. Shooting with her is fun and at the same time she''s a great professional — she knows how to work with both children and shy adults. I also love her free creative work — very imaginative, almost dreamlike photos."',
   '„I''ve been working with Majda for over 10 years. Besides studio photos, outdoor and wedding photography, she has now expanded her offer to include video production. Apart from weddings, I''ve tried all her services and can only recommend. Majda has an incredible sense for atmosphere and the specific mood of a photo. She''s full of ideas, able to capture the personality of the subject through photos or video. It never happened that she posed me in unnatural positions or arranged poses. Shooting with her is fun and at the same time she''s a great professional — she knows how to work with both children and shy adults. I also love her free creative work — very imaginative, almost dreamlike photos."'),

  ('majdamartinska', 'recenze.review2.name__en', 'Anna B. (Lying Anna)', 'Anna B. (Lying Anna)'),
  ('majdamartinska', 'recenze.review2.type__en', 'Studio photography', 'Studio photography'),

  -- ============================================
  -- REVIEW 3 — Katka K.
  -- ============================================
  ('majdamartinska', 'recenze.review3.text__en',
   '„Working with Majda is amazing. I have the honor from both sides. From a professional standpoint, there is absolutely nothing to fault. Her work is perfect. As a person, she is a treasure. Always smiling, full of ideas. She owns an amazing studio where you feel like you''re in a fairy tale, and that''s exactly what her collaboration with you looks like."',
   '„Working with Majda is amazing. I have the honor from both sides. From a professional standpoint, there is absolutely nothing to fault. Her work is perfect. As a person, she is a treasure. Always smiling, full of ideas. She owns an amazing studio where you feel like you''re in a fairy tale, and that''s exactly what her collaboration with you looks like."'),

  ('majdamartinska', 'recenze.review3.name__en', 'Katka K.', 'Katka K.'),
  ('majdamartinska', 'recenze.review3.type__en', 'Family photography', 'Family photography'),

  -- ============================================
  -- REVIEW 4 — Pavlína N.
  -- ============================================
  ('majdamartinska', 'recenze.review4.text__en',
   '„Majda photographed us once in the studio and once she came to our home. Majda has the talent to capture the right moment, the atmosphere during the shoot was very friendly and relaxed. We had an idea for a few photos in advance, the rest we left to Majda, who had plenty of great ideas for shots. We received the photos quickly 🙂"',
   '„Majda photographed us once in the studio and once she came to our home. Majda has the talent to capture the right moment, the atmosphere during the shoot was very friendly and relaxed. We had an idea for a few photos in advance, the rest we left to Majda, who had plenty of great ideas for shots. We received the photos quickly 🙂"'),

  ('majdamartinska', 'recenze.review4.name__en', 'Pavlína N.', 'Pavlína N.'),
  ('majdamartinska', 'recenze.review4.type__en', 'Family photography', 'Family photography'),

  -- ============================================
  -- REVIEW 5 — Jana H.
  -- ============================================
  ('majdamartinska', 'recenze.review5.text__en',
   '„Anyone who knows Majda knows very well that she excels in many areas and photography is definitely one of them. Every photo has a soul and an idea. I''ve known Majda for a very long time and her work is truly flawless! I recommend with all ten fingers!!!"',
   '„Anyone who knows Majda knows very well that she excels in many areas and photography is definitely one of them. Every photo has a soul and an idea. I''ve known Majda for a very long time and her work is truly flawless! I recommend with all ten fingers!!!"'),

  ('majdamartinska', 'recenze.review5.name__en', 'Jana H.', 'Jana H.'),
  ('majdamartinska', 'recenze.review5.type__en', 'Family photography', 'Family photography'),

  -- ============================================
  -- REVIEW 6 — Michal L.
  -- ============================================
  ('majdamartinska', 'recenze.review6.text__en',
   '„Very pleasant photo shoot and beautifully spent time. Pleasant communication and smooth arrangement. The photographer has scouted several spots that are very nice for photos. The photographer sent a preview of photos on the day of the shoot, from which you can then choose. Edited photographs were delivered in less than a week. I can only recommend."',
   '„Very pleasant photo shoot and beautifully spent time. Pleasant communication and smooth arrangement. The photographer has scouted several spots that are very nice for photos. The photographer sent a preview of photos on the day of the shoot, from which you can then choose. Edited photographs were delivered in less than a week. I can only recommend."'),

  ('majdamartinska', 'recenze.review6.name__en', 'Michal L.', 'Michal L.'),
  ('majdamartinska', 'recenze.review6.type__en', 'Family photography', 'Family photography'),

  -- ============================================
  -- REVIEW 7 — Bára M.
  -- ============================================
  ('majdamartinska', 'recenze.review7.text__en',
   '„Our collaboration with Majda was absolutely amazing. She treated our 14-day-old son more than maternally. The entire shoot was completely in her hands and my partner and I could calmly drink coffee and chat. ☺️ I can fully recommend Mrs. Majda Martinská, not only thanks to her amazing approach to our son, but mainly because her photographs are full of tenderness, love and professionalism. Once again, thank you so much for the beautiful afternoon and wonderful memories in the form of gorgeous photographs. Marešová"',
   '„Our collaboration with Majda was absolutely amazing. She treated our 14-day-old son more than maternally. The entire shoot was completely in her hands and my partner and I could calmly drink coffee and chat. ☺️ I can fully recommend Mrs. Majda Martinská, not only thanks to her amazing approach to our son, but mainly because her photographs are full of tenderness, love and professionalism. Once again, thank you so much for the beautiful afternoon and wonderful memories in the form of gorgeous photographs. Marešová"'),

  ('majdamartinska', 'recenze.review7.name__en', 'Bára M.', 'Bára M.'),
  ('majdamartinska', 'recenze.review7.type__en', 'Newborn photography', 'Newborn photography'),

  -- ============================================
  -- REVIEW 8 — Alice C.
  -- ============================================
  ('majdamartinska', 'recenze.review8.text__en',
   '„I recommend to everyone!!!! Great photographer, photos that are created in an absolutely chill atmosphere. I would need more stars for the rating, 5 * is too few in this case :o)"',
   '„I recommend to everyone!!!! Great photographer, photos that are created in an absolutely chill atmosphere. I would need more stars for the rating, 5 * is too few in this case :o)"'),

  ('majdamartinska', 'recenze.review8.name__en', 'Alice C.', 'Alice C.'),
  ('majdamartinska', 'recenze.review8.type__en', 'Family photography', 'Family photography'),

  -- ============================================
  -- REVIEW 9 — Petra M.
  -- ============================================
  ('majdamartinska', 'recenze.review9.text__en',
   '„I''d like to write just a few lines about whether everything was okay, so from the beginning then — I''m not telling you a fairy tale — at the agreed time of day, we headed to the shoot, our initial stage fright was instantly shattered, all smiles, great karma, they give it to you completely free, you relax in no time, then comes a lot of hard work, the whole time full of laughter, everything on professional tracks, in the end the photos are beautiful, at which everyone marvels, you don''t need to pick a trick or a savings book, when you post the photos online, a flood of likes will knock you down. We can only recommend 🤗. Majda, thanks for everything, off we go to show off."',
   '„I''d like to write just a few lines about whether everything was okay, so from the beginning then — I''m not telling you a fairy tale — at the agreed time of day, we headed to the shoot, our initial stage fright was instantly shattered, all smiles, great karma, they give it to you completely free, you relax in no time, then comes a lot of hard work, the whole time full of laughter, everything on professional tracks, in the end the photos are beautiful, at which everyone marvels, you don''t need to pick a trick or a savings book, when you post the photos online, a flood of likes will knock you down. We can only recommend 🤗. Majda, thanks for everything, off we go to show off."'),

  ('majdamartinska', 'recenze.review9.name__en', 'Petra M.', 'Petra M.'),
  ('majdamartinska', 'recenze.review9.type__en', 'Family photography', 'Family photography'),

  -- ============================================
  -- REVIEW 10 — Iveta V.
  -- ============================================
  ('majdamartinska', 'recenze.review10.text__en',
   '„The newborn shoot at Majda''s was an absolute blast, I enjoyed it so much even though I had big concerns beforehand due to the defiant phase of my three-year-old troublemaker who simply "doesn''t want to and won''t" be photographed. Yet Majda even managed to persuade her to take joint photos with her two-week-old little sister. It was an incredibly pleasant time full of peace and calm, for which I am enormously grateful and thanks to which we will forever have a beautiful memory. I will be looking forward to our next meeting (hopefully Majda will still accept us once the defiance phase passes) for another shoot, which I will certainly gladly take advantage of at the earliest opportunity. Huge thanks for everything, the photos are gorgeous..."',
   '„The newborn shoot at Majda''s was an absolute blast, I enjoyed it so much even though I had big concerns beforehand due to the defiant phase of my three-year-old troublemaker who simply "doesn''t want to and won''t" be photographed. Yet Majda even managed to persuade her to take joint photos with her two-week-old little sister. It was an incredibly pleasant time full of peace and calm, for which I am enormously grateful and thanks to which we will forever have a beautiful memory. I will be looking forward to our next meeting (hopefully Majda will still accept us once the defiance phase passes) for another shoot, which I will certainly gladly take advantage of at the earliest opportunity. Huge thanks for everything, the photos are gorgeous..."'),

  ('majdamartinska', 'recenze.review10.name__en', 'Iveta V.', 'Iveta V.'),
  ('majdamartinska', 'recenze.review10.type__en', 'Newborn photography', 'Newborn photography')

ON CONFLICT (project_id, section_id) DO UPDATE SET
  draft_text = EXCLUDED.draft_text,
  published_text = EXCLUDED.published_text,
  updated_at = now();
