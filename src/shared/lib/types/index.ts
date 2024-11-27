export type Token =
  | 'wormhole'
  | 'gmt'
  | 'nosana'
  | 'star atlas'
  | 'blockasset'
  | 'bonk'
  | 'render'
  | 'drift token'
  | 'metaplex'
  | 'beercoin'
  | 'io'
  | 'wrapped solana'
  | 'solanex'
  | 'ethereum'
  | 'eth'
  | 'solana'
  | 'pyth network';

export type FetchTokensListResponse = {
  id: string;
  name: Token;
  symbol: string;
};

export interface CoinCapData extends FetchTokensListResponse {
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
}

export interface User {
  id: string;
  tokensSold: number;
  blockTimestamp: string;
  purchaser: string;
  txLink: string;
}
