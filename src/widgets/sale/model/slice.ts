import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';

import {
  blockchainType,
  CryptoCurrency,
  DefaultCollateralReferral,
  DefaultReferralLeaderboardItemsCount,
  DefaultTokenReferral,
  ETH_ADDRESS,
  GlobalChainId,
  NotificationType,
  SaleAvailableAssets,
} from '@/shared';

import { getReferralInfo } from './get-referral-results';
import { getSolanaReferralInfo } from './get-referral-results.sol';
import {
  getLatestPurchases,
  getUserPurchaseHistory,
  getUserReferralPurchaseHistory,
} from './history';
import { getLeaderboardPersonalInfo, getReferralLeaderboard } from './leaderboard';
import { getNowPaymenHistoryForPage } from './now-payments';
import { IPayment } from './now-payments.types';
import { redeemSolanaTokens } from './redeem-web3-actions.sol';
import {
  CollateralToken,
  FiatCurrency,
  LastPurchaseData,
  NativePriceInfo,
  NetworkName,
  PaymentType,
  PurchaseHistoryItem,
  SortDirection,
  SortField,
  TokenSaleState,
  VestingPlan,
  Wallet,
} from './types';
import { approveCollateral, buyWithCollateral, buyWithEth,redeemTokens } from './web3-actions';
import {
  checkForSaleUrlParameters,
  getContractInfo,
  getRestrictStatus,
  getSaleTokensBalances,
  getTotalSoldTokens,
  updateContractInfo,
} from './web3-fetchers';
import {
  getSaleTokensBalancesSolana,
  getSolanaContractInfo,
  getSolanaTotalSoldTokens,
} from './web3-fetchers.sol';
import { saleApi } from '../utils/api';
import { isEnabledToken,limitDecimals } from '../utils/helpers';
import { uuidv4 } from '../utils/uuidv4';

export const initialState: TokenSaleState = {
  activeNetwork: null,
  assetAmount: '',
  asset: null,
  fiat: null,
  isTrxInProgress: false,
  sort: {
    field: SortField.date,
    direction: SortDirection.DESC,
  },
  balances: [],
  session_id: '',
  isLoadingContractInfo: false,
  isLoadingReferralInfo: false,
  isLoadingHistory: false,
  isLoadingReferraHistory: false,
  isLoadingSoldTokens: false,
  isErrorContractInfo: false,
  isLoadingPurchases: false,
  monoVestingMode: false,
  userCap: 0,
  maxUserCap: 0,
  activeRound: 0,
  minInvestment: 0,
  maxInvestment: 0,
  isOpened: false,
  isClosed: false,
  isPausedNative: false,
  isPausedErc: false,
  currentRoundPriceShort: 0,
  currentRoundPriceLong: 0,
  nextRoundPrice: 0,
  vestingPlan: VestingPlan.Long,
  evmRoundUsdSold: 0,
  evmRoundTokensSold: 0,
  solRoundUsdSold: 0,
  solRoundTokensSold: 0,
  currentRoundActive: false,
  isPossibleToBuy: false,
  isBuying: false,
  referralInfo: {
    totalUsdEarned: 0,
    totalTokensEarned: 0,
    byChain: [],
    totalUsdEarnedSol: 0,
    totalTokensEarnedSol: 0,
    bySolana: [],
  },
  isReferralCodeLoading: false,
  ownRefferalCode: '',
  ownTgCode: '',
  extenralRefferalWallet: null,
  ownExternalReferralWallets: null,
  purchaseHistoryItems: [],
  referralPurchaseHistoryItems: [],
  lastPurchaseDataItems: [],
  totalPurchased: 0,
  saleConfig: null,
  approveRequired: false,
  claimingChain: null,
  lendingPasssed: false,
  currentPaymentType: PaymentType.CRYPTO,
  lastPurchaseData: null,
  lastPurchaseHash: null,
  nativePrices: [],
  totalClaimedReward: 0,
  referralRewardPercent: {
    collateral: DefaultCollateralReferral,
    token: DefaultTokenReferral,
  },
  kycLimit: 0,
  loadingReferralLeaderboard: false,
  allLeaderboardItems: [],
  searchLeaderboardItems: [],
  leaderboardVisibleItemsCount: DefaultReferralLeaderboardItemsCount,
  saleUrlParameters: {},
  personalLeaderboardStats: null,
  txnModalIsOpen: false,
  thanksModalIsOpen: false,
  howToBuyIsOpen: false,
  noticeModalIsOpen: false,
  submitAddressModalIsOpen: false,
  boughtTokens: '',
  restricted: false,
  isRestrictModalOpen: false,
  isRedeemModalOpen: false,
  isMobile: false,
  isMobileWalletModalOpen: false,
  isSolanaWalletsModalOpen: false,
  raisedUsdAmount: 0,
  raiseUsdGoalAmount: 0,
  selectedChain: SaleAvailableAssets[0],
  nowPaymentsState: null,
  isNowPaymentsModalOpen: false,
  nowPaymentsOrder: null,
  nowPaymentsHistory: [],
  isLoadingNowPayments: false,
  wallets: [],
  isWalletConnectModalOpen: false,
  isCryptoSelectModalOpen: false,
  isFiatSelectModalOpen: false,
  isChainSelectModalOpen: false,
  buyBonusesInfo: null,
  currentBonusIndex: 0,
  openNotificationType: [],
};

