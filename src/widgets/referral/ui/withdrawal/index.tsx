import React from 'react';

import { Button, GlobalChainId, Image, Typography } from '@/shared';
import { ReferralWidgetSpot } from '@/shared/ui/icons/referral-widget-spot.tsx';
import { useReferralWithdrawal } from '@/widgets/referral';
import { ChainSelect } from '@/widgets/referral/ui/chain-select';
import { Reward } from '@/widgets/referral/ui/reward';

export const Withdrawal = () => {
  const {
    claimable,
    activeChain,
    handleChange,
    chains,
    referralChain,
    isTrxInProgress,
    redeem,
    disableBtn,
    isInsufficientSolForGas,
    buttonLabel,
  } = useReferralWithdrawal();

  return (
    <div
      style={{ background: 'rgba(38, 39, 43, 0.42)' }}
      className={
        'w-full px-[20px] pt-[20px] pb-[22px] border border-borderMain rounded-[12px] relative'
      }
    >
      <Image
        className={'absolute top-[-110px] left-0 z-[-1] hidden laptop:block'}
        src={'/svg/referral-blur.svg'}
        lazy
      />
      <Image
        className={'absolute top-[-60px] left-0 hidden laptop:block'}
        src={'/svg/referral-particles.svg'}
        lazy
      />
      <ReferralWidgetSpot />
      <Image className={'absolute top-0 left-0'} src={'/svg/corner-light.svg'} lazy />
      <div className={'flex items-center justify-between mb-[16px] laptop:mb-[8px] gap-[50px]'}>
        <Typography.Title className={'!text-[24px]'}>Withdrawal rewards</Typography.Title>
        <div
          style={{ background: 'rgba(106, 86, 246, 0.16)' }}
          className={
            'flex flex-col items-center py-[8px] px-[12px] rounded-[6px] font-medium leading-[120%] capitalize'
          }
        >
          <span className={'text-[12px] laptop:text-[14px] text-typoMain'}>Available:</span>
          <span
            style={{ color: 'rgba(185, 192, 212, 0.64)' }}
            className={'text-[16px] laptop:text-[18px]'}
          >
            $ {claimable}
          </span>
        </div>
      </div>
      <span
        className={
          'text-[12px] laptop:text-[14px] text-typoMain font-semibold leading-[100%] capitalize'
        }
      >
        Select Chain
      </span>
      <div className={'mt-[10px] laptop:mt-[12px] mb-[16px] laptop:mb-[24px] relative z-[10]'}>
        <ChainSelect chains={chains} onChange={handleChange} activeChain={activeChain} />
      </div>
      {!!referralChain?.balances?.length && (
        <div className={'grid grid-cols-1 tablet:grid-cols-2 gap-[8px] laptop:gap-[12px]'}>
          {referralChain?.balances?.map((item, index) => {
            return <Reward key={index} item={item} />;
          })}
        </div>
      )}
      <Button
        size="48"
        fullWidth
        className="mt-[24px]"
        disabled={disableBtn || isInsufficientSolForGas}
        loading={isTrxInProgress}
        onClick={(): void =>
          redeem(
            referralChain?.chain as number,
            referralChain?.storages?.[0] as string,
            referralChain?.chain === GlobalChainId.solana ? referralChain?.balances : undefined,
          )
        }
      >
        <span className="text-[18px] leading-[160%]">{buttonLabel}</span>
      </Button>
    </div>
  );
};
