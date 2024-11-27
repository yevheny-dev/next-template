/* eslint-disable prefer-const */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import { RootState } from '@/app/store';
import {
  CollateralsByChain,
  CryptoPaymentUsdAppendix,
  DEFAULT_NETWORK_FOR_FETCH,
  DefaultCollateralReferral,
  DefaultTokenReferral,
  ETH_ADDRESS,
  PEGGED_ETH_ID,
  PegETHAddress,
  SALE_PRECISION,
  SALE_REWARD_INFO_PRECISION,
  SHIBAddress,
  SHIB_TOKEN_ID,
  SaleApi,
  SaleAvailableChains,
  SaleContract,
  TOKEN_PRECISION,
  WETHaddress,
  WRAPPED_ETH_ID,
  ZERO_ADDRESS,
} from '@/shared';

import { Erc20Abi } from '../utils/abis/Erc20Abi';
import { NativeSaleAbi } from '../utils/abis/NativeSaleAbi';
import { StorageAbi } from '../utils/abis/StorageAbi';
import {
  getSaleParametersFromLocation,
  handleMulticallLowLevel,
  retryWrapper,
} from '../utils/helpers';

import {
  CollateralToken,
  MulticallParams,
  NativePriceInfo,
  WertConfig,
  WertRequestParams,
} from './types';
import { getSolanaTotalSoldTokens } from './web3-fetchers.sol';

export const getTotalSoldTokens = createAsyncThunk(
  'tokenSale/getTotalSoldTokens',
  async (
    {
      activeRoundIndex,
    }: {
      activeRoundIndex?: number;
    },
    thunkApi,
  ): Promise<{ tokens: number; usd: number }> => {
    thunkApi.dispatch(getSolanaTotalSoldTokens({}));

    let totalSold = new BigNumber(0);
    let totalSoldUsd = new BigNumber(0);

    let roundIndex = activeRoundIndex;
    if (!roundIndex) {
      const rawIndex = await retryWrapper(async (provider) => {
        const contract = new ethers.Contract(
          SaleContract.idoStorage[DEFAULT_NETWORK_FOR_FETCH],
          StorageAbi,
          provider,
        );
        return await contract.getCurrentCell();
      }, DEFAULT_NETWORK_FOR_FETCH);

      roundIndex = Number(rawIndex.toString());
    }

    await Promise.all(
      SaleAvailableChains.map(async (networkId) => {
        const chain = networkId as number;
        const storageAddress = SaleContract.idoStorage[chain];

        if (!storageAddress) {
          return;
        }

        try {
          const round = await retryWrapper(async (provider) => {
            const contract = new ethers.Contract(storageAddress, StorageAbi, provider);
            return await contract.getCell(roundIndex);
          }, chain);

          const sold = new BigNumber(round.sold.toString());
          const soldUsd = sold.multipliedBy(new BigNumber(round.lPrice.toString()));

          totalSold = totalSold.plus(sold);
          totalSoldUsd = totalSoldUsd.plus(soldUsd);
        } catch (e) {
          console.warn(`Chain ${chain} sold tokens calculating error: ${e}`);
        }
      }),
    );

    const tokens = totalSold
      .dividedBy(TOKEN_PRECISION)
      .decimalPlaces(0, BigNumber.ROUND_FLOOR)
      .toNumber();

    let usd = totalSoldUsd
      .dividedBy(TOKEN_PRECISION)
      .dividedBy(TOKEN_PRECISION)
      .decimalPlaces(0, BigNumber.ROUND_FLOOR)
      .toNumber();

    return { usd, tokens };
  },
);

const handleContractInfoMulticall = async (
  networkId: number,
  wallet?: string,
  referralCode?: string,
): Promise<any> => {
  try {
    const storage = new ethers.Contract(SaleContract.idoStorage[networkId], StorageAbi);
    const native = new ethers.Contract(SaleContract.nativeIdo[networkId], NativeSaleAbi);

    let data: MulticallParams[] = [];

    if (wallet) {
      data = [
        { contract: storage, function: 'limitOf', params: [wallet] },
        { contract: storage, function: 'maxLimitOf', params: [wallet] },
      ];
    }

    data = data.concat([
      {
        contract: storage,
        function: 'getRefCodeRates',
        params: [referralCode || ''],
      },
      { contract: storage, function: 'getCurrentCell', params: [] },
      { contract: storage, function: 'getMinAmountIn', params: [] },
      { contract: storage, function: 'getMaxAmountIn', params: [] },
      { contract: storage, function: 'getValidatedLimit', params: [] },
      { contract: storage, function: 'getGlobalStatus', params: [] },
      { contract: storage, function: 'getAdditionalRewardInfo', params: [] },
      { contract: native, function: 'paused', params: [] },
    ]);

    const result = await retryWrapper(
      (provider) => handleMulticallLowLevel(provider, networkId, data),
      networkId,
    );

    return wallet ? result : ['0', '0', ...result];
  } catch (e) {
    console.warn(`muticall error ${e}`);
  }
};

