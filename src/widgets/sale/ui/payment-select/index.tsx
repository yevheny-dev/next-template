import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app';
import {
  CryptoCurrency,
  SaleAvailableAssets,
  SaleAvailableAssetSymbols,
  SaleAvailableNetworks,
  useChangeNetwork,
} from '@/shared';

import {
  activeWalletSelector,
  NetworkName,
  PaymentType,
  selectWalletByAddress,
  setAsset,
  setAssetAmount,
  setFiat,
  setNowPaymentsState,
  setPaymentType,
  setSelectedChain,
  tokenSaleSelector,
  Wallet,
} from '../../model';
import { getNowPaymentAmounts } from '../../model/now-payments';
import { NowPaymentsChains, NowPaymentsCollaterals } from '../../model/now-payments.constants';
import commonStyles from '../payment.module.scss';

import { CryptoSelect } from './crypto-select';
import { FiatSelect } from './fiat-select';
import { deepEqual } from '../../utils/helpers';

const mostPopularAssetsIds = [
  `${SaleAvailableNetworks.Ethereum}-${SaleAvailableAssetSymbols.ETH}`,
  `${SaleAvailableNetworks.Solana}-${SaleAvailableAssetSymbols.SOL}`,
  `${SaleAvailableNetworks.Bsc}-${SaleAvailableAssetSymbols.USDT}`,
  `${SaleAvailableNetworks.Bsc}-${SaleAvailableAssetSymbols.BNB}`,
  `${SaleAvailableNetworks.Solana}-${SaleAvailableAssetSymbols.USDC}`,
];

const getByNowPaymentId = (id?: number): CryptoCurrency | undefined =>
  id ? SaleAvailableAssets.find((asset) => asset?.nowPaymentsId === id) : undefined;

export const getByCoinId = (id?: number): CryptoCurrency | undefined =>
  SaleAvailableAssets.find((asset) => asset?.coinId === id);

export const PaymentSelect = () => {
  const { wallets, selectedChain, nowPaymentsState, balances, currentPaymentType, asset } =
    useAppSelector(tokenSaleSelector);
  const dispatch = useAppDispatch();
  const wallet = useAppSelector(activeWalletSelector);
  const solanaWallet = wallets?.find((w: Wallet) => w.networkName === NetworkName.solana);
  const evmWallet = wallets?.find((w: Wallet) => w.networkName === NetworkName.evm);
  const changeNetwork = useChangeNetwork();
  const [localAsset, setLocalAsset] = useState(asset);

  const mostPopularAssets = useMemo(() => {
    return SaleAvailableAssets.filter((asset) => {
      if (mostPopularAssetsIds.includes(asset.id)) {
        return asset;
      }
    });
  }, []);

  useEffect(() => {
    if (!wallet?.isSolana && wallet?.chainId !== selectedChain?.coinId && wallet) {
      const asset = getByCoinId(wallet?.chainId);
      if (asset) {
        dispatch(setSelectedChain(asset));
      }
    }
  }, [wallet]);

  const nowPaymentAsset = getByNowPaymentId(nowPaymentsState?.chainId);
  const walletCoinAsset = getByCoinId(wallet?.chainId);

  const activeAsset: CryptoCurrency = useMemo(
    () =>
      SaleAvailableAssets.find((asset) => {
        const id = nowPaymentAsset
          ? nowPaymentAsset.id
          : selectedChain
            ? selectedChain.id
            : walletCoinAsset
              ? walletCoinAsset.id
              : SaleAvailableAssets[0].id;

        return asset.id === id;
      }) || SaleAvailableAssets[0],
    [nowPaymentAsset, walletCoinAsset, selectedChain],
  );

  useEffect(() => {
    const collateral = balances.find((a) => a.address === selectedChain.address);
    if (deepEqual(localAsset, collateral)) return;
    if (collateral) {
      if (!collateral.disable) {
        dispatch(setAsset(collateral));
        setLocalAsset(collateral);
        dispatch(setAssetAmount(''));
      }
    } else {
      dispatch(setAsset(null));
    }
  }, [dispatch, balances, selectedChain, asset, localAsset]);

  const selectAsset = (asset: CryptoCurrency) => {
    dispatch(setPaymentType(PaymentType.CRYPTO));
    dispatch(setFiat(null));

    if (asset?.nowPaymentsId) {
      const selectedChain = NowPaymentsChains.find((item) => item.value === asset.nowPaymentsId);
      const selectedCollateral = NowPaymentsCollaterals.find((item) => item.coin === asset.coinId);
      const defaultToken = selectedCollateral?.default ? selectedCollateral : selectedChain;
      dispatch(
        setNowPaymentsState({
          chainId: asset.nowPaymentsId,
          amount: '',
          minAmount: '',
          collateralId: selectedCollateral?.default ? selectedCollateral.value : 0,
        }),
      );
      dispatch(
        getNowPaymentAmounts({
          currencyFrom: 'USD',
          currencyTo: defaultToken?.shortName || '',
          amount: '10',
        }),
      );
      dispatch(setSelectedChain(asset));
      return;
    } else {
      dispatch(setNowPaymentsState(null));
    }

    if (asset.networkName === SaleAvailableNetworks.Solana) {
      if (solanaWallet?.address) {
        dispatch(selectWalletByAddress(solanaWallet.address));
      }
      dispatch(setSelectedChain(asset));
      return;
    }

    changeNetwork(asset.coinId, () => {
      dispatch(setSelectedChain(asset));
    });

    if (!evmWallet?.address) {
      dispatch(setSelectedChain(asset));
      return;
    }

    dispatch(selectWalletByAddress(evmWallet.address));
  };

  return (
    <div>
      <div className={commonStyles.autoGrid}>
        {mostPopularAssets.map((asset) => {
          return (
            <button
              onClick={() => {
                selectAsset(asset);
              }}
              className={classNames(commonStyles.assetBtn, {
                [commonStyles.active]:
                  activeAsset.id === asset.id && currentPaymentType === PaymentType.CRYPTO,
              })}
              key={asset.id}
            >
              <img className={commonStyles.icon} src={asset.icon} alt={asset.name} />
              <span className={commonStyles.symbol}>{asset.symbol}</span>
              <span className={commonStyles.network}>{asset.networkName}</span>
            </button>
          );
        })}
      </div>
      <div className={'grid tabletSmall:grid-cols-2 gap-[4px] mt-[4px]'}>
        <CryptoSelect
          activeAsset={activeAsset}
          selectAsset={selectAsset}
          mostPopularAssetsIds={mostPopularAssetsIds}
        />
        <FiatSelect />
      </div>
    </div>
  );
};
