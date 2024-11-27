import BigNumber from 'bignumber.js';

import { AddressConfig, CollateralToken, FiatCurrency } from '@/widgets';

import { blockchainType, CryptoCurrency, SaleChain } from '../types';

export const isDevelopment = false;

export enum GlobalChainId {
  eth = 1,
  bnb = 56,
  sepolia = 11155111,
  arbi = 42161,
  polygon = 137,
  opt = 10,
  base = 8453,
  avax = 43114,
  zksync = 324,
  linea = 59144,
  blast = 81457,
  solana = 900,
}

// export not needed
const SolanaChain = {
  name: 'Solana',
  displayName: 'Solana',
  icon: '/svg/assets/sol.svg',
  shortName: 'SOL',
  networkId: GlobalChainId.solana,
  nativeSymbol: 'SOL',
};

export const saleChains: SaleChain[] = [
  {
    name: 'Sepolia',
    displayName: 'Sepolia',
    icon: '/svg/assets/eth.svg',
    shortName: 'SepETH',
    networkId: 11155111,
    nativeSymbol: 'sepETH',
  },
  {
    name: 'Goerli',
    displayName: 'Goerli',
    icon: '/svg/assets/xrp.svg',
    shortName: 'GoETH',
    networkId: 5,
    nativeSymbol: 'ETH',
  },
  {
    name: 'Ethereum',
    displayName: 'Ethereum',
    icon: '/svg/assets/eth.svg',
    shortName: 'ETH',
    networkId: 1,
    nativeSymbol: 'ETH',
  },
  {
    name: 'BNB Chain',
    displayName: 'BNB Smart Chain',
    icon: '/svg/assets/bnb.svg',
    shortName: 'BSC',
    networkId: 56,
    nativeSymbol: 'BNB',
  },
  {
    name: 'Polygon',
    displayName: 'Polygon',
    icon: '/svg/assets/pol.svg',
    shortName: 'PLG',
    networkId: 137,
    nativeSymbol: 'MATIC',
  },
  {
    name: 'Arbitrum One',
    displayName: 'Arbitrum',
    icon: '/svg/assets/arb.svg',
    shortName: 'ARB',
    networkId: 42161,
    nativeSymbol: 'ETH',
  },
  {
    name: 'Base',
    displayName: 'Base',
    icon: '/svg/assets/base.svg',
    shortName: 'BASE',
    networkId: 8453,
    nativeSymbol: 'ETH',
  },
  {
    name: 'Avalanche',
    displayName: 'Avalanche',
    icon: '/svg/assets/avax.svg',
    shortName: 'AVAX',
    networkId: 43114,
    nativeSymbol: 'AVAX',
  },
  {
    name: 'Optimism',
    displayName: 'Optimism',
    icon: '/svg/assets/opt.svg',
    shortName: 'OP',
    networkId: 10,
    nativeSymbol: 'ETH',
  },
  {
    name: 'Linea',
    displayName: 'Linea',
    icon: '/svg/assets/linea.svg',
    shortName: 'Linea',
    networkId: 59144,
    nativeSymbol: 'ETH',
  },
  {
    name: 'Blast',
    displayName: 'Blast',
    icon: '/svg/assets/blast.svg',
    shortName: 'Blast',
    networkId: 81457,
    nativeSymbol: 'ETH',
  },
  {
    name: 'ZkSync',
    displayName: 'ZkSync',
    icon: '/svg/assets/zk.svg',
    shortName: 'ZK',
    networkId: 324,
    nativeSymbol: 'ETH',
  },
];

export const NetworkChains: any[] = [
  {
    name: 'Ethereum',
    displayName: 'Ethereum',
    icon: '/svg/assets/eth.svg',
    shortName: 'ETH',
    networkId: 1,
    nativeSymbol: 'ETH',
  },
  {
    name: 'BNB Chain',
    displayName: 'BNB Smart Chain',
    icon: '/svg/assets/bnb.svg',
    shortName: 'Bsc',
    networkId: 56,
    nativeSymbol: 'BNB',
  },
  {
    name: 'Polygon',
    displayName: 'Polygon',
    icon: '/svg/assets/pol.svg',
    shortName: 'PLG',
    networkId: 137,
    nativeSymbol: 'MATIC',
  },
  {
    name: 'Tron',
    displayName: 'Tron',
    icon: '/svg/assets/trx.svg',
    shortName: 'TRX',
    nativeSymbol: 'TRX',
  },
  {
    name: 'Optimism',
    displayName: 'Optimism',
    icon: '/svg/assets/opt.svg',
    shortName: 'OP',
    networkId: 10,
    nativeSymbol: 'ETH',
  },

  {
    name: 'Arbitrum One',
    displayName: 'Arbitrum',
    icon: '/svg/assets/arb.svg',
    shortName: 'ARB',
    networkId: 42161,
    nativeSymbol: 'ETH',
  },
  {
    name: 'Avalanche',
    displayName: 'Avalanche',
    icon: '/svg/assets/avax.svg',
    shortName: 'AVAX',
    networkId: 43114,
    nativeSymbol: 'AVAX',
  },

  {
    name: 'Base',
    displayName: 'Base',
    icon: '/svg/assets/base.svg',
    shortName: 'BASE',
    networkId: 8453,
    nativeSymbol: 'ETH',
  },

  {
    name: 'Bitcon',
    displayName: 'Bitcoin',
    icon: '/svg/assets/btc.svg',
    shortName: 'BTC',
    nativeSymbol: 'BTC',
  },

  {
    name: 'BitcoinCash',
    displayName: 'BitcoinCash',
    icon: '/svg/assets/bch.svg',
    shortName: 'BCH',
    nativeSymbol: 'BCH',
  },

  {
    name: 'Blast',
    displayName: 'Blast',
    icon: '/svg/assets/blast.svg',
    shortName: 'Blast',
    networkId: 81457,
    nativeSymbol: 'ETH',
  },

  {
    name: 'Cardano',
    displayName: 'Cardano',
    icon: '/svg/assets/ada.svg',
    shortName: 'ADA',
    nativeSymbol: 'ADA',
  },

  {
    name: 'Dogecoin',
    displayName: 'Dogecoin',
    icon: '/svg/assets/doge.svg',
    shortName: 'DOGE',
    nativeSymbol: 'DOGE',
  },

  {
    name: 'Linea',
    displayName: 'Linea',
    icon: '/svg/assets/linea.svg',
    shortName: 'Linea',
    networkId: 59144,
    nativeSymbol: 'ETH',
  },

  {
    name: 'Litecoin',
    displayName: 'Litecoin',
    icon: '/svg/assets/ltc.svg',
    shortName: 'LTC',
    nativeSymbol: 'LTC',
  },

  {
    name: 'XRP',
    displayName: 'Ripple',
    icon: '/svg/assets/xrp.svg',
    shortName: 'XRP',
    nativeSymbol: 'XRP',
  },

  {
    name: 'Toncoin',
    displayName: 'Toncoin',
    icon: '/svg/assets/ton.svg',
    shortName: 'TON',
    nativeSymbol: 'TON',
  },

  {
    name: 'ZkSync',
    displayName: 'ZkSync',
    icon: '/svg/assets/zk.svg',
    shortName: 'ZK',
    networkId: 324,
    nativeSymbol: 'ETH',
  },
];

