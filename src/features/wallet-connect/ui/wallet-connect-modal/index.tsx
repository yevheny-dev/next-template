import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './index.scss';

import { useAppDispatch, useOnboard } from '@/app';
import { getTokenIcon } from '@/shared';
import { useIsMobile } from '@/shared';
import {
  NetworkName,
  setWalletConnectModalOpen,
  tokenSaleSelector,
} from '@/widgets';

import { SolanaWallets } from './solana-wallets';

// import CloseButton from '/svg/closeButton.svg';

enum NetworkSelect {
  solana,
  evm,
}

const сhainBtnIconStyles = `flex items-center justify-center w-[26px] h-[26px] border-[1px] border-solid border-[#151515] @bg`;

const сhainBtnStyless = `border-[1px] border-solid border-[#6A56F6] rounded-[8px]`;

export const WalletConnectModal = memo(() => {
  const dispatch = useAppDispatch();
  const onboard = useOnboard();
  const { isWalletConnectModalOpen, wallets } = useSelector(tokenSaleSelector);
  const [network, setNetwork] = useState(NetworkSelect.evm);
  const isMobile = useIsMobile();
  const showEvmBtn = onboard?.state?.get()?.wallets?.length === 0;
  const showSolanaBtn = !wallets?.some(
    (w) => w?.networkName === NetworkName.solana
  );
  const isOpen = isWalletConnectModalOpen && (showEvmBtn || showSolanaBtn);

  const handleClose = useCallback(() => {
    dispatch(setWalletConnectModalOpen(false));
  }, []);

  useEffect(() => {
    onboard?.connectWallet();
    setNetwork(NetworkSelect.evm);
    onboard?.state?.select('wallets').subscribe((wallets) => {
      if (wallets.length) {
        handleClose();
      }
    });
  }, [onboard, isWalletConnectModalOpen]);

  useEffect(() => {
    if (onboard?.state?.get()?.wallets) {
      if (!showEvmBtn && showSolanaBtn) {
        setNetwork(NetworkSelect.solana);
      }
      if (showEvmBtn && !showSolanaBtn) {
        setNetwork(NetworkSelect.evm);
        onboard?.connectWallet();
      }
    }
  }, [showEvmBtn, showSolanaBtn, isWalletConnectModalOpen, onboard]);

  useEffect(() => {
    if (!onboard?.state?.get()?.wallets?.length) return;
    if (onboard?.state?.get()?.wallets?.length > 0 && showSolanaBtn) {
      dispatch(setWalletConnectModalOpen(false));
    }
  }, [dispatch, onboard?.state?.get()?.wallets, showSolanaBtn]);

  useEffect(() => {
    const root = document.documentElement;
    if (isOpen) {
      root.style.setProperty('--scroll-lock', 'hidden');
    } else {
      root.style.setProperty('--scroll-lock', 'visible');
    }
  }, [isOpen]);

  useEffect(() => {
    const modalElement = document.querySelector('.custom-onboard-modal-inner');
    const onboardNode = Array.from(modalElement?.children || []).find(
      (item) => item.localName === 'onboard-v2'
    );
    const style = document.createElement('style');
    if (!onboardNode) return;

    if (network === NetworkSelect.solana) {
      style.innerHTML = `
			.modal {
				display: none!important;
			}`;
      onboardNode?.shadowRoot?.appendChild(style);
    } else {
      style.innerHTML = `
			.modal {
				display: block!important;
			}`;
      onboardNode?.shadowRoot?.appendChild(style);
    }

    if (!showEvmBtn) {
      style.innerHTML = `
			.modal {
				display: none!important;
			}`;
      onboardNode?.shadowRoot?.appendChild(style);
    }
  }, [network, showEvmBtn]);

  return (
    <div
      id='custom-onboard-modal'
      style={{ display: isOpen ? 'flex' : 'none' }}
      onClick={handleClose}
    >
      <div
        className='custom-onboard-modal-inner'
        onClick={(e) => {
          e?.stopPropagation();
        }}
      >
        <div className='onboard-modal-header'>
          <h2 className='text-titanOne text-center text-[14px] font-[600]  leading-[100%] text-[#B9C0D4]'>
            Connect Wallet
          </h2>
          <button
            onClick={handleClose}
            className='absolute right-[-4px] top-[-4px]'
          >
            <img src='/svg/closeButton.svg' alt='close-button' />
          </button>
        </div>

        <div>
          {showSolanaBtn && showEvmBtn && (
            <div className='mb-[24px] flex justify-center'>
              <div className='sliding flex items-center justify-center'>
                <div className='flex gap-[4px]'>
                  <button
                    className={classNames(
                      сhainBtnStyless,
                      'flex h-[40px] w-[95px] items-center justify-center gap-[4px]'
                    )}
                    style={{
                      backgroundColor:
                        network === NetworkSelect.evm
                          ? '#6A56F629'
                          : '#FFFFFF05',
                    }}
                    onClick={() => {
                      onboard?.connectWallet();
                      setNetwork(NetworkSelect.evm);
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: '6px',
                      }}
                    >
                      <img src={getTokenIcon('eth')} alt='[]' />
                      <span
                        className={classNames('text-[14px] font-[600]')}
                        style={{
                          color:
                            network === NetworkSelect.evm
                              ? '#FFFFFF'
                              : '#B9C0D4',
                        }}
                      >
                        EVM
                      </span>
                    </div>
                  </button>
                  <button
                    className={classNames(
                      сhainBtnStyless,
                      'flex h-[40px] w-[95px] items-center justify-center gap-[4px]'
                    )}
                    style={{
                      background:
                        network === NetworkSelect.solana
                          ? '#6A56F629'
                          : '#FFFFFF05',
                    }}
                    onClick={() => {
                      setNetwork(NetworkSelect.solana);
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: '6px',
                      }}
                    >
                      <img src={getTokenIcon('solana')} alt='[]' />

                      <span
                        className={classNames('text-[14px] font-[600]')}
                        style={{
                          color:
                            network === NetworkSelect.solana
                              ? '#FFFFFF'
                              : '#B9C0D4',
                        }}
                      >
                        Solana
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {network === NetworkSelect.solana && showSolanaBtn && <SolanaWallets />}

        {network === NetworkSelect.solana && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #FFFFFF05',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              marginTop: '4px',
            }}
          >
            <a
              href='https://www.blocknative.com/blog/metamask-wont-connect-web3-wallet-troubleshooting-guide'
              target='_blank'
              rel='noreferrer noopener'
              style={{ color: '#B9C0D4' }}
            >
              Why Don't I See My Wallet?
            </a>
          </div>
        )}
      </div>
    </div>
  );
});

WalletConnectModal.displayName = 'WalletConnectModal';
