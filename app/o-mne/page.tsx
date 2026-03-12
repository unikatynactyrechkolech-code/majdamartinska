import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';

export default function OMnePage() {
  return (
    <>
      <PageHero
        title="O mně"
        subtitle="Kdo stojí za objektivem"
        image="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,999,999,1520,1520,1/0-0-0/c11ca67d-b1da-42ba-b398-a4483cfafa6e/1/2/mandarinkab.jpg?fjkss=exp=2088927692~hmac=4057268ac7beb84ef3e15484149ef0a30d91712645ea49bc32d3aca6b40f9f7d"
      />

      {/* ABOUT INTRO */}
      <section className="section about-intro" data-animate>
        <div className="container">
          <div className="about-grid">
            <div className="about-img">
              <Image
                src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,999,999,1520,1520,1/0-0-0/c11ca67d-b1da-42ba-b398-a4483cfafa6e/1/2/mandarinkab.jpg?fjkss=exp=2088927692~hmac=4057268ac7beb84ef3e15484149ef0a30d91712645ea49bc32d3aca6b40f9f7d"
                alt="Majda Martinská"
                width={760}
                height={760}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
            <div className="about-text">
              <h2>Ahoj, jsem <em>Majda</em></h2>
              <p>Focení mě lákalo od dětství — tenkrát jsem běhala po zahradě s foťákem od babičky a fotila všechno, co se hýbalo (většinou kočky, které se hýbat nechtěly).</p>
              <p>Jsem Majda, rodinná a newborn fotografka z Prahy. Focení je pro mě víc než práce — je to způsob, jak zachytit momenty, na které budete jednou vzpomínat s úsměvem.</p>
              <p>Mám ráda humor a to se objevuje i v mých fotografiích. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi záleží. Taky jsem dost upovídaná, takže kdo se bojí trapného ticha, nemusí :)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10 DŮVODŮ */}
      <section className="section reasons" data-animate>
        <div className="container">
          <p className="section-label">PROČ PRÁVĚ JÁ?</p>
          <h2 className="section-title">10 důvodů, proč <em>fotit se mnou</em></h2>
          <div className="reasons-grid">
            <div className="reason-card">
              <span className="reason-number">01</span>
              <h3>Přirozené fotky</h3>
              <p>Žádné strojené pózy. Zachycuji skutečné emoce a momenty, které jsou autentické a krásné.</p>
            </div>
            <div className="reason-card">
              <span className="reason-number">02</span>
              <h3>Pohodová atmosféra</h3>
              <p>U mě se nemusíte bát. Focení bude v pohodě, s humorem a bez stresu.</p>
            </div>
            <div className="reason-card">
              <span className="reason-number">03</span>
              <h3>Zkušenost s dětmi</h3>
              <p>Děti mě milují (a já je). Vím, jak je zaujmout a zachytit ty nejkrásnější momenty.</p>
            </div>
            <div className="reason-card">
              <span className="reason-number">04</span>
              <h3>Profesionální vybavení</h3>
              <p>Fotím na profesionální techniku Canon a disponuji vlastním ateliérem v Praze.</p>
            </div>
            <div className="reason-card">
              <span className="reason-number">05</span>
              <h3>Vlastní ateliér</h3>
              <p>Velký a dobře vybavený ateliér v klidné části Prahy — Suchdol. Ideální pro newborn a rodinné focení.</p>
            </div>
            <div className="reason-card">
              <span className="reason-number">06</span>
              <h3>Rychlé dodání</h3>
              <p>Fotografie máte do 2–3 týdnů. Náhled do pár dní.</p>
            </div>
            <div className="reason-card">
              <span className="reason-number">07</span>
              <h3>Konzultace zdarma</h3>
              <p>Nevíte, co si vybrat? Napište mi a poradím vám, jaký typ focení je pro vás ten pravý.</p>
            </div>
            <div className="reason-card">
              <span className="reason-number">08</span>
              <h3>Férové ceny</h3>
              <p>Kvalitní fotky za rozumné peníze. Žádné skryté poplatky.</p>
            </div>
            <div className="reason-card">
              <span className="reason-number">09</span>
              <h3>Individuální přístup</h3>
              <p>Každé focení přizpůsobuji vám — vašim potřebám, představám a náladě.</p>
            </div>
            <div className="reason-card">
              <span className="reason-number">10</span>
              <h3>Vášeň a láska</h3>
              <p>Focení je moje vášeň. A to je na výsledcích vidět. Každý klient je pro mě jedinečný.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STUDIO */}
      <section className="section studio" data-animate>
        <div className="container">
          <p className="section-label">ATELIÉR</p>
          <h2 className="section-title">Ateliér <em>Praha Suchdol</em></h2>
          <p className="studio-desc">Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol. Je vhodný pro newborn focení, rodinné focení, portrétní focení i pro focení těhotných.</p>
          <a href="https://www.youtube.com/watch?v=NSrVtQRirpE" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Nahlédněte pod pokličku →</a>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta" data-animate>
        <div className="container">
          <p className="section-label">ZAUJALA JSEM VÁS?</p>
          <h2 className="section-title-big">Pojďme <em>do toho</em></h2>
          <Link href="/kontakt" className="btn btn-primary">Kontaktujte mě</Link>
        </div>
      </section>
    </>
  );
}
