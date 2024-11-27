import classNames from 'classnames';
import React, { ReactNode } from 'react';

import style from './components.module.scss';

interface TypographyProps {
  children: string | ReactNode;
  className?: string;
}

export const Title = ({ children, className }: TypographyProps) => {
  return (
    <h2
      className={classNames(
        className,
        style.title,
        'text-[28px] laptop:text-[48px] font-semibold leading-[110%] tracking-[0.56px] laptop:tracking-[1.12px]',
      )}
    >
      {children}
    </h2>
  );
};

export const Article = ({ children, className }: TypographyProps) => {
  return (
    <p
      className={classNames(
        'text-typoMain text-[14px] laptop:text-[18px] leading-[140%] tracking-[0.28px] laptop:tracking-[0.36px]',
        className,
      )}
    >
      {children}
    </p>
  );
};
