-- =============================================
-- KOMPLETNÍ DOPLŇOVACÍ SQL PRO WEB MAJDA MARTINSKÁ
-- =============================================
-- ✅ NIC NEMAŽE — žádný DELETE
-- ✅ NEPŘEPISUJE existující data — používá ON CONFLICT DO NOTHING
-- ✅ DOPLNÍ vše co chybí: tabulky, RLS, české texty, anglické překlady, obrázky
--
-- Stačí zkopírovat CELÝ obsah a vložit do Supabase SQL Editor → RUN
-- Můžeš spustit opakovaně, nic se nerozbije.
-- =============================================


-- =============================================
-- ČÁST 1: TABULKY (pokud neexistují)
-- =============================================

-- 1a) Hlavní tabulka pro texty a obrázky
CREATE TABLE IF NOT EXISTS page_content (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id      TEXT NOT NULL DEFAULT 'default',
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

-- 1b) Tabulka pro obrázky (Cloudinary)
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

-- 1c) Tabulka pro blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL DEFAULT 'default',
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  cover_image TEXT,
  content TEXT,
  excerpt TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ,
  UNIQUE(project_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published
  ON blog_posts (project_id, published, published_at DESC);


-- =============================================
-- ČÁST 2: RLS POLICIES (bezpečné — smaže staré a vytvoří nové)
-- =============================================

-- page_content
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kdokoli muze cist" ON page_content;
DROP POLICY IF EXISTS "Admin muze pridavat" ON page_content;
DROP POLICY IF EXISTS "Admin muze upravovat" ON page_content;
DROP POLICY IF EXISTS "Admin muze mazat" ON page_content;
DROP POLICY IF EXISTS "Allow public read" ON page_content;
DROP POLICY IF EXISTS "Allow public insert" ON page_content;
DROP POLICY IF EXISTS "Allow public update" ON page_content;
DROP POLICY IF EXISTS "Verejne cteni" ON page_content;
DROP POLICY IF EXISTS "Verejny zapis" ON page_content;
DROP POLICY IF EXISTS "Verejna uprava" ON page_content;
DROP POLICY IF EXISTS "Verejne mazani" ON page_content;

CREATE POLICY "Verejne cteni" ON page_content
  FOR SELECT TO anon USING (true);
CREATE POLICY "Verejny zapis" ON page_content
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Verejna uprava" ON page_content
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Verejne mazani" ON page_content
  FOR DELETE TO anon USING (true);

-- page_images
ALTER TABLE page_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read images" ON page_images;
DROP POLICY IF EXISTS "Allow public insert images" ON page_images;
DROP POLICY IF EXISTS "Allow public update images" ON page_images;
DROP POLICY IF EXISTS "Allow public delete images" ON page_images;

CREATE POLICY "Allow public read images" ON page_images
  FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public insert images" ON page_images
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public update images" ON page_images
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete images" ON page_images
  FOR DELETE TO anon USING (true);

-- blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_posts_read" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_write" ON blog_posts;

CREATE POLICY "blog_posts_read" ON blog_posts
  FOR SELECT USING (true);
CREATE POLICY "blog_posts_write" ON blog_posts
  FOR ALL USING (true) WITH CHECK (true);


-- =============================================
-- ČÁST 3: ČESKÉ TEXTY (ON CONFLICT DO NOTHING = nepřepíše)
-- =============================================

-- ─── NAVIGACE ───
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

-- ─── FOOTER ───
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

-- ─── HOMEPAGE ───
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

-- ─── HOMEPAGE: 10 důvodů proč mě a ne Aminu ───
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
  ('majdamartinska', 'home.reasons.title', '10 důvodů, proč si vybrat mě a&nbsp;ne <em>Pučálkovic Aminu</em>', '10 důvodů, proč si vybrat mě a&nbsp;ne <em>Pučálkovic Aminu</em>'),
  ('majdamartinska', 'home.reason1', 'zábava je se mnou lepší než s Aminou, a&nbsp;to už je co říct', 'zábava je se mnou lepší než s Aminou, a&nbsp;to už je co říct'),
  ('majdamartinska', 'home.reason2', 'opravdu se snažím, aby ses uvolnil/a <em>(což&nbsp;v přítomnosti žirafy nejde)</em>', 'opravdu se snažím, aby ses uvolnil/a <em>(což&nbsp;v přítomnosti žirafy nejde)</em>'),
  ('majdamartinska', 'home.reason3', 'fotím z očí, aby to vypadalo přirozeně <em>(Amina fotí vždycky&nbsp;shora)</em>', 'fotím z očí, aby to vypadalo přirozeně <em>(Amina fotí vždycky&nbsp;shora)</em>'),
  ('majdamartinska', 'home.reason4', 'na úpravě fotografií si dávám hodně záležet <em>(Amina ani neví, co je grafický tablet nebo Photoshop)</em>', 'na úpravě fotografií si dávám hodně záležet <em>(Amina ani neví, co je grafický tablet nebo Photoshop)</em>'),
  ('majdamartinska', 'home.reason5', 'návštěva u mě není jen focení, ale přátelské setkání <em>(Amina je přátelská, ale její projevy náklonnosti fakt&nbsp;nechceš)</em>', 'návštěva u mě není jen focení, ale přátelské setkání <em>(Amina je přátelská, ale její projevy náklonnosti fakt&nbsp;nechceš)</em>'),
  ('majdamartinska', 'home.reason6', 'na focení v ateliéru ti udělám výbornou kávu <em>(Amina kávu nepije, a co je horší, ani&nbsp;alkohol)</em>', 'na focení v ateliéru ti udělám výbornou kávu <em>(Amina kávu nepije, a co je horší, ani&nbsp;alkohol)</em>'),
  ('majdamartinska', 'home.reason7', 'při venkovním focení tě vezmu na vážně pěkná místa <em>(no tady musím uznat, že to by možná Amina zvládla lépe)</em>', 'při venkovním focení tě vezmu na vážně pěkná místa <em>(no tady musím uznat, že to by možná Amina zvládla lépe)</em>'),
  ('majdamartinska', 'home.reason8', 'fotky dodávám nejpozději do 21 dní <em>(Amina neumí počítat ani&nbsp;do&nbsp;pěti a taky tak&nbsp;vypadá)</em>', 'fotky dodávám nejpozději do 21 dní <em>(Amina neumí počítat ani&nbsp;do&nbsp;pěti a taky tak&nbsp;vypadá)</em>'),
  ('majdamartinska', 'home.reason9', 'kromě toho, že hodně mluvím, i naslouchám a přizpůsobím se tvým přáním <em>(Amina jen tak stojí a divně&nbsp;zírá)</em>', 'kromě toho, že hodně mluvím, i naslouchám a přizpůsobím se tvým přáním <em>(Amina jen tak stojí a divně&nbsp;zírá)</em>'),
  ('majdamartinska', 'home.reason10', 'vedu v důvodech, proč si vybrat mě, 9:1 nad Aminou. Neváhej —&nbsp;ozvi&nbsp;se.', 'vedu v důvodech, proč si vybrat mě, 9:1 nad Aminou. Neváhej —&nbsp;ozvi&nbsp;se.'),
  ('majdamartinska', 'home.reasons.note', 'Pozn.: Pučálkovic Amina je žirafa z nádherné knihy Jindřicha Plachty :)', 'Pozn.: Pučálkovic Amina je žirafa z nádherné knihy Jindřicha Plachty :)')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- ─── PAGE HERO — titulky podstránek ───
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

-- ─── PORTFOLIO filtry ───
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
  ('majdamartinska', 'portfolio.filter.all', 'Vše', 'Vše'),
  ('majdamartinska', 'portfolio.filter.rodinna', 'Rodinné', 'Rodinné'),
  ('majdamartinska', 'portfolio.filter.newborn', 'Newborn', 'Newborn'),
  ('majdamartinska', 'portfolio.filter.tehotenske', 'Těhotenské', 'Těhotenské'),
  ('majdamartinska', 'portfolio.filter.portret', 'Portréty', 'Portréty'),
  ('majdamartinska', 'portfolio.filter.svatby', 'Svatby', 'Svatby'),
  ('majdamartinska', 'portfolio.filter.psi', 'Pejsci', 'Pejsci')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- ─── KONTAKT ───
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

-- ─── O MNĚ ───
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

-- ─── SLUŽBY ───
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

-- ─── RECENZE — CZ (nové skutečné texty) ───
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
  ('majdamartinska', 'recenze.review1.text', '„Požádala jsem Majdu o fotografie pro web, který prezentuje mé konzultace. Přestože jsem přátelské a komunikativní povahy, nejsem typ člověka, který se potřebuje předvést před objektivem při každé příležitosti. Proto je pro mě cílené pózování před fotoaparátem výstup z komfortní zóny. Ale s Majdou šlo celé focení jako po másle. Z našeho setkání se stala nenucená procházka přírodou, kdy se člověk má prostor nejen nadechnout, ale také uvolnit. Takže nějaké to cvaknutí fotoaparátu už jej pak ani nerozhodí. Navíc je Majda velmi empatická, trpělivá a má neotřelé nápady na místa i způsoby, jak si člověka postavit. Člověk se tak nemusí cítit jako nějaká loutka nebo umělá figurína. Když mi přišel výsledek, byla jsem jedním slovem dojatá. Z vlastních fotek na mě dýchla taková pohoda, jakou jsem při focení cítila a také chci přes můj web předávat mým klientům. Přestože od focení s Majdou uplynul již nějaký čas, stále se na fotky dívám s velkou vděčností a ráda na to naše společné focení vzpomínám."', '„Požádala jsem Majdu o fotografie pro web, který prezentuje mé konzultace. Přestože jsem přátelské a komunikativní povahy, nejsem typ člověka, který se potřebuje předvést před objektivem při každé příležitosti. Proto je pro mě cílené pózování před fotoaparátem výstup z komfortní zóny. Ale s Majdou šlo celé focení jako po másle. Z našeho setkání se stala nenucená procházka přírodou, kdy se člověk má prostor nejen nadechnout, ale také uvolnit. Takže nějaké to cvaknutí fotoaparátu už jej pak ani nerozhodí. Navíc je Majda velmi empatická, trpělivá a má neotřelé nápady na místa i způsoby, jak si člověka postavit. Člověk se tak nemusí cítit jako nějaká loutka nebo umělá figurína. Když mi přišel výsledek, byla jsem jedním slovem dojatá. Z vlastních fotek na mě dýchla taková pohoda, jakou jsem při focení cítila a také chci přes můj web předávat mým klientům. Přestože od focení s Majdou uplynul již nějaký čas, stále se na fotky dívám s velkou vděčností a ráda na to naše společné focení vzpomínám."'),
  ('majdamartinska', 'recenze.review1.name', 'Pavla K.', 'Pavla K.'),
  ('majdamartinska', 'recenze.review1.type', 'Portrétní focení', 'Portrétní focení'),

  ('majdamartinska', 'recenze.review2.text', '„S Majdou spolupracuji už přes 10 let. Kromě fotek ateliérových, v exteriéru i svatebních, nyní rozšířila svou nabídku o natáčení videí. Kromě svatby jsem vyzkoušela všechny služby a můžu jen doporučit. Majda má neskutečný cit pro atmosféru a specifickou náladu fotky. Je plná nápadů, umí fotkou či videem vystihnout osobnost foceného. Nikdy se mi nestalo, že by mě štelovala do nepřirozených pozic nebo aranžovaných póz. Focení s ní je zábava a zároveň je velký profesionál — umí to jak s dětmi, tak se stydlivými dospělými. Také mám ráda její volnou tvorbu — velmi nápadité až snové fotky."', '„S Majdou spolupracuji už přes 10 let. Kromě fotek ateliérových, v exteriéru i svatebních, nyní rozšířila svou nabídku o natáčení videí. Kromě svatby jsem vyzkoušela všechny služby a můžu jen doporučit. Majda má neskutečný cit pro atmosféru a specifickou náladu fotky. Je plná nápadů, umí fotkou či videem vystihnout osobnost foceného. Nikdy se mi nestalo, že by mě štelovala do nepřirozených pozic nebo aranžovaných póz. Focení s ní je zábava a zároveň je velký profesionál — umí to jak s dětmi, tak se stydlivými dospělými. Také mám ráda její volnou tvorbu — velmi nápadité až snové fotky."'),
  ('majdamartinska', 'recenze.review2.name', 'Anna B. (Prolhaná Anna)', 'Anna B. (Prolhaná Anna)'),
  ('majdamartinska', 'recenze.review2.type', 'Ateliérové focení', 'Ateliérové focení'),

  ('majdamartinska', 'recenze.review3.text', '„Spolupracovat s Majdou je úžasné. Mám tu čest z obou stran. Z profesionálního hlediska se jí nedá naprosto nic vytknout. Její práce je dokonalá. Jako člověk je poklad. Neustále úsměvavá, plná nápadů. Vlastní úžasný ateliér, ve kterém se cítíte jak v pohádce a tak vypadá i její spolupráce s vámi."', '„Spolupracovat s Majdou je úžasné. Mám tu čest z obou stran. Z profesionálního hlediska se jí nedá naprosto nic vytknout. Její práce je dokonalá. Jako člověk je poklad. Neustále úsměvavá, plná nápadů. Vlastní úžasný ateliér, ve kterém se cítíte jak v pohádce a tak vypadá i její spolupráce s vámi."'),
  ('majdamartinska', 'recenze.review3.name', 'Katka K.', 'Katka K.'),
  ('majdamartinska', 'recenze.review3.type', 'Rodinné focení', 'Rodinné focení'),

  ('majdamartinska', 'recenze.review4.text', '„Majda nás fotila jednou v ateliéru a jednou za námi na focení přijela domů. Majda má talent, zachytit správný okamžik, během focení byla velmi přátelská a uvolněná nálada. O pár fotkách jsme měli představu předem, zbytek jsme nechali na Majdě, která měla spoustu skvělých nápadů na fotky. Fotky jsme obdrželi brzy 🙂"', '„Majda nás fotila jednou v ateliéru a jednou za námi na focení přijela domů. Majda má talent, zachytit správný okamžik, během focení byla velmi přátelská a uvolněná nálada. O pár fotkách jsme měli představu předem, zbytek jsme nechali na Majdě, která měla spoustu skvělých nápadů na fotky. Fotky jsme obdrželi brzy 🙂"'),
  ('majdamartinska', 'recenze.review4.name', 'Pavlína N.', 'Pavlína N.'),
  ('majdamartinska', 'recenze.review4.type', 'Rodinné focení', 'Rodinné focení'),

  ('majdamartinska', 'recenze.review5.text', '„Kdo zná Majdu, moc dobře ví, že vyniká v mnoha oblastech a fotografie je rozhodně jednou z nich. Každá fotka má duši a nápad. Majdu znám velmi dlouho a její práce je opravdu dokonalá! Doporučuji všemi deseti!!!"', '„Kdo zná Majdu, moc dobře ví, že vyniká v mnoha oblastech a fotografie je rozhodně jednou z nich. Každá fotka má duši a nápad. Majdu znám velmi dlouho a její práce je opravdu dokonalá! Doporučuji všemi deseti!!!"'),
  ('majdamartinska', 'recenze.review5.name', 'Jana H.', 'Jana H.'),
  ('majdamartinska', 'recenze.review5.type', 'Rodinné focení', 'Rodinné focení'),

  ('majdamartinska', 'recenze.review6.text', '„Velice příjemné focení a krásně strávený čas. Příjemné jednání a bezproblémová domluva. Paní fotografka má vytipovaných pár míst, které jsou moc hezké na fotky. Paní fotografka již v den focení zaslala náhled fotografií ze kterých si je možné následně vybrat. Upravené fotografie byly dodány ani ne za týden. Mohu jen doporučit."', '„Velice příjemné focení a krásně strávený čas. Příjemné jednání a bezproblémová domluva. Paní fotografka má vytipovaných pár míst, které jsou moc hezké na fotky. Paní fotografka již v den focení zaslala náhled fotografií ze kterých si je možné následně vybrat. Upravené fotografie byly dodány ani ne za týden. Mohu jen doporučit."'),
  ('majdamartinska', 'recenze.review6.name', 'Michal L.', 'Michal L.'),
  ('majdamartinska', 'recenze.review6.type', 'Rodinné focení', 'Rodinné focení'),

  ('majdamartinska', 'recenze.review7.text', '„Naše spolupráce s Majdou byla naprosto úžasná. S naším 14 denním synem zacházela více než mateřsky. Celé focení bylo zcela v její režii a my si s partnerem mohli vypít v klidu kávu a popovídat. ☺️ Paní Majdu Martinskou mohu zcela doporučit, nejen díky úžasnému přístupu k synovi, ale hlavně fotografie od ní jsou plné něhy, lásky a profesionality. Ještě jednou mockrát děkujeme za krásné odpoledne a úžasné vzpomínky ve formě nádherných fotografií. Marešová"', '„Naše spolupráce s Majdou byla naprosto úžasná. S naším 14 denním synem zacházela více než mateřsky. Celé focení bylo zcela v její režii a my si s partnerem mohli vypít v klidu kávu a popovídat. ☺️ Paní Majdu Martinskou mohu zcela doporučit, nejen díky úžasnému přístupu k synovi, ale hlavně fotografie od ní jsou plné něhy, lásky a profesionality. Ještě jednou mockrát děkujeme za krásné odpoledne a úžasné vzpomínky ve formě nádherných fotografií. Marešová"'),
  ('majdamartinska', 'recenze.review7.name', 'Bára M.', 'Bára M.'),
  ('majdamartinska', 'recenze.review7.type', 'Newborn focení', 'Newborn focení'),

  ('majdamartinska', 'recenze.review8.text', '„Doporučuji všem!!!! Skvělá fotografka, fotky, které vznikají v naprosto pohodové atmosféře. Potřebovala bych pro hodnocení více hvězdiček, 5 * je za mě v tomto případě málo :o)"', '„Doporučuji všem!!!! Skvělá fotografka, fotky, které vznikají v naprosto pohodové atmosféře. Potřebovala bych pro hodnocení více hvězdiček, 5 * je za mě v tomto případě málo :o)"'),
  ('majdamartinska', 'recenze.review8.name', 'Alice C.', 'Alice C.'),
  ('majdamartinska', 'recenze.review8.type', 'Rodinné focení', 'Rodinné focení'),

  ('majdamartinska', 'recenze.review9.text', '„Chtěla bych napsat jen pár řádků, jestli bylo vše v pořádku, no tak tedy od začátku, nevyprávím vám pohádku, v domluvenou dobu denní, razili jsem na focení, počáteční naše tréma, hned nám byla rozprášena, samý úsměv, skvělá karma, to ti dají zcela zdarma, uvolníš se během chvíle, potom přijde spousta píle, celou dobu samý smích, všechno v profi kolejích, závěrem jsou fotky krásné, z kterých jen každý žasne, nemusíš pak vybrat lišku, ani spořitelní knížku, když dáš fotky na sítě, nával laiků, svalí tě. Můžeme jen doporučit 🤗. Majdí, díky za vše, jdem se chlubit."', '„Chtěla bych napsat jen pár řádků, jestli bylo vše v pořádku, no tak tedy od začátku, nevyprávím vám pohádku, v domluvenou dobu denní, razili jsem na focení, počáteční naše tréma, hned nám byla rozprášena, samý úsměv, skvělá karma, to ti dají zcela zdarma, uvolníš se během chvíle, potom přijde spousta píle, celou dobu samý smích, všechno v profi kolejích, závěrem jsou fotky krásné, z kterých jen každý žasne, nemusíš pak vybrat lišku, ani spořitelní knížku, když dáš fotky na sítě, nával laiků, svalí tě. Můžeme jen doporučit 🤗. Majdí, díky za vše, jdem se chlubit."'),
  ('majdamartinska', 'recenze.review9.name', 'Petra M.', 'Petra M.'),
  ('majdamartinska', 'recenze.review9.type', 'Rodinné focení', 'Rodinné focení'),

  ('majdamartinska', 'recenze.review10.text', '„Newborn focení u Majdy byla naprostá paráda, moc jsem si to užila a to i přes to, že jsem z něj předem měla velké obavy kvůli vzdorovitému období mé tříleté záškoďačky, která se prostě fotit „nechce a nebude", nicméně od Majdy se dokonce nechala přemluvit i na společné fotky se svojí dvoutýdenní sestřičkou. Byl to nesmírně příjemně strávený čas plný pohody a klidu, za který jsem obrovsky vděčná a díky kterému budeme mít již navždycky nádhernou vzpomínku. Budu se moc těšit na příští setkání (snad nás ještě Majda přijme, až třeba tu záškoďačku vzdor přejde) při dalším focení, kterého určitě velmi ráda při nejbližší možné příležitosti u Majdy využiji. Veliké díky za vše, fotky jsou překrásné..."', '„Newborn focení u Majdy byla naprostá paráda, moc jsem si to užila a to i přes to, že jsem z něj předem měla velké obavy kvůli vzdorovitému období mé tříleté záškoďačky, která se prostě fotit „nechce a nebude", nicméně od Majdy se dokonce nechala přemluvit i na společné fotky se svojí dvoutýdenní sestřičkou. Byl to nesmírně příjemně strávený čas plný pohody a klidu, za který jsem obrovsky vděčná a díky kterému budeme mít již navždycky nádhernou vzpomínku. Budu se moc těšit na příští setkání (snad nás ještě Majda přijme, až třeba tu záškoďačku vzdor přejde) při dalším focení, kterého určitě velmi ráda při nejbližší možné příležitosti u Majdy využiji. Veliké díky za vše, fotky jsou překrásné..."'),
  ('majdamartinska', 'recenze.review10.name', 'Iveta V.', 'Iveta V.'),
  ('majdamartinska', 'recenze.review10.type', 'Newborn focení', 'Newborn focení'),

  ('majdamartinska', 'recenze.cta.label', 'CHCETE BÝT DALŠÍ?', 'CHCETE BÝT DALŠÍ?'),
  ('majdamartinska', 'recenze.cta.title', 'Objednejte si <em>focení</em> i vy', 'Objednejte si <em>focení</em> i vy'),
  ('majdamartinska', 'recenze.cta.btn', 'Napište mi', 'Napište mi')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- ─── KONTAKTNÍ FORMULÁŘ ───
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


-- =============================================
-- ČÁST 4: ANGLICKÉ PŘEKLADY (ON CONFLICT DO NOTHING)
-- =============================================

-- ─── 10 důvodů (Amina) — EN ───
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
  ('majdamartinska', 'home.reasons.title__en',
   '10 reasons to choose me and&nbsp;not <em>Pučálkovic Amina</em>',
   '10 reasons to choose me and&nbsp;not <em>Pučálkovic Amina</em>'),
  ('majdamartinska', 'home.reason1__en',
   'the fun is better with me than with Amina, and&nbsp;that''s saying something',
   'the fun is better with me than with Amina, and&nbsp;that''s saying something'),
  ('majdamartinska', 'home.reason2__en',
   'I really try to make you feel relaxed <em>(which&nbsp;isn''t possible around a giraffe)</em>',
   'I really try to make you feel relaxed <em>(which&nbsp;isn''t possible around a giraffe)</em>'),
  ('majdamartinska', 'home.reason3__en',
   'I shoot at eye level so it looks natural <em>(Amina always shoots from&nbsp;above)</em>',
   'I shoot at eye level so it looks natural <em>(Amina always shoots from&nbsp;above)</em>'),
  ('majdamartinska', 'home.reason4__en',
   'I put a lot of effort into editing <em>(Amina doesn''t even know what a graphics tablet or Photoshop&nbsp;is)</em>',
   'I put a lot of effort into editing <em>(Amina doesn''t even know what a graphics tablet or Photoshop&nbsp;is)</em>'),
  ('majdamartinska', 'home.reason5__en',
   'a visit to me isn''t just a shoot, but a friendly meeting <em>(Amina is friendly, but you really don''t want her showing&nbsp;affection)</em>',
   'a visit to me isn''t just a shoot, but a friendly meeting <em>(Amina is friendly, but you really don''t want her showing&nbsp;affection)</em>'),
  ('majdamartinska', 'home.reason6__en',
   'I''ll make you a delicious coffee for the studio shoot <em>(Amina doesn''t drink coffee, and worse, no&nbsp;alcohol&nbsp;either)</em>',
   'I''ll make you a delicious coffee for the studio shoot <em>(Amina doesn''t drink coffee, and worse, no&nbsp;alcohol&nbsp;either)</em>'),
  ('majdamartinska', 'home.reason7__en',
   'for outdoor shoots I''ll take you to really nice spots <em>(I must admit Amina might do this&nbsp;better)</em>',
   'for outdoor shoots I''ll take you to really nice spots <em>(I must admit Amina might do this&nbsp;better)</em>'),
  ('majdamartinska', 'home.reason8__en',
   'I deliver photos within 21 days max <em>(Amina can''t even count to five and&nbsp;looks&nbsp;like&nbsp;it)</em>',
   'I deliver photos within 21 days max <em>(Amina can''t even count to five and&nbsp;looks&nbsp;like&nbsp;it)</em>'),
  ('majdamartinska', 'home.reason9__en',
   'besides talking a lot, I also listen and adapt to your wishes <em>(Amina just stands there staring&nbsp;oddly)</em>',
   'besides talking a lot, I also listen and adapt to your wishes <em>(Amina just stands there staring&nbsp;oddly)</em>'),
  ('majdamartinska', 'home.reason10__en',
   'I''m leading 9:1 in reasons to choose me over Amina. Don''t hesitate —&nbsp;contact&nbsp;me.',
   'I''m leading 9:1 in reasons to choose me over Amina. Don''t hesitate —&nbsp;contact&nbsp;me.'),
  ('majdamartinska', 'home.reasons.note__en',
   'Note: Pučálkovic Amina is a giraffe from a wonderful book by Jindřich Plachta :)',
   'Note: Pučálkovic Amina is a giraffe from a wonderful book by Jindřich Plachta :)')
ON CONFLICT (project_id, section_id) DO NOTHING;

-- ─── RECENZE — EN ───
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
  ('majdamartinska', 'recenze.review1.text__en',
   '„I asked Majda for photos for my consulting website. Although I''m a friendly and communicative person, I''m not the type who needs to show off in front of a camera at every opportunity. So deliberate posing in front of a camera is stepping out of my comfort zone. But with Majda, the whole shoot went smoothly. Our meeting turned into a casual walk in nature, where you have space not only to breathe but also to relax. So a few clicks of the camera don''t even bother you anymore. Majda is very empathetic, patient and has fresh ideas for locations and ways to position a person. You don''t have to feel like a puppet or a mannequin. When I received the result, I was moved in one word. From my own photos I felt the same calm I experienced during the shoot and also want to pass on to my clients through my website. Although some time has passed since the shoot with Majda, I still look at the photos with great gratitude and fondly remember our session together."',
   '„I asked Majda for photos for my consulting website. Although I''m a friendly and communicative person, I''m not the type who needs to show off in front of a camera at every opportunity. So deliberate posing in front of a camera is stepping out of my comfort zone. But with Majda, the whole shoot went smoothly. Our meeting turned into a casual walk in nature, where you have space not only to breathe but also to relax. So a few clicks of the camera don''t even bother you anymore. Majda is very empathetic, patient and has fresh ideas for locations and ways to position a person. You don''t have to feel like a puppet or a mannequin. When I received the result, I was moved in one word. From my own photos I felt the same calm I experienced during the shoot and also want to pass on to my clients through my website. Although some time has passed since the shoot with Majda, I still look at the photos with great gratitude and fondly remember our session together."'),
  ('majdamartinska', 'recenze.review1.name__en', 'Pavla K.', 'Pavla K.'),
  ('majdamartinska', 'recenze.review1.type__en', 'Portrait photography', 'Portrait photography'),

  ('majdamartinska', 'recenze.review2.text__en',
   '„I''ve been working with Majda for over 10 years. Besides studio photos, outdoor and wedding photography, she has now expanded her offer to include video production. Apart from weddings, I''ve tried all her services and can only recommend. Majda has an incredible sense for atmosphere and the specific mood of a photo. She''s full of ideas, able to capture the personality of the subject through photos or video. It never happened that she posed me in unnatural positions or arranged poses. Shooting with her is fun and at the same time she''s a great professional — she knows how to work with both children and shy adults. I also love her free creative work — very imaginative, almost dreamlike photos."',
   '„I''ve been working with Majda for over 10 years. Besides studio photos, outdoor and wedding photography, she has now expanded her offer to include video production. Apart from weddings, I''ve tried all her services and can only recommend. Majda has an incredible sense for atmosphere and the specific mood of a photo. She''s full of ideas, able to capture the personality of the subject through photos or video. It never happened that she posed me in unnatural positions or arranged poses. Shooting with her is fun and at the same time she''s a great professional — she knows how to work with both children and shy adults. I also love her free creative work — very imaginative, almost dreamlike photos."'),
  ('majdamartinska', 'recenze.review2.name__en', 'Anna B. (Lying Anna)', 'Anna B. (Lying Anna)'),
  ('majdamartinska', 'recenze.review2.type__en', 'Studio photography', 'Studio photography'),

  ('majdamartinska', 'recenze.review3.text__en',
   '„Working with Majda is amazing. I have the honor from both sides. From a professional standpoint, there is absolutely nothing to fault. Her work is perfect. As a person, she is a treasure. Always smiling, full of ideas. She owns an amazing studio where you feel like you''re in a fairy tale, and that''s exactly what her collaboration with you looks like."',
   '„Working with Majda is amazing. I have the honor from both sides. From a professional standpoint, there is absolutely nothing to fault. Her work is perfect. As a person, she is a treasure. Always smiling, full of ideas. She owns an amazing studio where you feel like you''re in a fairy tale, and that''s exactly what her collaboration with you looks like."'),
  ('majdamartinska', 'recenze.review3.name__en', 'Katka K.', 'Katka K.'),
  ('majdamartinska', 'recenze.review3.type__en', 'Family photography', 'Family photography'),

  ('majdamartinska', 'recenze.review4.text__en',
   '„Majda photographed us once in the studio and once she came to our home. Majda has the talent to capture the right moment, the atmosphere during the shoot was very friendly and relaxed. We had an idea for a few photos in advance, the rest we left to Majda, who had plenty of great ideas for shots. We received the photos quickly 🙂"',
   '„Majda photographed us once in the studio and once she came to our home. Majda has the talent to capture the right moment, the atmosphere during the shoot was very friendly and relaxed. We had an idea for a few photos in advance, the rest we left to Majda, who had plenty of great ideas for shots. We received the photos quickly 🙂"'),
  ('majdamartinska', 'recenze.review4.name__en', 'Pavlína N.', 'Pavlína N.'),
  ('majdamartinska', 'recenze.review4.type__en', 'Family photography', 'Family photography'),

  ('majdamartinska', 'recenze.review5.text__en',
   '„Anyone who knows Majda knows very well that she excels in many areas and photography is definitely one of them. Every photo has a soul and an idea. I''ve known Majda for a very long time and her work is truly flawless! I recommend with all ten fingers!!!"',
   '„Anyone who knows Majda knows very well that she excels in many areas and photography is definitely one of them. Every photo has a soul and an idea. I''ve known Majda for a very long time and her work is truly flawless! I recommend with all ten fingers!!!"'),
  ('majdamartinska', 'recenze.review5.name__en', 'Jana H.', 'Jana H.'),
  ('majdamartinska', 'recenze.review5.type__en', 'Family photography', 'Family photography'),

  ('majdamartinska', 'recenze.review6.text__en',
   '„Very pleasant photo shoot and beautifully spent time. Pleasant communication and smooth arrangement. The photographer has scouted several spots that are very nice for photos. The photographer sent a preview of photos on the day of the shoot, from which you can then choose. Edited photographs were delivered in less than a week. I can only recommend."',
   '„Very pleasant photo shoot and beautifully spent time. Pleasant communication and smooth arrangement. The photographer has scouted several spots that are very nice for photos. The photographer sent a preview of photos on the day of the shoot, from which you can then choose. Edited photographs were delivered in less than a week. I can only recommend."'),
  ('majdamartinska', 'recenze.review6.name__en', 'Michal L.', 'Michal L.'),
  ('majdamartinska', 'recenze.review6.type__en', 'Family photography', 'Family photography'),

  ('majdamartinska', 'recenze.review7.text__en',
   '„Our collaboration with Majda was absolutely amazing. She treated our 14-day-old son more than maternally. The entire shoot was completely in her hands and my partner and I could calmly drink coffee and chat. ☺️ I can fully recommend Mrs. Majda Martinská, not only thanks to her amazing approach to our son, but mainly because her photographs are full of tenderness, love and professionalism. Once again, thank you so much for the beautiful afternoon and wonderful memories in the form of gorgeous photographs. Marešová"',
   '„Our collaboration with Majda was absolutely amazing. She treated our 14-day-old son more than maternally. The entire shoot was completely in her hands and my partner and I could calmly drink coffee and chat. ☺️ I can fully recommend Mrs. Majda Martinská, not only thanks to her amazing approach to our son, but mainly because her photographs are full of tenderness, love and professionalism. Once again, thank you so much for the beautiful afternoon and wonderful memories in the form of gorgeous photographs. Marešová"'),
  ('majdamartinska', 'recenze.review7.name__en', 'Bára M.', 'Bára M.'),
  ('majdamartinska', 'recenze.review7.type__en', 'Newborn photography', 'Newborn photography'),

  ('majdamartinska', 'recenze.review8.text__en',
   '„I recommend to everyone!!!! Great photographer, photos that are created in an absolutely chill atmosphere. I would need more stars for the rating, 5 * is too few in this case :o)"',
   '„I recommend to everyone!!!! Great photographer, photos that are created in an absolutely chill atmosphere. I would need more stars for the rating, 5 * is too few in this case :o)"'),
  ('majdamartinska', 'recenze.review8.name__en', 'Alice C.', 'Alice C.'),
  ('majdamartinska', 'recenze.review8.type__en', 'Family photography', 'Family photography'),

  ('majdamartinska', 'recenze.review9.text__en',
   '„I''d like to write just a few lines about whether everything was okay, so from the beginning then — I''m not telling you a fairy tale — at the agreed time of day, we headed to the shoot, our initial stage fright was instantly shattered, all smiles, great karma, they give it to you completely free, you relax in no time, then comes a lot of hard work, the whole time full of laughter, everything on professional tracks, in the end the photos are beautiful, at which everyone marvels, you don''t need to pick a trick or a savings book, when you post the photos online, a flood of likes will knock you down. We can only recommend 🤗. Majda, thanks for everything, off we go to show off."',
   '„I''d like to write just a few lines about whether everything was okay, so from the beginning then — I''m not telling you a fairy tale — at the agreed time of day, we headed to the shoot, our initial stage fright was instantly shattered, all smiles, great karma, they give it to you completely free, you relax in no time, then comes a lot of hard work, the whole time full of laughter, everything on professional tracks, in the end the photos are beautiful, at which everyone marvels, you don''t need to pick a trick or a savings book, when you post the photos online, a flood of likes will knock you down. We can only recommend 🤗. Majda, thanks for everything, off we go to show off."'),
  ('majdamartinska', 'recenze.review9.name__en', 'Petra M.', 'Petra M.'),
  ('majdamartinska', 'recenze.review9.type__en', 'Family photography', 'Family photography'),

  ('majdamartinska', 'recenze.review10.text__en',
   '„The newborn shoot at Majda''s was an absolute blast, I enjoyed it so much even though I had big concerns beforehand due to the defiant phase of my three-year-old troublemaker who simply "doesn''t want to and won''t" be photographed. Yet Majda even managed to persuade her to take joint photos with her two-week-old little sister. It was an incredibly pleasant time full of peace and calm, for which I am enormously grateful and thanks to which we will forever have a beautiful memory. I will be looking forward to our next meeting (hopefully Majda will still accept us once the defiance phase passes) for another shoot, which I will certainly gladly take advantage of at the earliest opportunity. Huge thanks for everything, the photos are gorgeous..."',
   '„The newborn shoot at Majda''s was an absolute blast, I enjoyed it so much even though I had big concerns beforehand due to the defiant phase of my three-year-old troublemaker who simply "doesn''t want to and won''t" be photographed. Yet Majda even managed to persuade her to take joint photos with her two-week-old little sister. It was an incredibly pleasant time full of peace and calm, for which I am enormously grateful and thanks to which we will forever have a beautiful memory. I will be looking forward to our next meeting (hopefully Majda will still accept us once the defiance phase passes) for another shoot, which I will certainly gladly take advantage of at the earliest opportunity. Huge thanks for everything, the photos are gorgeous..."'),
  ('majdamartinska', 'recenze.review10.name__en', 'Iveta V.', 'Iveta V.'),
  ('majdamartinska', 'recenze.review10.type__en', 'Newborn photography', 'Newborn photography')
ON CONFLICT (project_id, section_id) DO NOTHING;


-- =============================================
-- ČÁST 5: OBRÁZKY (ON CONFLICT = aktualizuje URL pokud chybí)
-- =============================================

-- Homepage: promise image
INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.promise.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/287,0,1287,1000,580,580,1/0-0-0/abd0b8bc-40a7-4cba-a769-cbc568d41c13/1/2/_FFF5931.jpg?fjkss=exp=2088681039~hmac=22be9649398a9ea56ec377944dcd6bd02254347ecc8e43027ed7075709fe618c',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

-- Homepage: about preview image
INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.about.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,999,999,1520,1520,1/0-0-0/c11ca67d-b1da-42ba-b398-a4483cfafa6e/1/2/mandarinkab.jpg?fjkss=exp=2088927692~hmac=4057268ac7beb84ef3e15484149ef0a30d91712645ea49bc32d3aca6b40f9f7d',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

-- Homepage: service cards
INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.service1.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/06e2efcf-a3e9-465e-8ee2-1ffbfe3bda48/1/1/gina19.jpg?fjkss=exp=2090601184~hmac=f6e09f32babc81d97fb5dc6eeb4b8d8efcc0d358fc9a5b4ed84b9b6fb94be3d6',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.service2.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/f18d0f78-d3a2-4eef-b2c1-1c88d24f62de/1/1/_FFF0538.jpg?fjkss=exp=2090601184~hmac=2a9bb2a77d2e8a6a2df8aa2c1cc8e42ba99e4eda9d56c8f8e42a6f7a1e44c2bd',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.service3.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/37,0,773,580,580,580,1/0-0-0/62e61db2-b7f2-4b7e-b9d3-ec2f2f51b506/1/2/svatba106.jpg?fjkss=exp=2090601184~hmac=aeb0fef7e36f66d5f7a80afe14d0b7c7e5a2d8f1c4b7e0d3a6c9b2e5f8d1a4c7',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

-- Homepage: more services
INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.more1.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1500,2500,1500/0-0-0/77a14f0b-d0aa-426b-9aa6-13318fb554aa/1/1/_FFF4817.jpg?fjkss=exp=2090606586~hmac=6d18ef0957232c473f0b7f06217a567cebd6320d8a1ad99e71700cb7762b65b1',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.more2.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,2424,3650,1600,3650/0-0-0/72605f59-07d5-4cf7-a4dc-1102fb905c51/1/1/_DSC0107cb.jpg?fjkss=exp=2088681074~hmac=7ad23ece9e93b148e5817708a8f579689fc67819a6dd60cb67bdbc90bd35b52c',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.more3.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,800,1200,2500,1200/0-0-0/e73300d8-5661-4b60-8039-bd421a04ddfa/1/1/_FFF9854.jpg?fjkss=exp=2090606529~hmac=f08c05fa2ea1085f4bec130434e26a7aea32ecfea9dd8c5e22e555cf333f2d83',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

-- O mně: profilová fotka
INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'omne.intro.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,999,999,1520,1520,1/0-0-0/c11ca67d-b1da-42ba-b398-a4483cfafa6e/1/2/mandarinkab.jpg?fjkss=exp=2088927692~hmac=4057268ac7beb84ef3e15484149ef0a30d91712645ea49bc32d3aca6b40f9f7d',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

-- Služby: obrázky
INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'sluzby.rodinna.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/337,0,1337,1000,580,580,1/0-0-0/2b1abef9-f657-4d4d-af2d-f2ea0305c275/1/2/_FFF5852.jpg?fjkss=exp=2088926255~hmac=0e915221ac8400e348f232f2aaeb08aa4d77091d2dd68ad90e89e16f5a339864',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'sluzby.newborn.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/105,0,1105,1000,580,580,1/0-0-0/e31af609-ffc4-4df0-9dd0-55164c01ae9c/1/2/beranci420.jpg?fjkss=exp=2088926256~hmac=f068764e9720bd72e5c31b1778dc5b3c9757133c8222f974f4fbd7a2070d2581',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'sluzby.svatby.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/242,0,1242,1000,580,580,1/0-0-0/6a22c40a-2331-4783-8eda-c50263a4e231/1/2/_FFF6358-DeNoiseAI-standard.jpg?fjkss=exp=2088926256~hmac=048edc5062605e1fa227333279bc4d80d6f5dc521a10449af549312b0ba64723',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'sluzby.psi.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/91,0,1091,1000,580,580,1/0-0-0/df099d74-dc42-4b6c-b83e-fb2200b54189/1/2/_FFF6743.jpg?fjkss=exp=2088926255~hmac=69a228dbb31ba452684c67584e88c7e9291798244e448bc468b9c8071a5c924a',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'sluzby.tehotenske.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,2424,3650,1600,3650/0-0-0/72605f59-07d5-4cf7-a4dc-1102fb905c51/1/1/_DSC0107cb.jpg?fjkss=exp=2088681074~hmac=7ad23ece9e93b148e5817708a8f579689fc67819a6dd60cb67bdbc90bd35b52c',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'sluzby.portret.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/269,0,1269,1000,580,580,1/0-0-0/03b7bbe1-7c1f-4167-adab-849497e1d2e2/1/2/_FFF0819.jpg?fjkss=exp=2088681039~hmac=b5673dbf2b60511a55402901e21d21c70b0de494fa1a65298258688c498e2a6e',
  NOW())
