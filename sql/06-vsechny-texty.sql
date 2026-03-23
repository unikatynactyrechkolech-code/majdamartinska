-- 06-vsechny-texty.sql
-- Vložení VŠECH textů webu do databáze
-- Spustit v Supabase SQL Editor
-- POZOR: Pokud už máte data z 03-texty.sql a 05-texty-podstranky.sql, spusťte POUZE tento soubor
-- Použije ON CONFLICT = pokud text už existuje, přeskočí ho

-- ============================================
-- NAVIGACE
-- ============================================
INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  ('majdamartinska', 'nav.logo.name', 'MAJDA MARTINSKÁ', 'MAJDA MARTINSKÁ'),
  ('majdamartinska', 'nav.logo.subtitle', 'FOTOGRAFKA', 'FOTOGRAFKA'),
  ('majdamartinska', 'nav.item.uvod', 'Úvod', 'Úvod'),
  ('majdamartinska', 'nav.item.portfolio', 'Portfolio', 'Portfolio'),
  ('majdamartinska', 'nav.item.sluzby', 'Služby', 'Služby'),
  ('majdamartinska', 'nav.item.omne', 'Kdo jsem', 'Kdo jsem'),
  ('majdamartinska', 'nav.item.recenze', 'Recenze', 'Recenze'),
  ('majdamartinska', 'nav.item.kontakt', 'Kontakt', 'Kontakt')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- ============================================
-- FOOTER
-- ============================================
INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  ('majdamartinska', 'footer.brand.name', 'Majda Martinská', 'Majda Martinská'),
  ('majdamartinska', 'footer.brand.subtitle', 'Fotografka — Praha Suchdol', 'Fotografka — Praha Suchdol'),
  ('majdamartinska', 'footer.nav.heading', 'NAVIGACE', 'NAVIGACE'),
  ('majdamartinska', 'footer.nav.uvod', 'Úvod', 'Úvod'),
  ('majdamartinska', 'footer.nav.portfolio', 'Portfolio', 'Portfolio'),
  ('majdamartinska', 'footer.nav.sluzby', 'Služby', 'Služby'),
  ('majdamartinska', 'footer.nav.omne', 'Kdo jsem', 'Kdo jsem'),
  ('majdamartinska', 'footer.nav.recenze', 'Recenze', 'Recenze'),
  ('majdamartinska', 'footer.nav.kontakt', 'Kontakt', 'Kontakt'),
  ('majdamartinska', 'footer.contact.heading', 'KONTAKT', 'KONTAKT'),
  ('majdamartinska', 'footer.contact.email', 'martinskafoto@gmail.com', 'martinskafoto@gmail.com'),
  ('majdamartinska', 'footer.contact.address', 'Magdaléna Martinská<br />Nad Spáleným mlýnem 466/3<br />165 00 Praha — Suchdol<br />IČ 87765403', 'Magdaléna Martinská<br />Nad Spáleným mlýnem 466/3<br />165 00 Praha — Suchdol<br />IČ 87765403'),
  ('majdamartinska', 'footer.copyright', '© Majda Martinská 2026', '© Majda Martinská 2026')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- ============================================
-- HOMEPAGE - doplnění chybějících (tlačítka, CTAs)
-- ============================================
INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  ('majdamartinska', 'home.hero.btn', 'Mám zájem', 'Mám zájem'),
  ('majdamartinska', 'home.promise.btn', 'Napište mi →', 'Napište mi →'),
  ('majdamartinska', 'home.gallery.label', 'PORTFOLIO', 'PORTFOLIO'),
  ('majdamartinska', 'home.service1.cta', 'ZOBRAZIT →', 'ZOBRAZIT →'),
  ('majdamartinska', 'home.service2.cta', 'ZOBRAZIT →', 'ZOBRAZIT →'),
  ('majdamartinska', 'home.service3.cta', 'ZOBRAZIT →', 'ZOBRAZIT →'),
  ('majdamartinska', 'home.about.btn1', 'Více o mně', 'Více o mně'),
  ('majdamartinska', 'home.about.btn2', 'Kontakt', 'Kontakt'),
  ('majdamartinska', 'home.more1.cta', 'INFORMACE →', 'INFORMACE →'),
  ('majdamartinska', 'home.more2.cta', 'INFORMACE →', 'INFORMACE →'),
  ('majdamartinska', 'home.more3.cta', 'INFORMACE →', 'INFORMACE →'),
  ('majdamartinska', 'home.studio.btn', 'Nahlédněte pod pokličku →', 'Nahlédněte pod pokličku →'),
  ('majdamartinska', 'home.cta.btn', 'Kontakt', 'Kontakt')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- ============================================
