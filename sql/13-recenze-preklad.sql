-- =============================================
-- 13-recenze-preklad.sql
-- Anglické překlady recenzí — DOPLNÍ name_en, type_en, text_en
-- do existujících řádků v tabulce reviews podle jména.
--
-- POZN: stránka /recenze čte sloupce reviews.text_en, name_en, type_en
-- (NE __en suffix v page_content). Soubor 11-recenze-anglicky.sql
-- byl pro jiný (zastaralý) mechanismus a je možno ho ignorovat.
--
-- Spustit v Supabase SQL Editoru.
-- =============================================

-- 1) Pavla K. — Portrait
UPDATE reviews SET
  name_en = 'Pavla K.',
  type_en = 'Portrait photography',
  text_en = 'I asked Majda for photos for the website that presents my consultations. Although I''m friendly and communicative, I''m not the type who needs to show off in front of a camera at every opportunity. So purposeful posing is stepping out of my comfort zone for me. But with Majda the whole shoot went smoothly. Our meeting turned into a casual walk in nature, where you have space to take a breath and relax. So a few clicks of the camera don''t bother you anymore. On top of that Majda is very empathetic, patient, and has fresh ideas for locations and ways to position a person. You don''t have to feel like a puppet or a mannequin. When I received the result, I was moved in a single word. From my own photos I felt the same calm I''d experienced during the shoot — the kind I want to pass on to my own clients through my website. Even though some time has passed since the shoot with Majda, I still look at the photos with great gratitude and fondly remember our session together.'
WHERE name = 'Pavla K.';

-- 2) Anna B. (Prolhaná Anna) — Studio
UPDATE reviews SET
  name_en = 'Anna B. (Lying Anna)',
  type_en = 'Studio photography',
  text_en = 'I''ve been working with Majda for over 10 years. Besides studio, outdoor, and wedding photos, she now also offers video production. Apart from the wedding I''ve tried all her services and can only recommend. Majda has an incredible feel for atmosphere and the specific mood of a photo. She''s full of ideas, able to capture the personality of her subject through both photo and video. It never happened that she put me into unnatural positions or arranged poses. Shooting with her is fun and at the same time she''s a true professional — she handles both children and shy adults. I also love her free creative work — very imaginative, almost dreamlike photos.'
WHERE name = 'Anna B. (Prolhaná Anna)';

-- 3) Katka K. — Family
UPDATE reviews SET
  name_en = 'Katka K.',
  type_en = 'Family photography',
  text_en = 'Working with Majda is amazing. I have the honour from both sides. From the professional side there is absolutely nothing to fault. Her work is flawless. As a person she is a treasure — always smiling, full of ideas. She owns an amazing studio in which you feel like in a fairytale, and that''s what working with her is like too.'
WHERE name = 'Katka K.';

-- 4) Pavlína N. — Family
UPDATE reviews SET
  name_en = 'Pavlína N.',
  type_en = 'Family photography',
  text_en = 'Majda photographed us once in the studio and once she came to our home for the shoot. Majda has the talent to capture the right moment; the atmosphere during the shoot was very friendly and relaxed. We had an idea for a few photos in advance, the rest we left to Majda, who had plenty of great ideas. We received the photos quickly 🙂'
WHERE name = 'Pavlína N.';

-- 5) Jana H. — Family
UPDATE reviews SET
  name_en = 'Jana H.',
  type_en = 'Family photography',
  text_en = 'Anyone who knows Majda knows very well that she excels in many areas — and photography is definitely one of them. Every photo has soul and an idea. I''ve known Majda for a very long time and her work is truly perfect! I recommend her with all ten fingers!!!'
WHERE name = 'Jana H.';

-- 6) Michal L. — Family
UPDATE reviews SET
  name_en = 'Michal L.',
  type_en = 'Family photography',
  text_en = 'A very pleasant photo shoot and beautifully spent time. Pleasant communication and easy arrangement. The photographer has scouted several spots that are very nice for photos. She sent a preview of the photos on the day of the shoot, from which you can then choose. Edited photographs were delivered in less than a week. I can only recommend.'
WHERE name = 'Michal L.';

-- 7) Bára M. — Newborn
UPDATE reviews SET
  name_en = 'Bára M.',
  type_en = 'Newborn photography',
  text_en = 'Our collaboration with Majda was absolutely amazing. She handled our 14-day-old son more than maternally. The whole shoot was completely under her direction and my partner and I could calmly drink coffee and chat. ☺️ I can fully recommend Mrs. Majda Martinská — not only thanks to her amazing approach to our son, but mainly because her photographs are full of tenderness, love and professionalism. Once again thank you so much for the beautiful afternoon and wonderful memories in the form of gorgeous photographs. The Mareš family.'
WHERE name = 'Bára M.';

-- 8) Alice C. — Family
UPDATE reviews SET
  name_en = 'Alice C.',
  type_en = 'Family photography',
  text_en = 'Recommend to everyone!!!! A great photographer, photos that are created in a completely chill atmosphere. I''d need more stars for the rating — 5 ★ is too few in this case :o)'
WHERE name = 'Alice C.';

-- 9) Petra M. — Family (poetic review)
UPDATE reviews SET
  name_en = 'Petra M.',
  type_en = 'Family photography',
  text_en = 'I''d like to write just a few lines about whether everything went fine — well, from the start, I''m not telling you a fairy tale: at the agreed time of day we headed to the shoot, our initial nervousness was instantly blown away, all smiles, great karma, that they give you completely free of charge, you relax in a moment, then comes a lot of effort, the whole time full of laughter, everything on professional tracks; in the end the photos are beautiful, at which everyone is amazed, you don''t need to pull out a fox or a savings book; when you put the photos online, a stampede of viewers will knock you over. We can only recommend 🤗. Majda, thanks for everything, we''re off to show off.'
WHERE name = 'Petra M.';

-- 10) Iveta V. — Newborn
UPDATE reviews SET
  name_en = 'Iveta V.',
  type_en = 'Newborn photography',
  text_en = 'The newborn shoot at Majda''s was an absolute blast — I enjoyed it so much, even though I had big concerns beforehand because of the defiant phase of my three-year-old little troublemaker, who simply "doesn''t want to and won''t" be photographed. And yet Majda even managed to talk her into joint photos with her two-week-old little sister. It was an incredibly pleasantly spent time full of peace and calm, for which I''m enormously grateful and thanks to which we will forever have a beautiful memory. I''m really looking forward to our next meeting (hopefully Majda will still take us, once perhaps that defiance phase passes) for another shoot, which I''ll certainly gladly take advantage of at the earliest opportunity. Huge thanks for everything — the photos are gorgeous…'
WHERE name = 'Iveta V.';

-- Hotovo. Po spuštění bude /recenze v EN módu zobrazovat přeložené texty.
