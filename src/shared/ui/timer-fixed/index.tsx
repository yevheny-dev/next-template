import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/app';
import { Button, Timer } from '@/shared';
import { tokenSaleSelector } from '@/widgets';

export const TimerFixed = () => {
  const { saleConfig } = useAppSelector(tokenSaleSelector);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 800) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    document.addEventListener('scroll', onScroll);
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{ transition: 'left 0.3s ease-out' }}
      className={`fixed ${show ? 'left-[20px]' : 'left-[-400px]'} bottom-[20px] z-30 backdrop-blur-[6px] block`}
    >
      <div
        style={{ background: 'rgba(38, 39, 43, 0.42)' }}
        className={'py-[8px] px-[12px] rounded-[12px] flex gap-[12px] items-center'}
      >
        <Timer
          till={saleConfig?.roundEndDate}
          style={{ marginBottom: '0px', padding: '4px 8px', background: 'rgba(2, 1, 6, 0.64)' }}
          childrenClasses={{
            dotsClasses: 'text-[28px]',
            numClasses: 'text-[28px] text-shadow',
            dateClasses: 'text-[8px] capitalize text-shadow',
            cellClasses: 'flex flex-col items-center justify-center min-w-[40px]',
          }}
        />
        <Button className={'w-[99px] max-h-[36px]'} variant={'outline'} size={'36'} to="/presale">
          <img className={'max-h-[26px]'} src={'/images/home/roadmap/3-active.webp'} />
          Buy
        </Button>
      </div>
    </div>
  );
};
