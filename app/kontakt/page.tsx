import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { ContactForm } from '@/components/ContactForm';

export default function KontaktPage() {
  return (
    <>
      <PageHero
        title="Kontakt"
        subtitle="Ozvěte se mi"
        image="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,999,999,1520,1520,1/0-0-0/c11ca67d-b1da-42ba-b398-a4483cfafa6e/1/2/mandarinkab.jpg?fjkss=exp=2088927692~hmac=4057268ac7beb84ef3e15484149ef0a30d91712645ea49bc32d3aca6b40f9f7d"
      />

      <section className="section contact-section" data-animate>
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Pojďme se <em>spojit</em></h2>
              <p>Máte zájem o focení, nebo se chcete na něco zeptat? Napište mi prostřednictvím formuláře, e-mailem nebo na sociální sítě. Ozvu se vám co nejdříve!</p>

              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">✉</span>
                  <div>
                    <strong>E-mail</strong>
                    <a href="mailto:majda@majdamartinska.com">majda@majdamartinska.com</a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">☎</span>
                  <div>
                    <strong>Telefon</strong>
                    <a href="tel:+420123456789">+420 123 456 789</a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <strong>Ateliér</strong>
                    <span>Praha — Suchdol</span>
                  </div>
                </div>
              </div>

              <div className="contact-social">
                <strong>Sledujte mě</strong>
                <div className="social-links">
                  <a href="https://www.instagram.com/majdamartinska/" target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>
                  <a href="https://www.facebook.com/majdamartinska" target="_blank" rel="noopener noreferrer" className="social-link">Facebook</a>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* STUDIO */}
      <section className="section studio" data-animate>
        <div className="container">
          <p className="section-label">ATELIÉR</p>
          <h2 className="section-title">Ateliér <em>Praha Suchdol</em></h2>
          <p className="studio-desc">Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol. Ideální pro newborn, rodinné i portrétní focení.</p>
          <a href="https://www.youtube.com/watch?v=NSrVtQRirpE" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Nahlédněte pod pokličku →</a>
        </div>
      </section>
    </>
  );
}
