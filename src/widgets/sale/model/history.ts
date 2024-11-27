import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { ETH_ADDRESS, SaleApi, ZERO_ADDRESS, GlobalChainId } from '@/shared';

import { getCollateral } from '../utils/helpers';

import { PurchaseHistoryItem } from './types';

const parseEvents = (result: any) => {
  return result?.map((he: any) => ({
    id: he?.id,
    name: 'Invest',
    chain: he?.chain === -1 ? GlobalChainId.solana : he?.chain,
    blockTimestamp: he?.blockTimestamp,
    transactionHash: he?.transactionHash,
    round: he?.round,
    purchaser: he?.purchaser,
    timestamp: new Date(he?.blockTimestamp * 1000),
    blockNumber: he?.blockNumber,
    price: he?.price,
    vesting: 0,
    collateral: getCollateral(he?.token === ZERO_ADDRESS ? ETH_ADDRESS : he?.token, he?.chain),
    investment: he?.amount,
    tokensSold: he?.tokensSold,
    usdEarned: he?.usdearned,
    tokensEarned: he?.tokensearned,
  }));
};

export const getUserPurchaseHistory = createAsyncThunk(
  'tokenSale/getUserPurchaseHistory',
  async ({
    walletSol,
    walletEvm,
  }: {
    walletSol: string | undefined;
    walletEvm: string | undefined;
  }): Promise<
    | {
        history: PurchaseHistoryItem[];
        totalClaimed: number;
        totalPurchased: number;
      }
    | undefined
  > => {
    if (!walletSol && !walletEvm) return;
    try {
      const p1 = walletSol ? `sol=${walletSol}&` : '';
      const p2 = walletEvm ? `evm=${walletEvm}` : '';
      const url = `${SaleApi}/txs/purchases?${p1}${p2}`;
      const response = await axios.get(url);
      const result = response?.data;

      return {
        history: parseEvents(result?.purchaseHistory),
        totalPurchased: result.totalPurchasedTokens,
        totalClaimed: result.totalClaimedUsd,
      };
    } catch (e) {
      console.warn('ERROR getUserPurchaseHistory', e);
    }
  },
);

export const getUserReferralPurchaseHistory = createAsyncThunk(
  'tokenSale/getUserReferralPurchaseHistory',
  async ({
    code,
  }: {
    code: string;
  }): Promise<
    | {
        history: PurchaseHistoryItem[];
      }
    | undefined
  > => {
    if (!code) return;
    try {
      const url = `${SaleApi}/txs/purchases/partner?code=${code}`;
      const response = await axios.get(url);
      const result = response.data;
      return {
        history: parseEvents(result),
      };
    } catch (e) {
      console.warn('ERROR getUserReferralPurchaseHistory', e);
    }
  },
);

export const getLatestPurchases = createAsyncThunk(
  'tokenSale/getLatestPurchases',
  async (): Promise<
    | {
        history: PurchaseHistoryItem[];
      }
    | undefined
  > => {
    try {
      const url = `${SaleApi}/txs/purchases/latest?amount=5`;
      const response = await axios.get(url);
      const result = response.data;
      return {
        history: parseEvents(result),
      };
    } catch (e) {
      console.warn('ERROR getLatestPurchases', e);
    }
  },
);
