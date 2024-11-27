import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { tokenSaleSelector } from '@/widgets';
import { withDecimals } from '@/widgets/sale/utils/helpers.tsx';

export const useReferralInfo = () => {
  const { referralRewardPercent, ownRefferalCode, referralPurchaseHistoryItems } =
    useSelector(tokenSaleSelector);

  const [usdEarned, tokensEarned] = useMemo(() => {
    const usdEarned = referralPurchaseHistoryItems.reduce((pv, nv) => {
      return (pv += Number(nv.usdEarned) || 0);
    }, 0);

    const totalUsdEarned = withDecimals(usdEarned, 2);

    const tokensEarned = referralPurchaseHistoryItems.reduce((pv, nv) => {
      return (pv += Number(nv.tokensEarned) || 0);
    }, 0);

    const totalTokenEarned = withDecimals(tokensEarned, 0);

    return [totalUsdEarned, totalTokenEarned];
  }, [referralPurchaseHistoryItems]);

  return {
    collateralPercent: referralRewardPercent.collateral,
    tokenPercent: referralRewardPercent.token,
    instantlyEarned: usdEarned,
    earnedInToken: tokensEarned,
    ownRefferalCode,
  };
};
