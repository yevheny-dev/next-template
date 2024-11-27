import { createAsyncThunk } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import { RootState } from '@/app/store';
import {
  SaleContract,
  CollateralsByChain,
  TOKEN_ADDRESS,
  ETH_ADDRESS,
  SaleAvailableChains,
} from '@/shared';

import { StorageAbi } from '../utils/abis/StorageAbi';
import { retryWrapper, handleMulticallLowLevelWithInputs } from '../utils/helpers';

import {
  NativePriceInfo,
  RewardToken,
  MulticallParams,
  ReferralRewardInfo,
  MulticallResult,
} from './types';

const getContractCalls = (
  collaterals: string[],
  referralCode: string,
  storageAddress: string,
): MulticallParams[] => {
  if (!storageAddress) return [];

  const storage = new ethers.Contract(storageAddress, StorageAbi);
  return collaterals.map((collateral) => ({
    contract: storage,
    function: 'codeBalanceOf',
    params: [collateral, referralCode || ''],
  }));
};

const handleReferralInfoMulticall = async (
  chain: number,
  referralCode: string,
  prices: NativePriceInfo[],
): Promise<{
  tokens: RewardToken[];
  tokensEarned: number;
  usdEarned: number;
  storages: string[];
} | null> => {
  try {
    const storageAddress = SaleContract.idoStorage[chain];

    const collaterals = [...CollateralsByChain[chain].map((el) => el.address), TOKEN_ADDRESS];

    const data: MulticallParams[] = getContractCalls(collaterals, referralCode, storageAddress);

    const multicallResult: MulticallResult[] = await retryWrapper(
      (provider) => handleMulticallLowLevelWithInputs(provider, chain, data),
      chain,
    );

    const results: RewardToken[] = CollateralsByChain[chain].map((ct) => ({
      ...ct,
      address: ct.address.toLowerCase(),
      balance: 0,
      usdBalance: 0,
    }));

    const storages: string[] = [];
    let tokensEarned = 0;
    let usdEarned = 0;

    multicallResult.forEach(({ res, req }) => {
      const storage = req.contract.address.toLowerCase();
      const collateral = (req.params[0] as string).toLowerCase();
      const tokenIndex = results.findIndex((ct) => ct.address === collateral);
      const decimals = tokenIndex === -1 ? 18 : results[tokenIndex].decimals;

      const balance = new BigNumber(res.toString())
        .dividedBy(new BigNumber(10).pow(decimals))
        .decimalPlaces(5, BigNumber.ROUND_FLOOR);

      if (collateral === TOKEN_ADDRESS.toLowerCase()) {
        tokensEarned += balance.toNumber();
      } else {
        let price = 1;
        if (collateral === ETH_ADDRESS.toLowerCase()) {
          price = prices.find((np) => np.chain === chain)?.price || 0;
        }

        const balanceUsd = balance
          .multipliedBy(price)
          .decimalPlaces(2, BigNumber.ROUND_FLOOR)
          .toNumber();

        results[tokenIndex].balance += balance.toNumber();
        results[tokenIndex].usdBalance += balanceUsd;

        if (balanceUsd > 0 && !storages.includes(storage)) {
          storages.push(storage);
        }

        usdEarned += balanceUsd;
      }
    });

    return { tokens: results, tokensEarned, usdEarned, storages };
  } catch (e) {
    console.warn(`muticall error ${e}`);
    return null;
  }
};

export const getReferralInfo = createAsyncThunk(
  'tokenSale/getReferralInfo',
  async (
    { referralCode, prices }: { referralCode: string | undefined; prices?: NativePriceInfo[] },
    thunkApi,
  ): Promise<ReferralRewardInfo> => {
    prices = prices || (thunkApi.getState() as RootState).sale?.nativePrices;

    try {
      let totalTokensEarned = 0;
      let totalUsdEarned = 0;

      const info = await Promise.all(
        SaleAvailableChains.map(async (networkId) => {
          const chain = networkId as number;

          const ReferralDefaultResult = {
            chain,
            balances: CollateralsByChain[Number(networkId)].map((ct) => ({
              ...ct,
              balance: 0,
              usdBalance: 0,
            })),
            storages: [] as string[],
          };

          if (!referralCode) {
            return ReferralDefaultResult;
          }

          const multicallResults = await handleReferralInfoMulticall(
            chain,
            referralCode,
            prices || [],
          );
          if (!multicallResults) {
            return ReferralDefaultResult;
          }

          totalTokensEarned += multicallResults.tokensEarned;
          totalUsdEarned += multicallResults.usdEarned;

          return { chain, balances: multicallResults.tokens, storages: multicallResults.storages };
        }),
      );

      return {
        totalUsdEarned,
        totalTokensEarned,
        byChain: info,
      };
    } catch (e) {
      console.warn(e);
      return { totalTokensEarned: 0, totalUsdEarned: 0, byChain: [] };
    }
  },
);
