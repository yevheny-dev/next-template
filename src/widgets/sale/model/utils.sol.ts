import { Program } from '@coral-xyz/anchor';
import {
  Connection,
  PublicKey,
  SystemProgram,
  //Transaction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import BigNumber from 'bignumber.js';

import {
  CryptoPaymentUsdAppendix,
  DefaultCollateralReferral,
  DefaultTokenReferral,
  isDevelopment,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  SOLANA_PRECISION,
  SOLANA_USDT_ADDRESS,
  TOKEN_PROGRAM_ID,
  connection,
  STABLES_PRECISION,
} from '@/shared';
import { i16ToBytesLE } from '../utils/helpers';
import { Sale as SaleIDLType } from '../utils/idl/sale-types';

import { SolanaProvider, SolRoundInfo, SolRoundState, SolSaleInfo } from './types.sol';

export const parseSaleInfo = (saleInfo: SolSaleInfo) => {
  const minInvestment = new BigNumber(saleInfo?.minCap?.toString())
    .dividedBy(SOLANA_PRECISION)
    .decimalPlaces(2, BigNumber.ROUND_FLOOR)
    .plus(CryptoPaymentUsdAppendix)
    .toNumber();

  const maxInvestment = new BigNumber(saleInfo?.maxCap?.toString())
    .dividedBy(SOLANA_PRECISION)
    .decimalPlaces(2, BigNumber.ROUND_FLOOR)
    .toNumber();

  const bonusPercents = saleInfo?.bonusPercents?.map((item) => {
    return new BigNumber(item?.toString()).dividedBy(STABLES_PRECISION * 10).toNumber();
  });
  const bonusThresholds = saleInfo?.bonusThresholds?.map((item) => {
    return new BigNumber(item?.toString())
      .dividedBy(SOLANA_PRECISION)
      .decimalPlaces(2, BigNumber.ROUND_FLOOR)
      .toNumber();
  });

  const saleState = Object.keys(saleInfo.status)[0];
  const isOpened = saleState === SolRoundState.enabled;
  const isClosed = saleState === SolRoundState.disabled;
  const isPausedNative = false;
  const isPausedErc = false;

  return {
    currentRoundIndex: saleInfo?.step,
    minInvestment,
    maxInvestment,
    isOpened,
    isClosed,
    isPausedNative,
    isPausedErc,
    buyBonusesInfo: {
      percents: [0, ...bonusPercents],
      thresholds: [0, ...bonusThresholds],
    },
  };
};

export const parseReferralsInfo = ({
  referralInfo,
  defaultMainReward,
  defaultSecondaryReward,
}: {
  referralInfo: {
    mainInterest: number;
    secondaryInterest: number;
  };
  defaultMainReward: number;
  defaultSecondaryReward: number;
}) => {
  const referralRewardPercent = {
    collateral: defaultMainReward || DefaultCollateralReferral,
    token: defaultSecondaryReward || DefaultTokenReferral,
  };

  if (defaultMainReward && defaultSecondaryReward) return referralRewardPercent;
  if (!referralInfo) return referralRewardPercent;

  const secondaryReward = new BigNumber(referralInfo?.secondaryInterest?.toString())
    .dividedBy(SOLANA_PRECISION)
    .decimalPlaces(2, BigNumber.ROUND_FLOOR)
    .toNumber();

  const mainReward = new BigNumber(referralInfo?.mainInterest?.toString())
    .dividedBy(SOLANA_PRECISION)
    .decimalPlaces(2, BigNumber.ROUND_FLOOR)
    .toNumber();

  referralRewardPercent.collateral = secondaryReward;
  referralRewardPercent.token = mainReward;
};

export const parseRoundInfo = (roundInfo: SolRoundInfo) => {
  const activeRound = roundInfo?.id || 0;

  const price =
    new BigNumber(roundInfo?.price.toString())
      .dividedBy(SOLANA_PRECISION)
      .decimalPlaces(6, BigNumber.ROUND_FLOOR)
      .toNumber() || 0;

  const currentRoundSupply =
    new BigNumber(roundInfo?.totalSupply?.toString())
      .dividedBy(SOLANA_PRECISION)
      .decimalPlaces(2, BigNumber.ROUND_FLOOR)
      .toNumber() || 0;
  const currentRoundSold =
    new BigNumber(roundInfo?.totalSold?.toString())
      .dividedBy(SOLANA_PRECISION)
      .decimalPlaces(2, BigNumber.ROUND_FLOOR)
      .toNumber() || 0;

  const currentRoundState = Object.keys(roundInfo.status)[0];
  const currentRoundActive = currentRoundState === SolRoundState.enabled;
  const isPossibleToBuy = currentRoundActive; //&& userCap !== 0;

  return {
    currentRoundPriceLong: price,
    currentRoundPriceShort: price,
    currentRoundSupply,
    currentRoundSold,
    currentRoundActive,
    activeRound,
    isPossibleToBuy,
  };
};

export const getSolRoundInfo = async (program: Program<SaleIDLType>, roundIndex: number) => {
  try {
    const [roundPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('STEP'), Buffer.from('_'), i16ToBytesLE(roundIndex)],
      program.programId,
    );
    const roundState = await (program.account as any).step.fetch(roundPda);
    const roundInfo = parseRoundInfo(roundState);
    return roundInfo;
  } catch (e) {
    console.warn('ERROR', e);
  }
};

