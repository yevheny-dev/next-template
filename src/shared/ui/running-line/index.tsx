import classNames from 'classnames';
import React, { FC, ReactNode, useState } from 'react';

type RunningLineProps = {
  children: ReactNode;
  className?: string;
  gapClass?: string;
  repeat?: number;
  direction?: 'right' | 'left';
  duration?: number;
  isPauseOnHover?: boolean;
};

export const RunningLine: FC<RunningLineProps> = ({
  children,
  duration = 30,
  direction = 'left',
  repeat = 2,
  className,
  gapClass = 'gap-[16px] laptop:gap-[32px]',
  isPauseOnHover = false,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const lineClasses = 'flex flex-row flex-nowrap relative z-[1] ' + gapClass;
  const sliderClasses = 'inline-flex flex-nowrap ' + gapClass;
  const animSettings = {
    animationName: 'slide',
    animationDuration: `${duration}s`,
    animationDirection: direction === 'left' ? 'initial' : 'reverse',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationPlayState: isPaused ? 'paused' : 'running',
  };

  const togglePause = (pause: boolean) => isPauseOnHover && setIsPaused(pause);

  return (
    <div
      className={classNames(lineClasses, className)}
      onMouseEnter={() => togglePause(true)}
      onMouseLeave={() => togglePause(false)}
    >
      {Array.from({ length: repeat }).map((_, index) => (
        <div key={index} style={animSettings} className={sliderClasses}>
          {children}
        </div>
      ))}
    </div>
  );
};
