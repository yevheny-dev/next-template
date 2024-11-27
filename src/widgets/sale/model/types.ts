import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { IPayment } from './now-payments.types';
import { CryptoCurrency, NotificationType } from '@/shared';

export type OpenNotificationParams = {
  messageType: string;
  title: string;
  mainText?: string;
  widthDesktop?: string;
};

export type FOpenNotification = (params: OpenNotificationParams) => void;

export interface BaseGraphEvent {
  id: string;
  name: string;
  chain: number;
  blockTimestamp: number;
  transactionHash: string;
}

export interface IAssetSale {
  categories: [
    {
      name: string;
      code: string;
    },
  ];
  id: number;
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  displayName: string;
  price: number;
  rank: number;
  icon: string;
  decimals: number;
  metadata: {
    coingeckoId: string;
    marketCapRank: number;
    coinmarketcapId: string;
  };
  disable: boolean;
}

export type TokenSaleState = {
  assetAmount: string;
  asset: CollateralToken | null;
  fiat: FiatCurrency | null;
  isTrxInProgress: boolean;
  sort: {
    direction: SortDirection;
    field: SortField;
  };
  session_id: string;
  isLoadingContractInfo: boolean;
  isLoadingReferralInfo: boolean;
  isLoadingSoldTokens: boolean;
  isLoadingHistory: boolean;
  isLoadingReferraHistory: boolean;
  isLoadingPurchases: boolean;
  isErrorContractInfo: boolean;
  monoVestingMode: boolean;
  userCap: number;
  maxUserCap: number;
  activeRound: number;
  minInvestment: number;
  maxInvestment: number;
  isOpened: boolean;
  isClosed: boolean;
  isPausedNative: boolean;
  isPausedErc: boolean;
  evmRoundUsdSold: number;
  evmRoundTokensSold: number;
  solRoundUsdSold: number;
  solRoundTokensSold: number;
  currentRoundActive: boolean;
  currentRoundPriceShort: number;
  currentRoundPriceLong: number;
  nextRoundPrice: number;
  vestingPlan: VestingPlan;
  isPossibleToBuy: boolean;
  isBuying: boolean;
  claimingChain: number | null;
  referralInfo: ReferralRewardInfo | null;
  isReferralCodeLoading: boolean;
  ownRefferalCode: string;
  ownTgCode: string;
  extenralRefferalWallet: { evm: string; sol: string } | null;
  ownExternalReferralWallets: { evm: string; sol: string } | null;
  purchaseHistoryItems: PurchaseHistoryItem[];
  referralPurchaseHistoryItems: PurchaseHistoryItem[];
  lastPurchaseDataItems: LastPurchasesData[];
  totalPurchased: number;
  balances: CollateralToken[];
  saleConfig: SaleConfig | null;
  approveRequired: boolean;
  lendingPasssed: boolean;
  currentPaymentType: PaymentType;
  lastPurchaseData: LastPurchaseData | null;
  lastPurchaseHash: string | null;
  nativePrices: NativePriceInfo[];
  totalClaimedReward: number;
  referralRewardPercent: {
    collateral: number;
    token: number;
  };
  kycLimit: number;
  loadingReferralLeaderboard: boolean;
  allLeaderboardItems: LeaderboardItem[];
  searchLeaderboardItems: LeaderboardItem[];
  personalLeaderboardStats: LeaderboardItem | null;
  leaderboardVisibleItemsCount: number;
  saleUrlParameters: SaleParameters;
  txnModalIsOpen: boolean;
  thanksModalIsOpen: boolean;
  howToBuyIsOpen: boolean;
  noticeModalIsOpen: boolean;
  submitAddressModalIsOpen: boolean;
  boughtTokens: string;
  restricted: boolean;
  isRestrictModalOpen: boolean;
  isRedeemModalOpen: boolean;
  activeNetwork: NetworkName | null;
  isMobile: boolean;
  isMobileWalletModalOpen: boolean;
  isSolanaWalletsModalOpen: boolean;
  raisedUsdAmount: number;
  raiseUsdGoalAmount: number;
  selectedChain: CryptoCurrency;
  isNowPaymentsModalOpen: boolean;
  nowPaymentsState: {
    chainId: number;
    amount: string;
    minAmount: string;
    collateralId: number;
  } | null;
  nowPaymentsOrder: IPayment | null;
  nowPaymentsHistory: PurchaseHistoryItem[];
  isLoadingNowPayments: boolean;
  isWalletConnectModalOpen: boolean;
  wallets: Wallet[];
  isCryptoSelectModalOpen: boolean;
  isFiatSelectModalOpen: boolean;
  isChainSelectModalOpen: boolean;
  buyBonusesInfo: {
    percents: number[];
    thresholds: number[];
  } | null;
  currentBonusIndex: number;
  openNotificationType: NotificationType[];
};

