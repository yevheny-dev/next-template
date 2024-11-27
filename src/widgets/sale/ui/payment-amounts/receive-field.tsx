import React, { FC } from 'react';

import { Input, TOKEN_TICKER } from '@/shared';

import styles from '../payment.module.scss';

interface Props {
  value: string | number;
  placeholder?: string;
}

export const ReceiveField: FC<Props> = ({ value }) => {
  return (
    <div className="flex flex-col gap-[12px]">
      <label className={styles.label}>Receive</label>
      <div
        className="h-[64px] flex items-center gap-[12px] py-[12px] px-[8px] rounded-[8px]"
        style={{
          border: '1px solid #353438',
          background: 'rgba(2, 1, 6, 0.64)',
        }}
      >
        <Input className={'!text-[24px]'} value={value} placeholder={'0.00'} />
        <div
          className="flex items-center gap-[4px] p-[12px_12px_12px_8px] rounded-[35px] shrink-[0]"
          style={{ background: 'rgba(255, 255, 255, 0.08)' }}
        >
          <img className="w-[16px] h-[16px]" src={'/svg/sdx-outlined.svg'} alt={'sdx'} />
          <span className={styles.symbol}>{TOKEN_TICKER}</span>
        </div>
      </div>
    </div>
  );
};
