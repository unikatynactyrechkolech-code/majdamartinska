-- =============================================
-- KOMPLETNÍ SQL PRO WEB MAJDA MARTINSKÁ
-- Zkopíruj CELÝ obsah a vlož do Supabase SQL Editor
-- Stiskni RUN
-- =============================================


-- 1) VYTVOŘIT TABULKU (pokud neexistuje)
CREATE TABLE IF NOT EXISTS page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL DEFAULT 'default',
  section_id TEXT NOT NULL,
  draft_text TEXT,
  published_text TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ,
  UNIQUE(project_id, section_id)
);

CREATE INDEX IF NOT EXISTS idx_page_content_project_section
  ON page_content (project_id, section_id);


-- 2) ZAPNOUT RLS
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;


-- 3) SMAZAT STARÉ POLICIES (aby nenarazily na duplicity)
DROP POLICY IF EXISTS "Allow public read" ON page_content;
DROP POLICY IF EXISTS "Allow public insert" ON page_content;
DROP POLICY IF EXISTS "Allow public update" ON page_content;


-- 4) VYTVOŘIT NOVÉ POLICIES
CREATE POLICY "Allow public read"
  ON page_content FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert"
  ON page_content FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update"
  ON page_content FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);


-- 5) VLOŽIT VŠECHNY TEXTY

