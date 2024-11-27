import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import { SaleApi } from '@/shared';
import { ClaimSignResponse } from '@/widgets/sale/utils/types.ts';

export const saleApi = createApi({
  reducerPath: 'saleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: SaleApi,
  }),
  tagTypes: ['referral-link'],
  endpoints: (builder) => ({
    getOwnReferral: builder.query<
      string,
      { walletSol: string | undefined; walletEvm: string | undefined }
    >({
      providesTags: ['referral-link'],
      query: ({ walletSol, walletEvm }) => {
        const prevent = !walletEvm && !walletSol;
        const evm = walletEvm ? `evm=${walletEvm}` : '';
        const sol = walletSol ? `&sol=${walletSol}` : '';
        return {
          url: `/partner/code?${evm}${sol}`,
          method: 'GET',
          prevent,
        };
      },
      transformResponse: (res: any) => res?.code,
    }),
    getOwnWalletsFromReferral: builder.query<{ solWallet: string; evmWallet: string }, string>({
      providesTags: ['referral-link'],
      query: (code) => {
        const prevent = !code;
        return {
          url: `/partner/code/${code}`,
          method: 'GET',
          prevent,
        };
      },
    }),
    createOwnReferral: builder.query<string, { evm: string | undefined; sol: string | undefined }>({
      query: ({ evm, sol }) => {
        const prevent = !evm && !sol;
        return {
          url: `/partner/code`,
          method: 'POST',
          prevent,
          body: {
            evm,
            sol,
          },
        };
      },
      transformResponse: (res: any) => res?.code,
    }),
    addWalletToReferral: builder.mutation<
      string,
      { signature: string; address: string; code: string }
    >({
      invalidatesTags: ['referral-link'],
      query: ({ signature, address, code }) => {
        const prevent = !code || !address || !signature;
        return {
          url: `/partner/code/${code}`,
          method: 'PUT',
          prevent,
          body: {
            signature,
            address,
          },
        };
      },
    }),
    getOwnTgCode: builder.query<
      string,
      { walletSol: string | undefined; walletEvm: string | undefined }
    >({
      query: ({ walletSol, walletEvm }) => {
        const prevent = !walletEvm && !walletSol;
        return {
          url: `/representative`,
          method: 'POST',
          prevent,
          body: {
            w_sol: walletSol || '',
            w_evm: walletEvm || '',
          },
        };
      },
      transformResponse: (res: any) => res?.accessCode,
    }),
    getWalletFromReferralCode: builder.query<{ evmWallet: string; solWallet: string }, string>({
      providesTags: ['referral-link'],
      query: (code) => {
        const prevent = !code;
        return {
          url: `/partner/code/${code}`,
          method: 'GET',
          prevent,
        };
      },
    }),
    getClaimSign: builder.query<ClaimSignResponse, { network: number; code: string }>({
      query: ({ code, network }) => {
        const prevent = !code || !network;
        const n = network ? `network=${network}` : '';
        const c = code ? `&code=${code}` : '';
        return {
          url: `/partner/signing?${n}${c}`,
          method: 'GET',
          prevent,
        };
      },
    }),
    getSaleConfig: builder.query<any, undefined>({
      query: () => {
        return {
          url: '/general  ', // old configuration
          method: 'GET',
        };
      },
    }),
    getRoundConfig: builder.query<{ raised: number; goal: number }, undefined>({
      query: () => {
        return {
          url: '/general/step', // old configuration/round,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useGetOwnReferralQuery,
  useLazyGetOwnReferralQuery,
  useCreateOwnReferralQuery,
  useLazyCreateOwnReferralQuery,
  useGetOwnWalletsFromReferralQuery,
  useLazyGetOwnWalletsFromReferralQuery,
  useAddWalletToReferralMutation,
  useGetOwnTgCodeQuery,
  useLazyGetOwnTgCodeQuery,
  useGetWalletFromReferralCodeQuery,
  useLazyGetWalletFromReferralCodeQuery,
  useGetClaimSignQuery,
  useLazyGetClaimSignQuery,
  useGetSaleConfigQuery,
  useLazyGetSaleConfigQuery,
  useGetRoundConfigQuery,
  useLazyGetRoundConfigQuery,
} = saleApi;

export const sendUserData = async (project: any, userData: any) => {
  await axios.post(`https://assetchecker-api.stswap.xyz/projects/${project}/stats`, {
    headers: {
      'x-api-key': 'C1v(%7Uf1{Qyba}As@]0A?Qm',
    },
    body: {
      locale: userData,
    },
  });
};
