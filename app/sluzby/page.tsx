'use client';

import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';

export default function SluzbyPage() {
  return (
    <>
      <PageHero
        title="Služby"
        subtitle="Co pro vás mohu udělat"
        image="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/337,0,1337,1000,580,580,1/0-0-0/2b1abef9-f657-4d4d-af2d-f2ea0305c275/1/2/_FFF5852.jpg?fjkss=exp=2088926255~hmac=0e915221ac8400e348f232f2aaeb08aa4d77091d2dd68ad90e89e16f5a339864"
        sectionPrefix="sluzby.hero"
      />

      {/* RODINNÉ */}
      <section className="section service-detail section-brown" id="rodinna" data-animate>
        <div className="container">
          <div className="service-detail-grid">
            <div className="service-detail-img">
              <EditableImage sectionId="sluzby.rodinna.img" src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/337,0,1337,1000,580,580,1/0-0-0/2b1abef9-f657-4d4d-af2d-f2ea0305c275/1/2/_FFF5852.jpg?fjkss=exp=2088926255~hmac=0e915221ac8400e348f232f2aaeb08aa4d77091d2dd68ad90e89e16f5a339864" alt="Rodinné focení" width={700} height={875} sizes="(max-width: 768px) 100vw, 50vw" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </div>
            <div className="service-detail-content">
              <p className="section-label">01</p>
              <h2><EditableText sectionId="sluzby.rodinna.title" defaultValue="Rodinné a <em>párové focení</em>" as="span" /></h2>
              <EditableText sectionId="sluzby.rodinna.text" defaultValue="Vyber si ateliér nebo les a louku, záleží na tobě. To hlavní ale je, aby byla pohoda a bylo to celé o příjemném zážitku, ze kterého si odneseš na památku fotografie. Nechci abys focení odbil/a v křeči, ale abys ho užil/a :)" as="p" multiline />
              <ul className="service-detail-list">
                <li><EditableText sectionId="sluzby.rodinna.li1" defaultValue="Rodinné focení / párové focení" as="span" /></li>
                <li><EditableText sectionId="sluzby.rodinna.li2" defaultValue="V exteriéru nebo v ateliéru" as="span" /></li>
                <li><EditableText sectionId="sluzby.rodinna.li3" defaultValue="Cca 1–1,5 hodiny focení" as="span" /></li>
                <li><EditableText sectionId="sluzby.rodinna.li4" defaultValue="50+ upravených fotografií" as="span" /></li>
              </ul>
              <div className="service-detail-price">
                <EditableText sectionId="sluzby.rodinna.cena" defaultValue="od 3 900 Kč" as="span" className="price" />
              </div>
              <Link href="/kontakt" className="btn btn-primary">
                <EditableText sectionId="sluzby.rodinna.btn" defaultValue="Chci fotky" as="span" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEWBORN */}
      <section className="section service-detail" id="newborn" data-animate>
        <div className="container">
          <div className="service-detail-grid reverse">
            <div className="service-detail-img">
              <EditableImage sectionId="sluzby.newborn.img" src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/105,0,1105,1000,580,580,1/0-0-0/e31af609-ffc4-4df0-9dd0-55164c01ae9c/1/2/beranci420.jpg?fjkss=exp=2088926256~hmac=f068764e9720bd72e5c31b1778dc5b3c9757133c8222f974f4fbd7a2070d2581" alt="Newborn focení" width={700} height={875} sizes="(max-width: 768px) 100vw, 50vw" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </div>
            <div className="service-detail-content">
              <p className="section-label">02</p>
              <h2><EditableText sectionId="sluzby.newborn.title" defaultValue="Newborn — <em>miminka</em>" as="span" /></h2>
              <EditableText sectionId="sluzby.newborn.text" defaultValue="Focení mrňousků do 14 dnů života... to mě moc baví. Vím, že to bývá pro rodiče náročné a tak se snažím o maximální pohodlí všech. Rodiče dostanou kafíčko a dětičky mají zase zajištěnou tu nejlepší péči. Hoďte si nohy nahoru a nechte svého prťouska rozmazlovat." as="p" multiline />
              <ul className="service-detail-list">
                <li><EditableText sectionId="sluzby.newborn.li1" defaultValue="Newborn focení (5–14 dní)" as="span" /></li>
                <li><EditableText sectionId="sluzby.newborn.li2" defaultValue="V ateliéru Praha Suchdol" as="span" /></li>
                <li><EditableText sectionId="sluzby.newborn.li3" defaultValue="Cca 2–3 hodiny focení" as="span" /></li>
                <li><EditableText sectionId="sluzby.newborn.li4" defaultValue="30+ upravených fotografií" as="span" /></li>
              </ul>
              <div className="service-detail-price">
                <EditableText sectionId="sluzby.newborn.cena" defaultValue="od 4 900 Kč" as="span" className="price" />
              </div>
              <Link href="/kontakt" className="btn btn-primary">
                <EditableText sectionId="sluzby.newborn.btn" defaultValue="Chci fotky" as="span" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SVATBY */}
      <section className="section service-detail section-brown" id="svatby" data-animate>
        <div className="container">
          <div className="service-detail-grid">
            <div className="service-detail-img">
              <EditableImage sectionId="sluzby.svatby.img" src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/242,0,1242,1000,580,580,1/0-0-0/6a22c40a-2331-4783-8eda-c50263a4e231/1/2/_FFF6358-DeNoiseAI-standard.jpg?fjkss=exp=2088926256~hmac=048edc5062605e1fa227333279bc4d80d6f5dc521a10449af549312b0ba64723" alt="Svatební focení" width={700} height={875} sizes="(max-width: 768px) 100vw, 50vw" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </div>
            <div className="service-detail-content">
              <p className="section-label">03</p>
              <h2><EditableText sectionId="sluzby.svatby.title" defaultValue="Svatební <em>focení</em>" as="span" /></h2>
              <EditableText sectionId="sluzby.svatby.text" defaultValue="Ahoj budoucí novomanželé. Bojíte se abyste měli na fotkách všechno? Bojíte se, aby fotograf nenarušoval váš krásný den? Bojíte se, že bude fotograf protiva? Tak se nebojte :). Právě jste našli, to co hledáte :)))" as="p" multiline />
              <ul className="service-detail-list">
                <li><EditableText sectionId="sluzby.svatby.li1" defaultValue="Svatební den — reportážní styl" as="span" /></li>
                <li><EditableText sectionId="sluzby.svatby.li2" defaultValue="Přípravy, obřad, focení párů, hostina" as="span" /></li>
                <li><EditableText sectionId="sluzby.svatby.li3" defaultValue="Celý den nebo jen část" as="span" /></li>
                <li><EditableText sectionId="sluzby.svatby.li4" defaultValue="200–500+ upravených fotografií" as="span" /></li>
              </ul>
              <div className="service-detail-price">
                <EditableText sectionId="sluzby.svatby.cena" defaultValue="od 15 000 Kč" as="span" className="price" />
              </div>
              <Link href="/kontakt" className="btn btn-primary">
                <EditableText sectionId="sluzby.svatby.btn" defaultValue="Chci fotky" as="span" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PSI */}
      <section className="section service-detail" id="psi" data-animate>
        <div className="container">
          <div className="service-detail-grid reverse">
            <div className="service-detail-img">
              <EditableImage sectionId="sluzby.psi.img" src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/91,0,1091,1000,580,580,1/0-0-0/df099d74-dc42-4b6c-b83e-fb2200b54189/1/2/_FFF6743.jpg?fjkss=exp=2088926255~hmac=69a228dbb31ba452684c67584e88c7e9291798244e448bc468b9c8071a5c924a" alt="Focení psů" width={700} height={875} sizes="(max-width: 768px) 100vw, 50vw" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </div>
            <div className="service-detail-content">
              <p className="section-label">04</p>
              <h2><EditableText sectionId="sluzby.psi.title" defaultValue="Psí <em>kamarádi</em>" as="span" /></h2>
              <EditableText sectionId="sluzby.psi.text" defaultValue="Máš doma mazlíka, který se rád válí na gauči, nebo honí sousedovi slepice, nebo trhá pošťákovi kalhoty? Chceš ho mít na očích stále a dívat se na něj na fotkách nebo obraze? Tož to tady jsi správně." as="p" multiline />
              <ul className="service-detail-list">
                <li><EditableText sectionId="sluzby.psi.li1" defaultValue="Focení psů a jejich páníčků" as="span" /></li>
                <li><EditableText sectionId="sluzby.psi.li2" defaultValue="V přírodě" as="span" /></li>
                <li><EditableText sectionId="sluzby.psi.li3" defaultValue="Cca 1 hodina focení" as="span" /></li>
                <li><EditableText sectionId="sluzby.psi.li4" defaultValue="40+ upravených fotografií" as="span" /></li>
              </ul>
              <div className="service-detail-price">
                <EditableText sectionId="sluzby.psi.cena" defaultValue="od 3 500 Kč" as="span" className="price" />
              </div>
              <Link href="/kontakt" className="btn btn-primary">
                <EditableText sectionId="sluzby.psi.btn" defaultValue="Chci fotky" as="span" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TĚHOTENSKÉ */}
      <section className="section service-detail section-brown" id="tehotenske" data-animate>
        <div className="container">
          <div className="service-detail-grid">
            <div className="service-detail-img">
              <EditableImage sectionId="sluzby.tehotenske.img" src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,2424,3650,1600,3650/0-0-0/72605f59-07d5-4cf7-a4dc-1102fb905c51/1/1/_DSC0107cb.jpg?fjkss=exp=2088681074~hmac=7ad23ece9e93b148e5817708a8f579689fc67819a6dd60cb67bdbc90bd35b52c" alt="Těhotenské focení" width={700} height={875} sizes="(max-width: 768px) 100vw, 50vw" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </div>
            <div className="service-detail-content">
              <p className="section-label">05</p>
              <h2><EditableText sectionId="sluzby.tehotenske.title" defaultValue="Těhotenské <em>focení</em>" as="span" /></h2>
              <EditableText sectionId="sluzby.tehotenske.text" defaultValue="Krásné období, které si zaslouží zachytit na fotografiích. Těhotenské focení je nejkrásnější kolem 30.–36. týdne těhotenství. Focení probíhá v ateliéru nebo v přírodě." as="p" multiline />
              <ul className="service-detail-list">
                <li><EditableText sectionId="sluzby.tehotenske.li1" defaultValue="Těhotenské focení (30.–36. týden)" as="span" /></li>
                <li><EditableText sectionId="sluzby.tehotenske.li2" defaultValue="V ateliéru nebo venku" as="span" /></li>
                <li><EditableText sectionId="sluzby.tehotenske.li3" defaultValue="Cca 1 hodina focení" as="span" /></li>
                <li><EditableText sectionId="sluzby.tehotenske.li4" defaultValue="30+ upravených fotografií" as="span" /></li>
              </ul>
              <div className="service-detail-price">
                <EditableText sectionId="sluzby.tehotenske.cena" defaultValue="od 3 500 Kč" as="span" className="price" />
              </div>
              <Link href="/kontakt" className="btn btn-primary">
                <EditableText sectionId="sluzby.tehotenske.btn" defaultValue="Chci fotky" as="span" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PORTRÉTY */}
      <section className="section service-detail" id="portret" data-animate>
        <div className="container">
          <div className="service-detail-grid reverse">
            <div className="service-detail-img">
              <EditableImage sectionId="sluzby.portret.img" src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/269,0,1269,1000,580,580,1/0-0-0/03b7bbe1-7c1f-4167-adab-849497e1d2e2/1/2/_FFF0819.jpg?fjkss=exp=2088681039~hmac=b5673dbf2b60511a55402901e21d21c70b0de494fa1a65298258688c498e2a6e" alt="Portrétní focení" width={700} height={875} sizes="(max-width: 768px) 100vw, 50vw" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </div>
            <div className="service-detail-content">
              <p className="section-label">06</p>
              <h2><EditableText sectionId="sluzby.portret.title" defaultValue="Portrétní <em>focení</em>" as="span" /></h2>
              <EditableText sectionId="sluzby.portret.text" defaultValue="Profesionální portrétní fotografie pro vaši osobní prezentaci, LinkedIn, nebo prostě jen proto, že chcete krásné fotky sebe. Focení probíhá v ateliéru i venku." as="p" multiline />
              <ul className="service-detail-list">
                <li><EditableText sectionId="sluzby.portret.li1" defaultValue="Portrétní / profilové focení" as="span" /></li>
                <li><EditableText sectionId="sluzby.portret.li2" defaultValue="V ateliéru nebo venku" as="span" /></li>
                <li><EditableText sectionId="sluzby.portret.li3" defaultValue="Cca 45 min – 1 hodina" as="span" /></li>
                <li><EditableText sectionId="sluzby.portret.li4" defaultValue="20+ upravených fotografií" as="span" /></li>
              </ul>
              <div className="service-detail-price">
                <EditableText sectionId="sluzby.portret.cena" defaultValue="od 2 900 Kč" as="span" className="price" />
              </div>
              <Link href="/kontakt" className="btn btn-primary">
                <EditableText sectionId="sluzby.portret.btn" defaultValue="Chci fotky" as="span" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta section-brown" data-animate>
        <div className="container">
          <EditableText sectionId="sluzby.cta.label" defaultValue="NEVÁHEJTE" as="p" className="section-label" />
          <h2 className="section-title-big">
            <EditableText sectionId="sluzby.cta.title" defaultValue="Pojďme <em>do toho</em>" as="span" />
          </h2>
          <Link href="/kontakt" className="btn btn-primary">
            <EditableText sectionId="sluzby.cta.btn" defaultValue="Napište mi" as="span" />
          </Link>
        </div>
      </section>
    </>
  );
}
