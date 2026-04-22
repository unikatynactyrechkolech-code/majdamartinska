'use client';

import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';

/* ============================================================
   ServiceSection — pevny obrazek + editovatelny intro text +
   3 sloupce s volnym textem (titul, popis, cena).
   Vsechno editovatelne pres EditableText (klikni v admin modu).
   ============================================================ */

interface ServiceSectionProps {
  id: string;
  prefix: string; // napr. "sluzby.rodinna"
  number: string; // "01"
  reverse?: boolean;
  brown?: boolean;
  defaults: {
    img: string;
    imgAlt: string;
    title: string; // smí obsahovat <em>...</em>
    text: string;
    pkg: [
      { title: string; desc: string; price: string },
      { title: string; desc: string; price: string },
      { title: string; desc: string; price: string },
    ];
  };
}

function ServiceSection({ id, prefix, number, reverse, brown, defaults }: ServiceSectionProps) {
  return (
    <section
      className={`section service-detail ${brown ? 'section-brown' : ''}`}
      id={id}
      data-animate
    >
      <div className="container">
        <div className={`service-detail-grid ${reverse ? 'reverse' : ''}`}>
          <div className="service-detail-img">
            <EditableImage
              sectionId={`${prefix}.img`}
              src={defaults.img}
              alt={defaults.imgAlt}
              width={700}
              height={875}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </div>
          <div className="service-detail-content">
            <p className="section-label">{number}</p>
            <h2>
              <EditableText sectionId={`${prefix}.title`} defaultValue={defaults.title} as="span" />
            </h2>
            <EditableText
              sectionId={`${prefix}.text`}
              defaultValue={defaults.text}
              as="p"
              multiline
            />
            <Link href="/kontakt" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <EditableText sectionId={`${prefix}.btn`} defaultValue="Chci fotky" as="span" />
            </Link>
          </div>
        </div>

        {/* 3 BALÍČKY — volný text, vše editovatelné */}
        <div className="service-packages">
          {defaults.pkg.map((p, i) => {
            const n = i + 1;
            return (
              <div className="service-package-card" key={n}>
                <h3 className="service-package-title">
                  <EditableText
                    sectionId={`${prefix}.pkg${n}.title`}
                    defaultValue={p.title}
                    as="span"
                  />
                </h3>
                <div className="service-package-price">
                  <EditableText
                    sectionId={`${prefix}.pkg${n}.price`}
                    defaultValue={p.price}
                    as="span"
                  />
                </div>
                <div className="service-package-desc">
                  <EditableText
                    sectionId={`${prefix}.pkg${n}.desc`}
                    defaultValue={p.desc}
                    as="p"
                    multiline
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function SluzbyPage() {
  return (
    <>
      <PageHero
        title="Služby a ceník focení"
        subtitle="Nabídka profesionálního focení v Praze"
        sectionPrefix="sluzby.hero"
      />

      <h2 className="seo-heading">Služby a ceník focení Praha — rodinné focení, svatební fotograf, newborn focení, portréty, těhotenské a focení psů</h2>

      {/* INTRO SEKCE — vita klienta a vysvetluje filozofii cen */}
      <section className="section" data-animate>
        <div className="container" style={{ maxWidth: '780px' }}>
          <EditableText
            sectionId="sluzby.intro.location"
            defaultValue="A kde tedy budeme fotit? Venku je škaredě? Pojď se zavřít do ateliéru a dát si teplý čaj nebo kafe. Nebo chceš fotit venku? No problemo. No zkrátka, jak chceš. Osobně mám raději focení venku. Přeci jen je to krapet přirozenější :). No ale víš, co? Ono není moc důležité, kde budeme fotit, ale aby u toho byla dobrá nálada. Abys domů odcházel/a nadšený/á a to dokonce bez toho, aniž bys nějakou fotku viděl/a :). A co teprve až je uvidíš :). Pro mě je důležité, aby si na fotkách působil/a spokojeně a aby ses tak hlavně cítil/a."
            as="p"
            multiline
            style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}
          />
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <EditableText sectionId="sluzby.intro.price.title" defaultValue="A teď k ceně…" as="span" />
          </h2>
          <EditableText
            sectionId="sluzby.intro.price.text"
            defaultValue="Pojďme na to bez zbytečné omáčky. Na výběr máš možnosti podle času focení. Někdo se cítí na půl hodinky focení a někomu focení nevadí a zvládne levou zadní klidně hodinku a půl :)."
            as="p"
            multiline
            style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-text-muted)', textAlign: 'center' }}
          />
        </div>
      </section>

      <ServiceSection
        id="rodinna"
        prefix="sluzby.rodinna"
        number="01"
        defaults={{
          img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/337,0,1337,1000,580,580,1/0-0-0/2b1abef9-f657-4d4d-af2d-f2ea0305c275/1/2/_FFF5852.jpg?fjkss=exp=2088926255~hmac=0e915221ac8400e348f232f2aaeb08aa4d77091d2dd68ad90e89e16f5a339864',
          imgAlt: 'Rodinné focení',
          title: 'Rodinné a <em>párové focení</em> v Praze',
          text: 'Vyber si ateliér nebo les a louku, záleží na tobě. To hlavní ale je, aby byla pohoda a bylo to celé o příjemném zážitku, ze kterého si odneseš na památku fotografie. Nechci abys focení odbil/a v křeči, ale abys ho užil/a :)',
          pkg: [
            { title: '30 minut',  price: '2 100 Kč', desc: '• 10 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů<br>• každá další fotografie 140 Kč' },
            { title: '1 hodina',  price: '3 500 Kč', desc: '• 20 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů<br>• každá další fotografie 120 Kč' },
            { title: '1,5 hodiny', price: '4 700 Kč', desc: '• 30 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů<br>• leporelo s výběrem fotografií<br>• každá další fotografie 100 Kč' },
          ],
        }}
      />

      <ServiceSection
        id="newborn"
        prefix="sluzby.newborn"
        number="02"
        reverse
        brown
        defaults={{
          img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/105,0,1105,1000,580,580,1/0-0-0/e31af609-ffc4-4df0-9dd0-55164c01ae9c/1/2/beranci420.jpg?fjkss=exp=2088926256~hmac=f068764e9720bd72e5c31b1778dc5b3c9757133c8222f974f4fbd7a2070d2581',
          imgAlt: 'Newborn focení',
          title: 'Newborn focení <em>miminek</em> v ateliéru',
          text: 'Focení mrňousků do 14 dnů života... to mě moc baví. Vím, že to bývá pro rodiče náročné a tak se snažím o maximální pohodlí všech. Rodiče dostanou kafíčko a dětičky mají zase zajištěnou tu nejlepší péči. Hoďte si nohy nahoru a nechte svého prťouska rozmazlovat.',
          pkg: [
            { title: 'Newborn focení',  price: 'po domluvě', desc: '• focení miminka v ateliéru<br>• ideální do 14 dnů života<br>• rekvizity, oblečky a koruny v ceně<br>• napiš mi a domluvíme se na termínu i ceně' },
            { title: 'Mimišky — 3 měs.',      price: 'po domluvě', desc: '• focení větších mimiček (3–6 měs.)<br>• ateliér Praha-Suchdol<br>• individuální nacenění dle přání' },
            { title: 'Rodina + miminko',       price: 'po domluvě', desc: '• něžné společné fotky celé rodiny<br>• v ateliéru i venku<br>• ozvi se a vymýšlíme to spolu' },
          ],
        }}
      />

      <ServiceSection
        id="svatby"
        prefix="sluzby.svatby"
        number="03"
        defaults={{
          img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/242,0,1242,1000,580,580,1/0-0-0/6a22c40a-2331-4783-8eda-c50263a4e231/1/2/_FFF6358-DeNoiseAI-standard.jpg?fjkss=exp=2088926256~hmac=048edc5062605e1fa227333279bc4d80d6f5dc521a10449af549312b0ba64723',
          imgAlt: 'Svatební focení',
          title: 'Svatební <em>fotografie</em> plné emocí',
          text: 'Ahoj budoucí novomanželé. Bojíte se abyste měli na fotkách všechno? Bojíte se, aby fotograf nenarušoval váš krásný den? Bojíte se, že bude fotograf protiva? Tak se nebojte :). Právě jste našli, to co hledáte :)))',
          pkg: [
            { title: 'Obřad',         price: 'po domluvě',  desc: '• samotný obřad<br>• první společné portréty<br>• gratulování hostů<br>• napiš mi a domluvíme se' },
            { title: 'Půl dne',       price: 'po domluvě', desc: '• přípravy nevěsty<br>• obřad<br>• portréty páru<br>• cena dle konkrétního přání' },
            { title: 'Celý den',      price: 'po domluvě', desc: '• od příprav po hostinu<br>• všechny okamžiky<br>• individuální nacenění' },
          ],
        }}
      />

      <ServiceSection
        id="psi"
        prefix="sluzby.psi"
        number="04"
        reverse
        brown
        defaults={{
          img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/91,0,1091,1000,580,580,1/0-0-0/df099d74-dc42-4b6c-b83e-fb2200b54189/1/2/_FFF6743.jpg?fjkss=exp=2088926255~hmac=69a228dbb31ba452684c67584e88c7e9291798244e448bc468b9c8071a5c924a',
          imgAlt: 'Focení psů',
          title: 'Focení <em>psů</em> a mazlíčků',
          text: 'Máš doma mazlíka, který se rád válí na gauči, nebo honí sousedovi slepice, nebo trhá pošťákovi kalhoty? Chceš ho mít na očích stále a dívat se na něj na fotkách nebo obraze? Tož to tady jsi správně.',
          pkg: [
            { title: '30 minut',          price: 'po domluvě', desc: '• focení v přírodě nebo ateliéru<br>• výběr z fotografií<br>• napiš mi a dohodneme detaily' },
            { title: '1 hodina',      price: 'po domluvě', desc: '• delší pohodové focení<br>• více poloh i lokací<br>• individuální nacenění' },
            { title: 'Tvůj nápad',       price: 'po domluvě', desc: '• máš kreativní nápad?<br>• ozvi se a vymýšlíme to spolu' },
          ],
        }}
      />

      <ServiceSection
        id="tehotenske"
        prefix="sluzby.tehotenske"
        number="05"
        defaults={{
          img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,2424,3650,1600,3650/0-0-0/72605f59-07d5-4cf7-a4dc-1102fb905c51/1/1/_DSC0107cb.jpg?fjkss=exp=2088681074~hmac=7ad23ece9e93b148e5817708a8f579689fc67819a6dd60cb67bdbc90bd35b52c',
          imgAlt: 'Těhotenské focení',
          title: 'Těhotenské focení — <em>krásné vzpomínky</em>',
          text: 'Krásné období, které si zaslouží zachytit na fotografiích. Těhotenské focení je nejkrásnější kolem 30.–36. týdne těhotenství. Focení probíhá v ateliéru nebo v přírodě.',
          pkg: [
            { title: '30 minut',          price: 'po domluvě', desc: '• něžné portréty pupínku<br>• v ateliéru nebo venku<br>• napiš mi a domluvíme termín' },
            { title: '1 hodina',      price: 'po domluvě', desc: '• více stylizací<br>• společně s partnerem<br>• individuální nacenění' },
            { title: 'Premium',       price: 'po domluvě', desc: '• dvě lokace<br>• šaty na výběr<br>• možnost vizážistky' },
          ],
        }}
      />

      <ServiceSection
        id="portret"
        prefix="sluzby.portret"
        number="06"
        reverse
        brown
        defaults={{
          img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/269,0,1269,1000,580,580,1/0-0-0/03b7bbe1-7c1f-4167-adab-849497e1d2e2/1/2/_FFF0819.jpg?fjkss=exp=2088681039~hmac=b5673dbf2b60511a55402901e21d21c70b0de494fa1a65298258688c498e2a6e',
          imgAlt: 'Portrétní focení',
          title: 'Profesionální <em>portrétní</em> fotografie',
          text: 'Profesionální portrétní fotografie pro vaši osobní prezentaci, LinkedIn, nebo prostě jen proto, že chcete krásné fotky sebe. Focení probíhá v ateliéru i venku.',
          pkg: [
            { title: '30 minut',      price: '2 100 Kč', desc: '• 10 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů<br>• každá další fotografie 140 Kč' },
            { title: '1 hodina',      price: '3 500 Kč', desc: '• 20 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů<br>• každá další fotografie 120 Kč' },
            { title: '1,5 hodiny',    price: '4 700 Kč', desc: '• 30 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů<br>• leporelo s výběrem fotografií<br>• každá další fotografie 100 Kč' },
          ],
        }}
      />

      {/* CTA */}
      <section className="section cta" data-animate>
        <div className="container">
          <EditableText sectionId="sluzby.cta.label" defaultValue="NEVÁHEJTE" as="p" className="section-label" />
          <h2 className="section-title-big">
            <EditableText sectionId="sluzby.cta.title" defaultValue="Rezervujte si <em>termín</em>" as="span" />
          </h2>
          <Link href="/kontakt" className="btn btn-primary">
            <EditableText sectionId="sluzby.cta.btn" defaultValue="Napište mi" as="span" />
          </Link>
        </div>
      </section>
    </>
  );
}
