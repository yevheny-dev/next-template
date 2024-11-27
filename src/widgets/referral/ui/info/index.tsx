import React from 'react';

import { Button, Image, TOKEN_TICKER, Tooltip, Typography } from '@/shared';
import { CopyBtn } from '@/shared/ui/copy-btn';
import { InfoIcon } from '@/shared/ui/icons/info.tsx';
import { ReferralCodeSpot } from '@/shared/ui/icons/referral-code-spot.tsx';
import { useReferralCode, useReferralInfo } from '@/widgets/referral';
import { ExternalWalletState } from '@/widgets/referral/ui/external-wallets-state';
import { ReferralCode } from '@/widgets/referral/ui/referral-code';
import { TgBotBlock } from '@/widgets/referral/ui/tg-bot-block';
import { cutAddressSmall, formatAmount } from '@/widgets/sale/utils/helpers';

export const Info = () => {
  const { collateralPercent, tokenPercent, instantlyEarned, earnedInToken } = useReferralInfo();
  const { referralLink, isReferralCodeLoading } = useReferralCode();

  const roundedBorderClass = 'rounded-[12px] border border-borderMain';

  const earnedInfo = [
    {
      label: 'USD earned',
      value: instantlyEarned || 0,
      percentage: collateralPercent + '%',
      info: 'Total amount of rewards you’ve earned in the cryptocurrency that your referral used for their purchase',
    },
    {
      label: `$${TOKEN_TICKER} earned`,
      value: earnedInToken || 0,
      percentage: tokenPercent + '%',
      info: `Total amount of $${TOKEN_TICKER} you will be awarded at the TGE for inviting referrals`,
    },
  ];

  return (
    <div className={'flex flex-col gap-[16px] laptop:gap-[16px] w-full laptop:min-w-[627px]'}>
      <div className={'flex flex-col laptop:flex-row laptop:mb-[6px] relative'}>
        {earnedInfo.map(({ label, value, info, percentage }, idx) => (
          <div
            key={label}
            className={`${roundedBorderClass} px-[16px] laptop:px-[20px] pt-[19px] pb-[12px] laptop:py-[20px] border-b-transparent flex-[0_1_50%] flex items-center justify-between`}
          >
            <div>
              <div className={'flex items-center gap-[4px] mb-[26px]'}>
                <span className={'text-typoMain text-[14px] font-medium leading-[100%] capitalize'}>
                  {label}
                </span>
                {info && (
                  <Tooltip isHover title={info}>
                    <InfoIcon />
                  </Tooltip>
                )}
              </div>
              <span
                style={{ color: 'rgba(185, 192, 212, 0.64)' }}
                className={'text-[24px] font-semibold leading-[100%] capitalize'}
              >
                {idx === 0 && '$ '}
                {formatAmount(value, false, 2, true)}
              </span>
            </div>
            <div
              className={'rounded-[6px] p-[10px]'}
              style={{ background: 'rgba(106, 86, 246, 0.16)' }}
            >
              <span
                className={
                  'text-[#6A56F6] text-[24px] laptop:text-[36px] font-semibold leading-[110%] tracking-[-0.48px] laptop:tracking-[-0.72px] capitalize'
                }
              >
                {percentage}
              </span>
            </div>
          </div>
        ))}
        <div
          style={{
            background: 'linear-gradient(0deg, #020106 24.42%, rgba(2, 1, 6, 0.00) 100%)',
          }}
          className={'absolute bottom-[-10px] w-full h-[50px]'}
        ></div>
      </div>
      {referralLink && <TgBotBlock />}
      <div
        style={{ background: 'rgba(38, 39, 43, 0.32)' }}
        className={`p-[12px] laptop:p-[20px] relative overflow-hidden ${roundedBorderClass}`}
      >
        <Typography.Title
          className={'!text-[16px] laptop:!text-[20px] !tracking-normal mb-[16px] capitalize'}
        >
          Your wallets for receiving rewards
        </Typography.Title>
        <div className={'flex flex-col laptop:flex-row gap-[8px] mb-[16px] laptop:mb-[20px]'}>
          <div className={'flex-[0_1_50%]'}>
            <ExternalWalletState type={'evm'} />
          </div>
          <div className={'flex-[0_1_50%]'}>
            <ExternalWalletState type={'sol'} />
          </div>
        </div>
        <ReferralCodeSpot />
        <Image
          className={'absolute top-0 right-0 rotate-90 z-[-1]'}
          src={'/svg/corner-light.svg'}
          lazy
        />
        <ReferralCode />
      </div>
    </div>
  );
};