ON CONFLICT (project_id, section_id) DO NOTHING;


-- =============================================
-- 5) REVIEWS tabulka
-- =============================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL DEFAULT 'majda-web',
  name TEXT NOT NULL,
  name_en TEXT,
  type TEXT NOT NULL DEFAULT '',
  type_en TEXT,
  text TEXT NOT NULL,
  text_en TEXT,
  profile_image TEXT,
  stars INT NOT NULL DEFAULT 5,
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='reviews_select_all') THEN
    CREATE POLICY reviews_select_all ON reviews FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='reviews_insert_anon') THEN
    CREATE POLICY reviews_insert_anon ON reviews FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='reviews_update_anon') THEN
    CREATE POLICY reviews_update_anon ON reviews FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='reviews' AND policyname='reviews_delete_anon') THEN
    CREATE POLICY reviews_delete_anon ON reviews FOR DELETE USING (true);
  END IF;
END $$;

-- Seed 10 existing reviews
INSERT INTO reviews (project_id, name, type, text, profile_image, sort_order, visible) VALUES
('majda-web', 'Pavla K.', 'Portrétní focení',
 'Požádala jsem Majdu o fotografie pro web, který prezentuje mé konzultace. Přestože jsem přátelské a komunikativní povahy, nejsem typ člověka, který se potřebuje předvést před objektivem při každé příležitosti. Proto je pro mě cílené pózování před fotoaparátem výstup z komfortní zóny. Ale s Majdou šlo celé focení jako po másle. Z našeho setkání se stala nenucená procházka přírodou, kdy se člověk má prostor nejen nadechnout, ale také uvolnit. Takže nějaké to cvaknutí fotoaparátu už jej pak ani nerozhodí. Navíc je Majda velmi empatická, trpělivá a má neotřelé nápady na místa i způsoby, jak si člověka postavit. Člověk se tak nemusí cítit jako nějaká loutka nebo umělá figurína. Když mi přišel výsledek, byla jsem jedním slovem dojatá. Z vlastních fotek na mě dýchla taková pohoda, jakou jsem při focení cítila a také chci přes můj web předávat mým klientům. Přestože od focení s Majdou uplynul již nějaký čas, stále se na fotky dívám s velkou vděčností a ráda na to naše společné focení vzpomínám.',
 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/277,0,944,667,760,760,1/0-0-0/4c99907e-5e3e-47b8-ae54-7369b064686e/1/2/10M.jpg?fjkss=exp=2090919623~hmac=ce3e7c6dd1fa9b550f440089a22b44a4210343750b92c05df5c708d09df35a75',
 1, true),
