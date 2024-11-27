import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { DefaultReferralLeaderboardItemsCount, SaleApi } from '@/shared';

import { LeaderboardItem } from './types';

const getLeaderboard = async (
  page: number,
  size: number,
  q?: string,
): Promise<LeaderboardItem[]> => {
  try {
    const url = `${SaleApi}/partner/stats?page=${page}&size=${size}${q ? `&q=${q}` : ''}`;
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.warn(`Leaderboard fetching error: ${e}`);
    return [];
  }
};

export const getReferralLeaderboard = createAsyncThunk(
  'tokenSale/getReferralLeaderboard',
  async ({ page, query }: { page: number; query?: string }) => {
    try {
      return await getLeaderboard(page, DefaultReferralLeaderboardItemsCount, query);
    } catch (e) {
      console.warn(e);
      return [];
    }
  },
);

export const getLeaderboardPersonalInfo = createAsyncThunk(
  'tokenSale/getLeaderboardPersonalInfo',
  async ({ code }: { code: string }) => {
    try {
      const url = `${SaleApi}/partner/stats?page=1&size=1&code=${code}`;
      const response = await axios.get(url);
      return response.data[0];
    } catch (e) {
      console.warn(`Leaderboard fetching error: ${e}`);
      return [];
    }
  },
);
