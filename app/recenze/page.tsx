'use client';

import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';

const reviews = [
  {
    text: 'Požádala jsem Majdu o fotografie pro web. S Majdou šlo celé focení jako po másle. Z našeho setkání se stala nenucená procházka přírodou, kdy se člověk má prostor nejen nadechnout, ale také uvolnit. Navíc je Majda velmi empatická, trpělivá a má neotřelé nápady na místa i způsoby, jak si člověka postavit. Člověk se tak nemusí cítit jako nějaká loutka nebo umělá figurína. Když mi přišel výsledek, byla jsem jedním slovem dojatá. Z vlastních fotek na mě dýchla taková pohoda, jakou jsem při focení cítila.',
    name: 'Pavla K.',
    type: 'Portrétní focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/277,0,944,667,760,760,1/0-0-0/4c99907e-5e3e-47b8-ae54-7369b064686e/1/2/10M.jpg?fjkss=exp=2090919623~hmac=ce3e7c6dd1fa9b550f440089a22b44a4210343750b92c05df5c708d09df35a75',
  },
  {
    text: 'S Majdou spolupracuji už přes 10 let. Kromě fotek ateliérových, v exteriéru i svatebních, nyní rozšířila svou nabídku o natáčení videí. Kromě svatby jsem vyzkoušela všechny služby a můžu jen doporučit. Majda má neskutečný cit pro atmosféru a specifickou náladu fotky. Je plná nápadů, umí fotkou či videem vystihnout osobnost foceného. Nikdy se mi nestalo, že by mě štelovala do nepřirozených pozic nebo aranžovaných póz. Focení s ní je zábava a zároveň je velký profesionál — umí to jak s dětmi, tak se stydlivými dospělými. Také mám ráda její volnou tvorbu — velmi nápadité až snové fotky.',
    name: 'Anna B.',
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
    text: 'Velice příjemné focení a krásně strávený čas. Příjemné jednání a bezproblémová domluva. Paní fotografka má vytipovaných pár míst, které jsou moc hezké na fotky. Paní fotografka již v den focení zaslala náhled fotografií, ze kterých si je možné následně vybrat. Upravené fotografie byly dodány ani ne za týden. Mohu jen doporučit.',
    name: 'Michal L.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/296,0,1296,999,760,760,1/0-0-0/abd0b8bc-40a7-4cba-a769-cbc568d41c13/1/2/_FFF5931.jpg?fjkss=exp=2090919623~hmac=305b309b1a3b66c9e0d00ed67a35d052ee226576826fd079a83b0a596c3d29f6',
  },
  {
    text: 'Naše spolupráce s Majdou byla naprosto úžasná. S naším 14denním synem zacházela více než mateřsky. Celé focení bylo zcela v její režii a my si s partnerem mohli vypít v klidu kávu a popovídat. ☺️ Paní Majdu Martinskou mohu zcela doporučit, nejen díky úžasnému přístupu k synovi, ale hlavně fotografie od ní jsou plné něhy, lásky a profesionality. Ještě jednou mockrát děkujeme za krásné odpoledne a úžasné vzpomínky ve formě nádherných fotografií.',
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
    text: 'Chtěla bych napsat jen pár řádků, jestli bylo vše v pořádku, no tak tedy od začátku, nevyprávím vám pohádku, v domluvenou dobu denní, razili jsem na focení, počáteční naše tréma, hned nám byla rozprášena, samý úsměv, skvělá karma, to ti dají zcela zdarma, uvolníš se během chvíle, potom přijde spousta píle, celou dobu samý smích, všechno v profi kolejích, závěrem jsou fotky krásné, z kterých jen každý žasne, nemusíš pak vybrat lišku, ani spořitelní knížku, když dáš fotky na sítě, nával lajků, svalí tě...',
    name: 'Petra M.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/a096d9ab-e562-48eb-988b-ea0246dddcf6/1/2/_FFF5743b.jpg?fjkss=exp=2090919623~hmac=83506d2537607b825b52448dcae491926d90a43b3feee4156829a670c0d502c8',
  },
  {
    text: 'Newborn focení u Majdy byla naprostá paráda, moc jsem si to užila a to i přes to, že jsem z něj předem měla velké obavy kvůli vzdorovitému období mé tříleté záškoďačky, která se prostě fotit „nechce a nebude", nicméně od Majdy se dokonce nechala přemluvit i na společné fotky se svojí dvoutýdenní sestřičkou. Byl to nesmírně příjemně strávený čas plný pohody a klidu, za který jsem obrovsky vděčná. Budu se moc těšit na příští setkání. Veliké díky za vše, fotky jsou překrásné...',
    name: 'Iveta V.',
    type: 'Newborn focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/c5a007bb-a1a1-43e4-8df5-22c25afef071/1/2/429929096_737922395110204_1352912403146508007_n.jpg?fjkss=exp=2090919623~hmac=83506d2537607b825b52448dcae491926d90a43b3feee4156829a670c0d502c8',
  },
];

export default function RecenzePage() {
  return (
    <>
      <PageHero
        title="Recenze"
        subtitle="Co říkají moji klienti"
        sectionPrefix="recenze.hero"
      />

      <section className="section" data-animate>
        <div className="container">
          <div className="reviews-grid">
            {reviews.map((review, idx) => (
              <div className="review-card" key={idx}>
                <div className="review-stars">★★★★★</div>
                <p className="review-text">
                  <EditableText sectionId={`recenze.review${idx + 1}.text`} defaultValue={`\u201E${review.text}\u201C`} as="span" multiline />
                </p>
                <div className="review-author">
                  <EditableImage
                    sectionId={`recenze.review${idx + 1}.img`}
                    src={review.img}
                    alt={review.name}
                    width={48}
                    height={48}
                    sizes="48px"
                    style={{ borderRadius: '50%', objectFit: 'cover', width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', flexShrink: 0 }}
                    overlayCompact
                    noLightbox
                    unoptimized
                  />
                  <div>
                    <EditableText sectionId={`recenze.review${idx + 1}.name`} defaultValue={review.name} as="strong" />
                    <EditableText sectionId={`recenze.review${idx + 1}.type`} defaultValue={review.type} as="span" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta section-brown" data-animate>
        <div className="container">
          <EditableText sectionId="recenze.cta.label" defaultValue="CHCETE BÝT DALŠÍ?" as="p" className="section-label" />
          <h2 className="section-title-big">
            <EditableText sectionId="recenze.cta.title" defaultValue="Pojďme <em>do toho</em>" as="span" />
          </h2>
          <Link href="/kontakt" className="btn btn-primary">
            <EditableText sectionId="recenze.cta.btn" defaultValue="Napište mi" as="span" />
          </Link>
        </div>
      </section>
    </>
  );
}
