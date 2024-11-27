import { Wallet } from '@/widgets';

export const isSameWallets = (a: Wallet | null, b: Wallet | null) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.address.toLowerCase() === b.address.toLowerCase() &&
    a.providerName.toLowerCase() === b.providerName.toLowerCase() &&
    a.chainId == b.chainId
  );
};

export const cutAddressByLength = (
  address: string | null | undefined,
  num1: number,
  num2: number,
): string =>
  address
    ? address.length < 13
      ? address
      : `${address.slice(0, num1)}...${address.slice(address.length - num2)}`
    : '';

export const lockBodyScroll = (active = false) => {
  if (active) {
    document.body.classList.add('lock');
  } else {
    document.body.classList.remove('lock');
  }
};

export const roundValue = (value: number, type?: string) => {
  if (type === 'price') {
    if (value === null || value === undefined) {
      return '0.00';
    }
    if (value < 0.00001) {
      return value.toFixed(5);
    }
    if (value >= 1) {
      return (value * 100) % 10 === 0 ? value.toFixed(1) : value.toFixed(2);
    }
    return value.toFixed(5);
  } else {
    if (!value) {
      return 0;
    }
    if ((value * 100) % 10 === 0) {
      return value?.toFixed(1);
    }
    return value?.toFixed(2);
  }
};

export const formatWithCommas = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

export const calculateTimeAgoFromBlockTimestamp = (blockTimestamp: number) => {
  const now = Math.floor(Date.now() / 1000);
  const diffInSeconds = now - blockTimestamp;

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / 86400);

  if (minutes < 60) {
    return `${minutes} min`;
  } else if (hours < 24) {
    return `${hours} h`;
  } else {
    return `${days} d`;
  }
};

export const formatDateToLocaleUS = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTimeToLocaleUS = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

export const isLastElement = (arr: any[], el: any) => {
  return el === arr.at(-1);
};

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};
