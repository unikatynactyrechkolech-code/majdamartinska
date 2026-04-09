'use client';

import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { ContactForm } from '@/components/ContactForm';
import { EditableText } from '@/components/EditableText';

export default function KontaktPage() {
  return (
    <>
      <PageHero
        title="Kontakt"
        subtitle="Objednejte si focení v Praze"
        sectionPrefix="kontakt.hero"
      />

      <section className="section contact-section" data-animate>
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>
                <EditableText sectionId="kontakt.info.title" defaultValue="Kontaktujte <em>fotografku</em>" as="span" />
              </h2>
              <EditableText
                sectionId="kontakt.info.text"
                defaultValue="Máte zájem o focení, nebo se chcete na něco zeptat? Napište mi prostřednictvím formuláře, e-mailem nebo na sociální sítě. Ozvu se vám co nejdříve!"
                as="p"
                multiline
              />

              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">✉</span>
                  <div>
                    <EditableText sectionId="kontakt.label.email" defaultValue="E-mail" as="strong" />
                    <EditableText sectionId="kontakt.email" defaultValue="majda@majdamartinska.com" as="span" />
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">☎</span>
                  <div>
                    <EditableText sectionId="kontakt.label.telefon" defaultValue="Telefon" as="strong" />
                    <EditableText sectionId="kontakt.telefon" defaultValue="+420 123 456 789" as="span" />
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <EditableText sectionId="kontakt.label.atelier" defaultValue="Ateliér" as="strong" />
                    <EditableText sectionId="kontakt.adresa" defaultValue="Praha — Suchdol" as="span" />
                  </div>
                </div>
              </div>

              <div className="contact-social">
                <EditableText sectionId="kontakt.social.label" defaultValue="Sledujte mě" as="strong" />
                <div className="social-links">
                  <a href="https://www.instagram.com/majdamartinska/" target="_blank" rel="noopener noreferrer" className="social-link">
                    <EditableText sectionId="kontakt.social.instagram" defaultValue="Instagram" as="span" />
                  </a>
                  <a href="https://www.facebook.com/majdamartinska" target="_blank" rel="noopener noreferrer" className="social-link">
                    <EditableText sectionId="kontakt.social.facebook" defaultValue="Facebook" as="span" />
                  </a>
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
      <section className="section studio section-brown" data-animate>
        <div className="container">
          <EditableText sectionId="kontakt.studio.label" defaultValue="ATELIÉR" as="p" className="section-label" />
          <h2 className="section-title">
            <EditableText sectionId="kontakt.studio.title" defaultValue="Fotoateliér <em>Praha Suchdol</em>" as="span" />
          </h2>
          <EditableText sectionId="kontakt.studio.text" defaultValue="Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol. Ideální pro newborn, rodinné i portrétní focení." as="p" className="studio-desc" multiline />
          <a href="https://www.youtube.com/watch?v=NSrVtQRirpE" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <EditableText sectionId="kontakt.studio.btn" defaultValue="Nahlédněte pod pokličku →" as="span" />
          </a>
        </div>
      </section>
    </>
  );
}
