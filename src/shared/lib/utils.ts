import { Token } from '@/shared';

// export const getTokenSymbol = (token: Token) => {
//   return TokenSymbolsList[token];
// };

export const getTokenIcon = (token: Token) => {
  return `/svg/token-icons/${token.toLowerCase()}.svg`;
};

export const getChainIcon = (token: string) => {
  let tokenIcon = token;
  if (token.toLowerCase() == 'bsc') {
    tokenIcon = 'bnb';
  }
  return `/svg/assets/${tokenIcon.toLowerCase()}.svg`;
};

export const getRandomIntInclusive = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const EMAIL_REGEXP = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/i;
