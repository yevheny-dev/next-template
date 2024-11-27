import { useCallback } from 'react';

import { useAppDispatch, useAppSelector, useOnboard } from '@/app';
import { saleChains } from '@/shared';
import { evmWalletSelector, initialState, setAssetAmount } from '@/widgets';
import { switchChain } from '@/widgets/sale/utils/helpers.tsx';

export const useChangeNetwork = (): ((chain: number, callback?: any) => void) => {
  const dispatch = useAppDispatch();
  const wallet = useAppSelector(evmWalletSelector);

  const onboard = useOnboard();

  const handleNetworkSelect = useCallback(
    async (value: number, callback?: any) => {
      if (!wallet) {
        onboard?.connectWallet();
        return;
      }

      const newActiveNetwork = saleChains.find((network) => network.networkId === value);
      const globalChainId = newActiveNetwork?.networkId;

      if (globalChainId) {
        try {
          onboard?.setChain({ chainId: globalChainId });
          switchChain(value, callback);
          dispatch(setAssetAmount(initialState.assetAmount));
        } catch (err) {
          console.warn(err);
        }
      }
    },
    [dispatch, onboard, wallet],
  );

  return handleNetworkSelect;
};
