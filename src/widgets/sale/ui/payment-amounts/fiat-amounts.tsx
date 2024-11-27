import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app';
import { FiatsList } from '@/shared';

import {
  bonusTokensAmountSelector,
  receiveTokenAmountSelector,
  setAssetAmount,
  setBoughtTokens,
  tokenSaleSelector,
} from '../../model';
import { formatAmount, isInfinityOrFalsy, onlyNumbers } from '../../utils/helpers';

import { PayField } from './pay-field';
import { ReceiveField } from './receive-field';

export const FiatAmounts = () => {
  const dispatch = useAppDispatch();
  const { fiat, assetAmount, maxInvestment } = useAppSelector(tokenSaleSelector);
  const receiveTokenAmount = useAppSelector(receiveTokenAmountSelector);
  const bonusTokens = useAppSelector(bonusTokensAmountSelector);
  const [isFocused, setIsFocused] = useState(false);

  const handleAmountChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      const valueArray = target.value?.split('');
      if (valueArray.length > 1 && valueArray[0] === '0' && valueArray[1] !== '.') {
        valueArray.splice(0, 1);
      }
      if (valueArray.length === 1 && valueArray[0] === '.') {
        valueArray.splice(0, 0, '0');
      }
      const price = fiat?.price || 0;
      const editedValue = valueArray.join('');
      const isMaxInvestment = Number(onlyNumbers(editedValue)) * price > maxInvestment;
      dispatch(
        setAssetAmount(
          isMaxInvestment ? (maxInvestment / price).toString() : onlyNumbers(editedValue),
        ),
      );
    },
    [fiat, dispatch, maxInvestment],
  );

  useEffect(() => {
    if (!isFocused) {
      if (receiveTokenAmount > 0) {
        dispatch(setBoughtTokens((receiveTokenAmount + (bonusTokens || 0)).toString()));
      }
    }
  }, [receiveTokenAmount, isFocused, bonusTokens, dispatch]);

  return (
    <div className="grid grid-cols-2 gap-[8px]">
      <PayField
        placeholder={'Enter Amount'}
        value={assetAmount}
        asset={fiat || FiatsList[0]}
        onChange={handleAmountChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <ReceiveField
        value={
          !isInfinityOrFalsy(receiveTokenAmount)
            ? formatAmount(receiveTokenAmount, false, 2, true)
            : ''
        }
      />
    </div>
  );
};