export const tokenSaleSlice = createSlice({
  name: 'tokenSale',
  initialState,
  reducers: {
    selectWalletByAddress(state, action: PayloadAction<string>) {
      if (!action.payload) return;
      const itemIndex = state.wallets?.findIndex(
        (w) => w.address.toLowerCase() === action.payload.toLowerCase(),
      );
      state.wallets = state.wallets.map((w) => ({
        ...w,
        selected: false,
      }));
      state.wallets[itemIndex] = {
        ...state.wallets[itemIndex],
        selected: true,
      };
    },
    pushWallet(state, action: PayloadAction<Wallet>) {
      const itemIndex = state.wallets.findIndex(
        (w) =>
          w.address.toLowerCase() === action.payload?.address?.toLowerCase() ||
          w.networkName === action.payload?.networkName,
      );
      if (itemIndex === -1) {
        state.wallets.push(action.payload);
        return;
      }
      state.wallets[itemIndex] = action.payload;
    },
    removeWalletByAddress(state, action: PayloadAction<string | undefined>) {
      if (!action.payload) return;
      state.wallets = state.wallets.filter(
        (w) => w.address.toLowerCase() !== action.payload?.toLowerCase(),
      );
    },
    setWalletConnectModalOpen(state, action: PayloadAction<boolean>) {
      state.isWalletConnectModalOpen = action.payload;
    },
    setIsMobile(state, action: PayloadAction<boolean>) {
      state.isMobile = action.payload;
    },
    setOpenNotificationType(state, action: PayloadAction<NotificationType>) {
      state.openNotificationType.push(action.payload);
    },
    removeOpenNotificationType(state, action: PayloadAction<NotificationType>) {
      state.openNotificationType = state.openNotificationType.filter(
        (type) => type !== action.payload,
      );
    },
    setReferralCodeLoading(state, action: PayloadAction<boolean>) {
      state.isReferralCodeLoading = action.payload;
    },
    setIsMobileWalletModalOpen(state, action: PayloadAction<boolean>) {
      state.isMobileWalletModalOpen = action.payload;
    },
    setIsSolanaWalletsModalOpen(state, action: PayloadAction<boolean>) {
      state.isSolanaWalletsModalOpen = action.payload;
    },
    setSelectedChain(state, action: PayloadAction<CryptoCurrency>) {
      state.selectedChain = action.payload;
    },
    setRedeemModalIsOpen(state, action: PayloadAction<boolean>) {
      state.isRedeemModalOpen = action.payload;
    },
    setRestrictModalIsOpen(state, action: PayloadAction<boolean>) {
      state.isRestrictModalOpen = action.payload;
    },
    setBoughtTokens(state, action: PayloadAction<string>) {
      state.boughtTokens = action.payload;
    },
    setThanksModalIsOpen(state, action: PayloadAction<boolean>) {
      state.thanksModalIsOpen = action.payload;
    },
    setHowToBuyIsOpen(state, action: PayloadAction<boolean>) {
      state.howToBuyIsOpen = action.payload;
    },
    setNoticeModalIsOpen(state, action: PayloadAction<boolean>) {
      state.noticeModalIsOpen = action.payload;
    },
    setSubmitAddressModalIsOpen(state, action: PayloadAction<boolean>) {
      state.submitAddressModalIsOpen = action.payload;
    },
    setTxnModalIsOpen(state, action: PayloadAction<boolean>) {
      state.txnModalIsOpen = action.payload;
    },
    setNativePrices(state, action: PayloadAction<NativePriceInfo[]>) {
      state.nativePrices = action.payload;
    },
    setAssetAmount(state, action: PayloadAction<string>) {
      const amount = limitDecimals(action.payload);
      state.assetAmount = amount;
      if (!state.asset || state.asset.address === ETH_ADDRESS) {
        state.approveRequired = false;
      } else {
        state.approveRequired = state.asset.allowance?.lt(new BigNumber(amount || 0)) || false;
      }
    },
    setVestingPlan(state, action: PayloadAction<VestingPlan>) {
      state.vestingPlan = action.payload;
    },
    setLastPurchaseData(state, action: PayloadAction<LastPurchaseData>) {
      state.lastPurchaseData = action.payload;
    },
    setLastPurchaseTokenAmount(state, action: PayloadAction<number>) {
      if (state.lastPurchaseData) {
        state.lastPurchaseData.tokens = action.payload;
      }
    },
    setLendingPassed(state, action: PayloadAction<boolean>) {
      state.lendingPasssed = action.payload;
    },
    setPaymentType(state, action: PayloadAction<PaymentType>) {
      state.currentPaymentType = action.payload;
    },
    setAsset(state, action: PayloadAction<CollateralToken | null>) {
      state.asset = action.payload;
      if (!action.payload || action.payload.address === ETH_ADDRESS) {
        state.approveRequired = false;
      } else {
        state.approveRequired =
          action.payload.allowance?.lt(new BigNumber(state.assetAmount || 0)) || false;
      }
    },
    setFiat(state, action: PayloadAction<FiatCurrency | null>) {
      state.fiat = action.payload;
    },
    handleSort(state, action: PayloadAction<SortField>) {
      if (action.payload === state.sort.field) {
        const nextDirection =
          state.sort.direction === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC;
        state.sort.direction = nextDirection;
      } else {
        state.sort = {
          field: action.payload,
          direction: SortDirection.DESC,
        };
      }
    },
    setSessionId(state, action: PayloadAction<string>) {
      state.session_id = action.payload;
    },
    setTrxInProgress(state, action: PayloadAction<boolean>) {
      state.isTrxInProgress = action.payload;
    },
    setShowLeaderboardItems(state, action: PayloadAction<number>) {
      state.leaderboardVisibleItemsCount = action.payload;
    },
    filterAssets(state, action: PayloadAction<CollateralToken[]>) {
      const assets = action.payload.filter((el) =>
        isEnabledToken(el.address, state.isPausedNative, state.isPausedErc),
      );

      state.balances = assets;
      const updatedAsset = assets.find((el) => el.address === state.asset?.address);
      if (!updatedAsset) {
        state.asset = assets.sort((a, b) => (b.usdBalance || 0) - (a.usdBalance || 0))?.[0];
      }
    },
    createEvent(state, action: PayloadAction<{ hash: string; wallet: string; sol?: boolean }>) {
      state.lastPurchaseHash = action.payload.hash;
      const evmWallet = state.wallets?.find((w) => w.networkName === NetworkName.evm);

      const event: PurchaseHistoryItem = {
        id: uuidv4(),
        name: 'Invest',
        chain: action.payload.sol ? GlobalChainId.solana : (evmWallet?.chainId as number),
        round: state.activeRound,
        purchaser: action.payload.wallet,
        blockTimestamp: Math.round(new Date().getTime() / 1000).toString() as any,
        timestamp: new Date(),
        transactionHash: action.payload.hash,
        blockNumber: Number.MAX_SAFE_INTEGER,
        price:
          state.lastPurchaseData?.vesting === VestingPlan.Long
            ? state.currentRoundPriceLong
            : state.currentRoundPriceShort,
        collateral: state.lastPurchaseData?.collateral as any,
        vesting: state.lastPurchaseData?.vesting || VestingPlan.Long,
        investment: new BigNumber(state.lastPurchaseData?.collateralTokens || 0)
          .decimalPlaces(3, BigNumber.ROUND_FLOOR)
          .toNumber(),
        tokensSold: new BigNumber(state.lastPurchaseData?.tokens || 0)
          .decimalPlaces(2, BigNumber.ROUND_FLOOR)
          .toNumber(),
      };

      const newHistory = [...state.purchaseHistoryItems, event].sort(
        (a, b) => Number(b.timestamp) - Number(a.timestamp),
      );

      state.purchaseHistoryItems = newHistory;

      state.totalPurchased = newHistory.reduce((sum, item) => sum + item.tokensSold, 0);
    },
    setIsLoadingNowPayments(state, action: PayloadAction<boolean>) {
      state.isLoadingNowPayments = action.payload;
    },
    setNowPaymentsOrder(state, action: PayloadAction<IPayment | null>) {
      state.nowPaymentsOrder = action.payload;
    },
    setNowPaymentsState(
      state,
      action: PayloadAction<{
        chainId?: number;
        collateralId?: number;
        amount?: string;
        minAmount?: string;
      } | null>,
    ) {
      if (!action.payload) {
        state.nowPaymentsState = null;
        return;
      }

      const defaultState = {
        chainId: 0,
        collateralId: 0,
        amount: '',
        minAmount: '',
      };

      state.nowPaymentsState = Object.assign(
        state.nowPaymentsState || defaultState,
        action.payload,
      );
    },
    setIsNowPaymentsModalOpen(state, action: PayloadAction<boolean>) {
      state.isNowPaymentsModalOpen = action.payload;
    },
    setIsCryptoSelectModalOpen(state, action: PayloadAction<boolean>) {
      state.isCryptoSelectModalOpen = action.payload;
    },
    setIsFiatSelectModalOpen(state, action: PayloadAction<boolean>) {
      state.isFiatSelectModalOpen = action.payload;
    },
    setIsChainSelectModalOpen(state, action: PayloadAction<boolean>) {
      state.isChainSelectModalOpen = action.payload;
    },
    setCurrentBonusIndex(state, action: PayloadAction<number>) {
      state.currentBonusIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNowPaymenHistoryForPage.fulfilled, (state, action) => {
      if (action.payload?.history) {
        state.nowPaymentsHistory = action.payload.history;
      }
    });
    builder.addCase(redeemTokens.pending, (state, action) => {
      state.claimingChain = action.meta.arg.chain;
    });
    builder.addCase(redeemTokens.fulfilled, (state) => {
      state.claimingChain = null;
    });
    builder.addCase(redeemTokens.rejected, (state) => {
      state.claimingChain = null;
    });
    builder.addCase(redeemSolanaTokens.pending, (state) => {
      state.claimingChain = GlobalChainId.solana;
    });
    builder.addCase(redeemSolanaTokens.fulfilled, (state) => {
      state.claimingChain = null;
    });
    builder.addCase(redeemSolanaTokens.rejected, (state) => {
      state.claimingChain = null;
    });
    builder.addCase(buyWithCollateral.pending, (state) => {
      state.isBuying = true;
    });
    builder.addCase(buyWithCollateral.fulfilled, (state) => {
      state.isBuying = false;
    });
    builder.addCase(approveCollateral.pending, (state) => {
      state.isBuying = true;
    });
    builder.addCase(approveCollateral.fulfilled, (state) => {
      state.isBuying = false;
    });
    builder.addCase(buyWithEth.pending, (state) => {
      state.isBuying = true;
    });
    builder.addCase(buyWithEth.fulfilled, (state) => {
      state.isBuying = false;
    });
    builder.addCase(getContractInfo.fulfilled, (state, action) => {
      if (state.wallets?.find((w) => w.networkName === NetworkName.solana && w.selected)) return;
      if (action.payload) {
        state = Object.assign(state, action.payload);
      }
      state.isLoadingContractInfo = false;
    });
    builder.addCase(getSolanaContractInfo.fulfilled, (state, action) => {
      if (state.wallets?.find((w) => w.networkName === NetworkName.evm && w.selected)) return;
      if (action.payload) {
        state = Object.assign(state, action.payload);
      }
      state.isLoadingContractInfo = false;
    });
    builder.addCase(getSolanaContractInfo.pending, (state) => {
      state.isLoadingContractInfo = true;
      state.isErrorContractInfo = false;
    });
    builder.addCase(getSolanaContractInfo.rejected, (state) => {
      state.isLoadingContractInfo = false;
      state.isErrorContractInfo = true;
    });
    builder.addCase(updateContractInfo.fulfilled, (state, action) => {
      if (action.payload) {
        state = Object.assign(state, action.payload);
      }
    });
    builder.addCase(getContractInfo.pending, (state) => {
      state.isLoadingContractInfo = true;
      state.isErrorContractInfo = false;
    });
    builder.addCase(getContractInfo.rejected, (state) => {
      state.isLoadingContractInfo = false;
      state.isErrorContractInfo = true;
    });
    builder.addCase(getReferralInfo.pending, (state) => {
      state.isLoadingReferralInfo = !state.referralInfo;
    });
    builder.addCase(getReferralInfo.fulfilled, (state, action) => {
      state.isLoadingReferralInfo = false;
      state.referralInfo = Object.assign(state.referralInfo || {}, action.payload);
    });
    builder.addCase(getSolanaReferralInfo.pending, (state) => {
      state.isLoadingReferralInfo = !state.referralInfo;
    });
    builder.addCase(getSolanaReferralInfo.fulfilled, (state, action) => {
      state.isLoadingReferralInfo = false;
      if (action.payload) {
        state.referralInfo = Object.assign(state.referralInfo || {}, action.payload);
      }
    });
    builder.addCase(getTotalSoldTokens.fulfilled, (state, action) => {
      state.isLoadingSoldTokens = false;
      state.evmRoundUsdSold = Number(action.payload.usd);
      state.evmRoundTokensSold = Number(action.payload.tokens);
    });
    builder.addCase(getTotalSoldTokens.pending, (state) => {
      state.isLoadingSoldTokens = true;
    });
    builder.addCase(getTotalSoldTokens.rejected, (state) => {
      state.isLoadingSoldTokens = false;
    });
    builder.addCase(getSolanaTotalSoldTokens.fulfilled, (state, action) => {
      state.isLoadingSoldTokens = false;
      state.solRoundUsdSold = Number(action.payload.usd);
      state.solRoundTokensSold = Number(action.payload.tokens);
    });
    builder.addCase(getSolanaTotalSoldTokens.pending, (state) => {
      state.isLoadingSoldTokens = true;
    });
    builder.addCase(getSolanaTotalSoldTokens.rejected, (state) => {
      state.isLoadingSoldTokens = false;
    });
    builder.addCase(getUserPurchaseHistory.pending, (state) => {
      state.isLoadingHistory = true;
    });
    builder.addCase(getUserPurchaseHistory.rejected, (state) => {
      state.isLoadingHistory = false;
    });
    builder.addCase(getUserPurchaseHistory.fulfilled, (state, action) => {
      state.isLoadingHistory = false;
      if (action.payload?.history) {
        state.purchaseHistoryItems = action.payload.history.sort(
          (a, b) => Number(b.timestamp) - Number(a.timestamp),
        );
        state.totalPurchased = action.payload.totalPurchased;
        state.totalClaimedReward = action.payload.totalClaimed;
      } else {
        state.purchaseHistoryItems = [];
      }
    });
    builder.addCase(getUserReferralPurchaseHistory.pending, (state) => {
      state.isLoadingReferraHistory = true;
    });
    builder.addCase(getUserReferralPurchaseHistory.rejected, (state) => {
      state.isLoadingReferraHistory = false;
    });
    builder.addCase(getUserReferralPurchaseHistory.fulfilled, (state, action) => {
      state.isLoadingReferraHistory = false;
      if (action.payload) {
        state.referralPurchaseHistoryItems = action.payload.history;
      } else {
        state.referralPurchaseHistoryItems = [];
      }
    });
    builder.addCase(getLatestPurchases.pending, (state) => {
      state.isLoadingPurchases = true;
    });
    builder.addCase(getLatestPurchases.rejected, (state) => {
      state.isLoadingPurchases = false;
    });
    builder.addCase(getLatestPurchases.fulfilled, (state, action) => {
      state.isLoadingPurchases = false;
      if (action.payload) {
        state.lastPurchaseDataItems = action.payload.history;
      } else {
        state.lastPurchaseDataItems = [];
      }
    });
    builder.addCase(getReferralLeaderboard.pending, (state, action) => {
      if (!action.meta.arg.query) {
        state.searchLeaderboardItems = [];
      }

      state.loadingReferralLeaderboard = true;
    });
    builder.addCase(getReferralLeaderboard.rejected, (state) => {
      state.loadingReferralLeaderboard = false;
    });
    builder.addCase(getReferralLeaderboard.fulfilled, (state, action) => {
      state.loadingReferralLeaderboard = false;
      if (action.payload) {
        if (action.meta.arg.query) {
          state.searchLeaderboardItems = action.payload;
        } else {
          // fix in future
          state.allLeaderboardItems = action.payload;
        }
      }
    });
    builder.addCase(getLeaderboardPersonalInfo.fulfilled, (state, action) => {
      state.personalLeaderboardStats = action.payload;
    });
    builder.addCase(getSaleTokensBalances.fulfilled, (state, action) => {
      if (state.selectedChain.blockchainType === blockchainType.SOL) return;
      const assets = action.payload?.filter((el: any) =>
        isEnabledToken(el.address, state.isPausedNative, state.isPausedErc),
      );
      state.balances = assets;

      const updatedAsset = assets.find((el: any) => el.address === state.asset?.address) || null;
      state.asset = updatedAsset;
      if (!updatedAsset || updatedAsset.address === ETH_ADDRESS) {
        state.approveRequired = false;
      } else {
        state.approveRequired =
          updatedAsset.allowance?.lt(new BigNumber(state.assetAmount || 0)) || false;
      }
      if (!updatedAsset) {
        state.asset = assets.sort(
          (a: any, b: any) => (b.usdBalance || 0) - (a.usdBalance || 0),
        )?.[0];
      }
    });
    builder.addCase(getSaleTokensBalancesSolana.fulfilled, (state, action) => {
      const assets = action.payload;
      state.balances = assets;

      const updatedAsset = assets.find((el) => el.address === state.asset?.address) || null;
      state.asset = updatedAsset;

      if (!updatedAsset) {
        state.asset = assets.sort((a, b) => (b.usdBalance || 0) - (a.usdBalance || 0))?.[0];
      }
    });
    builder.addCase(checkForSaleUrlParameters.fulfilled, (state, action) => {
      if (action.payload) {
        state.saleUrlParameters = {
          ...state.saleUrlParameters,
          ...action.payload,
        };
      }
    });
    builder.addCase(getRestrictStatus.fulfilled, (state, action) => {
      state.restricted = action.payload;
    });
    builder.addMatcher(saleApi.endpoints.createOwnReferral.matchPending, (state) => {
      state.isReferralCodeLoading = true;
    });
    builder.addMatcher(saleApi.endpoints.createOwnReferral.matchRejected, (state) => {
      state.isReferralCodeLoading = false;
    });
    builder.addMatcher(saleApi.endpoints.createOwnReferral.matchFulfilled, (state, action) => {
      if (action.payload) {
        state.ownRefferalCode = action.payload;
      }
      state.isReferralCodeLoading = false;
    });
    builder.addMatcher(saleApi.endpoints.getOwnReferral.matchPending, (state) => {
      state.isReferralCodeLoading = true;
    });
    builder.addMatcher(saleApi.endpoints.getOwnReferral.matchFulfilled, (state, action) => {
      state.ownRefferalCode = action.payload || '';
      state.isReferralCodeLoading = false;
    });
    builder.addMatcher(saleApi.endpoints.addWalletToReferral.matchPending, (state) => {
      state.isReferralCodeLoading = true;
    });
    builder.addMatcher(saleApi.endpoints.addWalletToReferral.matchFulfilled, (state) => {
      state.isReferralCodeLoading = false;
    });
    builder.addMatcher(saleApi.endpoints.getOwnTgCode.matchFulfilled, (state, action) => {
      state.ownTgCode = action.payload;
    });
    builder.addMatcher(
      saleApi.endpoints.getWalletFromReferralCode.matchFulfilled,
      (state, action) => {
        const evm = action.payload?.evmWallet;
        const sol = action.payload?.solWallet;

        const evmWallet = state.wallets?.find((w) => w.networkName === NetworkName.evm);
        const solWallet = state.wallets?.find((w) => w.networkName === NetworkName.solana);

        if (
          !state.extenralRefferalWallet &&
          (evm || sol) &&
          ((evm && evm?.toLowerCase() !== evmWallet?.address?.toLowerCase()) ||
            (sol && sol?.toLowerCase() !== solWallet?.address?.toLowerCase()))
        ) {
          state.extenralRefferalWallet = { evm, sol };
        }
      },
    );
    builder.addMatcher(
      saleApi.endpoints.getOwnWalletsFromReferral.matchFulfilled,
      (state, action) => {
        const evm = action.payload?.evmWallet;
        const sol = action.payload?.solWallet;

        state.ownExternalReferralWallets = { evm, sol };
      },
    );
    builder.addMatcher(saleApi.endpoints.getSaleConfig.matchFulfilled, (state, action) => {
      if (action.payload) {
        state.saleConfig = {
          roundIndex: Number(action.payload.roundIndex),
          tokensGoalAmount: Number(action.payload.tokensGoalAmount),
          tokensSoldAmount: Number(action.payload.tokensSoldAmount),
          saleStartDate: Number(action.payload.saleStartDate),
          roundEndDate: Number(action.payload.roundEndDate),
        };
      }
    });
    builder.addMatcher(saleApi.endpoints.getRoundConfig.matchFulfilled, (state, action) => {
      if (action.payload) {
        state.raisedUsdAmount = action.payload.raised;
        state.raiseUsdGoalAmount = action.payload.goal;
      }
    });
  },
});