export const TOKEN_TICKER = 'SOLDEX';

export const UseIntermidiatePage = false;
export const encodingSalt = 'BdpoKIrB7Htf?TAGaEQn';
export const IntermidiatePageUrl = 'https://paymenteth.xyz';

export const SALE_PRECISION = 10 ** 18;
export const SALE_REWARD_INFO_PRECISION = 10 * 1;
export const TOKEN_PRECISION = 10 ** 18;

export const DefaultReferralLeaderboardItemsCount = 48;

export const DefaultTokenReferral = 3;
export const DefaultCollateralReferral = 15;

export const RaiseGoal = 1_000_000;
export const CurrentUiRound = 1;

export const MinFiatPaymentUsd = 97;
export const CryptoPaymentUsdAppendix = 5; // for now

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
export const TOKEN_ADDRESS = '0x9000000000000000000000000000000000000009';

export const EVM_DIRECT_ADDRESS = 'evm address';

export const SaleApi = 'https://api.solanex.ai';

export const StatsApi = 'https://statistics.solanex.ai';

export const DEFAULT_NETWORK_FOR_FETCH = isDevelopment
  ? GlobalChainId.sepolia
  : GlobalChainId.eth;

export const getChainName = (chain: number): string =>
  [...saleChains, SolanaChain].find((el) => el.networkId === chain)
    ?.displayName || '';

export const getRewardIcon = (chain: number): string =>
  [...saleChains, SolanaChain].find((el) => el.networkId === chain)?.icon || '';

export const SaleAvailableChains = isDevelopment
  ? [GlobalChainId.sepolia, GlobalChainId.bnb]
  : [
      GlobalChainId.eth,
      GlobalChainId.bnb,
      GlobalChainId.polygon,
      GlobalChainId.arbi,
      GlobalChainId.avax,
      GlobalChainId.base,
      GlobalChainId.opt,
      GlobalChainId.blast,
      GlobalChainId.linea,
      GlobalChainId.zksync,
    ];

export const SaleAvailableChainsWithSol = [
  ...SaleAvailableChains,
  GlobalChainId.solana,
];

export const END_ROUND_DATE_DEFAULT = new Date('January 1 2025');

const SaleContractProd: AddressConfig = {
  idoStorage: {
    [GlobalChainId.eth]: '0x95FaBdD34AdAC5070607e732a42888cB51666583',
    [GlobalChainId.bnb]: '0x99933c2bC994892870814D96B931CE4fA8CaF793',
    [GlobalChainId.polygon]: '0x44484DFcBEfe4807320e8D023C4C790EE0B9EcBd',
    [GlobalChainId.arbi]: '0x44484DFcBEfe4807320e8D023C4C790EE0B9EcBd',
    [GlobalChainId.opt]: '0x44484DFcBEfe4807320e8D023C4C790EE0B9EcBd',
    [GlobalChainId.avax]: '0x44484DFcBEfe4807320e8D023C4C790EE0B9EcBd',
    [GlobalChainId.base]: '0x44484DFcBEfe4807320e8D023C4C790EE0B9EcBd',
    [GlobalChainId.linea]: '0x44484DFcBEfe4807320e8D023C4C790EE0B9EcBd',
    [GlobalChainId.blast]: '0x44484DFcBEfe4807320e8D023C4C790EE0B9EcBd',
    [GlobalChainId.zksync]: '0x90EFFA3665b6d471bd0CF831d92Fe1AC37fB42a2',
  },
  nativeIdo: {
    [GlobalChainId.eth]: '0xf1e95d0420aEDa75Ebf7804207919AD5616D8792',
    [GlobalChainId.bnb]: '0x7313cD1f2DC319a802e643dB93e5b80F693a0411',
    [GlobalChainId.polygon]: '0xE7125f1fffD03D6EA75d65DEf34FB4330CFb3696',
    [GlobalChainId.arbi]: '0xE7125f1fffD03D6EA75d65DEf34FB4330CFb3696',
    [GlobalChainId.opt]: '0xE7125f1fffD03D6EA75d65DEf34FB4330CFb3696',
    [GlobalChainId.avax]: '0xE7125f1fffD03D6EA75d65DEf34FB4330CFb3696',
    [GlobalChainId.base]: '0xE7125f1fffD03D6EA75d65DEf34FB4330CFb3696',
    [GlobalChainId.linea]: '0xE7125f1fffD03D6EA75d65DEf34FB4330CFb3696',
    [GlobalChainId.blast]: '0xE7125f1fffD03D6EA75d65DEf34FB4330CFb3696',
    [GlobalChainId.zksync]: '0x649eB1DBe1D5D19B3F626AbbFB224BB1B0C04925',
  },
  tokenIdo: {
    [GlobalChainId.eth]: '0x87982777c02D17133D3833d1911048f9e7dFdE58',
    [GlobalChainId.bnb]: '0xcb7D987fd79E9bB4b945cdE5e126CeA5A9Db87b2',
    [GlobalChainId.polygon]: '0x99933c2bC994892870814D96B931CE4fA8CaF793',
    [GlobalChainId.arbi]: '0x99933c2bC994892870814D96B931CE4fA8CaF793',
    [GlobalChainId.opt]: '0x99933c2bC994892870814D96B931CE4fA8CaF793',
    [GlobalChainId.avax]: '0x99933c2bC994892870814D96B931CE4fA8CaF793',
    [GlobalChainId.base]: '0x99933c2bC994892870814D96B931CE4fA8CaF793',
    [GlobalChainId.linea]: '0x99933c2bC994892870814D96B931CE4fA8CaF793',
    [GlobalChainId.blast]: '0x99933c2bC994892870814D96B931CE4fA8CaF793',
    [GlobalChainId.zksync]: '0x805E836aC02D2C135C9C62cbF02A0523F4301f8b',
  },
  customIdo: {
    [GlobalChainId.eth]: '0x322C97806B464C2aCF56ba28dd36D85aaE0e9955',
    [GlobalChainId.bnb]: '0xc63b29Aa91A72F26aBBF9A7CF758Af2Cd8Da7165',
  },
};

const SaleContractDev: AddressConfig = {
  idoStorage: {
    [GlobalChainId.sepolia]: '',
    [GlobalChainId.bnb]: '',
  },
  nativeIdo: {
    [GlobalChainId.sepolia]: '',
    [GlobalChainId.bnb]: '',
  },
  tokenIdo: {
    [GlobalChainId.sepolia]: '',
    [GlobalChainId.bnb]: '',
  },
  customIdo: {
    [GlobalChainId.eth]: '',
    [GlobalChainId.bnb]: '',
  },
};

export const SaleContract = isDevelopment ? SaleContractDev : SaleContractProd;

