import Link from 'next/link';
import React from 'react';

import { useIsTablet } from '@/shared';

export const Logo = () => {
  const isTablet = useIsTablet();
  return (
    <Link className='flex' href='/'>
      <img
        className='laptop:max-w-[124px] max-w-[48px]'
        src={isTablet ? '/svg/logo-mobile.svg' : '/svg/logoNova.svg'}
        alt='logo'
      />
    </Link>
  );
};

export const SmallLogo = () => {
  const isTablet = useIsTablet();
  return (
    <Link className='flex' href='/'>
      <img
        className='laptop:max-w-[124px] max-w-[48px]'
        src={isTablet ? '/svg/logo-mobile.svg' : '/svg/logo.svg'}
        alt='logo'
      />
    </Link>
  );
};
