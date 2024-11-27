import React, { ReactNode } from 'react';

import style from './index.module.scss';

export const MovedBorderSpot = ({ children }: { children: ReactNode }) => {
  return (
    <div className={'relative p-[2.5px] rounded-[30px] overflow-hidden'}>
      <div className={style.borderSpot}></div>
      {children}
    </div>
  );
};
