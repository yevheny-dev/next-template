import React, { useEffect } from 'react';

import { useInView, useIsMobile } from '@/shared';

export const useScreenAnimate = (
  ref: { current: HTMLElement | null },
  options: {
    start: number;
    stickyPosition: number;
  },
) => {
  const { start, stickyPosition } = options;
  const isMobile = useIsMobile();
  const [inset, setInset] = React.useState(start);
  const [firstScreenOpacity, setFirstScreenOpacity] = React.useState(0);
  const [secondScreenOpacity, setSecondScreenOpacity] = React.useState(0);
  const [thirdScreenOpacity, setThirdScreenOpacity] = React.useState(0);
  const inView = useInView(ref);

  const MAX_INSET = isMobile ? 50 : 158;

  useEffect(() => {
    const handleScroll = () => {
      const top = ref.current?.getBoundingClientRect().top;
      const insetCoeff = isMobile ? 0.1 : 0.2;
      const insetValue = top ? -(top - stickyPosition) * insetCoeff : 0;
      if (top) {
        if (top - stickyPosition < 0) {
          const currInset = start + insetValue;
          if (currInset > start && currInset < MAX_INSET) {
            setInset(currInset);
          }
          if (currInset > MAX_INSET) {
            setInset(MAX_INSET);
          }
          if (currInset < start) {
            setInset(start);
          }
        }
        if (top < 0) {
          setFirstScreenOpacity(-top - 50 > 0 ? (-top - 50) * 0.005 : 0);
        }
        if (top < -300) {
          setSecondScreenOpacity(-top - 350 > 0 ? (-top - 350) * 0.006 : 0);
        }
        if (top < -600) {
          setThirdScreenOpacity(-top - 600 > 0 ? (-top - 600) * 0.006 : 0);
        }
      }
    };
    if (ref && inView) {
      window.addEventListener('scroll', handleScroll);
    }
    if (!inView) {
      window.removeEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref, inView]);

  return { inset, firstScreenOpacity, secondScreenOpacity, thirdScreenOpacity };
};
