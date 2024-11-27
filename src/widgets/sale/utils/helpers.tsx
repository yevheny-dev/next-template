import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { round } from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import React from 'react';

import {
  CollateralsByChain,
  ETH_ADDRESS,
  getRpc,
  GlobalChainId,
  MulticallAddressByChain,
  RpcsByChain,
  saleChains,
  scansServicesLink,
  SOL_USDC_TOKEN_NAME,
  SOL_USDT_TOKEN_NAME,
  SOLANA_USDC_ADDRESS,
  SOLANA_USDT_ADDRESS,
  SolanaCollaterals,
} from '@/shared';

import { MulticallAbi } from './abis/Multicall';
import {
  CollateralToken,
  MulticallParams,
  OpenNotificationParams,
  SaleParameters,
  SaleUtmData,
  Wallet,
} from '../model/types';

declare global {
  interface Window {
    ethereum?: any;
    evmProvider?: any;
    Buffer?: any;
    velarStore?: any;
  }
}

export const retryWrapper = async (
  call: (provider?: ethers.providers.StaticJsonRpcProvider) => Promise<any>,
  networkId?: number,
  amount = 3
): Promise<any> => {
  for (let i = 0; i < amount; i++) {
    let rpc;
    try {
      if (networkId) {
        rpc = getRpc(networkId);
        const provider = new ethers.providers.StaticJsonRpcProvider(
          rpc,
          networkId
        );
        const r = await call(provider);
        return r;
      } else {
        const r = await call();
        return r;
      }
    } catch (e) {
      if ((e as any)?.code === 4001) {
        throw e;
      }
      console.warn(`Retry service error: ${e?.toString()}, rpc: ${rpc}}`);
      throw e;
    }
  }

  throw new Error('Unhandled Error');
};

export const twoDigitNumber = (num: number): string | number =>
  `${num}`.length > 1 ? num : `0${num}`;

export const getUtmParametersFromSaleParameters = (
  params: SaleParameters | null
  // eslint-disable-next-line @typescript-eslint/ban-types
): SaleUtmData | {} => {
  if (!params) {
    return {};
  }

  const subset = ['utm_source', 'utm_medium', 'utm_campaign', 'twclid'];

  return subset.reduce((res, key) => {
    if (key in params) {
      res[key] = params[key];
    }
    return res;
  }, {} as any);
};

export const getSaleParametersFromLocation = (
  location: any
): SaleParameters | null => {
  const params = new URLSearchParams(location.search);

  if (!params.size) {
    return {};
  }

  const result: any = {};

  Array.from(params.entries()).forEach((el) => {
    result[el[0]] = el[1];
  });

  return result;
};

export const cutAddress = (address: string | null | undefined): string =>
  address
    ? address.length < 13
      ? address
      : `${address.slice(0, 6)}...${address.slice(address.length - 4)}`
    : '';

export const cutAddressSmall = (
  address: string | null | undefined,
  num1: number,
  num2: number
): string =>
  address
    ? address.length < 13
      ? address
      : `${address.slice(0, num1)}...${address.slice(address.length - num2)}`
    : '';

export const cutReferralAddress = (
  address: string | null | undefined
): string => (address ? `${address.slice(0, 13)}...${address.slice(-12)}` : '');

export const getAndVerifyProvider = async (
  force?: boolean
): Promise<
  | {
      provider: ethers.providers.Web3Provider;
      networkId: number;
      address: string;
    }
  | undefined
