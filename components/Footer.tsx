'use client';

import Link from 'next/link';
import Image from 'next/image';
import { EditableText } from '@/components/EditableText';

const LOGO_URL = 'https://res.cloudinary.com/dh8ts5fpa/image/upload/v1774978116/Sni%CC%81mek_obrazovky_2026-03-31_v_19.27.39_tonhmp.png';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-avatar">
              <Image
                src={LOGO_URL}
                alt="Majda Martinská"
                width={60}
                height={60}
                style={{ objectFit: 'contain', borderRadius: '50%' }}
              />
            </div>
            <h3><EditableText sectionId="footer.brand.name" defaultValue="Majda Martinská" as="span" /></h3>
            <p><EditableText sectionId="footer.brand.subtitle" defaultValue="Fotografka — Praha Suchdol" as="span" /></p>
            <div className="footer-social">
              <a href="https://www.facebook.com/profile.php?id=100066773513366&locale=eo_EO" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>
          <div className="footer-nav">
            <h4><EditableText sectionId="footer.nav.heading" defaultValue="NAVIGACE" as="span" /></h4>
            <ul>
              <li><Link href="/"><EditableText sectionId="footer.nav.uvod" defaultValue="Úvod" as="span" /></Link></li>
              <li><Link href="/portfolio"><EditableText sectionId="footer.nav.portfolio" defaultValue="Portfolio" as="span" /></Link></li>
              <li><Link href="/art"><EditableText sectionId="footer.nav.art" defaultValue="Art" as="span" /></Link></li>
              <li><Link href="/sluzby"><EditableText sectionId="footer.nav.sluzby" defaultValue="Služby" as="span" /></Link></li>
              <li><Link href="/o-mne"><EditableText sectionId="footer.nav.omne" defaultValue="Kdo jsem" as="span" /></Link></li>
              <li><Link href="/recenze"><EditableText sectionId="footer.nav.recenze" defaultValue="Recenze" as="span" /></Link></li>
              <li><Link href="/blog"><EditableText sectionId="footer.nav.blog" defaultValue="Blog" as="span" /></Link></li>
              <li><a href="https://vyzvednifotky.majdamartinska.com/" target="_blank" rel="noopener noreferrer"><EditableText sectionId="footer.nav.vyzvedni" defaultValue="Vyzvedni fotky" as="span" /></a></li>
              <li><Link href="/kontakt"><EditableText sectionId="footer.nav.kontakt" defaultValue="Kontakt" as="span" /></Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4><EditableText sectionId="footer.contact.heading" defaultValue="KONTAKT" as="span" /></h4>
            <p><EditableText sectionId="footer.contact.email" defaultValue="martinskafoto@gmail.com" as="span" /></p>
            <EditableText
              sectionId="footer.contact.address"
              defaultValue="Magdaléna Martinská<br />Nad Spáleným mlýnem 466/3<br />165 00 Praha — Suchdol<br />IČ 87765403"
              as="p"
              className="footer-address"
              multiline
            />
          </div>
        </div>
        <div className="footer-bottom">
          <p><EditableText sectionId="footer.copyright" defaultValue="© Majda Martinská 2026" as="span" /></p>
          <p className="footer-credit">web by <a href="https://webpojede.cz" target="_blank" rel="noopener noreferrer">webpojede.cz</a></p>
        </div>
      </div>
    </footer>
  );
}
