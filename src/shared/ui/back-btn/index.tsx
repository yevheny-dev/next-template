import React, { FC } from 'react';
import { Link } from 'react-router-dom';

export const BackBtn: FC<{ to: string }> = ({ to }) => {
  return (
    <Link
      className="h-[46px] pl-[8px] pr-[16px] flex gap-[8px] items-center text-[#B9C0D4] text-[16px] font-[600] capitalize whitespace-nowrap rounded-[8px] self-start tablet:hidden"
      style={{ border: '1px solid #B9C0D4' }}
      to={to}
    >
      <img src="/svg/link-arrow.svg" alt={'back arrow'} />
      Back
    </Link>
  );
};
