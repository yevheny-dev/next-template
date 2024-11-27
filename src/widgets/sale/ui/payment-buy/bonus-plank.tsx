import React, { FC, ReactNode } from 'react';

import styles from '../payment.module.scss';

interface Props {
  title: string;
  bonus: string;
  tip?: ReactNode;
}

export const BonusPlank: FC<Props> = ({ title, bonus, tip }) => {
  return (
    <div
      className="flex items-center justify-between py-[12px] px-[8px] rounded-[8px]"
      style={{ background: 'rgba(255, 255, 255, 0.02)' }}
    >
      <div className="flex items-center gap-[4px]">
        <span className={styles.title}>{title}</span>
        {tip}
      </div>
      <span className={styles.smallWhiteText}>{bonus}</span>
    </div>
  );
};
