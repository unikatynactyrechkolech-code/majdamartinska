'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Landscape/portrait images from deeper in portfolio — NO square crops
// Chosen for faces visible, suitable for hero background
const slides = [
  {
    src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,3655,2421,2500,2421/0-0-0/22e58576-8744-4781-94bf-611c637df94a/1/1/gina27.jpg?fjkss=exp=2090606687~hmac=b582ea2298956095d2332d662c9acdfeb05bf3aee720839ffc62deff28187445',
    alt: 'Rodinné focení',
  },
  {
    src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,2500,1000/0-0-0/c9cb2d65-e41e-469b-a02f-38821b516f99/1/1/200.jpg?fjkss=exp=2090606430~hmac=fb6f9f0aed07b67285e976063947789493028c8f896290be5fe05bb4d9eae045',
    alt: 'Svatební focení',
  },
  {
    src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1810,1199,2500,1199/0-0-0/59e9d847-d71f-459e-98d9-9883a9dcb289/1/1/laura11.jpg?fjkss=exp=2090606351~hmac=46b20fb674d9df361e702e4a12bfd8a891bc3a6d384cf4e350372aa0b280399f',
    alt: 'Newborn focení',
  },
  {
    src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,3655,2421,2500,2421/0-0-0/d7f5b4e7-7e8e-47ba-946e-f8d05ce8ec6c/1/1/gina8.jpg?fjkss=exp=2090606687~hmac=b582ea2298956095d2332d662c9acdfeb05bf3aee720839ffc62deff28187445',
    alt: 'Rodinné focení',
  },
  {
    src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,2500,1000/0-0-0/e170f219-078d-45fe-8583-234b3fed2181/1/1/_FFF5737b.jpg?fjkss=exp=2090606529~hmac=cbfba7220a6c91df05377216268c67dcdcb5443270d1ac0f68cb3215a08bad8e',
    alt: 'Portrét',
  },
  {
    src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,3643,2428,2500,2428/0-0-0/271c82f6-a72a-4e10-83a0-0af9f835892c/1/1/cekam8.jpg?fjkss=exp=2090606717~hmac=3912d0fd42aa2482789e56e83265a0a9621b67318b58736df1c9975f3b8dc901',
    alt: 'Těhotenské focení',
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
