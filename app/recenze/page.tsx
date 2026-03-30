'use client';

import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';

const reviews = [
  {
    text: 'Spolupracovat s Majdou byla naprostá paráda. S naším 14denním synem zacházela více než mateřsky. Fotografie jsou plné něhy, lásky a profesionality.',
    name: 'Bára M.',
    type: 'Newborn focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/341,0,1341,999,760,760,1/0-0-0/465305c9-f66c-4175-b352-2218472c9b79/1/2/_FFF7991-SharpenAI-Softness.jpg?fjkss=exp=2088927693~hmac=e5651265ed7944c54ef2104fff6f891c739eeae40455d82b8168c81c91edacf0',
  },
  {
    text: 'Majda je úžasná fotografka! Focení s ní bylo tak příjemné, že jsme zapomněli, že nás někdo fotí. Fotky jsou nádherné, přirozené a plné emocí. Doporučuji všem!',
    name: 'Lucie K.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/337,0,1337,1000,580,580,1/0-0-0/2b1abef9-f657-4d4d-af2d-f2ea0305c275/1/2/_FFF5852.jpg?fjkss=exp=2088926255~hmac=0e915221ac8400e348f232f2aaeb08aa4d77091d2dd68ad90e89e16f5a339864',
  },
  {
    text: 'Naprosto perfektní zážitek od začátku do konce. Majda je profesionálka se srdcem na správném místě. Náš malý spal jako dudlík a výsledky jsou k neuvěření.',
    name: 'Tereza S.',
    type: 'Newborn focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/105,0,1105,1000,580,580,1/0-0-0/e31af609-ffc4-4df0-9dd0-55164c01ae9c/1/2/beranci420.jpg?fjkss=exp=2088926256~hmac=f068764e9720bd72e5c31b1778dc5b3c9757133c8222f974f4fbd7a2070d2581',
  },
  {
    text: 'S Majdou jsme fotili naši svatbu a musím říct, že to bylo naprosto skvělé. Zachytila momenty, které bychom jinak propásli. Fotky jsou jako z filmu!',
    name: 'Petra a Tomáš',
    type: 'Svatební focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/242,0,1242,1000,580,580,1/0-0-0/6a22c40a-2331-4783-8eda-c50263a4e231/1/2/_FFF6358-DeNoiseAI-standard.jpg?fjkss=exp=2088926256~hmac=048edc5062605e1fa227333279bc4d80d6f5dc521a10449af549312b0ba64723',
  },
  {
    text: 'Majda fotila naši Belly, byla z ní úplně nadšená. Fotky jsou krásné a zachycují její osobnost dokonale. Super zážitek!',
    name: 'Jana H.',
    type: 'Focení psího kamaráda',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/91,0,1091,1000,580,580,1/0-0-0/df099d74-dc42-4b6c-b83e-fb2200b54189/1/2/_FFF6743.jpg?fjkss=exp=2088926255~hmac=69a228dbb31ba452684c67584e88c7e9291798244e448bc468b9c8071a5c924a',
  },
  {
    text: 'Děkujeme za krásné těhotenské fotky! Majda nás vedla, radila s pózami a výsledek je překrásný. Budeme se k fotkám rádi vracet.',
    name: 'Markéta P.',
    type: 'Těhotenské focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,2424,3650,1600,3650/0-0-0/72605f59-07d5-4cf7-a4dc-1102fb905c51/1/1/_DSC0107cb.jpg?fjkss=exp=2088681074~hmac=7ad23ece9e93b148e5817708a8f579689fc67819a6dd60cb67bdbc90bd35b52c',
  },
  {
    text: 'Focení s Majdou bylo naprosto bezstarostné. Přišli jsme, bavili se a odcházeli s pocitem, že to byl skvělý výlet, ne focení. A fotky? Dokonalé!',
    name: 'Karolína V.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/287,0,1287,1000,580,580,1/0-0-0/abd0b8bc-40a7-4cba-a769-cbc568d41c13/1/2/_FFF5931.jpg?fjkss=exp=2088681039~hmac=22be9649398a9ea56ec377944dcd6bd02254347ecc8e43027ed7075709fe618c',
  },
  {
    text: 'Majda je neuvěřitelně šikovná a milá. Náš dvouletý syn ji zbožňoval a to se projevilo i na fotkách — jsou plné smíchu a radosti.',
    name: 'Eva D.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/3f875228-71be-40bf-96d2-b419364599a1/1/1/_FFF5983.jpg?fjkss=exp=2088681035~hmac=2e9c039a5620e3d43d3fe64b3f7daef7015cc8ae1b4d717a0fea903df01196c7',
  },
  {
    text: 'Profesionální přístup od prvního kontaktu. Majda přesně věděla, co dělá, a výsledek předčil naše očekávání. Určitě se vrátíme!',
    name: 'Martina B.',
    type: 'Portrétní focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/269,0,1269,1000,580,580,1/0-0-0/03b7bbe1-7c1f-4167-adab-849497e1d2e2/1/2/_FFF0819.jpg?fjkss=exp=2088681039~hmac=b5673dbf2b60511a55402901e21d21c70b0de494fa1a65298258688c498e2a6e',
  },
  {
    text: 'Největší pochvala? Naše tříletá dcera se ptá, kdy zase půjdeme k Majdě fotit. To mluví za vše!',
    name: 'Simona R.',
    type: 'Rodinné focení',
    img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1200,800,1600,800/0-0-0/283bbdbb-fafa-42f3-9c5d-ee1044b1dfc2/1/1/_FFF8973-SharpenAI-Focus.jpg?fjkss=exp=2088681035~hmac=56bc05a3fd90f6fdd7220cfbd6907096d70ae4eda0d333aa86dd01aecffe9d4c',
  },
];

export default function RecenzePage() {
  return (
    <>
      <PageHero
        title="Recenze"
        subtitle="Co říkají moji klienti"
        image="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/287,0,1287,1000,580,580,1/0-0-0/abd0b8bc-40a7-4cba-a769-cbc568d41c13/1/2/_FFF5931.jpg?fjkss=exp=2088681039~hmac=22be9649398a9ea56ec377944dcd6bd02254347ecc8e43027ed7075709fe618c"
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
      <section className="section cta" data-animate>
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
