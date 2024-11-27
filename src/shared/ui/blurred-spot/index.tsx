// import classNames from 'classnames';
// import { throttle } from 'lodash';
// import React, { useRef, useEffect } from 'react';

// import useMousePosition from '@/shared/lib/hooks/use-movemove';

// import styles from './index.module.scss';

// export const BlurredSpot = () => {
//   const spotRef = useRef<HTMLDivElement>(null);
//   const position = useMousePosition();

//   const updatePosition = throttle(() => {
//     if (spotRef.current) {
//       const translateX = `${position.x - 20}px`;
//       const translateY = `${position.y - 20}px`;
//       spotRef.current.style.transform = `translate3d(${translateX}, ${translateY}, 0px)  scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`;
//     }
//   }, 500);

//   useEffect(() => {
//     updatePosition();
//   }, [position]);

//   return <div ref={spotRef} className={classNames(styles.blurredSpot, 'fixed')} />;
// };

import classNames from 'classnames';
import React, { useRef, useEffect } from 'react';

import { useMousePosition } from '@/shared';

import styles from './index.module.scss';

export const BlurredSpot = () => {
  const spotRef = useRef<HTMLDivElement>(null);
  const position = useMousePosition();

  useEffect(() => {
    if (spotRef.current) {
      const left = `${position.x - 20 - 100}px`;
      const top = `${position.y - 20 - 100}px`;
      spotRef.current.style.left = left;
      spotRef.current.style.top = top;
    }
  }, [position]);

  return <div ref={spotRef} className={classNames(styles.blurredSpot, 'fixed')} />;
};
