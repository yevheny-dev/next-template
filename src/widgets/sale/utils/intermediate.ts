import { Transaction } from '@solana/web3.js';

import { IntermidiatePageUrl, encodingSalt } from '@/shared';

import { createCipher } from './crypto';

export const openInNewWindow = (transaction: Transaction) => {
  const cipher = createCipher(encodingSalt);
  const data = encodeURIComponent(cipher(JSON.stringify(transaction.instructions[0])));
  const params = `?chain=-1&data=${data}`;
  return window.open(IntermidiatePageUrl + params, '_blank')?.focus();
};
