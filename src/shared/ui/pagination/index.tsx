import classNames from 'classnames';
import React from 'react';

import { Image } from '@/shared';
import { createPageArray } from '@/shared/ui/pagination/utils.ts';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  setPage,
}) => {
  const pageArray = createPageArray(totalPages, currentPage);

  return (
    <div className="mx-auto w-fit flex items-center gap-[20px]">
      <div
        className="cursor-pointer p-[10px] rounded-[6px] bg-[rgba(108,_115,_127,_0.24)] [box-shadow:0px_2px_0px_0px_#151515]"
        onClick={() => prevPage()}
      >
        <Image className="rotate-180" src="/svg/pagination-arrow-right.svg" />
      </div>
      <div className={'w-[100px] mx-auto flex items-center justify-center'}>
        {pageArray.map((page, index) => (
          <button
            className={classNames(
              'text-[#FFF] mx-[4px] text-center text-[18px] not-italic font-normal leading-[100%]',
              {
                '!text-[#6A56F6]': page === currentPage,
              },
            )}
            key={index}
            disabled={page === currentPage || page === '...'}
            onClick={() => typeof page === 'number' && setPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <div
        className="cursor-pointer p-[10px] rounded-[6px] bg-[rgba(108,_115,_127,_0.24)] [box-shadow:0px_2px_0px_0px_#151515]"
        onClick={() => nextPage()}
      >
        <Image src="/svg/pagination-arrow-right.svg" />
      </div>
    </div>
  );
};
