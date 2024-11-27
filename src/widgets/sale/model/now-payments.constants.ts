import { NowPaymentCoins } from '@/shared';

import { NowPaymentsStatuses } from './now-payments.types';

// import btcIcon from '/svg/assets/btc.svg';
// import tronIcon from '/svg/assets/trx.svg';
// import tonIcon from '/svg/assets/ton.svg';
// import dogeIcon from '/svg/assets/doge.svg';
// import xrpIcon from '/svg/assets/xrp.svg';
// import ltcIcon from '/svg/assets/ltc.svg';
// import bchIcon from '/svg/assets/bch.svg';
// import adaIcon from '/svg/assets/ada.svg';
// import daiIcon from '/svg/assets/dai.svg';
// import shibIcon from '/svg/assets/shib.svg';
// import usdtIcon from '/svg/assets/usdt.svg';

export const NOW_PAYMENTS_ENDPOINT = 'https://nowpayments-api.solanex.ai';

export const NowPaymentsChains = [
  {
    label: 'Bitcoin',
    value: NowPaymentCoins.BTC,
    icon: '/svg/assets/btc.svg',
    shortName: 'BTC',
  },
  {
    label: 'Tron',
    value: NowPaymentCoins.TRX,
    icon: '/svg/assets/trx.svg',
    shortName: 'TRX',
  },
  {
    label: 'Litecoin',
    value: NowPaymentCoins.LTC,
    icon: '/svg/assets/ltc.svg',
    shortName: 'LTC',
  },
  {
    label: 'Dogecoin',
    value: NowPaymentCoins.DOGE,
    icon: '/svg/assets/doge.svg',
    shortName: 'DOGE',
  },
  {
    label: 'XRP',
    value: NowPaymentCoins.XRP,
    icon: '/svg/assets/xrp.svg',
    shortName: 'XRP',
  },
  {
    label: 'Bitcoin Cash',
    value: NowPaymentCoins.BCH,
    icon: '/svg/assets/bch.svg',
    shortName: 'BCH',
  },
  {
    label: 'TON',
    value: NowPaymentCoins.TON,
    icon: '/svg/assets/ton.svg',
    shortName: 'TON',
  },
  {
    label: 'Cardano',
    value: NowPaymentCoins.ADA,
    icon: '/svg/assets/ada.svg',
    shortName: 'ADA',
  },
  {
    label: 'DAI',
    value: NowPaymentCoins.DAI,
    icon: '/svg/assets/dai.svg',
    shortName: 'DAI',
  },
  {
    label: 'Shiba Inu',
    value: NowPaymentCoins.SHIB,
    icon: '/svg/assets/shib.svg',
    shortName: 'SHIB',
  },
];

export const NowPaymentsCollaterals = [
  {
    coin: NowPaymentCoins.TRX,
    label: 'USDT TRC20',
    value: NowPaymentCoins.USDT_TRX20,
    icon: '/svg/assets/usdt.svg',
    shortName: 'USDTTRC20',
    default: true,
  },
];

export const NowPaymentsStatusesAll = [
  NowPaymentsStatuses.failed,
  NowPaymentsStatuses.finished,
  NowPaymentsStatuses.waiting,
];
