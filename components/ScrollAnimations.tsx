'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    // Small delay to let the new page DOM render
    const timer = setTimeout(() => {
      const animateElements = document.querySelectorAll('[data-animate]:not(.visible)');
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
      );
      animateElements.forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
