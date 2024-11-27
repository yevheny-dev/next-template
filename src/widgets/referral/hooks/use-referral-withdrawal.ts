import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useCallback, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app';
import {
  DEFAULT_NETWORK_FOR_FETCH,
  GlobalChainId,
  SOL_MIN_GAS_AMOUNT,
  useChangeNetwork,
  useSolanaBalance,
} from '@/shared';
import { RewardToken, tokenSaleSelector } from '@/widgets';
import { redeemSolanaTokens } from '@/widgets/sale/model/redeem-web3-actions.sol.tsx';
import { redeemTokens } from '@/widgets/sale/model/web3-actions';
import { useLazyGetClaimSignQuery } from '@/widgets/sale/utils/api.ts';
import { formatReward, withDecimals } from '@/widgets/sale/utils/helpers.tsx';
import { EvmClaimSignature } from '@/widgets/sale/utils/types.ts';

export const useReferralWithdrawal = () => {
  const dispatch = useAppDispatch();
  const solanaWallet = useAnchorWallet();
  const switchWalletChain = useChangeNetwork();
  const {
    referralInfo,
    isTrxInProgress,
    claimingChain,
    ownRefferalCode,
    ownExternalReferralWallets,
  } = useAppSelector(tokenSaleSelector);
  const [getClaimSign] = useLazyGetClaimSignQuery();
  const [activeChain, setActiveChain] = useState(DEFAULT_NETWORK_FOR_FETCH);
  const claimableUsd = (referralInfo?.totalUsdEarned || 0) + (referralInfo?.totalUsdEarnedSol || 0);
  const claimable = withDecimals(claimableUsd, 2);
  const infoByChain = [...(referralInfo?.byChain || []), ...(referralInfo?.bySolana || [])];
  const referralChain = infoByChain?.find((item) => Number(item?.chain) === Number(activeChain));
  const solBalance = useSolanaBalance();
  const handleChange = useCallback(
    (item: { chain: number; balances: RewardToken[]; storages: string[] }) => {
      setActiveChain(item.chain);
    },
    [],
  );

  const totalUsd = referralChain?.balances?.reduce((acc, cur) => acc + cur?.usdBalance, 0);

  const isDisableBtn = (): boolean => {
    if (totalUsd === 0 || !totalUsd) {
      return true;
    }
    if (claimingChain && referralChain?.chain === claimingChain) {
      return true;
    }
    if (activeChain !== GlobalChainId.solana && !ownExternalReferralWallets?.evm) {
      return true;
    }
    return activeChain === GlobalChainId.solana && !ownExternalReferralWallets?.sol;
  };

  const isInsufficientSolForGas =
    activeChain === GlobalChainId.solana && solBalance < SOL_MIN_GAS_AMOUNT;

  const getButtonText = (): string => {
    if (totalUsd === 0 || !totalUsd) {
      return 'No rewards';
    }
    if (isInsufficientSolForGas) {
      return 'insufficient SOL for gas';
    }
    if (activeChain !== GlobalChainId.solana && !ownExternalReferralWallets?.evm) {
      return 'Link Evm wallet first';
    }
    if (activeChain === GlobalChainId.solana && !ownExternalReferralWallets?.sol) {
      return 'Link Solana wallet first';
    }
    return `Redeem $${formatReward(totalUsd, true) || 0}`;
  };

  const redeem = useCallback(
    (chain: number, contractAddress: string, balances?: RewardToken[]) => {
      if (chain === GlobalChainId.solana && solanaWallet && balances?.length) {
        getClaimSign({ network: -1, code: ownRefferalCode }).then(({ data }) => {
          if (data) {
            const { signature, deadline } = data;
            dispatch(
              redeemSolanaTokens({
                wallet: solanaWallet,
                referralCode: ownRefferalCode,
                deadline,
                signature: signature as string,
              }),
            );
          } else {
            console.error('Claim signature wan not created');
          }
        });
        return;
      }
      if (contractAddress) {
        getClaimSign({ network: chain, code: ownRefferalCode }).then(({ data }) => {
          if (data) {
            const { signature, deadline } = data;
            dispatch(
              redeemTokens({
                chain,
                contractAddress,
                switchWalletChain,
                referralCode: ownRefferalCode,
                deadline,
                signature: signature as EvmClaimSignature,
              }),
            );
          } else {
            console.error('Claim signature wan not created');
          }
        });
      }
    },
    [dispatch, switchWalletChain, solanaWallet, ownRefferalCode, getClaimSign],
  );

  return {
    claimable,
    activeChain,
    handleChange,
    chains: infoByChain,
    referralChain,
    isTrxInProgress,
    claimingChain,
    redeem,
    totalUsd,
    isInsufficientSolForGas,
    disableBtn: isDisableBtn(),
    buttonLabel: getButtonText(),
  };
};