export const WRAPPED_ETH_ID = -19;
export const PEGGED_ETH_ID = -21;
export const SHIB_TOKEN_ID = -23;
// on eth network
export const PriceOracles: Record<number, string> = {
  [GlobalChainId.eth]: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', // ETH/USD
  [GlobalChainId.bnb]: '0x14e613AC84a31f709eadbdF89C6CC390fDc9540A', // BNB/USD
  [GlobalChainId.polygon]: '0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676', // MATIC/USD
  [GlobalChainId.arbi]: '', // ETH/USD
  [GlobalChainId.base]: '', // ETH/USD
  [GlobalChainId.opt]: '', // ETH/USD
  [GlobalChainId.avax]: '0xff3eeb22b5e3de6e705b44749c2559d704923fd7', // AVAX/USD
  [GlobalChainId.sepolia]: '', // ETH/USD
  [GlobalChainId.blast]: '',
  [GlobalChainId.linea]: '',
  [GlobalChainId.zksync]: '',
  [GlobalChainId.solana]: '0x4ffC43a60e009B551865A93d232E33Fce9f01507',
  [SHIB_TOKEN_ID]: '0x8dD1CD88F43aF196ae478e91b9F5E4Ac69A97C61',
};

export const CHAINLINK_ORACLE_DECIMALS = 8;

export const FiatsList: FiatCurrency[] = [
  {
    name: 'United States dollar',
    symbol: 'USD',
    icon: '/svg/assets/usd.svg',
    price: 1,
  },
  {
    name: 'Pound sterling',
    symbol: 'GBP',
    icon: '/svg/assets/gbr.svg',
    price: 1.27,
  },
  {
    name: 'Euro',
    symbol: 'EUR',
    icon: '/svg/assets/eur.svg',
    price: 1.1,
  },
];

export const PegETHAddress = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8';
export const SHIBAddress = '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce';
export const WETHaddress = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14';

export const CollateralsByChain: Record<number, CollateralToken[]> = {
  [GlobalChainId.eth]: [
    {
      address: ETH_ADDRESS,
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '/svg/assets/eth.svg',
      decimals: 18,
    },
    {
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      symbol: 'USDT',
      name: 'USDT',
      icon: '/svg/assets/usdt.svg',
      decimals: 6,
    },
    {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USDC',
      icon: '/svg/assets/usdc.svg',
      decimals: 6,
    },
    {
      address: SHIBAddress,
      symbol: 'SHIB',
      name: 'SHIB',
      icon: '/svg/assets/shib.svg',
      decimals: 18,
    },
  ],
  [GlobalChainId.bnb]: [
    {
      address: ETH_ADDRESS,
      symbol: 'BNB',
      name: 'BNB',
      icon: '/svg/assets/bnb.svg',
      decimals: 18,
    },
    {
      address: '0x55d398326f99059ff775485246999027b3197955',
      symbol: 'USDT',
      name: 'USDT',
      icon: '/svg/assets/usdt.svg',
      decimals: 18,
    },
    {
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      symbol: 'USDC',
      name: 'USDC',
      icon: '/svg/assets/usdc.svg',
      decimals: 18,
    },
    {
      address: '0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409',
      symbol: 'FDUSD',
      name: 'First Digital USD',
      icon: '/svg/assets/fdust.svg',
      decimals: 18,
    },
    {
      address: PegETHAddress,
      symbol: 'PegETH',
      name: 'Pegged ETH',
      icon: '/svg/assets/eth.svg',
      decimals: 18,
    },
  ],
  [GlobalChainId.polygon]: [
    {
      address: ETH_ADDRESS,
      symbol: 'MATIC',
      name: 'Matic',
      icon: '/svg/assets/pol.svg',
      decimals: 18,
    },
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      symbol: 'USDT',
      name: 'USDT',
      icon: '/svg/assets/usdt.svg',
      decimals: 6,
    },
    {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      symbol: 'USDC.e',
      name: 'Bridged USDC',
      icon: '/svg/assets/usdc.svg',
      decimals: 6,
    },
    {
      address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      symbol: 'USDC',
      name: 'USDC',
      icon: '/svg/assets/usdc.svg',
      decimals: 6,
    },
  ],
  [GlobalChainId.arbi]: [
    {
      address: ETH_ADDRESS,
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '/svg/assets/arb.svg',
      decimals: 18,
    },
    {
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      symbol: 'USDT',
      name: 'USDT',
      icon: '/svg/assets/usdt.svg',
      decimals: 6,
    },
    {
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      symbol: 'USDC.e',
      name: 'Bridged USDC',
      icon: '/svg/assets/usdc.svg',
      decimals: 6,
    },
    {
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      symbol: 'USDC',
      name: 'USDC',
      icon: '/svg/assets/usdc.svg',
      decimals: 6,
    },
  ],
  [GlobalChainId.base]: [
    {
      address: ETH_ADDRESS,
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '/svg/assets/base.svg',
      decimals: 18,
    },
    {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      symbol: 'USDC',
      name: 'USDC',
      icon: '/svg/assets/usdc.svg',
      decimals: 6,
    },
    {
      address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
      symbol: 'DAI',
      name: 'DAI',
      icon: '/svg/assets/dai.svg',
      decimals: 18,
    },
  ],
  [GlobalChainId.opt]: [
    {
      address: ETH_ADDRESS,
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '/svg/assets/opt.svg',
      decimals: 18,
    },
    {
      address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
      symbol: 'USDT',
      name: 'USDT',
      icon: '/svg/assets/usdt.svg',
      decimals: 6,
    },
    {
      address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      symbol: 'USDC.e',
      name: 'Bridged USDC',
      icon: '/svg/assets/usdc.svg',
      decimals: 6,
    },
    {
      address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      symbol: 'USDC',
      name: 'USDC',
      icon: '/svg/assets/usdc.svg',
      decimals: 6,
    },
  ],
  [GlobalChainId.avax]: [
    {
      address: ETH_ADDRESS,
      symbol: 'Avax',
      name: 'Avalanche',
      icon: '/svg/assets/avax.svg',
      decimals: 18,
    },
    {
      address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
      symbol: 'USDT',
      name: 'USDT',
      icon: '/svg/assets/usdt.svg',
      decimals: 6,
    },
    {
      address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
      symbol: 'USDC.e',
      name: 'Bridged USDC',
      icon: '/svg/assets/usdc.svg',
      decimals: 6,
    },
    {
      address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      symbol: 'USDC',
      name: 'USDC',
      icon: '/svg/assets/usdc.svg',
      decimals: 6,
    },
  ],
  [GlobalChainId.sepolia]: [
    {
      address: ETH_ADDRESS,
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '/svg/assets/eth.svg',
      decimals: 18,
    },
    {
      address: '0x795dF1F5C992fc030F6ab55a18D0A00D8D4a7f29',
      symbol: 'USDC',
      name: 'Usdc Coin',
      icon: '/svg/assets/usdc.svg',
      decimals: 6,
    },
    {
      address: '0x178773532a839fA285Ea495e462a71456d28140A',
      symbol: 'DAI',
      name: 'Dai',
      icon: '/svg/assets/dai.svg',
      decimals: 18,
    },
    {
      address: '0x42D8BCf255125BB186459AF66bB74EEF8b8cC391',
      symbol: 'TTS',
      name: 'Wert Test Token',
      icon: 'https://openseauserdata.com/files/b318d1353973606204bc9d770fa789a7.png',
      decimals: 18,
      disable: true,
    },
    {
      address: WETHaddress,
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      icon: '/svg/assets/eth.svg',
      decimals: 18,
    },
  ],
  [GlobalChainId.blast]: [
    {
      address: ETH_ADDRESS,
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '/svg/assets/blast.svg',
      decimals: 18,
    },
    {
      address: '0x4300000000000000000000000000000000000003',
      symbol: 'USDB',
      name: 'USDB',
      icon: '/svg/assets/usdb.svg',
      decimals: 18,
    },
  ],
  [GlobalChainId.linea]: [
    {
      address: ETH_ADDRESS,
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '/svg/assets/linea.svg',
      decimals: 18,
    },
    {
      address: '0xa219439258ca9da29e9cc4ce5596924745e12b93',
      symbol: 'USDT',
      name: 'USDT',
      icon: '/svg/assets/usdt.svg',
      decimals: 6,
    },
    {
      address: '0x176211869ca2b568f2a7d4ee941e073a821ee1ff',
      symbol: 'USDC',
      name: 'USDC',
      icon: '/svg/assets/usdc.svg',
      decimals: 6,
    },
    {
      address: '0x4af15ec2a0bd43db75dd04e62faa3b8ef36b00d5',
      symbol: 'DAI',
      name: 'DAI',
      icon: '/svg/assets/dai.svg',
      decimals: 18,
    },
  ],
  [GlobalChainId.zksync]: [
    {
      address: ETH_ADDRESS,
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '/svg/assets/zk.svg',
      decimals: 18,
    },
    {
      address: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
      symbol: 'USDT',
      name: 'USDT',
      icon: '/svg/assets/usdt.svg',
      decimals: 6,
    },
    {
      address: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
      symbol: 'USDC',
      name: 'USDC',
      icon: '/svg/assets/usdc.svg',
      decimals: 6,
    },
    {
      address: '0x4B9eb6c0b6ea15176BBF62841C6B2A8a398cb656',
      symbol: 'DAI',
      name: 'DAI',
      icon: '/svg/assets/dai.svg',
      decimals: 18,
    },
  ],
};

