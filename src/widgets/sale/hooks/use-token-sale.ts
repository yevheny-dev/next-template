import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

// import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '@/app';
import { DEFAULT_NETWORK_FOR_FETCH, GlobalChainId, saleProgramInterface } from '@/shared';

import {
  activeWalletSelector,
  evmWalletSelector,
  solanaWalletSelector,
  tokenSaleSelector,
} from '../model';
import { getReferralInfo } from '../model/get-referral-results';
import { getSolanaReferralInfo } from '../model/get-referral-results.sol';
import { getUserPurchaseHistory } from '../model/history';
import { getLeaderboardPersonalInfo, getReferralLeaderboard } from '../model/leaderboard';
import { getNowPaymenHistoryForPage } from '../model/now-payments';
import { NowPaymentsStatuses } from '../model/now-payments.types';
import {
  checkForSaleUrlParameters,
  getContractInfo,
  getRestrictStatus,
  getSaleTokensBalances,
} from '../model/web3-fetchers';
import { getSaleTokensBalancesSolana, getSolanaContractInfo } from '../model/web3-fetchers.sol';
import {
  useLazyGetRoundConfigQuery,
  useLazyGetSaleConfigQuery,
  useLazyGetWalletFromReferralCodeQuery,
} from '../utils/api';

export const useTokenSale = () => {
  const dispatch = useAppDispatch();
  // const location = useLocation();
  const wallet = useSelector(activeWalletSelector);
  const evmWallet = useSelector(evmWalletSelector);
  const solWallet = useSelector(solanaWalletSelector);
  const solanaWallet = useAnchorWallet();
  const { saleUrlParameters, ownRefferalCode, selectedChain, nativePrices } =
    useSelector(tokenSaleSelector);
  const [getSaleConfigTrigger] = useLazyGetSaleConfigQuery();
  const [getRoundConfigTrigger] = useLazyGetRoundConfigQuery();
  const [getWalletFromReferralCode] = useLazyGetWalletFromReferralCodeQuery();

  useEffect(() => {
    getSaleConfigTrigger(undefined);
    getRoundConfigTrigger(undefined);
  }, [getSaleConfigTrigger, getRoundConfigTrigger]);

  useEffect(() => {
    dispatch(getReferralLeaderboard({ page: 1 }));
  }, [dispatch]);

  /*useEffect(() => {
    dispatch(getTotalSoldTokens({}));
  }, [dispatch]);*/

  useEffect(() => {
    const networkId = evmWallet?.chainId || DEFAULT_NETWORK_FOR_FETCH;

    if (solWallet?.selected) {
      if (solanaWallet) {
        dispatch(getSolanaContractInfo({ wallet: solanaWallet, referralCode: ownRefferalCode }));
      }
    } else {
      dispatch(
        getContractInfo({ wallet: evmWallet?.address, networkId, referralCode: ownRefferalCode }),
      );
    }

    if (evmWallet?.address) {
      dispatch(
        getNowPaymenHistoryForPage({
          wallet: evmWallet?.address,
          statuses: [NowPaymentsStatuses.finished],
        }),
      );
    }

    dispatch(
      getUserPurchaseHistory({ walletSol: solWallet?.address, walletEvm: evmWallet?.address }),
    );
  }, [
    dispatch,
    wallet,
    solanaWallet,
    evmWallet,
    // location,
    solWallet,
    ownRefferalCode,
    selectedChain,
  ]);

  useEffect(() => {
    if (solWallet && solanaWallet && ownRefferalCode) {
      dispatch(
        getSolanaReferralInfo({
          wallet: solanaWallet,
          referralCode: ownRefferalCode,
          programInterfaces: [saleProgramInterface],
        }),
      );
    }
  }, [dispatch, solWallet, solanaWallet, ownRefferalCode]);

  useEffect(() => {
    if (ownRefferalCode) {
      dispatch(getReferralInfo({ referralCode: ownRefferalCode, prices: nativePrices }));
    }

    if (selectedChain.coinId === GlobalChainId.solana) {
      dispatch(getSaleTokensBalancesSolana({ wallet: solWallet?.address, prices: nativePrices }));
    } else {
      dispatch(
        getSaleTokensBalances({
          wallet: evmWallet?.address,
          networkId: selectedChain.coinId,
          prices: nativePrices,
        }),
      );
    }
  }, [dispatch, nativePrices, evmWallet, solWallet, ownRefferalCode, selectedChain]);

  useEffect(() => {
    if (!ownRefferalCode) return;
    dispatch(getLeaderboardPersonalInfo({ code: ownRefferalCode }));
  }, [dispatch, ownRefferalCode]);

  useEffect(() => {
    dispatch(checkForSaleUrlParameters(location));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, location?.search]);

  useEffect(() => {
    if (!saleUrlParameters?.ref) return;
    getWalletFromReferralCode(saleUrlParameters?.ref);
  }, [getWalletFromReferralCode, saleUrlParameters?.ref, evmWallet?.address, solWallet?.address]);

  useEffect(() => {
    dispatch(getRestrictStatus());
  }, [dispatch]);
};
