import isEqual from 'lodash/isEqual';
import { useLayoutEffect, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

export const useWindowSize = (): Size => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateSize = () => {
      const next = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      setSize((prev) => (prev.height === next.height && prev.width === next.width ? prev : next));
      setSize((prev) => (isEqual(prev, next) ? prev : next));
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    return (): void => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return size;
};
