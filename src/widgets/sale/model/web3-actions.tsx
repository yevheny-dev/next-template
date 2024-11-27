import { createAsyncThunk } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import { RootState } from '@/app/store';
import {
  SaleContract,
  TOKEN_PRECISION,
  CollateralsByChain,
  PriorityFeeByChain,
  NotificationType,
} from '@/shared';

import { CustomTokenAbi } from '../utils/abis/CustomTokenAbi';
import { Erc20Abi } from '../utils/abis/Erc20Abi';
import { NativeSaleAbi } from '../utils/abis/NativeSaleAbi';
import { StorageAbi } from '../utils/abis/StorageAbi';
import { TokenSaleAbi } from '../utils/abis/TokenSaleAbi';
import {
  getAndVerifyProvider,
  getDecimalsOfCollateral,
  retryWrapper,
  estimateGas,
  getGasPrice,
  convertToHex,
} from '../utils/helpers';

import { sendCollateralAnalyticsEvent, sendNativeAnalyticsEvent } from './analytics';
import { getReferralInfo } from './get-referral-results';
import {
  createEvent,
  removeOpenNotificationType,
  setLastPurchaseTokenAmount,
  setOpenNotificationType,
  setThanksModalIsOpen,
  setTrxInProgress,
} from './slice';
import { CollateralToken, FOpenNotification, TransactionParams, VestingPlan } from './types';
import { getSaleTokensBalances, updateContractInfo } from './web3-fetchers';

const runSaleTransaction = async ({
  to,
  data,
  value,
  chain,
  dispatch,
  provider,
  afterConfirm,
}: TransactionParams): Promise<string | undefined> => {
  dispatch(setTrxInProgress(true));
  dispatch(setOpenNotificationType(NotificationType.TRANSACTION_IN_PROGRESS));
  try {
    let body: ethers.utils.Deferrable<ethers.providers.TransactionRequest> = {
      chainId: provider.networkId,
      from: provider.address,
      to,
      data,
      value: value ? '0x' + new BigNumber(value).toString(16) : '0x0',
    };

    const [gasLimit, gasPrice] = await Promise.all([
      estimateGas(body, provider.provider),
      getGasPrice(provider.provider),
    ]);

    if (gasLimit === null) {
      dispatch(setOpenNotificationType(NotificationType.GAS_PROBLEM));
      return;
    }

    const maxPriorityFee = PriorityFeeByChain[provider.networkId];
    const maxFeePerGas = convertToHex(gasPrice.lt(maxPriorityFee) ? maxPriorityFee : gasPrice);

    if (chain === 56) {
      body = {
        ...body,
        gasLimit,
        gasPrice: convertToHex(gasPrice),
      };
    } else {
      body = {
        ...body,
        gasLimit,
        maxFeePerGas,
        maxPriorityFeePerGas: convertToHex(maxPriorityFee),
      };
    }

    const signer = provider.provider.getSigner();

    const result = await signer.sendTransaction(body);

    if (afterConfirm) {
      afterConfirm(result);
    }

    const receipt = await result.wait();
    const hash = receipt.transactionHash;

    dispatch(getSaleTokensBalances({ wallet: provider.address, networkId: provider.networkId }));
    return hash;
  } catch (e) {
    if ((e as any)?.code !== 4001) {
      console.warn(e);
      dispatch(setOpenNotificationType(NotificationType.TRANSACTION_FAILED));
    } else if (afterConfirm) {
      afterConfirm();
    }
  } finally {
    dispatch(setTrxInProgress(false));
    dispatch(removeOpenNotificationType(NotificationType.TRANSACTION_IN_PROGRESS));
  }
};

