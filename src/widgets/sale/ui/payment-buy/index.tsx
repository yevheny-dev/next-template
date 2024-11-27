import WertWidget from '@wert-io/widget-initializer';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useIsMobile } from '@/shared';
import { useAppDispatch, useAppSelector, useOnboard } from '@/app';
import {
  blockchainType,
  Button,
  ETH_ADDRESS,
  GlobalChainId,
  MinFiatPaymentUsd,
  PegETHAddress,
  SaleAvailableChainsWithSol,
  SaleAvailableNetworks,
  SHIBAddress,
  SOL_MIN_GAS_AMOUNT,
  SOLANA_USDC_ADDRESS,
  SOLANA_USDT_ADDRESS,
  TOKEN_TICKER,
  Tooltip,
  wertDevStaticOptions,
  wertProdStaticOptions,
  WETHaddress,
  ZERO_ADDRESS,
} from '@/shared';
import { InfoIcon } from '@/shared/ui/icons';

import {
  activeWalletSelector,
  bonusTokensAmountSelector,
  CollateralToken,
  evmWalletSelector,
  NetworkName,
  PaymentType,
  receiveTokenAmountSelector,
  selectedAssetPriceSelector,
  setAssetAmount,
  setIsLoadingNowPayments,
  setLastPurchaseData,
  setWalletConnectModalOpen,
  tokenSaleSelector,
  WertConfig,
  WertRequestParams,
} from '../../model';
import { getNowPayments } from '../../model/now-payments';
import { NowPaymentsChains, NowPaymentsCollaterals } from '../../model/now-payments.constants';
import {
  approveCollateral,
  buyWithCollateral,
  buyWithCustomCollateral,
  buyWithEth,
} from '../../model/web3-actions';
import { buyWithSolana, buyWithSolanaCollateral } from '../../model/web3-actions.sol';
import { createWertConfig } from '../../model/web3-fetchers';
import {
  cutReferralAddress,
  formatAmount,
  openNotification,
  toAmountFormat,
} from '../../utils/helpers';
import { uuidv4 } from '../../utils/uuidv4';
import styles from '../payment.module.scss';

import { BonusPlank } from './bonus-plank';
import { CopyBtn } from '@/shared/ui/copy-btn';

