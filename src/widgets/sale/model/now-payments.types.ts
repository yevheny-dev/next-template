export interface ICurrencies {
  id: number;
  code: string;
  name: string;
  logoUrl: string;
}

export interface IPayment {
  id: string;
  wallet: string;
  referral: string;
  status: string;
  productId: number;
  productPrice: number;
  productAmount: number;
  priceCurrency: string;
  priceAmount: number;
  payAddress: string;
  payCurrency: string;
  payAmount: number;
  amountReceived: number;
  createdAt: string;
  expireAt: string;
  payinExtraId: string;
}

export interface IPaymentAmount {
  from: string;
  to: string;
  minAmount: number;
  amount: number;
}

export enum NowPaymentsStatuses {
  waiting = 'waiting',
  finished = 'finished',
  failed = 'failed',
}
