import axios from 'axios';

import { PURCHASE } from '@/app/analytics/actionTypes';
import { RootState } from '@/app/store';
import { ETH_ADDRESS, getChainName, StatsApi } from '@/shared';

import { getCollateral, getUtmParametersFromSaleParameters } from '../utils/helpers';

export const sendNativeAnalyticsEvent = async (
  thunkApi: any,
  amountNative: number,
  address: string,
  network: number,
  hash: string,
  walletType: string,
): Promise<void> => {
  try {
    const state = (thunkApi.getState() as RootState).sale;
    const prices = state?.nativePrices || [];
    const price = prices.find((price) => price.chain === network)?.price || 0;
    const utmData = getUtmParametersFromSaleParameters(state?.saleUrlParameters);
    const urlParams = new URLSearchParams(window.location.search);
    const twClickId = state?.saleUrlParameters?.clickid || urlParams.has('clickid') || undefined;

    const sold = (price * amountNative).toFixed(2);

    const browserLanguage = navigator.language;

    const eventBody = {
      address,
      value: parseFloat(sold),
      currency: 'USD',
      transaction_id: hash,
      chain_name: getChainName(network),
      token_name: getCollateral(ETH_ADDRESS, network)?.symbol,
      wallet_type: walletType,
      language: browserLanguage,
      ...utmData,
    };

    thunkApi.dispatch({
      type: PURCHASE,
      payload: eventBody,
    });


    if (StatsApi) {
      try {
        const url = `${StatsApi}/stats`;
        await axios.post(url, { ...eventBody, twClickId });
      } catch (e) {
        console.warn(`Analytics error: ${e}`);
        throw new Error(`Native Analytics Event Send Error: ${e}`);
      }
    }
  } catch (e) {
    console.warn(`Native Analytics Event Send Error: ${e}`);
    throw new Error(`Native Analytics Event Send Error (StatsApi): ${e}`);
  }
};

export const sendCollateralAnalyticsEvent = async (
  thunkApi: any,
  amount: string,
  address: string,
  token: string,
  network: number,
  hash: string,
  walletType: string,
): Promise<void> => {
  try {
    const state = (thunkApi.getState() as RootState).sale;
    const saleParams: any = (thunkApi.getState() as RootState).sale?.saleUrlParameters;
    const utmData = getUtmParametersFromSaleParameters(saleParams);
    const sold = Number(amount).toFixed(2);
    const urlParams = new URLSearchParams(window.location.search);
    const twClickId = state?.saleUrlParameters?.clickid || urlParams.has('clickid') || undefined;

    const browserLanguage = navigator.language;

    const eventBody = {
      address,
      value: parseFloat(sold),
      currency: 'USD',
      transaction_id: hash,
      chain_name: getChainName(network),
      token_name: getCollateral(token, network)?.symbol,
      wallet_type: walletType,
      language: browserLanguage,

      ...utmData,
    };

    thunkApi.dispatch({
      type: PURCHASE,
      payload: eventBody,
    });

    if (StatsApi) {
      try {
        const url = `${StatsApi}/stats`;
        await axios.post(url, { ...eventBody, twClickId });
      } catch (e) {
        console.warn(`Analytics error: ${e}`);
      }
    }
  } catch (e) {
    console.warn(`Collateral Analytics Event Send Error: ${e}`);
  }
};

export const saveUserStats = (address: string, wallet?: string): void => {
  const url = `${StatsApi}/welcome?address=${address}&locale=${navigator.language}&wallet=${wallet}`;
  axios.get(url).catch((e) => console.warn(`User Stats Send Error: ${e}`));
};