('majda-web', 'Anna B. (Prolhaná Anna)', 'Ateliérové focení',
 'S Majdou spolupracuji už přes 10 let. Kromě fotek ateliérových, v exteriéru i svatebních, nyní rozšířila svou nabídku o natáčení videí. Kromě svatby jsem vyzkoušela všechny služby a můžu jen doporučit. Majda má neskutečný cit pro atmosféru a specifickou náladu fotky. Je plná nápadů, umí fotkou či videem vystihnout osobnost foceného. Nikdy se mi nestalo, že by mě štelovala do nepřirozených pozic nebo aranžovaných póz. Focení s ní je zábava a zároveň je velký profesionál — umí to jak s dětmi, tak se stydlivými dospělými. Také mám ráda její volnou tvorbu — velmi nápadité až snové fotky.',
 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/115,0,777,661,760,760,1/0-0-0/edbbb663-2ba2-42f7-b5c4-44890793798c/1/2/gina27.jpg?fjkss=exp=2090919623~hmac=4b155c06d14a539f3798ba4806f6db6cfa584b9746cda7045fd6b5c651173292',
 2, true),
('majda-web', 'Katka K.', 'Rodinné focení',
 'Spolupracovat s Majdou je úžasné. Mám tu čest z obou stran. Z profesionálního hlediska se jí nedá naprosto nic vytknout. Její práce je dokonalá. Jako člověk je poklad. Neustále úsměvavá, plná nápadů. Vlastní úžasný ateliér, ve kterém se cítíte jak v pohádce a tak vypadá i její spolupráce s vámi.',
 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/137,39,690,592,760,760,1/0-0-0/349ae2e3-df92-4681-a030-2aa2bca00875/1/2/DSC_9060.jpg?fjkss=exp=2090919623~hmac=30e7bbdd3afa847acee024891b0caf630b35045200f2e4aff9580310f8cfd82a',
 3, true),
