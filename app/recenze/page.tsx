'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { EditableText } from '@/components/EditableText';
import { useLang } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { ReviewAdmin } from '@/components/ReviewAdmin';
import type { Review } from '@/app/actions/reviews';

const staticReviews = [
  {
    text: 'Požádala jsem Majdu o fotografie pro web, který prezentuje mé konzultace. Přestože jsem přátelské a komunikativní povahy, nejsem typ člověka, který se potřebuje předvést před objektivem při každé příležitosti. Proto je pro mě cílené pózování před fotoaparátem výstup z komfortní zóny. Ale s Majdou šlo celé focení jako po másle. Z našeho setkání se stala nenucená procházka přírodou, kdy se člověk má prostor nejen nadechnout, ale také uvolnit. Takže nějaké to cvaknutí fotoaparátu už jej pak ani nerozhodí. Navíc je Majda velmi empatická, trpělivá a má neotřelé nápady na místa i způsoby, jak si člověka postavit. Člověk se tak nemusí cítit jako nějaká loutka nebo umělá figurína. Když mi přišel výsledek, byla jsem jedním slovem dojatá. Z vlastních fotek na mě dýchla taková pohoda, jakou jsem při focení cítila a také chci přes můj web předávat mým klientům. Přestože od focení s Majdou uplynul již nějaký čas, stále se na fotky dívám s velkou vděčností a ráda na to naše společné focení vzpomínám.',
    name: 'Pavla K.',
    type: 'Portrétní focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/277,0,944,667,760,760,1/0-0-0/4c99907e-5e3e-47b8-ae54-7369b064686e/1/2/10M.jpg?fjkss=exp=2090919623~hmac=ce3e7c6dd1fa9b550f440089a22b44a4210343750b92c05df5c708d09df35a75',
  },
  {
    text: 'S Majdou spolupracuji už přes 10 let. Kromě fotek ateliérových, v exteriéru i svatebních, nyní rozšířila svou nabídku o natáčení videí. Kromě svatby jsem vyzkoušela všechny služby a můžu jen doporučit. Majda má neskutečný cit pro atmosféru a specifickou náladu fotky. Je plná nápadů, umí fotkou či videem vystihnout osobnost foceného. Nikdy se mi nestalo, že by mě štelovala do nepřirozených pozic nebo aranžovaných póz. Focení s ní je zábava a zároveň je velký profesionál — umí to jak s dětmi, tak se stydlivými dospělými. Také mám ráda její volnou tvorbu — velmi nápadité až snové fotky.',
    name: 'Anna B. (Prolhaná Anna)',
    type: 'Ateliérové focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/115,0,777,661,760,760,1/0-0-0/edbbb663-2ba2-42f7-b5c4-44890793798c/1/2/gina27.jpg?fjkss=exp=2090919623~hmac=4b155c06d14a539f3798ba4806f6db6cfa584b9746cda7045fd6b5c651173292',
  },
  {
    text: 'Spolupracovat s Majdou je úžasné. Mám tu čest z obou stran. Z profesionálního hlediska se jí nedá naprosto nic vytknout. Její práce je dokonalá. Jako člověk je poklad. Neustále úsměvavá, plná nápadů. Vlastní úžasný ateliér, ve kterém se cítíte jak v pohádce a tak vypadá i její spolupráce s vámi.',
    name: 'Katka K.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/137,39,690,592,760,760,1/0-0-0/349ae2e3-df92-4681-a030-2aa2bca00875/1/2/DSC_9060.jpg?fjkss=exp=2090919623~hmac=30e7bbdd3afa847acee024891b0caf630b35045200f2e4aff9580310f8cfd82a',
  },
  {
    text: 'Majda nás fotila jednou v ateliéru a jednou za námi na focení přijela domů. Majda má talent, zachytit správný okamžik, během focení byla velmi přátelská a uvolněná nálada. O pár fotkách jsme měli představu předem, zbytek jsme nechali na Majdě, která měla spoustu skvělých nápadů na fotky. Fotky jsme obdrželi brzy 🙂',
    name: 'Pavlína N.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/134,0,796,661,760,760,1/0-0-0/1c9eb9e5-b985-473c-99fe-a6bcfdd88523/1/2/laura16-DeNoiseAI-standard.jpg?fjkss=exp=2090919623~hmac=286b183a663af0e945dac29cf41f496c9ec26c09b01710120641e9ba68b9ac39',
  },
  {
    text: 'Kdo zná Majdu, moc dobře ví, že vyniká v mnoha oblastech a fotografie je rozhodně jednou z nich. Každá fotka má duši a nápad. Majdu znám velmi dlouho a její práce je opravdu dokonalá! Doporučuji všemi deseti!!!',
    name: 'Jana H.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,599,599,760,760,1/0-0-0/ac0b5ade-1d3c-4658-8072-8bfd2196cc66/1/2/1403156454_large_dsc_0052.jpg?fjkss=exp=2090919623~hmac=aa94796293b2a7b2f23db17e0296e8634f467879968dea20a5f32713cee0d750',
  },
  {
    text: 'Velice příjemné focení a krásně strávený čas. Příjemné jednání a bezproblémová domluva. Paní fotografka má vytipovaných pár míst, které jsou moc hezké na fotky. Paní fotografka již v den focení zaslala náhled fotografií ze kterých si je možné následně vybrat. Upravené fotografie byly dodány ani ne za týden. Mohu jen doporučit.',
    name: 'Michal L.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/296,0,1296,999,760,760,1/0-0-0/abd0b8bc-40a7-4cba-a769-cbc568d41c13/1/2/_FFF5931.jpg?fjkss=exp=2090919623~hmac=305b309b1a3b66c9e0d00ed67a35d052ee226576826fd079a83b0a596c3d29f6',
  },
  {
    text: 'Naše spolupráce s Majdou byla naprosto úžasná. S naším 14 denním synem zacházela více než mateřsky. Celé focení bylo zcela v její režii a my si s partnerem mohli vypít v klidu kávu a popovídat. ☺️ Paní Majdu Martinskou mohu zcela doporučit, nejen díky úžasnému přístupu k synovi, ale hlavně fotografie od ní jsou plné něhy, lásky a profesionality. Ještě jednou mockrát děkujeme za krásné odpoledne a úžasné vzpomínky ve formě nádherných fotografií. Marešová',
    name: 'Bára M.',
    type: 'Newborn focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/341,0,1341,999,760,760,1/0-0-0/465305c9-f66c-4175-b352-2218472c9b79/1/2/_FFF7991-SharpenAI-Softness.jpg?fjkss=exp=2090919623~hmac=05f012f47194b07c6b2e984bff30bbead52c8c6c423e9cc02f6109f6a5208fe9',
  },
  {
    text: 'Doporučuji všem!!!! Skvělá fotografka, fotky, které vznikají v naprosto pohodové atmosféře. Potřebovala bych pro hodnocení více hvězdiček, 5 * je za mě v tomto případě málo :o)',
    name: 'Alice C.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/6307f6b1-d040-46e9-a09b-e1d7f0b123b4/1/2/_FFF3016+%282%29.jpg?fjkss=exp=2090919623~hmac=83506d2537607b825b52448dcae491926d90a43b3feee4156829a670c0d502c8',
  },
  {
    text: 'Chtěla bych napsat jen pár řádků, jestli bylo vše v pořádku, no tak tedy od začátku, nevyprávím vám pohádku, v domluvenou dobu denní, razili jsem na focení, počáteční naše tréma, hned nám byla rozprášena, samý úsměv, skvělá karma, to ti dají zcela zdarma, uvolníš se během chvíle, potom přijde spousta píle, celou dobu samý smích, všechno v profi kolejích, závěrem jsou fotky krásné, z kterých jen každý žasne, nemusíš pak vybrat lišku, ani spořitelní knížku, když dáš fotky na sítě, nával laiků, svalí tě. Můžeme jen doporučit 🤗. Majdí, díky za vše, jdem se chlubit.',
    name: 'Petra M.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/a096d9ab-e562-48eb-988b-ea0246dddcf6/1/2/_FFF5743b.jpg?fjkss=exp=2090919623~hmac=83506d2537607b825b52448dcae491926d90a43b3feee4156829a670c0d502c8',
  },
  {
    text: 'Newborn focení u Majdy byla naprostá paráda, moc jsem si to užila a to i přes to, že jsem z něj předem měla velké obavy kvůli vzdorovitému období mé tříleté záškoďačky, která se prostě fotit „nechce a nebude", nicméně od Majdy se dokonce nechala přemluvit i na společné fotky se svojí dvoutýdenní sestřičkou. Byl to nesmírně příjemně strávený čas plný pohody a klidu, za který jsem obrovsky vděčná a díky kterému budeme mít již navždycky nádhernou vzpomínku. Budu se moc těšit na příští setkání (snad nás ještě Majda přijme, až třeba tu záškoďačku vzdor přejde) při dalším focení, kterého určitě velmi ráda při nejbližší možné příležitosti u Majdy využiji. Veliké díky za vše, fotky jsou překrásné...',
    name: 'Iveta V.',
    type: 'Newborn focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/c5a007bb-a1a1-43e4-8df5-22c25afef071/1/2/429929096_737922395110204_1352912403146508007_n.jpg?fjkss=exp=2090919623~hmac=83506d2537607b825b52448dcae491926d90a43b3feee4156829a670c0d502c8',
  },
];

