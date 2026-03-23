'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { EditableText } from '@/components/EditableText';

const navItems = [
  { href: '/', sectionId: 'nav.item.uvod', label: 'Úvod' },
  { href: '/portfolio', sectionId: 'nav.item.portfolio', label: 'Portfolio' },
  { href: '/sluzby', sectionId: 'nav.item.sluzby', label: 'Služby' },
  { href: '/o-mne', sectionId: 'nav.item.omne', label: 'Kdo jsem' },
  { href: '/recenze', sectionId: 'nav.item.recenze', label: 'Recenze' },
  { href: '/kontakt', sectionId: 'nav.item.kontakt', label: 'Kontakt' },
];

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav">
      <Link href="/" className="nav-logo">
        <EditableText sectionId="nav.logo.name" defaultValue="MAJDA MARTINSKÁ" as="span" />
        {' '}
        <EditableText sectionId="nav.logo.subtitle" defaultValue="FOTOGRAFKA" as="span" />
      </Link>
      <button
        className={`nav-toggle ${menuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span /><span /><span />
      </button>
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