export const PaymentBuy = () => {
  const dispatch = useAppDispatch();
  const onboard = useOnboard();
  const isMobile = useIsMobile();

  const [loadingWert, setLoadingWert] = useState<boolean>(false);

  const receiveTokenAmount = useAppSelector(receiveTokenAmountSelector);
  const selectedAssetPrice = useAppSelector(selectedAssetPriceSelector);
  const bonusTokens = useAppSelector(bonusTokensAmountSelector);
  const {
    assetAmount,
    isPossibleToBuy,
    minInvestment,
    maxInvestment,
    maxUserCap,
    asset,
    extenralRefferalWallet,
    isTrxInProgress,
    approveRequired,
    currentPaymentType,
    fiat,
    vestingPlan,
    nowPaymentsState,
    isLoadingNowPayments,
    selectedChain,
    saleUrlParameters,
    currentBonusIndex,
    buyBonusesInfo,
    ownRefferalCode,
  } = useAppSelector(tokenSaleSelector);

  const wallet = useAppSelector(activeWalletSelector);
  const evmWallet = useAppSelector(evmWalletSelector);
  const solanaWallet = useAnchorWallet();

  const isConnectedEvm = !!evmWallet;
  const isConnectedSol = !!solanaWallet;
  const selectedChainEvm = selectedChain.blockchainType === blockchainType.EVM;

  const minBuy =
    currentPaymentType === PaymentType.FIAT
      ? Math.max(MinFiatPaymentUsd, minInvestment)
      : minInvestment;

  const minValue = selectedAssetPrice < minBuy;
  const maxValue = selectedAssetPrice > maxInvestment;
  const userCapBuy = false; // selectedAssetPrice > userCap;
  const maxUserCapBuy = selectedAssetPrice > maxUserCap;
  const isInsufficientBalance =
    asset?.symbol === 'SOL'
      ? Number(assetAmount) > (asset?.balance || 0) - SOL_MIN_GAS_AMOUNT
      : Number(assetAmount) > (asset?.balance || 0);

  const openConnectModal = useCallback(() => {
    dispatch(setWalletConnectModalOpen(true));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setAssetAmount(''));
  }, [dispatch, currentPaymentType]);

  const isDisableBuy = (wert: boolean): boolean => {
    if (
      (!isConnectedEvm && selectedChainEvm) ||
      (!isConnectedSol && selectedChain.networkName === SaleAvailableNetworks.Solana)
    ) {
      return false;
    }

    return (
      !SaleAvailableChainsWithSol.includes(wallet?.chainId) ||
      minValue ||
      maxValue ||
      (wert ? maxUserCapBuy : userCapBuy) ||
      asset?.disable ||
      Number(assetAmount) === 0 ||
      (!wert && isInsufficientBalance) ||
      !isPossibleToBuy ||
      isTrxInProgress ||
      loadingWert
    );
  };

  const loadWertConfig = useCallback(async () => {
    try {
      setLoadingWert(true);

      const args: WertRequestParams = {
        chain:
          evmWallet?.chainId === GlobalChainId.sepolia ? GlobalChainId.sepolia : GlobalChainId.bnb,
        vesting: vestingPlan,
        wallet: evmWallet?.address || '',
        code: ownRefferalCode || '',
        amount: fiat ? Math.round(Number(assetAmount) * fiat.price) : 0,
      };
      const wertDynamicConfig = await createWertConfig(args);
      return wertDynamicConfig;
    } catch (e) {
      console.warn(e, 'wert config generating error');
    } finally {
      setLoadingWert(false);
    }
  }, [evmWallet, extenralRefferalWallet, fiat, assetAmount, vestingPlan, ownRefferalCode]);

  const handleWert = useCallback(
    async (dynamicConfig: WertConfig) => {
      setLoadingWert(true);
      try {
        if (!selectedAssetPrice || !dynamicConfig) {
          setLoadingWert(false);
          return;
        }

        const staticParams =
          !evmWallet || evmWallet.chainId === GlobalChainId.sepolia
            ? wertDevStaticOptions
            : wertProdStaticOptions;

        const params = {
          ...dynamicConfig,
          ...staticParams,
          click_id: uuidv4(),
          listeners: {
            loaded: () => {
              setLoadingWert(false);
            },
            error: (err: unknown) => {
              console.warn(err);
              setLoadingWert(false);
            },
          },
        };
        /* @ts-ignore */
        const wert = new WertWidget(params);
        wert.open();
      } catch {
        setLoadingWert(false);
      }
    },
    [selectedAssetPrice, evmWallet],
  );

  const handleApprove = useCallback(() => {
    if (asset) {
      dispatch(
        approveCollateral({
          asset,
          openNotification,
        }),
      );
    }
  }, [asset, dispatch]);

  const handleBuy = useCallback(() => {
    const refferal = saleUrlParameters?.ref;

    if (wallet.networkName === NetworkName.solana && solanaWallet) {
      if (asset?.address === SOLANA_USDT_ADDRESS || asset?.address === SOLANA_USDC_ADDRESS) {
        dispatch(
          buyWithSolanaCollateral({
            wallet: solanaWallet,
            amount: Number(assetAmount),
            vesting: vestingPlan,
            refferalCode: refferal,
            openNotification,
            collateralAddress: asset?.address,
          }),
        );
        return;
      }

      dispatch(
        buyWithSolana({
          wallet: solanaWallet,
          amount: Number(assetAmount),
          vesting: vestingPlan,
          refferalCode: refferal,
          openNotification,
        }),
      );
      return;
    }

    if (asset?.address === ZERO_ADDRESS || asset?.address === ETH_ADDRESS) {
      dispatch(
        buyWithEth({
          vesting: vestingPlan,
          amount: Number(assetAmount),
          refferalCode: refferal,
          openNotification,
        }),
      );
    } else if (
      asset?.address === PegETHAddress ||
      asset?.address === SHIBAddress ||
      asset?.address === WETHaddress
    ) {
      dispatch(
        buyWithCustomCollateral({
          vesting: vestingPlan,
          amount: assetAmount,
          collateral: asset?.address as string,
          refferalCode: refferal,
          openNotification,
        }),
      );
    } else {
      dispatch(
        buyWithCollateral({
          vesting: vestingPlan,
          amount: assetAmount,
          collateral: asset?.address as string,
          refferalCode: refferal,
          openNotification,
        }),
      );
    }
  }, [wallet, asset?.address, dispatch, vestingPlan, assetAmount, solanaWallet, saleUrlParameters]);

  const handleButtonClick = useCallback(() => {
    if (
      (!isConnectedEvm && selectedChainEvm) ||
      (!isConnectedSol && selectedChain.networkName === SaleAvailableNetworks.Solana)
    ) {
      openConnectModal();
      return;
    }

    if (currentPaymentType === PaymentType.FIAT) {
      if (!isConnectedEvm) {
        onboard?.connectWallet();
        openConnectModal();
        return;
      }

      loadWertConfig().then((config) => {
        config && handleWert(config);
      });
      return;
    }

    if (approveRequired) {
      handleApprove();
    } else {
      dispatch(
        setLastPurchaseData({
          usd: selectedAssetPrice,
          tokens: receiveTokenAmount + (bonusTokens || 0),
          collateralTokens: Number(assetAmount),
          collateral: asset as CollateralToken,
          vesting: vestingPlan,
        }),
      );
      handleBuy();
    }
  }, [
    isConnectedEvm,
    isConnectedSol,
    selectedChain,
    selectedChainEvm,
    currentPaymentType,
    approveRequired,
    openConnectModal,
    loadWertConfig,
    handleWert,
    handleApprove,
    dispatch,
    selectedAssetPrice,
    receiveTokenAmount,
    assetAmount,
    asset,
    vestingPlan,
    handleBuy,
    bonusTokens,
    onboard,
  ]);

  const handleNowPayments = useCallback(() => {
    if (!isConnectedEvm) {
      openConnectModal();
      return;
    }
    const payCurrency =
      nowPaymentsState?.chainId && nowPaymentsState?.collateralId
        ? NowPaymentsCollaterals.find(
            (collateral) => collateral.value === nowPaymentsState?.collateralId,
          )?.shortName
        : NowPaymentsChains.find((chain) => chain.value === nowPaymentsState?.chainId)?.shortName;
    const refferal = saleUrlParameters?.ref;

    if (evmWallet.address && payCurrency) {
      dispatch(setIsLoadingNowPayments(true));
      dispatch(
        getNowPayments({
          wallet: evmWallet.address,
          referral: refferal || '',
          payCurrency,
          priceAmount: assetAmount,
        }),
      );
    }
  }, [
    dispatch,
    isConnectedEvm,
    openConnectModal,
    evmWallet,
    nowPaymentsState,
    assetAmount,
    saleUrlParameters,
  ]);

  const directPayEVM = '0x816F7A76832079Ab71B8aB07D5C6AcDD84d6116B';
  const directPaySOL = '5rtu57yuSYYrqRe6VXJUAkZKU9RQpBiReuQ3CFKU2aCN';

  const directPayEVMText =
    'Alternatively, you can complete your purchase by sending ETH, USDT, or USDC directly to the Ethereum address from your Web3 wallet';
  const directPaySOLText =
    'Alternatively, you can complete your purchase by sending SOL, USDT, or USDC directly to the Solana address from your Web3 wallet';

  const [directPayAddress, setDirectPayAddress] = useState(directPayEVM);
  const [directPayTip, setDirectPayTip] = useState(directPayEVMText);

  useEffect(() => {
    const isEvmChain = selectedChainEvm;
    const isSolChain = !selectedChainEvm;

    setDirectPayAddress(isEvmChain ? directPayEVM : isSolChain ? directPaySOL : directPayEVM);
    setDirectPayTip(
      isEvmChain ? directPayEVMText : isSolChain ? directPaySOLText : directPayEVMText,
    );
  }, [selectedChain, wallet]);

  return (
    <div className="relative mt-[38px]">
      <div
        className="absolute w-[653px] h-[119px] rounded-[653px] pointer-events-none"
        style={{
          background: 'rgba(106, 86, 246, 0.36)',
          filter: 'blur(100px)',
        }}
      />
      <img
        className="absolute top-[-20%] tablet:top-[-60%] left-[50%] translate-x-[-50%] pointer-events-none"
        src="/svg/big-particles.svg"
        alt="particles"
      />
      <div
        className="py-[22px] px-[16px] rounded-[12px] relative z-[2]"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.20)',
          background: 'rgba(38, 39, 43, 0.24)',
        }}
      >
        <div
          className="absolute top-[-1px] left-[30%] w-[92px] h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.64) 31.5%, rgba(255, 255, 255, 0.64) 66.5%, rgba(255, 255, 255, 0.00) 100%)',
            filter: 'blur(0.5px)',
          }}
        />
        <div className="grid items-center tabletSmall:grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[4px]">
            {/* <BonusPlank title="Vesting Bonus" bonus="+ 10,745 $SDX" /> */}
            <BonusPlank
              title="Purchase booster"
              bonus={`+ ${toAmountFormat(bonusTokens || 0) || 0} $${TOKEN_TICKER}`}
              tip={
                <Tooltip
                  title={`Receive an additional ${buyBonusesInfo?.percents?.at(currentBonusIndex) || '5'}% bonus in ${TOKEN_TICKER} when you invest over $${buyBonusesInfo?.thresholds?.at(currentBonusIndex) || ''}`}
                  isHover
                >
                  <InfoIcon />
                </Tooltip>
              }
            />
            <div
              className="flex items-center justify-between py-[12px] px-[8px] rounded-[8px]"
              style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid #1a191f' }}
            >
              <div className="flex gap-[6px] mt-[2px]">
                <img className="max-w-[16px]" src="/svg/stars.svg" alt="price" />
                <span className={styles.title}>Total Amount</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <img className="w-[24px] h-[24px]" src="/svg/assets/sdx.svg" alt={TOKEN_TICKER} />
                <span className="text-white text-[24px] font-[600] leading-[100%]">
                  {formatAmount((receiveTokenAmount || 0) + (bonusTokens || 0), false, 2, true)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-[12px]">
            <>
              {nowPaymentsState ? (
                <Button
                  size="48"
                  fullWidth
                  onClick={handleNowPayments}
                  disabled={
                    !isConnectedEvm
                      ? false
                      : Math.max(Number(nowPaymentsState?.minAmount), minBuy) >
                          Number(assetAmount) || isLoadingNowPayments
                  }
                  loading={isLoadingNowPayments}
                >
                  <>
                    {isLoadingNowPayments
                      ? 'Waiting for confirmation'
                      : isConnectedEvm
                        ? Math.max(Number(nowPaymentsState?.minAmount), minBuy) >
                          Number(assetAmount)
                          ? `Minimum purchase is $${Math.max(Number(nowPaymentsState?.minAmount), minBuy)}`
                          : 'Buy now'
                        : 'Connect Wallet'}
                  </>
                </Button>
              ) : currentPaymentType === PaymentType.CRYPTO ? (
                <Button
                  size="48"
                  fullWidth
                  onClick={handleButtonClick}
                  disabled={isDisableBuy(false)}
                  loading={isTrxInProgress}
                >
                  <>
                    {!isConnectedEvm && selectedChainEvm
                      ? 'Connect Wallet'
                      : isTrxInProgress
                        ? 'Waiting for confirmation'
                        : !isConnectedSol &&
                            selectedChain.networkName === SaleAvailableNetworks.Solana
                          ? 'Connect Wallet'
                          : minValue
                            ? `Minimum purchase is $${minBuy}`
                            : isInsufficientBalance
                              ? 'Insufficient balance'
                              : userCapBuy
                                ? 'Amount exceeds cap'
                                : approveRequired
                                  ? 'Approve'
                                  : 'Buy now'}
                  </>
                </Button>
              ) : (
                <Button
                  size="48"
                  fullWidth
                  onClick={handleButtonClick}
                  disabled={isDisableBuy(true)}
                  loading={isTrxInProgress || loadingWert}
                >
                  <>
                    {minValue
                      ? `Minimum purchase is $${minBuy}`
                      : !isConnectedEvm
                        ? 'Connect Wallet'
                        : isTrxInProgress || loadingWert
                          ? 'Waiting for confirmation'
                          : 'Buy now'}
                  </>
                </Button>
              )}
            </>

            <div className="w-full flex  flex-col items-center justify-center space-y-[8px]">
              {' '}
              <span className="text-[14px] text-[#B9C0D4A3]">Or Direct Pay</span>
              <div className="flex items-center w-full  justify-between relative">
                <Tooltip
                  title={directPayTip}
                  isHover
                  placement={isMobile ? 'right' : 'top'}
                  isMobile={isMobile}
                >
                  <InfoIcon />
                </Tooltip>
                <span className="text-[8px] md:text-[10px] text-[#FFF]">{directPayAddress}</span>
                <CopyBtn text={directPayAddress} />
              </div>
            </div>
            {/* <p className={styles.label + ' mt-[16px] mb-[12px]'}>Or Direct Pay</p>
            <DirectAddress evmAddress="0x0000000000000000000" solAddress="Sooooooooooooooooool" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};