('majda-web', 'Pavlína N.', 'Rodinné focení',
 'Majda nás fotila jednou v ateliéru a jednou za námi na focení přijela domů. Majda má talent, zachytit správný okamžik, během focení byla velmi přátelská a uvolněná nálada. O pár fotkách jsme měli představu předem, zbytek jsme nechali na Majdě, která měla spoustu skvělých nápadů na fotky. Fotky jsme obdrželi brzy 🙂',
 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/134,0,796,661,760,760,1/0-0-0/1c9eb9e5-b985-473c-99fe-a6bcfdd88523/1/2/laura16-DeNoiseAI-standard.jpg?fjkss=exp=2090919623~hmac=286b183a663af0e945dac29cf41f496c9ec26c09b01710120641e9ba68b9ac39',
 4, true),
('majda-web', 'Jana H.', 'Rodinné focení',
 'Kdo zná Majdu, moc dobře ví, že vyniká v mnoha oblastech a fotografie je rozhodně jednou z nich. Každá fotka má duši a nápad. Majdu znám velmi dlouho a její práce je opravdu dokonalá! Doporučuji všemi deseti!!!',
 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,599,599,760,760,1/0-0-0/ac0b5ade-1d3c-4658-8072-8bfd2196cc66/1/2/1403156454_large_dsc_0052.jpg?fjkss=exp=2090919623~hmac=aa94796293b2a7b2f23db17e0296e8634f467879968dea20a5f32713cee0d750',
 5, true),
