import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { OnboardAPI } from '@web3-onboard/core';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CustomOnboardStyle } from '@/features';
import {
  GlobalChainId,
  initOnboard,
  isSameWallets,
  saleChains,
} from '@/shared';
import {
  evmWalletSelector,
  NetworkName,
  pushWallet,
  removeWalletByAddress,
  selectWalletByAddress,
  setSelectedChain,
  tokenSaleSelector,
  Wallet,
} from '@/widgets';
import { saveUserStats } from '@/widgets/sale/model/analytics';
import { getByCoinId } from '@/widgets/sale/ui/payment-select';

import { WALLET_ATTACHED } from '../analytics/actionTypes';
import { useAppDispatch, useAppSelector } from '../store';

type CommonProviderProps = { children: React.ReactNode };

const CommonContext = createContext<OnboardAPI | null>(null);

function OnboardProvider({ children }: CommonProviderProps) {
  const [onboard, setOnboard] = useState<OnboardAPI | null>(null);

  const { wallets } = useAppSelector(tokenSaleSelector);
  const evmWallet = useAppSelector(evmWalletSelector);
  const { wallet: solanaWallet, connecting } = useWallet();
  const anchorWallet = useAnchorWallet();
  const dispatch = useAppDispatch();

  const processWallet = useCallback(() => {
    const w = onboard?.state?.get()?.wallets?.[0];
    const address = w?.accounts?.[0]?.address;
    const chainHex = w?.chains?.[0]?.id;

    if (!w?.provider || !address || !chainHex) {
      // if (evmWallet) {
      //   const walletAddress = wallets?.find(
      //     (w) => w.address.toLowerCase() === evmWallet.address.toLowerCase(),
      //   )?.address;
      //   dispatch(removeWalletByAddress(walletAddress));
      // }
      return;
    }

    const chain = parseInt(chainHex, 16);
    const chainIcon =
      saleChains.find((item) => item.networkId === chain)?.icon || undefined;
    const walletIcon = w?.icon;

    const resultWallet: Wallet = {
      ...evmWallet,
      address,
      providerName: w.label,
      chainId: chain,
      networkName: NetworkName.evm,
      chainIcon,
      walletIcon,
    };

    if (!isSameWallets(evmWallet, resultWallet) || !window.evmProvider) {
      window.evmProvider = w?.provider;
      dispatch(pushWallet(resultWallet));
      dispatch(selectWalletByAddress(address));

      saveUserStats(
        address,
        resultWallet ? `${resultWallet?.providerName} - evm` : undefined
      );

      const asset = getByCoinId(chain);
      if (asset) {
        dispatch(setSelectedChain(asset));
      }

      dispatch({ type: WALLET_ATTACHED });
    }
  }, [dispatch, onboard, evmWallet, wallets]);

  const processSolanaWallet = useCallback(() => {
    const address = solanaWallet?.adapter?.publicKey?.toBase58();
    const providerName = solanaWallet?.adapter?.name;
    const walletIcon = solanaWallet?.adapter?.icon;

    if (!address || !providerName) return;

    saveUserStats(address, providerName ? `${providerName} - sol` : undefined);

    const resultWallet = {
      address,
      providerName,
      chainId: GlobalChainId.solana,
      networkName: NetworkName.solana,
      walletIcon,
      chainIcon: '/images/sol.png',
      isSolana: true,
    };
    dispatch(pushWallet(resultWallet));
    dispatch(selectWalletByAddress(address));

    const asset = getByCoinId(GlobalChainId.solana);
    if (asset) {
      dispatch(setSelectedChain(asset));
    }

    // NOTE: fix of specific Solana issue
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, solanaWallet, anchorWallet]);

  useEffect(() => {
    if (!solanaWallet) return;
    processSolanaWallet();
  }, [solanaWallet, processSolanaWallet, connecting]);

  useEffect(() => {
    if (!solanaWallet) {
      const walletAddress = wallets?.find((w) => w.isSolana);
      if (!walletAddress?.address) return;
      dispatch(removeWalletByAddress(walletAddress.address));
    }
  }, [dispatch, solanaWallet, connecting, wallets]);

  useEffect(() => {
    setOnboard(initOnboard());
  }, []);

  useEffect(() => {
    if (!onboard) return;

    const timeout = setTimeout(() => {
      processWallet();
    }, 100);
    const interval = setInterval(() => {
      processWallet();
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onboard, processWallet]);

  useEffect(() => {
    const modalElement = document.querySelector('.custom-onboard-modal-inner');
    const onboardNode = Array.from(modalElement?.children || []).find(
      (item) => item.localName === 'onboard-v2'
    );
    if (!onboardNode) return;
    const style = document.createElement('style');
    style.innerHTML = CustomOnboardStyle;
    onboardNode?.shadowRoot?.appendChild(style);
  }, [onboard]);

  const contextValue = useMemo(() => onboard, [onboard]);

  return (
    <CommonContext.Provider value={contextValue}>
      {children}
    </CommonContext.Provider>
  );
}

function useOnboard() {
  const context = useContext(CommonContext);

  if (context === undefined) {
    throw new Error('useOnboard must be used within a CommonProvider');
  }

  return context;
}

export { OnboardProvider, useOnboard };
