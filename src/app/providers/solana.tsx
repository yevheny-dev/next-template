import React, { FC, useMemo } from 'react';
import { CoinbaseWalletAdapter } from '@solana/wallet-adapter-coinbase';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  CloverWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import '@solana/wallet-adapter-react-ui/styles.css';
import { solanaEndpoint } from '@/shared';

export const SolanaProvider: FC<{ children: any }> = ({ children }) => {
  const injectedWallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new CloverWalletAdapter(),
      new TorusWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [],
  );
  return (
    <ConnectionProvider endpoint={solanaEndpoint}>
      <WalletProvider wallets={injectedWallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
