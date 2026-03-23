'use client';

import Link from 'next/link';
import Image from 'next/image';
import { EditableText } from '@/components/EditableText';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image
              src="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,200,200,400,398/0-0-0/7b20a2a3-defe-43c3-a04c-8a0dacb2ed8f/1/1/c.jpg?fjkss=exp=2088926256~hmac=c8c376d33858128bf7c2487d345e67b07975b861b20d8756135df2891a693e38"
              alt="Majda Martinská"
              width={60}
              height={60}
              className="footer-avatar"
            />
            <h3><EditableText sectionId="footer.brand.name" defaultValue="Majda Martinská" as="span" /></h3>
            <p><EditableText sectionId="footer.brand.subtitle" defaultValue="Fotografka — Praha Suchdol" as="span" /></p>
            <div className="footer-social">
              <a href="https://www.facebook.com/pages/Foto-Majda-Martinsk%C3%A1/124691730942453" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://twitter.com/MajdaMartinska" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>
          <div className="footer-nav">
            <h4><EditableText sectionId="footer.nav.heading" defaultValue="NAVIGACE" as="span" /></h4>
            <ul>
              <li><Link href="/"><EditableText sectionId="footer.nav.uvod" defaultValue="Úvod" as="span" /></Link></li>
              <li><Link href="/portfolio"><EditableText sectionId="footer.nav.portfolio" defaultValue="Portfolio" as="span" /></Link></li>
              <li><Link href="/sluzby"><EditableText sectionId="footer.nav.sluzby" defaultValue="Služby" as="span" /></Link></li>
              <li><Link href="/o-mne"><EditableText sectionId="footer.nav.omne" defaultValue="Kdo jsem" as="span" /></Link></li>
              <li><Link href="/recenze"><EditableText sectionId="footer.nav.recenze" defaultValue="Recenze" as="span" /></Link></li>
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
        </div>
      </div>
    </footer>
  );
}
