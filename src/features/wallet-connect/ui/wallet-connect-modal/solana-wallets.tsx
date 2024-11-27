import { useWallet } from '@solana/wallet-adapter-react';
import React, { useCallback } from 'react';

import './index.scss';

import { useAppDispatch } from '@/app';
import { SkipWallets } from '@/shared';
import { setWalletConnectModalOpen } from '@/widgets';

export const SolanaWallets = () => {
  const dispatch = useAppDispatch();

  const { wallets, connect, select, publicKey } = useWallet();

  const handleClose = useCallback(() => {
    dispatch(setWalletConnectModalOpen(false));
  }, [dispatch]);

  const filteredWallets = wallets?.filter(
    (w) => !SkipWallets.includes(w.adapter.name)
  );

  return (
    <div className='wallets-containerSol'>
      {filteredWallets.map((wallet) => (
        <button
          className='wallet-btnSol'
          key={wallet.adapter.name}
          onClick={async () => {
            try {
              await select(wallet.adapter.name);

              if (wallet.adapter.connected || publicKey) {
                await connect();
              } else {
                if (wallet.readyState === 'NotDetected')
                  window.open(wallet.adapter.url, '_blank');
              }
              handleClose();
            } catch (error) {
              console.error('Failed to connect wallet:', error);
            }
          }}
        >
          <div className='wallet-innerSol'>
            <img
              className='wallet-btnSol_icon'
              src={wallet?.adapter.icon}
              alt=''
            />

            <p className='wallet-btnSol_name'>{wallet.adapter.name}</p>
          </div>
        </button>
      ))}
    </div>
  );
};
