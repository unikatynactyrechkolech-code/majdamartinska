'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const LOGO_URL = 'https://res.cloudinary.com/dh8ts5fpa/image/upload/v1774978116/Sni%CC%81mek_obrazovky_2026-03-31_v_19.27.39_tonhmp.png';

export function PageTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setActive(true);
      const timer = setTimeout(() => setActive(false), 700);
      prevPath.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <div className={`page-transition ${active ? 'active' : ''}`}>
      <div className="page-transition-inner">
        <div className="page-transition-logo-img">
          <Image
            src={LOGO_URL}
            alt="Majda Martinská"
            width={120}
            height={120}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
}