-- PAGE HERO titulky všech podstránek
-- ============================================
INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  ('majdamartinska', 'portfolio.hero.title', 'Portfolio', 'Portfolio'),
  ('majdamartinska', 'portfolio.hero.subtitle', 'Výběr z mé práce', 'Výběr z mé práce'),
  ('majdamartinska', 'recenze.hero.title', 'Recenze', 'Recenze'),
  ('majdamartinska', 'recenze.hero.subtitle', 'Co říkají moji klienti', 'Co říkají moji klienti'),
  ('majdamartinska', 'kontakt.hero.title', 'Kontakt', 'Kontakt'),
  ('majdamartinska', 'kontakt.hero.subtitle', 'Ozvěte se mi', 'Ozvěte se mi'),
  ('majdamartinska', 'omne.hero.title', 'O mně', 'O mně'),
  ('majdamartinska', 'omne.hero.subtitle', 'Kdo stojí za objektivem', 'Kdo stojí za objektivem'),
  ('majdamartinska', 'sluzby.hero.title', 'Služby', 'Služby'),
  ('majdamartinska', 'sluzby.hero.subtitle', 'Co pro vás mohu udělat', 'Co pro vás mohu udělat')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- ============================================
-- PORTFOLIO filtry
-- ============================================
INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  ('majdamartinska', 'portfolio.filter.all', 'Vše', 'Vše'),
  ('majdamartinska', 'portfolio.filter.rodinna', 'Rodinné', 'Rodinné'),
  ('majdamartinska', 'portfolio.filter.newborn', 'Newborn', 'Newborn'),
  ('majdamartinska', 'portfolio.filter.tehotenske', 'Těhotenské', 'Těhotenské'),
  ('majdamartinska', 'portfolio.filter.portret', 'Portréty', 'Portréty'),
  ('majdamartinska', 'portfolio.filter.svatby', 'Svatby', 'Svatby'),
  ('majdamartinska', 'portfolio.filter.psi', 'Pejsci', 'Pejsci')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- ============================================
