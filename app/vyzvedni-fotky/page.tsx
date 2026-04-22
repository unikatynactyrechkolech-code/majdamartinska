'use client';

import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { EditableText } from '@/components/EditableText';
import { useLang } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useState, useEffect } from 'react';

const PIXIESET_DEFAULT = 'https://majdamartinska.pixieset.com/';

export default function VyzvedniPage() {
  const { t } = useLang();
  const { isAdmin, drafts, setDraft } = useAdmin();
  const [pixiesetUrl, setPixiesetUrl] = useState<string>(PIXIESET_DEFAULT);

  // Nacti URL z draftu (publikovana hodnota se loaduje pres AdminContext)
  useEffect(() => {
    const draft = drafts['vyzvedni.pixieset.url'];
    if (draft && draft.value) setPixiesetUrl(draft.value);
  }, [drafts]);

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

            {/* INTRO TEXT — vita klienta nad CTA tlacitkem */}
            <p style={{
              textAlign: 'center',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'var(--color-text-muted)',
              margin: '1.5rem 0 1.5rem',
            }}>
              <EditableText
                sectionId="vyzvedni.intro"
                defaultValue="Ahoj ahoj, tak tvoje fotky jsou připravené k výběru nebo hotové. Ať tak či onak, zadej svůj kód a můžeš se začít kochat :)))"
                as="span"
                multiline
              />
            </p>

            {/* PIXIESET CTA — primarni tlacitko, otevre se v nove zalozce */}
            <div style={{ margin: '1rem 0 2rem', padding: '1.5rem', background: 'var(--color-bg-card)', borderRadius: '0.75rem', textAlign: 'center' }}>
              <a
                href={pixiesetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ minWidth: '260px' }}
              >
                <EditableText
                  sectionId="vyzvedni.pixieset.btn"
                  defaultValue="Otevřít galerii v Pixieset →"
                  as="span"
                />
              </a>
              {isAdmin && (
                <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    🔧 Pixieset URL (vidíš jen ty jako admin):
                  </label>
                  <input
                    type="url"
                    value={pixiesetUrl}
                    onChange={(e) => {
                      setPixiesetUrl(e.target.value);
                      setDraft('vyzvedni.pixieset.url', e.target.value);
                    }}
                    placeholder="https://majdamartinska.pixieset.com/"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '0.4rem', fontSize: '0.9rem' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                    💡 Po změně klikni v horní liště „Publikovat změny" — odkaz se uloží.
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/kontakt" className="btn btn-outline-dark">
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