export const getContractInfo = createAsyncThunk(
  'tokenSale/getContractInfo',
  async ({
    wallet,
    networkId,
    referralCode,
  }: {
    networkId?: number;
    wallet?: string;
    referralCode?: string;
  }) => {
    if (!networkId) return;

    const storageAddress = SaleContract.idoStorage[networkId];
    if (!storageAddress) {
      return;
    }

    try {
      let [
        userCap,
        maxUserCap,
        referralRewardPercentInfo,
        activeRound,
        minInvestment,
        maxInvestment,
        kycLimit,
        globalStatus,
        additionalRewardInfo,
        isPaused,
      ] = await handleContractInfoMulticall(networkId, wallet, referralCode);

      const isPausedNative = Boolean(isPaused);
      const isPausedErc = Boolean(isPaused);

      const referralRewardPercent = {
        collateral: DefaultCollateralReferral,
        token: DefaultTokenReferral,
      };

      if (Array.isArray(referralRewardPercentInfo)) {
        const rewardC = new BigNumber(referralRewardPercentInfo[0].toString())
          .dividedBy(SALE_REWARD_INFO_PRECISION)
          .decimalPlaces(2, BigNumber.ROUND_FLOOR)
          .toNumber();

        const rewardD = new BigNumber(referralRewardPercentInfo[1].toString())
          .dividedBy(SALE_REWARD_INFO_PRECISION)
          .decimalPlaces(2, BigNumber.ROUND_FLOOR)
          .toNumber();

        if (rewardC) {
          referralRewardPercent.collateral = rewardC;
        }
        if (rewardD) {
          referralRewardPercent.token = rewardD;
        }
      } else {
        const reward = new BigNumber(referralRewardPercentInfo.toString())
          .dividedBy(SALE_REWARD_INFO_PRECISION)
          .decimalPlaces(2, BigNumber.ROUND_FLOOR)
          .toNumber();

        if (reward) {
          referralRewardPercent.collateral = reward;
          referralRewardPercent.token = reward;
        }
      }

      // @ts-ignore
      const volumeBonusThresholds = additionalRewardInfo?.map(([, threshold]) => {
        return new BigNumber(threshold?.toString())
          .dividedBy(SALE_PRECISION)
          .decimalPlaces(2, BigNumber.ROUND_FLOOR)
          .toNumber();
      });

      // @ts-ignore
      const volumeBonusPercents = additionalRewardInfo?.map(([percent]) => {
        return new BigNumber(percent?.toString())
          .dividedBy(SALE_PRECISION)
          .multipliedBy(100)
          .decimalPlaces(2, BigNumber.ROUND_FLOOR)
          .toNumber();
      });

      activeRound = Number(activeRound);

      let currentRoundPriceLong = 0,
        currentRoundPriceShort = 0,
        currentRoundSupply = 0,
        currentRoundActive = false;

      try {
        const roundInfo = await retryWrapper(async (provider) => {
          const contract = new ethers.Contract(storageAddress, StorageAbi, provider);
          return await contract.getCell(activeRound);
        }, networkId);

        currentRoundPriceLong = new BigNumber(roundInfo.lPrice.toString())
          .dividedBy(SALE_PRECISION)
          .decimalPlaces(6, BigNumber.ROUND_FLOOR)
          .toNumber();
        currentRoundPriceShort = new BigNumber(roundInfo.sPrice.toString())
          .dividedBy(SALE_PRECISION)
          .decimalPlaces(6, BigNumber.ROUND_FLOOR)
          .toNumber();
        currentRoundSupply = new BigNumber(roundInfo.supply.toString())
          .dividedBy(TOKEN_PRECISION)
          .decimalPlaces(2, BigNumber.ROUND_FLOOR)
          .toNumber();
        currentRoundActive = Number(roundInfo.cellState) === 1;
      } catch {
        // Round is not defined
        currentRoundActive = false;
      }

      let nextRoundPrice = currentRoundPriceShort;

      try {
        const roundInfo = await retryWrapper(async (provider) => {
          const contract = new ethers.Contract(storageAddress, StorageAbi, provider);
          return await contract.getCell(activeRound + 1);
        }, networkId);

        nextRoundPrice = new BigNumber(roundInfo.lPrice.toString())
          .dividedBy(SALE_PRECISION)
          .decimalPlaces(6, BigNumber.ROUND_FLOOR)
          .toNumber();
      } catch {
        // Next round is not defined
      }

      activeRound += 1;

      userCap = new BigNumber(userCap.toString())
        .dividedBy(SALE_PRECISION)
        .decimalPlaces(2, BigNumber.ROUND_FLOOR)
        .toNumber();

      maxUserCap = new BigNumber(maxUserCap.toString())
        .dividedBy(SALE_PRECISION)
        .decimalPlaces(2, BigNumber.ROUND_FLOOR)
        .toNumber();

      minInvestment = new BigNumber(minInvestment.toString())
        .dividedBy(SALE_PRECISION)
        .decimalPlaces(2, BigNumber.ROUND_FLOOR)
        .toNumber();

      maxInvestment = new BigNumber(maxInvestment.toString())
        .dividedBy(SALE_PRECISION)
        .decimalPlaces(2, BigNumber.ROUND_FLOOR)
        .toNumber();

      kycLimit = new BigNumber(kycLimit.toString())
        .dividedBy(SALE_PRECISION)
        .decimalPlaces(2, BigNumber.ROUND_FLOOR)
        .toNumber();

      // globalStatus = 0 -> 'none'
      // globalStatus = 1 -> 'opened'
      // globalStatus = 2 -> 'closed'

      const isPossibleToBuy =
        globalStatus === 1 &&
        !(isPausedNative && isPausedErc) &&
        currentRoundActive &&
        userCap !== 0;

      const monoVestingMode = currentRoundPriceShort === currentRoundPriceLong;

      return {
        nextRoundPrice,
        currentRoundPriceLong,
        currentRoundPriceShort,
        currentRoundSupply,
        currentRoundActive,
        monoVestingMode,
        userCap,
        maxUserCap,
        activeRound,
        minInvestment: minInvestment + CryptoPaymentUsdAppendix,
        maxInvestment,
        kycLimit,
        isOpened: globalStatus === 1,
        isClosed: globalStatus === 2,
        isPausedNative,
        isPausedErc,
        isPossibleToBuy,
        referralRewardPercent,
        buyBonusesInfo: {
          thresholds: [0, ...volumeBonusThresholds],
          percents: [0, ...volumeBonusPercents],
        },
      };
    } catch (e) {
      console.warn(e);
      return;
    }
  },
);

