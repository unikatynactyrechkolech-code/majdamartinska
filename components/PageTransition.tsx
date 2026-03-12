'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      // Only show transition when navigating between pages (not on first load)
      setActive(true);
      const timer = setTimeout(() => setActive(false), 700);
      prevPath.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <div className={`page-transition ${active ? 'active' : ''}`}>
      <div className="page-transition-inner">
        <div className="page-transition-logo">
          {'MAJDA'.split('').map((letter, i) => (
            <span
              key={i}
              className="page-transition-letter"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="page-transition-sub">MARTINSKÁ</div>
      </div>
    </div>
  );
}
