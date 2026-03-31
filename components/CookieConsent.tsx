'use client';

import { useState, useEffect } from 'react';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    setClosing(true);
    setTimeout(() => {
      localStorage.setItem('cookie-consent', 'accepted');
      setVisible(false);
    }, 400);
  };

  const decline = () => {
    setClosing(true);
    setTimeout(() => {
      localStorage.setItem('cookie-consent', 'declined');
      setVisible(false);
    }, 400);
  };

  if (!visible) return null;

  return (
    <div className={`cookie-banner ${closing ? 'closing' : ''}`}>
      <div className="cookie-banner-inner">
        <div className="cookie-banner-icon">🍪</div>
        <div className="cookie-banner-text">
          <h4>Tato stránka používá cookies</h4>
          <p>
            Na stránkách používáme soubory cookies. Některé jsou nezbytné pro fungování
            stránek, jiné nám umožňují poskytnout vám lepší zkušenost při návštěvě
            a pomáhají nám analyzovat návštěvnost.
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button className="btn btn-primary cookie-btn-accept" onClick={accept}>
            Souhlasím
          </button>
          <button className="btn btn-outline cookie-btn-decline" onClick={decline}>
            Odmítnout
          </button>
        </div>
      </div>
    </div>
  );
}
