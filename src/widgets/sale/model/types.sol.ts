import { Wallet as SolanaWalletType } from '@solana/wallet-adapter-react';
import { PublicKey, SendOptions, Transaction, VersionedTransaction } from '@solana/web3.js';

import { FOpenNotification } from './types';

export interface SolanaTransactionParams {
  openNotification?: FOpenNotification;
  wallet: SolanaWalletType;
  to: PublicKey;
  data: string;
  value?: string;
  dispatch?: any;
}

export interface SolSaleInfo {
  enabled: boolean;
  mainInterest: number;
  maxCap: number;
  minCap: number;
  step: number;
  secondaryInterest: number;
  status: any;
  totalSold: any; // bignumber
  bonusPercents: number[];
  bonusThresholds: number[];
}

export interface SolRoundInfo {
  id: number;
  price: number;
  status: any;
  totalSold: any; // bignumber
  totalSupply: any; // bignumber
}

export enum SolRoundState {
  none = 'none',
  enabled = 'enabled',
  disabled = 'disabled',
}

type DisplayEncoding = 'utf8' | 'hex';

type SolanaEvent = 'connect' | 'disconnect' | 'accountChanged';

type SolanaRequestMethod =
  | 'connect'
  | 'disconnect'
  | 'signAndSendTransaction'
  | 'signTransaction'
  | 'signAllTransactions'
  | 'signMessage';

interface SolanaConnectOptions {
  onlyIfTrusted: boolean;
}

export interface SolanaProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signAndSendTransaction: (
    transaction: Transaction | VersionedTransaction,
    opts?: SendOptions,
  ) => Promise<{ signature: string; publicKey: PublicKey }>;
  signTransaction: (
    transaction: Transaction | VersionedTransaction,
  ) => Promise<Transaction | VersionedTransaction>;
  signAllTransactions: (
    transactions: (Transaction | VersionedTransaction)[],
  ) => Promise<(Transaction | VersionedTransaction)[]>;
  signMessage: (message: Uint8Array | string, display?: DisplayEncoding) => Promise<any>;
  connect: (opts?: Partial<SolanaConnectOptions>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: SolanaEvent, handler: (args: any) => void) => void;
  request: (method: SolanaRequestMethod, params: any) => Promise<unknown>;
}