> => {
  try {
    let provider: any;
    const windowProvider = window.evmProvider || window.ethereum;
    if (windowProvider) {
      provider = new ethers.providers.Web3Provider(windowProvider);
    }

    if (!provider) return;

    if (force && window.evmProvider?.isMetaMask) {
      const unlocked = await window.evmProvider?._metamask?.isUnlocked();
      if (!unlocked) {
        await window.evmProvider.request({
          method: 'wallet_requestPermissions',
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
        await window.evmProvider.request({ method: 'eth_accounts' });
      }
    }

    const [network, address] = await retryWrapper(() =>
      Promise.all([provider.getNetwork(), provider.getSigner().getAddress()])
    );

    const networkId = Number(network.chainId);

    return { provider, networkId, address };
  } catch (e) {
    console.warn(`Getting Provider Issue: ${e}`);
    return;
  }
};

export const getChainFromProvider = async (): Promise<number | null> => {
  try {
    let provider: any;
    const windowProvider = window.evmProvider || window.ethereum;
    if (windowProvider) {
      provider = new ethers.providers.Web3Provider(windowProvider);
    }

    if (!provider) return null;

    const network = await provider.getNetwork();
    return Number(network.chainId);
  } catch (e) {
    console.warn(`Getting Provider Issue: ${e}`);
    return null;
  }
};

export const addChain = async (chain: number): Promise<void> => {
  try {
    const chainInfo = saleChains.find((el) => el.networkId === chain);
    const collateral = CollateralsByChain[chain][0];

    const info = {
      chainId: '0x' + chain.toString(16),
      blockExplorerUrls: [scansServicesLink[chain].replace('tx/', '')],
      chainName: chainInfo?.displayName,
      iconUrls: [collateral.icon],
      nativeCurrency: {
        decimals: 18,
        name: collateral?.name,
        symbol: collateral?.symbol,
      },
      rpcUrls: RpcsByChain[chain],
    };

    const windowProvider = window.evmProvider || window.ethereum;
    await windowProvider.request({
      method: 'wallet_addEthereumChain',
      params: [info],
    });
  } catch (e) {
    console.warn('add chain error', e);
  }
};

export const switchChain = async (
  chain: number,
  callback?: any
): Promise<void> => {
  try {
    const windowProvider = window.evmProvider || window.ethereum;
    await windowProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: '0x' + chain.toString(16),
        },
      ],
    });
    callback?.();
  } catch (e) {
    if ((e as any)?.code == 4902 || Math.abs((e as any)?.code) == 32603) {
      await addChain(chain);
    } else {
      console.warn('switch chain error', e);
    }
  }
};

export const convertToHex = (value: BigNumber): string =>
  `0x${value.decimalPlaces(0, BigNumber.ROUND_FLOOR).toString(16)}`;

export const getGasPrice = async (
  provider: ethers.providers.Web3Provider
): Promise<BigNumber> => {
  try {
    const result = await retryWrapper(() => provider.getGasPrice());
    // increasing gas by 60% by default

    return new BigNumber(result.toString()).multipliedBy(19).dividedBy(10);
  } catch (e) {
    console.warn(`Cannot get gas price ${e}`);
    return new BigNumber('10000000000'); // 10 GWEI
  }
};

export const estimateGas = async (
  body: ethers.utils.Deferrable<ethers.providers.TransactionRequest>,
  provider: ethers.providers.Web3Provider
): Promise<string | null> => {
  try {
    const result = await retryWrapper(() => provider.estimateGas(body));
    const gas = new BigNumber(result.toString());
    return convertToHex(gas);
  } catch (e) {
    console.warn(`Cannot estimate gas ${e}`);
    return null;
  }
};

export const getCollateral = (
  collateral: string,
  chain: number
): CollateralToken | null => {
  if (chain === -1 || chain === GlobalChainId.solana) {
    return getSolCollateral(collateral);
  }
  const ca = collateral.toLowerCase();
  return (
    CollateralsByChain[chain].find((cc) => cc.address.toLowerCase() === ca) ||
    null
  );
};

export const getDecimalsOfCollateral = (
  collateral: string,
  chain: number
): number => {
  const c = collateral.toLowerCase();
  if (c === ETH_ADDRESS.toLowerCase()) {
    return 18;
  }
  return (
    CollateralsByChain[chain].find((cc) => cc.address.toLowerCase() === c)
      ?.decimals || 18
  );
};

export const limitDecimals = (valueStr: string | null, d = 4): string => {
  if (valueStr === null || valueStr === undefined) return '';

  const decimalIndex = valueStr.indexOf('.');
  if (decimalIndex !== -1) {
    const decimalPart = valueStr.substring(decimalIndex + 1);
    if (decimalPart.length > d) {
      return (Math.floor(parseFloat(valueStr) * 10 ** d) / 10 ** d).toFixed(d);
    }
  }

  return valueStr;
};

export const limitDecimalsRound = (valueStr: string | null, d = 4): string => {
  if (valueStr === null || valueStr === undefined) return '';

  const decimalIndex = valueStr.indexOf('.');
  if (decimalIndex !== -1) {
    const decimalPart = valueStr.substring(decimalIndex + 1);
    if (decimalPart.length > d) {
      return (Math.round(parseFloat(valueStr) * 10 ** d) / 10 ** d).toFixed(d);
    }
  }

  return valueStr;
};

export const formatCryptoValue = (
  value: number | string | null,
  d = 4
): number => {
  if (!value) return 0;

  return Math.ceil(parseFloat(value.toString()) * 10 ** d) / 10 ** d;
};

