import { AnchorProvider,Program } from '@coral-xyz/anchor';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

import {
  commitmentLevel,
  connection,
  GlobalChainId,
  saleProgramInterface,
  SOLANA_PRECISION,
  SOLANA_USDC_ADDRESS,
  SOLANA_USDT_ADDRESS,
  SolanaCollateralChain,
  SolanaCollaterals,
} from '@/shared';

import { CollateralToken, NativePriceInfo } from './types';
import {
  getSolCollateralBalanceByAddress,
  getSolRoundInfo,
  parseReferralsInfo,
  parseSaleInfo,
} from './utils.sol';
import { Sale as SaleIDLType } from '../utils/idl/sale-types';

class CustomWallet {
  payer: Keypair;

  constructor(keypair: Keypair) {
    this.payer = keypair;
  }


  async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
    if (tx instanceof Transaction) {
      tx.partialSign(this.payer);
    } else if (tx instanceof VersionedTransaction) {
      tx.sign([this.payer]);
    }
    return tx;
  }


  async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
    return txs.map((tx) => {
      if (tx instanceof Transaction) {
        tx.partialSign(this.payer);
      } else if (tx instanceof VersionedTransaction) {
        tx.sign([this.payer]);
      }
      return tx;
    });
  }


  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }
}
export const getSolanaTotalSoldTokens = createAsyncThunk(
  'tokenSale/getSolanaTotalSoldTokens',
  async ({
    activeRoundIndex,
  }: {
    activeRoundIndex?: number;
  }): Promise<{ tokens: number; usd: number }> => {
    const wallet = new CustomWallet(Keypair.generate());

    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: commitmentLevel,
    });
    const program = new Program(saleProgramInterface, provider) as Program<SaleIDLType>;

    let roundIndex = activeRoundIndex;
    if (roundIndex === undefined || roundIndex === null) {
      const [salePda] = PublicKey.findProgramAddressSync([], program.programId);
      const saleInfo = await (program.account as any).saleHandler.fetch(salePda);
      const saleInfoResult = parseSaleInfo(saleInfo);
      roundIndex = saleInfoResult.currentRoundIndex;
    }

    let totalSold = new BigNumber(0);
    let totalSoldUsd = new BigNumber(0);

    try {
      const round = await getSolRoundInfo(program, roundIndex);

      if (!round?.currentRoundSold || !round?.currentRoundPriceShort) return { tokens: 0, usd: 0 };

      const sold = new BigNumber(round?.currentRoundSold);
      const soldUsd = sold.multipliedBy(new BigNumber(round?.currentRoundPriceShort.toString()));

      totalSold = totalSold.plus(sold);
      totalSoldUsd = totalSoldUsd.plus(soldUsd);
    } catch (e) {
      console.warn('ERROR', e);
    }

    const tokens = totalSold.decimalPlaces(0, BigNumber.ROUND_FLOOR).toNumber();
    const usd = totalSoldUsd.decimalPlaces(0, BigNumber.ROUND_FLOOR).toNumber();

    return { usd, tokens };
  },
);

export const getSolanaContractInfo = createAsyncThunk(
  'tokenSale/getSolanaContractInfo',
  async ({ wallet, referralCode }: { wallet: AnchorWallet; referralCode: string }) => {
    try {
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: commitmentLevel,
      });

      if (!provider) return;

      const program = new Program(saleProgramInterface, provider) as Program<SaleIDLType>;

      const [salePda] = PublicKey.findProgramAddressSync([], program.programId);
      const saleInfo = await (program.account as any).saleHandler.fetch(salePda);
      const saleInfoResult = parseSaleInfo(saleInfo);

      const roundInfo = await getSolRoundInfo(program, saleInfoResult.currentRoundIndex);
      const nextRound = await getSolRoundInfo(program, saleInfoResult.currentRoundIndex + 1);
      const nextRoundPrice = nextRound?.currentRoundPriceShort;

      const defaultSecondaryReward = new BigNumber(saleInfo?.secondaryInterest?.toString())
        .dividedBy(SOLANA_PRECISION)
        .multipliedBy(100)
        .decimalPlaces(2, BigNumber.ROUND_FLOOR)
        .toNumber();
      const defaultMainReward = new BigNumber(saleInfo?.mainInterest?.toString())
        .dividedBy(SOLANA_PRECISION)
        .multipliedBy(100)
        .decimalPlaces(2, BigNumber.ROUND_FLOOR)
        .toNumber();

      let referral;
      try {
        const [referralPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('PARTNER'), Buffer.from('_'), Buffer.from(referralCode || '')],
          program.programId,
        );
        referral = await (program.account as any).partner.fetch(referralPda);
      } catch {
        // referral not found
      }

      const referralRewardPercent = parseReferralsInfo({
        referralInfo: referral,
        defaultMainReward,
        defaultSecondaryReward,
      });

      return {
        userCap: 100000,
        maxUserCap: 100000,
        monoVestingMode: true,
        nextRoundPrice,
        referralRewardPercent,
        ...saleInfoResult,
        ...roundInfo,
      };
    } catch (e) {
      console.warn('ERROR getSolanaContractInfo', e);
    }
  },
);

export const getSaleTokensBalancesSolana = createAsyncThunk(
  'tokenSale/getSaleTokensBalancesSolana',
  async (props: { wallet?: string; prices?: NativePriceInfo[] }): Promise<CollateralToken[]> => {
    try {
      const { wallet, prices } = props;

      const price = prices?.find((el) => el.chain === GlobalChainId.solana)?.price || 0;

      const usdtCollateral = SolanaCollaterals.find(
        (ct) => ct.symbol === 'USDT',
      ) as CollateralToken;
      const usdcCollateral = SolanaCollaterals.find(
        (ct) => ct.symbol === 'USDC',
      ) as CollateralToken;

      const solUSDT_WithoutBalance = {
        ...usdtCollateral,
        balance: 0,
        price: 1,
        usdBalance: 0,
        allowance: null,
      };
      const solUSDC_WithoutBalance = {
        ...usdcCollateral,
        balance: 0,
        price: 1,
        usdBalance: 0,
        allowance: null,
      };

      if (!wallet) {
        return [
          {
            ...SolanaCollateralChain,
            balance: 0,
            price,
            usdBalance: 0,
            allowance: null,
          },
          solUSDT_WithoutBalance,
          solUSDC_WithoutBalance,
        ];
      }

      const balanceRow = await connection.getBalance(new PublicKey(wallet));
      const balance = new BigNumber(balanceRow.toString())
        .dividedBy(SOLANA_PRECISION)
        .decimalPlaces(2, BigNumber.ROUND_FLOOR)
        .toNumber();

      const usdtBalance = await getSolCollateralBalanceByAddress({
        address: SOLANA_USDT_ADDRESS,
        wallet,
      });
      const usdcBalance = await getSolCollateralBalanceByAddress({
        address: SOLANA_USDC_ADDRESS,
        wallet,
      });

      const solUSDT = {
        ...usdtCollateral,
        balance: usdtBalance,
        price: 1,
        usdBalance: usdtBalance,
        allowance: null,
      };
      const solUSDC = {
        ...usdcCollateral,
        balance: usdcBalance,
        price: 1,
        usdBalance: usdcBalance,
        allowance: null,
      };

      return [
        {
          ...SolanaCollateralChain,
          balance,
          price,
          usdBalance: price * balance,
          allowance: null,
        },
        solUSDT,
        solUSDC,
      ];
    } catch (e) {
      console.warn(e);
      return [SolanaCollateralChain];
    }
  },
);
