import React, { FC } from 'react';

import { useAppSelector } from '@/app';
import { blockchainType, Tooltip } from '@/shared';
import { CopyBtn } from '@/shared/ui/copy-btn';
import { InfoIcon } from '@/shared/ui/icons';

import { tokenSaleSelector } from '../../model';

export const DirectAddress: FC<{ evmAddress: string; solAddress: string }> = ({
  evmAddress,
  solAddress,
}) => {
  const { selectedChain } = useAppSelector(tokenSaleSelector);
  const isEvm = selectedChain.blockchainType === blockchainType.EVM;
  return (
    <div className={'flex items-center'}>
      <div
        style={{
          borderRadius: '100%',
          background: 'rgba(255, 255, 255, 0.06)',
        }}
        className="flex items-center justify-center w-[32px] h-[32px] mr-[8px] shrink-[0]"
      >
        <Tooltip title="design not ready" isHover>
          <InfoIcon />
        </Tooltip>
      </div>
      <div className="mr-[18px]">
        <span className={'text-white text-[16px] font-[600] leading-[100%] uppercase break-all'}>
          {isEvm ? evmAddress : solAddress}
        </span>
      </div>
      <CopyBtn text={isEvm ? evmAddress : solAddress} />
    </div>
  );
};
