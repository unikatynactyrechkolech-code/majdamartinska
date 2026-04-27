'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { EditableText } from '@/components/EditableText';
import { useLang } from '@/contexts/LanguageContext';

const navItems: Array<{
  href: string;
  sectionId: string;
  label: string;
  labelEn: string;
  external?: boolean;
}> = [
  { href: '/', sectionId: 'nav.item.uvod', label: 'Úvod', labelEn: 'Home' },
  { href: '/portfolio', sectionId: 'nav.item.portfolio', label: 'Portfolio', labelEn: 'Portfolio' },
  { href: '/art', sectionId: 'nav.item.art', label: 'Art', labelEn: 'Art' },
  { href: '/sluzby', sectionId: 'nav.item.sluzby', label: 'Služby', labelEn: 'Services' },
  { href: '/o-mne', sectionId: 'nav.item.omne', label: 'Kdo jsem', labelEn: 'About' },
  { href: '/recenze', sectionId: 'nav.item.recenze', label: 'Recenze', labelEn: 'Reviews' },
  { href: '/blog', sectionId: 'nav.item.blog', label: 'Blog', labelEn: 'Blog' },
  { href: 'https://vyzvednifotky.majdamartinska.com/', sectionId: 'nav.item.vyzvedni', label: 'Vyzvedni fotky', labelEn: 'Pick up photos', external: true },
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
      <div className="nav-right-mobile">
        <button className="lang-switch lang-switch-mobile" onClick={toggleLang} aria-label="Switch language">
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
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  document.body.style.overflow = '';
                }}
              >
                <EditableText sectionId={item.sectionId} defaultValue={item.label} as="span" />
              </a>
            ) : (
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
            )}
          </li>
        ))}
        <li className="nav-lang-item">
          <button className="lang-switch" onClick={toggleLang} aria-label="Switch language">
            {lang === 'cs' ? 'EN' : 'CZ'}
          </button>
        </li>
      </ul>
    </nav>
  );
}
