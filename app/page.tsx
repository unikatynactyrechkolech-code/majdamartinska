'use client';

import Link from 'next/link';
import Image from 'next/image';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';

const LOGO_URL = 'https://res.cloudinary.com/dh8ts5fpa/image/upload/v1774978116/Sni%CC%81mek_obrazovky_2026-03-31_v_19.27.39_tonhmp.png';

const hScrollItems = [
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/3f875228-71be-40bf-96d2-b419364599a1/1/1/_FFF5983.jpg?fjkss=exp=2088681035~hmac=2e9c039a5620e3d43d3fe64b3f7daef7015cc8ae1b4d717a0fea903df01196c7', alt: 'Rodinné focení', caption: 'Rodinné', sectionId: 'home.hscroll.1', href: '/portfolio#rodinna' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/0bbb0044-6aac-4da5-8043-4c09d06b8164/1/1/192.jpg?fjkss=exp=2088920790~hmac=77261ddf4add0008600b2e0b4dacb93e5a710de8a3ec6ff85a0d2ada0c8b3165', alt: 'Svatby', caption: 'Svatby', sectionId: 'home.hscroll.2', href: '/portfolio#svatby' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/77117316-7f64-4db7-8b23-d32496550df9/1/1/_FFF7059.jpg?fjkss=exp=2088927709~hmac=d73e6ebc3df068b24965421c829df9026c667decd48f2b207774d18a99d1bcd5', alt: 'Newborn', caption: 'Newborn', sectionId: 'home.hscroll.3', href: '/portfolio#newborn' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,800,1200,1600,1200/0-0-0/e73300d8-5661-4b60-8039-bd421a04ddfa/1/1/_FFF9854.jpg?fjkss=exp=2088920600~hmac=7012a75d6187677fa811f9a01dbd2f217af3a83b2a2bfbd3378d20da1d9f46d8', alt: 'Portréty', caption: 'Portréty', sectionId: 'home.hscroll.4', href: '/portfolio#portret' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,2424,3650,1600,3650/0-0-0/72605f59-07d5-4cf7-a4dc-1102fb905c51/1/1/_DSC0107cb.jpg?fjkss=exp=2088681074~hmac=7ad23ece9e93b148e5817708a8f579689fc67819a6dd60cb67bdbc90bd35b52c', alt: 'Těhotenské focení', caption: 'Těhotenské', sectionId: 'home.hscroll.5', href: '/portfolio#tehotenske' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/337,0,1337,1000,580,580,1/0-0-0/2b1abef9-f657-4d4d-af2d-f2ea0305c275/1/2/_FFF5852.jpg?fjkss=exp=2088926255~hmac=0e915221ac8400e348f232f2aaeb08aa4d77091d2dd68ad90e89e16f5a339864', alt: 'Rodinné focení', caption: 'Rodina', sectionId: 'home.hscroll.6', href: '/portfolio#rodinna' },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero" id="hero">
        {/* Brand strip below header */}
        <div className="hero-brand">
          <Image
            src={LOGO_URL}
            alt="Majda Martinská"
            width={44}
            height={44}
            style={{ objectFit: 'contain' }}
            priority
          />
          <span className="hero-brand-name">Majda Martinská</span>
        </div>
        <div className="hero-content">
          <EditableText
            sectionId="home.hero.label"
            defaultValue="RODINNÉ, SVATEBNÍ A NEWBORN FOCENÍ"
            as="p"
            className="hero-label"
          />
          <h1 className="hero-title">
            <EditableText
              sectionId="home.hero.intro"
              defaultValue="Zdravím tě tam na druhém konci. Hledáš fotografa? A zároveň pohodářku? Chceš si focení užít a neprotrpět? Neváhej mi napsat!"
              as="span"
            />
          </h1>
          <div className="hero-btns">
            <Link href="/kontakt" className="btn btn-primary hero-btn">
              <EditableText sectionId="home.hero.btn" defaultValue="Chci fotky" as="span" />
            </Link>
            <Link href="/portfolio" className="btn btn-outline-dark hero-btn">
              <EditableText sectionId="home.hero.btn2" defaultValue="Celé portfolio" as="span" />
            </Link>
          </div>
        </div>
        <HeroSlideshow />
      </section>

      {/* 10 DŮVODŮ — AMINA */}
      <section className="section reasons section-brown" data-animate>
        <div className="container">
          <div className="reasons-layout">
            <div className="reasons-content">
              <h2 className="reasons-title">
                <EditableText sectionId="home.reasons.title" defaultValue='10 důvodů, proč se nechat fotit ode mě a&nbsp;ne od <em>Pučálkovic Aminy</em>' as="span" />
              </h2>
              <ol className="reasons-list">
                <li>
                  <span className="reason-num">1.</span>
                  <EditableText sectionId="home.reason1" defaultValue='je u mě lepší zábava, než u Aminy a&nbsp;to už je co říct' as="span" />
                </li>
                <li>
                  <span className="reason-num">2.</span>
                  <EditableText sectionId="home.reason2" defaultValue='fakt se snažím, aby ses cítil/a uvolněně <em>(a&nbsp;to v&nbsp;přítomnosti žirafy nejde)</em>' as="span" />
                </li>
                <li>
                  <span className="reason-num">3.</span>
                  <EditableText sectionId="home.reason3" defaultValue='fotím z&nbsp;očí do očí a&nbsp;tak to vypadá přirozeně <em>(Amina fotí zásadně z&nbsp;nadhledu)</em>' as="span" />
                </li>
                <li>
                  <span className="reason-num">4.</span>
                  <EditableText sectionId="home.reason4" defaultValue='na úpravě fotografií si dávám hodně záležet <em>(Amina ani neví, co je grafický tablet nebo Photoshop)</em>' as="span" />
                </li>
                <li>
                  <span className="reason-num">5.</span>
                  <EditableText sectionId="home.reason5" defaultValue='návštěva u&nbsp;mě není jen focení, ale i&nbsp;přátelské setkání dvou a&nbsp;více lidí <em>(Amina je sice přátelská, ale projevy její náklonnosti to vážně nechceš)</em>' as="span" />
                </li>
                <li>
                  <span className="reason-num">6.</span>
                  <EditableText sectionId="home.reason6" defaultValue='k&nbsp;focení v&nbsp;ateliéru ti uvařím lahodnou kávu <em>(Amina kávu nepije a&nbsp;co hůř, nepije ani alkohol)</em>' as="span" />
                </li>
                <li>
                  <span className="reason-num">7.</span>
                  <EditableText sectionId="home.reason7" defaultValue='při venkovním focení tě vezmu na vážně pěkná místa <em>(no tady musím uznat, že to by možná Amina zvládla lépe)</em>' as="span" />
                </li>
                <li>
                  <span className="reason-num">8.</span>
                  <EditableText sectionId="home.reason8" defaultValue='fotografie odevzdám do 21 dnů nejpozději <em>(Amina neumí napočítat ani do pěti a&nbsp;i&nbsp;se tak tváří)</em>' as="span" />
                </li>
                <li>
                  <span className="reason-num">9.</span>
                  <EditableText sectionId="home.reason9" defaultValue='kromě toho, že toho hodně namluvím, tak ti i&nbsp;naslouchám a&nbsp;tak se přizpůsobím tvým přáním <em>(Amina jen tak zvláštně okouní)</em>' as="span" />
                </li>
                <li>
                  <span className="reason-num">10.</span>
                  <EditableText sectionId="home.reason10" defaultValue='proti Amině vedu 9:1 v&nbsp;důvodech, proč jít ke mně a&nbsp;ne k&nbsp;ní. Tak neváhej a&nbsp;kontaktuj mě.' as="span" />
                </li>
              </ol>
              <p className="reasons-note">
                <EditableText sectionId="home.reasons.note" defaultValue='Vsuvka: Pučálkovic Amina je žirafa, kterou si v&nbsp;jedné báječné knize vymyslel Jindřich Plachta :)' as="span" />
              </p>
            </div>
            <div className="reasons-giraffe">
              <EditableImage
                sectionId="home.reasons.giraffe"
                src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,200,200,400,398/0-0-0/7b20a2a3-defe-43c3-a04c-8a0dacb2ed8f/1/1/c.jpg?fjkss=exp=2090500769~hmac=753b9490a076f1ddc6d98bbff0baf6245293e79326df98853ad903ae37c0df4a"
                alt="Pučálkovic Amina — žirafa"
                className="giraffe-img"
                width={400}
                height={398}
                noLightbox
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* HORIZONTAL SCROLL */}
      <section className="section gallery-horizontal" data-animate>
        <div className="container">
          <EditableText sectionId="home.gallery.label" defaultValue="PORTFOLIO" as="p" className="section-label" />
        </div>
        <HorizontalScroll items={hScrollItems} />
      </section>

      {/* SERVICES */}
      <section className="section services section-brown" data-animate>
        <div className="container">
            <EditableText sectionId="home.services.label" defaultValue="MOJE PRÁCE" as="p" className="section-label" />
            <h2 className="section-title">
              <EditableText sectionId="home.services.title" defaultValue="Moje <em>práce</em>" as="span" />
          </h2>
          <div className="services-grid">
            <Link href="/portfolio#rodinna" className="service-card">
              <div className="service-img">
                  <EditableImage sectionId="home.service1.img" src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1500,2500,1500/0-0-0/374cea7b-60cd-4811-9524-ee5d44975753/1/1/_FFF7820.jpg?fjkss=exp=2090606687~hmac=f4386541e9cb3db2cd8840df3360068e6ad9397a37da78c0d3a58372925b7c27" alt="Rodinné focení" width={580} height={580} sizes="(max-width: 768px) 100vw, 33vw" style={{ width: '100%', height: '100%', objectFit: 'cover' }} noLightbox unoptimized />
              </div>
              <div className="service-info">
                  <EditableText sectionId="home.service1.name" defaultValue="Rodinné focení" as="span" className="service-name" />
                <EditableText sectionId="home.service1.cta" defaultValue="ZOBRAZIT →" as="span" className="service-cta" />
              </div>
            </Link>
            <Link href="/portfolio#newborn" className="service-card">
              <div className="service-img">
                  <EditableImage sectionId="home.service2.img" src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,2500,1000/0-0-0/414592d6-abb7-466c-9710-505675263187/1/1/_FFF1107.jpg?fjkss=exp=2090606351~hmac=fe1b9542344fd40fe07c14beff71fca72fd81d22b04270126fa38a8516f7a424" alt="Newborn focení" width={580} height={580} sizes="(max-width: 768px) 100vw, 33vw" style={{ width: '100%', height: '100%', objectFit: 'cover' }} noLightbox unoptimized />
              </div>
              <div className="service-info">
                <EditableText sectionId="home.service2.name" defaultValue="Newborn — miminka" as="span" className="service-name" />
                <EditableText sectionId="home.service2.cta" defaultValue="ZOBRAZIT →" as="span" className="service-cta" />
              </div>
            </Link>
            <Link href="/portfolio#svatby" className="service-card">
              <div className="service-img">
                  <EditableImage sectionId="home.service3.img" src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,899,899,2500,899/0-0-0/42ba55b7-dfe7-4ea0-b535-908073c37184/1/1/svatba87.jpg?fjkss=exp=2090606430~hmac=c09d5d25a88523d8a5480ba831b1b62f93ad5af43d9cf9e34583b70346b25f45" alt="Svatební focení" width={580} height={580} sizes="(max-width: 768px) 100vw, 33vw" style={{ width: '100%', height: '100%', objectFit: 'cover' }} noLightbox unoptimized />
              </div>
              <div className="service-info">
                  <EditableText sectionId="home.service3.name" defaultValue="Svatební focení" as="span" className="service-name" />
                <EditableText sectionId="home.service3.cta" defaultValue="ZOBRAZIT →" as="span" className="service-cta" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="section about-preview" data-animate>
        <div className="container">
          <div className="about-preview-grid">
            <div className="about-preview-img">
              <EditableImage
                sectionId="home.about.img"
                src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,999,999,1520,1520,1/0-0-0/c11ca67d-b1da-42ba-b398-a4483cfafa6e/1/2/mandarinkab.jpg?fjkss=exp=2088927692~hmac=4057268ac7beb84ef3e15484149ef0a30d91712645ea49bc32d3aca6b40f9f7d"
                alt="Majda Martinská"
                width={760}
                height={760}
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="about-preview-content">
              <EditableText sectionId="home.about.label" defaultValue="KDO STOJÍ ZA OBJEKTIVEM?" as="p" className="section-label" />
              <h2 className="section-title">
                <EditableText sectionId="home.about.title" defaultValue="Vaše <em>fotografka</em> Majda" as="span" />
              </h2>
              <EditableText
                sectionId="home.about.text"
                defaultValue="Jako dítě jsem tátovi tajně brala foťák a snažila se s ním fotit. Mám ráda humor a to se objevuje i v mých fotografiích. Dobrá nálada, otevřenost, přirozenost a žádná křeč. Taky jsem dost upovídaná, takže kdo se bojí trapného ticha — nebude :)"
                as="p"
                multiline
              />
              <div className="about-preview-btns">
                <Link href="/o-mne" className="btn btn-outline">
                  <EditableText sectionId="home.about.btn1" defaultValue="Více o mně" as="span" />
                </Link>
                <Link href="/kontakt" className="btn btn-text">
                  <EditableText sectionId="home.about.btn2" defaultValue="Kontakt" as="span" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MORE SERVICES */}
      <section className="section more-services section-brown" data-animate>
        <div className="container">
          <div className="more-services-grid">
            <Link href="/sluzby#psi" className="more-service-item">
              <div className="more-service-img">
                <EditableImage sectionId="home.more1.img" src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1500,2500,1500/0-0-0/77a14f0b-d0aa-426b-9aa6-13318fb554aa/1/1/_FFF4817.jpg?fjkss=exp=2090606586~hmac=6d18ef0957232c473f0b7f06217a567cebd6320d8a1ad99e71700cb7762b65b1" alt="Focení psích kamarádů" width={580} height={773} sizes="(max-width: 768px) 100vw, 33vw" style={{ width: '100%', height: '100%', objectFit: 'cover' }} noLightbox unoptimized />
              </div>
              <EditableText sectionId="home.more1.title" defaultValue="Psí kamarádi" as="h3" />
              <EditableText sectionId="home.more1.text" defaultValue="Máš doma mazlíka, který se rád válí na gauči, nebo honí sousedovi slepice? Chceš ho mít na fotkách? Tož to tady jsi správně." as="p" />
              <EditableText sectionId="home.more1.cta" defaultValue="INFORMACE →" as="span" className="more-service-cta" />
            </Link>
            <Link href="/sluzby#tehotenske" className="more-service-item">
              <div className="more-service-img">
                <EditableImage sectionId="home.more2.img" src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,2424,3650,1600,3650/0-0-0/72605f59-07d5-4cf7-a4dc-1102fb905c51/1/1/_DSC0107cb.jpg?fjkss=exp=2088681074~hmac=7ad23ece9e93b148e5817708a8f579689fc67819a6dd60cb67bdbc90bd35b52c" alt="Těhotenské focení" width={580} height={773} sizes="(max-width: 768px) 100vw, 33vw" style={{ width: '100%', height: '100%', objectFit: 'cover' }} noLightbox unoptimized />
              </div>
              <EditableText sectionId="home.more2.title" defaultValue="Těhotenské focení" as="h3" />
              <EditableText sectionId="home.more2.text" defaultValue="Krásné období, které si zaslouží zachytit na fotografiích." as="p" />
              <EditableText sectionId="home.more2.cta" defaultValue="INFORMACE →" as="span" className="more-service-cta" />
            </Link>
            <Link href="/sluzby#portret" className="more-service-item">
              <div className="more-service-img">
                <EditableImage sectionId="home.more3.img" src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,800,1200,2500,1200/0-0-0/e73300d8-5661-4b60-8039-bd421a04ddfa/1/1/_FFF9854.jpg?fjkss=exp=2090606529~hmac=f08c05fa2ea1085f4bec130434e26a7aea32ecfea9dd8c5e22e555cf333f2d83" alt="Portrétní focení" width={580} height={773} sizes="(max-width: 768px) 100vw, 33vw" style={{ width: '100%', height: '100%', objectFit: 'cover' }} noLightbox unoptimized />
              </div>
              <EditableText sectionId="home.more3.title" defaultValue="Portréty" as="h3" />
              <EditableText sectionId="home.more3.text" defaultValue="Profesionální portrétní fotografie pro vaši prezentaci i osobní účely." as="p" />
              <EditableText sectionId="home.more3.cta" defaultValue="INFORMACE →" as="span" className="more-service-cta" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials" data-animate>
        <div className="container">
          <EditableText sectionId="home.testimonials.label" defaultValue="MILÁ SLOVA" as="p" className="section-label" />
          <div className="testimonial-card">
            <blockquote>
              <EditableText
                sectionId="home.testimonial.text"
                defaultValue={'„Naše spolupráce s Majdou byla naprosto úžasná. S naším 14denním synem zacházela více než mateřsky. Fotografie od ní jsou plné něhy, lásky a profesionality. Mockrát děkujeme za krásné odpoledne a úžasné vzpomínky."'}
                as="p"
                multiline
              />
            </blockquote>
            <div className="testimonial-author">
              <EditableImage sectionId="home.testimonial.img" src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/341,0,1341,999,760,760,1/0-0-0/465305c9-f66c-4175-b352-2218472c9b79/1/2/_FFF7991-SharpenAI-Softness.jpg?fjkss=exp=2088927693~hmac=e5651265ed7944c54ef2104fff6f891c739eeae40455d82b8168c81c91edacf0" alt="Bára M." width={56} height={56} style={{ borderRadius: '50%', objectFit: 'cover' }} overlayCompact noLightbox />
              <div>
                <EditableText sectionId="home.testimonial.name" defaultValue="Bára M." as="strong" />
                <EditableText sectionId="home.testimonial.type" defaultValue="Newborn focení" as="span" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STUDIO */}
      <section className="section studio section-brown" data-animate>
        <div className="container">
          <EditableText sectionId="home.studio.label" defaultValue="ATELIÉR" as="p" className="section-label" />
          <h2 className="section-title">
            <EditableText sectionId="home.studio.title" defaultValue="Fotoateliér <em>Praha Suchdol</em>" as="span" />
          </h2>
          <EditableText
            sectionId="home.studio.text"
            defaultValue="Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol."
            as="p"
            className="studio-desc"
            multiline
          />
          <a href="https://www.youtube.com/watch?v=NSrVtQRirpE" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <EditableText sectionId="home.studio.btn" defaultValue="Nahlédněte pod pokličku →" as="span" />
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta" data-animate>
        <div className="container">
          <EditableText sectionId="home.cta.label" defaultValue="JSME NA PODOBNÉ VLNĚ?" as="p" className="section-label" />
          <h2 className="section-title-big">
            <EditableText sectionId="home.cta.title" defaultValue="Objednejte si <em>focení</em>" as="span" />
          </h2>
          <Link href="/kontakt" className="btn btn-primary">
            <EditableText sectionId="home.cta.btn" defaultValue="Kontakt" as="span" />
          </Link>
        </div>
      </section>
    </>
  );
}
