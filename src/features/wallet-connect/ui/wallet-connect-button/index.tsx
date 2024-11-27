import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import React, { FC, memo, useCallback, useRef, useState } from 'react';

import './index.scss';

import { useAppDispatch, useAppSelector, useOnboard } from '@/app';
import {
  Button,
  CopyToClipboard,
  cutAddressByLength,
  useClickOutside,
  useIsTablet,
} from '@/shared';
import {
  activeWalletSelector,
  NetworkName,
  removeWalletByAddress,
  setWalletConnectModalOpen,
  tokenSaleSelector,
  Wallet,
} from '@/widgets/sale/model';

export const WalletConnectBtn: FC = memo(() => {
  const isTablet = useIsTablet();
  const dispatch = useAppDispatch();
  const onboard = useOnboard();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { wallets } = useAppSelector(tokenSaleSelector);
  const wallet = useAppSelector(activeWalletSelector);
  const ref = useRef<HTMLDivElement | null>(null);
  const { disconnect: solanaDisconnect } = useWallet();
  const { onDisconnect } = useWalletMultiButton({ onSelectWallet: () => {} });

  const showAddSolanaModal = !wallets?.find(
    (w) => w.networkName === NetworkName.solana
  );
  const showAddEvmModal = !wallets?.find(
    (w) => w.networkName === NetworkName.evm
  );

  const handleClose = () => {
    if (!isOpenModal) return;
    setIsOpenModal(false);
  };

  const handleDisconnect = (w: Wallet) => {
    if (w?.networkName === NetworkName.solana) {
      onDisconnect?.();
      solanaDisconnect();
      dispatch(removeWalletByAddress(w?.address));
      setIsOpenModal(false);
      return;
    }
    if (w?.networkName === NetworkName.evm) {
      onboard?.disconnectWallet({ label: w?.providerName || '' });
      dispatch(removeWalletByAddress(w?.address));
      setIsOpenModal(false);
    }
  };

  const connectWallet = useCallback(() => {
    dispatch(setWalletConnectModalOpen(true));
  }, []);

  useClickOutside(ref, handleClose);

  if (!wallet) {
    return (
      <Button size='44' name='connect wallet' onClick={connectWallet}>
        Connect Wallet
      </Button>
    );
  }

  return (
    <div
      className='align-end relative'
      ref={ref}
      onClick={() => setIsOpenModal((prev) => !prev)}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpenModal((prev) => !prev);
        }}
        className='walletBtn flex cursor-pointer rounded-[10px] border-[1px] border-solid border-[#4D5761] p-[8px]'
        // onMouseMove={handleMouseMove}
      >
        <div className='laptop:gap-[12px] flex items-center gap-[8px]'>
          <div className='flex items-center'>
            {wallet?.address && (
              <>
                {wallet?.walletIcon ? (
                  <>
                    {wallet?.walletIcon?.startsWith('data:image') ? (
                      <img
                        className='laptop:w-[32px] laptop:h-[32px] h-[26px] w-[26px] shrink-0 overflow-hidden rounded-full'
                        src={wallet?.walletIcon}
                        alt='wallet icon'
                      />
                    ) : (
                      <div
                        className='laptop:w-[32px] laptop:h-[32px] h-[26px] w-[26px] shrink-0 overflow-hidden rounded-full'
                        dangerouslySetInnerHTML={{ __html: wallet?.walletIcon }}
                      ></div>
                    )}
                  </>
                ) : (
                  <div className='laptop:w-[32px] laptop:h-[32px] h-[26px] w-[26px] overflow-hidden rounded-full border border-white bg-white' />
                )}
              </>
            )}
            <div className='ml-[6px] flex cursor-pointer items-center gap-[2px]'>
              <span className='laptop:text-[16px] text-[14px] font-[600] text-[#B9C0D4]'>
                {cutAddressByLength(wallet?.address, isTablet ? 2 : 5, 5)}
              </span>
            </div>
            <CopyToClipboard text={wallet?.address || ''}>
              <div className='laptop:ml-[12px] ml-[8px] h-[28px] w-[28px]'>
                <img src='/svg/copy.svg' alt='copy' />
              </div>
            </CopyToClipboard>
          </div>
        </div>
      </div>
      {isOpenModal && (
        <div
          className={classNames(
            'absolute top-[110%] min-w-[312px] overflow-hidden rounded-[12px] bg-[#26272b]',
            isTablet ? 'right-[-54px]' : 'right-[0]'
          )}
          style={{
            border: '2px solid gray',
          }}
        >
          <div className='px-[8px] py-[16px]'>
            {wallets?.map((w) => {
              return (
                <div
                  key={w?.address}
                  className='mb-[12px] flex flex-col gap-[6px] rounded-full bg-[#1e1d22]'
                >
                  <div className='shadow-border grid grid-cols-[1fr_0.6fr] rounded-[12px]'>
                    <div className='flex w-full items-center gap-[6px] rounded-[12px] p-[8px]'>
                      <img
                        className='h-[24px] w-[24px] shrink-0 overflow-hidden rounded-full'
                        src={
                          w?.isSolana
                            ? '/svg/token-icons/solana.svg'
                            : '/svg/token-icons/eth.svg'
                        }
                        alt='wallet icon'
                      />
                      <span className='text-[14px] font-semibold not-italic leading-[100%] text-[#B9C0D4]'>
                        {cutAddressByLength(w?.address, 5, 2)}{' '}
                        <span className='text-[#b9c0d46b]'>
                          {w?.isSolana ? 'Solana' : 'EVM'}
                        </span>
                      </span>
                    </div>
                    <Button
                      variant='outline'
                      size='32'
                      className='!rounded-full !px-[12px] !py-[8px] !text-[#FFF]'
                      onClick={() => handleDisconnect(w)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              );
            })}
            {showAddSolanaModal && (
              <div className='flex flex-col gap-[6px] rounded-full bg-[#1e1d22]'>
                <div className='shadow-border grid grid-cols-[1fr_0.6fr] rounded-[12px] '>
                  <div className='flex w-full items-center gap-[6px] rounded-[12px] p-[8px]'>
                    <span className='text-[14px] font-semibold not-italic leading-[100%] text-[#B9C0D4]'>
                      Not connected{' '}
                      <span className='text-[#b9c0d46b]'>Solana</span>
                    </span>
                  </div>
                  <Button
                    className='!rounded-full !px-[12px] !py-[8px]'
                    size='32'
                    onClick={() => {
                      connectWallet();
                      handleClose();
                    }}
                  >
                    Connect
                  </Button>
                </div>
              </div>
            )}
            {showAddEvmModal && (
              <div className='flex flex-col gap-[6px] rounded-full bg-[#1e1d22]'>
                <div className='shadow-border grid grid-cols-[1fr_0.7fr] rounded-[12px]'>
                  <div className='flex w-full items-center gap-[6px] rounded-[12px] p-[8px]'>
                    <span className='text-[14px] font-semibold not-italic leading-[100%] text-[#B9C0D4]'>
                      Not connected{' '}
                      <span className='text-[#b9c0d46b]'>EVM</span>
                    </span>
                  </div>
                  <Button
                    className='!rounded-full !px-[12px] !py-[8px]'
                    size='32'
                    onClick={() => {
                      onboard?.connectWallet();
                      connectWallet();
                      handleClose();
                    }}
                  >
                    Connect
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

WalletConnectBtn.displayName = 'WalletConnectBtn';