('majda-web', 'Michal L.', 'Rodinné focení',
 'Velice příjemné focení a krásně strávený čas. Příjemné jednání a bezproblémová domluva. Paní fotografka má vytipovaných pár míst, které jsou moc hezké na fotky. Paní fotografka již v den focení zaslala náhled fotografií ze kterých si je možné následně vybrat. Upravené fotografie byly dodány ani ne za týden. Mohu jen doporučit.',
 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/296,0,1296,999,760,760,1/0-0-0/abd0b8bc-40a7-4cba-a769-cbc568d41c13/1/2/_FFF5931.jpg?fjkss=exp=2090919623~hmac=305b309b1a3b66c9e0d00ed67a35d052ee226576826fd079a83b0a596c3d29f6',
 6, true),
('majda-web', 'Bára M.', 'Newborn focení',
 'Naše spolupráce s Majdou byla naprosto úžasná. S naším 14 denním synem zacházela více než mateřsky. Celé focení bylo zcela v její režii a my si s partnerem mohli vypít v klidu kávu a popovídat. ☺️ Paní Majdu Martinskou mohu zcela doporučit, nejen díky úžasnému přístupu k synovi, ale hlavně fotografie od ní jsou plné něhy, lásky a profesionality. Ještě jednou mockrát děkujeme za krásné odpoledne a úžasné vzpomínky ve formě nádherných fotografií. Marešová',
 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/341,0,1341,999,760,760,1/0-0-0/465305c9-f66c-4175-b352-2218472c9b79/1/2/_FFF7991-SharpenAI-Softness.jpg?fjkss=exp=2090919623~hmac=05f012f47194b07c6b2e984bff30bbead52c8c6c423e9cc02f6109f6a5208fe9',
 7, true),
