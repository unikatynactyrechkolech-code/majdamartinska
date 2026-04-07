'use client';

import { useEffect, useRef } from 'react';

export function HeroCamera() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<SVGGElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const animFrame = useRef<number>(0);
  const current = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const container = containerRef.current;
    const camera = cameraRef.current;
    const lens = lensRef.current;
    const flash = flashRef.current;
    if (!container || !camera || !lens || !flash) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const onMouseLeave = () => {
      mousePos.current = { x: 0.5, y: 0.5 };
    };

    // Flash effect on click
    const onClick = () => {
      flash.style.opacity = '1';
      setTimeout(() => { flash.style.opacity = '0'; }, 150);
      // Shutter animation
      const shutterEl = container.querySelector('.hero-camera-shutter') as HTMLElement;
      if (shutterEl) {
        shutterEl.classList.add('snap');
        setTimeout(() => shutterEl.classList.remove('snap'), 400);
      }
    };

    const animate = () => {
      // Smooth interpolation
      current.current.x += (mousePos.current.x - current.current.x) * 0.08;
      current.current.y += (mousePos.current.y - current.current.y) * 0.08;

      const dx = (current.current.x - 0.5) * 30;
      const dy = (current.current.y - 0.5) * 20;
      const rotX = (current.current.y - 0.5) * -15;
      const rotY = (current.current.x - 0.5) * 15;

      camera.style.transform = `translate(${dx}px, ${dy}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

      // Lens follows mouse slightly more
      const lensX = (current.current.x - 0.5) * 8;
      const lensY = (current.current.y - 0.5) * 8;
      lens.style.transform = `translate(${lensX}px, ${lensY}px)`;

      animFrame.current = requestAnimationFrame(animate);
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('click', onClick);
    animFrame.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('click', onClick);
      cancelAnimationFrame(animFrame.current);
    };
  }, []);

  return (
    <div className="hero-camera-container" ref={containerRef}>
      {/* Flash overlay */}
      <div className="hero-camera-flash" ref={flashRef} />

      {/* Floating particles */}
      <div className="hero-camera-particles">
        <span className="particle p1" />
        <span className="particle p2" />
        <span className="particle p3" />
        <span className="particle p4" />
        <span className="particle p5" />
      </div>

      {/* Camera body */}
      <div className="hero-camera" ref={cameraRef}>
        <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-camera-svg">
          {/* Camera body */}
          <rect x="20" y="55" width="200" height="130" rx="18" fill="#1a1a1a" />
          <rect x="20" y="55" width="200" height="130" rx="18" stroke="#2a2a2a" strokeWidth="1.5" />

          {/* Top bump / viewfinder */}
          <rect x="85" y="35" width="70" height="28" rx="6" fill="#1a1a1a" />
          <rect x="85" y="35" width="70" height="28" rx="6" stroke="#2a2a2a" strokeWidth="1" />

          {/* Viewfinder glass */}
          <rect x="105" y="40" width="30" height="12" rx="3" fill="#222" stroke="#333" strokeWidth="0.5" />

          {/* Shutter button */}
          <circle cx="175" cy="45" r="8" fill="#333" stroke="#444" strokeWidth="1" />
          <circle cx="175" cy="45" r="5" fill="#a98d6d" className="hero-camera-shutter-btn" />

          {/* Main lens outer ring */}
          <circle cx="120" cy="125" r="48" fill="#222" stroke="#333" strokeWidth="2" />
          <circle cx="120" cy="125" r="42" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1.5" />

          {/* Lens glass — the interactive part */}
          <g ref={lensRef} className="hero-camera-lens-group">
            <circle cx="120" cy="125" r="35" fill="#0d1117" />
            <circle cx="120" cy="125" r="28" fill="#161b22" stroke="#222" strokeWidth="0.5" />
            {/* Lens reflections */}
            <ellipse cx="110" cy="115" rx="12" ry="8" fill="rgba(169,141,109,0.15)" transform="rotate(-20 110 115)" />
            <ellipse cx="130" cy="135" rx="8" ry="5" fill="rgba(169,141,109,0.08)" transform="rotate(25 130 135)" />
            {/* Center dot */}
            <circle cx="120" cy="125" r="4" fill="#a98d6d" opacity="0.6" />
          </g>

          {/* Shutter lines (iris) */}
          <g className="hero-camera-shutter">
            <line x1="100" y1="105" x2="108" y2="113" stroke="#333" strokeWidth="0.8" />
            <line x1="140" y1="105" x2="132" y2="113" stroke="#333" strokeWidth="0.8" />
            <line x1="100" y1="145" x2="108" y2="137" stroke="#333" strokeWidth="0.8" />
            <line x1="140" y1="145" x2="132" y2="137" stroke="#333" strokeWidth="0.8" />
          </g>

          {/* Brand text */}
          <text x="55" y="78" fill="#444" fontSize="8" fontFamily="Inter, sans-serif" letterSpacing="0.2em">MAJDA</text>

          {/* Small detail - mode dial */}
          <circle cx="50" cy="45" r="10" fill="#222" stroke="#333" strokeWidth="1" />
          <line x1="50" y1="37" x2="50" y2="40" stroke="#a98d6d" strokeWidth="1.5" />

          {/* Grip texture lines */}
          <line x1="28" y1="80" x2="28" y2="160" stroke="#252525" strokeWidth="0.7" />
          <line x1="31" y1="80" x2="31" y2="160" stroke="#252525" strokeWidth="0.7" />
          <line x1="34" y1="80" x2="34" y2="160" stroke="#252525" strokeWidth="0.7" />

          {/* Strap holder */}
          <rect x="20" y="70" width="5" height="14" rx="2" fill="#333" />
          <rect x="215" y="70" width="5" height="14" rx="2" fill="#333" />
        </svg>

        {/* Hover hint */}
        <p className="hero-camera-hint">Klikni pro focení ✨</p>
      </div>
    </div>
  );
}
