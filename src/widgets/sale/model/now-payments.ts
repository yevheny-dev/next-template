import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { NotificationType } from '@/shared';

import { isNumericString, retryWrapper } from '../utils/helpers';

import { NOW_PAYMENTS_ENDPOINT, NowPaymentsChains } from './now-payments.constants';
import { ICurrencies, IPayment, NowPaymentsStatuses } from './now-payments.types';
import {
  setBoughtTokens,
  setIsLoadingNowPayments,
  setIsNowPaymentsModalOpen,
  setNowPaymentsOrder,
  setNowPaymentsState,
  setOpenNotificationType,
  setThanksModalIsOpen,
} from './slice';
import { PurchaseHistoryItem } from './types';
import { ethers } from 'ethers';

export const getNowPaymentsCurrencies = createAsyncThunk(
  'tokenSale/getNowPaymentsCurrencies',
  async (): Promise<ICurrencies[] | undefined> => {
    const GET_CURRENCIES_QUERY = `{
				currencies {
					id,
					code,
					name,
					logoUrl,
				}
			}
		`;
    try {
      const response = await retryWrapper(() =>
        axios.post(NOW_PAYMENTS_ENDPOINT, {
          query: GET_CURRENCIES_QUERY,
        }),
      );
      return response?.data?.data?.currencies;
    } catch (e) {
      console.warn('ERROR in getNowPaymentsCurrencies', e);
    }
  },
);

export const getNowPayments = createAsyncThunk(
  'tokenSale/getNowPayments',
  async (
    {
      wallet,
      referral = '',
      payCurrency,
      priceAmount,
    }: {
      wallet: string;
      referral?: string;
      payCurrency: string;
      priceAmount: string;
    },
    thunkApi,
  ): Promise<void> => {
    const GET_PAYMENTS_QUERY = `query GetPayments($wallet: String!, $referral: String, $payCurrency: String!, $priceAmount: Float!) {
				payments(wallet: $wallet, referral: $referral, payCurrency: $payCurrency, priceAmount: $priceAmount) {
					id,
					wallet,
					referral,
					status,
					productId,
					productPrice,
					productAmount,
					priceCurrency,
					priceAmount,
					payAddress,
					payCurrency,
					payAmount,
					amountReceived,
					createdAt,
					expireAt,
					payinExtraId,
				}
			}
		`;

    try {
      const response = await retryWrapper(() =>
        axios.post(NOW_PAYMENTS_ENDPOINT, {
          query: GET_PAYMENTS_QUERY,
          variables: {
            wallet,
            referral,
            payCurrency,
            priceAmount: parseFloat(priceAmount),
          },
        }),
      );
      const res = response?.data?.data?.payments;
      if (res) {
        if (
          Date.now() >
          Number(
            new Date(isNumericString(res.expireAt) ? Number(res.expireAt) : res.expireAt).getTime(),
          )
        ) {
          thunkApi.dispatch(
            setNowPayments({
              wallet,
              referral,
              payCurrency,
              priceAmount,
            }),
          );
          return;
        }
        thunkApi.dispatch(setNowPaymentsOrder(res));
        thunkApi.dispatch(setIsNowPaymentsModalOpen(true));
        thunkApi.dispatch(setIsLoadingNowPayments(false));
      } else {
        thunkApi.dispatch(
          setNowPayments({
            wallet,
            referral,
            payCurrency,
            priceAmount,
          }),
        );
      }
    } catch (e) {
      console.warn('ERROR in getNowPayments', e);
    }
  },
);