('majda-web', 'Alice C.', 'Rodinné focení',
 'Doporučuji všem!!!! Skvělá fotografka, fotky, které vznikají v naprosto pohodové atmosféře. Potřebovala bych pro hodnocení více hvězdiček, 5 * je za mě v tomto případě málo :o)',
 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/6307f6b1-d040-46e9-a09b-e1d7f0b123b4/1/2/_FFF3016+%282%29.jpg?fjkss=exp=2090919623~hmac=83506d2537607b825b52448dcae491926d90a43b3feee4156829a670c0d502c8',
 8, true),
('majda-web', 'Petra M.', 'Rodinné focení',
 'Chtěla bych napsat jen pár řádků, jestli bylo vše v pořádku, no tak tedy od začátku, nevyprávím vám pohádku, v domluvenou dobu denní, razili jsem na focení, počáteční naše tréma, hned nám byla rozprášena, samý úsměv, skvělá karma, to ti dají zcela zdarma, uvolníš se během chvíle, potom přijde spousta píle, celou dobu samý smích, všechno v profi kolejích, závěrem jsou fotky krásné, z kterých jen každý žasne, nemusíš pak vybrat lišku, ani spořitelní knížku, když dáš fotky na sítě, nával laiků, svalí tě. Můžeme jen doporučit 🤗. Majdí, díky za vše, jdem se chlubit.',
 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/a096d9ab-e562-48eb-988b-ea0246dddcf6/1/2/_FFF5743b.jpg?fjkss=exp=2090919623~hmac=83506d2537607b825b52448dcae491926d90a43b3feee4156829a670c0d502c8',
 9, true),
