import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app';
import {
  DEFAULT_NETWORK_FOR_FETCH,
  ETH_ADDRESS,
  MinExecutionGasByChain,
  SOL_MIN_GAS_AMOUNT,
} from '@/shared';

import {
  activeWalletSelector,
  bonusTokensAmountSelector,
  receiveTokenAmountSelector,
  setAssetAmount,
  setBoughtTokens,
  tokenSaleSelector,
} from '../../model';
import { formatAmount, isInfinityOrFalsy, onlyNumbers } from '../../utils/helpers';

import { PayField } from './pay-field';
import { ReceiveField } from './receive-field.tsx';

export const CryptoAmounts = () => {
  const dispatch = useAppDispatch();
  const { asset, assetAmount, maxInvestment, nowPaymentsState, selectedChain } =
    useAppSelector(tokenSaleSelector);
  const wallet = useAppSelector(activeWalletSelector);
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
      const editedValue = valueArray.join('');
      const price = nowPaymentsState ? 1 : asset?.price || 0;
      const isMaxInvestment = Number(onlyNumbers(editedValue)) * price > maxInvestment;
      dispatch(
        setAssetAmount(
          isMaxInvestment ? (maxInvestment / price).toString() : onlyNumbers(editedValue),
        ),
      );
    },
    [nowPaymentsState, asset?.price, dispatch, maxInvestment],
  );

  const setMaxTokenAmount = useCallback(() => {
    const price = asset?.price || 0;

    if (asset?.balance) {
      const balance =
        asset?.balance * price > maxInvestment
          ? maxInvestment / price
          : asset.address === ETH_ADDRESS
            ? Math.max(
                0,
                asset.balance -
                  MinExecutionGasByChain[wallet?.chainId || DEFAULT_NETWORK_FOR_FETCH],
              )
            : asset.balance;

      dispatch(
        setAssetAmount(
          asset?.symbol === 'SOL'
            ? `${balance - SOL_MIN_GAS_AMOUNT > 0 ? balance - SOL_MIN_GAS_AMOUNT : balance}`
            : `${balance}`,
        ),
      );
    }
  }, [asset, dispatch, maxInvestment, wallet?.chainId]);

  useEffect(() => {
    if (!isFocused) {
      if (receiveTokenAmount > 0) {
        dispatch(setBoughtTokens((receiveTokenAmount + (bonusTokens || 0)).toString()));
      }
    }
  }, [receiveTokenAmount, isFocused, bonusTokens, dispatch]);

  return (
    <div className="grid tabletSmall:grid-cols-2 gap-[8px]">
      <div className="flex flex-col">
        <PayField
          placeholder={nowPaymentsState ? 'Amount in USD' : 'Enter Amount'}
          value={nowPaymentsState ? (assetAmount ? '$ ' + assetAmount : assetAmount) : assetAmount}
          asset={selectedChain}
          onChange={handleAmountChange}
          setMax={!nowPaymentsState ? setMaxTokenAmount : undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
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