export const getSolCollateralBalanceByAddress = async ({
  address,
  wallet,
}: {
  address: string;
  wallet: string;
}) => {
  try {
    if (isDevelopment && address === SOLANA_USDT_ADDRESS) {
      return 0;
    }
    const mintAddress = new PublicKey(address);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(new PublicKey(wallet), {
      mint: mintAddress,
    });
    const account = tokenAccounts?.value?.find(
      (account: any) =>
        account?.account?.data?.parsed?.info?.mint?.toLowerCase() ===
        mintAddress.toBase58().toLowerCase(),
    );
    if (account) {
      const collateralBalance = account?.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
      return collateralBalance || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching sol collateral balance:', error);
  }
};

export function getAssociatedTokenAddressSync(
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
): PublicKey {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) {
    console.warn('ERROR from getAssociatedTokenAddressSync: TokenOwnerOffCurveError');
  }

  const [address] = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
    associatedTokenProgramId,
  );

  return address;
}

export const detectPhantomMultiChainProvider = async (): Promise<SolanaProvider | null> => {
  const anyWindow: any = window;
  let count = 0;

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const provider = anyWindow.phantom?.solana; //|| anyWindow?.solflare;
      if (!provider?.isConnected) {
        resolve(null);
      }

      if (count === 5) {
        clearInterval(interval);
        resolve(null);
      }

      if (provider) {
        clearInterval(interval);
        resolve(provider);
      }
      count++;
    }, 1000);
  });
};

export const createTransferTransactionV0 = async (
  publicKey: PublicKey,
  connection: Connection,
): Promise<VersionedTransaction> => {
  // connect to the cluster and get the minimum rent for rent exempt status
  // perform this step to get an "arbitrary" amount to transfer
  const minRent = await connection.getMinimumBalanceForRentExemption(0);

  // get latest `blockhash`
  const blockhash = await connection.getLatestBlockhash().then((res) => res.blockhash);

  // create an array with your desired `instructions`
  // in this case, just a transfer instruction
  const instructions = [
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: publicKey,
      lamports: minRent,
    }),
  ];

  // create v0 compatible message
  const messageV0 = new TransactionMessage({
    payerKey: publicKey,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();

  // make a versioned transaction
  const transactionV0 = new VersionedTransaction(messageV0);

  return transactionV0;
};

// const signAndSendTransactionOnSolana = async (
//   provider: PhantomSolanaProvider,
//   transaction: Transaction | VersionedTransaction,
// ): Promise<string | undefined> => {
//   try {
//     const { signature } = await provider.signAndSendTransaction(transaction);
//     return signature;
//   } catch (error) {
//     console.warn('signAndSendTransactionOnSolana', error);
//   }
// };

// export default signAndSendTransactionOnSolana;
