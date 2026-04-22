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
