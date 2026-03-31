'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const LOGO_URL = 'https://res.cloudinary.com/dh8ts5fpa/image/upload/v1774978116/Sni%CC%81mek_obrazovky_2026-03-31_v_19.27.39_tonhmp.png';

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
        <div className="loader-logo-img">
          <Image
            src={LOGO_URL}
            alt="Majda Martinská"
            width={180}
            height={180}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="loader-bar">
          <div className="loader-bar-fill" />
        </div>
      </div>
    </div>
  );
}
