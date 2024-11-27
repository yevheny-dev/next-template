import React, { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/app';
import { BonusProgress } from '@/shared';
import { Stars } from '@/shared/ui/icons/stars.tsx';
import { formatAmount } from '@/widgets/sale/utils/helpers.tsx';

import { PaymentType, setCurrentBonusIndex, tokenSaleSelector } from '../../model';
import styles from '../payment.module.scss';

export const PaymentBonus = () => {
  const {
    asset,
    fiat,
    currentPaymentType,
    assetAmount,
    buyBonusesInfo,
    currentBonusIndex,
    selectedChain,
  } = useAppSelector(tokenSaleSelector);

  const dispatch = useAppDispatch();
  const textClass = 'font-semibold text-[12px] laptop:text-[14px] leading-[100%] text-[#B9C0D4]';

  const [maxBonusApplied, assetNeeded] = useMemo(() => {

    const assetPrice =
      (currentPaymentType === PaymentType.CRYPTO ? asset?.price : fiat?.price) || 1;

    const assetAmountUsd = Number(assetAmount) * Number(assetPrice);
    const maxBonusUsd = Number(buyBonusesInfo?.thresholds.at(-1));

    let currBonusIndex =
      buyBonusesInfo?.thresholds?.findIndex((el, index) => {
        return (
          el <= assetAmountUsd &&
          assetAmountUsd < (buyBonusesInfo?.thresholds[index + 1] || 1_000_000)
        );
      }) || 0;

    currBonusIndex = currBonusIndex === -1 ? 0 : currBonusIndex;

    dispatch(setCurrentBonusIndex(currBonusIndex));

    const maxBonusApplied = assetAmountUsd >= maxBonusUsd;
    const usdNeeded = maxBonusApplied
      ? 0
      : Math.max(
          (Number(buyBonusesInfo?.thresholds.at(currBonusIndex + 1)) || 0) - assetAmountUsd,
          0,
        );

    const assetNeeded = maxBonusApplied
      ? 0
      : usdNeeded / (assetPrice || 1) ||
        (assetPrice === 1
          ? 0
          : (Number(buyBonusesInfo?.thresholds.at(currBonusIndex + 1)) || 1) / (assetPrice || 1));

    return [maxBonusApplied, assetNeeded];
  }, [dispatch, assetAmount, asset, fiat, buyBonusesInfo, currentPaymentType]);

  const bonusValues = useMemo(() => {
    if (!buyBonusesInfo?.thresholds?.length && !buyBonusesInfo?.percents?.length) return [];
    const values = [];
    for (let i = 0; i < buyBonusesInfo?.thresholds.length; i++) {
      values.push({
        percentage: Number(buyBonusesInfo?.percents[i]),
        value: Number(buyBonusesInfo?.thresholds[i]),
      });
    }
    return values;
  }, [buyBonusesInfo]);

  return (
    <div className={styles.bonusBlock}>
      <span className={styles.title}>Purchase booster</span>
      <div className={styles.wrapper}>
        <BonusProgress values={bonusValues} currentStep={currentBonusIndex} />
        <div
          className={
            'flex flex-col laptop:flex-row gap-[7px] laptop:items-center laptop:justify-between'
          }
        >
          <p className={`${textClass} flex items-center gap-[5px]`}>
            <Stars /> You will{' '}
            <span className={'text-white'}>
              get {bonusValues?.[currentBonusIndex]?.percentage}% bonus
            </span>{' '}
            for this purchase
          </p>
          {!maxBonusApplied && (
            <p className={`${textClass} flex items-center gap-[5px]`}>
              <Stars color={'#6A56F6'} /> Invest another {formatAmount(assetNeeded)}{' '}
              {selectedChain?.nowPaymentsId ? 'USD' : selectedChain.symbol} to{' '}
              <span className={'text-white'}>
                get a {bonusValues?.[currentBonusIndex + 1]?.percentage}% bonus
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
