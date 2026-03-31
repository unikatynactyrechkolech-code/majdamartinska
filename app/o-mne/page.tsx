'use client';

import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';

export default function OMnePage() {
  return (
    <>
      <PageHero
        title="O mně"
        subtitle="Kdo stojí za objektivem"
        image="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,999,999,1520,1520,1/0-0-0/c11ca67d-b1da-42ba-b398-a4483cfafa6e/1/2/mandarinkab.jpg?fjkss=exp=2088927692~hmac=4057268ac7beb84ef3e15484149ef0a30d91712645ea49bc32d3aca6b40f9f7d"
        sectionPrefix="omne.hero"
      />

      {/* ABOUT INTRO */}
      <section className="section about-intro section-brown" data-animate>
        <div className="container">
          <div className="about-grid">
            <div className="about-img">
              <EditableImage
                sectionId="omne.intro.img"
                src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,999,999,1520,1520,1/0-0-0/c11ca67d-b1da-42ba-b398-a4483cfafa6e/1/2/mandarinkab.jpg?fjkss=exp=2088927692~hmac=4057268ac7beb84ef3e15484149ef0a30d91712645ea49bc32d3aca6b40f9f7d"
                alt="Majda Martinská"
                width={760}
                height={760}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
            <div className="about-text">
              <h2><EditableText sectionId="omne.intro.title" defaultValue="Ahoj, jsem <em>Majda</em>" as="span" /></h2>
              <EditableText sectionId="omne.intro.text1" defaultValue="Focení mě lákalo od dětství — tenkrát jsem běhala po zahradě s foťákem od babičky a fotila všechno, co se hýbalo (většinou kočky, které se hýbat nechtěly)." as="p" multiline />
              <EditableText sectionId="omne.intro.text2" defaultValue="Jsem Majda, rodinná a newborn fotografka z Prahy. Focení je pro mě víc než práce — je to způsob, jak zachytit momenty, na které budete jednou vzpomínat s úsměvem." as="p" multiline />
              <EditableText sectionId="omne.intro.text3" defaultValue="Mám ráda humor a to se objevuje i v mých fotografiích. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi záleží. Taky jsem dost upovídaná, takže kdo se bojí trapného ticha, nemusí :)" as="p" multiline />
            </div>
          </div>
        </div>
      </section>

      {/* 10 DŮVODŮ */}
      <section className="section reasons" data-animate>
        <div className="container">
          <EditableText sectionId="omne.reasons.label" defaultValue="PROČ PRÁVĚ JÁ?" as="p" className="section-label" />
          <h2 className="section-title">
            <EditableText sectionId="omne.reasons.title" defaultValue="10 důvodů, proč <em>fotit se mnou</em>" as="span" />
          </h2>
          <div className="reasons-grid">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <div className="reason-card" key={n}>
                <span className="reason-number">{String(n).padStart(2, '0')}</span>
                <h3><EditableText sectionId={`omne.reason${n}.title`} defaultValue={`Důvod ${n}`} as="span" /></h3>
                <EditableText sectionId={`omne.reason${n}.text`} defaultValue={`Popis důvodu ${n}`} as="p" multiline />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDIO */}
      <section className="section studio section-brown" data-animate>
        <div className="container">
          <EditableText sectionId="omne.studio.label" defaultValue="ATELIÉR" as="p" className="section-label" />
          <h2 className="section-title">
            <EditableText sectionId="omne.studio.title" defaultValue="Ateliér <em>Praha Suchdol</em>" as="span" />
          </h2>
          <EditableText sectionId="omne.studio.text" defaultValue="Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol. Je vhodný pro newborn focení, rodinné focení, portrétní focení i pro focení těhotných." as="p" className="studio-desc" multiline />
          <a href="https://www.youtube.com/watch?v=NSrVtQRirpE" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <EditableText sectionId="omne.studio.btn" defaultValue="Nahlédněte pod pokličku →" as="span" />
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta" data-animate>
        <div className="container">
          <EditableText sectionId="omne.cta.label" defaultValue="ZAUJALA JSEM VÁS?" as="p" className="section-label" />
          <h2 className="section-title-big">
            <EditableText sectionId="omne.cta.title" defaultValue="Pojďme <em>do toho</em>" as="span" />
          </h2>
          <Link href="/kontakt" className="btn btn-primary">
            <EditableText sectionId="omne.cta.btn" defaultValue="Kontaktujte mě" as="span" />
          </Link>
        </div>
      </section>
    </>
  );
}
