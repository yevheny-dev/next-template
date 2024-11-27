import React from 'react';

import { RewardToken } from '@/widgets';
import { formatReward } from '@/widgets/sale/utils/helpers.tsx';

export const Reward = ({ item }: { item: RewardToken }) => {
  const textClasses = 'text-white text-[14px] text-right font-semibold leading-[100%]';
  return (
    <div
      style={{
        background:
          'linear-gradient(91deg, rgba(255, 255, 255, 0.08) 41.92%, rgba(255, 255, 255, 0.04) 98.97%)',
      }}
      className="py-[12px] pl-[12px] pr-[10px] laptop:pr-[16px] rounded-[8px]"
    >
      <div className="flex justify-between w-full">
        <div className="flex gap-[6px] items-center">
          <div className="max-w-[26px] max-h-[26px] overflow-hidden child-full">
            <img src={item?.icon} alt={item?.symbol} />
          </div>
          <div className={textClasses}>
            <p>{item?.symbol}</p>
          </div>
        </div>

        <div className="text-right flex flex-col justify-center">
          <p style={{ color: 'rgba(185, 192, 212, 0.64)' }} className={textClasses}>
            {item.balance < 1 ? item.balance : formatReward(item.balance, true)}
          </p>
          <p style={{ color: 'rgba(185, 192, 212, 0.42)' }} className={textClasses}>
            ${item.usdBalance < 1 ? item.usdBalance : formatReward(item.usdBalance, true)}
          </p>
        </div>
      </div>
    </div>
  );
};
