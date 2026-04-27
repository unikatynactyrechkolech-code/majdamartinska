'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Hero slideshow — fotky dodané klientkou (vyzvednifotky.majdamartinska.com)
// Server poskytuje 2 velikosti: 800 px (náhled) a 2048 px (vysoká kvalita).
// Pro hero používáme 2048 — Next.js Image to dál sám zmenší pro každý
// device (sizes="50vw"), takže mobil nestáhne plnou velikost zbytečně.
const slides = [
  {
    src: 'https://vyzvednifotky.majdamartinska.com/image/2048/upload/2101/album/261632/343172/2.jpg',
    alt: 'Focení Majda Martinská',
  },
  {
    src: 'https://vyzvednifotky.majdamartinska.com/image/2048/upload/2101/album/261632/343172/5.jpg',
    alt: 'Focení Majda Martinská',
  },
  {
    src: 'https://vyzvednifotky.majdamartinska.com/image/2048/upload/2101/album/261632/343172/6.jpg',
    alt: 'Focení Majda Martinská',
  },
  {
    src: 'https://vyzvednifotky.majdamartinska.com/image/2048/upload/2101/album/261632/343172/10.jpg',
    alt: 'Focení Majda Martinská',
  },
  {
    src: 'https://vyzvednifotky.majdamartinska.com/image/2048/upload/2101/album/261632/343172/7.jpg',
    alt: 'Focení Majda Martinská',
  },
];

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 600); // match CSS transition duration
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="hero-slideshow">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${index === current ? 'active' : ''} ${
            isTransitioning && index === current ? 'fading-out' : ''
          } ${
            isTransitioning && index === (current + 1) % slides.length ? 'fading-in' : ''
          }`}
        >
          {/* `unoptimized` — Next.js by jinak fotku znovu zakomprimoval na quality 75
               a kvalita znatelně klesla. Server poskytuje hotový 2048×1366 JPEG (~270 kB),
               který už je ostrý a slušně komprimovaný — pouštíme ho do prohlížeče přímo. */}
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            unoptimized
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            priority={index === 0}
          />
        </div>
      ))}

      {/* Subtle overlay gradient */}
      <div className="hero-slideshow-overlay" />

      {/* Slide indicators */}
      <div className="hero-slideshow-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === current ? 'active' : ''}`}
            onClick={() => {
              setCurrent(index);
              setIsTransitioning(false);
            }}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