-- RECENZE - všech 10 recenzí + CTA
-- ============================================
INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  ('majdamartinska', 'recenze.review1.text', '„Spolupracovat s Majdou byla naprostá paráda. S naším 14denním synem zacházela více než mateřsky. Fotografie jsou plné něhy, lásky a profesionality."', '„Spolupracovat s Majdou byla naprostá paráda. S naším 14denním synem zacházela více než mateřsky. Fotografie jsou plné něhy, lásky a profesionality."'),
  ('majdamartinska', 'recenze.review1.name', 'Bára M.', 'Bára M.'),
  ('majdamartinska', 'recenze.review1.type', 'Newborn focení', 'Newborn focení'),
  ('majdamartinska', 'recenze.review2.text', '„Majda je úžasná fotografka! Focení s ní bylo tak příjemné, že jsme zapomněli, že nás někdo fotí. Fotky jsou nádherné, přirozené a plné emocí. Doporučuji všem!"', '„Majda je úžasná fotografka! Focení s ní bylo tak příjemné, že jsme zapomněli, že nás někdo fotí. Fotky jsou nádherné, přirozené a plné emocí. Doporučuji všem!"'),
  ('majdamartinska', 'recenze.review2.name', 'Lucie K.', 'Lucie K.'),
  ('majdamartinska', 'recenze.review2.type', 'Rodinné focení', 'Rodinné focení'),
  ('majdamartinska', 'recenze.review3.text', '„Naprosto perfektní zážitek od začátku do konce. Majda je profesionálka se srdcem na správném místě. Náš malý spal jako dudlík a výsledky jsou k neuvěření."', '„Naprosto perfektní zážitek od začátku do konce. Majda je profesionálka se srdcem na správném místě. Náš malý spal jako dudlík a výsledky jsou k neuvěření."'),
  ('majdamartinska', 'recenze.review3.name', 'Tereza S.', 'Tereza S.'),
  ('majdamartinska', 'recenze.review3.type', 'Newborn focení', 'Newborn focení'),
  ('majdamartinska', 'recenze.review4.text', '„S Majdou jsme fotili naši svatbu a musím říct, že to bylo naprosto skvělé. Zachytila momenty, které bychom jinak propásli. Fotky jsou jako z filmu!"', '„S Majdou jsme fotili naši svatbu a musím říct, že to bylo naprosto skvělé. Zachytila momenty, které bychom jinak propásli. Fotky jsou jako z filmu!"'),
  ('majdamartinska', 'recenze.review4.name', 'Petra a Tomáš', 'Petra a Tomáš'),
  ('majdamartinska', 'recenze.review4.type', 'Svatební focení', 'Svatební focení'),
  ('majdamartinska', 'recenze.review5.text', '„Majda fotila naši Belly, byla z ní úplně nadšená. Fotky jsou krásné a zachycují její osobnost dokonale. Super zážitek!"', '„Majda fotila naši Belly, byla z ní úplně nadšená. Fotky jsou krásné a zachycují její osobnost dokonale. Super zážitek!"'),
  ('majdamartinska', 'recenze.review5.name', 'Jana H.', 'Jana H.'),
  ('majdamartinska', 'recenze.review5.type', 'Focení psího kamaráda', 'Focení psího kamaráda'),
  ('majdamartinska', 'recenze.review6.text', '„Děkujeme za krásné těhotenské fotky! Majda nás vedla, radila s pózami a výsledek je překrásný. Budeme se k fotkám rádi vracet."', '„Děkujeme za krásné těhotenské fotky! Majda nás vedla, radila s pózami a výsledek je překrásný. Budeme se k fotkám rádi vracet."'),
  ('majdamartinska', 'recenze.review6.name', 'Markéta P.', 'Markéta P.'),
  ('majdamartinska', 'recenze.review6.type', 'Těhotenské focení', 'Těhotenské focení'),
  ('majdamartinska', 'recenze.review7.text', '„Focení s Majdou bylo naprosto bezstarostné. Přišli jsme, bavili se a odcházeli s pocitem, že to byl skvělý výlet, ne focení. A fotky? Dokonalé!"', '„Focení s Majdou bylo naprosto bezstarostné. Přišli jsme, bavili se a odcházeli s pocitem, že to byl skvělý výlet, ne focení. A fotky? Dokonalé!"'),
  ('majdamartinska', 'recenze.review7.name', 'Karolína V.', 'Karolína V.'),
  ('majdamartinska', 'recenze.review7.type', 'Rodinné focení', 'Rodinné focení'),
  ('majdamartinska', 'recenze.review8.text', '„Majda je neuvěřitelně šikovná a milá. Náš dvouletý syn ji zbožňoval a to se projevilo i na fotkách — jsou plné smíchu a radosti."', '„Majda je neuvěřitelně šikovná a milá. Náš dvouletý syn ji zbožňoval a to se projevilo i na fotkách — jsou plné smíchu a radosti."'),
  ('majdamartinska', 'recenze.review8.name', 'Eva D.', 'Eva D.'),
  ('majdamartinska', 'recenze.review8.type', 'Rodinné focení', 'Rodinné focení'),
  ('majdamartinska', 'recenze.review9.text', '„Profesionální přístup od prvního kontaktu. Majda přesně věděla, co dělá, a výsledek předčil naše očekávání. Určitě se vrátíme!"', '„Profesionální přístup od prvního kontaktu. Majda přesně věděla, co dělá, a výsledek předčil naše očekávání. Určitě se vrátíme!"'),
  ('majdamartinska', 'recenze.review9.name', 'Martina B.', 'Martina B.'),
  ('majdamartinska', 'recenze.review9.type', 'Portrétní focení', 'Portrétní focení'),
  ('majdamartinska', 'recenze.review10.text', '„Největší pochvala? Naše tříletá dcera se ptá, kdy zase půjdeme k Majdě fotit. To mluví za vše!"', '„Největší pochvala? Naše tříletá dcera se ptá, kdy zase půjdeme k Majdě fotit. To mluví za vše!"'),
  ('majdamartinska', 'recenze.review10.name', 'Simona R.', 'Simona R.'),
  ('majdamartinska', 'recenze.review10.type', 'Rodinné focení', 'Rodinné focení'),
  ('majdamartinska', 'recenze.cta.title', 'Pojďme <em>do toho</em>', 'Pojďme <em>do toho</em>'),
  ('majdamartinska', 'recenze.cta.btn', 'Napište mi', 'Napište mi')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- ============================================