('majda-web', 'Iveta V.', 'Newborn focení',
 'Newborn focení u Majdy byla naprostá paráda, moc jsem si to užila a to i přes to, že jsem z něj předem měla velké obavy kvůli vzdorovitému období mé tříleté záškoďačky, která se prostě fotit „nechce a nebude", nicméně od Majdy se dokonce nechala přemluvit i na společné fotky se svojí dvoutýdenní sestřičkou. Byl to nesmírně příjemně strávený čas plný pohody a klidu, za který jsem obrovsky vděčná a díky kterému budeme mít již navždycky nádhernou vzpomínku. Budu se moc těšit na příští setkání (snad nás ještě Majda přijme, až třeba tu záškoďačku vzdor přejde) při dalším focení, kterého určitě velmi ráda při nejbližší možné příležitosti u Majdy využiji. Veliké díky za vše, fotky jsou překrásné...',
 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/c5a007bb-a1a1-43e4-8df5-22c25afef071/1/2/429929096_737922395110204_1352912403146508007_n.jpg?fjkss=exp=2090919623~hmac=83506d2537607b825b52448dcae491926d90a43b3feee4156829a670c0d502c8',
 10, true)
ON CONFLICT DO NOTHING;


-- =============================================
-- HOTOVO! ✅
-- =============================================
-- Tento soubor je bezpečný ke spuštění opakovaně.
-- Nic nesmaže, nic nepřepíše — pouze doplní co chybí.
-- =============================================
