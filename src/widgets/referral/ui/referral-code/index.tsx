import React from 'react';

import { Button, CopyToClipboard, Loading } from '@/shared';
import { ReferralIcon } from '@/shared/ui/icons/referral-icon.tsx';
import { useReferralCode } from '@/widgets/referral';

export const ReferralCode = () => {
  const { referralLink, isReferralCodeLoading } = useReferralCode();

  return (
    <div
      style={{
        border: '1px solid rgba(255, 255, 255, 0.20)',
        background: 'rgba(106, 86, 246, 0.16)',
      }}
      className={'p-[16px] rounded-[12px]'}
    >
      <div className={'flex items-center gap-[8px] mb-[13px]'}>
        <ReferralIcon />
        <p className={'text-typoMain text-[14px] font-medium leading-[100%] capitalize'}>
          Invite Your Friend and Earn Rewards
        </p>
      </div>
      <div
        style={{ background: 'rgba(2, 1, 6, 0.42)' }}
        className={'p-[12px] flex items-center justify-between rounded-[10px]'}
      >
        <span className={'text-typoMain text-[16px] leading-[24px]'}>
          {isReferralCodeLoading ? (
            <Loading />
          ) : (
            referralLink || 'Connect your wallet to get the link'
          )}
        </span>
        {referralLink && !isReferralCodeLoading && (
          <CopyToClipboard text={referralLink || ''}>
            <Button variant={'primary'} size={'32'}>
              COPY
            </Button>
          </CopyToClipboard>
        )}
      </div>
    </div>
  );
};
