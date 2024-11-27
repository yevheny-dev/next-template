import { noop } from 'lodash';
import React, { useState, useRef, ReactNode, FC } from 'react';

import './index.scss';

interface Props {
  children: ReactNode;
  title: ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  isHover?: boolean;
  width?: number;
  isMobile?: boolean;
}

export const Tooltip: FC<Props> = ({
  children,
  title,
  placement = 'top',
  delay = 1000,
  isHover,
  width = 290,
  isMobile = false,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<any>(null);

  const showTooltip = () => {
    setVisible(true);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }, delay);
  };

  return (
    <div
      className="tooltip-container"
      onClick={isHover ? noop : showTooltip}
      onMouseEnter={isHover ? () => setVisible(true) : noop}
      onMouseLeave={isHover ? () => setVisible(false) : noop}
    >
      {children}
      {visible && (
        <div
          style={{ width: width + 'px' }}
          className={`${isMobile ? 'tooltip-box-mobile' : 'tooltip-box'} tooltip-${placement}`}
          ref={tooltipRef}
        >
          {title}
        </div>
      )}
    </div>
  );
};