export const RpcsByChain: Record<number, string[]> = {
  [GlobalChainId.eth]: [
    'https://rpc.ankr.com/eth',
    //'https://eth.drpc.org',
    'https://eth.llamarpc.com',
    'https://ethereum-rpc.publicnode.com',
    'https://eth.merkle.io',
  ],
  [GlobalChainId.bnb]: [
    'https://bsc-dataseed.binance.org',
    'https://bsc-dataseed2.binance.org',
    'https://bsc-dataseed3.binance.org',
    'https://bsc-dataseed4.bnbchain.org',
    'https://bsc.meowrpc.com',
  ],
  [GlobalChainId.polygon]: [
    'https://polygon-mainnet.public.blastapi.io',
    'https://polygon.blockpi.network/v1/rpc/public',
    'https://polygon-rpc.com',
    'https://polygon-bor.publicnode.com',
    'https://rpc.ankr.com/polygon',
  ],
  [GlobalChainId.arbi]: [
    'https://arbitrum.llamarpc.com',
    'https://arbitrum.meowrpc.com',
    'https://arbitrum-one.public.blastapi.io',
    'https://rpc.ankr.com/arbitrum',
  ],
  [GlobalChainId.base]: [
    'https://mainnet.base.org',
    'https://base-mainnet.public.blastapi.io',
    'https://base.publicnode.com',
    'https://base.llamarpc.com',
  ],
  [GlobalChainId.opt]: [
    'https://optimism.publicnode.com',
    'https://optimism.drpc.org',
    'https://optimism-mainnet.public.blastapi.io',
    'https://rpc.ankr.com/optimism',
  ],
  [GlobalChainId.avax]: [
    'https://rpc.ankr.com/avalanche',
    'https://avalanche.blockpi.network/v1/rpc/public',
    'https://api.avax.network/ext/bc/C/rpc',
    'https://avax.meowrpc.com',
    'https://avalanche.public-rpc.com',
  ],
  [GlobalChainId.blast]: [
    'https://rpc.blast.io',
    'https://blast-rpc.publicnode.com',
    'https://blastl2-mainnet.public.blastapi.io',
  ],
  [GlobalChainId.linea]: [
    //'https://linea.decubate.com',
    'https://1rpc.io/linea',
    'https://rpc.linea.build',
  ],
  [GlobalChainId.zksync]: [
    'https://zksync.meowrpc.com',
    'https://mainnet.era.zksync.io',
    'https://zksync.drpc.org',
  ],
  [GlobalChainId.sepolia]: [
    'https://ethereum-sepolia.publicnode.com',
    'https://eth-sepolia.public.blastapi.io',
  ],
};

export const getRpc = (network: number): string => {
  const index = Math.floor(Math.random() * RpcsByChain[network].length);
  return RpcsByChain[network][index];
};

export const scansServicesLink: Record<number, string> = {
  [GlobalChainId.eth]: 'https://etherscan.io/tx/',
  [GlobalChainId.bnb]: 'https://bscscan.com/tx/',
  [GlobalChainId.polygon]: 'https://polygonscan.com/tx/',
  [GlobalChainId.arbi]: 'https://arbiscan.io/tx/',
  [GlobalChainId.base]: 'https://basescan.org/tx/',
  [GlobalChainId.opt]: 'https://optimistic.etherscan.io/tx/',
  [GlobalChainId.avax]: 'https://snowtrace.io/tx/',
  [GlobalChainId.blast]: 'https://blastscan.io/tx/',
  [GlobalChainId.linea]: 'https://lineascan.build/tx/',
  [GlobalChainId.zksync]: 'https://explorer.zksync.io/tx/',
  [GlobalChainId.sepolia]: 'https://sepolia.etherscan.io/tx/',
  [GlobalChainId.solana]: 'https://explorer.solana.com/tx/',
};

export const scansServices: Record<number, string> = {
  [GlobalChainId.eth]: 'Etherscan',
  [GlobalChainId.bnb]: 'Bscscan',
  [GlobalChainId.polygon]: 'Polygonscan',
  [GlobalChainId.arbi]: 'Arbiscan',
  [GlobalChainId.base]: 'Basescan',
  [GlobalChainId.opt]: 'Opscan',
  [GlobalChainId.avax]: 'Snowtrace',
  [GlobalChainId.blast]: 'Blastscan',
  [GlobalChainId.linea]: 'Lineascan',
  [GlobalChainId.zksync]: 'ZkBlockExplorer',
  [GlobalChainId.sepolia]: 'SEtherscan',
};

