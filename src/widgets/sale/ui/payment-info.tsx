import classNames from 'classnames';
import numeral from 'numeral';
import React, { memo, useMemo } from 'react';

import { useAppSelector } from '@/app';
import { CurrentUiRound, RaiseGoal, Timer, TOKEN_TICKER } from '@/shared';
import { CircleIcon, LightBorder, LightCorner } from '@/shared/ui/icons';
import { ProgressBar } from '@/shared/ui/progress-bar';

import { tokenSaleSelector } from '../model';
import { formatAmount } from '../utils/helpers';

import styles from './payment.module.scss';

export const PaymentInfo = memo(() => {
  const withRound = false;

  const {
    currentRoundActive,
    isLoadingSoldTokens,
    isClosed,
    saleConfig,
    raiseUsdGoalAmount,
    raisedUsdAmount,
    currentRoundPriceShort,
    nextRoundPrice,
    buyBonusesInfo,
    currentBonusIndex,
    totalPurchased,
  } = useAppSelector(tokenSaleSelector);

  const totalUsdSupply = raiseUsdGoalAmount || RaiseGoal;
  const totalUsdSold = raisedUsdAmount || 0;

  const round = saleConfig?.roundIndex || CurrentUiRound;

  const roundProgressMarks = useMemo(() => {
    if (isClosed) {
      const finalAmount = '$' + numeral(totalUsdSupply).format('0,0');
      return [finalAmount, withRound ? `10/10` : null, finalAmount];
    }

    const hideZeros = isLoadingSoldTokens && totalUsdSupply === 0;
    if (hideZeros) {
      return ['', `${round}/10`, ''];
    }

    return [
      '$' +
        numeral(currentRoundActive || isLoadingSoldTokens ? totalUsdSold : totalUsdSupply).format(
          '0,0',
        ),
      withRound ? `${round}/10` : null,
      '$' + numeral(totalUsdSupply).format('0,0'),
    ];
  }, [
    isClosed,
    isLoadingSoldTokens,
    totalUsdSupply,
    currentRoundActive,
    totalUsdSold,
    withRound,
    round,
  ]);

  const percent = isClosed
    ? 100
    : currentRoundActive || isLoadingSoldTokens
      ? (totalUsdSold / totalUsdSupply) * 100
      : 100;

  const isLoading = !saleConfig || isLoadingSoldTokens || (!currentRoundActive && !isClosed);

  const prices = useMemo(() => {
    return [
      { name: 'Price', price: currentRoundPriceShort },
      { name: 'My Balance', price: totalPurchased },
    ];
  }, [currentRoundPriceShort, nextRoundPrice, totalPurchased]);

  const lastPercentValue = buyBonusesInfo?.percents?.at(currentBonusIndex + 1);

  return (
    <div className={classNames(styles.wrapper, 'py-[16px] px-[12px] flex flex-col relative')}>
      <div className={'absolute right-0 top-0 rotate-90'}>
        <LightCorner />
        <LightBorder />
      </div>
      <div className={classNames(styles.wrapperInner, 'mb-[16px]')}>
        <h5 className={classNames(styles.title, 'mb-[8px]')}>Before Price Increase</h5>
        <Timer style={{ padding: '12px 4px' }} till={saleConfig?.roundEndDate} />
      </div>
      <div className={classNames(styles.wrapperInner, 'mb-[4px]')}>
        <h5 className={classNames(styles.title, 'mb-[12px]')}>USD Raised</h5>
        <ProgressBar percent={isLoading ? 0 : percent} />
        {!isLoading && roundProgressMarks.length > 2 && (
          <p
            className={
              'mt-[8px] w-full flex items-center justify-between text-white font-[600] text-[14px] uppercase'
            }
          >
            <span>{roundProgressMarks[0]}</span>
            <span>{roundProgressMarks[2]}</span>
          </p>
        )}
      </div>
      {prices.map((item, index) => (
        <div key={index} className={classNames(styles.wrapperInner, 'mb-[4px]')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[6px]">
              <img className="max-w-[16px]" src="/svg/stars.svg" alt="price" />
              <span className="text-[#B9C0D4] text-[14px] font-[600] capitalize">{item.name}</span>
            </div>
            {item.name == 'Price' ? (
              <div className="flex items-center gap-[6px]">
                <img className="max-w-[20px]" src="/svg/assets/sdx.svg" alt="price" />
                <span className="text-[#fff] text-[14px] font-[600] capitalize">
                  1 ${TOKEN_TICKER} <span className="text-[#70707B]">=</span> ${item.price}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-[6px]">
                <img className="max-w-[20px]" src="/svg/assets/sdx.svg" alt="price" />
                <span className="text-[#fff] text-[14px] font-[600] capitalize">
                  {formatAmount(item.price, false, 2, true)} ${TOKEN_TICKER}{' '}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="relative h-[108px] w-full laptop:mt-auto mt-[34px] flex items-center justify-center z-[2]">
        <img className="absolute top-[-50%]" src="/svg/particles.svg" alt="[]" />
        <img
          className="absolute inset-[0_0_0_0] max-h-[100%] w-full"
          src="/svg/back-bonus.svg"
          alt="[]"
        />
        <div
          className="absolute top-[0%] w-[291px] h-[53px]"
          style={{
            borderRadius: '291px',
            background: 'rgba(106, 86, 246, 0.36)',
            filter: 'blur(44px)',
          }}
        ></div>
        <div className="flex items-center justify-center flex-col gap-[8px] h-full w-full relative z-[2] py-[16px] px-[10px] tabletSmall:px-[38px]">
          {lastPercentValue ? (
            <div className="flex items-center gap-[8px]">
              <span
                className="text-[32px] font-[600] leading-[100%]"
                style={{ color: 'rgba(185, 192, 212, 0.40)' }}
              >
                {buyBonusesInfo?.percents?.at(currentBonusIndex)}%
              </span>
              <CircleIcon />
              <span className="text-[32px] font-[600] leading-[100%] text-white">
                {lastPercentValue}%
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-[8px]">
              <span className="text-[32px] font-[600] leading-[100%] text-white">
                {buyBonusesInfo?.percents?.at(currentBonusIndex)}%
              </span>
            </div>
          )}
          {lastPercentValue ? (
            <p className="text-center text-[14px] text-[#B9C0D4] text-[14px] font-[500] leading-[130%]">
              Invest more than {buyBonusesInfo?.thresholds?.at(currentBonusIndex + 1)}$<br />
              to get {lastPercentValue}% <span className="text-white">bonus</span>
            </p>
          ) : (
            <p className="text-center text-[14px] text-[#B9C0D4] text-[14px] font-[500] leading-[130%]">
              You will get {buyBonusesInfo?.percents?.at(currentBonusIndex)}%{' '}
              <span className="text-white">bonus</span> for this purchase
            </p>
          )}
        </div>
      </div>
      <div
        style={{
          background: 'linear-gradient(0deg, #020106 24.42%, rgba(2, 1, 6, 0.00) 100%)',
          pointerEvents: 'none',
        }}
        className={'absolute h-[96px] inset-[auto_-1px_-10px_-1px]'}
      ></div>
    </div>
  );
});

PaymentInfo.displayName = 'PaymentInfo';
