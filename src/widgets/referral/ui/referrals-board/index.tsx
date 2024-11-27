import classNames from 'classnames';
import React from 'react';

import { useAppSelector } from '@/app';
import { Image, TableLoadingState, useIsMobile } from '@/shared';
import { usePagination } from '@/shared/lib/hooks/use-pagination.ts';
import { ReferralCodeSpot } from '@/shared/ui/icons/referral-code-spot.tsx';
import { Pagination } from '@/shared/ui/pagination';
import { useReferralList } from '@/widgets/referral';
import { Row } from '@/widgets/referral/ui/referrals-board/row';
import { activeWalletSelector } from '@/widgets/sale';

import EmptyReferral from './assets/emptyStateReferral.svg';

const columns: string[] = ['Address', 'Date', 'Invested', 'Price', 'Your Rewards'];

export const ReferralsBoard = () => {
  const isMobile = useIsMobile();
  const { items, isLoading } = useReferralList();
  const wallet = useAppSelector(activeWalletSelector);

  const itemsPerPage = 7;

  const { currentPage, totalPages, currentPageItems, nextPage, prevPage, setPage } = usePagination(
    items,
    itemsPerPage,
  );

  if (!wallet) {
      return <></>
  }

  const renderHeadRow = (columns: string[]) => {
    if (isMobile) return null;
    return (
      <div className={'px-[12px] flex mb-[6px]'}>
        {columns.map((column) => (
          <div
            key={column}
            style={{ textAlign: column === columns.at(-1) ? 'right' : 'left' }}
            className={
              'flex-[1_0_0] py-[10px] text-[#70707B] text-[14px] font-semibold leading-[100%] capitalize'
            }
          >
            {column}
          </div>
        ))}
      </div>
    );
  };

  const renderRows = () => {
    return (
      <div className={'flex flex-col gap-[6px] laptop:gap-[4px] relative z-[10]'}>
        {currentPageItems.map((item) => (
          <Row key={item.transactionHash} item={item} />
        ))}
      </div>
    );
  };

  const renderEmpty = () => {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height: '300px' }}>
        <img src={EmptyReferral} alt="No Data" width={200} height={200} className="mb-[16px]" />{' '}
        <p className="text-[#4E5BA6] text-[14px] text-center">
          You don&apos;t have any referrals yet
        </p>{' '}
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          background: isMobile
            ? 'linear-gradient(180deg, rgba(2, 1, 6, 0.24) 0%, rgba(38, 39, 43, 0.24) 100%)'
            : 'rgba(38, 39, 43, 0.24)',
        }}
        className={
          'border border-borderMain rounded-[12px] py-[16px] px-[12px] laptop:pt-[20px] laptop:pb-[16px] relative'
        }
      >
        <div
          style={{
            background: 'linear-gradient(180deg, #020106 24.42%, rgba(2, 1, 6, 0.00) 100%)',
          }}
          className={'h-[150px] absolute inset-[-15px_-2px_0_-2px]'}
        ></div>
        {wallet && (
          <h3
            className={
              'text-typoMain text-[24px] laptop:text-[28px] font-semibold leading-[100%] capitalize mb-[20px] laptop:mb-[26px] relative z-[5]'
            }
          >
            My Referrals
          </h3>
        )}

        {isLoading ? (
          <TableLoadingState>Just a moment! Uploading your referral history</TableLoadingState>
        ) : items.length === 0 ? (
          renderEmpty()
        ) : (
          <>
            {renderHeadRow(columns)}
            {renderRows()}
          </>
        )}

        <div className={'rotate-90 absolute bottom-0 right-0'}>
          <ReferralCodeSpot />
        </div>
        <Image
          className={'absolute bottom-0 right-0 rotate-180'}
          src={'/svg/corner-light.svg'}
          lazy
        />
      </div>
      <div
        className={classNames('my-[28px]', {
          hidden: items.length <= itemsPerPage,
        })}
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
          setPage={setPage}
        />
      </div>
    </>
  );
};