//
export const buyWithEth = createAsyncThunk(
  'tokenSale/buyWithEth',
  async (
    {
      amount,
      vesting,
      refferalCode,
      openNotification,
    }: {
      amount: number;
      vesting: VestingPlan;
      refferalCode?: string;
      openNotification: FOpenNotification;
    },
    thunkApi,
  ) => {
    const provider = await getAndVerifyProvider(true);
    if (!provider) return;

    const walletProviderName = (thunkApi.getState() as RootState).sale?.wallets?.find(
      (w) => !w.isSolana,
    )?.providerName;
    const roundIndex = (thunkApi.getState() as RootState).sale?.activeRound - 1;
    const naviveIdoAddress = SaleContract.nativeIdo[provider.networkId];
    const storageAddress = SaleContract.idoStorage[provider.networkId];
    const storageContract = new ethers.Contract(storageAddress, StorageAbi, provider.provider);
    const saleInterface = new ethers.utils.Interface(NativeSaleAbi);
    const data = saleInterface.encodeFunctionData('payETH', [vesting, refferalCode || '']);
    const value = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18)).toFixed();

    const balanceBefore = await storageContract.userFundsByCell(roundIndex, provider.address);

    const afterInitState = (tx: ethers.providers.TransactionResponse | undefined): void => {
      if (!tx) return;

      sendNativeAnalyticsEvent(
        thunkApi,
        amount,
        provider.address,
        provider.networkId,
        tx.hash,
        `${walletProviderName} - evm`,
      );
    };

    const hash = await runSaleTransaction({
      chain: provider.networkId,
      openNotification,
      to: naviveIdoAddress,
      data,
      value,
      dispatch: thunkApi.dispatch,
      provider,
      afterConfirm: afterInitState,
    });
    if (hash) {
      thunkApi.dispatch(
        updateContractInfo({ wallet: provider.address, networkId: provider.networkId }),
      );
      thunkApi.dispatch(createEvent({ hash, wallet: provider.address }));

      const balanceAfter = await storageContract.userFundsByCell(roundIndex, provider.address);
      const soldAmount = new BigNumber(balanceAfter.toString())
        .minus(new BigNumber(balanceBefore.toString()))
        .dividedBy(TOKEN_PRECISION)
        .toNumber();

      if (soldAmount > 0) {
        thunkApi.dispatch(setLastPurchaseTokenAmount(soldAmount));
      }

      thunkApi.dispatch(setThanksModalIsOpen(true));
    }
  },
);

//
export const approveCollateral = createAsyncThunk(
  'tokenSale/approveCollateral',
  async (
    {
      asset,
      openNotification,
    }: {
      asset: CollateralToken;
      openNotification: FOpenNotification;
    },
    thunkApi,
  ) => {
    const provider = await getAndVerifyProvider(true);
    if (!provider || !asset?.balance) return;

    const erc20Interface = new ethers.utils.Interface(Erc20Abi);
    const spender = SaleContract.tokenIdo[provider.networkId];

    const amount = new BigNumber(asset.balance)
      .multipliedBy(new BigNumber(10).pow(asset.decimals))
      .toFixed();
    const data = erc20Interface.encodeFunctionData('approve', [spender, amount]);
    const hash = await runSaleTransaction({
      chain: provider.networkId,
      openNotification,
      to: asset.address,
      data,
      dispatch: thunkApi.dispatch,
      provider,
    });

    if (hash) {
      thunkApi.dispatch(
        updateContractInfo({ wallet: provider.address, networkId: provider.networkId }),
      );
    }
  },
);

//
export const buyWithCollateral = createAsyncThunk(
  'tokenSale/buyWithCollateral',
  async (
    {
      amount,
      vesting,
      collateral,
      refferalCode,
      openNotification,
    }: {
      amount: string;
      vesting: VestingPlan;
      collateral: string;
      refferalCode?: string;
      openNotification: FOpenNotification;
    },
    thunkApi,
  ) => {
    const provider = await getAndVerifyProvider(true);
    if (!provider) return;

    const walletProviderName = (thunkApi.getState() as RootState).sale?.wallets?.find(
      (w) => !w.isSolana,
    )?.providerName;

    const contractAddress = SaleContract.tokenIdo[provider.networkId];
    const saleInterface = new ethers.utils.Interface(TokenSaleAbi);

    const collateralDecimals = getDecimalsOfCollateral(collateral, provider.networkId);

    const realAmount = new BigNumber(amount)
      .multipliedBy(new BigNumber(10).pow(collateralDecimals))
      .toFixed();

    const data = saleInterface.encodeFunctionData('payUSD', [
      collateral,
      realAmount,
      vesting,
      refferalCode || '',
    ]);

    const afterInitState = (tx: ethers.providers.TransactionResponse | undefined): void => {
      if (!tx) return;

      sendCollateralAnalyticsEvent(
        thunkApi,
        amount,
        provider.address,
        collateral,
        provider.networkId,
        tx.hash,
        `${walletProviderName} - evm`,
      );
    };

    const hash = await runSaleTransaction({
      chain: provider.networkId,
      openNotification,
      to: contractAddress,
      data,
      dispatch: thunkApi.dispatch,
      provider,
      afterConfirm: afterInitState,
    });

    if (hash) {
      thunkApi.dispatch(
        updateContractInfo({ wallet: provider.address, networkId: provider.networkId }),
      );

      thunkApi.dispatch(createEvent({ hash, wallet: provider.address }));

      thunkApi.dispatch(setThanksModalIsOpen(true));
    }
  },
);

