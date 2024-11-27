import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import {
  CHAINLINK_ORACLE_DECIMALS,
  GlobalChainId,
  PEGGED_ETH_ID,
  PriceOracles,
  SHIB_TOKEN_ID,
  SaleAvailableChains,
  WRAPPED_ETH_ID,
} from '@/shared';

import { NativePriceInfo } from '../model/types';

import { OracleAbi } from './abis/OracleAbi';
import { handleMulticallLowLevel, retryWrapper } from './helpers';

const skipChains = [11155111, 42161, 10, 8453, 59144, 81457, 324];

export const getBatchNativePrices = async (): Promise<NativePriceInfo[] | undefined> => {
  try {
    const sourceNetwork = 1;

    const data: any[] = [];

    const fetchChainIds = [...SaleAvailableChains, GlobalChainId.solana, SHIB_TOKEN_ID];
    if (!fetchChainIds.includes(1)) fetchChainIds.push(1);

    const fetchChains = fetchChainIds.filter((chain) => !skipChains.includes(Number(chain)));

    fetchChains.forEach((chain) => {
      const contract = new ethers.Contract(PriceOracles[chain as number], OracleAbi);
      data.push({ contract, function: 'latestAnswer', params: [] });
    });

    const results: NativePriceInfo[] = await retryWrapper(
      (provider) => handleMulticallLowLevel(provider, sourceNetwork, data),
      sourceNetwork,
    );

    const parsed = results.map((raw: any, idx: number) => {
      let price;
      if (Number(fetchChains[idx]) === SHIB_TOKEN_ID) {
        price = new BigNumber(raw.toString()).dividedBy(new BigNumber(10).pow(18)).toFixed();
      } else {
        price = new BigNumber(raw.toString())
          .dividedBy(new BigNumber(10).pow(CHAINLINK_ORACLE_DECIMALS))
          .toFixed();
      }

      return {
        chain: Number(fetchChains[idx]),
        price: price,
      };
    });

    const ethPrice = parsed.find((el) => el.chain === 1)?.price || 0;
    const parsedResult: {
      price: number;
      chain: number;
    }[] = parsed.map((p) => {
      if (p.chain === SHIB_TOKEN_ID) {
        const price = new BigNumber(p.price).multipliedBy(ethPrice).toNumber();
        return {
          ...p,
          price,
        };
      }
      return {
        ...p,
        price: Number(p.price),
      };
    });
    parsedResult.push({
      chain: PEGGED_ETH_ID,
      price: Number(ethPrice),
    });
    parsedResult.push({
      chain: WRAPPED_ETH_ID,
      price: Number(ethPrice),
    });

    const duplicates = skipChains.map((c) => ({
      chain: Number(c),
      price: Number(ethPrice),
    }));

    return [...parsedResult, ...duplicates];
  } catch (e) {
    console.warn('ERROR getBatchNativePrices', e);
  }
};