export const setNowPayments = createAsyncThunk(
  'tokenSale/setNowPayments',
  async (
    {
      wallet,
      referral = '',
      payCurrency,
      priceAmount,
    }: {
      wallet: string;
      referral?: string;
      payCurrency: string;
      priceAmount: string;
    },
    thunkApi,
  ): Promise<void> => {
    const GET_PAYMENTS_QUERY = `mutation MakePayment($wallet: String!, $referral: String, $payCurrency: String!, $priceAmount: Float!) {
				payments(wallet: $wallet, referral: $referral, payCurrency: $payCurrency, priceAmount: $priceAmount) {
					id,
					wallet,
					referral,
					status,
					productId,
					productPrice,
					productAmount,
					priceCurrency,
					priceAmount,
					payAddress,
					payCurrency,
					payAmount,
					amountReceived,
					createdAt,
					expireAt,
					payinExtraId,
				}
			}
		`;

    try {
      const response = await retryWrapper(() =>
        axios.post(NOW_PAYMENTS_ENDPOINT, {
          query: GET_PAYMENTS_QUERY,
          variables: {
            wallet,
            referral,
            payCurrency,
            priceAmount: parseFloat(priceAmount),
          },
        }),
      );
      if (response?.data?.data?.payments) {
        thunkApi.dispatch(setNowPaymentsOrder(response?.data?.data?.payments));
        thunkApi.dispatch(setIsNowPaymentsModalOpen(true));
      }
    } catch (e) {
      console.warn('ERROR in setNowPayments', e);
      thunkApi.dispatch(setOpenNotificationType(NotificationType.TRANSACTION_FAILED));
    } finally {
      thunkApi.dispatch(setIsLoadingNowPayments(false));
    }
  },
);

export const getNowPaymentAmounts = createAsyncThunk(
  'tokenSale/getNowPaymentAmounts',
  async (
    {
      currencyFrom,
      currencyTo,
      amount,
    }: {
      currencyFrom: string;
      currencyTo: string;
      amount: string;
    },
    thunkApi,
  ): Promise<void> => {
    const GET_PAYMENTS_AMOUT_QUERY = `query GetPaymentAmounts($currencyFrom: String!, $currencyTo: String!, $amount: Float!) {
			  paymentAmounts(currencyFrom: $currencyFrom, currencyTo: $currencyTo, amount: $amount) {
					from,
					to,
					minAmount,
					amount,
				}
			}
		`;
    try {
      const response = await retryWrapper(() =>
        axios.post(NOW_PAYMENTS_ENDPOINT, {
          query: GET_PAYMENTS_AMOUT_QUERY,
          variables: {
            currencyFrom,
            currencyTo,
            amount: parseFloat(amount),
          },
        }),
      );
      const res = response?.data?.data?.paymentAmounts;
      if (res) {
        const amount = res?.amount;
        const minAmount = Number(Number(res?.minAmount) / (Number(amount) / 10)) || 0;

        thunkApi.dispatch(setNowPaymentsState({ minAmount: (minAmount + 2)?.toFixed(2) }));
      }
    } catch (e) {
      console.warn('ERROR in getNowPaymentAmounts', e);
    }
  },
);

