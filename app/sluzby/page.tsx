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
            { title: 'Pár kousků stačí',  price: '2 100 Kč', desc: '• 10 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů<br>• každá další fotografie 140 Kč' },
            { title: 'Zlatá střední cesta',  price: '3 500 Kč', desc: '• 20 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů<br>• každá další fotografie 120 Kč' },
            { title: 'Chci hodně fotek', price: '4 700 Kč', desc: '• 30 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů<br>• leporelo s výběrem fotografií<br>• každá další fotografie 100 Kč' },
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
          img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,2500,1000/0-0-0/414592d6-abb7-466c-9710-505675263187/1/1/_FFF1107.jpg?fjkss=exp=2090606351~hmac=fe1b9542344fd40fe07c14beff71fca72fd81d22b04270126fa38a8516f7a424',
          imgAlt: 'Newborn focení miminek',
          title: 'Newborn — <em>focení miminek</em>',
          text: 'Focení mrňousků do 14 dnů života... to mě moc baví. Vím, že to bývá pro rodiče náročné, a tak se snažím o maximální pohodlí všech. Rodiče dostanou kafíčko a dětičky mají zajištěnou tu nejlepší péči. Hoďte si nohy nahoru a nechte svého prťouska rozmazlovat.',
          pkg: [
            { title: 'Mini newborn',     price: '3 500 Kč', desc: '• focení v ateliéru (cca 1,5 hod)<br>• 10 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů' },
            { title: 'Klasické newborn', price: '5 500 Kč', desc: '• focení v ateliéru (cca 2–3 hod)<br>• 20 ks upravených fotografií<br>• webová galerie<br>• rekvizity, kostýmky a doplňky v ceně<br>• dodání do 21 dnů' },
            { title: 'Newborn Premium',  price: '7 200 Kč', desc: '• focení v ateliéru (cca 3 hod)<br>• 30 ks upravených fotografií<br>• webová galerie<br>• rekvizity, kostýmky, doplňky<br>• malé leporelo s výběrem fotek<br>• dodání do 21 dnů' },
          ],
        }}
      />

      <ServiceSection
        id="svatba"
        prefix="sluzby.svatba"
        number="03"
        defaults={{
          img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,899,899,2500,899/0-0-0/42ba55b7-dfe7-4ea0-b535-908073c37184/1/1/svatba87.jpg?fjkss=exp=2090606430~hmac=c09d5d25a88523d8a5480ba831b1b62f93ad5af43d9cf9e34583b70346b25f45',
          imgAlt: 'Svatební focení',
          title: 'Svatební <em>focení</em>',
          text: 'Ahoj budoucí novomanželé. Bojíte se, abyste měli na fotkách všechno? Bojíte se, aby fotograf nenarušoval váš krásný den? Bojíte se, že bude fotograf protiva? Tak se nebojte :). Právě jste našli to, co hledáte :)))',
          pkg: [
            { title: 'Krátká reportáž',   price: '12 000 Kč', desc: '• cca 4 hodiny focení<br>• přípravy + obřad + skupinky<br>• 150+ upravených fotografií<br>• webová galerie<br>• dodání do 6 týdnů' },
            { title: 'Celý den',           price: '19 000 Kč', desc: '• cca 8 hodin focení<br>• přípravy, obřad, focení páru, hostina<br>• 300+ upravených fotografií<br>• webová galerie<br>• dodání do 6 týdnů' },
            { title: 'Svatba bez limitu',  price: '25 000 Kč', desc: '• focení od příprav až po večerní zábavu<br>• 500+ upravených fotografií<br>• webová galerie<br>• malá tištěná fotokniha v ceně<br>• dodání do 8 týdnů' },
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
          img: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1500,2500,1500/0-0-0/77a14f0b-d0aa-426b-9aa6-13318fb554aa/1/1/_FFF4817.jpg?fjkss=exp=2090606586~hmac=6d18ef0957232c473f0b7f06217a567cebd6320d8a1ad99e71700cb7762b65b1',
          imgAlt: 'Focení psů a mazlíčků',
          title: 'Psí <em>kamarádi</em>',
          text: 'Máš doma mazlíka, který se rád válí na gauči, nebo honí sousedovi slepice, nebo trhá pošťákovi kalhoty? Chceš ho mít na očích stále a dívat se na něj na fotkách nebo obraze? Tož to tady jsi správně.',
          pkg: [
            { title: 'Pejsek na otočku', price: '1 900 Kč', desc: '• cca 45 min focení v přírodě<br>• 10 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů' },
            { title: 'Standard',         price: '2 900 Kč', desc: '• cca 1 hod focení (venku nebo v ateliéru)<br>• 20 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů' },
            { title: 'Pes & páníček',    price: '3 800 Kč', desc: '• cca 1,5 hod focení (vy + váš pes)<br>• 30 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů' },
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
          title: 'Těhotenské <em>focení</em>',
          text: 'Krásné období, které si zaslouží zachytit na fotografiích. Těhotenské focení je nejhezčí kolem 30.–36. týdne. Focení probíhá v ateliéru nebo v přírodě — podle toho, jak se cítíš a co máš ráda.',
          pkg: [
            { title: 'Krátké focení',     price: '2 500 Kč', desc: '• cca 45 min focení<br>• 10 ks upravených fotografií<br>• webová galerie<br>• dodání do 21 dnů' },
            { title: 'Klasické focení',   price: '3 500 Kč', desc: '• cca 1 hod focení<br>• 20 ks upravených fotografií<br>• webová galerie<br>• možnost focení s partnerem<br>• dodání do 21 dnů' },
            { title: 'Těhotenské Premium', price: '4 800 Kč', desc: '• cca 1,5 hod focení<br>• 30 ks upravených fotografií<br>• webová galerie<br>• ateliér i exteriér v jednom termínu<br>• dodání do 21 dnů' },
          ],
        }}
      />

      {/* CO BY SE JESTE HODILO VEDET */}
      <section className="section section-brown" data-animate>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            <EditableText sectionId="sluzby.info.title" defaultValue="Co by se ještě hodilo vědět…" as="span" />
          </h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.4rem', fontSize: '1.05rem', lineHeight: 1.9, color: 'var(--color-text)' }}>
            <li>
              <EditableText sectionId="sluzby.info.item1" defaultValue="fotografie poskytuji ve formátu JPEG" as="span" />
            </li>
            <li>
              <EditableText sectionId="sluzby.info.item2" defaultValue="možnost vizážistky (2 200 Kč za líčení a česání)" as="span" />
            </li>
            <li>
              <EditableText sectionId="sluzby.info.item3" defaultValue="možnost objednání tištěných fotografií, fotoknih, leporel apod." as="span" />
            </li>
            <li>
              <EditableText sectionId="sluzby.info.item4" defaultValue="fotografie si vybíráte sami a nemusí odpovídat počtu fotek ve zvoleném balíčku. Vše lze individuálně nacenit." as="span" multiline />
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