export const buyWithCustomCollateral = createAsyncThunk(
  'tokenSale/buyWithCustomCollateral',
  async (
    {
      amount,
      vesting,
      collateral,
      refferalCode,
      openNotification,
    }: {
      amount: string;
      vesting: VestingPlan;
      collateral: string;
      refferalCode?: string;
      openNotification: FOpenNotification;
    },
    thunkApi,
  ) => {
    const provider = await getAndVerifyProvider(true);
    if (!provider) return;

    const walletProviderName = (thunkApi.getState() as RootState).sale?.wallets?.find(
      (w) => !w.isSolana,
    )?.providerName;

    const contractAddress = SaleContract.customIdo[provider.networkId];
    const saleInterface = new ethers.utils.Interface(CustomTokenAbi);

    const collateralDecimals = getDecimalsOfCollateral(collateral, provider.networkId);

    const realAmount = new BigNumber(amount)
      .multipliedBy(new BigNumber(10).pow(collateralDecimals))
      .toFixed();

    const data = saleInterface.encodeFunctionData('payTokens', [
      collateral,
      realAmount,
      vesting,
      refferalCode || '',
    ]);

    const afterInitState = (tx: ethers.providers.TransactionResponse | undefined): void => {
      if (!tx) return;

      sendCollateralAnalyticsEvent(
        thunkApi,
        amount,
        provider.address,
        collateral,
        provider.networkId,
        tx.hash,
        `${walletProviderName} - evm`,
      );
    };

    const hash = await runSaleTransaction({
      chain: provider.networkId,
      openNotification,
      to: contractAddress,
      data,
      dispatch: thunkApi.dispatch,
      provider,
      afterConfirm: afterInitState,
    });

    if (hash) {
      thunkApi.dispatch(
        updateContractInfo({ wallet: provider.address, networkId: provider.networkId }),
      );

      thunkApi.dispatch(createEvent({ hash, wallet: provider.address }));

      thunkApi.dispatch(setThanksModalIsOpen(true));
    }
  },
);

//
export const redeemTokens = createAsyncThunk(
  'tokenSale/redeemTokens',
  async (
    {
      chain,
      contractAddress,
      switchWalletChain,
      referralCode,
      deadline,
      signature,
    }: {
      chain: number;
      contractAddress: string;
      switchWalletChain: (chain: number) => any;
      referralCode: string;
      deadline: number;
      signature: {
        v: any;
        r: any;
        s: any;
      };
    },
    thunkApi,
  ) => {
    try {
      const provider = await getAndVerifyProvider(true);
      if (!provider) return;

      if (provider.networkId !== chain) {
        await switchWalletChain(chain);
        return;
      }

      const addresses = CollateralsByChain[provider.networkId].map((el) => el.address);

      const saleInterface = new ethers.utils.Interface(StorageAbi);
      const data = saleInterface.encodeFunctionData('claimRefCode', [
        addresses,
        referralCode || '',
        deadline,
        signature.v,
        signature.r,
        signature.s,
      ]);
      const hash = await runSaleTransaction({
        chain: provider.networkId,
        to: contractAddress,
        data,
        dispatch: thunkApi.dispatch,
        provider,
      });

      if (hash) {
        thunkApi.dispatch(getReferralInfo({ referralCode }));
      }
    } catch (e) {
      console.warn(e);
    }
  },
);

export const signMessage = async (): Promise<boolean> => {
  try {
    const provider = await getAndVerifyProvider(true);
    if (!provider) return false;

    const signer = provider.provider.getSigner();
    await retryWrapper(() =>
      signer.signMessage(
        'Sign a gasless tx to prove you are the owner of this account. No funds will be transferred',
      ),
    );

    return true;
  } catch {
    return false;
  }
};
