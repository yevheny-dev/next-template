import React from 'react';

import { useAppSelector } from '@/app';
import { PaymentType, tokenSaleSelector } from '@/widgets';

import { CryptoAmounts } from './crypto-amounts';
import { FiatAmounts } from './fiat-amounts';

export const PaymentAmounts = () => {
  const { currentPaymentType } = useAppSelector(tokenSaleSelector);
  return (
    <div className="mt-[16px] relative z-[2]">
      {currentPaymentType === PaymentType.CRYPTO ? <CryptoAmounts /> : <FiatAmounts />}
    </div>
  );
};
