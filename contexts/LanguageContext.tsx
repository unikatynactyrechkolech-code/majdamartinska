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
  'RODINNÉ, SVATEBNÍ A NEWBORN FOCENÍ': 'FAMILY, WEDDING & NEWBORN PHOTOGRAPHY',
  'Vaše': 'Your',
  'příběhy': 'stories',
  'zachycené navždy': 'captured forever',
  'Chci fotky': 'I want photos',
  'Celé portfolio': 'Full portfolio',
  'Zdravím tě tam na druhém konci. Hledáš fotografa? A zároveň pohodářku? Chceš si focení užít a neprotrpět? Neváhej mi napsat!':
    'Hi there! Looking for a photographer? And a fun one? Want to enjoy the shoot without stress? Don\'t hesitate to reach out!',
  'Mám zájem': 'I\'m interested',

  // ── PROMISE ──
  'SLIBUJI VÁM': 'I PROMISE YOU',
  'Že focení bude přirozené &amp; v pohodě': 'That the shoot will be natural &amp; relaxed',
  'Zdravím tě tam na druhém konci. Hledáš fotografa? A zároveň pohodářku? Chceš si focení užít a neprotrpět? Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi při focení záleží. Neváhej mi napsat!':
    'Hi there! Looking for a photographer? And a fun one at that? Want to enjoy the shoot without stress? Good vibes, openness, authenticity and no awkwardness — that\'s what matters to me. Don\'t hesitate to write!',
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
  'Jako dítě jsem tátovi tajně brala foťák a snažila se s ním fotit. Mám ráda humor a to se objevuje i v mých fotografiích. Dobrá nálada, otevřenost, přirozenost a žádná křeč. Taky jsem dost upovídaná, takže kdo se bojí trapného ticha — nebude :)':
    'As a child, I secretly borrowed my dad\'s camera and tried to take photos. I love humor and it shows in my work. Good vibes, openness, authenticity and no awkwardness. I\'m quite talkative too, so no awkward silence here :)',
  'Více o mně': 'More about me',

  // ── MORE SERVICES ──
  'Psí kamarádi': 'Dog friends',
  'Máš doma mazlíka, který se rád válí na gauči, nebo honí sousedovi slepice? Chceš ho mít na fotkách? Tož to tady jsi správně.': 'Got a pet who loves lounging on the couch or chasing the neighbor\'s chickens? Want them in photos? You\'re in the right place.',
  'INFORMACE →': 'INFO →',
  'Těhotenské focení': 'Maternity photography',
  'Krásné období, které si zaslouží zachytit na fotografiích.': 'A beautiful period that deserves to be captured in photos.',
  'Portréty': 'Portraits',
  'Profesionální portrétní fotografie pro vaši prezentaci i osobní účely.': 'Professional portrait photography for your presentation and personal use.',

  // ── TESTIMONIALS ──
  'MILÁ SLOVA': 'KIND WORDS',
  '„Naše spolupráce s Majdou byla naprosto úžasná. S naším 14denním synem zacházela více než mateřsky. Fotografie od ní jsou plné něhy, lásky a profesionality. Mockrát děkujeme za krásné odpoledne a úžasné vzpomínky."':
    '"Our collaboration with Majda was absolutely amazing. She treated our 14-day-old son with more than motherly care. Her photos are full of tenderness, love, and professionalism. Thank you for the beautiful afternoon and wonderful memories."',

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
  'Načíst další fotky': 'Load more photos',

  // ── SERVICES PAGE ──
  'Co pro vás mohu udělat': 'What I can do for you',
  'Rodinné a <em>párové focení</em>': 'Family & <em>couple photography</em>',
  'Vyber si ateliér nebo les a louku, záleží na tobě. To hlavní ale je, aby byla pohoda a bylo to celé o příjemném zážitku, ze kterého si odneseš na památku fotografie. Nechci abys focení odbil/a v křeči, ale abys ho užil/a :)':
    "Choose the studio or a forest and meadow, it's up to you. The main thing is to have a good time and enjoy the experience. I don't want you to suffer through the shoot — I want you to enjoy it :)",
  'Rodinné focení / párové focení': 'Family / couple photography',
  'V exteriéru nebo v ateliéru': 'Outdoors or in studio',
  'Cca 1–1,5 hodiny focení': 'About 1–1.5 hours of shooting',
  '50+ upravených fotografií': '50+ edited photos',
  'od 3 900 Kč': 'from 3,900 CZK',

  'Newborn — <em>miminka</em>': 'Newborn — <em>babies</em>',
  'Focení mrňousků do 14 dnů života... to mě moc baví. Vím, že to bývá pro rodiče náročné a tak se snažím o maximální pohodlí všech. Rodiče dostanou kafíčko a dětičky mají zase zajištěnou tu nejlepší péči. Hoďte si nohy nahoru a nechte svého prťouska rozmazlovat.':
    "Photographing tiny ones up to 14 days old... I love it. I know it can be tough for parents, so I try to make everyone as comfortable as possible. Parents get coffee and babies get the best care. Put your feet up and let your little one be spoiled.",
  'Newborn focení (5–14 dní)': 'Newborn photography (5–14 days)',
  'V ateliéru Praha Suchdol': 'In Prague Suchdol studio',
  'Cca 2–3 hodiny focení': 'About 2–3 hours of shooting',
  '30+ upravených fotografií': '30+ edited photos',
  'od 4 900 Kč': 'from 4,900 CZK',

  'Svatební <em>focení</em>': 'Wedding <em>photography</em>',
  'Ahoj budoucí novomanželé. Bojíte se abyste měli na fotkách všechno? Bojíte se, aby fotograf nenarušoval váš krásný den? Bojíte se, že bude fotograf protiva? Tak se nebojte :). Právě jste našli, to co hledáte :)))':
    "Hello future newlyweds. Worried about getting everything in photos? Worried the photographer will disrupt your beautiful day? Worried the photographer will be annoying? Don't worry :). You've just found what you're looking for :)))",
  'Svatební den — reportážní styl': 'Wedding day — reportage style',
  'Přípravy, obřad, focení párů, hostina': 'Preparations, ceremony, couple shoot, reception',
  'Celý den nebo jen část': 'Full day or just part',
  '200–500+ upravených fotografií': '200–500+ edited photos',
  'od 15 000 Kč': 'from 15,000 CZK',

  'Psí <em>kamarádi</em>': 'Dog <em>friends</em>',
  'Máš doma mazlíka, který se rád válí na gauči, nebo honí sousedovi slepice, nebo trhá pošťákovi kalhoty? Chceš ho mít na očích stále a dívat se na něj na fotkách nebo obraze? Tož to tady jsi správně.':
    "Got a pet who loves lounging on the couch, chasing the neighbor's chickens, or ripping the mailman's pants? Want to see them in photos or on canvas? You're in the right place.",
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
  'Jako dítě jsem tátovi tajně brala foťák a snažila jsem se s ním fotit. Ale pak jsem ze strachu, že na to přijde, vyndavala negativy ven :)). Nu škoda, možná by to mohly být pěkné záběry. Tak jako tak, fakt je, že mě focení lákalo od dětství.':
    "As a child, I secretly borrowed my dad's camera and tried to take photos. But then, afraid he'd find out, I pulled the negatives out :)). Too bad, they might have been nice shots. Anyway, the fact is photography fascinated me since childhood.",
  'Nejraději fotím bláznivé fotky se špetkou humoru. Mám moc ráda humor a to se objevuje v mých uměleckých fotografiích. A světe div se, i komerční focení probíhá ve veselém tónu.':
    'I love shooting quirky photos with a touch of humor. Humor is a big part of my artistic photography. And believe it or not, even commercial shoots happen in a fun atmosphere.',
  'Dobrá nálada, otevřenost, přirozenost a žádná křeč... to je to, na čem mi při focení záleží :). Taky jsem dost upovídaná. Maminka by spíš řekla: \'ty tu klapačku taky nezavřeš\'. Takže kdo se bojí trapného ticha — nebude :))':
    "Good vibes, openness, authenticity and no awkwardness... that's what I care about :). I'm also quite talkative. Mom would say: 'you never stop talking'. So if you're afraid of awkward silence — don't worry :))",
  'PROČ PRÁVĚ JÁ?': 'WHY CHOOSE ME?',
  '10 důvodů, proč <em>fotit se mnou</em> a ne od Pučálkovic Aminy': '10 reasons to <em>shoot with me</em> and not with Pučálkovic Amina',
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
