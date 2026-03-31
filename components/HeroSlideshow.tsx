'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const slides = [
  {
    src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/3f875228-71be-40bf-96d2-b419364599a1/1/1/_FFF5983.jpg?fjkss=exp=2088681035~hmac=2e9c039a5620e3d43d3fe64b3f7daef7015cc8ae1b4d717a0fea903df01196c7',
    alt: 'Rodinné focení',
  },
  {
    src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/0bbb0044-6aac-4da5-8043-4c09d06b8164/1/1/192.jpg?fjkss=exp=2088920790~hmac=77261ddf4add0008600b2e0b4dacb93e5a710de8a3ec6ff85a0d2ada0c8b3165',
    alt: 'Svatby',
  },
  {
    src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/77117316-7f64-4db7-8b23-d32496550df9/1/1/_FFF7059.jpg?fjkss=exp=2088927709~hmac=d73e6ebc3df068b24965421c829df9026c667decd48f2b207774d18a99d1bcd5',
    alt: 'Newborn',
  },
  {
    src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/287,0,1287,1000,580,580,1/0-0-0/abd0b8bc-40a7-4cba-a769-cbc568d41c13/1/2/_FFF5931.jpg?fjkss=exp=2088681039~hmac=22be9649398a9ea56ec377944dcd6bd02254347ecc8e43027ed7075709fe618c',
    alt: 'Rodinné focení venku',
  },
  {
    src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,800,1200,1600,1200/0-0-0/e73300d8-5661-4b60-8039-bd421a04ddfa/1/1/_FFF9854.jpg?fjkss=exp=2088920600~hmac=7012a75d6187677fa811f9a01dbd2f217af3a83b2a2bfbd3378d20da1d9f46d8',
    alt: 'Portréty',
  },
  {
    src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,2424,3650,1600,3650/0-0-0/72605f59-07d5-4cf7-a4dc-1102fb905c51/1/1/_DSC0107cb.jpg?fjkss=exp=2088681074~hmac=7ad23ece9e93b148e5817708a8f579689fc67819a6dd60cb67bdbc90bd35b52c',
    alt: 'Těhotenské focení',
  },
  {
    src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,999,999,1520,1520,1/0-0-0/c11ca67d-b1da-42ba-b398-a4483cfafa6e/1/2/mandarinkab.jpg?fjkss=exp=2088927692~hmac=4057268ac7beb84ef3e15484149ef0a30d91712645ea49bc32d3aca6b40f9f7d',
    alt: 'Majda Martinská',
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
            style={{ objectFit: 'cover' }}
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
