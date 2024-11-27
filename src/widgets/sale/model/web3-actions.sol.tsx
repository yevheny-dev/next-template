import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import { RootState } from '@/app/store';
import {
  commitmentLevel,
  connection,
  GlobalChainId,
  NotificationType,
  priceInfo,
  referralMock,
  saleProgramInterface,
  SOLANA_PRECISION,
  SOLANA_USDC_ADDRESS,
  SOLANA_USDT_ADDRESS,
  STABLES_PRECISION,
  TOKEN_PROGRAM_ID,
  treasuryInfo,
  UseIntermidiatePage,
} from '@/shared';

import {
  sendCollateralAnalyticsEvent,
  sendNativeAnalyticsEvent,
} from './analytics';
import {
  createEvent,
  removeOpenNotificationType,
  setOpenNotificationType,
  setThanksModalIsOpen,
  setTrxInProgress,
} from './slice';
import { FOpenNotification, VestingPlan } from './types';
import {
  detectPhantomMultiChainProvider,
  getAssociatedTokenAddressSync,
} from './utils.sol';
import { updateContractInfo } from './web3-fetchers';
import { getSaleTokensBalancesSolana } from './web3-fetchers.sol';
import { i16ToBytesLE } from '../utils/helpers';
import { Sale as SaleIDLType } from '../utils/idl/sale-types';
import { openInNewWindow } from '../utils/intermediate';

export const buyWithSolana = createAsyncThunk(
  'tokenSale/buyWithSolana',
  async (
    {
      wallet,
      amount,
      refferalCode,
    }: {
      wallet: AnchorWallet;
      amount: number;
      vesting: VestingPlan;
      refferalCode: string | undefined;
      openNotification: FOpenNotification;
    },
    thunkApi
  ) => {
    try {
      const activeRoundId = (thunkApi.getState() as RootState).sale
        ?.activeRound;
      const walletProviderName = (
        thunkApi.getState() as RootState
      ).sale?.wallets?.find((w) => w.isSolana)?.providerName;
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: commitmentLevel,
      });
      const sendPhantomProvider = await detectPhantomMultiChainProvider();

      if (!provider) return;

      const program = new Program(
        saleProgramInterface,
        provider
      ) as Program<SaleIDLType>;

      const refferal = refferalCode ? refferalCode : referralMock;

      const [roundPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('STEP'), Buffer.from('_'), i16ToBytesLE(activeRoundId)],
        program.programId
      );
      const [userPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('PURCHASER'),
          Buffer.from('_'),
          wallet.publicKey.toBuffer(),
        ],
        program.programId
      );
      const [salePda] = PublicKey.findProgramAddressSync([], program.programId);
      const [partnerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('PARTNER'), Buffer.from('_'), Buffer.from(refferal)],
        program.programId
      );

      const accounts = {
        payer: wallet.publicKey,
        step: roundPda,
        saleHandler: salePda,
        bankInfo: treasuryInfo,
        priceUpdate: priceInfo,
        partner: partnerPda,
        purchaser: userPda,
      };

      const address = wallet?.publicKey?.toBase58();

      thunkApi.dispatch(setTrxInProgress(true));
      thunkApi.dispatch(
        setOpenNotificationType(NotificationType.TRANSACTION_IN_PROGRESS)
      );

      const transaction = await program.methods
        .purchaseWithSol(refferal, new BN(amount * SOLANA_PRECISION))
        .accounts(accounts as any)
        .transaction();

      let transactionSignature;

      if (UseIntermidiatePage) {
        return openInNewWindow(transaction);
      }

      const blockhash = await connection.getLatestBlockhash('finalized');
      transaction.recentBlockhash = blockhash.blockhash;
      transaction.feePayer = wallet.publicKey;

      if (sendPhantomProvider) {
        const res = await sendPhantomProvider.signAndSendTransaction(
          transaction
        );
        transactionSignature = res?.signature;
      } else {
        transactionSignature = await provider.sendAndConfirm(transaction);
      }

      await sendNativeAnalyticsEvent(
        thunkApi,
        amount,
        wallet.publicKey.toBase58(),
        GlobalChainId.solana,
        transactionSignature,
        `${walletProviderName} - sol`
      );

      if (transactionSignature) {
        const latestBlockHash = await connection.getLatestBlockhash();
        const confirmation = await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: transactionSignature,
        });
        if (!confirmation.value.err) {
          thunkApi.dispatch(getSaleTokensBalancesSolana({ wallet: address }));
          thunkApi.dispatch(
            createEvent({
              hash: transactionSignature,
              wallet: address,
              sol: true,
            })
          );
          thunkApi.dispatch(setThanksModalIsOpen(true));
        }
      }
    } catch (e) {
      console.warn('ERROR buyWithSolana', e);
      thunkApi.dispatch(
        setOpenNotificationType(NotificationType.TRANSACTION_FAILED)
      );
      throw new Error('Error in buyWithSolana!', e as any);
    } finally {
      thunkApi.dispatch(setTrxInProgress(false));
      thunkApi.dispatch(
        removeOpenNotificationType(NotificationType.TRANSACTION_IN_PROGRESS)
      );
    }
  }
);