export const handleMulticallLowLevel = async (
  provider: ethers.providers.JsonRpcProvider | undefined,
  networkId: number,
  calls: MulticallParams[]
): Promise<any[]> => {
  if (!provider) return [];

  const items: { target: string; callData: string }[] = calls.map((call) => {
    return {
      target: call.contract.address,
      callData: call.contract.interface.encodeFunctionData(
        call.function,
        call.params
      ),
    };
  });

  const multicall = new ethers.Contract(
    MulticallAddressByChain[networkId],
    MulticallAbi,
    provider
  );

  const tx = await multicall.populateTransaction.aggregate(items);
  const result = await provider.call(tx);
  const data = multicall.interface.decodeFunctionResult(
    'aggregate',
    result
  ).returnData;

  const results = data.map((el: string, index: number) => {
    const callData = calls[index];
    const res = callData.contract.interface.decodeFunctionResult(
      callData.function,
      el
    );
    return res.length > 1 ? res : res[0];
  });

  return results;
};

export const handleMulticallLowLevelWithInputs = async (
  provider: ethers.providers.JsonRpcProvider | undefined,
  networkId: number,
  calls: MulticallParams[]
): Promise<{ res: any; req: MulticallParams }[]> => {
  if (!provider) return [];

  const items: { target: string; callData: string }[] = calls.map((call) => {
    return {
      target: call.contract.address,
      callData: call.contract.interface.encodeFunctionData(
        call.function,
        call.params
      ),
    };
  });

  const multicall = new ethers.Contract(
    MulticallAddressByChain[networkId],
    MulticallAbi,
    provider
  );

  const tx = await multicall.populateTransaction.aggregate(items);
  const result = await provider.call(tx);
  const data = multicall.interface.decodeFunctionResult(
    'aggregate',
    result
  ).returnData;

  return data.map((el: string, index: number) => {
    const callData = calls[index];
    const res = callData.contract.interface.decodeFunctionResult(
      callData.function,
      el
    );
    return { res: res.length > 1 ? res : res[0], req: callData };
  });
};

export const isEnabledToken = (
  address: string,
  isPausedNative: boolean,
  isPausedErc: boolean
): boolean => {
  if (isPausedErc && isPausedNative) {
    return false;
  }

  if (isPausedErc) {
    return address === ETH_ADDRESS;
  }
  if (isPausedNative) {
    return address !== ETH_ADDRESS;
  }

  return true;
};

export const formatReward = (value: number, dot?: boolean): string => {
  return value === 0 ? '0' : numeral(value).format(dot ? '0,00.00' : '0,00');
};

export const chainName = (chainId: number): string =>
  saleChains.find((el) => el.networkId === chainId)?.displayName || '';

export const withDecimals = (
  num: number | undefined | null,
  decimals: number
): string => {
  if (!num) return '0';
  if (num.toString().includes('.')) {
    return num.toFixed(decimals);
  }
  return num.toString();
};

