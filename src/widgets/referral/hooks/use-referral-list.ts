import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@/app';
import { PurchaseHistoryItem, tokenSaleSelector } from '@/widgets';
import { getUserReferralPurchaseHistory } from '@/widgets/sale/model/history.ts';

const COUNT_ITEMS_PER_PAGE = 5;

export const useReferralList = () => {
  const dispatch = useAppDispatch();

  const { referralPurchaseHistoryItems, isLoadingReferraHistory, ownRefferalCode } =
    useSelector(tokenSaleSelector);

  const [displayedItems, setDisplayedItems] = useState<PurchaseHistoryItem[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      getUserReferralPurchaseHistory({
        code: ownRefferalCode,
      }),
    );
  }, [dispatch, ownRefferalCode]);

  useEffect(() => {
    setDisplayedItems(
      referralPurchaseHistoryItems
        .slice((currentPage - 1) * COUNT_ITEMS_PER_PAGE, currentPage * COUNT_ITEMS_PER_PAGE)
        .reverse(),
    );
  }, [currentPage, referralPurchaseHistoryItems]);

  return {
    isLoading: isLoadingReferraHistory,
    items: displayedItems,
    currentPage,
    totalPages: Math.ceil(referralPurchaseHistoryItems.length / COUNT_ITEMS_PER_PAGE),
    setCurrentPage,
    isPaginationShow: referralPurchaseHistoryItems.length >= COUNT_ITEMS_PER_PAGE,
  };
};
