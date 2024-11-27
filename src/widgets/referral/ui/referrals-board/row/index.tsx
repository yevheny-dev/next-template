import React from 'react';

import {
  CopyToClipboard,
  formatDateToLocaleUS,
  formatTimeToLocaleUS,
  roundValue,
  TOKEN_TICKER,
  useIsMobile,
} from '@/shared';
import { CopyIcon } from '@/shared/ui/icons/copy-icon.tsx';
import { PurchaseHistoryItem } from '@/widgets';
import { cutAddressSmall, formatAmount, getChainIcon } from '@/widgets/sale/utils/helpers.tsx';

export const Row = ({ item }: { item: PurchaseHistoryItem }) => {
  const isMobile = useIsMobile();
  const textClasses = 'text-typoMain text-[14px] font-semibold leading-[100%] capitalize ';
  const colClasses = 'flex-[1_0_0] flex items-center ';
  const secondaryColor = 'rgba(185, 192, 212, 0.42)';

  const renderDesktopRow = () => {
    return (
      <div
        style={{ background: 'rgba(255, 255, 255, 0.02)' }}
        className={'p-[12px] flex rounded-[8px]'}
      >
        <div className={colClasses + 'gap-[6px]'}>
          <span className={textClasses + 'underline'}>{cutAddressSmall(item.purchaser, 6, 4)}</span>
          <span
            style={{ background: 'rgba(255, 255, 255, 0.04)' }}
            className={'p-[8px] rounded-[8px]'}
          >
            <CopyToClipboard text={item.purchaser}>
              <CopyIcon />
            </CopyToClipboard>
          </span>
        </div>
        <div className={colClasses + 'gap-[4px]'}>
          <span className={textClasses}>{formatDateToLocaleUS(item.timestamp)}</span>
          <span style={{ color: secondaryColor }} className={textClasses}>
            {formatTimeToLocaleUS(item.timestamp)}
          </span>
        </div>
        <div className={colClasses + 'gap-[6px]'}>
          {getChainIcon(item.chain)}
          <span className={textClasses}>
            {formatAmount(item.investment, false, 2)}{' '}
            <span style={{ color: secondaryColor }}>{item.collateral.symbol}</span>
          </span>
        </div>
        <div className={colClasses}>
          <span className={textClasses}>${item.price}</span>
        </div>
        <div className={colClasses + 'justify-end'}>
          <span className={textClasses}>
            ${roundValue(item.usdEarned as number)}{' '}
            <span className={'text-[#6A56F6]'}>
              + {formatAmount(item.tokensEarned as number, false, 2, true)} ${TOKEN_TICKER}
            </span>
          </span>
        </div>
      </div>
    );
  };

  const renderMobileRow = () => {
    const rowMobClasses = 'flex justify-between items-center py-[4px]';
    return (
      <div
        style={{ background: 'rgba(255, 255, 255, 0.02)' }}
        className={'flex flex-col gap-[12px] p-[11px] rounded-[8px] border border-borderMain'}
      >
        <div
          style={{ background: 'rgba(106, 86, 246, 0.12)' }}
          className={
            'p-[11px] flex justify-center items-center gap-[8px] border border-borderMain rounded-[8px]'
          }
        >
          <span className={textClasses + 'underline'}>{cutAddressSmall(item.purchaser, 6, 4)}</span>
          <span
            style={{ background: 'rgba(255, 255, 255, 0.04)' }}
            className={'p-[8px] rounded-[8px]'}
          >
            <CopyToClipboard text={item.purchaser}>
              <CopyIcon />
            </CopyToClipboard>
          </span>
        </div>
        <div className={'flex flex-col gap-[8px] w-full'}>
          <div className={rowMobClasses}>
            <span style={{ color: secondaryColor }} className={textClasses}>
              Invested
            </span>
            <div className={'flex items-center gap-[6px]'}>
              {getChainIcon(item.chain)}
              <span className={textClasses}>
                {formatAmount(item.investment, false, 2)}{' '}
                <span style={{ color: secondaryColor }}>{item.collateral.symbol}</span>
              </span>
            </div>
          </div>
          <div className={rowMobClasses}>
            <span style={{ color: secondaryColor }} className={textClasses}>
              Amount
            </span>
            <span className={textClasses}>${item.price}</span>
          </div>
          <div className={rowMobClasses}>
            <span style={{ color: secondaryColor }} className={textClasses}>
              Rewards
            </span>
            <span className={textClasses}>
              ${roundValue(item.usdEarned as number)}{' '}
              <span className={'text-[#6A56F6]'}>
                + {formatAmount(item.tokensEarned as number, false, 2, true)} ${TOKEN_TICKER}
              </span>
            </span>
          </div>
          <div className={rowMobClasses}>
            <span style={{ color: secondaryColor }} className={textClasses}>
              Date
            </span>
            <div className={'flex items-center gap-[4px]'}>
              <span className={textClasses}>{formatDateToLocaleUS(item.timestamp)}</span>
              <span style={{ color: secondaryColor }} className={textClasses}>
                {formatTimeToLocaleUS(item.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return isMobile ? renderMobileRow() : renderDesktopRow();
};