/* Threshold: reviews shorter than this are shown in full */
const COLLAPSED_LENGTH = 200;

function ReviewCard({ text, name, type, img, stars = 5 }: { text: string; name: string; type: string; img: string; stars?: number }) {
  const { t } = useLang();
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > COLLAPSED_LENGTH;

  return (
    <div className="review-card">
      <div className="review-stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
      <div className={`review-text ${isLong && !expanded ? 'review-text-collapsed' : ''}`}>
        <span>{`\u201E${text}\u201C`}</span>
      </div>
      {isLong && (
        <button
          type="button"
          className="review-read-more"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? t('Skrýt') : t('Číst více')}
        </button>
      )}
      <div className="review-author">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={name}
            width={48}
            height={48}
            style={{ borderRadius: '50%', objectFit: 'cover', width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', flexShrink: 0 }}
          />
        ) : (
          <span style={{ fontSize: 32, lineHeight: 1, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0ebe5', borderRadius: '50%', flexShrink: 0 }}>👤</span>
        )}
        <div>
          <strong>{name}</strong>
          <span>{type}</span>
        </div>
      </div>
    </div>
  );
}

export default function RecenzePage() {
  const { isAdmin } = useAdmin();
  const { lang, t } = useLang();
  const [dbReviews, setDbReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { getReviews } = await import('@/app/actions/reviews');
        const data = await getReviews(true);
        setDbReviews(data);
      } catch { /* fallback to static */ }
    })();
  }, []);

  // Vždy zobrazit statické recenze + přidat nové z DB (ty co nejsou v statickém poli)
  const staticDisplay = staticReviews.map((r) => ({ text: r.text, name: r.name, type: r.type, img: r.img, stars: 5 }));
  const dbDisplay = (dbReviews ?? [])
    .filter((r) => !staticReviews.some((s) => s.name === r.name))
    .map((r) => ({
      text: lang === 'en' && r.text_en ? r.text_en : r.text,
      name: lang === 'en' && r.name_en ? r.name_en : r.name,
      type: lang === 'en' && r.type_en ? r.type_en : r.type,
      img: r.profile_image || '',
      stars: r.stars ?? 5,
    }));
  const displayReviews = [...staticDisplay, ...dbDisplay];

  return (
    <>
      <PageHero
        title="Recenze"
        subtitle="Co říkají spokojení klienti o mém focení"
        sectionPrefix="recenze.hero"
      />

      <section className="section" data-animate>
        <div className="container">
          <div className="reviews-grid">
            {displayReviews.map((review, idx) => (
              <ReviewCard key={idx} {...review} />
            ))}
          </div>

          <div className="reviews-google-cta">
            <a
              href="https://www.google.com/maps/place/Majda+Martinsk%C3%A1+-+fotografka/@50.1450432,14.3863492,573m/data=!3m1!1e3!4m8!3m7!1s0x470bea7863f292ed:0x21debe4dffdc2402!8m2!3d50.1450432!4d14.3863492!9m1!1b1!16s%2Fg%2F119t95l5q!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-google-reviews"
            >
              <svg className="google-logo" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t('Všechny recenze')}
            </a>
          </div>
        </div>
      </section>

      {isAdmin && <ReviewAdmin />}

      {/* CTA */}
      <section className="section cta section-brown" data-animate>
        <div className="container">
          <EditableText sectionId="recenze.cta.label" defaultValue="CHCETE BÝT DALŠÍ?" as="p" className="section-label" />
          <h2 className="section-title-big">
            <EditableText sectionId="recenze.cta.title" defaultValue="Objednejte si <em>focení</em> i vy" as="span" />
          </h2>
          <Link href="/kontakt" className="btn btn-primary">
            <EditableText sectionId="recenze.cta.btn" defaultValue="Napište mi" as="span" />
          </Link>
        </div>
      </section>
    </>
  );
}