-- HOMEPAGE
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
('majdamartinska', 'home.hero.label', 'RODINNÉ · SVATEBNÍ · NEWBORN FOCENÍ', 'RODINNÉ · SVATEBNÍ · NEWBORN FOCENÍ'),
('majdamartinska', 'home.hero.line1', 'Vaše', 'Vaše'),
('majdamartinska', 'home.hero.line2', 'příběhy', 'příběhy'),
('majdamartinska', 'home.hero.line3', 'zachycené navždy', 'zachycené navždy'),
('majdamartinska', 'home.hero.btn', 'Mám zájem', 'Mám zájem'),
('majdamartinska', 'home.promise.label', 'SLIBUJI VÁM', 'SLIBUJI VÁM'),
('majdamartinska', 'home.promise.title', 'Že focení bude přirozené & v pohodě', 'Že focení bude přirozené & v pohodě'),
('majdamartinska', 'home.promise.text', 'Hledáte fotografku a zároveň pohodářku? Chcete si focení užít a neprotrpět? Jste na správném místě. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi při focení záleží.', 'Hledáte fotografku a zároveň pohodářku? Chcete si focení užít a neprotrpět? Jste na správném místě. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi při focení záleží.'),
('majdamartinska', 'home.promise.btn', 'Napište mi →', 'Napište mi →'),
('majdamartinska', 'home.gallery.label', 'PORTFOLIO', 'PORTFOLIO'),
('majdamartinska', 'home.services.label', 'MOJE SLUŽBY', 'MOJE SLUŽBY'),
('majdamartinska', 'home.services.title', 'Moje <em>práce</em>', 'Moje <em>práce</em>'),
('majdamartinska', 'home.service1.name', 'Rodinné a portrétní', 'Rodinné a portrétní'),
('majdamartinska', 'home.service1.cta', 'ZOBRAZIT →', 'ZOBRAZIT →'),
('majdamartinska', 'home.service2.name', 'Newborn — miminka', 'Newborn — miminka'),
('majdamartinska', 'home.service2.cta', 'ZOBRAZIT →', 'ZOBRAZIT →'),
('majdamartinska', 'home.service3.name', 'Svatby', 'Svatby'),
('majdamartinska', 'home.service3.cta', 'ZOBRAZIT →', 'ZOBRAZIT →'),
('majdamartinska', 'home.about.label', 'KDO STOJÍ ZA OBJEKTIVEM?', 'KDO STOJÍ ZA OBJEKTIVEM?'),
('majdamartinska', 'home.about.title', 'Ahoj,<br />jsem <em>Majda</em>', 'Ahoj,<br />jsem <em>Majda</em>'),
('majdamartinska', 'home.about.text', 'Focení mě lákalo od dětství. Mám ráda humor a to se objevuje i v mých fotografiích. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi záleží. Taky jsem dost upovídaná, takže kdo se bojí trapného ticha, nebude :)', 'Focení mě lákalo od dětství. Mám ráda humor a to se objevuje i v mých fotografiích. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi záleží. Taky jsem dost upovídaná, takže kdo se bojí trapného ticha, nebude :)'),
('majdamartinska', 'home.about.btn1', 'Více o mně', 'Více o mně'),
('majdamartinska', 'home.about.btn2', 'Kontakt', 'Kontakt'),
('majdamartinska', 'home.more1.title', 'Psí kamarádi', 'Psí kamarádi'),
('majdamartinska', 'home.more1.text', 'Máš doma mazlíka? Chceš ho mít na fotkách? Tož to tady jsi správně.', 'Máš doma mazlíka? Chceš ho mít na fotkách? Tož to tady jsi správně.'),
('majdamartinska', 'home.more1.cta', 'INFORMACE →', 'INFORMACE →'),
('majdamartinska', 'home.more2.title', 'Těhotenské focení', 'Těhotenské focení'),
('majdamartinska', 'home.more2.text', 'Krásné období, které si zaslouží zachytit na fotografiích.', 'Krásné období, které si zaslouží zachytit na fotografiích.'),
('majdamartinska', 'home.more2.cta', 'INFORMACE →', 'INFORMACE →'),
('majdamartinska', 'home.more3.title', 'Portréty', 'Portréty'),
('majdamartinska', 'home.more3.text', 'Profesionální portrétní fotografie pro vaši prezentaci i osobní účely.', 'Profesionální portrétní fotografie pro vaši prezentaci i osobní účely.'),
('majdamartinska', 'home.more3.cta', 'INFORMACE →', 'INFORMACE →'),
('majdamartinska', 'home.testimonials.label', 'MILÁ SLOVA', 'MILÁ SLOVA'),
('majdamartinska', 'home.testimonial.text', '„Spolupracovat s Majdou byla naprostá paráda. S naším 14denním synem zacházela více než mateřsky. Fotografie jsou plné něhy, lásky a profesionality."', '„Spolupracovat s Majdou byla naprostá paráda. S naším 14denním synem zacházela více než mateřsky. Fotografie jsou plné něhy, lásky a profesionality."'),
('majdamartinska', 'home.testimonial.name', 'Bára M.', 'Bára M.'),
('majdamartinska', 'home.testimonial.type', 'Newborn focení', 'Newborn focení'),
('majdamartinska', 'home.studio.label', 'ATELIÉR', 'ATELIÉR'),
('majdamartinska', 'home.studio.title', 'Ateliér <em>Praha Suchdol</em>', 'Ateliér <em>Praha Suchdol</em>'),
('majdamartinska', 'home.studio.text', 'Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol.', 'Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol.'),
('majdamartinska', 'home.studio.btn', 'Nahlédněte pod pokličku →', 'Nahlédněte pod pokličku →'),
('majdamartinska', 'home.cta.label', 'JSME NA PODOBNÉ VLNĚ?', 'JSME NA PODOBNÉ VLNĚ?'),
('majdamartinska', 'home.cta.title', 'Pojďme <em>do toho</em>', 'Pojďme <em>do toho</em>'),
('majdamartinska', 'home.cta.btn', 'Kontakt', 'Kontakt')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- NAVIGACE
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
('majdamartinska', 'nav.logo.name', 'MAJDA MARTINSKÁ', 'MAJDA MARTINSKÁ'),
('majdamartinska', 'nav.logo.subtitle', 'FOTOGRAFKA', 'FOTOGRAFKA'),
('majdamartinska', 'nav.item.uvod', 'Úvod', 'Úvod'),
('majdamartinska', 'nav.item.portfolio', 'Portfolio', 'Portfolio'),
('majdamartinska', 'nav.item.sluzby', 'Služby', 'Služby'),
('majdamartinska', 'nav.item.omne', 'Kdo jsem', 'Kdo jsem'),
('majdamartinska', 'nav.item.recenze', 'Recenze', 'Recenze'),
('majdamartinska', 'nav.item.kontakt', 'Kontakt', 'Kontakt')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- FOOTER
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
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

-- PAGE HERO - titulky podstránek
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
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

