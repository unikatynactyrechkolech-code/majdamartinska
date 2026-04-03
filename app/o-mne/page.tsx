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
        sectionPrefix="omne.hero"
      />

      {/* ABOUT INTRO */}
      <section className="section about-intro" data-animate>
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
              <EditableText sectionId="omne.intro.text1" defaultValue="Jako dítě jsem tátovi tajně brala foťák a snažila jsem se s ním fotit. Ale pak jsem ze strachu, že na to přijde, vyndavala negativy ven :)). Nu škoda, možná by to mohly být pěkné záběry. Tak jako tak, fakt je, že mě focení lákalo od dětství." as="p" multiline />
              <EditableText sectionId="omne.intro.text2" defaultValue="Nejraději fotím bláznivé fotky se špetkou humoru. Mám moc ráda humor a to se objevuje v mých uměleckých fotografiích. A světe div se, i komerční focení probíhá ve veselém tónu." as="p" multiline />
              <EditableText sectionId="omne.intro.text3" defaultValue="Dobrá nálada, otevřenost, přirozenost a žádná křeč... to je to, na čem mi při focení záleží :). Taky jsem dost upovídaná. Maminka by spíš řekla: 'ty tu klapačku taky nezavřeš'. Takže kdo se bojí trapného ticha — nebude :))" as="p" multiline />
            </div>
          </div>
        </div>
      </section>

      {/* 10 DŮVODŮ */}
      <section className="section reasons section-brown" data-animate>
        <div className="container">
          <EditableText sectionId="omne.reasons.label" defaultValue="PROČ PRÁVĚ JÁ?" as="p" className="section-label" />
          <h2 className="section-title">
            <EditableText sectionId="omne.reasons.title" defaultValue="10 důvodů, proč <em>fotit se mnou</em> a ne od Pučálkovic Aminy" as="span" />
          </h2>
          <div className="reasons-grid">
            <div className="reason-card">
              <span className="reason-number">01</span>
              <EditableText sectionId="omne.reason1.text" defaultValue="Je u mě lepší zábava, než u Aminy a to už je co říct." as="p" multiline />
            </div>
            <div className="reason-card">
              <span className="reason-number">02</span>
              <EditableText sectionId="omne.reason2.text" defaultValue="Fakt se snažím, aby ses cítil/a uvolněně (a to v přítomnosti žirafy nejde)." as="p" multiline />
            </div>
            <div className="reason-card">
              <span className="reason-number">03</span>
              <EditableText sectionId="omne.reason3.text" defaultValue="Fotím z očí do očí a tak to vypadá přirozeně (Amina fotí zásadně z nadhledu)." as="p" multiline />
            </div>
            <div className="reason-card">
              <span className="reason-number">04</span>
              <EditableText sectionId="omne.reason4.text" defaultValue="Na úpravě fotografií si dávám hodně záležet (Amina ani neví, co je Photoshop)." as="p" multiline />
            </div>
            <div className="reason-card">
              <span className="reason-number">05</span>
              <EditableText sectionId="omne.reason5.text" defaultValue="Návštěva u mě není jen focení, ale i přátelské setkání dvou a více lidí." as="p" multiline />
            </div>
            <div className="reason-card">
              <span className="reason-number">06</span>
              <EditableText sectionId="omne.reason6.text" defaultValue="K focení v ateliéru ti uvařím lahodnou kávu (Amina kávu nepije a co hůř, nepije ani alkohol)." as="p" multiline />
            </div>
            <div className="reason-card">
              <span className="reason-number">07</span>
              <EditableText sectionId="omne.reason7.text" defaultValue="Při venkovním focení tě vezmu na vážně pěkná místa (tady musím uznat, že Amina by to možná zvládla lépe)." as="p" multiline />
            </div>
            <div className="reason-card">
              <span className="reason-number">08</span>
              <EditableText sectionId="omne.reason8.text" defaultValue="Fotografie odevzdám do 21 dnů nejpozději (Amina neumí napočítat ani do pěti)." as="p" multiline />
            </div>
            <div className="reason-card">
              <span className="reason-number">09</span>
              <EditableText sectionId="omne.reason9.text" defaultValue="Kromě toho, že toho hodně namluvím, tak ti i naslouchám a přizpůsobím se tvým přáním." as="p" multiline />
            </div>
            <div className="reason-card">
              <span className="reason-number">10</span>
              <EditableText sectionId="omne.reason10.text" defaultValue="Vedu 9:1 v důvodech, proč jít ke mně a ne k Amině. Tak neváhej a kontaktuj mě." as="p" multiline />
            </div>
          </div>
          <p className="reasons-footnote" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2rem', fontStyle: 'italic', textAlign: 'center' }}>
            <EditableText sectionId="omne.reasons.footnote" defaultValue="Vsuvka: Pučálkovic Amina je žirafa, kterou si v jedné báječné knize vymyslel Jindřich Plachta :)" as="span" />
          </p>
        </div>
      </section>

      {/* STUDIO */}
      <section className="section studio" data-animate>
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
      <section className="section cta section-brown" data-animate>
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
