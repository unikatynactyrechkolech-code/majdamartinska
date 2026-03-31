'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type Lang = 'cs' | 'en';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (cs: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

// Translation dictionary: Czech → English
const translations: Record<string, string> = {
  // ── NAV ──
  'Úvod': 'Home',
  'Portfolio': 'Portfolio',
  'Služby': 'Services',
  'Kdo jsem': 'About',
  'Recenze': 'Reviews',
  'Kontakt': 'Contact',

  // ── HERO ──
  'RODINNÉ · SVATEBNÍ · NEWBORN FOCENÍ': 'FAMILY · WEDDING · NEWBORN PHOTOGRAPHY',
  'Vaše': 'Your',
  'příběhy': 'stories',
  'zachycené navždy': 'captured forever',
  'Chci fotky': 'I want photos',
  'Celé portfolio': 'Full portfolio',
  'Mám zájem': 'I\'m interested',

  // ── PROMISE ──
  'SLIBUJI VÁM': 'I PROMISE YOU',
  'Že focení bude přirozené &amp; v pohodě': 'That the shoot will be natural &amp; relaxed',
  'Hledáte fotografku a zároveň pohodářku? Chcete si focení užít a neprotrpět? Jste na správném místě. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi při focení záleží.':
    'Looking for a photographer who\'s also fun to be around? Want to enjoy the shoot without stress? You\'re in the right place. Good vibes, openness, authenticity and no awkwardness — that\'s what matters to me.',
  'Napište mi →': 'Write to me →',

  // ── GALLERY ──
  'PORTFOLIO': 'PORTFOLIO',

  // ── SERVICES ──
  'MOJE SLUŽBY': 'MY SERVICES',
  'Moje <em>práce</em>': 'My <em>work</em>',
  'Rodinné a portrétní': 'Family & portrait',
  'Newborn — miminka': 'Newborn — babies',
  'Svatby': 'Weddings',
  'ZOBRAZIT →': 'VIEW →',

  // ── ABOUT PREVIEW ──
  'KDO STOJÍ ZA OBJEKTIVEM?': 'WHO\'S BEHIND THE LENS?',
  'Ahoj,<br />jsem <em>Majda</em>': 'Hi,<br />I\'m <em>Majda</em>',
  'Focení mě lákalo od dětství. Mám ráda humor a to se objevuje i v mých fotografiích. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi záleží. Taky jsem dost upovídaná, takže kdo se bojí trapného ticha, nebude :)':
    'Photography has fascinated me since childhood. I love humor and it shows in my photos. Good vibes, openness, authenticity and no awkwardness — that\'s what I care about. I\'m also quite talkative, so no awkward silence here :)',
  'Více o mně': 'More about me',

  // ── MORE SERVICES ──
  'Psí kamarádi': 'Dog friends',
  'Máš doma mazlíka? Chceš ho mít na fotkách? Tož to tady jsi správně.': 'Got a furry friend? Want them in photos? You\'re in the right place.',
  'INFORMACE →': 'INFO →',
  'Těhotenské focení': 'Maternity photography',
  'Krásné období, které si zaslouží zachytit na fotografiích.': 'A beautiful period that deserves to be captured in photos.',
  'Portréty': 'Portraits',
  'Profesionální portrétní fotografie pro vaši prezentaci i osobní účely.': 'Professional portrait photography for your presentation and personal use.',

  // ── TESTIMONIALS ──
  'MILÁ SLOVA': 'KIND WORDS',
  '„Spolupracovat s Majdou byla naprostá paráda. S naším 14denním synem zacházela více než mateřsky. Fotografie jsou plné něhy, lásky a profesionality."':
    '"Working with Majda was an absolute delight. She treated our 14-day-old son with more than motherly care. The photos are full of tenderness, love, and professionalism."',

  // ── STUDIO ──
  'ATELIÉR': 'STUDIO',
  'Ateliér <em>Praha Suchdol</em>': 'Studio <em>Prague Suchdol</em>',
  'Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol.':
    'I have a large and well-equipped studio in the quiet part of Prague — Suchdol.',
  'Nahlédněte pod pokličku →': 'Take a peek behind the scenes →',

  // ── CTA ──
  'JSME NA PODOBNÉ VLNĚ?': 'ARE WE ON THE SAME WAVELENGTH?',
  'Pojďme <em>do toho</em>': 'Let\'s <em>do this</em>',
  'NEVÁHEJTE': 'DON\'T HESITATE',
  'ZAUJALA JSEM VÁS?': 'INTERESTED?',
  'Kontaktujte mě': 'Contact me',
  'Napište mi': 'Write to me',

  // ── PORTFOLIO PAGE ──
  'Výběr z mé práce': 'A selection of my work',
  'Vše': 'All',
  'Rodinné': 'Family',
  'Newborn': 'Newborn',
  'Těhotenské': 'Maternity',
  'Pejsci': 'Dogs',

  // ── SERVICES PAGE ──
  'Co pro vás mohu udělat': 'What I can do for you',
  'Rodinné a <em>párové focení</em>': 'Family & <em>couple photography</em>',
  'Focení rodin, párů, sourozenců, kamarádů. Prostě všech, kteří se mají rádi a chtějí si to připomenout i za 10 let. Focení probíhá většinou venku v přírodě, nebo v mém ateliéru na Suchdole. Rodinné focení trvá cca 1–1,5 h.':
    'Photography of families, couples, siblings, friends. Simply everyone who loves each other and wants to remember it even after 10 years. The shoot usually takes place outdoors or in my studio in Suchdol. Family sessions last about 1–1.5 hours.',
  'Rodinné focení / párové focení': 'Family / couple photography',
  'V exteriéru nebo v ateliéru': 'Outdoors or in studio',
  'Cca 1–1,5 hodiny focení': 'About 1–1.5 hours of shooting',
  '50+ upravených fotografií': '50+ edited photos',
  'od 3 900 Kč': 'from 3,900 CZK',

  'Newborn — <em>miminka</em>': 'Newborn — <em>babies</em>',
  'Newborn focení je zaměřené na novorozence ve věku 5–14 dní. V tomto období jsou miminka ještě hodně ospalá a dají se krásně tvarovat do různých pozic. Focení probíhá v mém ateliéru, kde je teplo, klid a vše potřebné.':
    'Newborn photography focuses on newborns aged 5–14 days. During this period, babies are still very sleepy and can be beautifully posed. The session takes place in my studio, where it\'s warm, quiet, and fully equipped.',
  'Newborn focení (5–14 dní)': 'Newborn photography (5–14 days)',
  'V ateliéru Praha Suchdol': 'In Prague Suchdol studio',
  'Cca 2–3 hodiny focení': 'About 2–3 hours of shooting',
  '30+ upravených fotografií': '30+ edited photos',
  'od 4 900 Kč': 'from 4,900 CZK',

  'Svatební <em>focení</em>': 'Wedding <em>photography</em>',
  'Váš velký den si zaslouží být zachycen přirozeně a s citem. Focím reportážním stylem — žádné nucené pózy, ale skutečné emoce a momenty, které byste jinak zapomněli.':
    'Your big day deserves to be captured naturally and with feeling. I shoot in a reportage style — no forced poses, but real emotions and moments you would otherwise forget.',
  'Svatební den — reportážní styl': 'Wedding day — reportage style',
  'Přípravy, obřad, focení párů, hostina': 'Preparations, ceremony, couple shoot, reception',
  'Celý den nebo jen část': 'Full day or just part',
  '200–500+ upravených fotografií': '200–500+ edited photos',
  'od 15 000 Kč': 'from 15,000 CZK',

  'Psí <em>kamarádi</em>': 'Dog <em>friends</em>',
  'Máš doma mazlíka, co ti dělá radost? Focení psích kamarádů (a samozřejmě i s jejich páníčky) je něco, co mě neskutečně baví. Focení probíhá venku v přírodě.':
    'Got a pet that brings you joy? Photographing dog friends (and of course their owners) is something I absolutely love. The shoot takes place outdoors.',
  'Focení psů a jejich páníčků': 'Dog & owner photography',
  'V přírodě': 'Outdoors',
  'Cca 1 hodina focení': 'About 1 hour of shooting',
  '40+ upravených fotografií': '40+ edited photos',
  'od 3 500 Kč': 'from 3,500 CZK',

  'Těhotenské <em>focení</em>': 'Maternity <em>photography</em>',
  'Krásné období, které si zaslouží zachytit na fotografiích. Těhotenské focení je nejkrásnější kolem 30.–36. týdne těhotenství. Focení probíhá v ateliéru nebo v přírodě.':
    'A beautiful period that deserves to be captured in photos. Maternity photography is most beautiful around weeks 30–36. The shoot takes place in the studio or outdoors.',
  'Těhotenské focení (30.–36. týden)': 'Maternity photography (weeks 30–36)',
  'V ateliéru nebo venku': 'In studio or outdoors',

  'Portrétní <em>focení</em>': 'Portrait <em>photography</em>',
  'Profesionální portrétní fotografie pro vaši osobní prezentaci, LinkedIn, nebo prostě jen proto, že chcete krásné fotky sebe. Focení probíhá v ateliéru i venku.':
    'Professional portrait photography for your personal presentation, LinkedIn, or simply because you want beautiful photos of yourself. The shoot takes place both in the studio and outdoors.',
  'Portrétní / profilové focení': 'Portrait / profile photography',
  'Cca 45 min – 1 hodina': 'About 45 min – 1 hour',
  '20+ upravených fotografií': '20+ edited photos',
  'od 2 900 Kč': 'from 2,900 CZK',

  // ── ABOUT PAGE ──
  'O mně': 'About me',
  'Kdo stojí za objektivem': 'Who\'s behind the lens',
  'Ahoj, jsem <em>Majda</em>': 'Hi, I\'m <em>Majda</em>',
  'Focení mě lákalo od dětství — tenkrát jsem běhala po zahradě s foťákem od babičky a fotila všechno, co se hýbalo (většinou kočky, které se hýbat nechtěly).':
    'Photography fascinated me since childhood — I used to run around the garden with grandma\'s camera photographing everything that moved (mostly cats that didn\'t want to move).',
  'Jsem Majda, rodinná a newborn fotografka z Prahy. Focení je pro mě víc než práce — je to způsob, jak zachytit momenty, na které budete jednou vzpomínat s úsměvem.':
    'I\'m Majda, a family and newborn photographer from Prague. Photography is more than work for me — it\'s a way to capture moments you\'ll look back on with a smile.',
  'Mám ráda humor a to se objevuje i v mých fotografiích. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi záleží. Taky jsem dost upovídaná, takže kdo se bojí trapného ticha, nemusí :)':
    'I love humor and it shows in my photos. Good vibes, openness, authenticity and no awkwardness — that\'s what I care about. I\'m also quite talkative, so no awkward silence here :)',
  'PROČ PRÁVĚ JÁ?': 'WHY CHOOSE ME?',
  '10 důvodů, proč <em>fotit se mnou</em>': '10 reasons to <em>shoot with me</em>',
  'Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol. Je vhodný pro newborn focení, rodinné focení, portrétní focení i pro focení těhotných.':
    'I have a large and well-equipped studio in the quiet part of Prague — Suchdol. It\'s suitable for newborn, family, portrait, and maternity photography.',

  // ── REVIEWS PAGE ──
  'Co říkají moji klienti': 'What my clients say',
  'Newborn focení': 'Newborn photography',
  'Rodinné focení': 'Family photography',
  'Svatební focení': 'Wedding photography',
  'Focení psího kamaráda': 'Dog photography',
  'Portrétní focení': 'Portrait photography',

  // ── CONTACT PAGE ──
  'Ozvěte se mi': 'Get in touch',
  'Pojďme se <em>spojit</em>': 'Let\'s <em>connect</em>',
  'Máte zájem o focení, nebo se chcete na něco zeptat? Napište mi prostřednictvím formuláře, e-mailem nebo na sociální sítě. Ozvu se vám co nejdříve!':
    'Interested in a photo session, or have a question? Write to me via the form, email, or social media. I\'ll get back to you as soon as possible!',
  'E-mail': 'Email',
  'Telefon': 'Phone',
  'Ateliér': 'Studio',
  'Praha — Suchdol': 'Prague — Suchdol',
  'Sledujte mě': 'Follow me',
  'Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol. Ideální pro newborn, rodinné i portrétní focení.':
    'I have a large and well-equipped studio in the quiet part of Prague — Suchdol. Ideal for newborn, family, and portrait photography.',

  // ── FOOTER ──
  'Majda Martinská': 'Majda Martinská',
  'Fotografka — Praha Suchdol': 'Photographer — Prague Suchdol',
  'NAVIGACE': 'NAVIGATION',
  'KONTAKT': 'CONTACT',
  '© Majda Martinská 2026': '© Majda Martinská 2026',

  // ── COOKIE BANNER ──
  'Tato stránka používá cookies': 'This website uses cookies',
  'Na stránkách používáme soubory cookies. Některé jsou nezbytné pro fungování stránek, jiné nám umožňují poskytnout vám lepší zkušenost při návštěvě a pomáhají nám analyzovat návštěvnost.':
    'We use cookies on this website. Some are essential for the site to function, others help us provide a better experience and analyze traffic.',
  'Souhlasím': 'Accept',
  'Odmítnout': 'Decline',

  // ── CONTACT FORM ──
  'Jméno': 'Name',
  'Váš e-mail': 'Your email',
  'Typ focení': 'Type of photography',
  'Zpráva': 'Message',
  'Odeslat': 'Send',
  'Vyberte...': 'Select...',
  'Jiné': 'Other',
  'Email': 'Email',
  'Datum focení': 'Date of shoot',
  'Zvolený balíček': 'Selected package',
  '— Vyberte —': '— Select —',
  'Rodinné a portrétní focení': 'Family & portrait photography',
  'Svatba': 'Wedding',
  'Focení pejsků': 'Dog photography',
  'Další podrobnosti': 'Additional details',
  'Odeslat poptávku': 'Send inquiry',
  'CHCETE BÝT DALŠÍ?': 'WANT TO BE NEXT?',
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('cs');

  useEffect(() => {
    const saved = localStorage.getItem('majda-lang') as Lang | null;
    if (saved) setLangState(saved);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem('majda-lang', next);
  }, []);

  const t = useCallback((cs: string) => {
    if (lang === 'cs') return cs;
    return translations[cs] ?? cs;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
