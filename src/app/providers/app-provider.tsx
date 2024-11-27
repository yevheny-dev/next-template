import React, { FC, useEffect } from 'react';

import { setNativePrices } from '@/widgets';
import { getBatchNativePrices } from '@/widgets/sale/utils/prices';

import { useAppDispatch } from '../store';

export const AppProvider: FC<{ children: any }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetch = () => {
      getBatchNativePrices().then((res) => {
        if (res) {
          dispatch(setNativePrices(res));
        }
      });
    };

    fetch();

    const id = setInterval(fetch, 10_000);

    return () => clearInterval(id);
  }, [dispatch]);

  return <>{children}</>;
};
