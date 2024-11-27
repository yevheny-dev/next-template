import { clusterApiUrl,Connection, PublicKey } from '@solana/web3.js';

import { CollateralToken } from '@/widgets';
import SaleIDL from '@/widgets/sale/utils/idl/sale.json';

import { GlobalChainId, isDevelopment } from './common';

export enum SOLANA_CLUSTER {
  devnet = 'devnet',
  testnet = 'testnet',
  mainnetBeta = 'mainnet-beta',
}

export const SkipWallets: string[] = [];

export const SOLANA_DECIMAL = 9;
export const SOLANA_SYMBOl = 'SOL';
export const SOLANA_USDT_ADDRESS = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
export const SOLANA_USDC_ADDRESS = isDevelopment
  ? 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
  : 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const SOL_USDC_TOKEN_NAME = 'Solana:Usdc';
export const SOL_USDT_TOKEN_NAME = 'Solana:Usdt';

export const SOL_DIRECT_ADDRESS = 'sol address';

export const SolanaChain = {
  name: 'Solana',
  displayName: 'Solana',
  icon: '/svg/assets/sol.svg',
  shortName: SOLANA_SYMBOl,
  networkId: GlobalChainId.solana,
  nativeSymbol: SOLANA_SYMBOl,
};

export const SolanaCollateralChain: CollateralToken = {
  address: '',
  symbol: SOLANA_SYMBOl,
  name: 'Solana',
  icon: '/svg/assets/sol.svg',
  decimals: SOLANA_DECIMAL,
};

export const SolanaCollaterals: CollateralToken[] = [
  SolanaCollateralChain,
  {
    address: SOLANA_USDT_ADDRESS,
    symbol: 'USDT',
    name: 'USDT',
    icon: '/svg/assets/usdt.svg',
    decimals: 6,
  },
  {
    address: SOLANA_USDC_ADDRESS,
    symbol: 'USDC',
    name: 'USDC',
    icon: '/svg/assets/usdc.svg',
    decimals: 6,
  },
];

export const commitmentLevel = 'processed';
export const solanaEndpoint = isDevelopment
  ? clusterApiUrl(SOLANA_CLUSTER.devnet)
  : 'https://solana-rpc.publicnode.com';

export const connection = new Connection(solanaEndpoint, commitmentLevel);

export const saleProgramInterface = JSON.parse(JSON.stringify(SaleIDL));
export const saleProgramId = new PublicKey(saleProgramInterface.address);
export const referralMock = '';
export const treasuryInfo = new PublicKey('5rtu57yuSYYrqRe6VXJUAkZKU9RQpBiReuQ3CFKU2aCN'); //
export const priceInfo = new PublicKey('7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE');

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

export const SOLANA_SIGNER = new PublicKey('DfXfwqnkMMZHjdHJ2Ndhhty15n4okSXyKhrdYUKDNnUe');

export const SOLANA_PRECISION = 10 ** SOLANA_DECIMAL;
export const STABLES_PRECISION = 10 ** 6;
export const FIRST_SOL_ROUND_INDEX = 1;
export const SOL_MIN_GAS_AMOUNT = 0.06;
