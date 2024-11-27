import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app';
import { NotificationType, SaleAvailableChains, Notification } from '@/shared';
import {
  activeWalletSelector,
  removeOpenNotificationType,
  setOpenNotificationType,
} from '@/widgets';

export const WrongEvmModal = () => {
  const dispatch = useAppDispatch();
  const wallet = useAppSelector(activeWalletSelector);
  const [isWrongChain, setIsWrongChain] = useState(false);

  useEffect(() => {
    if (wallet?.isSolana) {
      setIsWrongChain(false);
      return;
    }

    if (!wallet) {
      setIsWrongChain(false);
    } else if (!SaleAvailableChains.includes(wallet.chainId)) {
      setIsWrongChain(true);
    } else if (SaleAvailableChains.includes(wallet.chainId)) {
      setIsWrongChain(false);
    }
  }, [wallet]);

  useEffect(() => {
    if (isWrongChain) {
      dispatch(setOpenNotificationType(NotificationType.WRONG_NETWORK));
    } else {
      dispatch(removeOpenNotificationType(NotificationType.WRONG_NETWORK));
    }
  }, [isWrongChain]);

  return <Notification type={NotificationType.WRONG_NETWORK} />;
};
