-- =============================================
-- Texty pro podstránky: kontakt, o-mne, sluzby, recenze, portfolio
-- Spusť v Supabase SQL Editoru
-- =============================================

INSERT INTO page_content (project_id, section_id, draft_text, published_text)
VALUES
  -- === KONTAKT ===
  ('majdamartinska', 'kontakt.info.title', 'Pojďme se <em>spojit</em>', 'Pojďme se <em>spojit</em>'),
  ('majdamartinska', 'kontakt.info.text', 'Máte zájem o focení, nebo se chcete na něco zeptat? Napište mi prostřednictvím formuláře, e-mailem nebo na sociální sítě. Ozvu se vám co nejdříve!', 'Máte zájem o focení, nebo se chcete na něco zeptat? Napište mi prostřednictvím formuláře, e-mailem nebo na sociální sítě. Ozvu se vám co nejdříve!'),
  ('majdamartinska', 'kontakt.email', 'majda@majdamartinska.com', 'majda@majdamartinska.com'),
  ('majdamartinska', 'kontakt.telefon', '+420 123 456 789', '+420 123 456 789'),
  ('majdamartinska', 'kontakt.adresa', 'Praha — Suchdol', 'Praha — Suchdol'),

  -- === O MNĚ ===
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
  ('majdamartinska', 'omne.studio.text', 'Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol. Je vhodný pro newborn focení, rodinné focení, portrétní focení i pro focení těhotných.', 'Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol. Je vhodný pro newborn focení, rodinné focení, portrétní focení i pro focení těhotných.'),
  ('majdamartinska', 'omne.cta.label', 'ZAUJALA JSEM VÁS?', 'ZAUJALA JSEM VÁS?'),

  -- === SLUŽBY ===
  ('majdamartinska', 'sluzby.rodinna.title', 'Rodinné a <em>párové focení</em>', 'Rodinné a <em>párové focení</em>'),
  ('majdamartinska', 'sluzby.rodinna.text', 'Focení rodin, párů, sourozenců, kamarádů. Prostě všech, kteří se mají rádi a chtějí si to připomenout i za 10 let. Focení probíhá většinou venku v přírodě, nebo v mém ateliéru na Suchdole. Rodinné focení trvá cca 1–1,5 h.', 'Focení rodin, párů, sourozenců, kamarádů. Prostě všech, kteří se mají rádi a chtějí si to připomenout i za 10 let. Focení probíhá většinou venku v přírodě, nebo v mém ateliéru na Suchdole. Rodinné focení trvá cca 1–1,5 h.'),
  ('majdamartinska', 'sluzby.rodinna.cena', 'od 3 900 Kč', 'od 3 900 Kč'),
  ('majdamartinska', 'sluzby.newborn.title', 'Newborn — <em>miminka</em>', 'Newborn — <em>miminka</em>'),
  ('majdamartinska', 'sluzby.newborn.text', 'Newborn focení je zaměřené na novorozence ve věku 5–14 dní. V tomto období jsou miminka ještě hodně ospalá a dají se krásně tvarovat do různých pozic. Focení probíhá v mém ateliéru, kde je teplo, klid a vše potřebné.', 'Newborn focení je zaměřené na novorozence ve věku 5–14 dní. V tomto období jsou miminka ještě hodně ospalá a dají se krásně tvarovat do různých pozic. Focení probíhá v mém ateliéru, kde je teplo, klid a vše potřebné.'),
  ('majdamartinska', 'sluzby.newborn.cena', 'od 4 900 Kč', 'od 4 900 Kč'),
  ('majdamartinska', 'sluzby.svatby.title', 'Svatební <em>focení</em>', 'Svatební <em>focení</em>'),
  ('majdamartinska', 'sluzby.svatby.text', 'Váš velký den si zaslouží být zachycen přirozeně a s citem. Focím reportážním stylem — žádné nucené pózy, ale skutečné emoce a momenty, které byste jinak zapomněli.', 'Váš velký den si zaslouží být zachycen přirozeně a s citem. Focím reportážním stylem — žádné nucené pózy, ale skutečné emoce a momenty, které byste jinak zapomněli.'),
  ('majdamartinska', 'sluzby.svatby.cena', 'od 15 000 Kč', 'od 15 000 Kč'),
  ('majdamartinska', 'sluzby.psi.title', 'Psí <em>kamarádi</em>', 'Psí <em>kamarádi</em>'),
  ('majdamartinska', 'sluzby.psi.text', 'Máš doma mazlíka, co ti dělá radost? Focení psích kamarádů (a samozřejmě i s jejich páníčky) je něco, co mě neskutečně baví. Focení probíhá venku v přírodě.', 'Máš doma mazlíka, co ti dělá radost? Focení psích kamarádů (a samozřejmě i s jejich páníčky) je něco, co mě neskutečně baví. Focení probíhá venku v přírodě.'),
  ('majdamartinska', 'sluzby.psi.cena', 'od 3 500 Kč', 'od 3 500 Kč'),
  ('majdamartinska', 'sluzby.tehotenske.title', 'Těhotenské <em>focení</em>', 'Těhotenské <em>focení</em>'),
  ('majdamartinska', 'sluzby.tehotenske.text', 'Krásné období, které si zaslouží zachytit na fotografiích. Těhotenské focení je nejkrásnější kolem 30.–36. týdne těhotenství. Focení probíhá v ateliéru nebo v přírodě.', 'Krásné období, které si zaslouží zachytit na fotografiích. Těhotenské focení je nejkrásnější kolem 30.–36. týdne těhotenství. Focení probíhá v ateliéru nebo v přírodě.'),
  ('majdamartinska', 'sluzby.tehotenske.cena', 'od 3 500 Kč', 'od 3 500 Kč'),
  ('majdamartinska', 'sluzby.portret.title', 'Portrétní <em>focení</em>', 'Portrétní <em>focení</em>'),
  ('majdamartinska', 'sluzby.portret.text', 'Profesionální portrétní fotografie pro vaši osobní prezentaci, LinkedIn, nebo prostě jen proto, že chcete krásné fotky sebe. Focení probíhá v ateliéru i venku.', 'Profesionální portrétní fotografie pro vaši osobní prezentaci, LinkedIn, nebo prostě jen proto, že chcete krásné fotky sebe. Focení probíhá v ateliéru i venku.'),
  ('majdamartinska', 'sluzby.portret.cena', 'od 2 900 Kč', 'od 2 900 Kč'),
  ('majdamartinska', 'sluzby.cta.label', 'NEVÁHEJTE', 'NEVÁHEJTE'),

  -- === RECENZE ===
  ('majdamartinska', 'recenze.cta.label', 'CHCETE BÝT DALŠÍ?', 'CHCETE BÝT DALŠÍ?')

ON CONFLICT (project_id, section_id) DO UPDATE SET
  draft_text = EXCLUDED.draft_text,
  published_text = EXCLUDED.published_text,
  updated_at = now();
