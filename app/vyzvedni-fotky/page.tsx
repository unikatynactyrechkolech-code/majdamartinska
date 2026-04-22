'use client';

import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { EditableText } from '@/components/EditableText';
import { useLang } from '@/contexts/LanguageContext';

export default function VyzvedniPage() {
  const { t } = useLang();
  return (
    <>
      <PageHero
        title="Vyzvedni fotky"
        subtitle="Zde si vyzvedneš své hotové fotografie"
        sectionPrefix="vyzvedni.hero"
      />

      <h2 className="seo-heading">Vyzvednutí hotových fotografií — galerie pro klienty rodinného, svatebního, newborn a portrétního focení</h2>

      <section className="section" data-animate>
        <div className="container">
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <p className="section-label">
              <EditableText
                sectionId="vyzvedni.label"
                defaultValue="HOTOVÉ FOTKY"
                as="span"
              />
            </p>
            <h2 className="section-title">
              <EditableText
                sectionId="vyzvedni.title"
                defaultValue="Jak si fotky vyzvednout?"
                as="span"
              />
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '2rem', flexShrink: 0 }}>📬</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                    <EditableText sectionId="vyzvedni.step1.title" defaultValue="Dostala jsi odkaz e-mailem" as="span" />
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                    <EditableText
                      sectionId="vyzvedni.step1.text"
                      defaultValue="Po zpracování fotografií ti pošlu e-mail se soukromým odkazem ke stažení. Odkaz je platný po dobu 30 dní."
                      as="span"
                    />
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '2rem', flexShrink: 0 }}>⬇️</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                    <EditableText sectionId="vyzvedni.step2.title" defaultValue="Stáhni si svoji galerii" as="span" />
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                    <EditableText
                      sectionId="vyzvedni.step2.text"
                      defaultValue="Klikni na odkaz v e-mailu a stáhni si fotografie v plné kvalitě. Doporučuji stáhnout vše najednou jako ZIP archiv."
                      as="span"
                    />
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '2rem', flexShrink: 0 }}>❓</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                    <EditableText sectionId="vyzvedni.step3.title" defaultValue="Odkaz ti nepřišel nebo expiroval?" as="span" />
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                    <EditableText
                      sectionId="vyzvedni.step3.text"
                      defaultValue="Ozvi se mi e-mailem nebo přes kontaktní formulář a domluvíme se na novém odkazu."
                      as="span"
                    />
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/kontakt" className="btn btn-primary">
                {t('Napsat Majdě')}
              </Link>
              <a href="mailto:martinskafoto@gmail.com" className="btn btn-outline-dark">
                martinskafoto@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
