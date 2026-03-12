import Link from 'next/link';
import Image from 'next/image';

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
            <h3>Majda Martinská</h3>
            <p>Fotografka — Praha Suchdol</p>
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
            <h4>NAVIGACE</h4>
            <ul>
              <li><Link href="/">Úvod</Link></li>
              <li><Link href="/portfolio">Portfolio</Link></li>
              <li><Link href="/sluzby">Služby</Link></li>
              <li><Link href="/o-mne">Kdo jsem</Link></li>
              <li><Link href="/recenze">Recenze</Link></li>
              <li><Link href="/kontakt">Kontakt</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>KONTAKT</h4>
            <p><a href="mailto:martinskafoto@gmail.com">martinskafoto@gmail.com</a></p>
            <p className="footer-address">
              Magdaléna Martinská<br />
              Nad Spáleným mlýnem 466/3<br />
              165 00 Praha — Suchdol<br />
              IČ 87765403
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© Majda Martinská 2026</p>
        </div>
      </div>
    </footer>
  );
}
