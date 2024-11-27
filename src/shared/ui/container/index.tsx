import classNames from 'classnames';
import React, { ReactNode } from 'react';

export const Container = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={classNames('max-w-[1280px] w-full px-[16px] mx-auto relative', className)}>
      {children}
    </div>
  );
};
