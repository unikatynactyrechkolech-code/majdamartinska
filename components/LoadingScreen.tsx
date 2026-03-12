'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function LoadingScreen() {
  const [hidden, setHidden] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show the full loading screen on the homepage on first visit
    if (pathname === '/' && !sessionStorage.getItem('majda-loaded')) {
      setShouldShow(true);
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        setHidden(true);
        document.body.style.overflow = '';
        sessionStorage.setItem('majda-loaded', '1');
      }, 2800);
      return () => clearTimeout(timer);
    } else {
      setShouldShow(false);
      setHidden(true);
    }
  }, [pathname]);

  if (!shouldShow) return null;

  return (
    <div className={`loader ${hidden ? 'hidden' : ''}`}>
      <div className="loader-inner">
        <div className="loader-logo">
          {'MAJDA'.split('').map((letter, i) => (
            <span key={i} className="loader-letter" style={{ '--i': i } as React.CSSProperties}>
              {letter}
            </span>
          ))}
        </div>
        <div className="loader-sub">MARTINSKÁ</div>
        <div className="loader-bar">
          <div className="loader-bar-fill" />
        </div>
      </div>
    </div>
  );
}
