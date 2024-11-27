import React, { FC, useEffect, useState } from 'react';

import { isNumericString } from '@/widgets/sale/utils/helpers';

interface Props {
  createdAt: string;
  expireAt: string;
  endCallback: (...args: any[]) => void;
}

interface ITime {
  minutes: number;
  seconds: number;
  percentage: number;
}

export const TextTimer: FC<Props> = ({ createdAt, expireAt, endCallback }) => {
  const calculateTimeLeft = (id?: any): ITime => {
    const createdTime = new Date(
      isNumericString(createdAt) ? Number(createdAt) : createdAt,
    ).getTime();
    const expiryTime = new Date(isNumericString(expireAt) ? Number(expireAt) : expireAt).getTime();
    const now = new Date().getTime();
    const totalDuration = expiryTime - createdTime;
    const timeElapsed = now - createdTime;
    const difference = expiryTime - now;

    let timeLeft: ITime = { minutes: 0, seconds: 0, percentage: 100 };

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        percentage: (timeElapsed / totalDuration) * 100,
      };
      return timeLeft;
    }

    endCallback();
    if (id) {
      clearInterval(id);
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<ITime>(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(interval));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const withZero = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <span className="text-[#B9C0D4] text-[14px] font-[600] leading-[100%]">
      {withZero(timeLeft.minutes)}m {withZero(timeLeft.seconds)}s
    </span>
  );
};
