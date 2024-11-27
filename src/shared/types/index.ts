export interface SaleChain {
  name: string;
  displayName: string;
  icon: string | null;
  shortName: string;
  networkId: number;
  nativeSymbol: string;
}

export enum blockchainType {
  'EVM' = 'EVM',
  'SOL' = 'SOL',
  'OTHER' = 'OTHER',
}

export interface CryptoCurrency {
  id: string;
  name: string;
  shortName: string;
  symbol: string;
  icon: string;
  coinId: number;
  address?: string;
  decimals?: number;
  nowPaymentsId?: number;
  networkName?: string;
  blockchainType: blockchainType;
}
export enum NotificationType {
  TRANSACTION_IN_PROGRESS = 'transaction_in_progress',
  WRONG_NETWORK = 'wrong_network',
  TRANSACTION_FAILED = 'transaction_failed',
  GAS_PROBLEM = 'gas_problem',
  CONNECT_WALLET = 'connect_wallet',
}

export const NotificationContent = {
  [NotificationType.TRANSACTION_IN_PROGRESS]: {
    title: 'Transaction In Progress',
    text: 'Please wait a few moments for network confirmation',
  },
  [NotificationType.WRONG_NETWORK]: {
    title: 'Wrong Network!',
    text: 'Please switch the network in your wallet and try again',
  },
  [NotificationType.TRANSACTION_FAILED]: {
    title: 'Transaction Failed!',
    text: 'An error occurred during execution. Please try again',
  },
  [NotificationType.GAS_PROBLEM]: {
    title: 'Gas Problem!',
    text: 'An issue with gas occurred during the transaction',
  },
  [NotificationType.CONNECT_WALLET]: {
    title: 'Connect Wallet',
    text: "Using mobile? Open this page in your wallet's built-in browser for seamless access",
  },
};
