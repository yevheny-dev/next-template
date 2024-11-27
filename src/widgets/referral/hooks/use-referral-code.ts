import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { evmWalletSelector, solanaWalletSelector, tokenSaleSelector } from '@/widgets';
import {
  useLazyCreateOwnReferralQuery,
  useLazyGetOwnReferralQuery,
} from '@/widgets/sale/utils/api.ts';

export const useReferralCode = () => {
  const evmWallet = useSelector(evmWalletSelector);
  const solWallet = useSelector(solanaWalletSelector);
  const { ownRefferalCode, isReferralCodeLoading } = useSelector(tokenSaleSelector);
  const [getOwnReferralCode] = useLazyGetOwnReferralQuery();
  const [createOwnReferral] = useLazyCreateOwnReferralQuery();

  useEffect(() => {
    if (!solWallet?.address && !evmWallet?.address) return;
    getOwnReferralCode({
      walletSol: solWallet?.address,
      walletEvm: evmWallet?.address,
    }).then(() => {
      if (!ownRefferalCode) {
        if (solWallet?.address || evmWallet?.address) {
          createOwnReferral({
            evm: evmWallet?.address,
            sol: solWallet?.address,
          });
        }
      }
    });
  }, [getOwnReferralCode, createOwnReferral, ownRefferalCode, solWallet, evmWallet]);

  const referralLink = ownRefferalCode ? window.origin + `/?ref=${ownRefferalCode}` : '';

  return { referralLink, isReferralCodeLoading };
};
