import { useEffect, useState } from 'react';

interface IOptions {
  root?: HTMLElement;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}

/**
 * @param
 * observerOptions = {
 *  root: document.querySelector('#scrollArea'),
 *  rootMargin: '0px',
 *  threshold: 1.0 // 1.0 - (100% element scroll) 0.9 - 90%(100% element scroll)
 * }
 */

export const useInView = (
  reference?: { current: HTMLElement | null },
  options?: IOptions,
  selector?: string,
): boolean => {
  const [isView, setIsView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (reference === null || reference?.current === null) return;

    if (typeof window.IntersectionObserver !== 'undefined') {
      const observer = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsView(true);
            options?.once && observer.unobserve(reference?.current as HTMLElement);
          } else {
            setIsView(false);
          }
        });
      }, options);

      observer.observe(reference?.current as Element);
    }
  }, [options, reference]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!selector) return;

    const el = document.querySelector(selector);

    if (typeof window.IntersectionObserver !== 'undefined') {
      const observer = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsView(true);
            options?.once && observer.unobserve(el as HTMLElement);
          } else {
            setIsView(false);
          }
        });
      }, options);

      observer.observe(el as Element);
    }
  }, [options, selector]);

  return isView;
};