export function deepEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return a === b;
  if (Object.keys(a).length !== Object.keys(b).length) return false;

  for (const key of Object.keys(a)) {
    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

export function i16ToBytesLE(value: number): Uint8Array {
  const buffer = new ArrayBuffer(2); // Allocate 2 bytes for the i16 value
  const view = new DataView(buffer);
  view.setInt16(0, value, true); // Set the value in little-endian format
  return new Uint8Array(buffer);
}

export const getSolCollateral = (tokenName: string): CollateralToken | null => {
  if (tokenName === SOL_USDC_TOKEN_NAME || tokenName === SOLANA_USDC_ADDRESS) {
    return SolanaCollaterals.find((cc) => cc.symbol === 'USDC') || null;
  }
  if (tokenName === SOL_USDT_TOKEN_NAME || tokenName === SOLANA_USDT_ADDRESS) {
    return SolanaCollaterals.find((cc) => cc.symbol === 'USDT') || null;
  }

  return SolanaCollaterals.find((cc) => cc.symbol === 'SOL') || null;
};

export const getChainIcon = (chain: number): JSX.Element | null => {
  switch (chain) {
    case GlobalChainId.eth:
      return <img src='/svg/assets/eth.svg' alt='eth' />;
    case GlobalChainId.bnb:
      return <img src='/svg/assets/bnb.svg' alt='bnb' />;
    case GlobalChainId.polygon:
      return <img src='/svg/assets/pol.svg' alt='plg' />;
    case GlobalChainId.arbi:
      return <img src='/svg/assets/arb.svg' alt='arbi' />;
    case GlobalChainId.base:
      return <img src='/svg/assets/base.svg' alt='base' />;
    case GlobalChainId.opt:
      return <img src='/svg/assets/opt.svg' alt='opt' />;
    case GlobalChainId.avax:
      return <img src='/svg/assets/avax.svg' alt='avax' />;
    case GlobalChainId.sepolia:
      return <img src='/svg/assets/eth.svg' alt='eth' />;
    case GlobalChainId.solana:
    case -1:
      return <img src='/svg/assets/sol.svg' alt='sol' />;
    case GlobalChainId.blast:
      return <img src='/svg/assets/blast.svg' alt='blast' />;
    case GlobalChainId.linea:
      return <img src='/svg/assets/linea.svg' alt='linea' />;
    default:
      return null;
  }
};

export const getChain = (c: number) =>
  saleChains.find((item) => item.networkId === c);

export function getPercentageValue(
  percent: number,
  minValue: number,
  maxValue: number
) {
  if (percent < 0 || percent > 1) {
    throw new Error('Percent value should be between 0 and 1.');
  }
  return minValue + percent * (maxValue - minValue);
}

export const isNumericString = (str: string): boolean => {
  const regex = /^\d+$/;
  return regex.test(str);
};

export function getValueByPercent(
  percent: number,
  minValue: number,
  maxValue: number
) {
  if (percent < 0 || percent > 100) {
    throw new Error('Percent value should be between 0 and 100.');
  }
  const decimalPercent = percent / 100;
  return minValue + decimalPercent * (maxValue - minValue);
}

export const onlyNumbers = (value: string | number): string => {
  if (value === undefined || value === null) return '';
  return value
    .toString()
    .replace(/[^0-9.]/g, '')
    .replace(/(\..*?)\..*/g, '$1');
};

export function isInfinityOrFalsy(value: any): boolean {
  return value === Infinity || value === -Infinity || !value;
}

export const openNotification = (params: OpenNotificationParams): void => {
  console.log(params, 'tooltip log');
};

export const subScriptUnicodes: Record<string, string> = {
  '0': '\u2080',
  '1': '\u2081',
  '2': '\u2082',
  '3': '\u2083',
  '4': '\u2084',
  '5': '\u2085',
  '6': '\u2086',
  '7': '\u2087',
  '8': '\u2088',
  '9': '\u2089',
};

export const toSmallValue = (value: number | string): string => {
  let foundFirstNumber = false;

  const numberValue = typeof value === 'string' ? parseFloat(value) : value;

  return numberValue
    .toFixed(15)
    ?.split('')
    .reduce((acc, i, index, array) => {
      if (foundFirstNumber) return acc;
      if (Number(i) > 0) {
        foundFirstNumber = true;
        const nextNumber = Number(array[index + 1]);
        if (nextNumber) {
          return acc + i + nextNumber;
        }
      }
      return acc + i;
    });
};

export const toAmountFormat = (
  amount: number,
  options?: Intl.NumberFormatOptions & { withMaxNumberOfDigits?: boolean }
): string => {
  const maximumFractionDigits = options?.withMaxNumberOfDigits
    ? Math.abs((Math.floor(Math.log10(amount)) % 3) - 2)
    : options?.maximumFractionDigits;

  return new Intl.NumberFormat('en-US', {
    ...options,
    maximumFractionDigits,
  }).format(amount);
};

export const formatAmount = (
  amount: string | number,
  useLetter = false,
  maximumFractionDigits = 2,
  isProjectToken = false
): string => {
  try {
    const res = amount?.toString()?.split('.');
    if (!res) return '';
    const [integerAmount, fractionAmount] = res;
    const numAmount = parseFloat(amount?.toString());
    if (isProjectToken) {
      return round(+amount).toLocaleString();
    }
    if (numAmount > 1000000) {
      if (!useLetter) {
        return toAmountFormat(numAmount, { maximumFractionDigits });
      }
      const [, , , , , , ...mlnAmount] = integerAmount.split('').reverse();
      return `${mlnAmount.reverse().join('')}M`;
    }

    if (numAmount < 1000 && numAmount > 1) {
      return fractionAmount
        ? `${integerAmount}.${fractionAmount?.slice(0, 2)}`
        : integerAmount;
    } else if (numAmount < 0.01 && numAmount > 1e-12) {
      return toSmallValue(numAmount);
    } else if (Math.abs(numAmount) < 1e-12) {
      if (numAmount === 0) {
        return '0';
      }
      return '≈0.000000000000';
    } else {
      return toAmountFormat(numAmount, { maximumFractionDigits });
    }
  } catch (error) {
    return amount ? String(amount) : 'n/a';
  }
};

export const toValidNumber = (num: string | number): number => {
  if (typeof num === 'number') return num;

  return +num
    ?.replace('$', '') //
    ?.split(',')
    .join('')
    .replace('≈', '');
};

export const toBigNumber = (
  value: string | number,
  round?: boolean
): string => {
  return value.toString().includes('e+')
    ? value.toString()
    : value.toString().includes('e-')
    ? '0'
    : numeral(value)
        .format(
          round || Number(value) < 1000000000 ? '0a' : '0.00a',
          Math.floor
        )
        .toUpperCase();
};

export const toDollar = (
  num: number | string | undefined,
  currency?: any,
  smallValue?: boolean,
  bigValue?: boolean,
  notRoundAfterThs?: boolean,
  trickySmallValue?: boolean
): string => {
  if (num === undefined) return '';

  if (typeof num === 'string') {
    num = toValidNumber(num);
  }

  const currencySymbol = currency || '$';
  if (
    num &&
    (num?.toString()?.includes('e-') || num?.toString()?.includes('.')) &&
    trickySmallValue
  ) {
    if (!num?.toString()?.includes('e-')) {
      const numberArray = num?.toString()?.split('.');
      const decimalsArray = numberArray?.[1]?.split('');
      const firstValueIndex = decimalsArray?.findIndex((item) => +item > 0);
      const lastIndex =
        +decimalsArray?.[firstValueIndex + 2] > 0
          ? firstValueIndex + 2
          : +decimalsArray?.[firstValueIndex + 1] > 0
          ? firstValueIndex + 1
          : firstValueIndex;
      return `${currencySymbol} ${numberArray[0]}.${decimalsArray
        ?.slice(0, lastIndex + 1)
        .join('')}`;
    } else {
      const numberArray = num?.toString()?.split('e-');
      const zeroesNumber =
        Number(numberArray[1]) > 2
          ? (Number(numberArray[1]) - 1)
              .toString()
              ?.split('')
              ?.map((item) => subScriptUnicodes[item])
              ?.join('')
          : '';
      return `${currencySymbol} 0.0${zeroesNumber}${numberArray[0]
        .replace('.', '')
        .slice(0, 2)}`;
    }
  }

  const digitsAfterComma = num?.toString()?.includes('e-')
    ? Number(num?.toString()?.split('e-')?.[1]) + 1
    : String(Math.abs(num % 1)).length - 2;

  const isSmallValue = num > -0.01 && num < 0.01 && smallValue;

  const minimumFractionDigits: number =
    isSmallValue && digitsAfterComma > 0
      ? Math.min(digitsAfterComma, 12)
      : !notRoundAfterThs && num >= 1000
      ? 0
      : 2;

  // To avoid distortion due to rounding
  const smallestAmount = 5 * 10 ** -(minimumFractionDigits + 1);

  const approx = num <= smallestAmount && num > -smallestAmount && num !== 0;

  const amount = `${num}`;
  return `${approx ? '≈' : ''}${currencySymbol} ${
    bigValue ? toBigNumber(amount) : formatAmount(amount, false)
  }`;
  // }
};

export const isSameWallets = (a: Wallet | null, b: Wallet | null) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.address.toLowerCase() === b.address.toLowerCase() &&
    a.providerName.toLowerCase() === b.providerName.toLowerCase() &&
    a.chainId == b.chainId
  );
};

