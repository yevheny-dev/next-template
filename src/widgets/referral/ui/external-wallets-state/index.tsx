import React from 'react';

import { Button, CopyToClipboard, Image } from '@/shared';
import { ExternalWalletType, useExternalWallets } from '@/widgets/referral';
import { cutAddressSmall } from '@/widgets/sale/utils/helpers.tsx';

const icons = {
  evm: '/svg/assets/eth.svg',
  sol: '/svg/assets/sol.svg',
};
const labels = {
  evm: 'evm wallet',
  sol: 'solana wallet',
};
export const ExternalWalletState = ({ type }: { type: ExternalWalletType }) => {
  const { address, btnLabel, onButtonClick, isLoadingAddWallet, isReferralCodeLoading } =
    useExternalWallets(type);

  const renderButton = () => {
    if (address) {
      return (
        <div className={'ml-auto'}>
          <CopyToClipboard text={address}>
            <Button style={{ color: '#FFFFFF', width: '112px' }} size={'40'} variant={'outline'}>
              Copy
            </Button>
          </CopyToClipboard>
        </div>
      );
    }
    return (
      <Button
        loading={isLoadingAddWallet || isReferralCodeLoading}
        disabled={isLoadingAddWallet || isReferralCodeLoading}
        onClick={onButtonClick}
        className={'ml-auto capitalize'}
        style={{ width: '112px' }}
        size={'40'}
      >
        {btnLabel}
      </Button>
    );
  };
  return (
    <div
      style={{ border: '1px solid rgba(255, 255, 255, 0.12)' }}
      className={
        'pl-[7px] laptop:pl-[9px] py-[5px] pr-[5px] rounded-[42px] bg-[#020106] backdrop-blur-[12px] flex items-center gap-[6px]'
      }
    >
      <Image style={{ width: '32px' }} src={icons[type]} lazy />
      <span
        style={{ color: address ? '#B9C0D4' : 'rgba(185, 192, 212, 0.64)' }}
        className={'text-[14px] laptop:text-[16px] leading-[24px] capitalize'}
      >
        {address ? cutAddressSmall(address, 5, 2) : labels[type]}
      </span>
      {renderButton()}
    </div>
  );
};
