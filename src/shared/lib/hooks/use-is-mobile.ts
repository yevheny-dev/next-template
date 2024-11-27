import { useWindowSize } from './use-window-size.ts';

export const useIsMobile = (): boolean => {
  const { width } = useWindowSize();
  return width < 768;
};

export const useIsTablet = (): boolean => {
  const { width } = useWindowSize();
  return width < 992;
};
