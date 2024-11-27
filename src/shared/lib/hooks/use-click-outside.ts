import { MouseEvent, RefObject, useCallback, useEffect } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: (e: MouseEvent) => void,
  skip?: boolean,
): void => {
  const handleClick = useCallback(
    (e: any) => {
      if (skip) return;
      if (ref.current && !ref.current?.contains(e.target as Node) && e.isTrusted) {
        callback(e);
      }
    },
    [callback, ref, skip],
  );

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return (): void => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);
};
