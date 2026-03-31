'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { EditableText } from '@/components/EditableText';
import { useLang } from '@/contexts/LanguageContext';

const LOGO_URL = 'https://res.cloudinary.com/dh8ts5fpa/image/upload/v1774978116/Sni%CC%81mek_obrazovky_2026-03-31_v_19.27.39_tonhmp.png';

const navItems = [
  { href: '/', sectionId: 'nav.item.uvod', label: 'Úvod', labelEn: 'Home' },
  { href: '/portfolio', sectionId: 'nav.item.portfolio', label: 'Portfolio', labelEn: 'Portfolio' },
  { href: '/sluzby', sectionId: 'nav.item.sluzby', label: 'Služby', labelEn: 'Services' },
  { href: '/o-mne', sectionId: 'nav.item.omne', label: 'Kdo jsem', labelEn: 'About' },
  { href: '/recenze', sectionId: 'nav.item.recenze', label: 'Recenze', labelEn: 'Reviews' },
  { href: '/kontakt', sectionId: 'nav.item.kontakt', label: 'Kontakt', labelEn: 'Contact' },
];

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang } = useLang();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => {
      document.body.style.overflow = !prev ? 'hidden' : '';
      return !prev;
    });
  }, []);

  const toggleLang = () => {
    setLang(lang === 'cs' ? 'en' : 'cs');
  };

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav">
      <Link href="/" className="nav-logo">
        <Image
          src={LOGO_URL}
          alt="Majda Martinská"
          width={40}
          height={40}
          style={{ objectFit: 'contain' }}
          priority
        />
      </Link>
      <div className="nav-right">
        <button className="lang-switch" onClick={toggleLang} aria-label="Switch language">
          {lang === 'cs' ? 'EN' : 'CZ'}
        </button>
        <button
          className={`nav-toggle ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
      <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        {navItems.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
              onClick={() => {
                setMenuOpen(false);
                document.body.style.overflow = '';
              }}
            >
              <EditableText sectionId={item.sectionId} defaultValue={item.label} as="span" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