export const buyWithSolanaCollateral = createAsyncThunk(
  'tokenSale/buyWithSolanaCollateral',
  async (
    {
      wallet,
      amount,
      refferalCode,
      collateralAddress,
    }: {
      wallet: AnchorWallet;
      amount: number;
      vesting: VestingPlan;
      refferalCode: string | null;
      openNotification: FOpenNotification;
      collateralAddress: string;
    },
    thunkApi
  ) => {
    try {
      const activeRoundId = (thunkApi.getState() as RootState).sale
        ?.activeRound;
      const walletProviderName = (
        thunkApi.getState() as RootState
      ).sale?.wallets?.find((w) => w.isSolana)?.providerName;
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: commitmentLevel,
      });
      const sendPhantomProvider = await detectPhantomMultiChainProvider();

      if (!provider) return;

      const program = new Program(
        saleProgramInterface,
        provider
      ) as Program<SaleIDLType>;

      const refferal = refferalCode ? refferalCode : referralMock;

      const [roundPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('STEP'), Buffer.from('_'), i16ToBytesLE(activeRoundId)],
        program.programId
      );

      const [salePda] = PublicKey.findProgramAddressSync([], program.programId);

      const stableInfo = new PublicKey(collateralAddress);
      const [userPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('PURCHASER'),
          Buffer.from('_'),
          wallet.publicKey.toBuffer(),
        ],
        program.programId
      );
      const [partnerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('PARTNER'), Buffer.from('_'), Buffer.from(refferal)],
        program.programId
      );

      const beneficiaryAta = getAssociatedTokenAddressSync(
        stableInfo,
        wallet.publicKey,
        false
      );
      const treasuryAta = getAssociatedTokenAddressSync(
        stableInfo,
        treasuryInfo,
        false
      );
      const referralPdaAta = getAssociatedTokenAddressSync(
        stableInfo,
        partnerPda,
        true
      );

      const accounts = {
        payer: wallet.publicKey,
        saleHandler: salePda,
        step: roundPda,
        purchaser: userPda,
        partner: partnerPda,
        purchaserAta: beneficiaryAta,
        bankAta: treasuryAta,
        partnerPdaAta: referralPdaAta,
        tokenProgram: TOKEN_PROGRAM_ID,
      };

      const address = wallet?.publicKey?.toBase58();

      thunkApi.dispatch(setTrxInProgress(true));
      thunkApi.dispatch(
        setOpenNotificationType(NotificationType.TRANSACTION_IN_PROGRESS)
      );

      let transaction;

      if (collateralAddress === SOLANA_USDC_ADDRESS) {
        transaction = await program.methods
          .purchaseWithUsdc(refferal, new BN(amount * STABLES_PRECISION))
          .accounts(accounts as any)
          .transaction();
      }
      if (collateralAddress === SOLANA_USDT_ADDRESS) {
        transaction = await program.methods
          .purchaseWithUsdt(refferal, new BN(amount * STABLES_PRECISION))
          .accounts(accounts as any)
          .transaction();
      }

      if (!transaction) {
        thunkApi.dispatch(
          setOpenNotificationType(NotificationType.TRANSACTION_FAILED)
        );
        return;
      }

      let transactionSignature;

      if (UseIntermidiatePage) {
        return openInNewWindow(transaction);
      }

      const blockhash = await connection.getLatestBlockhash('finalized');
      transaction.recentBlockhash = blockhash.blockhash;
      transaction.feePayer = wallet.publicKey;

      if (sendPhantomProvider) {
        const res = await sendPhantomProvider.signAndSendTransaction(
          transaction
        );
        transactionSignature = res?.signature;
      } else {
        transactionSignature = await provider.sendAndConfirm(transaction);
      }

      await sendCollateralAnalyticsEvent(
        thunkApi,
        String(amount),
        wallet?.publicKey?.toBase58(),
        collateralAddress,
        GlobalChainId.solana,
        transactionSignature,
        `${walletProviderName} - sol`
      );

      if (transactionSignature) {
        const latestBlockHash = await connection.getLatestBlockhash();
        const confirmation = await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: transactionSignature,
        });
        if (!confirmation.value.err) {
          thunkApi.dispatch(getSaleTokensBalancesSolana({ wallet: address }));

          thunkApi.dispatch(
            updateContractInfo({
              wallet: address,
              networkId: GlobalChainId.solana,
            })
          );
          thunkApi.dispatch(
            createEvent({
              hash: transactionSignature,
              wallet: address,
              sol: true,
            })
          );
          thunkApi.dispatch(setThanksModalIsOpen(true));
        }
      }
    } catch (e) {
      console.warn('ERROR buyWithSolanaCollateral', e);
      thunkApi.dispatch(
        setOpenNotificationType(NotificationType.TRANSACTION_FAILED)
      );
    } finally {
      thunkApi.dispatch(setTrxInProgress(false));
      thunkApi.dispatch(
        removeOpenNotificationType(NotificationType.TRANSACTION_IN_PROGRESS)
      );
    }
  }
);