-- PORTFOLIO filtry
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
('majdamartinska', 'portfolio.filter.all', 'Vše', 'Vše'),
('majdamartinska', 'portfolio.filter.rodinna', 'Rodinné', 'Rodinné'),
('majdamartinska', 'portfolio.filter.newborn', 'Newborn', 'Newborn'),
('majdamartinska', 'portfolio.filter.tehotenske', 'Těhotenské', 'Těhotenské'),
('majdamartinska', 'portfolio.filter.portret', 'Portréty', 'Portréty'),
('majdamartinska', 'portfolio.filter.svatby', 'Svatby', 'Svatby'),
('majdamartinska', 'portfolio.filter.psi', 'Pejsci', 'Pejsci')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- KONTAKT
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
('majdamartinska', 'kontakt.info.title', 'Pojďme se <em>spojit</em>', 'Pojďme se <em>spojit</em>'),
('majdamartinska', 'kontakt.info.text', 'Máte zájem o focení, nebo se chcete na něco zeptat? Napište mi prostřednictvím formuláře, e-mailem nebo na sociální sítě. Ozvu se vám co nejdříve!', 'Máte zájem o focení, nebo se chcete na něco zeptat? Napište mi prostřednictvím formuláře, e-mailem nebo na sociální sítě. Ozvu se vám co nejdříve!'),
('majdamartinska', 'kontakt.email', 'majda@majdamartinska.com', 'majda@majdamartinska.com'),
('majdamartinska', 'kontakt.telefon', '+420 123 456 789', '+420 123 456 789'),
('majdamartinska', 'kontakt.adresa', 'Praha — Suchdol', 'Praha — Suchdol'),
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