export const getNowPaymenHistoryForModal = createAsyncThunk(
  'tokenSale/getNowPaymenHistory',
  async (
    {
      wallet,
      statuses,
      orderId,
    }: {
      orderId: string;
      wallet: string;
      statuses?: string[];
    },
    thunkApi,
  ): Promise<void> => {
    const GET_PAYMENTS_HISTORY = `query GetHistory($wallet: String!, $statuses: [String]) {
				history(wallet: $wallet, statuses: $statuses) {
					id,
					status,
					productAmount,
				}
			}
		`;

    try {
      const checksumFormat = await axios.post(NOW_PAYMENTS_ENDPOINT, {
        query: GET_PAYMENTS_HISTORY,
        variables: {
          wallet: ethers.utils.getAddress(wallet),
          statuses,
        },
      });
      const lowercaseFormat = await axios.post(NOW_PAYMENTS_ENDPOINT, {
        query: GET_PAYMENTS_HISTORY,
        variables: {
          wallet: wallet.toLowerCase(),
          statuses,
        },
      });

      const [res1, res2] = (await Promise.allSettled([lowercaseFormat, checksumFormat])) as any;

      const response =
        res1?.value?.data?.data?.history?.length > 0
          ? res1?.value
          : res2?.value?.data?.data?.history?.length > 0
            ? res2?.value
            : [];

      const history: IPayment[] | undefined = response?.data?.data?.history;
      const order = history?.find((item) => item.id == orderId);

      if (order) {
        const finished = order.status === NowPaymentsStatuses.finished;
        const error = order.status !== NowPaymentsStatuses.waiting;
        if (finished) {
          thunkApi.dispatch(setNowPaymentsState({ amount: '' }));
          thunkApi.dispatch(setNowPaymentsOrder(null));
          thunkApi.dispatch(setIsNowPaymentsModalOpen(false));
          thunkApi.dispatch(setThanksModalIsOpen(true));
          thunkApi.dispatch(setBoughtTokens(String(order.productAmount)));
        } else if (error) {
          thunkApi.dispatch(setNowPaymentsOrder(null));
          thunkApi.dispatch(setIsNowPaymentsModalOpen(false));
          thunkApi.dispatch(setOpenNotificationType(NotificationType.TRANSACTION_FAILED));
        }
      }
    } catch (e) {
      console.warn('ERROR in getNowPaymenHistory for Modal', e);
    }
  },
);

export const getNowPaymenHistoryForPage = createAsyncThunk(
  'tokenSale/getNowPaymenHistory',
  async ({
    wallet,
    statuses,
  }: {
    wallet: string;
    statuses?: string[];
  }): Promise<
    | {
        history: PurchaseHistoryItem[];
      }
    | undefined
  > => {
    const GET_PAYMENTS_HISTORY = `query GetHistory($wallet: String!, $statuses: [String]) {
				history(wallet: $wallet, statuses: $statuses) {
					id,
					wallet,
					status,
					productPrice,
					productAmount,
					priceCurrency,
					priceAmount,
					payAddress,
					payCurrency,
					payAmount,
					createdAt,
				}
			}
		`;

    try {
      const checksumFormat = await axios.post(NOW_PAYMENTS_ENDPOINT, {
        query: GET_PAYMENTS_HISTORY,
        variables: {
          wallet: ethers.utils.getAddress(wallet),
          statuses,
        },
      });
      const lowercaseFormat = await axios.post(NOW_PAYMENTS_ENDPOINT, {
        query: GET_PAYMENTS_HISTORY,
        variables: {
          wallet: wallet.toLowerCase(),
          statuses,
        },
      });

      const [res1, res2] = (await Promise.allSettled([lowercaseFormat, checksumFormat])) as any;

      const response =
        res1?.value?.data?.data?.history?.length > 0
          ? res1?.value
          : res2?.value?.data?.data?.history?.length > 0
            ? res2?.value
            : [];

      const historyRes: IPayment[] | undefined = response?.data?.data?.history;

      if (historyRes?.length) {
        const history = historyRes?.map((item: IPayment) => {
          const chain = NowPaymentsChains.find(
            (chain) => chain.shortName.toLowerCase() === item.payCurrency.toLowerCase(),
          );
          return {
            id: item?.id,
            name: 'Invest',
            chain: chain?.value as number,
            blockTimestamp: Number(item?.createdAt) / 1000,
            transactionHash: '',
            round: 0,
            purchaser: item?.wallet,
            timestamp: new Date(Number(item?.createdAt)),
            blockNumber: 0,
            price: item?.productPrice,
            vesting: 0,
            collateral: {
              symbol: chain?.shortName as string,
              name: chain?.shortName as string,
              icon: chain?.icon,
            },
            investment: item?.payAmount,
            tokensSold: item?.productAmount,
          };
        });
        return { history };
      }
    } catch (e) {
      console.warn('ERROR in getNowPaymenHistory Page', e);
    }
  },
);
