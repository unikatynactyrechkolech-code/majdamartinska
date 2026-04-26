'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Hero slideshow — fotky dodané klientkou (vyzvednifotky.majdamartinska.com)
const slides = [
  {
    src: 'https://vyzvednifotky.majdamartinska.com/image/800/upload/2101/album/261632/343172/2.jpg',
    alt: 'Focení Majda Martinská',
  },
  {
    src: 'https://vyzvednifotky.majdamartinska.com/image/800/upload/2101/album/261632/343172/5.jpg',
    alt: 'Focení Majda Martinská',
  },
  {
    src: 'https://vyzvednifotky.majdamartinska.com/image/800/upload/2101/album/261632/343172/6.jpg',
    alt: 'Focení Majda Martinská',
  },
  {
    src: 'https://vyzvednifotky.majdamartinska.com/image/800/upload/2101/album/261632/343172/10.jpg',
    alt: 'Focení Majda Martinská',
  },
  {
    src: 'https://vyzvednifotky.majdamartinska.com/image/800/upload/2101/album/261632/343172/7.jpg',
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
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="50vw"
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
