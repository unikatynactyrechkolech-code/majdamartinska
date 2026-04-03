'use client';

import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';

const reviews = [
  {
    text: 'Naše spolupráce s Majdou byla naprosto úžasná. S naším 14denním synem zacházela více než mateřsky. Paní Majdu mohu zcela doporučit, fotografie od ní jsou plné něhy, lásky a profesionality.',
    name: 'Bára M.',
    type: 'Newborn focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/341,0,1341,999,760,760,1/0-0-0/465305c9-f66c-4175-b352-2218472c9b79/1/2/_FFF7991-SharpenAI-Softness.jpg?fjkss=exp=2088927693~hmac=e5651265ed7944c54ef2104fff6f891c739eeae40455d82b8168c81c91edacf0',
  },
  {
    text: 'S Majdou spolupracuji už přes 10 let. Má neskutečný cit pro atmosféru a specifickou náladu fotky. Je plná nápadů, umí fotkou vystihnout osobnost foceného. Focení s ní je zábava a zároveň je velký profesionál.',
    name: 'Anna B.',
    type: 'Ateliérové focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/115,0,777,661,760,760,1/0-0-0/edbbb663-2ba2-42f7-b5c4-44890793798c/1/2/gina27.jpg?fjkss=exp=2090601184~hmac=cf91463105783017e5edfc38fbe6bd024529bfa240e371dade8a1c91aa2854e4',
  },
  {
    text: 'Spolupracovat s Majdou je úžasné. Z profesionálního hlediska se jí nedá naprosto nic vytknout. Její práce je dokonalá. Jako člověk je poklad — neustále úsměvavá, plná nápadů.',
    name: 'Katka K.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/137,39,690,592,760,760,1/0-0-0/349ae2e3-df92-4681-a030-2aa2bca00875/1/2/DSC_9060.jpg?fjkss=exp=2090601184~hmac=33cf71297f9589a802e0a91639572733aaab716a6c737a1572b62c77c63b6ad4',
  },
  {
    text: 'S Majdou šlo celé focení jako po másle. Z našeho setkání se stala nenucená procházka přírodou. Člověk se nemusí cítit jako loutka. Když mi přišel výsledek, byla jsem jedním slovem dojatá.',
    name: 'Pavla K.',
    type: 'Portrétní focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/277,0,944,667,760,760,1/0-0-0/4c99907e-5e3e-47b8-ae54-7369b064686e/1/2/10M.jpg?fjkss=exp=2090601184~hmac=86bc4ab6651e461af11c5277cfb4775502663ac030f2ccc39a220f7f59ad9b35',
  },
  {
    text: 'Majda nás fotila v ateliéru i doma. Má talent zachytit správný okamžik, během focení byla velmi přátelská a uvolněná nálada. Měla spoustu skvělých nápadů na fotky.',
    name: 'Pavlína N.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/134,0,796,661,760,760,1/0-0-0/1c9eb9e5-b985-473c-99fe-a6bcfdd88523/1/2/laura16-DeNoiseAI-standard.jpg?fjkss=exp=2090601184~hmac=aa561765809443709ffd756246cb598f53ebb1ac13440494b185bc7745e2b0ea',
  },
  {
    text: 'Kdo zná Majdu, moc dobře ví, že vyniká v mnoha oblastech a fotografie je rozhodně jednou z nich. Každá fotka má duši a nápad. Její práce je opravdu dokonalá! Doporučuji všemi deseti!!!',
    name: 'Jana H.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,599,599,760,760,1/0-0-0/ac0b5ade-1d3c-4658-8072-8bfd2196cc66/1/2/1403156454_large_dsc_0052.jpg?fjkss=exp=2090601184~hmac=6efc764c3a2c38300a4b8c235f3a75222be0c99ee6b5696865ff6873943716e5',
  },
  {
    text: 'Velice příjemné focení a krásně strávený čas. Příjemné jednání a bezproblémová domluva. Paní fotografka již v den focení zaslala náhled fotografií. Upravené fotografie dodány ani ne za týden. Mohu jen doporučit.',
    name: 'Michal L.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/296,0,1296,999,760,760,1/0-0-0/abd0b8bc-40a7-4cba-a769-cbc568d41c13/1/2/_FFF5931.jpg?fjkss=exp=2090601184~hmac=85e63927f104172358e6d9eed6a9e164e628bdfb4bcb6afe4687a4f9d92b6a98',
  },
  {
    text: 'Doporučuji všem!!!! Skvělá fotografka, fotky, které vznikají v naprosto pohodové atmosféře. Potřebovala bych pro hodnocení více hvězdiček, 5 je za mě v tomto případě málo :o)',
    name: 'Alice C.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/6307f6b1-d040-46e9-a09b-e1d7f0b123b4/1/2/_FFF3016+%282%29.jpg?fjkss=exp=2090601184~hmac=01dc98cdfd284507ef78f5763a19ace234a08bfc7c45fa14a7731ae85ca0b92e',
  },
  {
    text: 'Newborn focení u Majdy byla naprostá paráda. Byl to nesmírně příjemně strávený čas plný pohody a klidu. Budu se moc těšit na příští setkání. Fotky jsou překrásné...',
    name: 'Iveta V.',
    type: 'Newborn focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/c5a007bb-a1a1-43e4-8df5-22c25afef071/1/2/429929096_737922395110204_1352912403146508007_n.jpg?fjkss=exp=2090601184~hmac=01dc98cdfd284507ef78f5763a19ace234a08bfc7c45fa14a7731ae85ca0b92e',
  },
  {
    text: 'Od začátku samý úsměv, skvělá karma, to ti dají zcela zdarma. Uvolníš se během chvíle, potom přijde spousta píle. Celou dobu samý smích, všechno v profi kolejích. Závěrem jsou fotky krásné!',
    name: 'Petra M.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/a096d9ab-e562-48eb-988b-ea0246dddcf6/1/2/_FFF5743b.jpg?fjkss=exp=2090601184~hmac=01dc98cdfd284507ef78f5763a19ace234a08bfc7c45fa14a7731ae85ca0b92e',
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
