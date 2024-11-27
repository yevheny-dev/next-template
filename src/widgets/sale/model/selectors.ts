import { createSelector } from 'reselect';

import { RootState } from '@/app/store';

import { NetworkName, PaymentType, TokenSaleState, VestingPlan } from './types';
import { isInfinityOrFalsy } from '../utils/helpers';

export const tokenSaleSelector = (state: Partial<RootState>): TokenSaleState =>
  state.sale as TokenSaleState;

export const selectedAssetPriceSelector = createSelector(
  [tokenSaleSelector],
  ({ asset, fiat, currentPaymentType, assetAmount, nowPaymentsState }) => {
    return nowPaymentsState
      ? 1 * Number(assetAmount)
      : ((currentPaymentType === PaymentType.FIAT ? fiat?.price : asset?.price) || 0) *
          Number(assetAmount);
  },
);

export const receiveTokenAmountSelector = createSelector(
  [tokenSaleSelector, selectedAssetPriceSelector],
  ({ currentRoundPriceShort, currentRoundPriceLong, vestingPlan }, assetPrice) => {
    const amount =
      Math.floor(
        (assetPrice /
          (vestingPlan === VestingPlan.Long ? currentRoundPriceLong : currentRoundPriceShort)) *
          1000,
      ) / 1000;

    return !isInfinityOrFalsy(amount) ? amount : 0;
  },
);

export const bonusTokensAmountSelector = createSelector(
  [tokenSaleSelector, receiveTokenAmountSelector],
  ({ buyBonusesInfo, currentBonusIndex }, receiveTokenAmount) => {
    const selectedPercent = Number(buyBonusesInfo?.percents?.at(currentBonusIndex));
    if (selectedPercent === 0) {
      return 0;
    }

    const amount = (selectedPercent / 100) * Number(receiveTokenAmount);

    return !isInfinityOrFalsy(amount) ? amount : 0;
  },
);

export const activeWalletSelector = createSelector(
  [tokenSaleSelector],
  ({ wallets }) => wallets?.find((w) => w.selected) || wallets?.[0],
);

export const evmWalletSelector = createSelector(
  [tokenSaleSelector],
  ({ wallets }) => wallets?.find((w) => w.networkName === NetworkName.evm) || null,
);

export const solanaWalletSelector = createSelector(
  [tokenSaleSelector],
  ({ wallets }) => wallets?.find((w) => w.networkName === NetworkName.solana) || null,
);