-- KONTAKT - doplnění chybějících
-- ============================================
INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  ('majdamartinska', 'kontakt.label.email', 'E-mail', 'E-mail'),
  ('majdamartinska', 'kontakt.label.telefon', 'Telefon', 'Telefon'),
  ('majdamartinska', 'kontakt.label.atelier', 'Ateliér', 'Ateliér'),
  ('majdamartinska', 'kontakt.social.label', 'Sledujte mě', 'Sledujte mě'),
  ('majdamartinska', 'kontakt.social.instagram', 'Instagram', 'Instagram'),
  ('majdamartinska', 'kontakt.social.facebook', 'Facebook', 'Facebook'),
  ('majdamartinska', 'kontakt.studio.label', 'ATELIÉR', 'ATELIÉR'),
  ('majdamartinska', 'kontakt.studio.title', 'Ateliér <em>Praha Suchdol</em>', 'Ateliér <em>Praha Suchdol</em>'),
  ('majdamartinska', 'kontakt.studio.text', 'Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol. Ideální pro newborn, rodinné i portrétní focení.', 'Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol. Ideální pro newborn, rodinné i portrétní focení.'),
  ('majdamartinska', 'kontakt.studio.btn', 'Nahlédněte pod pokličku →', 'Nahlédněte pod pokličku →')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- ============================================
-- O MNĚ - doplnění chybějících
-- ============================================
INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  ('majdamartinska', 'omne.studio.label', 'ATELIÉR', 'ATELIÉR'),
  ('majdamartinska', 'omne.studio.title', 'Ateliér <em>Praha Suchdol</em>', 'Ateliér <em>Praha Suchdol</em>'),
  ('majdamartinska', 'omne.studio.btn', 'Nahlédněte pod pokličku →', 'Nahlédněte pod pokličku →'),
  ('majdamartinska', 'omne.cta.title', 'Pojďme <em>do toho</em>', 'Pojďme <em>do toho</em>'),
  ('majdamartinska', 'omne.cta.btn', 'Kontaktujte mě', 'Kontaktujte mě')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- ============================================