export const updateContractInfo = createAsyncThunk(
  'tokenSale/updateContractInfo',
  async ({ wallet, networkId }: { wallet: string; networkId: number }, thunkApi) => {
    try {
      const storage = new ethers.Contract(SaleContract.idoStorage[networkId], StorageAbi);

      const data = [
        { contract: storage, function: 'limitOf', params: [wallet] },
        { contract: storage, function: 'maxLimitOf', params: [wallet] },
      ];

      const result = await retryWrapper(
        (provider) => handleMulticallLowLevel(provider, networkId, data),
        networkId,
      );

      const userCap = new BigNumber(result[0].toString())
        .dividedBy(SALE_PRECISION)
        .decimalPlaces(2, BigNumber.ROUND_FLOOR)
        .toNumber();

      const maxUserCap = new BigNumber(result[1].toString())
        .dividedBy(SALE_PRECISION)
        .decimalPlaces(2, BigNumber.ROUND_FLOOR)
        .toNumber();

      const round = (thunkApi.getState() as RootState).sale?.activeRound - 1;
      thunkApi.dispatch(getTotalSoldTokens({ activeRoundIndex: round }));

      return { userCap, maxUserCap };
    } catch (e) {
      console.warn(e);
      return;
    }
  },
);

export const getSaleTokensBalances = createAsyncThunk(
  'tokenSale/getSaleTokensBalances',
  async (props: { wallet?: string; networkId: number; prices?: NativePriceInfo[] }, thunkApi) => {
    const prices = props?.prices || (thunkApi.getState() as RootState).sale?.nativePrices;
    try {
      let { wallet, networkId } = props;

      if (!wallet) {
        const defaultRes = CollateralsByChain[networkId].map((el) => ({
          ...el,
          price:
            el.address === ETH_ADDRESS
              ? prices?.find((price) => price?.chain === networkId)?.price || 0
              : el.address === SHIBAddress
                ? prices?.find((price) => price?.chain === SHIB_TOKEN_ID)?.price || 0
                : el.address === PegETHAddress
                  ? prices?.find((price) => price?.chain === PEGGED_ETH_ID)?.price || 0
                  : 1,
        }));

        return defaultRes;
      }

      if (!networkId) {
        networkId = DEFAULT_NETWORK_FOR_FETCH;
      }

      const balancesToGet = CollateralsByChain[networkId]?.filter(
        (el) => ETH_ADDRESS !== el.address && !el.disable,
      );

      if (!balancesToGet) {
        return [];
      }

      const spender = SaleContract.tokenIdo[networkId] || ZERO_ADDRESS;

      let data: MulticallParams[] = [];

      balancesToGet.forEach(async (item) => {
        const token = new ethers.Contract(item.address, Erc20Abi);
        data.push({ contract: token, function: 'balanceOf', params: [wallet as string] });
        data.push({ contract: token, function: 'allowance', params: [wallet as string, spender] });
      });

      const [ethBalanceRow, tokenDataRow] = await Promise.all([
        retryWrapper(
          (provider) =>
            (provider as ethers.providers.StaticJsonRpcProvider).getBalance(wallet as string),
          networkId,
        ),
        retryWrapper(
          (provider) => handleMulticallLowLevel(provider, networkId as number, data),
          networkId,
        ),
      ]);

      const nativeCollateral = CollateralsByChain[networkId].find(
        (el) => ETH_ADDRESS === el.address,
      );
      const ethBalance = new BigNumber(ethBalanceRow.toString())
        .dividedBy(new BigNumber(10).pow(18))
        .decimalPlaces(6, BigNumber.ROUND_FLOOR)
        .toNumber();

      const ethPrice = prices?.find((el) => el.chain === networkId)?.price || 0;
      const shibPrice = prices?.find((el) => el.chain === SHIB_TOKEN_ID)?.price || 0;
      const pegEthPrice = prices?.find((el) => el.chain === PEGGED_ETH_ID)?.price || 0;
      const WEthPrice = prices?.find((el) => el.chain === WRAPPED_ETH_ID)?.price || 0;

      const balances: CollateralToken[] = [
        {
          ...(nativeCollateral as CollateralToken),
          balance: ethBalance,
          price: ethPrice,
          usdBalance: ethPrice * ethBalance,
          allowance: null,
        },
      ];

      balancesToGet.forEach((item, index) => {
        const balanceRow = tokenDataRow[index * 2];
        const allowanceRow = tokenDataRow[index * 2 + 1];

        const balance = new BigNumber(balanceRow.toString())
          .dividedBy(new BigNumber(10).pow(item.decimals))
          .toFixed();

        const pegETHItem = item.address === PegETHAddress ? item : null;
        const pegETHUsdBalance = new BigNumber(balanceRow.toString())
          .dividedBy(new BigNumber(10).pow(item.decimals))
          .multipliedBy(pegEthPrice)
          .toFixed();

        const shibItem = item.address === SHIBAddress ? item : null;
        const shibUsdBalance = new BigNumber(balanceRow.toString())
          .dividedBy(new BigNumber(10).pow(item.decimals))
          .multipliedBy(shibPrice)
          .toFixed();

        const WETHItem = item.address === WETHaddress ? item : null;
        const WethUsdBalance = new BigNumber(balanceRow.toString())
          .dividedBy(new BigNumber(10).pow(item.decimals))
          .multipliedBy(WEthPrice)
          .toFixed();

        const usdBalance = pegETHItem
          ? Number(pegETHUsdBalance)
          : shibItem
            ? Number(shibUsdBalance)
            : WETHItem
              ? Number(WethUsdBalance)
              : Number(balance);

        const price = pegETHItem ? pegEthPrice : shibItem ? shibPrice : WETHItem ? ethPrice : 1;

        const allowance = new BigNumber(allowanceRow.toString()).dividedBy(
          new BigNumber(10).pow(item.decimals),
        );

        balances.push({
          ...item,
          balance: Number(balance),
          price,
          usdBalance,
          allowance,
        });
      });

      return balances;
    } catch (e) {
      console.warn(e);
      return CollateralsByChain[props?.networkId || DEFAULT_NETWORK_FOR_FETCH];
    }
  },
);

export const checkForSaleUrlParameters = createAsyncThunk(
  'tokenSale/saleParamsSet',
  async (location: any) => {
    try {
      return getSaleParametersFromLocation(location);
    } catch (e) {
      console.warn(`sale params parse error: ${e}`);
      return null;
    }
  },
);

export const createWertConfig = async (params: WertRequestParams): Promise<WertConfig | null> => {
  try {
    const response = await axios.post(`${SaleApi}/fiat/sign`, params);
    return response.data || null;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getRestrictStatus = createAsyncThunk('tokenSale/getRestrictStatus', async () => {
  try {
    try {
      await axios.get(window.origin + '/ERwwDeInzg4cQrJy77.json');
      return false;
    } catch (e) {
      return (e as any)?.response?.status === 403;
    }
  } catch (e) {
    console.warn(`sale params parse error: ${e}`);
    return false;
  }
});