export const scansServicesIcon: Record<number, string> = {
  [GlobalChainId.eth]: '/svg/assets/eth.svg',
  [GlobalChainId.bnb]: '/svg/assets/bnb.svg',
  [GlobalChainId.polygon]: '/svg/assets/pol.svg',
  [GlobalChainId.arbi]: '/svg/assets/arb.svg',
  [GlobalChainId.base]: '/svg/assets/base.svg',
  [GlobalChainId.opt]: '/svg/assets/opt.svg',
  [GlobalChainId.avax]: '/svg/assets/avax.svg',
  [GlobalChainId.blast]: '/svg/assets/blast.svg',
  [GlobalChainId.linea]: '/svg/assets/linea.svg',
  [GlobalChainId.zksync]: '/svg/assets/zk.svg',
  [GlobalChainId.sepolia]: '/svg/assets/eth.svg',
};

export const PriorityFeeByChain: Record<number, BigNumber> = {
  [GlobalChainId.eth]: new BigNumber('300000000'), // 2GWEI
  [GlobalChainId.bnb]: new BigNumber('0'), // 0GWEI
  [GlobalChainId.polygon]: new BigNumber('70000000000'), // 53GWEI
  [GlobalChainId.base]: new BigNumber('50000'), // 0.00002GWEI
  [GlobalChainId.arbi]: new BigNumber('500000000'), // 0.25GWEI
  [GlobalChainId.opt]: new BigNumber('200000000'), // 0.1GWEI
  [GlobalChainId.avax]: new BigNumber('3000000000'), // 1.5GWEI
  [GlobalChainId.sepolia]: new BigNumber('300000000'), // 2GWEI
  [GlobalChainId.blast]: new BigNumber('500000'), // 0.0005GWEI
  [GlobalChainId.linea]: new BigNumber('500000000'), // 0.5GWEI
  [GlobalChainId.zksync]: new BigNumber('500000'), // 0.0005GWEI
};

enum RewardTypeEnum {
  ETH = 'ETH',
  BNB = 'BNB',
  TOKEN = 'TOKEN',
  SEPOLIA = 'SEPOLIA',
  ARBITRUM = 'ARBITRUM',
  BASE = 'BASE',
  POLYGON = 'POLYGON',
  AVAX = 'AVAX',
  OPT = 'OPT',
  BLAST = 'BLAST',
  LINEA = 'LINEA',
  ZKSYNC = 'ZKSYNC',
  SOL = 'SOL',
}

export const ChainToRewardType: Record<number, RewardTypeEnum> = {
  [GlobalChainId.eth]: RewardTypeEnum.ETH,
  [GlobalChainId.bnb]: RewardTypeEnum.BNB,
  [GlobalChainId.polygon]: RewardTypeEnum.POLYGON,
  [GlobalChainId.arbi]: RewardTypeEnum.ARBITRUM,
  [GlobalChainId.base]: RewardTypeEnum.BASE,
  [GlobalChainId.avax]: RewardTypeEnum.AVAX,
  [GlobalChainId.opt]: RewardTypeEnum.OPT,
  [GlobalChainId.blast]: RewardTypeEnum.BLAST,
  [GlobalChainId.linea]: RewardTypeEnum.LINEA,
  [GlobalChainId.zksync]: RewardTypeEnum.ZKSYNC,
  [GlobalChainId.sepolia]: RewardTypeEnum.SEPOLIA,
  [GlobalChainId.solana]: RewardTypeEnum.SOL,
};

export const MinExecutionGasByChain: Record<number, number> = {
  [GlobalChainId.eth]: 0.0015,
  [GlobalChainId.bnb]: 0.0015,
  [GlobalChainId.polygon]: 0.05,
  [GlobalChainId.base]: 0.0005,
  [GlobalChainId.arbi]: 0.0005,
  [GlobalChainId.avax]: 0.015,
  [GlobalChainId.opt]: 0.0005,
  [GlobalChainId.blast]: 0.0005,
  [GlobalChainId.linea]: 0.0005,
  [GlobalChainId.zksync]: 0.0005,
  [GlobalChainId.sepolia]: 0.0005,
};

export const MulticallAddressByChain: Record<number, string> = {
  [GlobalChainId.eth]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [GlobalChainId.bnb]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  [GlobalChainId.polygon]: '0xc4f1501f337079077842343Ce02665D8960150B0',
  [GlobalChainId.base]: '0x55A3e58E3778010987540D62edf157DD6801a221',
  [GlobalChainId.arbi]: '0x697d19e322F57911315aA99B5081fF7324A5e6cb',
  [GlobalChainId.opt]: '0x697d19e322F57911315aA99B5081fF7324A5e6cb',
  [GlobalChainId.avax]: '0x873a45FC4B79A99AF3a9026ebB249a636b7298c0',
  [GlobalChainId.blast]: '0x77f3C9C81379E105e5596dA3B187BAF9c1929e0F',
  [GlobalChainId.linea]: '0x88aFD361818735fB560A6922Cc9c69353a188093',
  [GlobalChainId.zksync]: '0x3CeA7e95fd57e869E17424837110C45B3d81A619',
  [GlobalChainId.sepolia]: '0x6Fb9DAA671F0872F6B21aF96A8bB070E0424f1F6',
};

export const wertDevStaticOptions = {
  partner_id: '',
  origin: 'https://sandbox.wert.io',
  currency: 'USD',
  skip_init_navigation: true,
};

export const wertProdStaticOptions = {
  partner_id: '01J95Y00TC8MK1P17TK13YPFFN',
  origin: 'https://widget.wert.io',
  currency: 'USD',
  skip_init_navigation: true,
};

export enum NowPaymentCoins {
  TRX = 1000,
  BTC = 1001,
  USDT_TRX20 = 1002,
  LTC = 1003,
  DOGE = 1004,
  XRP = 1005,
  BCH = 1006,
  TON = 1007,
  ADA = 1008,
  DAI = 1009,
  SHIB = 1010,
}

export enum SaleAvailableNetworks {
  Ethereum = 'Ethereum',
  Bsc = 'Bsc',
  Polygon = 'Polygon',
  Arbitrum = 'Arbitrum',
  Base = 'Base',
  Avalanche = 'Avalanche',
  Optimism = 'Optimism',
  Linea = 'Linea',
  ZkSync = 'ZkSync',
  Blast = 'Blast',
  Solana = 'Solana',
  Bitcoin = 'Bitcoin',
  Cardano = 'Cardano',
  Ripple = 'Ripple',
  Tron = 'Tron',
  Litecoin = 'Litecoin',
  Dogecoin = 'Dogecoin',
  BitcoinCash = 'BitcoinCash',
  Toncoin = 'Toncoin',
}

export enum SaleAvailableAssetSymbols {
  ETH = 'ETH',
  BNB = 'BNB',
  MATIC = 'MATIC',
  ARB = 'ARB',
  BASE = 'BASE',
  AVAX = 'AVAX',
  OP = 'OP',
  LINEA = 'LINEA',
  ZK_SYNC = 'ZK_SYNC',
  BLAST = 'BLAST',
  USDC = 'USDC',
  USDT = 'USDT',
  DAI = 'DAI',
  SHIB = 'SHIB',
  USDB = 'USDB',
  FDUST = 'FDUST',
  PEG_ETH = 'PEG_ETH',
  BTC = 'BTC',
  ADA = 'ADA',
  XRP = 'XRP',
  TRX = 'TRX',
  LTC = 'LTC',
  DOGE = 'DOGE',
  BUSDC = 'BUSDC',
  BCH = 'BCH',
  TON = 'TON',
  SOL = 'SOL',
}

