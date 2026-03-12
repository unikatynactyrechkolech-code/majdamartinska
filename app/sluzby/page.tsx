import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';

export default function SluzbyPage() {
  return (
    <>
      <PageHero
        title="Služby"
        subtitle="Co pro vás mohu udělat"
        image="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/337,0,1337,1000,580,580,1/0-0-0/2b1abef9-f657-4d4d-af2d-f2ea0305c275/1/2/_FFF5852.jpg?fjkss=exp=2088926255~hmac=0e915221ac8400e348f232f2aaeb08aa4d77091d2dd68ad90e89e16f5a339864"
      />

      {/* RODINNÉ */}
      <section className="section service-detail" id="rodinna" data-animate>
        <div className="container">
          <div className="service-detail-grid">
            <div className="service-detail-img">
              <Image
                src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/337,0,1337,1000,580,580,1/0-0-0/2b1abef9-f657-4d4d-af2d-f2ea0305c275/1/2/_FFF5852.jpg?fjkss=exp=2088926255~hmac=0e915221ac8400e348f232f2aaeb08aa4d77091d2dd68ad90e89e16f5a339864"
                alt="Rodinné focení"
                width={700}
                height={875}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
            <div className="service-detail-content">
              <p className="section-label">01</p>
              <h2>Rodinné a <em>párové focení</em></h2>
              <p>Focení rodin, párů, sourozenců, kamarádů. Prostě všech, kteří se mají rádi a chtějí si to připomenout i za 10 let. Focení probíhá většinou venku v přírodě, nebo v mém ateliéru na Suchdole. Rodinné focení trvá cca 1–1,5 h.</p>
              <ul className="service-detail-list">
                <li>Rodinné focení / párové focení</li>
                <li>V exteriéru nebo v ateliéru</li>
                <li>Cca 1–1,5 hodiny focení</li>
                <li>50+ upravených fotografií</li>
              </ul>
              <div className="service-detail-price">
                <span className="price">od 3 900 Kč</span>
              </div>
              <Link href="/kontakt" className="btn btn-primary">Mám zájem</Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEWBORN */}
      <section className="section service-detail" id="newborn" data-animate>
        <div className="container">
          <div className="service-detail-grid reverse">
            <div className="service-detail-img">
              <Image
                src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/105,0,1105,1000,580,580,1/0-0-0/e31af609-ffc4-4df0-9dd0-55164c01ae9c/1/2/beranci420.jpg?fjkss=exp=2088926256~hmac=f068764e9720bd72e5c31b1778dc5b3c9757133c8222f974f4fbd7a2070d2581"
                alt="Newborn focení"
                width={700}
                height={875}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
            <div className="service-detail-content">
              <p className="section-label">02</p>
              <h2>Newborn — <em>miminka</em></h2>
              <p>Newborn focení je zaměřené na novorozence ve věku 5–14 dní. V tomto období jsou miminka ještě hodně ospalá a dají se krásně tvarovat do různých pozic. Focení probíhá v mém ateliéru, kde je teplo, klid a vše potřebné.</p>
              <ul className="service-detail-list">
                <li>Newborn focení (5–14 dní)</li>
                <li>V ateliéru Praha Suchdol</li>
                <li>Cca 2–3 hodiny focení</li>
                <li>30+ upravených fotografií</li>
              </ul>
              <div className="service-detail-price">
                <span className="price">od 4 900 Kč</span>
              </div>
              <Link href="/kontakt" className="btn btn-primary">Mám zájem</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SVATBY */}
      <section className="section service-detail" id="svatby" data-animate>
        <div className="container">
          <div className="service-detail-grid">
            <div className="service-detail-img">
              <Image
                src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/242,0,1242,1000,580,580,1/0-0-0/6a22c40a-2331-4783-8eda-c50263a4e231/1/2/_FFF6358-DeNoiseAI-standard.jpg?fjkss=exp=2088926256~hmac=048edc5062605e1fa227333279bc4d80d6f5dc521a10449af549312b0ba64723"
                alt="Svatební focení"
                width={700}
                height={875}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
            <div className="service-detail-content">
              <p className="section-label">03</p>
              <h2>Svatební <em>focení</em></h2>
              <p>Váš velký den si zaslouží být zachycen přirozeně a s citem. Focím reportážním stylem — žádné nucené pózy, ale skutečné emoce a momenty, které byste jinak zapomněli.</p>
              <ul className="service-detail-list">
                <li>Svatební den — reportážní styl</li>
                <li>Přípravy, obřad, focení párů, hostina</li>
                <li>Celý den nebo jen část</li>
                <li>200–500+ upravených fotografií</li>
              </ul>
              <div className="service-detail-price">
                <span className="price">od 15 000 Kč</span>
              </div>
              <Link href="/kontakt" className="btn btn-primary">Mám zájem</Link>
            </div>
          </div>
        </div>
      </section>

      {/* PSI */}
      <section className="section service-detail" id="psi" data-animate>
        <div className="container">
          <div className="service-detail-grid reverse">
            <div className="service-detail-img">
              <Image
                src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/91,0,1091,1000,580,580,1/0-0-0/df099d74-dc42-4b6c-b83e-fb2200b54189/1/2/_FFF6743.jpg?fjkss=exp=2088926255~hmac=69a228dbb31ba452684c67584e88c7e9291798244e448bc468b9c8071a5c924a"
                alt="Focení psů"
                width={700}
                height={875}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
            <div className="service-detail-content">
              <p className="section-label">04</p>
              <h2>Psí <em>kamarádi</em></h2>
              <p>Máš doma mazlíka, co ti dělá radost? Focení psích kamarádů (a samozřejmě i s jejich páníčky) je něco, co mě neskutečně baví. Focení probíhá venku v přírodě.</p>
              <ul className="service-detail-list">
                <li>Focení psů a jejich páníčků</li>
                <li>V přírodě</li>
                <li>Cca 1 hodina focení</li>
                <li>40+ upravených fotografií</li>
              </ul>
              <div className="service-detail-price">
                <span className="price">od 3 500 Kč</span>
              </div>
              <Link href="/kontakt" className="btn btn-primary">Mám zájem</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TĚHOTENSKÉ */}
      <section className="section service-detail" id="tehotenske" data-animate>
        <div className="container">
          <div className="service-detail-grid">
            <div className="service-detail-img">
              <Image
                src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,2424,3650,1600,3650/0-0-0/72605f59-07d5-4cf7-a4dc-1102fb905c51/1/1/_DSC0107cb.jpg?fjkss=exp=2088681074~hmac=7ad23ece9e93b148e5817708a8f579689fc67819a6dd60cb67bdbc90bd35b52c"
                alt="Těhotenské focení"
                width={700}
                height={875}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
            <div className="service-detail-content">
              <p className="section-label">05</p>
              <h2>Těhotenské <em>focení</em></h2>
              <p>Krásné období, které si zaslouží zachytit na fotografiích. Těhotenské focení je nejkrásnější kolem 30.–36. týdne těhotenství. Focení probíhá v ateliéru nebo v přírodě.</p>
              <ul className="service-detail-list">
                <li>Těhotenské focení (30.–36. týden)</li>
                <li>V ateliéru nebo venku</li>
                <li>Cca 1 hodina focení</li>
                <li>30+ upravených fotografií</li>
              </ul>
              <div className="service-detail-price">
                <span className="price">od 3 500 Kč</span>
              </div>
              <Link href="/kontakt" className="btn btn-primary">Mám zájem</Link>
            </div>
          </div>
        </div>
      </section>

      {/* PORTRÉTY */}
      <section className="section service-detail" id="portret" data-animate>
        <div className="container">
          <div className="service-detail-grid reverse">
            <div className="service-detail-img">
              <Image
                src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/269,0,1269,1000,580,580,1/0-0-0/03b7bbe1-7c1f-4167-adab-849497e1d2e2/1/2/_FFF0819.jpg?fjkss=exp=2088681039~hmac=b5673dbf2b60511a55402901e21d21c70b0de494fa1a65298258688c498e2a6e"
                alt="Portrétní focení"
                width={700}
                height={875}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
            <div className="service-detail-content">
              <p className="section-label">06</p>
              <h2>Portrétní <em>focení</em></h2>
              <p>Profesionální portrétní fotografie pro vaši osobní prezentaci, LinkedIn, nebo prostě jen proto, že chcete krásné fotky sebe. Focení probíhá v ateliéru i venku.</p>
              <ul className="service-detail-list">
                <li>Portrétní / profilové focení</li>
                <li>V ateliéru nebo venku</li>
                <li>Cca 45 min – 1 hodina</li>
                <li>20+ upravených fotografií</li>
              </ul>
              <div className="service-detail-price">
                <span className="price">od 2 900 Kč</span>
              </div>
              <Link href="/kontakt" className="btn btn-primary">Mám zájem</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta" data-animate>
        <div className="container">
          <p className="section-label">NEVÁHEJTE</p>
          <h2 className="section-title-big">Pojďme <em>do toho</em></h2>
          <Link href="/kontakt" className="btn btn-primary">Napište mi</Link>
        </div>
      </section>
    </>
  );
}