-- SLUŽBY - doplnění chybějících (list items, tlačítka, CTA)
-- ============================================
INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  -- Rodinné list items
  ('majdamartinska', 'sluzby.rodinna.li1', 'Rodinné focení / párové focení', 'Rodinné focení / párové focení'),
  ('majdamartinska', 'sluzby.rodinna.li2', 'V exteriéru nebo v ateliéru', 'V exteriéru nebo v ateliéru'),
  ('majdamartinska', 'sluzby.rodinna.li3', 'Cca 1–1,5 hodiny focení', 'Cca 1–1,5 hodiny focení'),
  ('majdamartinska', 'sluzby.rodinna.li4', '50+ upravených fotografií', '50+ upravených fotografií'),
  ('majdamartinska', 'sluzby.rodinna.btn', 'Mám zájem', 'Mám zájem'),
  -- Newborn list items
  ('majdamartinska', 'sluzby.newborn.li1', 'Newborn focení (5–14 dní)', 'Newborn focení (5–14 dní)'),
  ('majdamartinska', 'sluzby.newborn.li2', 'V ateliéru Praha Suchdol', 'V ateliéru Praha Suchdol'),
  ('majdamartinska', 'sluzby.newborn.li3', 'Cca 2–3 hodiny focení', 'Cca 2–3 hodiny focení'),
  ('majdamartinska', 'sluzby.newborn.li4', '30+ upravených fotografií', '30+ upravených fotografií'),
  ('majdamartinska', 'sluzby.newborn.btn', 'Mám zájem', 'Mám zájem'),
  -- Svatby list items
  ('majdamartinska', 'sluzby.svatby.li1', 'Svatební den — reportážní styl', 'Svatební den — reportážní styl'),
  ('majdamartinska', 'sluzby.svatby.li2', 'Přípravy, obřad, focení párů, hostina', 'Přípravy, obřad, focení párů, hostina'),
  ('majdamartinska', 'sluzby.svatby.li3', 'Celý den nebo jen část', 'Celý den nebo jen část'),
  ('majdamartinska', 'sluzby.svatby.li4', '200–500+ upravených fotografií', '200–500+ upravených fotografií'),
  ('majdamartinska', 'sluzby.svatby.btn', 'Mám zájem', 'Mám zájem'),
  -- Psi list items
  ('majdamartinska', 'sluzby.psi.li1', 'Focení psů a jejich páníčků', 'Focení psů a jejich páníčků'),
  ('majdamartinska', 'sluzby.psi.li2', 'V přírodě', 'V přírodě'),
  ('majdamartinska', 'sluzby.psi.li3', 'Cca 1 hodina focení', 'Cca 1 hodina focení'),
  ('majdamartinska', 'sluzby.psi.li4', '40+ upravených fotografií', '40+ upravených fotografií'),
  ('majdamartinska', 'sluzby.psi.btn', 'Mám zájem', 'Mám zájem'),
  -- Těhotenské list items
  ('majdamartinska', 'sluzby.tehotenske.li1', 'Těhotenské focení (30.–36. týden)', 'Těhotenské focení (30.–36. týden)'),
  ('majdamartinska', 'sluzby.tehotenske.li2', 'V ateliéru nebo venku', 'V ateliéru nebo venku'),
  ('majdamartinska', 'sluzby.tehotenske.li3', 'Cca 1 hodina focení', 'Cca 1 hodina focení'),
  ('majdamartinska', 'sluzby.tehotenske.li4', '30+ upravených fotografií', '30+ upravených fotografií'),
  ('majdamartinska', 'sluzby.tehotenske.btn', 'Mám zájem', 'Mám zájem'),
  -- Portréty list items
  ('majdamartinska', 'sluzby.portret.li1', 'Portrétní / profilové focení', 'Portrétní / profilové focení'),
  ('majdamartinska', 'sluzby.portret.li2', 'V ateliéru nebo venku', 'V ateliéru nebo venku'),
  ('majdamartinska', 'sluzby.portret.li3', 'Cca 45 min – 1 hodina', 'Cca 45 min – 1 hodina'),
  ('majdamartinska', 'sluzby.portret.li4', '20+ upravených fotografií', '20+ upravených fotografií'),
  ('majdamartinska', 'sluzby.portret.btn', 'Mám zájem', 'Mám zájem'),
  -- CTA
  ('majdamartinska', 'sluzby.cta.title', 'Pojďme <em>do toho</em>', 'Pojďme <em>do toho</em>'),
  ('majdamartinska', 'sluzby.cta.btn', 'Napište mi', 'Napište mi')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- ============================================
-- KONTAKTNÍ FORMULÁŘ
-- ============================================
INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  ('majdamartinska', 'form.label.name', 'Jméno', 'Jméno'),
  ('majdamartinska', 'form.label.email', 'Email', 'Email'),
  ('majdamartinska', 'form.label.phone', 'Telefon', 'Telefon'),
  ('majdamartinska', 'form.label.date', 'Datum focení', 'Datum focení'),
  ('majdamartinska', 'form.label.package', 'Zvolený balíček', 'Zvolený balíček'),
  ('majdamartinska', 'form.label.details', 'Další podrobnosti', 'Další podrobnosti'),
  ('majdamartinska', 'form.option.default', '— Vyberte —', '— Vyberte —'),
  ('majdamartinska', 'form.option.rodinna', 'Rodinné a portrétní focení', 'Rodinné a portrétní focení'),
  ('majdamartinska', 'form.option.newborn', 'Newborn — miminka', 'Newborn — miminka'),
  ('majdamartinska', 'form.option.svatby', 'Svatba', 'Svatba'),
  ('majdamartinska', 'form.option.tehotenske', 'Těhotenské focení', 'Těhotenské focení'),
  ('majdamartinska', 'form.option.psi', 'Focení pejsků', 'Focení pejsků'),
  ('majdamartinska', 'form.option.portret', 'Portréty', 'Portréty'),
  ('majdamartinska', 'form.option.jine', 'Jiné', 'Jiné'),
  ('majdamartinska', 'form.btn.submit', 'Odeslat poptávku', 'Odeslat poptávku')
ON CONFLICT (project_id, section_id) DO NOTHING;