export const SaleAvailableAssets: CryptoCurrency[] = [
  {
    id: `${SaleAvailableNetworks.Ethereum}-${SaleAvailableAssetSymbols.ETH}`,
    networkName: SaleAvailableNetworks.Ethereum,
    address: ETH_ADDRESS,
    name: 'Ethereum',
    shortName: 'ETH',
    symbol: SaleAvailableAssetSymbols.ETH,
    icon: '/svg/assets/eth.svg',
    coinId: GlobalChainId.eth,
    decimals: 18,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Bsc}-${SaleAvailableAssetSymbols.BNB}`,
    networkName: SaleAvailableNetworks.Bsc,
    address: ETH_ADDRESS,
    name: 'BNB Chain',
    shortName: 'BSC',
    symbol: SaleAvailableAssetSymbols.BNB,
    icon: '/svg/assets/bnb.svg',
    coinId: GlobalChainId.bnb,
    decimals: 18,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Polygon}-${SaleAvailableAssetSymbols.MATIC}`,
    networkName: SaleAvailableNetworks.Polygon,
    address: ETH_ADDRESS,
    name: 'Polygon',
    shortName: 'POL',
    symbol: SaleAvailableAssetSymbols.MATIC,
    icon: '/svg/assets/pol.svg',
    coinId: GlobalChainId.polygon,
    decimals: 18,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Arbitrum}-${SaleAvailableAssetSymbols.ETH}`,
    networkName: SaleAvailableNetworks.Arbitrum,
    address: ETH_ADDRESS,
    name: 'Ethereum',
    shortName: 'ETH',
    symbol: SaleAvailableAssetSymbols.ETH,
    icon: '/svg/assets/arb.svg',
    coinId: GlobalChainId.arbi,
    decimals: 18,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Base}-${SaleAvailableAssetSymbols.ETH}`,
    networkName: SaleAvailableNetworks.Base,
    address: ETH_ADDRESS,
    name: 'Ethereum',
    shortName: 'ETH',
    symbol: SaleAvailableAssetSymbols.ETH,
    icon: '/svg/assets/base.svg',
    coinId: GlobalChainId.base,
    decimals: 18,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Avalanche}-${SaleAvailableAssetSymbols.AVAX}`,
    networkName: SaleAvailableNetworks.Avalanche,
    address: ETH_ADDRESS,
    name: 'Avalanche',
    shortName: 'AVAX',
    symbol: SaleAvailableAssetSymbols.AVAX,
    icon: '/svg/assets/avax.svg',
    coinId: GlobalChainId.avax,
    decimals: 18,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Optimism}-${SaleAvailableAssetSymbols.ETH}`,
    networkName: SaleAvailableNetworks.Optimism,
    address: ETH_ADDRESS,
    name: 'Ethereum',
    shortName: 'ETH',
    symbol: SaleAvailableAssetSymbols.ETH,
    icon: '/svg/assets/opt.svg',
    coinId: GlobalChainId.opt,
    decimals: 18,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Linea}-${SaleAvailableAssetSymbols.ETH}`,
    networkName: SaleAvailableNetworks.Linea,
    address: ETH_ADDRESS,
    name: 'Ethereum',
    shortName: 'ETH',
    symbol: SaleAvailableAssetSymbols.ETH,
    icon: '/svg/assets/linea.svg',
    coinId: GlobalChainId.linea,
    decimals: 18,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Blast}-${SaleAvailableAssetSymbols.ETH}`,
    networkName: SaleAvailableNetworks.Blast,
    address: ETH_ADDRESS,
    name: 'Ethereum',
    shortName: 'ETH',
    symbol: SaleAvailableAssetSymbols.ETH,
    icon: '/svg/assets/blast.svg',
    coinId: GlobalChainId.blast,
    decimals: 18,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.ZkSync}-${SaleAvailableAssetSymbols.ETH}`,
    networkName: SaleAvailableNetworks.ZkSync,
    address: ETH_ADDRESS,
    name: 'Ethereum',
    shortName: 'ETH',
    symbol: SaleAvailableAssetSymbols.ETH,
    icon: '/svg/assets/zk.svg',
    coinId: GlobalChainId.zksync,
    decimals: 18,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Ethereum}-${SaleAvailableAssetSymbols.USDT}`,
    networkName: SaleAvailableNetworks.Ethereum,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    name: 'USDT',
    shortName: 'USDT',
    symbol: SaleAvailableAssetSymbols.USDT,
    icon: '/svg/assets/usdt.svg',
    decimals: 6,
    coinId: GlobalChainId.eth,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Ethereum}-${SaleAvailableAssetSymbols.USDC}`,
    networkName: SaleAvailableNetworks.Ethereum,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    name: 'USDC',
    shortName: 'USDC',
    symbol: SaleAvailableAssetSymbols.USDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
    coinId: GlobalChainId.eth,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Ethereum}-${SaleAvailableAssetSymbols.SHIB}`,
    networkName: SaleAvailableNetworks.Ethereum,
    address: SHIBAddress,
    name: 'SHIB',
    shortName: 'SHIB',
    symbol: SaleAvailableAssetSymbols.SHIB,
    icon: '/svg/assets/shib.svg',
    decimals: 18,
    coinId: GlobalChainId.eth,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Bsc}-${SaleAvailableAssetSymbols.USDT}`,
    networkName: SaleAvailableNetworks.Bsc,
    address: '0x55d398326f99059ff775485246999027b3197955',
    name: 'USDT',
    shortName: 'USDT',
    symbol: SaleAvailableAssetSymbols.USDT,
    icon: '/svg/assets/usdt.svg',
    decimals: 18,
    coinId: GlobalChainId.bnb,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Bsc}-${SaleAvailableAssetSymbols.USDC}`,
    networkName: SaleAvailableNetworks.Bsc,
    address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    name: 'USDC',
    shortName: 'USDC',
    symbol: SaleAvailableAssetSymbols.USDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 18,
    coinId: GlobalChainId.bnb,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Bsc}-${SaleAvailableAssetSymbols.FDUST}`,
    networkName: SaleAvailableNetworks.Bsc,
    address: '0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409',
    name: 'First Digital USD',
    shortName: 'FDUSD',
    symbol: SaleAvailableAssetSymbols.FDUST,
    icon: '/svg/assets/fdust.svg',
    decimals: 18,
    coinId: GlobalChainId.bnb,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Bsc}-${SaleAvailableAssetSymbols.PEG_ETH}`,
    networkName: SaleAvailableNetworks.Bsc,
    address: PegETHAddress,
    name: 'Pegged ETH',
    shortName: 'PegETH',
    symbol: SaleAvailableAssetSymbols.PEG_ETH,
    icon: '/svg/assets/eth.svg',
    decimals: 18,
    coinId: GlobalChainId.bnb,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Polygon}-${SaleAvailableAssetSymbols.USDT}`,
    networkName: SaleAvailableNetworks.Polygon,
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    name: 'USDT',
    shortName: 'USDT',
    symbol: SaleAvailableAssetSymbols.USDT,
    icon: '/svg/assets/usdt.svg',
    decimals: 6,
    coinId: GlobalChainId.polygon,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Polygon}-${SaleAvailableAssetSymbols.USDC}`,
    networkName: SaleAvailableNetworks.Polygon,
    address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    name: 'USDC',
    shortName: 'USDC',
    symbol: SaleAvailableAssetSymbols.USDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
    coinId: GlobalChainId.polygon,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Polygon}-${SaleAvailableAssetSymbols.BUSDC}`,
    networkName: SaleAvailableNetworks.Polygon,
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    name: 'Bridged USDC',
    shortName: 'USDC.e',
    symbol: SaleAvailableAssetSymbols.BUSDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
    coinId: GlobalChainId.polygon,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Arbitrum}-${SaleAvailableAssetSymbols.USDT}`,
    networkName: SaleAvailableNetworks.Arbitrum,
    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    name: 'USDT',
    shortName: 'USDT',
    symbol: SaleAvailableAssetSymbols.USDT,
    icon: '/svg/assets/usdt.svg',
    decimals: 6,
    coinId: GlobalChainId.arbi,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Arbitrum}-${SaleAvailableAssetSymbols.USDC}`,
    networkName: SaleAvailableNetworks.Arbitrum,
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    name: 'USDC',
    shortName: 'USDC',
    symbol: SaleAvailableAssetSymbols.USDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
    coinId: GlobalChainId.arbi,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Arbitrum}-${SaleAvailableAssetSymbols.BUSDC}`,
    networkName: SaleAvailableNetworks.Arbitrum,
    address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    name: 'Bridged USDC',
    shortName: 'USDC.e',
    symbol: SaleAvailableAssetSymbols.BUSDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
    coinId: GlobalChainId.arbi,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Base}-${SaleAvailableAssetSymbols.USDC}`,
    networkName: SaleAvailableNetworks.Base,
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    name: 'USDC',
    shortName: 'USDC',
    symbol: SaleAvailableAssetSymbols.USDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
    coinId: GlobalChainId.base,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Base}-${SaleAvailableAssetSymbols.DAI}`,
    networkName: SaleAvailableNetworks.Base,
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    name: 'DAI',
    shortName: 'DAI',
    symbol: SaleAvailableAssetSymbols.DAI,
    icon: '/svg/assets/dai.svg',
    decimals: 18,
    coinId: GlobalChainId.base,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Optimism}-${SaleAvailableAssetSymbols.USDT}`,
    networkName: SaleAvailableNetworks.Optimism,
    address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    name: 'USDT',
    shortName: 'USDT',
    symbol: SaleAvailableAssetSymbols.USDT,
    icon: '/svg/assets/usdt.svg',
    decimals: 6,
    coinId: GlobalChainId.opt,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Optimism}-${SaleAvailableAssetSymbols.USDC}`,
    networkName: SaleAvailableNetworks.Optimism,
    address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    name: 'USDC',
    shortName: 'USDC',
    symbol: SaleAvailableAssetSymbols.USDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
    coinId: GlobalChainId.opt,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Optimism}-${SaleAvailableAssetSymbols.BUSDC}`,
    networkName: SaleAvailableNetworks.Optimism,
    address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    name: 'Bridged USDC',
    shortName: 'USDC.e',
    symbol: SaleAvailableAssetSymbols.BUSDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
    coinId: GlobalChainId.opt,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Avalanche}-${SaleAvailableAssetSymbols.USDT}`,
    networkName: SaleAvailableNetworks.Avalanche,
    address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
    name: 'USDT',
    shortName: 'USDT',
    symbol: SaleAvailableAssetSymbols.USDT,
    icon: '/svg/assets/usdt.svg',
    decimals: 6,
    coinId: GlobalChainId.avax,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Avalanche}-${SaleAvailableAssetSymbols.USDC}`,
    networkName: SaleAvailableNetworks.Avalanche,
    address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    name: 'USDC',
    shortName: 'USDC',
    symbol: SaleAvailableAssetSymbols.USDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
    coinId: GlobalChainId.avax,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Avalanche}-${SaleAvailableAssetSymbols.BUSDC}`,
    networkName: SaleAvailableNetworks.Avalanche,
    address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
    name: 'Bridged USDC',
    shortName: 'USDC.e',
    symbol: SaleAvailableAssetSymbols.BUSDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
    coinId: GlobalChainId.avax,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Blast}-${SaleAvailableAssetSymbols.USDB}`,
    networkName: SaleAvailableNetworks.Blast,
    address: '0x4300000000000000000000000000000000000003',
    name: 'USDB',
    shortName: 'USDB',
    symbol: SaleAvailableAssetSymbols.USDB,
    icon: '/svg/assets/usdb.svg',
    decimals: 18,
    coinId: GlobalChainId.blast,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Linea}-${SaleAvailableAssetSymbols.USDT}`,
    networkName: SaleAvailableNetworks.Linea,
    address: '0xa219439258ca9da29e9cc4ce5596924745e12b93',
    name: 'USDT',
    shortName: 'USDT',
    symbol: SaleAvailableAssetSymbols.USDT,
    icon: '/svg/assets/usdt.svg',
    decimals: 6,
    coinId: GlobalChainId.linea,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Linea}-${SaleAvailableAssetSymbols.USDC}`,
    networkName: SaleAvailableNetworks.Linea,
    address: '0x176211869ca2b568f2a7d4ee941e073a821ee1ff',
    name: 'USDC',
    shortName: 'USDC',
    symbol: SaleAvailableAssetSymbols.USDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
    coinId: GlobalChainId.linea,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Linea}-${SaleAvailableAssetSymbols.DAI}`,
    networkName: SaleAvailableNetworks.Linea,
    address: '0x4af15ec2a0bd43db75dd04e62faa3b8ef36b00d5',
    name: 'DAI',
    shortName: 'DAI',
    symbol: SaleAvailableAssetSymbols.DAI,
    icon: '/svg/assets/dai.svg',
    decimals: 18,
    coinId: GlobalChainId.linea,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.ZkSync}-${SaleAvailableAssetSymbols.USDT}`,
    networkName: SaleAvailableNetworks.ZkSync,
    address: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
    name: 'USDT',
    shortName: 'USDT',
    symbol: SaleAvailableAssetSymbols.USDT,
    icon: '/svg/assets/usdt.svg',
    decimals: 6,
    coinId: GlobalChainId.zksync,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.ZkSync}-${SaleAvailableAssetSymbols.USDC}`,
    networkName: SaleAvailableNetworks.ZkSync,
    address: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
    name: 'USDC',
    shortName: 'USDC',
    symbol: SaleAvailableAssetSymbols.USDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
    coinId: GlobalChainId.zksync,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.ZkSync}-${SaleAvailableAssetSymbols.DAI}`,
    networkName: SaleAvailableNetworks.ZkSync,
    address: '0x4B9eb6c0b6ea15176BBF62841C6B2A8a398cb656',
    name: 'DAI',
    shortName: 'DAI',
    symbol: SaleAvailableAssetSymbols.DAI,
    icon: '/svg/assets/dai.svg',
    decimals: 18,
    coinId: GlobalChainId.zksync,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Bitcoin}-${SaleAvailableAssetSymbols.BTC}`,
    networkName: SaleAvailableNetworks.Bitcoin,
    name: 'Bitcoin',
    shortName: 'BTC',
    symbol: SaleAvailableAssetSymbols.BTC,
    nowPaymentsId: NowPaymentCoins.BTC,
    icon: '/svg/assets/btc.svg',
    coinId: NowPaymentCoins.BTC,
    blockchainType: blockchainType.OTHER,
  },
  {
    id: `${SaleAvailableNetworks.Tron}-${SaleAvailableAssetSymbols.TRX}`,
    networkName: SaleAvailableNetworks.Tron,
    name: 'Tron',
    shortName: 'TRX',
    symbol: SaleAvailableAssetSymbols.TRX,
    nowPaymentsId: NowPaymentCoins.TRX,
    icon: '/svg/assets/trx.svg',
    coinId: NowPaymentCoins.TRX,
    blockchainType: blockchainType.OTHER,
  },
  {
    id: `${SaleAvailableNetworks.Litecoin}-${SaleAvailableAssetSymbols.LTC}`,
    networkName: SaleAvailableNetworks.Litecoin,
    name: 'Litecoin',
    shortName: 'LTC',
    symbol: SaleAvailableAssetSymbols.LTC,
    nowPaymentsId: NowPaymentCoins.LTC,
    icon: '/svg/assets/ltc.svg',
    coinId: NowPaymentCoins.LTC,
    blockchainType: blockchainType.OTHER,
  },
  {
    id: `${SaleAvailableNetworks.Dogecoin}-${SaleAvailableAssetSymbols.DOGE}`,
    networkName: SaleAvailableNetworks.Dogecoin,
    name: 'Dogecoin',
    shortName: 'DOGE',
    symbol: SaleAvailableAssetSymbols.DOGE,
    nowPaymentsId: NowPaymentCoins.DOGE,
    icon: '/svg/assets/doge.svg',
    coinId: NowPaymentCoins.DOGE,
    blockchainType: blockchainType.OTHER,
  },
  {
    id: `${SaleAvailableNetworks.Ripple}-${SaleAvailableAssetSymbols.XRP}`,
    networkName: SaleAvailableNetworks.Ripple,
    name: 'XRP',
    shortName: 'XRP',
    symbol: SaleAvailableAssetSymbols.XRP,
    nowPaymentsId: NowPaymentCoins.XRP,
    icon: '/svg/assets/xrp.svg',
    coinId: NowPaymentCoins.XRP,
    blockchainType: blockchainType.OTHER,
  },
  {
    id: `${SaleAvailableNetworks.BitcoinCash}-${SaleAvailableAssetSymbols.BCH}`,
    networkName: SaleAvailableNetworks.BitcoinCash,
    name: 'Bitcoin Cash',
    shortName: 'BCH',
    symbol: SaleAvailableAssetSymbols.BCH,
    nowPaymentsId: NowPaymentCoins.BCH,
    icon: '/svg/assets/bch.svg',
    coinId: NowPaymentCoins.BCH,
    blockchainType: blockchainType.OTHER,
  },
  {
    id: `${SaleAvailableNetworks.Toncoin}-${SaleAvailableAssetSymbols.TON}`,
    networkName: SaleAvailableNetworks.Toncoin,
    name: 'Toncoin',
    shortName: 'TON',
    symbol: SaleAvailableAssetSymbols.TON,
    nowPaymentsId: NowPaymentCoins.TON,
    icon: '/svg/assets/ton.svg',
    coinId: NowPaymentCoins.TON,
    blockchainType: blockchainType.OTHER,
  },
  {
    id: `${SaleAvailableNetworks.Cardano}-${SaleAvailableAssetSymbols.ADA}`,
    networkName: SaleAvailableNetworks.Cardano,
    name: 'Cardano',
    shortName: 'ADA',
    symbol: SaleAvailableAssetSymbols.ADA,
    nowPaymentsId: NowPaymentCoins.ADA,
    icon: '/svg/assets/ada.svg',
    coinId: NowPaymentCoins.ADA,
    blockchainType: blockchainType.OTHER,
  },
  {
    id: `${SaleAvailableNetworks.Ethereum}-${SaleAvailableAssetSymbols.DAI}`,
    networkName: SaleAvailableNetworks.Ethereum,
    name: 'DAI',
    shortName: 'DAI',
    symbol: SaleAvailableAssetSymbols.DAI,
    nowPaymentsId: NowPaymentCoins.DAI,
    icon: '/svg/assets/dai.svg',
    coinId: GlobalChainId.eth,
    blockchainType: blockchainType.EVM,
  },
  {
    id: `${SaleAvailableNetworks.Solana}-${SaleAvailableAssetSymbols.SOL}`,
    networkName: SaleAvailableNetworks.Solana,
    address: '',
    name: 'SOL',
    shortName: 'SOL',
    symbol: SaleAvailableAssetSymbols.SOL,
    icon: '/svg/assets/sol.svg',
    coinId: GlobalChainId.solana,
    blockchainType: blockchainType.SOL,
  },
  {
    id: `${SaleAvailableNetworks.Solana}-${SaleAvailableAssetSymbols.USDT}`,
    networkName: SaleAvailableNetworks.Solana,
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    shortName: 'USDT',
    name: 'USDT',
    symbol: SaleAvailableAssetSymbols.USDT,
    icon: '/svg/assets/usdt.svg',
    decimals: 6,
    coinId: GlobalChainId.solana,
    blockchainType: blockchainType.SOL,
  },
  {
    id: `${SaleAvailableNetworks.Solana}-${SaleAvailableAssetSymbols.USDC}`,
    networkName: SaleAvailableNetworks.Solana,
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    shortName: 'USDC',
    name: 'USDC',
    symbol: SaleAvailableAssetSymbols.USDC,
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
    coinId: GlobalChainId.solana,
    blockchainType: blockchainType.SOL,
  },
  {
    id: `${SaleAvailableNetworks.Tron}-${SaleAvailableAssetSymbols.USDT}`,
    networkName: SaleAvailableNetworks.Tron,
    nowPaymentsId: NowPaymentCoins.USDT_TRX20,
    name: 'USDT TRC20',
    shortName: 'USDTTRC20',
    symbol: SaleAvailableAssetSymbols.USDT,
    icon: '/svg/assets/usdt.svg',
    coinId: NowPaymentCoins.TRX,
    blockchainType: blockchainType.OTHER,
  },
];