export const formatDate = (
  date: Date,
  locale?: string
): { formattedDate: string; formattedTime: string } => {
  const formattedDate = date.toLocaleDateString(locale || 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString(locale || 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return { formattedDate, formattedTime };
};

export const timeAgo = (timestamp: number) => {
  const momentTime = moment(timestamp);
  const now = moment();

  const minutesDiff = now.diff(momentTime, 'minutes');
  const hoursDiff = now.diff(momentTime, 'hours');

  if (hoursDiff < 1) {
    return `${minutesDiff} min`;
  } else {
    return `${hoursDiff} h`;
  }
};

export function hexStringToUint8Array(hexString: string) {
  const normalizedHexString = hexString.startsWith('0x')
    ? hexString.slice(2)
    : hexString;

  if (normalizedHexString.length !== 128) {
    throw new Error(
      'Invalid signature length. Expected 128 hex characters (64 bytes).'
    );
  }

  const uint8Array = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    uint8Array[i] = parseInt(normalizedHexString.slice(i * 2, i * 2 + 2), 16);
  }

  return uint8Array;
}

export const getTransactionLink = (chainId: number, txHash: string) => {
  if (chainId === -1) {
    return `https://explorer.solana.com/tx/${txHash}`;
  }

  const scanService = scansServicesLink[chainId];

  if (scanService) {
    return `${scanService}${txHash}`;
  }
};