export const {
  createEvent,
  filterAssets,
  setVestingPlan,
  setNativePrices,
  setLastPurchaseData,
  setShowLeaderboardItems,
  setLastPurchaseTokenAmount,
  setLendingPassed,
  setPaymentType,
  setAssetAmount,
  setAsset,
  setFiat,
  handleSort,
  setSessionId,
  setTrxInProgress,
  setTxnModalIsOpen,
  setThanksModalIsOpen,
  setHowToBuyIsOpen,
  setNoticeModalIsOpen,
  setSubmitAddressModalIsOpen,
  setBoughtTokens,
  setRestrictModalIsOpen,
  setRedeemModalIsOpen,
  setIsMobile,
  setIsMobileWalletModalOpen,
  setIsSolanaWalletsModalOpen,
  setReferralCodeLoading,
  setSelectedChain,
  setIsLoadingNowPayments,
  setNowPaymentsState,
  setIsNowPaymentsModalOpen,
  setNowPaymentsOrder,
  selectWalletByAddress,
  pushWallet,
  removeWalletByAddress,
  setWalletConnectModalOpen,
  setIsCryptoSelectModalOpen,
  setIsFiatSelectModalOpen,
  setIsChainSelectModalOpen,
  setOpenNotificationType,
  removeOpenNotificationType,
  setCurrentBonusIndex,
} = tokenSaleSlice.actions;

export default tokenSaleSlice.reducer;

export type RootState = ReturnType<typeof tokenSaleSlice.reducer>;