-- O MNĚ
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
('majdamartinska', 'omne.intro.title', 'Ahoj, jsem <em>Majda</em>', 'Ahoj, jsem <em>Majda</em>'),
('majdamartinska', 'omne.intro.text1', 'Focení mě lákalo od dětství — tenkrát jsem běhala po zahradě s foťákem od babičky a fotila všechno, co se hýbalo (většinou kočky, které se hýbat nechtěly).', 'Focení mě lákalo od dětství — tenkrát jsem běhala po zahradě s foťákem od babičky a fotila všechno, co se hýbalo (většinou kočky, které se hýbat nechtěly).'),
('majdamartinska', 'omne.intro.text2', 'Jsem Majda, rodinná a newborn fotografka z Prahy. Focení je pro mě víc než práce — je to způsob, jak zachytit momenty, na které budete jednou vzpomínat s úsměvem.', 'Jsem Majda, rodinná a newborn fotografka z Prahy. Focení je pro mě víc než práce — je to způsob, jak zachytit momenty, na které budete jednou vzpomínat s úsměvem.'),
('majdamartinska', 'omne.intro.text3', 'Mám ráda humor a to se objevuje i v mých fotografiích. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi záleží. Taky jsem dost upovídaná, takže kdo se bojí trapného ticha, nemusí :)', 'Mám ráda humor a to se objevuje i v mých fotografiích. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi záleží. Taky jsem dost upovídaná, takže kdo se bojí trapného ticha, nemusí :)'),
('majdamartinska', 'omne.reasons.label', 'PROČ PRÁVĚ JÁ?', 'PROČ PRÁVĚ JÁ?'),
('majdamartinska', 'omne.reasons.title', '10 důvodů, proč <em>fotit se mnou</em>', '10 důvodů, proč <em>fotit se mnou</em>'),
('majdamartinska', 'omne.reason1.title', 'Přirozené fotky', 'Přirozené fotky'),
('majdamartinska', 'omne.reason1.text', 'Žádné strojené pózy. Zachycuji skutečné emoce a momenty, které jsou autentické a krásné.', 'Žádné strojené pózy. Zachycuji skutečné emoce a momenty, které jsou autentické a krásné.'),
('majdamartinska', 'omne.reason2.title', 'Pohodová atmosféra', 'Pohodová atmosféra'),
('majdamartinska', 'omne.reason2.text', 'U mě se nemusíte bát. Focení bude v pohodě, s humorem a bez stresu.', 'U mě se nemusíte bát. Focení bude v pohodě, s humorem a bez stresu.'),
('majdamartinska', 'omne.reason3.title', 'Zkušenost s dětmi', 'Zkušenost s dětmi'),
('majdamartinska', 'omne.reason3.text', 'Děti mě milují (a já je). Vím, jak je zaujmout a zachytit ty nejkrásnější momenty.', 'Děti mě milují (a já je). Vím, jak je zaujmout a zachytit ty nejkrásnější momenty.'),
('majdamartinska', 'omne.reason4.title', 'Profesionální vybavení', 'Profesionální vybavení'),
('majdamartinska', 'omne.reason4.text', 'Fotím na profesionální techniku Canon a disponuji vlastním ateliérem v Praze.', 'Fotím na profesionální techniku Canon a disponuji vlastním ateliérem v Praze.'),
('majdamartinska', 'omne.reason5.title', 'Vlastní ateliér', 'Vlastní ateliér'),
('majdamartinska', 'omne.reason5.text', 'Velký a dobře vybavený ateliér v klidné části Prahy — Suchdol. Ideální pro newborn a rodinné focení.', 'Velký a dobře vybavený ateliér v klidné části Prahy — Suchdol. Ideální pro newborn a rodinné focení.'),
('majdamartinska', 'omne.reason6.title', 'Rychlé dodání', 'Rychlé dodání'),
('majdamartinska', 'omne.reason6.text', 'Fotografie máte do 2–3 týdnů. Náhled do pár dní.', 'Fotografie máte do 2–3 týdnů. Náhled do pár dní.'),
('majdamartinska', 'omne.reason7.title', 'Konzultace zdarma', 'Konzultace zdarma'),
('majdamartinska', 'omne.reason7.text', 'Nevíte, co si vybrat? Napište mi a poradím vám, jaký typ focení je pro vás ten pravý.', 'Nevíte, co si vybrat? Napište mi a poradím vám, jaký typ focení je pro vás ten pravý.'),
('majdamartinska', 'omne.reason8.title', 'Férové ceny', 'Férové ceny'),
('majdamartinska', 'omne.reason8.text', 'Kvalitní fotky za rozumné peníze. Žádné skryté poplatky.', 'Kvalitní fotky za rozumné peníze. Žádné skryté poplatky.'),
('majdamartinska', 'omne.reason9.title', 'Individuální přístup', 'Individuální přístup'),
('majdamartinska', 'omne.reason9.text', 'Každé focení přizpůsobuji vám — vašim potřebám, představám a náladě.', 'Každé focení přizpůsobuji vám — vašim potřebám, představám a náladě.'),
('majdamartinska', 'omne.reason10.title', 'Vášeň a láska', 'Vášeň a láska'),
('majdamartinska', 'omne.reason10.text', 'Focení je moje vášeň. A to je na výsledcích vidět. Každý klient je pro mě jedinečný.', 'Focení je moje vášeň. A to je na výsledcích vidět. Každý klient je pro mě jedinečný.'),
('majdamartinska', 'omne.studio.label', 'ATELIÉR', 'ATELIÉR'),
('majdamartinska', 'omne.studio.title', 'Ateliér <em>Praha Suchdol</em>', 'Ateliér <em>Praha Suchdol</em>'),
('majdamartinska', 'omne.studio.text', 'Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol. Je vhodný pro newborn focení, rodinné focení, portrétní focení i pro focení těhotných.', 'Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol. Je vhodný pro newborn focení, rodinné focení, portrétní focení i pro focení těhotných.'),
('majdamartinska', 'omne.studio.btn', 'Nahlédněte pod pokličku →', 'Nahlédněte pod pokličku →'),
('majdamartinska', 'omne.cta.label', 'ZAUJALA JSEM VÁS?', 'ZAUJALA JSEM VÁS?'),
('majdamartinska', 'omne.cta.title', 'Pojďme <em>do toho</em>', 'Pojďme <em>do toho</em>'),
('majdamartinska', 'omne.cta.btn', 'Kontaktujte mě', 'Kontaktujte mě')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- SLUŽBY
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
('majdamartinska', 'sluzby.rodinna.title', 'Rodinné a <em>párové focení</em>', 'Rodinné a <em>párové focení</em>'),
('majdamartinska', 'sluzby.rodinna.text', 'Focení rodin, párů, sourozenců, kamarádů. Prostě všech, kteří se mají rádi a chtějí si to připomenout i za 10 let. Focení probíhá většinou venku v přírodě, nebo v mém ateliéru na Suchdole. Rodinné focení trvá cca 1–1,5 h.', 'Focení rodin, párů, sourozenců, kamarádů. Prostě všech, kteří se mají rádi a chtějí si to připomenout i za 10 let. Focení probíhá většinou venku v přírodě, nebo v mém ateliéru na Suchdole. Rodinné focení trvá cca 1–1,5 h.'),
('majdamartinska', 'sluzby.rodinna.cena', 'od 3 900 Kč', 'od 3 900 Kč'),
('majdamartinska', 'sluzby.rodinna.li1', 'Rodinné focení / párové focení', 'Rodinné focení / párové focení'),
('majdamartinska', 'sluzby.rodinna.li2', 'V exteriéru nebo v ateliéru', 'V exteriéru nebo v ateliéru'),
('majdamartinska', 'sluzby.rodinna.li3', 'Cca 1–1,5 hodiny focení', 'Cca 1–1,5 hodiny focení'),
('majdamartinska', 'sluzby.rodinna.li4', '50+ upravených fotografií', '50+ upravených fotografií'),
('majdamartinska', 'sluzby.rodinna.btn', 'Mám zájem', 'Mám zájem'),
('majdamartinska', 'sluzby.newborn.title', 'Newborn — <em>miminka</em>', 'Newborn — <em>miminka</em>'),
('majdamartinska', 'sluzby.newborn.text', 'Newborn focení je zaměřené na novorozence ve věku 5–14 dní. V tomto období jsou miminka ještě hodně ospalá a dají se krásně tvarovat do různých pozic. Focení probíhá v mém ateliéru, kde je teplo, klid a vše potřebné.', 'Newborn focení je zaměřené na novorozence ve věku 5–14 dní. V tomto období jsou miminka ještě hodně ospalá a dají se krásně tvarovat do různých pozic. Focení probíhá v mém ateliéru, kde je teplo, klid a vše potřebné.'),
('majdamartinska', 'sluzby.newborn.cena', 'od 4 900 Kč', 'od 4 900 Kč'),
('majdamartinska', 'sluzby.newborn.li1', 'Newborn focení (5–14 dní)', 'Newborn focení (5–14 dní)'),
('majdamartinska', 'sluzby.newborn.li2', 'V ateliéru Praha Suchdol', 'V ateliéru Praha Suchdol'),
('majdamartinska', 'sluzby.newborn.li3', 'Cca 2–3 hodiny focení', 'Cca 2–3 hodiny focení'),
('majdamartinska', 'sluzby.newborn.li4', '30+ upravených fotografií', '30+ upravených fotografií'),
('majdamartinska', 'sluzby.newborn.btn', 'Mám zájem', 'Mám zájem'),
('majdamartinska', 'sluzby.svatby.title', 'Svatební <em>focení</em>', 'Svatební <em>focení</em>'),
('majdamartinska', 'sluzby.svatby.text', 'Váš velký den si zaslouží být zachycen přirozeně a s citem. Focím reportážním stylem — žádné nucené pózy, ale skutečné emoce a momenty, které byste jinak zapomněli.', 'Váš velký den si zaslouží být zachycen přirozeně a s citem. Focím reportážním stylem — žádné nucené pózy, ale skutečné emoce a momenty, které byste jinak zapomněli.'),
('majdamartinska', 'sluzby.svatby.cena', 'od 15 000 Kč', 'od 15 000 Kč'),
('majdamartinska', 'sluzby.svatby.li1', 'Svatební den — reportážní styl', 'Svatební den — reportážní styl'),
('majdamartinska', 'sluzby.svatby.li2', 'Přípravy, obřad, focení párů, hostina', 'Přípravy, obřad, focení párů, hostina'),
('majdamartinska', 'sluzby.svatby.li3', 'Celý den nebo jen část', 'Celý den nebo jen část'),
('majdamartinska', 'sluzby.svatby.li4', '200–500+ upravených fotografií', '200–500+ upravených fotografií'),
('majdamartinska', 'sluzby.svatby.btn', 'Mám zájem', 'Mám zájem'),
('majdamartinska', 'sluzby.psi.title', 'Psí <em>kamarádi</em>', 'Psí <em>kamarádi</em>'),
('majdamartinska', 'sluzby.psi.text', 'Máš doma mazlíka, co ti dělá radost? Focení psích kamarádů (a samozřejmě i s jejich páníčky) je něco, co mě neskutečně baví. Focení probíhá venku v přírodě.', 'Máš doma mazlíka, co ti dělá radost? Focení psích kamarádů (a samozřejmě i s jejich páníčky) je něco, co mě neskutečně baví. Focení probíhá venku v přírodě.'),
('majdamartinska', 'sluzby.psi.cena', 'od 3 500 Kč', 'od 3 500 Kč'),
('majdamartinska', 'sluzby.psi.li1', 'Focení psů a jejich páníčků', 'Focení psů a jejich páníčků'),
('majdamartinska', 'sluzby.psi.li2', 'V přírodě', 'V přírodě'),
('majdamartinska', 'sluzby.psi.li3', 'Cca 1 hodina focení', 'Cca 1 hodina focení'),
('majdamartinska', 'sluzby.psi.li4', '40+ upravených fotografií', '40+ upravených fotografií'),
('majdamartinska', 'sluzby.psi.btn', 'Mám zájem', 'Mám zájem'),
('majdamartinska', 'sluzby.tehotenske.title', 'Těhotenské <em>focení</em>', 'Těhotenské <em>focení</em>'),
('majdamartinska', 'sluzby.tehotenske.text', 'Krásné období, které si zaslouží zachytit na fotografiích. Těhotenské focení je nejkrásnější kolem 30.–36. týdne těhotenství. Focení probíhá v ateliéru nebo v přírodě.', 'Krásné období, které si zaslouží zachytit na fotografiích. Těhotenské focení je nejkrásnější kolem 30.–36. týdne těhotenství. Focení probíhá v ateliéru nebo v přírodě.'),
('majdamartinska', 'sluzby.tehotenske.cena', 'od 3 500 Kč', 'od 3 500 Kč'),
('majdamartinska', 'sluzby.tehotenske.li1', 'Těhotenské focení (30.–36. týden)', 'Těhotenské focení (30.–36. týden)'),
('majdamartinska', 'sluzby.tehotenske.li2', 'V ateliéru nebo venku', 'V ateliéru nebo venku'),
('majdamartinska', 'sluzby.tehotenske.li3', 'Cca 1 hodina focení', 'Cca 1 hodina focení'),
('majdamartinska', 'sluzby.tehotenske.li4', '30+ upravených fotografií', '30+ upravených fotografií'),
('majdamartinska', 'sluzby.tehotenske.btn', 'Mám zájem', 'Mám zájem'),
('majdamartinska', 'sluzby.portret.title', 'Portrétní <em>focení</em>', 'Portrétní <em>focení</em>'),
('majdamartinska', 'sluzby.portret.text', 'Profesionální portrétní fotografie pro vaši osobní prezentaci, LinkedIn, nebo prostě jen proto, že chcete krásné fotky sebe. Focení probíhá v ateliéru i venku.', 'Profesionální portrétní fotografie pro vaši osobní prezentaci, LinkedIn, nebo prostě jen proto, že chcete krásné fotky sebe. Focení probíhá v ateliéru i venku.'),
('majdamartinska', 'sluzby.portret.cena', 'od 2 900 Kč', 'od 2 900 Kč'),
('majdamartinska', 'sluzby.portret.li1', 'Portrétní / profilové focení', 'Portrétní / profilové focení'),
('majdamartinska', 'sluzby.portret.li2', 'V ateliéru nebo venku', 'V ateliéru nebo venku'),
('majdamartinska', 'sluzby.portret.li3', 'Cca 45 min – 1 hodina', 'Cca 45 min – 1 hodina'),
('majdamartinska', 'sluzby.portret.li4', '20+ upravených fotografií', '20+ upravených fotografií'),
('majdamartinska', 'sluzby.portret.btn', 'Mám zájem', 'Mám zájem'),
('majdamartinska', 'sluzby.cta.label', 'NEVÁHEJTE', 'NEVÁHEJTE'),
('majdamartinska', 'sluzby.cta.title', 'Pojďme <em>do toho</em>', 'Pojďme <em>do toho</em>'),
('majdamartinska', 'sluzby.cta.btn', 'Napište mi', 'Napište mi')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- RECENZE
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
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
('majdamartinska', 'recenze.cta.label', 'CHCETE BÝT DALŠÍ?', 'CHCETE BÝT DALŠÍ?'),
('majdamartinska', 'recenze.cta.title', 'Pojďme <em>do toho</em>', 'Pojďme <em>do toho</em>'),
('majdamartinska', 'recenze.cta.btn', 'Napište mi', 'Napište mi')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- KONTAKTNÍ FORMULÁŘ
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
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
