import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Ed25519Program, PublicKey, Transaction } from '@solana/web3.js';

import {
  commitmentLevel,
  connection,
  NotificationType,
  saleProgramInterface,
  SOLANA_DECIMAL,
  SOLANA_SIGNER,
  SOLANA_USDC_ADDRESS,
  SOLANA_USDT_ADDRESS,
  TOKEN_PROGRAM_ID,
  UseIntermidiatePage,
} from '@/shared';

import {
  removeOpenNotificationType,
  setOpenNotificationType,
  setTrxInProgress,
} from '.';
import {
  getSolanaReferralInfo,
  getSolanaReferralInfoMethod,
} from './get-referral-results.sol';
import {
  detectPhantomMultiChainProvider,
  getAssociatedTokenAddressSync,
} from './utils.sol';
import { hexStringToUint8Array } from '../utils/helpers';
import { Sale as SaleIDLType } from '../utils/idl/sale-types';
import { openInNewWindow } from '../utils/intermediate';

export const redeemSolanaTokens = createAsyncThunk(
  'tokenSale/redeemSolanaTokens',
  async (
    {
      wallet,
      referralCode,
      deadline,
      signature,
    }: {
      deadline: number;
      signature: string;
      wallet: AnchorWallet;
      referralCode: string;
    },
    thunkApi
  ) => {
    try {
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: commitmentLevel,
      });
      const sendPhantomProvider = await detectPhantomMultiChainProvider();

      if (!provider) return;

      const currProgram = new Program(
        saleProgramInterface,
        provider
      ) as Program<SaleIDLType>;

      let transactionSignature;

      const programInfo = await getSolanaReferralInfoMethod({
        wallet,
        referralCode,
        programInterfaces: [saleProgramInterface],
      });

      const usdcWithdrawCurr = programInfo?.bySolana?.[0]?.balances?.find(
        (b) => b.symbol === 'USDC' && b.usdBalance > 0
      );
      const usdtWithdrawCurr = programInfo?.bySolana?.[0]?.balances?.find(
        (b) => b.symbol === 'USDT' && b.usdBalance > 0
      );
      const nativeWithdrawCurr = programInfo?.bySolana?.[0]?.balances?.find(
        (b) => b.decimals === SOLANA_DECIMAL && b.balance > 0
      );

      const withdraw = async ({
        program,
        programId,
        usdcWithdraw,
        usdtWithdraw,
        nativeWithdraw,
      }: {
        program: Program<SaleIDLType>;
        programId: any;
        usdcWithdraw: any;
        usdtWithdraw: any;
        nativeWithdraw: any;
      }) => {
        const [partner] = PublicKey.findProgramAddressSync(
          [Buffer.from('PARTNER'), Buffer.from('_'), Buffer.from(referralCode)],
          programId
        );
        const message = Uint8Array.from(
          Buffer.from(`${referralCode}${wallet.publicKey}${deadline}`)
        );
        const signatureArray = hexStringToUint8Array(signature);
        const ed25519Instruction =
          Ed25519Program.createInstructionWithPublicKey({
            publicKey: SOLANA_SIGNER.toBytes(),
            message: message,
            signature: signatureArray,
          });

        if (usdcWithdraw || usdtWithdraw) {
          if (usdcWithdraw) {
            const stableInfo = new PublicKey(SOLANA_USDC_ADDRESS);
            const partnerAta = getAssociatedTokenAddressSync(
              stableInfo,
              wallet?.publicKey
            );
            const partnerPdaAta = getAssociatedTokenAddressSync(
              stableInfo,
              partner,
              true
            );
            const usdcAccounts = {
              payer: wallet.publicKey,
              partner: partner,
              partnerAta: partnerAta,
              partnerPdaAta: partnerPdaAta,
              tokenProgram: TOKEN_PROGRAM_ID,
            };

            const programInstruction = await program.methods
              .receiveUsdc(
                referralCode,
                new BN(deadline),
                Array.from(signatureArray),
                2
              )
              .accounts(usdcAccounts)
              .instruction();

            const transaction = new Transaction()
              .add(ed25519Instruction)
              .add(programInstruction);

            const { blockhash, lastValidBlockHeight } =
              await connection.getLatestBlockhash();
            transaction.lastValidBlockHeight = lastValidBlockHeight;
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = wallet.publicKey;

            if (sendPhantomProvider) {
              const res = await sendPhantomProvider.signAndSendTransaction(
                transaction
              );
              transactionSignature = res?.signature;
            } else {
              transactionSignature = await provider.sendAndConfirm(transaction);
            }
          }
          if (usdtWithdraw) {
            const stableInfo = new PublicKey(SOLANA_USDT_ADDRESS);
            const partnerAta = getAssociatedTokenAddressSync(
              stableInfo,
              wallet?.publicKey
            );
            const partnerPdaAta = getAssociatedTokenAddressSync(
              stableInfo,
              partner,
              true
            );
            const usdtAccounts = {
              payer: wallet.publicKey,
              partner,
              partnerAta,
              partnerPdaAta,
              tokenProgram: TOKEN_PROGRAM_ID,
            };

            const programInstruction = await program.methods
              .receiveUsdt(
                referralCode,
                new BN(deadline),
                Array.from(signatureArray),
                2
              )
              .accounts(usdtAccounts)
              .instruction();

            const transaction = new Transaction()
              .add(ed25519Instruction)
              .add(programInstruction);

            if (UseIntermidiatePage) {
              return openInNewWindow(transaction);
            }

            const { blockhash, lastValidBlockHeight } =
              await connection.getLatestBlockhash();
            transaction.lastValidBlockHeight = lastValidBlockHeight;
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = wallet.publicKey;

            if (sendPhantomProvider) {
              const res = await sendPhantomProvider.signAndSendTransaction(
                transaction
              );
              transactionSignature = res?.signature;
            } else {
              transactionSignature = await provider.sendAndConfirm(transaction);
            }
          }
        }
        if (nativeWithdraw) {
          const programInstruction = await program.methods
            .receiveSol(
              referralCode,
              new BN(deadline),
              Array.from(signatureArray),
              2
            )
            .accounts({
              payer: wallet.publicKey,
              partner,
            } as any)
            .instruction();

          const transaction = new Transaction()
            .add(ed25519Instruction)
            .add(programInstruction);

          const { blockhash, lastValidBlockHeight } =
            await connection.getLatestBlockhash();
          transaction.lastValidBlockHeight = lastValidBlockHeight;
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = wallet.publicKey;

          if (sendPhantomProvider) {
            const res = await sendPhantomProvider.signAndSendTransaction(
              transaction
            );
            transactionSignature = res?.signature;
          } else {
            transactionSignature = await provider.sendAndConfirm(transaction);
          }
        }
      };

      thunkApi.dispatch(setTrxInProgress(true));
      thunkApi.dispatch(
        setOpenNotificationType(NotificationType.TRANSACTION_IN_PROGRESS)
      );

      await withdraw({
        program: currProgram,
        programId: currProgram.programId,
        usdcWithdraw: usdcWithdrawCurr,
        usdtWithdraw: usdtWithdrawCurr,
        nativeWithdraw: nativeWithdrawCurr,
      });

      if (transactionSignature) {
        const latestBlockHash = await connection.getLatestBlockhash();
        const confirmation = await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: transactionSignature,
        });
        if (!confirmation.value.err) {
          thunkApi.dispatch(
            getSolanaReferralInfo({
              wallet,
              referralCode,
              programInterfaces: [saleProgramInterface],
            })
          );
        }
      }
    } catch (e) {
      console.warn(e);
      thunkApi.dispatch(
        getSolanaReferralInfo({
          wallet,
          referralCode,
          programInterfaces: [saleProgramInterface],
        })
      );
    } finally {
      thunkApi.dispatch(setTrxInProgress(false));
      thunkApi.dispatch(
        removeOpenNotificationType(NotificationType.TRANSACTION_IN_PROGRESS)
      );
    }
  }
);