export interface BuyBonus {
  threshold?: number;
  percent?: number;
  tokenAmount?: number;
}

export const enum PaymentType {
  FIAT = 'Buy with card',
  CRYPTO = 'Buy with crypto',
}

export const enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum VestingPlan {
  Short = 0,
  Long = 1,
  m_9 = 2,
}

export const enum SortField {
  date = 'date',
}

export interface FiatCurrency {
  name: string;
  symbol: string;
  icon: any;
  price: number;
}

export interface CollateralToken {
  address: string;
  name: string;
  decimals: number;
  price?: number;
  balance?: number;
  usdBalance?: number;
  disable?: boolean;
  allowance?: BigNumber | null;
  symbol?: string;
  icon?: string;
}

export interface RewardToken extends CollateralToken {
  balance: number;
  usdBalance: number;
}

export interface ReferralRewardInfo {
  totalUsdEarned?: number;
  totalTokensEarned?: number;
  byChain?: { chain: number; balances: RewardToken[]; storages: string[] }[];
  totalUsdEarnedSol?: number;
  totalTokensEarnedSol?: number;
  bySolana?: { chain: number; balances: RewardToken[]; storages: string[] }[];
}

export interface PurchaseHistoryItem extends BaseGraphEvent {
  round: number;
  purchaser: string;
  timestamp: Date;
  blockNumber: number;
  price: number;
  vesting: VestingPlan;
  collateral: Partial<CollateralToken>;
  investment: number;
  tokensSold: number;
  usdEarned?: number;
  tokensEarned?: number;
}

export interface LeaderboardItem {
  rank: number;
  evmAddress: string;
  solAddress: string;
  referrals: number;
  usdEarned: number;
  tokenEarned: number;
  totalEarned: number;
}

export interface SaleConfig {
  saleStartDate: number;
  roundEndDate: number;
  roundIndex: number;
  tokensSoldAmount: number;
  tokensGoalAmount: number;
}

export interface TransactionParams {
  openNotification?: FOpenNotification;
  chain: number;
  to: string;
  data: string;
  value?: string;
  dispatch?: any;
  provider: {
    provider: ethers.providers.Web3Provider;
    address: string;
    networkId: number;
  };
  afterConfirm?: (value?: ethers.providers.TransactionResponse) => void;
}

export interface WertRequestParams {
  chain: number;
  wallet: string;
  amount: number;
  vesting: number;
  code?: string;
}

export interface WertConfig {
  signature: string;
  address: string;
  network: string;
  commodity: string;
  commodity_amount: number;
  sc_address: string;
  sc_input_data: string;
}

export interface MulticallParams {
  contract: ethers.Contract;
  function: string;
  params: (string | number)[];
}

export interface MulticallResult {
  res: any;
  req: MulticallParams;
}

export interface LastPurchaseData {
  usd: number;
  vesting: VestingPlan;
  tokens: number;
  collateralTokens: number;
  collateral: CollateralToken;
}

export interface LastPurchasesData {
  id: string;
  tokensSold: number;
  purchaser: string;
  transactionHash: string;
  blockTimestamp: number;
  chain: number;
}

export interface NativePriceInfo {
  chain: number;
  price: number;
}

export enum RewardTypeEnum {
  ETH = 'ETH',
  BNB = 'BNB',
  TOKEN = 'TOKEN',
  GOERLI = 'GOERLI',
  POLYGON = 'POLYGON',
  ARBITRUM = 'ARBITRUM',
  BASE = 'BASE',
  AVAX = 'AVAX',
  OPT = 'OPT',
  BLAST = 'BLAST',
  LINEA = 'LINEA',
  ZKSYNC = 'ZKSYNC',
  SEPOLIA = 'SEPOLIA',
  SOL = 'SOL',
}

export interface SaleParameters {
  [key: string]: string;
}
export interface SaleUtmData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  twclid: string;
}

export interface SaleChain {
  name: string;
  displayName: string;
  icon: string;
  shortName: string;
  networkId: number;
  nativeSymbol: string;
}

export interface AddressConfig {
  idoStorage: {
    [key: number]: string;
  };
  nativeIdo: {
    [key: number]: string;
  };
  tokenIdo: {
    [key: number]: string;
  };
  customIdo: {
    [key: number]: string;
  };
}

export enum NetworkName {
  solana,
  evm,
}

export interface Wallet {
  providerName: string;
  address: string;
  chainId: number;
  networkName?: NetworkName;
  walletIcon?: string;
  chainIcon?: string;
  selected?: boolean;
  isSolana?: boolean;
}

export interface VisualGraphEvent extends BaseGraphEvent {
  title: string;
  titleAmount: string;
  subtitle: string;
}

export type IWalletConnectState = {
  isWalletConnectModalOpen: boolean;
  wallets: Wallet[];
};
