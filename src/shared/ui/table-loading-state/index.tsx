import React, { ReactNode } from 'react';

import { Loading } from '@/shared';

export const TableLoadingState = ({
  children = 'Just a moment! Uploading your purchase history',
}: {
  children: ReactNode;
}) => {
  return (
    <div className={'flex flex-col justify-center items-center gap-[16px] pb-[64px]'}>
      <Loading />
      <span className={'text-typoMain text-[14px] leading-[140%] font-semibold capitalize'}>{children}</span>
    </div>
  );
};
