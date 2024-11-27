import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

import {
  commitmentLevel,
  connection,
  GlobalChainId,
  SOLANA_PRECISION,
  SolanaCollateralChain,
  SolanaCollaterals,
  STABLES_PRECISION,
} from '@/shared';

import { ReferralRewardInfo,RewardToken } from './types';
import { Sale as SaleIDLType } from '../utils/idl/sale-types';
import { getBatchNativePrices } from '../utils/prices';

export const getSolanaReferralInfoMethod = async ({
  wallet,
  referralCode,
  programInterfaces,
}: {
  wallet: AnchorWallet;
  referralCode: string;
  programInterfaces: SaleIDLType[];
}): Promise<ReferralRewardInfo | undefined> => {
  const batchNativePrices = await getBatchNativePrices();
  const solanaPrice =
    batchNativePrices?.find((np) => np.chain === GlobalChainId.solana)?.price || 0;

  try {
    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: commitmentLevel,
    });

    if (!provider) return;

    const ReferralDefaultResult = {
      chain: GlobalChainId.solana,
      balances: [
        {
          ...SolanaCollateralChain,
          balance: 0,
          usdBalance: 0,
        },
      ],
      storages: [] as string[],
    };

    let totalUsdEarned = 0;
    let tokenRewardAmount = 0;
    let usdcRewardAmount = 0;
    let usdtRewardAmount = 0;
    let solRewardAmount = 0;
    let solRewardAmountInUsd = 0;

    for (let i = 0; i < programInterfaces?.length; i++) {
      const saleProgramInterface = programInterfaces[i];
      const program = new Program(saleProgramInterface, provider) as Program<SaleIDLType>;

      let referral;
      try {
        const [referralPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('PARTNER'), Buffer.from('_'), Buffer.from(referralCode || '')],
          program.programId,
        );
        referral = await (program.account as any).partner.fetch(referralPda);
      } catch (e) {
        // user dont have rewards
        continue;
      }

      solRewardAmount +=
        new BigNumber(referral?.solReward?.toString())
          .dividedBy(SOLANA_PRECISION)
          .decimalPlaces(6, BigNumber.ROUND_FLOOR)
          .toNumber() || 0;

      usdtRewardAmount +=
        new BigNumber(referral?.usdtReward?.toString())
          .dividedBy(STABLES_PRECISION)
          .decimalPlaces(6, BigNumber.ROUND_FLOOR)
          .toNumber() || 0;

      usdcRewardAmount +=
        new BigNumber(referral?.usdcReward?.toString())
          .dividedBy(STABLES_PRECISION)
          .decimalPlaces(6, BigNumber.ROUND_FLOOR)
          .toNumber() || 0;

      tokenRewardAmount +=
        new BigNumber(referral?.tokenReward?.toString())
          .dividedBy(SOLANA_PRECISION)
          .decimalPlaces(6, BigNumber.ROUND_FLOOR)
          .toNumber() || 0;

      solRewardAmountInUsd = BigNumber(solRewardAmount)
        .multipliedBy(solanaPrice)
        .decimalPlaces(2, BigNumber.ROUND_FLOOR)
        .toNumber();

      totalUsdEarned += BigNumber(solRewardAmountInUsd)
        .plus(usdtRewardAmount)
        .plus(usdcRewardAmount)
        .decimalPlaces(2, BigNumber.ROUND_FLOOR)
        .toNumber();
    }

    const rewardCollateralsBalances = SolanaCollaterals.map((ct) => {
      if (ct.symbol === 'USDC') {
        return {
          ...ct,
          address: ct.address.toLowerCase(),
          balance: usdcRewardAmount,
          usdBalance: usdcRewardAmount,
        };
      }

      if (ct.symbol === 'USDT') {
        return {
          ...ct,
          address: ct.address.toLowerCase(),
          balance: usdtRewardAmount,
          usdBalance: usdtRewardAmount,
        };
      }

      return {
        ...ct,
        address: ct.address.toLowerCase(),
        balance: solRewardAmount,
        usdBalance: solRewardAmountInUsd,
      };
    });

    const info = {
      chain: GlobalChainId.solana,
      balances: rewardCollateralsBalances as RewardToken[],
      storages: [],
    };

    return {
      totalUsdEarnedSol: totalUsdEarned,
      totalTokensEarnedSol: tokenRewardAmount,
      bySolana: [info || ReferralDefaultResult],
    };
  } catch (e) {
    console.warn(e);
    return {
      totalTokensEarned: 0,
      totalUsdEarned: 0,
      byChain: [],
    };
  }
};

export const getSolanaReferralInfo = createAsyncThunk(
  'tokenSale/getSolanaReferralInfo',
  async ({
    wallet,
    referralCode,
    programInterfaces,
  }: {
    wallet: AnchorWallet;
    referralCode: string;
    programInterfaces: SaleIDLType[];
  }): Promise<ReferralRewardInfo | undefined> => {
    const res = await getSolanaReferralInfoMethod({
      wallet,
      programInterfaces,
      referralCode,
    });

    return {
      totalUsdEarnedSol: res?.totalUsdEarnedSol,
      totalTokensEarnedSol: res?.totalTokensEarnedSol,
      bySolana: res?.bySolana,
    };
  },
);
