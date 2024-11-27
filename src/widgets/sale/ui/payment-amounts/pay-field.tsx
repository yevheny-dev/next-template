import React, { FC } from 'react';

import { useAppSelector } from '@/app';
import { Button, Input, CryptoCurrency } from '@/shared';
import { FiatCurrency, tokenSaleSelector } from '@/widgets';

import styles from '../payment.module.scss';

interface Props {
  value: string;
  placeholder: string;
  asset: CryptoCurrency | FiatCurrency;
  onChange: (...args: any[]) => void;
  setMax?: (...args: any[]) => void;
  onFocus?: (...args: any[]) => void;
  onBlur?: (...args: any[]) => void;
}

export const PayField: FC<Props> = ({
  asset,
  value,
  placeholder,
  setMax,
  onChange,
  onFocus,
  onBlur,
}) => {
  const { isTrxInProgress } = useAppSelector(tokenSaleSelector);

  return (
    <div className="flex flex-col gap-[12px]">
      <label className={styles.label}>You Pay</label>
      <div
        className="h-[64px] flex items-center gap-[8px] py-[12px] px-[8px] rounded-[8px]"
        style={{
          border: '1px solid #353438',
          background: 'rgba(2, 1, 6, 0.64)',
        }}
      >
        <div
          className="flex items-center gap-[6px] p-[7px_12px_7px_7px] rounded-[35px] shrink-[0]"
          style={{ background: 'rgba(255, 255, 255, 0.08)' }}
        >
          <img className={'w-[26px] h-[26px]'} src={asset.icon} alt={asset.name} />
          <span className={styles.symbol}>{asset.symbol}</span>
        </div>
        <Input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder || 'Enter Amount'}
          disabled={isTrxInProgress}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {!!setMax && (
          <Button
            onClick={setMax}
            className="uppercase ml-auto"
            style={{ borderRadius: '35px', paddingInline: '12px', fontWeight: 600 }}
            size={'32'}
          >
            MAX
          </Button>
        )}
      </div>
    </div>
  );
};
