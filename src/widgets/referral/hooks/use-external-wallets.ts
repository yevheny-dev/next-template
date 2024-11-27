import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app';
import {
  evmWalletSelector,
  setWalletConnectModalOpen,
  solanaWalletSelector,
  tokenSaleSelector,
} from '@/widgets';
import {
  useAddWalletToReferralMutation,
  useLazyGetOwnWalletsFromReferralQuery,
} from '@/widgets/sale/utils/api.ts';

export type ExternalWalletType = 'evm' | 'sol';

export const useExternalWallets = (type: ExternalWalletType) => {
  const dispatch = useAppDispatch();
  const { ownRefferalCode, ownExternalReferralWallets, isReferralCodeLoading } =
    useAppSelector(tokenSaleSelector);
  const { signMessage } = useWallet();
  const solWallet = useAppSelector(solanaWalletSelector);
  const evmWallet = useAppSelector(evmWalletSelector);
  const [getOwnReferralWallets] = useLazyGetOwnWalletsFromReferralQuery();
  const [addWallet, { isLoading }] = useAddWalletToReferralMutation();
  const [wallet, setWallet] = useState('');

  useEffect(() => {
    if (!ownRefferalCode) return;
    getOwnReferralWallets(ownRefferalCode);
  }, [ownRefferalCode, getOwnReferralWallets]);

  useEffect(() => {
    if (ownExternalReferralWallets) {
      setWallet(ownExternalReferralWallets[type]);
    }
  }, [ownExternalReferralWallets, type]);

  const isMainWalletConnected = type === 'evm' ? !!evmWallet : !!solWallet;

  const connectWallet = useCallback(() => {
    dispatch(setWalletConnectModalOpen(true));
  }, [dispatch]);

  const createEvmSign = async () => {
    try {
      const message = `${ownRefferalCode}=>${solWallet?.address}`;
      return await window.evmProvider?.request({
        method: 'personal_sign',
        params: [message, evmWallet?.address],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addSolanaWallet = async () => {
    try {
      const sign = await createEvmSign();
      if (sign) {
        await addWallet({
          signature: sign,
          address: solWallet?.address as string,
          code: ownRefferalCode,
        });
      } else {
        console.error('Sign was not created');
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createSolSign = async () => {
    try {
      const message = `${ownRefferalCode}=>${evmWallet?.address}`;
      const encodedMessage = new TextEncoder().encode(message);
      if (signMessage) {
        const signature = await signMessage(encodedMessage);
        return Buffer.from(signature).toString('hex');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addEvmWallet = async () => {
    try {
      const sign = await createSolSign();
      if (sign) {
        await addWallet({
          signature: sign,
          address: evmWallet?.address as string,
          code: ownRefferalCode,
        });
      } else {
        console.error('Sign was not created');
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onButtonClick = () => {
    if (!isMainWalletConnected) {
      connectWallet();
    }
    if (type === 'sol' && isMainWalletConnected) {
      addSolanaWallet();
    }
    if (type === 'evm' && isMainWalletConnected) {
      addEvmWallet();
    }
    getOwnReferralWallets(ownRefferalCode);
  };

  return {
    address: wallet,
    onButtonClick,
    btnLabel: isMainWalletConnected ? 'link' : 'connect',
    isLoadingAddWallet: isLoading,
    isReferralCodeLoading,
  };
};
