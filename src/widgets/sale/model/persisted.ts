import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducer, { initialState } from './slice';

const whitelist = [
  'session_id',
  'lendingPasssed',
  'extenralRefferalWallet',
  'saleUrlParameters',
  'roundUsdSold',
  'inWaitlist',
  'ownRefferalCode',
  'wallets',
];

const version = 9;

const customMigration = (data: any): Promise<any> => {
  const newData = {
    ...data,
    ...(data?._persist?.version !== version ? initialState : {}),
  };

  return Promise.resolve(newData);
};

export const persistedTokenSaleReducer = persistReducer(
  {
    key: 'tokenSale',
    version: version,
    storage,
    whitelist,
    migrate: customMigration,
  },
  reducer,
);

export type SaleRecuders = typeof persistedTokenSaleReducer;
